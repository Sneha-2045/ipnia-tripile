const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { Payment } = require("../models/Payment");
const {
  createCashfreeOrder,
  getCashfreeOrder,
  getCashfreeOrderPayments,
  verifyWebhookSignature,
  mapCashfreeOrderStatus,
} = require("../services/cashfreeService");

/** Production public API host — Cashfree notify_url must be HTTPS (never localhost). */
const PRODUCTION_API_PUBLIC_URL = "https://ipnia-tripile.onrender.com";

function generateIpniaOrderId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = uuidv4().split("-")[0].toUpperCase();
  return `IPNIA_${stamp}_${rand}`;
}

function isLocalhostUrl(url) {
  return /localhost|127\.0\.0\.1|\[::1\]/i.test(String(url || ""));
}

/**
 * Resolve public API base for Cashfree notify_url / absolute links.
 * In production, never allow http://localhost fallbacks (Render PORT is often 10000).
 */
function resolveApiPublicUrl(req) {
  const isProd = (process.env.NODE_ENV || "development") === "production";
  let base = String(process.env.API_PUBLIC_URL || "")
    .trim()
    .replace(/\/$/, "");

  if (base && isLocalhostUrl(base) && isProd) {
    console.warn(
      "[payments] API_PUBLIC_URL is localhost in production; using",
      PRODUCTION_API_PUBLIC_URL
    );
    base = "";
  }

  if (!base && isProd) {
    // Prefer the incoming Host header on Render when available
    const host = req?.get?.("host");
    if (host && !isLocalhostUrl(host)) {
      base = `https://${host}`;
    } else {
      base = PRODUCTION_API_PUBLIC_URL;
    }
  }

  if (!base) {
    base = `http://localhost:${process.env.PORT || 5000}`;
  }

  // Cashfree rejects non-HTTPS notify_url
  if (isProd && base.startsWith("http://")) {
    base = base.replace(/^http:\/\//i, "https://");
  }

  return base.replace(/\/$/, "");
}

function publicPaymentView(payment) {
  return {
    orderId: payment.ipniaOrderId,
    cashfreeOrderId: payment.cashfreeOrderId || null,
    amount: payment.amount,
    currency: payment.currency,
    paymentStatus: payment.paymentStatus,
    paymentMethod: payment.paymentMethod || null,
    customer: {
      name: payment.customer.name,
      email: payment.customer.email,
      phone: payment.customer.phone,
    },
    webhookReceived: payment.webhookReceived,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
}

/**
 * POST /api/payments/create-order
 *
 * Payable amount is resolved server-side only:
 * - Flight: live Duffel offer total (INR)
 * - Hotel-only (no flight): fixed booking deposit from HOTEL_BOOKING_DEPOSIT_INR
 * Client-supplied `amount` / `hotelAmount` are never trusted for charging.
 */
async function createOrder(req, res, next) {
  try {
    const { currency, customer, flightOfferId, hotelPlaceId } = req.body;

    let amount = 0;
    let sourceAmountFromBooking = false;
    let amountKind = null;

    if (flightOfferId) {
      const { getOfferById, DuffelApiError } = require("../services/duffelService");
      const { mapDuffelOfferToFlight } = require("../services/mapDuffelOffer");
      try {
        const rawOffer = await getOfferById(flightOfferId);
        const mapped = mapDuffelOfferToFlight(rawOffer);
        const flightTotal = Math.round(Number(mapped?.totalAmount || 0));
        if (!Number.isFinite(flightTotal) || flightTotal < 1) {
          return res.status(400).json({
            success: false,
            message: "Unable to determine payable flight amount from the selected offer.",
          });
        }
        amount += flightTotal;
        sourceAmountFromBooking = true;
        amountKind = "flight_offer";
      } catch (err) {
        if (err instanceof DuffelApiError) {
          return res.status(err.status || 502).json({
            success: false,
            message: err.message || "Unable to verify flight offer price.",
            code: err.code,
          });
        }
        throw err;
      }
    } else if (hotelPlaceId) {
      const deposit = Math.round(Number(process.env.HOTEL_BOOKING_DEPOSIT_INR || 2999));
      if (!Number.isFinite(deposit) || deposit < 1) {
        return res.status(500).json({
          success: false,
          message: "Hotel booking deposit is not configured.",
        });
      }
      amount = deposit;
      sourceAmountFromBooking = true;
      amountKind = "hotel_deposit";
    }

    if (!Number.isFinite(amount) || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Payable amount could not be calculated from the booking.",
      });
    }
    if (amount > 500000) {
      return res.status(400).json({
        success: false,
        message: "Payable amount exceeds allowed maximum.",
      });
    }

    const ipniaOrderId = generateIpniaOrderId();
    const isDev = (process.env.NODE_ENV || "development") !== "production";
    const frontendUrl = isDev
      ? process.env.FRONTEND_DEV_URL || "http://localhost:8080"
      : process.env.FRONTEND_URL || "https://ipnia.com";
    const apiPublicUrl = resolveApiPublicUrl(req);

    const returnUrl = `${frontendUrl}/booking/payment-status?order_id=${ipniaOrderId}`;
    const notifyUrl = `${apiPublicUrl}/api/payments/webhook`;

    if (!/^https:\/\//i.test(notifyUrl) && !isDev) {
      return res.status(500).json({
        success: false,
        message:
          "Payment webhook URL must be HTTPS in production. Set API_PUBLIC_URL to your Render HTTPS URL.",
      });
    }

    console.info("[payments] create-order", {
      notify_url: notifyUrl,
      amount,
      amountKind,
      flightOfferId: flightOfferId || null,
      hotelPlaceId: hotelPlaceId || null,
      sourceAmountFromBooking,
    });

    const payment = await Payment.create({
      ipniaOrderId,
      customer,
      amount,
      currency,
      paymentStatus: "PENDING",
      bookingId: flightOfferId || hotelPlaceId || null,
      sourceAmountFromBooking,
      webhookReceived: false,
    });

    let cashfreeOrder;
    try {
      cashfreeOrder = await createCashfreeOrder({
        orderId: ipniaOrderId,
        amount,
        currency,
        customer,
        returnUrl,
        notifyUrl,
      });
    } catch (err) {
      payment.paymentStatus = "FAILED";
      payment.lastError = err.message;
      await payment.save();
      throw err;
    }

    const paymentSessionId =
      cashfreeOrder.payment_session_id || cashfreeOrder.paymentSessionId;
    const cashfreeOrderId = cashfreeOrder.order_id || ipniaOrderId;

    payment.cashfreeOrderId = cashfreeOrderId;
    payment.paymentSessionId = paymentSessionId || "";
    payment.cashfreeRaw = {
      createOrder: {
        order_id: cashfreeOrder.order_id,
        order_status: cashfreeOrder.order_status,
        payment_session_id: paymentSessionId ? "[REDACTED_IN_LOGS]" : null,
      },
    };
    await payment.save();

    if (!paymentSessionId) {
      return res.status(502).json({
        success: false,
        message: "Cashfree did not return a payment_session_id",
      });
    }

    return res.status(201).json({
      success: true,
      orderId: payment.ipniaOrderId,
      paymentSessionId,
      amount: payment.amount,
      currency: payment.currency,
      paymentStatus: payment.paymentStatus,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/payments/webhook
 * Idempotent Cashfree webhook handler.
 */
async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody =
      typeof req.rawBody === "string"
        ? req.rawBody
        : Buffer.isBuffer(req.rawBody)
          ? req.rawBody.toString("utf8")
          : JSON.stringify(req.body || {});

    const valid = verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
    });

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const payload = req.body || {};
    const data = payload.data || {};
    const order = data.order || {};
    const paymentObj = data.payment || {};

    const cashfreeOrderId = order.order_id || payload.order_id;
    const ipniaOrderId = cashfreeOrderId; // we send IPNIA id as Cashfree order_id
    const cashfreePaymentId =
      paymentObj.cf_payment_id ||
      paymentObj.payment_id ||
      data.cf_payment_id ||
      null;

    const eventType =
      payload.type || payload.event || paymentObj.payment_status || "UNKNOWN";
    const eventId =
      payload.event_id ||
      payload.eventId ||
      `${cashfreeOrderId || "na"}_${cashfreePaymentId || "na"}_${eventType}_${timestamp || Date.now()}`;

    const payloadHash = crypto
      .createHash("sha256")
      .update(rawBody)
      .digest("hex");

    const payment = await Payment.findOne({
      $or: [
        { ipniaOrderId },
        { cashfreeOrderId },
        ...(cashfreeOrderId ? [{ ipniaOrderId: cashfreeOrderId }] : []),
      ],
    });

    if (!payment) {
      // Acknowledge to avoid endless retries for unknown orders
      return res.status(200).json({
        success: true,
        message: "Webhook received but no matching payment found",
      });
    }

    // Idempotency: skip if this exact event was already processed
    if (payment.processedWebhookIds.includes(eventId)) {
      return res.status(200).json({
        success: true,
        message: "Webhook already processed",
        orderId: payment.ipniaOrderId,
        paymentStatus: payment.paymentStatus,
      });
    }

    const mappedStatus = mapCashfreeOrderStatus(
      order.order_status,
      paymentObj.payment_status
    );

    // Do not downgrade SUCCESS once achieved
    if (payment.paymentStatus !== "SUCCESS") {
      payment.paymentStatus = mappedStatus;
    }

    if (cashfreePaymentId) {
      payment.cashfreePaymentId = String(cashfreePaymentId);
    }
    if (paymentObj.payment_group || paymentObj.payment_method) {
      payment.paymentMethod = String(
        paymentObj.payment_group || paymentObj.payment_method
      );
    }

    payment.webhookReceived = true;
    payment.processedWebhookIds.push(eventId);
    // Keep array bounded
    if (payment.processedWebhookIds.length > 50) {
      payment.processedWebhookIds = payment.processedWebhookIds.slice(-50);
    }
    payment.webhookEvents.push({
      eventId,
      eventType: String(eventType),
      receivedAt: new Date(),
      payloadHash,
    });
    if (payment.webhookEvents.length > 20) {
      payment.webhookEvents = payment.webhookEvents.slice(-20);
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
      orderId: payment.ipniaOrderId,
      paymentStatus: payment.paymentStatus,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/payments/:orderId/status
 * Prefer DB status; optionally refresh from Cashfree for PENDING orders.
 */
async function getPaymentStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    let payment = await Payment.findOne({
      $or: [{ ipniaOrderId: orderId }, { cashfreeOrderId: orderId }],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Refresh from Cashfree when still pending (backend verification — never trust frontend)
    if (payment.paymentStatus === "PENDING" || payment.paymentStatus === "UNKNOWN") {
      try {
        const cfOrder = await getCashfreeOrder(payment.ipniaOrderId);
        let paymentStatusHint = null;
        try {
          const payments = await getCashfreeOrderPayments(payment.ipniaOrderId);
          if (Array.isArray(payments) && payments.length > 0) {
            const latest = payments[0];
            paymentStatusHint = latest.payment_status;
            if (latest.cf_payment_id) {
              payment.cashfreePaymentId = String(latest.cf_payment_id);
            }
            if (latest.payment_group) {
              payment.paymentMethod = String(latest.payment_group);
            }
          }
        } catch {
          // payments endpoint may be empty before attempt
        }

        const mapped = mapCashfreeOrderStatus(
          cfOrder.order_status,
          paymentStatusHint
        );

        if (payment.paymentStatus !== "SUCCESS") {
          payment.paymentStatus = mapped;
        }
        payment.cashfreeOrderId = cfOrder.order_id || payment.cashfreeOrderId;
        await payment.save();
      } catch (err) {
        // Return DB status if Cashfree refresh fails
        console.error("[status] Cashfree refresh failed:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      payment: publicPaymentView(payment),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createOrder,
  handleWebhook,
  getPaymentStatus,
};

const crypto = require("crypto");
const { getCashfreeConfig } = require("../config/cashfree");

function cashfreeHeaders() {
  const cfg = getCashfreeConfig();
  return {
    "Content-Type": "application/json",
    "x-client-id": cfg.clientId,
    "x-client-secret": cfg.clientSecret,
    "x-api-version": cfg.apiVersion,
  };
}

async function cashfreeRequest(path, options = {}) {
  const cfg = getCashfreeConfig();
  const url = `${cfg.baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...cashfreeHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      data?.raw ||
      `Cashfree request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.cashfree = data;
    throw error;
  }

  return data;
}

/**
 * Create a Cashfree PG order.
 * Docs: POST /pg/orders
 */
async function createCashfreeOrder({
  orderId,
  amount,
  currency,
  customer,
  returnUrl,
  notifyUrl,
}) {
  const payload = {
    order_id: orderId,
    order_amount: Number(amount),
    order_currency: currency || "INR",
    customer_details: {
      customer_id: `cust_${customer.phone}`.replace(/\W+/g, "_").slice(0, 50),
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
    },
  };

  return cashfreeRequest("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch order details from Cashfree.
 * Docs: GET /pg/orders/{order_id}
 */
async function getCashfreeOrder(orderId) {
  return cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
  });
}

/**
 * Fetch payments for an order.
 * Docs: GET /pg/orders/{order_id}/payments
 */
async function getCashfreeOrderPayments(orderId) {
  return cashfreeRequest(`/orders/${encodeURIComponent(orderId)}/payments`, {
    method: "GET",
  });
}

/**
 * Verify Cashfree webhook signature.
 * Signed payload = timestamp + rawBody
 * Signature header: x-webhook-signature
 * Timestamp header: x-webhook-timestamp
 */
function verifyWebhookSignature({ rawBody, signature, timestamp }) {
  const cfg = getCashfreeConfig();

  if (!signature || !timestamp || !rawBody) {
    return false;
  }

  const signedPayload = `${timestamp}${rawBody}`;
  const expected = crypto
    .createHmac("sha256", cfg.webhookSecret)
    .update(signedPayload)
    .digest("base64");

  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function mapCashfreeOrderStatus(orderStatus, paymentStatus) {
  const order = String(orderStatus || "").toUpperCase();
  const pay = String(paymentStatus || "").toUpperCase();

  if (["PAID", "SUCCESS", "COMPLETED"].includes(order) || pay === "SUCCESS") {
    return "SUCCESS";
  }
  if (["ACTIVE", "PENDING", "NOT_ATTEMPTED"].includes(order) || ["PENDING", "NOT_ATTEMPTED"].includes(pay)) {
    return "PENDING";
  }
  if (["EXPIRED", "TERMINATED", "CANCELLED"].includes(order) || pay === "USER_DROPPED") {
    return "USER_DROPPED";
  }
  if (["FAILED", "PAYMENT_FAILED"].includes(order) || pay === "FAILED") {
    return "FAILED";
  }
  return "UNKNOWN";
}

module.exports = {
  createCashfreeOrder,
  getCashfreeOrder,
  getCashfreeOrderPayments,
  verifyWebhookSignature,
  mapCashfreeOrderStatus,
};

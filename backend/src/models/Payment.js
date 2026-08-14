const mongoose = require("mongoose");

const PAYMENT_STATUSES = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "USER_DROPPED",
  "UNKNOWN",
];

const paymentSchema = new mongoose.Schema(
  {
    ipniaOrderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    cashfreeOrderId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    cashfreePaymentId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      phone: { type: String, required: true, trim: true },
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "PENDING",
      index: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: "",
    },
    paymentSessionId: {
      type: String,
      trim: true,
      default: "",
    },
    /**
     * Optional future booking reference.
     * When flight/hotel booking APIs are added, set bookingId and sourceAmountFromBooking=true
     * so amount is taken from the booking record instead of the frontend payload.
     */
    bookingId: {
      type: String,
      trim: true,
      default: null,
      index: true,
      sparse: true,
    },
    sourceAmountFromBooking: {
      type: Boolean,
      default: false,
    },
    webhookReceived: {
      type: Boolean,
      default: false,
    },
    webhookEvents: [
      {
        eventId: String,
        eventType: String,
        receivedAt: { type: Date, default: Date.now },
        payloadHash: String,
      },
    ],
    processedWebhookIds: {
      type: [String],
      default: [],
    },
    cashfreeRaw: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ "customer.email": 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = {
  Payment,
  PAYMENT_STATUSES,
};

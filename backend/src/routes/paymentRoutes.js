const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createOrder,
  handleWebhook,
  getPaymentStatus,
} = require("../controllers/paymentController");
const { validateCreatePayment } = require("../middleware/validatePayment");

const router = express.Router();

const createOrderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many payment requests. Please try again shortly.",
  },
});

router.post("/create-order", createOrderLimiter, validateCreatePayment, createOrder);
router.post("/webhook", handleWebhook);
router.get("/:orderId/status", getPaymentStatus);

module.exports = router;

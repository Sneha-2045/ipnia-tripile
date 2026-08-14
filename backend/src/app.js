const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const paymentRoutes = require("./routes/paymentRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());

  const allowedOrigins = [
    process.env.FRONTEND_URL || "https://ipnia.com",
    process.env.FRONTEND_DEV_URL || "http://localhost:5173",
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (webhooks, curl) with no Origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      credentials: true,
    })
  );

  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // Capture raw body for Cashfree webhook signature verification
  app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf.toString("utf8");
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "IPNIA Payment API",
    });
  });

  // Future modules can mount here without touching payments:
  // app.use("/api/flights", flightRoutes);
  // app.use("/api/hotels", hotelRoutes);
  // app.use("/api/bookings", bookingRoutes);
  app.use("/api/payments", paymentRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};

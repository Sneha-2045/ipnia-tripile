const express = require("express");
const rateLimit = require("express-rate-limit");
const { validateFlightSearch } = require("../middleware/validateFlightSearch");
const { searchFlights } = require("../controllers/flightController");

const router = express.Router();

const flightSearchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many flight searches. Please wait a moment and try again.",
  },
});

router.post("/search", flightSearchLimiter, validateFlightSearch, searchFlights);

module.exports = router;

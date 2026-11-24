const express = require("express");
const rateLimit = require("express-rate-limit");
const { validateFlightSearch } = require("../middleware/validateFlightSearch");
const { searchFlights, streamFlights, getFlightDeals } = require("../controllers/flightController");

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
router.post("/search/stream", flightSearchLimiter, validateFlightSearch, streamFlights);
router.get("/deals", rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false }), getFlightDeals);

module.exports = router;

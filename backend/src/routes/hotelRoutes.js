const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  searchHotels,
  hotelPhoto,
  autocompleteDestinations,
} = require("../controllers/hotelController");

const router = express.Router();

const hotelSearchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many hotel searches. Please wait a moment and try again.",
  },
});

router.post("/search", hotelSearchLimiter, searchHotels);
router.get("/photo", hotelPhoto);
router.get("/autocomplete", hotelSearchLimiter, autocompleteDestinations);

module.exports = router;

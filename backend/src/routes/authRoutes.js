const express = require("express");
const rateLimit = require("express-rate-limit");
const { signup, login, me } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validateAuth");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again shortly.",
  },
});

router.post("/signup", authLimiter, validateSignup, signup);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", requireAuth, me);

module.exports = router;

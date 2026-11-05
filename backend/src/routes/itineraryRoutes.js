const express = require("express");
const rateLimit = require("express-rate-limit");
const { requireAuth } = require("../middleware/requireAuth");
const { generate, refine, save, list } = require("../controllers/itineraryController");

const router = express.Router();
const plannerLimiter = rateLimit({ windowMs: 60 * 1000, limit: 12, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Planner is busy. Please try again shortly." } });
router.post("/generate", plannerLimiter, generate);
router.post("/refine", plannerLimiter, refine);
router.post("/", requireAuth, save);
router.get("/", requireAuth, list);
module.exports = router;

const { verifyAuthToken } = require("../services/authToken");
const { User } = require("../models/User");

function requireAuth(req, res, next) {
  try {
    const header = String(req.headers.authorization || "");
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const payload = verifyAuthToken(match[1].trim());
    const userId = payload?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.auth = {
      userId: String(userId),
      email: payload.email || null,
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please sign in again.",
    });
  }
}

module.exports = {
  requireAuth,
  async requireRecruiter(req, res, next) {
    try {
      const header = String(req.headers.authorization || "");
      const match = header.match(/^Bearer\s+(.+)$/i);
      if (!match) return res.status(401).json({ success: false, message: "Authentication required." });
      const payload = verifyAuthToken(match[1].trim());
      const user = await User.findById(payload?.sub).select("+role");
      if (!user || !["recruiter", "admin"].includes(user.role)) return res.status(403).json({ success: false, message: "Recruiter access required." });
      req.auth = { userId: String(user._id), email: user.email, role: user.role };
      return next();
    } catch {
      return res.status(401).json({ success: false, message: "Session expired. Please sign in again." });
    }
  },
};

const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = String(process.env.JWT_SECRET || "").trim();
  if (secret) return secret;
  if ((process.env.NODE_ENV || "development") !== "production") {
    return "ipnia-dev-jwt-secret-change-me";
  }
  throw new Error("JWT_SECRET is missing. Set it in the backend environment.");
}

function signAuthToken(user) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn }
  );
}

function verifyAuthToken(token) {
  return jwt.verify(String(token || ""), getJwtSecret());
}

module.exports = {
  getJwtSecret,
  signAuthToken,
  verifyAuthToken,
};

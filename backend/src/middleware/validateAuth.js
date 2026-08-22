function validateSignup(req, res, next) {
  const errors = [];
  const { email, password, fullName, phone } = req.body || {};

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.push("A valid email is required");
  }

  const name = String(fullName || "").trim();
  if (name.length < 2) {
    errors.push("fullName is required");
  }

  const pwd = String(password || "");
  if (pwd.length < 8) {
    errors.push("password must be at least 8 characters");
  }

  let normalizedPhone = "";
  if (phone != null && String(phone).trim()) {
    normalizedPhone = String(phone).replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      errors.push("phone must be a valid 10-digit Indian mobile number");
    }
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.email = normalizedEmail;
  req.body.fullName = name;
  req.body.password = pwd;
  req.body.phone = normalizedPhone;
  req.body.source = String(req.body.source || "email_password").trim() || "email_password";
  return next();
}

function validateLogin(req, res, next) {
  const errors = [];
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email is required");
  }
  if (!password) {
    errors.push("password is required");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.email = email;
  req.body.password = password;
  return next();
}

module.exports = {
  validateSignup,
  validateLogin,
};

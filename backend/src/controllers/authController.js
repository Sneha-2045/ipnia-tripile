const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const { signAuthToken } = require("../services/authToken");

const SALT_ROUNDS = 12;

function publicAuthResponse(user, token) {
  return {
    success: true,
    token,
    user: user.toPublicJSON(),
  };
}

async function signup(req, res, next) {
  try {
    const { email, password, fullName, phone, source } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      passwordHash,
      fullName,
      phone: phone || "",
      source: source || "email_password",
      lastSignInAt: new Date(),
    });

    const token = signAuthToken(user);
    return res.status(201).json(publicAuthResponse(user, token));
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastSignInAt = new Date();
    await user.save();

    const token = signAuthToken(user);
    return res.status(200).json(publicAuthResponse(user, token));
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please sign in again.",
      });
    }
    return res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  signup,
  login,
  me,
};

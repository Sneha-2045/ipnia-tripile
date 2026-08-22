const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      trim: true,
      default: "email_password",
    },
    lastSignInAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    email: this.email,
    fullName: this.fullName,
    phone: this.phone || "",
    source: this.source || "email_password",
    lastSignInAt: this.lastSignInAt || null,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};

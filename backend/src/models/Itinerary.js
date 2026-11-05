const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  trip: { type: mongoose.Schema.Types.Mixed, required: true },
  plan: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = { Itinerary: mongoose.model("Itinerary", itinerarySchema) };

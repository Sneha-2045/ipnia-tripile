const mongoose = require("mongoose");

let isConnected = false;

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (isConnected) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("[mongo] Connected to MongoDB Atlas");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[mongo] Connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("[mongo] Disconnected from MongoDB");
  });

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

async function disconnectDatabase() {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  console.log("[mongo] Connection closed");
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};

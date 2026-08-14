require("dotenv").config();

const { createApp } = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Copy .env.example to .env and configure it.");
    }

    await connectDatabase(process.env.MONGODB_URI);

    // Validate Cashfree config early (throws if missing)
    require("./config/cashfree").getCashfreeConfig();

    const app = createApp();
    const server = app.listen(PORT, () => {
      console.log(`[server] IPNIA Payment API listening on port ${PORT}`);
      console.log(`[server] Health: http://localhost:${PORT}/health`);
      console.log(`[server] Cashfree env: ${process.env.CASHFREE_ENV || "sandbox"}`);
    });

    const shutdown = async (signal) => {
      console.log(`[server] ${signal} received. Shutting down...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("[server] Failed to start:", err.message);
    process.exit(1);
  }
}

start();

import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://ipnia.com','https://www.ipnia.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post("/api/create-razorpay-order", async (req, res) => {
  console.log("✅ Received request on /api/create-razorpay-order");
  console.log("📝 Request body:", req.body);

  const { amount } = req.body;
  
  if (!amount) {
    console.error("❌ Amount is required");
    return res.status(400).json({ error: "Amount is required" });
  }
  
  console.log("🧾 Amount received from frontend:", amount);

  try {
    const order = await razorpay.orders.create({
      amount: parseInt(amount), // ensure amount is an integer
      currency: "INR",
      payment_capture: 1
    });

    console.log("✅ Razorpay order created successfully:", order);

    res.json(order);
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Razorpay backend is running" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Razorpay backend running on port ${PORT}`)); 
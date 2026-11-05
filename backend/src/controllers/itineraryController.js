const { Itinerary } = require("../models/Itinerary");

function validTrip(trip) {
  if (!trip || typeof trip !== "object") return "Trip details are required.";
  const dep = new Date(`${trip.departure}T00:00:00Z`);
  const ret = new Date(`${trip.returning}T00:00:00Z`);
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (!trip.from || (!trip.choose && !trip.destination)) return "Starting city and destination are required.";
  if (Number.isNaN(dep.getTime()) || Number.isNaN(ret.getTime()) || dep < today || ret <= dep) return "Choose valid future travel dates.";
  if ((ret - dep) / 86400000 > 13) return "For now, itinerary planning supports trips of up to 14 days.";
  if (!Number.isFinite(Number(trip.budget)) || Number(trip.budget) <= 0 || Number(trip.budget) > 1000000000) return "Enter a valid total trip budget.";
  if (!/^(INR|USD|GBP|EUR|AED|SGD)$/.test(String(trip.currency || ""))) return "Choose a supported currency.";
  if (!Number.isInteger(Number(trip.adults)) || Number(trip.adults) < 1 || Number(trip.adults) > 20 || !Number.isInteger(Number(trip.children)) || Number(trip.children) < 0 || Number(trip.children) > 20 || !Number.isInteger(Number(trip.rooms)) || Number(trip.rooms) < 1 || Number(trip.rooms) > 20) return "Check traveller and room counts.";
  if (String(trip.from).length > 100 || String(trip.destination || "").length > 120 || String(trip.food || "").length > 200) return "Some trip details are too long.";
  return null;
}

async function askGemini(prompt, trip) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw Object.assign(new Error("AI travel planning is not configured yet. Please contact IPNIA support."), { status: 503 });
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.45, responseMimeType: "application/json", maxOutputTokens: 5000 } }),
    signal: AbortSignal.timeout(35000),
  });
  if (!response.ok) {
    const providerError = await response.json().catch(() => ({}));
    const providerMessage = String(providerError?.error?.message || "").slice(0, 500);
    const providerStatus = Number(response.status);
    // Keep credentials and request payloads out of logs; provider error details help diagnose
    // invalid keys, disabled APIs, request configuration, and quota failures.
    console.error("[itinerary] Gemini request failed", {
      status: providerStatus,
      code: providerError?.error?.status || null,
      message: providerMessage,
    });
    if (providerStatus === 401 || providerStatus === 403) {
      throw Object.assign(new Error("Gemini rejected the server API key or its permissions. Check GEMINI_API_KEY and Generative Language API access in the backend environment."), { status: 503 });
    }
    if (providerStatus === 429) {
      throw Object.assign(new Error("Gemini API quota or rate limit reached. Check the Google AI Studio quota and billing for this API key."), { status: 503 });
    }
    if (providerStatus === 400) {
      throw Object.assign(new Error(`Gemini rejected the planner request: ${providerMessage || "invalid request"}`), { status: 502 });
    }
    throw Object.assign(new Error("Gemini is temporarily unavailable. Check the IPNIA API logs for the provider status."), { status: 502 });
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("");
  if (!text) throw Object.assign(new Error("The travel planner returned an incomplete plan. Please try again."), { status: 502 });
  try {
    const plan = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
    const categories = ["Flights", "Accommodation", "Local transport", "Food", "Sightseeing", "Activities", "Miscellaneous"];
    if (!plan || typeof plan.destination !== "string" || typeof plan.intro !== "string" || !Array.isArray(plan.days) || !plan.days.length || plan.days.length > 14 || !Array.isArray(plan.hotels) || !Array.isArray(plan.restaurants) || typeof plan.transport !== "string" || !Array.isArray(plan.tips)) throw new Error("invalid plan");
    if (plan.days.some((day) => !Number.isInteger(day.day) || typeof day.title !== "string" || !Array.isArray(day.activities) || !Number.isFinite(day.estimate) || day.estimate < 0)) throw new Error("invalid day");
    if (!categories.every((key) => Number.isFinite(plan.breakdown?.[key]) && plan.breakdown[key] >= 0)) throw new Error("invalid budget");
    const total = categories.reduce((sum, key) => sum + plan.breakdown[key], 0);
    const target = Number(trip.budget);
    if (total <= 0) throw new Error("invalid budget total");
    let assigned = 0;
    categories.forEach((key, index) => {
      const amount = index === categories.length - 1 ? target - assigned : Math.floor(target * plan.breakdown[key] / total);
      plan.breakdown[key] = Math.max(0, amount);
      assigned += plan.breakdown[key];
    });
    plan.days = plan.days.map(({ day, title, activities, route, estimate }) => ({ day, title: title.slice(0, 120), activities: activities.slice(0, 8).map((x) => String(x).slice(0, 240)), route: String(route || "").slice(0, 240), estimate }));
    plan.hotels = plan.hotels.slice(0, 6).map((x) => String(x).slice(0, 180));
    plan.restaurants = plan.restaurants.slice(0, 8).map((x) => String(x).slice(0, 180));
    plan.tips = plan.tips.slice(0, 10).map((x) => String(x).slice(0, 240));
    plan.transport = plan.transport.slice(0, 400);
    return plan;
  }
  catch { throw Object.assign(new Error("The travel planner returned an unreadable plan. Please try again."), { status: 502 }); }
}

function planPrompt(trip, refinement = "") {
  return `You are IPNIA's travel consultant. Create a practical, personalised itinerary as strict JSON with keys: destination (string), intro (string), days (array of {day:number,title:string,activities:string[],route:string,estimate:number}), hotels (string[]), restaurants (string[]), transport (string describing practical local transport), tips (string[] checklist items), breakdown (object with exactly these categories: Flights, Accommodation, Local transport, Food, Sightseeing, Activities, Miscellaneous; each value is a nonnegative number in the user's currency).\nTrip: ${JSON.stringify(trip)}\n${refinement ? `User's requested change: ${refinement}\nExisting plan: ${JSON.stringify(trip.plan)}` : ""}\nUse ${trip.choose ? "the preferences and budget to select one fitting destination" : `the requested destination ${trip.destination}`}. Make one day per travel day (at most 14 days). Include approximate travel time and a practical mode between major stops in each day’s route field. Be honest: estimates are approximate, never claim live prices, availability, confirmed opening hours, or bookings. Keep recommendations recognizable and plausible; flag facts the traveller should verify as tips. Allocate the stated budget sensibly; all amounts must sum to approximately that budget and fit the currency. Do not include markdown. Return JSON only.`;
}

async function generate(req, res) {
  const issue = validTrip(req.body);
  if (issue) return res.status(400).json({ success: false, message: issue });
  try { const plan = await askGemini(planPrompt(req.body), req.body); return res.json({ success: true, plan }); }
  catch (err) { return res.status(err.status || 502).json({ success: false, message: err.message || "Unable to create an itinerary." }); }
}

async function refine(req, res) {
  const { trip, plan, request } = req.body || {};
  const issue = validTrip(trip);
  if (issue) return res.status(400).json({ success: false, message: issue });
  if (!plan || typeof plan !== "object" || typeof request !== "string" || !request.trim() || request.length > 500) return res.status(400).json({ success: false, message: "Enter a short itinerary change." });
  try { const updated = await askGemini(planPrompt({ ...trip, plan }, request.trim()), trip); return res.json({ success: true, plan: updated, reply: "I’ve updated your itinerary around that request. Review the revised days and estimates." }); }
  catch (err) { return res.status(err.status || 502).json({ success: false, message: err.message || "Unable to refine the itinerary." }); }
}

async function save(req, res, next) {
  try {
  const { trip, plan } = req.body || {};
  const issue = validTrip(trip);
  if (issue) return res.status(400).json({ success: false, message: issue });
  if (!plan || typeof plan !== "object") return res.status(400).json({ success: false, message: "A completed itinerary is required." });
  const itinerary = await Itinerary.create({ userId: req.auth.userId, trip, plan });
  return res.status(201).json({ success: true, itinerary: { id: String(itinerary._id), trip, plan, createdAt: itinerary.createdAt } });
  } catch (err) { return next(err); }
}

async function list(req, res, next) {
  try {
  const items = await Itinerary.find({ userId: req.auth.userId }).sort({ createdAt: -1 }).limit(50).lean();
  return res.json({ success: true, itineraries: items.map(({ _id, trip, plan, createdAt }) => ({ id: String(_id), trip, plan, createdAt })) });
  } catch (err) { return next(err); }
}

module.exports = { generate, refine, save, list };

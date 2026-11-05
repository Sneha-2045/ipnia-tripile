import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Compass, Download, Heart, Hotel, MapPin, MessageCircle, Plane, Plus, Save, Sparkles, Wallet } from "lucide-react";
import { BookingNav } from "@/components/layout/BookingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthToken } from "@/lib/authApi";
import { getApiBase } from "@/lib/apiBase";
import { airports } from "@/data/airports";
import "./plan-journey.css";

type Trip = { from: string; destination: string; choose: boolean; departure: string; returning: string; adults: number; children: number; rooms: number; travelType: string; tripStyle: string; interests: string[]; tier: string; transport: string; hotel: string; food: string; budget: string; currency: string };
type PlanDay = { day: number; title: string; activities: string[]; route?: string; estimate: number };
type Plan = { destination: string; intro: string; days: PlanDay[]; hotels: string[]; restaurants: string[]; transport?: string; tips: string[]; breakdown: Record<string, number> };
const initial: Trip = { from: "", destination: "", choose: false, departure: "", returning: "", adults: 2, children: 0, rooms: 1, travelType: "Domestic", tripStyle: "Family", interests: ["Sightseeing"], tier: "Standard", transport: "Flight", hotel: "4 star", food: "No preference", budget: "", currency: "INR" };
const options = {
  style: ["Family", "Honeymoon", "Solo", "Friends", "Business", "Pilgrimage"],
  interests: ["Adventure", "Beaches", "Mountains", "Shopping", "Sightseeing", "Culture", "Relaxation"],
  tier: ["Budget", "Standard", "Premium", "Luxury"],
};
const stepNames = ["Your trip", "Your style", "Your budget", "Your plan"];
const airportCode = (city: string) => airports.find(a => a.code.toLowerCase() === city.trim().toLowerCase() || a.city.toLowerCase() === city.trim().toLowerCase())?.code || "";
function plannerError(message: string, status?: number) {
  if (status === 404 || /route not found.*\/api\/itineraries/i.test(message)) {
    return "The IPNIA travel planner service hasn’t been deployed to the API yet. Please try again after the server update.";
  }
  return message;
}

export default function PlanJourney() {
  const [trip, setTrip] = useState<Trip>(initial);
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const nights = useMemo(() => Math.max(1, Math.ceil((new Date(trip.returning).getTime() - new Date(trip.departure).getTime()) / 86400000) || 3), [trip.departure, trip.returning]);
  const update = <K extends keyof Trip>(key: K, value: Trip[K]) => setTrip((old) => ({ ...old, [key]: value }));
  const toggle = (key: "interests", value: string) => update(key, trip.interests.includes(value) ? trip.interests.filter((x) => x !== value) : [...trip.interests, value]);
  const dateSpan = trip.departure && trip.returning ? (new Date(`${trip.returning}T00:00:00`).getTime() - new Date(`${trip.departure}T00:00:00`).getTime()) / 86400000 : 0;
  const validDates = trip.departure && trip.returning && trip.returning > trip.departure && dateSpan <= 13;

  async function generate(event?: FormEvent) {
    event?.preventDefault(); setError(""); setLoading(true);
    const payload = { ...trip, nights };
    try {
      const res = await fetch(`${getApiBase()}/api/itineraries/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(plannerError(data.message || "Planner is temporarily unavailable.", res.status));
      setPlan(data.plan); setStep(3); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) { setError(e instanceof Error ? plannerError(e.message) : "Unable to generate your plan."); }
    finally { setLoading(false); }
  }

  async function savePlan() {
    const token = getAuthToken();
    if (!token || !plan) { setError("Sign in to save this itinerary to your IPNIA account."); return; }
    const res = await fetch(`${getApiBase()}/api/itineraries`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ trip, plan }) });
    const data = await res.json(); if (!res.ok) { setError(plannerError(data.message || "Unable to save itinerary.", res.status)); return; } setSaved(true);
  }

  async function askPlanner(event: FormEvent) {
    event.preventDefault(); if (!chat.trim() || !plan) return; setChatReply("Thinking through your update…");
    try { const res = await fetch(`${getApiBase()}/api/itineraries/refine`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trip, plan, request: chat }) }); const data = await res.json(); if (!res.ok) throw new Error(plannerError(data.message || "Try again in a moment.", res.status)); setPlan(data.plan); setChatReply(data.reply || "Your itinerary has been updated."); setChat(""); }
    catch (e) { setChatReply(e instanceof Error ? plannerError(e.message) : "Unable to update your plan."); }
  }

  const fromCode = airportCode(trip.from), toCode = airportCode(plan?.destination || trip.destination);
  const searchFlights = fromCode && toCode ? `/flights/search?from=${fromCode}&to=${toCode}&departure=${trip.departure}&return=${trip.returning}&travellers=${trip.adults + trip.children}&adults=${trip.adults}&children=${trip.children}&cabin=economy&tripType=roundtrip` : "/flights/search";
  const searchHotels = `/hotels/search?destination=${encodeURIComponent(plan?.destination || trip.destination)}&checkIn=${trip.departure}&checkOut=${trip.returning}&guests=${trip.adults + trip.children}&rooms=${trip.rooms}`;
  const total = Object.values(plan?.breakdown || {}).reduce((a, b) => a + b, 0);
  const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: trip.currency, maximumFractionDigits: 0 }).format(n);

  return <div className="min-h-screen bg-[#f4f7fb] text-[#18324b]"><BookingNav />
    <main className="planner-page">
      <header className="planner-hero"><div className="planner-hero-image" /><div className="planner-hero-content"><Link to="/" className="planner-back"><ArrowLeft size={16}/> Back to IPNIA</Link><div className="planner-kicker"><Sparkles size={15}/> YOUR PERSONAL TRAVEL CONSULTANT</div><h1>Plan a journey<br/><em>worth remembering.</em></h1><p>Tell us what matters to you. We’ll bring the details together into a thoughtful, day-by-day travel plan.</p><div className="planner-trust"><span><Check/> Made around you</span><span><Check/> No booking without you</span><span><Check/> Clear budget estimates</span></div></div></header>
      <section className="planner-shell">
        <div className="planner-progress"><div><span className="planner-step-count">{step === 3 ? "YOUR ITINERARY" : `STEP 0${step + 1} / 03`}</span><span className="planner-step-label">{stepNames[step]}</span></div><div className="planner-progress-track">{[0,1,2].map((i)=><span key={i} className={i <= step ? "active" : ""}/>)}</div></div>
        {error && <div className="planner-error" role="alert">{error}{!user&&error.startsWith("Sign in")&&<> <Link to="/login" className="font-semibold underline">Sign in</Link></>}</div>}
        {step < 3 && <form onSubmit={(e)=>{e.preventDefault(); if(step===2) void generate(); else setStep(step+1);}} className="planner-form">
          {step === 0 && <div className="planner-step"><div className="planner-section-heading"><span className="planner-icon"><Compass/></span><div><h2>Start with the essentials</h2><p>Where would you like your next story to begin?</p></div></div>
            <label className="planner-check"><input type="checkbox" checked={trip.choose} onChange={(e)=>update("choose",e.target.checked)}/><span className="check-box">{trip.choose&&<Check size={14}/>}</span><span><b>Help me choose a destination</b><small>We’ll suggest places that match your style and budget.</small></span></label>
            <div className="planner-grid two"><Field label="Starting city"><Input list="planner-airports" required value={trip.from} onChange={e=>update("from",e.target.value)} placeholder="e.g. Mumbai" /></Field>{!trip.choose&&<Field label="Destination"><Input list="planner-airports" required value={trip.destination} onChange={e=>update("destination",e.target.value)} placeholder="City or country" /></Field>}<datalist id="planner-airports">{airports.map(a=><option key={a.code} value={a.city}>{a.country}</option>)}</datalist></div>
            <div className="planner-grid two"><Field label="Departure"><Input type="date" min={new Date().toISOString().slice(0,10)} value={trip.departure} onChange={e=>update("departure",e.target.value)} required/></Field><Field label="Return"><Input type="date" min={trip.departure || new Date().toISOString().slice(0,10)} value={trip.returning} onChange={e=>update("returning",e.target.value)} required/></Field></div>{trip.departure&&trip.returning&&!validDates&&<p className="planner-error inline">Choose a return date after departure within 14 days.</p>}
            <div className="planner-grid four"><Stepper label="Adults" value={trip.adults} onChange={v=>update("adults",v)} min={1}/><Stepper label="Children" value={trip.children} onChange={v=>update("children",v)} min={0}/><Stepper label="Rooms" value={trip.rooms} onChange={v=>update("rooms",v)} min={1}/><Field label="Travel"><select value={trip.travelType} onChange={e=>update("travelType",e.target.value)}><option>Domestic</option><option>International</option></select></Field></div>
          </div>}
          {step === 1 && <div className="planner-step"><div className="planner-section-heading"><span className="planner-icon"><Heart/></span><div><h2>Make it your kind of trip</h2><p>The little preferences make all the difference.</p></div></div><Field label="Who’s travelling?"><div className="planner-pills">{options.style.map(x=><Pill key={x} active={trip.tripStyle===x} onClick={()=>update("tripStyle",x)}>{x}</Pill>)}</div></Field><Field label="What are you in the mood for?"><div className="planner-pills">{options.interests.map(x=><Pill key={x} active={trip.interests.includes(x)} onClick={()=>toggle("interests",x)}>{x}</Pill>)}</div></Field><Field label="Travel style"><div className="planner-pills">{options.tier.map(x=><Pill key={x} active={trip.tier===x} onClick={()=>update("tier",x)}>{x}</Pill>)}</div></Field><div className="planner-grid two"><Field label="Preferred transport"><select value={trip.transport} onChange={e=>update("transport",e.target.value)}>{["Flight","Train","Road","Flexible"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Hotel category"><select value={trip.hotel} onChange={e=>update("hotel",e.target.value)}>{["Any","Budget","3 star","4 star","5 star","Boutique"].map(x=><option key={x}>{x}</option>)}</select></Field></div><Field label="Food preferences"><Input value={trip.food} onChange={e=>update("food",e.target.value)} placeholder="Vegetarian, halal, local cuisine…"/></Field></div>}
          {step === 2 && <div className="planner-step"><div className="planner-section-heading"><span className="planner-icon"><Wallet/></span><div><h2>Set your comfort zone</h2><p>We’ll shape a realistic plan around the budget you share.</p></div></div><div className="planner-budget-card"><div className="planner-budget-title">Total trip budget <span>for {trip.adults+trip.children} travellers · {nights} nights</span></div><div className="planner-budget-entry"><select aria-label="Currency" value={trip.currency} onChange={e=>update("currency",e.target.value)}>{["INR","USD","GBP","EUR","AED","SGD"].map(x=><option key={x}>{x}</option>)}</select><Input type="number" min="1" value={trip.budget} onChange={e=>update("budget",e.target.value)} placeholder="Enter your total budget" required/></div><div className="planner-budget-note"><Sparkles size={15}/> We’ll balance transport, stays, food, experiences and the little extras.</div></div><div className="planner-budget-preview"><b>We’ll plan for</b><span><Plane/> Transport</span><span><Hotel/> Stay</span><span><MapPin/> Experiences</span><span><Wallet/> Daily costs</span></div></div>}
          <div className="planner-actions">{step>0&&<Button type="button" variant="ghost" onClick={()=>setStep(step-1)} className="planner-previous"><ChevronLeft/> Back</Button>}<Button type="submit" disabled={loading || (step===0&&!validDates)} className="planner-next">{loading?"Creating your plan…":step===2?"Build my trip":"Continue"}<ArrowRight/></Button></div>
        </form>}
        {step === 3 && plan && <div className="planner-results"><div className="result-intro"><div className="planner-kicker"><Sparkles size={15}/> YOUR JOURNEY, THOUGHTFULLY PLANNED</div><h2>{plan.destination}<span>{trip.departure} — {trip.returning} · {trip.adults+trip.children} travellers</span></h2><p>{plan.intro}</p><div className="result-actions"><Button onClick={()=>window.print()} className="outline-action"><Download/> Download PDF</Button><Button onClick={savePlan} className="outline-action"><Save/> {saved?"Saved to your trips":"Save itinerary"}</Button><button onClick={()=>setStep(2)} className="edit-link">Edit trip details</button></div></div>
          <div className="planner-summary"><div className="summary-total"><span>ESTIMATED TRIP BUDGET</span><strong>{money(total)}</strong><small>Planning estimate · prices and availability change</small></div><div className="budget-breakdown">{Object.entries(plan.breakdown).map(([name,value])=><div key={name}><span>{name}</span><b>{money(value)}</b><i><span style={{width:`${total?Math.min(100,value/total*100):0}%`}}/></i></div>)}</div></div>
          <div className="result-columns"><section className="itinerary-card"><div className="result-heading"><div><span className="planner-kicker">THE FLOW OF YOUR TRIP</span><h3>Your day-by-day itinerary</h3></div><span className="day-count">{plan.days.length} DAYS</span></div><div className="timeline">{plan.days.map((day)=><article className="timeline-day" key={day.day}><div className="day-marker">{String(day.day).padStart(2,"0")}</div><div className="day-content"><span className="day-caption">DAY {day.day}</span><h4>{day.title}</h4><ul>{day.activities.map(x=><li key={x}>{x}</li>)}</ul>{day.route&&<p className="day-transit"><Plane/>{day.route}</p>}{day.activities.length>1&&<a className="day-route" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/${day.activities.map(encodeURIComponent).join("/")}`}><MapPin/> View route between stops <ArrowRight/></a>}<span className="day-cost">Daily estimate · {money(day.estimate)}</span></div></article>)}</div></section>
            <aside className="planner-aside"><section className="aside-card"><span className="planner-kicker">STAY WELL</span><h3>Places to stay</h3>{plan.hotels.map(h=><div className="suggestion" key={h}><Hotel/><span>{h}<small>Suggested · confirm current rates and availability</small></span></div>)}<Button asChild className="planner-book"><Link to={searchHotels}>Explore available hotels <ArrowRight/></Link></Button></section>{plan.transport&&<section className="aside-card"><span className="planner-kicker">GETTING AROUND</span><h3>Local transport</h3><p className="tip">{plan.transport}</p></section>}<section className="aside-card"><span className="planner-kicker">A TASTE OF THE PLACE</span><h3>Food & local finds</h3>{plan.restaurants.map(r=><div className="suggestion food" key={r}><MapPin/><span>{r}</span></div>)}</section><section className="aside-card"><span className="planner-kicker">BEFORE YOU GO</span><h3>Good to know</h3>{plan.tips.map(t=><p className="tip" key={t}><Check/>{t}</p>)}</section></aside></div>
          <section className="map-card"><div><span className="planner-kicker">GET YOUR BEARINGS</span><h3>Explore the area</h3><p>Map preview for {plan.destination}. Check distances and route conditions locally before you set off.</p></div><iframe title={`Map of ${plan.destination}`} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(plan.destination)}&output=embed`} /><a href={`https://www.google.com/maps/search/${encodeURIComponent(plan.destination)}`} target="_blank" rel="noreferrer">Open interactive map <ArrowRight/></a></section>
          <section className="booking-strip"><div><span className="planner-kicker">WHEN YOU’RE READY</span><h3>Review real travel options</h3><p>Search live inventory and prices. Nothing is booked until you confirm each step.</p></div><div className="booking-buttons"><Button asChild className="planner-book"><Link to={searchFlights}><Plane/> Find flights <ArrowRight/></Link></Button><Button asChild className="planner-book secondary"><Link to={searchHotels}><Hotel/> Find hotels <ArrowRight/></Link></Button></div></section>
          <section className="assistant-card"><div className="assistant-icon"><MessageCircle/></div><div className="assistant-copy"><span className="planner-kicker">YOUR TRAVEL CONSULTANT</span><h3>Want to adjust anything?</h3><p>Ask for a slower pace, a new stop, or a different balance. Your plan updates around you.</p>{chatReply&&<div className="assistant-reply">{chatReply}</div>}<form onSubmit={askPlanner} className="assistant-input"><Input value={chat} onChange={e=>setChat(e.target.value)} placeholder="e.g. Add a relaxed morning and more local food"/><Button type="submit" disabled={!chat.trim()}><ArrowRight/></Button></form></div></section>
          <div className="planner-footer-actions"><button onClick={()=>{setStep(0);setPlan(null);}}><Plus/> Plan another trip</button>{user&&<span>Saved trips are linked to your IPNIA account.</span>}</div>
        </div>}
      </section>
    </main><SiteFooter/>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="planner-field"><span>{label}</span>{children}</label>; }
function Pill({active,onClick,children}:{active:boolean;onClick:()=>void;children:React.ReactNode}) { return <button type="button" onClick={onClick} className={`planner-pill ${active?"selected":""}`}>{active&&<Check size={13} />}{children}</button>; }
function Stepper({label,value,onChange,min}:{label:string;value:number;onChange:(v:number)=>void;min:number}) { return <div className="planner-field"><span>{label}</span><div className="planner-stepper"><button type="button" aria-label={`Remove ${label}`} onClick={()=>onChange(Math.max(min,value-1))}>−</button><b>{value}</b><button type="button" aria-label={`Add ${label}`} onClick={()=>onChange(value+1)}>+</button></div></div>; }

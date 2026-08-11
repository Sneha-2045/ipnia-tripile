import { useParams } from "react-router-dom";

const courseNames: Record<string, string> = {
  "ai-course": "AI Course",
  "ml-course": "ML Course",
  "global-course": "Global Industry Exposure",
};

function ThankYou() {
  const { course } = useParams<{ course?: string }>();
  const displayName = course ? courseNames[course] || "your course" : "your course";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card px-4 py-12">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-xl p-10 text-center border border-primary/20">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-primary">Thank you!</h1>
        <p className="text-lg text-muted-foreground mb-2">Your payment was successful.</p>
        <p className="text-base text-muted-foreground mb-6">You have enrolled in <span className="font-semibold text-primary">{displayName}</span>.</p>
        <a href="/" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition">Go to Home</a>
      </div>
    </div>
  );
}

export default ThankYou; 
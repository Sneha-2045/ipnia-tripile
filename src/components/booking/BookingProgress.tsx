import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Traveller", path: "/booking/traveller-details" },
  { id: 2, label: "Travel Documents", path: "/booking/travel-documents" },
  { id: 3, label: "Hotel", path: "/booking/hotel" },
  { id: 4, label: "Review", path: "/booking/review" },
  { id: 5, label: "Payment", path: "/booking/payment" },
] as const;

type Props = {
  currentStep: 1 | 2 | 3 | 4 | 5;
  /** Highest step the user may navigate back to (completed or current). */
  maxReachableStep?: number;
};

export function BookingProgress({ currentStep, maxReachableStep }: Props) {
  const reachable = maxReachableStep ?? currentStep;

  return (
    <nav aria-label="Booking progress" className="mb-8 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 text-sm md:gap-3">
        {STEPS.map((step, index) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          const clickable = step.id <= reachable && step.id < 5 && (done || active);
          const content = (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition",
                active && "border-[#d4a853] bg-[#d4a853]/15 text-[#d4a853]",
                done && !active && "border-[#d4a853]/40 text-[#d4a853]/90",
                !done && !active && "border-white/15 text-white/45"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  active || done ? "bg-[#d4a853] text-[#0a1628]" : "bg-white/10 text-white/50"
                )}
              >
                {step.id}
              </span>
              <span className="whitespace-nowrap font-medium">{step.label}</span>
            </span>
          );

          return (
            <li key={step.id} className="flex items-center gap-2 md:gap-3">
              {clickable && !active ? (
                <Link to={step.path} className="hover:opacity-90">
                  {content}
                </Link>
              ) : (
                content
              )}
              {index < STEPS.length - 1 && (
                <span className="text-white/25" aria-hidden>
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

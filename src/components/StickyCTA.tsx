import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type StickyCTAProps = {
  label?: string;
  to?: string;
};

const StickyCTA = ({ label = "Plan Your Journey", to = "/contact" }: StickyCTAProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e2b552]/20 bg-[#07111f]/92 p-3.5 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
      <Button asChild className="ipnia-btn-gold h-12 w-full rounded-full text-base" size="lg">
        <Link to={to}>
          {label} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default StickyCTA;

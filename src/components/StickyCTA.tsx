import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type StickyCTAProps = {
  label?: string;
  to?: string;
};

const StickyCTA = ({ label = "Plan Your Journey", to = "/contact" }: StickyCTAProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#d4a853]/25 bg-[#0a1628]/95 p-4 backdrop-blur-md md:hidden">
      <Button
        asChild
        className="h-12 w-full bg-[#d4a853] text-base font-semibold text-[#0a1628] hover:bg-[#e0b96a]"
        size="lg"
      >
        <Link to={to}>
          {label} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default StickyCTA;

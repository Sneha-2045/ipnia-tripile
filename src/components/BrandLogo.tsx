import { useId } from "react";

type BrandLogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/** Ipnia mark: stylized "i" with a global orbit — Travel + EdTech */
export function BrandLogo({ size = 36, className, title = "Ipnia" }: BrandLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `ipnia-grad-${uid}`;
  const glowId = `ipnia-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0c1929" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill={`url(#${glowId})`}
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
      />

      {/* Global orbit — travel */}
      <ellipse
        cx="20"
        cy="22"
        rx="12"
        ry="7.5"
        transform="rotate(-28 20 22)"
        stroke={`url(#${gradId})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeDasharray="28 10"
        opacity="0.9"
      />

      {/* Stylized "i" stem — Ipnia */}
      <path
        d="M20 15.5v12.5"
        stroke={`url(#${gradId})`}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* "i" node / destination spark — EdTech + arrival */}
      <circle cx="20" cy="11.5" r="2.4" fill={`url(#${gradId})`} />
      <circle cx="20" cy="11.5" r="1" fill="#0c1929" opacity="0.35" />
    </svg>
  );
}

type BrandLogoProps = {
  size?: number;
  className?: string;
  title?: string;
  markOnly?: boolean;
};

/** Official IPNIA.com logo lockup, with a compact mark option for avatars. */
export function BrandLogo({
  size = 36,
  className,
  title = "IPNIA.com — Your Journey. Our Priority.",
  markOnly = false,
}: BrandLogoProps) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-md bg-white p-1">
      <img
        src={markOnly ? "/ipnia-mark.png" : "/ipnia-logo.png"}
        width={markOnly ? size : Math.round(size * 4)}
        height={size}
        className={className}
        alt={title}
        draggable={false}
      />
    </span>
  );
}

/** Marca A-ware® — triángulo blanco con triángulo violeta interno (inline SVG). */
export function AwareMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="block">
      <polygon points="50,12 92,86 8,86" fill="#fff" />
      <polygon points="50,36 76,80 24,80" fill="#685BC7" />
    </svg>
  );
}

/** Lockup: marca + wordmark "A·WARE®". `tone` controla color del texto. */
export function AwareWordmark({
  size = 16,
  markSize = 22,
  tone = "#fff",
}: {
  size?: number;
  markSize?: number;
  tone?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <AwareMark size={markSize} />
      <span className="font-extrabold tracking-[0.02em]" style={{ color: tone, fontSize: size }}>
        A·WARE
        <sup style={{ fontSize: size * 0.5, opacity: 0.7 }}>®</sup>
      </span>
    </div>
  );
}

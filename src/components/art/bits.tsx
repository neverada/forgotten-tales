import type { SVGProps } from "react";

export const INK = "var(--foreground)";
export const line = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Friendly face: blinking eyes, rosy cheeks and a smile. */
export function Face({ x, y, s = 1, mood = "happy" }: { x: number; y: number; s?: number; mood?: "happy" | "wow" | "cool" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {mood === "cool" ? (
        <path d="M-13 -3 h10 a3 3 0 0 1 -3 4 h-4 a3 3 0 0 1 -3 -4z M3 -3 h10 a3 3 0 0 1 -3 4 h-4 a3 3 0 0 1 -3 -4z M-3 -2 h6" fill={INK} stroke={INK} strokeWidth={1.5} />
      ) : (
        <g className="animate-blink">
          <ellipse cx={-7} cy={-2} rx={2.6} ry={3.2} fill={INK} />
          <ellipse cx={7} cy={-2} rx={2.6} ry={3.2} fill={INK} />
          <circle cx={-6} cy={-3.2} r={0.9} fill="var(--paper)" />
          <circle cx={8} cy={-3.2} r={0.9} fill="var(--paper)" />
        </g>
      )}
      <circle cx={-12} cy={4} r={2.6} fill="var(--blush)" opacity={0.8} />
      <circle cx={12} cy={4} r={2.6} fill="var(--blush)" opacity={0.8} />
      {mood === "wow" ? (
        <ellipse cx={0} cy={6} rx={2.4} ry={3} fill={INK} />
      ) : (
        <path d="M-4 4 q4 4 8 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      )}
    </g>
  );
}

export function Sparkle({ x, y, size = 10, filled = true, delay = 0, color = "var(--peach)" }: { x: number; y: number; size?: number; filled?: boolean; delay?: number; color?: string }) {
  const s = size;
  return (
    <path
      className="animate-twinkle svg-origin-center"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z`}
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-12 -12 24 24" aria-hidden {...props}>
      <path d="M0 -11 Q2 -2 11 0 Q2 2 0 11 Q-2 2 -11 0 Q-2 -2 0 -11Z" fill="currentColor" />
    </svg>
  );
}

/** Deterministic star field so server and browser draw the same sky. */
export function Stars({ w, h, count, seed = 1, color = "var(--paper)" }: { w: number; h: number; count: number; seed?: number; color?: string }) {
  let n = seed * 9301 + 49297;
  const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = rnd() * w;
        const y = rnd() * h;
        const r = 0.6 + rnd() * 1.6;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={color}
            className="animate-twinkle svg-origin-center"
            style={{ animationDelay: `${(rnd() * 3).toFixed(2)}s` }}
          />
        );
      })}
    </g>
  );
}

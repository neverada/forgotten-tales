import type { World } from "@/data/types";
import { line, Sparkle } from "./bits";
import { Planet } from "./scene";

const COVER: Record<World, { top: string; bottom: string; ground: string; groundDeep: string }> = {
  moon: { top: "var(--lavender)", bottom: "var(--peach-soft)", ground: "var(--moon-ground)", groundDeep: "var(--moon-ground-deep)" },
  mars: { top: "var(--peach)", bottom: "var(--butter)", ground: "var(--mars-ground)", groundDeep: "var(--mars-ground-deep)" },
  deep: { top: "var(--sea-deep)", bottom: "var(--sea-soft)", ground: "var(--sea-deep)", groundDeep: "var(--night)" },
};

export function Rocket() {
  return (
    <g>
      <path d="M-6 44 q6 26 12 0z" fill="var(--peach)" className="animate-flame" />
      <path d="M0 -46 C18 -26 18 20 10 44 H-10 C-18 20 -18 -26 0 -46Z" fill="var(--paper)" {...line} />
      <circle cx={0} cy={-6} r={6} fill="var(--sea)" {...line} strokeWidth={2} />
      <path d="M-14 26 l-10 14 l10 -2 M14 26 l10 14 l-10 -2" fill="var(--peach-soft)" {...line} strokeWidth={2} />
    </g>
  );
}

export function CoverArt({ world, title }: { world: World; title: string }) {
  const c = COVER[world];
  const planet = world === "moon" ? "moon" : world === "mars" ? "mars" : "saturn";
  const gid = `cover-${world}`;
  return (
    <svg viewBox="0 0 300 360" className="h-full w-full" role="img" aria-label={`${title} cover`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset="1" stopColor={c.bottom} />
        </linearGradient>
      </defs>
      <rect width={300} height={360} fill={`url(#${gid})`} />
      <text x={150} y={48} textAnchor="middle" className="font-display" fontWeight={700} fontSize={22} fill="var(--foreground)">
        {title}
      </text>
      <Sparkle x={200} y={92} size={9} color="var(--paper)" />
      <Sparkle x={70} y={122} size={6} color="var(--paper)" delay={1} />
      <Sparkle x={240} y={170} size={7} filled={false} color="var(--paper)" delay={0.5} />
      <ellipse cx={150} cy={180} rx={88} ry={44} fill="none" stroke="var(--paper)" strokeWidth={2} strokeDasharray="5 6" transform="rotate(-24 150 180)" />
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <Planet kind={planet} cx={140} cy={172} r={52} />
      </g>
      <path d="M0 290 Q150 240 300 290 V360 H0Z" fill={c.groundDeep} />
      <path d="M0 290 Q150 240 300 290" fill="none" stroke="var(--paper)" strokeWidth={4} />
      <path d="M110 360 L150 262 L300 300 V360Z" fill={c.ground} opacity={0.65} />
      <g transform="translate(160 228) rotate(20)">
        <g className="animate-float" style={{ animationDelay: "0.6s" }}>
          <Rocket />
        </g>
      </g>
    </svg>
  );
}

export function Medal({ kind, size = 64, dim = false }: { kind: "gold" | "silver"; size?: number; dim?: boolean }) {
  const face = kind === "gold" ? "var(--gold)" : "var(--silver)";
  const edge = kind === "gold" ? "var(--gold-deep)" : "var(--silver-deep)";
  return (
    <svg viewBox="-32 -40 64 80" width={size} height={(size * 80) / 64} aria-label={`${kind} badge`} style={{ opacity: dim ? 0.3 : 1 }}>
      <path d="M-14 -40 L-4 -10 H4 L14 -40 H6 L0 -22 L-6 -40Z" fill="var(--peach)" {...line} strokeWidth={2} />
      <path d="M-6 -40 L0 -22 L6 -40" fill="var(--lavender)" />
      <circle cx={0} cy={8} r={26} fill={edge} {...line} />
      <circle cx={0} cy={8} r={20} fill={face} />
      <path d="M0 -6 L4 3 L14 4 L6 10 L9 20 L0 14 L-9 20 L-6 10 L-14 4 L-4 3Z" fill="var(--paper)" opacity={0.95} />
    </svg>
  );
}

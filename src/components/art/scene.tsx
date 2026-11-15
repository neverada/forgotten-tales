import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import type { Backdrop, CraftVariant, World } from "@/data/types";
import { Craft, craftMotion } from "./craft";
import { Face, line, Sparkle, Stars } from "./bits";

const SKY: Record<World, [string, string]> = {
  moon: ["var(--lavender-soft)", "var(--cream)"],
  mars: ["var(--peach-soft)", "var(--butter)"],
  deep: ["var(--deep-sky)", "var(--deep-sky-2)"],
};

export function Planet({
  kind,
  cx,
  cy,
  r,
  spin = false,
}: {
  kind: Backdrop;
  cx: number;
  cy: number;
  r: number;
  spin?: boolean;
}) {
  const body = (() => {
    switch (kind) {
      case "earth":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="var(--sea)" {...line} />
            <path
              d={`M${cx - r * 0.6} ${cy - r * 0.3} q${r * 0.3} -${r * 0.4} ${r * 0.6} -${r * 0.1} q${r * 0.2} ${r * 0.3} -${r * 0.1} ${r * 0.5} q-${r * 0.4} ${r * 0.1} -${r * 0.5} -${r * 0.4}z M${cx + r * 0.1} ${cy + r * 0.2} q${r * 0.4} -${r * 0.1} ${r * 0.5} ${r * 0.3} q-${r * 0.2} ${r * 0.4} -${r * 0.5} ${r * 0.1}z`}
              fill="var(--success-soft)"
              stroke="var(--success)"
              strokeWidth={1.5}
            />
            <path
              d={`M${cx - r * 0.8} ${cy + r * 0.35} q${r * 0.5} ${r * 0.15} ${r * 0.9} 0`}
              fill="none"
              stroke="var(--paper)"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.8}
            />
          </g>
        );
      case "moon":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="var(--butter)" {...line} />
            <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.16} fill="var(--moon-ground)" />
            <circle cx={cx + r * 0.35} cy={cy + r * 0.2} r={r * 0.22} fill="var(--moon-ground)" />
          </g>
        );
      case "sun":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r * 1.5} fill="var(--butter)" opacity={0.5} />
            <circle cx={cx} cy={cy} r={r} fill="var(--butter)" {...line} />
          </g>
        );
      case "jupiter":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="var(--peach-soft)" {...line} />
            {[-0.5, -0.15, 0.2, 0.55].map((o, i) => (
              <path
                key={i}
                d={`M${cx - r * Math.sqrt(1 - o * o)} ${cy + r * o} Q${cx} ${cy + r * o + (i % 2 ? 6 : -6)} ${cx + r * Math.sqrt(1 - o * o)} ${cy + r * o}`}
                fill="none"
                stroke={i % 2 ? "var(--peach)" : "var(--wood)"}
                strokeWidth={r * 0.12}
                strokeLinecap="round"
              />
            ))}
            <ellipse
              cx={cx + r * 0.3}
              cy={cy + r * 0.32}
              rx={r * 0.18}
              ry={r * 0.1}
              fill="var(--peach-deep)"
            />
          </g>
        );
      case "saturn":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="var(--butter)" {...line} />
            <ellipse
              cx={cx}
              cy={cy}
              rx={r * 1.8}
              ry={r * 0.45}
              fill="none"
              stroke="var(--wood)"
              strokeWidth={r * 0.18}
              transform={`rotate(-16 ${cx} ${cy})`}
            />
          </g>
        );
      case "neptune":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="var(--lavender)" {...line} />
            <path
              d={`M${cx - r * 0.8} ${cy - r * 0.1} q${r * 0.8} ${r * 0.2} ${r * 1.6} 0`}
              fill="none"
              stroke="var(--lavender-soft)"
              strokeWidth={r * 0.1}
              strokeLinecap="round"
            />
            <ellipse
              cx={cx - r * 0.25}
              cy={cy + r * 0.3}
              rx={r * 0.2}
              ry={r * 0.1}
              fill="var(--lavender-deep)"
            />
          </g>
        );
      case "pluto":
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="var(--moon-ground)" {...line} />
            <path
              d={`M${cx} ${cy + r * 0.5} C${cx - r * 0.7} ${cy} ${cx - r * 0.4} ${cy - r * 0.45} ${cx} ${cy - r * 0.15} C${cx + r * 0.4} ${cy - r * 0.45} ${cx + r * 0.7} ${cy} ${cx} ${cy + r * 0.5}Z`}
              fill="var(--paper)"
            />
          </g>
        );
      case "mars":
        return <circle cx={cx} cy={cy} r={r} fill="var(--mars-ground)" {...line} />;
    }
  })();
  return <g className={spin ? "animate-wiggle svg-origin-center" : undefined}>{body}</g>;
}

function Ground({ world }: { world: World }) {
  if (world === "deep") return null;
  const a = world === "moon" ? "var(--moon-ground)" : "var(--mars-ground)";
  const b = world === "moon" ? "var(--moon-ground-deep)" : "var(--mars-ground-deep)";
  return (
    <g>
      <path d="M0 250 Q80 222 170 240 T400 232 V320 H0Z" fill={b} />
      <path d="M0 270 Q120 246 220 262 T400 258 V320 H0Z" fill={a} />
      <path
        d="M0 270 Q120 246 220 262 T400 258"
        fill="none"
        stroke="var(--paper)"
        strokeWidth={3}
        opacity={0.6}
      />
      {world === "moon" ? (
        <g fill={b}>
          <ellipse cx={60} cy={292} rx={22} ry={5} />
          <ellipse cx={330} cy={300} rx={30} ry={6} />
          <ellipse cx={250} cy={286} rx={12} ry={3} />
        </g>
      ) : (
        <g fill={b} {...line} strokeWidth={2}>
          <path d="M40 300 q10 -14 24 -4 q6 6 -2 8z" />
          <path d="M320 296 q14 -18 30 -2 q4 6 -6 6z" />
        </g>
      )}
    </g>
  );
}

/** The interactive left page: tap the craft to animate it, tap the planet to wiggle it. */
export function Scene({
  world,
  backdrop,
  craft,
  hint,
}: {
  world: World;
  backdrop: Backdrop;
  craft: CraftVariant;
  hint?: string;
}) {
  const [moving, setMoving] = useState(0);
  const [planetTap, setPlanetTap] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [sky1, sky2] = SKY[world];
  const motion = craftMotion(craft);
  const gid = `sky-${world}`;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg
          viewBox="0 0 400 320"
          className="pointer-events-none h-full w-full"
          role="img"
          aria-label={`${craft} illustration`}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={sky1} />
              <stop offset="1" stopColor={sky2} />
            </linearGradient>
          </defs>
          <rect width={400} height={320} fill={`url(#${gid})`} />
          <Stars
            w={400}
            h={world === "deep" ? 320 : 200}
            count={world === "deep" ? 60 : 18}
            seed={craft.length}
            color={world === "deep" ? "var(--paper)" : "var(--lavender-deep)"}
          />
          <ellipse
            cx={318}
            cy={78}
            rx={70}
            ry={40}
            fill="none"
            stroke="var(--paper)"
            strokeWidth={1.5}
            strokeDasharray="4 6"
            opacity={0.8}
            transform="rotate(-18 318 78)"
          />
          <g key={`p${planetTap}`}>
            <Planet
              kind={backdrop}
              cx={318}
              cy={78}
              r={backdrop === "sun" ? 26 : 36}
              spin={planetTap > 0}
            />
          </g>
          <Sparkle x={52} y={50} size={9} />
          <Sparkle x={250} y={34} size={6} filled={false} delay={1.2} />
          <Sparkle x={370} y={170} size={7} delay={0.6} color="var(--paper)" />
          <Ground world={world} />
          <g transform="translate(95 92) scale(1.05)">
            <g
              key={moving}
              className={`${moving ? `animate-${motion}` : "animate-float"}`}
              style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
            >
              <ellipse cx={100} cy={190} rx={70} ry={8} fill="var(--foreground)" opacity={0.08} />
              <Craft variant={craft} />
              {moving > 0 && (craft === "curiosity" || craft === "perseverance") && (
                <path
                  d="M150 60 L230 10"
                  stroke="var(--peach-deep)"
                  strokeWidth={4}
                  strokeDasharray="10 6"
                  className="animate-beam"
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>
        </svg>
        <button
          type="button"
          aria-label={`Make ${craft} move`}
          onClick={() => setMoving((n) => n + 1)}
          className="absolute left-[24%] top-[35%] z-10 h-[60%] w-[52%] rounded-3xl bg-transparent focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary"
        />
        <button
          type="button"
          aria-label={`Animate ${backdrop} planet`}
          onClick={() => setPlanetTap((n) => n + 1)}
          className="absolute left-[68%] top-[8%] z-10 h-[34%] w-[25%] rounded-full bg-transparent focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary"
        />
      </div>
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <button
          type="button"
          aria-label="Zoom in illustration"
          title="Zoom in"
          disabled={zoom >= 1.4}
          onClick={() => setZoom((n) => Math.min(1.4, Number((n + 0.2).toFixed(1))))}
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-card/95 text-foreground shadow-soft transition-transform hover:scale-105 disabled:opacity-40"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Zoom out illustration"
          title="Zoom out"
          disabled={zoom <= 1}
          onClick={() => setZoom((n) => Math.max(1, Number((n - 0.2).toFixed(1))))}
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-border bg-card/95 text-foreground shadow-soft transition-transform hover:scale-105 disabled:opacity-40"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
      </div>
      {hint && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card/95 px-4 py-1.5 text-sm font-bold text-foreground shadow-soft">
          {hint} ✨
        </div>
      )}
    </div>
  );
}

export function MiniFace({ className }: { className?: string }) {
  return (
    <svg viewBox="-20 -20 40 40" className={className} aria-hidden>
      <Face x={0} y={0} />
    </svg>
  );
}

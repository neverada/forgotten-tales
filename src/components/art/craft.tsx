import type { CraftVariant } from "@/data/types";
import { Face, INK, line } from "./bits";

/* All crafts are drawn in a 200×200 box with their feet near y = 185. */

function Pad({ x, y }: { x: number; y: number }) {
  return <ellipse cx={x} cy={y} rx={11} ry={4} fill="var(--silver)" {...line} />;
}

function Surveyor() {
  return (
    <g>
      <path d="M100 128 L42 180 M100 128 L158 180 M100 128 L100 184 M80 134 L42 180 M120 134 L158 180" fill="none" stroke="var(--silver-deep)" strokeWidth={5} strokeLinecap="round" />
      <Pad x={42} y={181} />
      <Pad x={158} y={181} />
      <Pad x={100} y={185} />
      <path d="M100 96 V38" {...line} fill="none" strokeWidth={4} />
      <g transform="rotate(-12 100 32)">
        <rect x={66} y={22} width={68} height={20} rx={3} fill="var(--lavender-deep)" {...line} />
        <path d="M83 22 v20 M100 22 v20 M117 22 v20 M66 32 h68" stroke="var(--lavender-soft)" strokeWidth={1.5} />
      </g>
      <path d="M100 58 l22 -10 a12 12 0 0 1 -6 22z" fill="var(--paper)" {...line} />
      <path d="M74 132 L52 146 L46 160" fill="none" {...line} strokeWidth={4} />
      <path d="M40 158 l6 6 l6 -6" fill="none" {...line} />
      <rect x={68} y={94} width={64} height={42} rx={10} fill="var(--silver)" {...line} />
      <rect x={128} y={100} width={22} height={14} rx={4} fill="var(--butter)" {...line} />
      <circle cx={150} cy={107} r={4} fill="var(--sea-deep)" {...line} strokeWidth={2} />
      <Face x={100} y={115} />
    </g>
  );
}

function LunarModule({ extended, tilt = 0, flag, buggyPack }: { extended?: boolean; tilt?: number; flag?: boolean; buggyPack?: boolean }) {
  const dh = extended ? 40 : 32;
  const top = 118;
  return (
    <g transform={`rotate(${tilt} 100 185)`}>
      {flag && (
        <g>
          <path d="M170 186 V112" {...line} fill="none" strokeWidth={3} />
          <path d="M170 112 h26 v18 h-26z" fill="var(--peach)" {...line} strokeWidth={2} />
          <path d="M170 118 h26 M170 124 h26" stroke="var(--paper)" strokeWidth={2} />
        </g>
      )}
      <path d={`M58 ${top + 14} L24 182 M142 ${top + 14} L176 182 M66 ${top + dh} L36 180 M134 ${top + dh} L164 180`} fill="none" stroke="var(--silver-deep)" strokeWidth={5} strokeLinecap="round" />
      <Pad x={24} y={183} />
      <Pad x={176} y={183} />
      <path d={`M82 ${top + dh} l-4 16 h44 l-4 -16z`} fill="var(--silver-deep)" {...line} />
      <path d={`M52 ${top} H148 L156 ${top + dh} H44 Z`} fill="var(--gold)" {...line} />
      <path d={`M60 ${top + 9} q10 5 20 0 t20 0 t20 0 t20 0 M56 ${top + 22} q12 5 24 0 t24 0 t24 0 t24 0`} fill="none" stroke="var(--gold-deep)" strokeWidth={1.5} />
      {buggyPack && (
        <g>
          <rect x={58} y={top + 4} width={26} height={dh - 8} rx={3} fill="var(--peach-soft)" {...line} strokeWidth={2} />
          <circle cx={66} cy={top + dh / 2} r={5} fill="none" {...line} strokeWidth={2} />
          <circle cx={77} cy={top + dh / 2} r={5} fill="none" {...line} strokeWidth={2} />
        </g>
      )}
      <path d="M124 150 v30 M132 150 v30 M124 160 h8 M124 170 h8" stroke={INK} strokeWidth={2} />
      <path d={`M66 ${top} V86 L84 64 H116 L134 86 V${top} Z`} fill="var(--silver)" {...line} />
      <path d="M78 80 L92 72 V90 Z" fill="var(--night)" {...line} strokeWidth={2} />
      <path d="M122 80 L108 72 V90 Z" fill="var(--night)" {...line} strokeWidth={2} />
      <circle cx={88} cy={79} r={2} fill="var(--paper)" className="animate-blink" />
      <circle cx={112} cy={79} r={2} fill="var(--paper)" className="animate-blink" />
      <circle cx={80} cy={98} r={3} fill="var(--blush)" />
      <circle cx={120} cy={98} r={3} fill="var(--blush)" />
      <path d="M94 98 q6 5 12 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M100 64 V46" {...line} />
      <path d="M86 44 a14 6 0 0 0 28 0z" fill="var(--paper)" {...line} strokeWidth={2} />
      <rect x={92} y={104} width={16} height={12} rx={2} fill="var(--lavender-soft)" {...line} strokeWidth={2} />
    </g>
  );
}

function Wheel({ x, y, r, mesh }: { x: number; y: number; r: number; mesh?: boolean }) {
  return (
    <g className="svg-origin-center">
      <circle cx={x} cy={y} r={r} fill="var(--foreground)" opacity={0.85} />
      <circle cx={x} cy={y} r={r - 3} fill={mesh ? "var(--silver)" : "var(--silver-deep)"} />
      {mesh ? (
        <path d={`M${x - r + 4} ${y} h${2 * r - 8} M${x} ${y - r + 4} v${2 * r - 8} M${x - r * 0.6} ${y - r * 0.6} l${r * 1.2} ${r * 1.2} M${x + r * 0.6} ${y - r * 0.6} l${-r * 1.2} ${r * 1.2}`} stroke="var(--silver-deep)" strokeWidth={1.4} />
      ) : null}
      <circle cx={x} cy={y} r={r * 0.32} fill="var(--paper)" {...line} strokeWidth={2} />
    </g>
  );
}

function Buggy() {
  return (
    <g>
      <path d="M150 104 V70" {...line} fill="none" />
      <path d="M128 72 a22 9 0 0 0 44 0z" fill="var(--paper)" {...line} />
      <path d="M150 104 l-14 -20" {...line} fill="none" />
      <circle cx={88} cy={92} r={17} fill="var(--paper)" {...line} />
      <path d="M78 90 a10 9 0 0 1 20 0 v4 h-20z" fill="var(--gold)" {...line} strokeWidth={2} />
      <rect x={74} y={106} width={28} height={22} rx={8} fill="var(--paper)" {...line} />
      <path d="M100 112 l14 -8" {...line} />
      <path d="M30 128 H170 l-8 16 H38 Z" fill="var(--lavender)" {...line} />
      <path d="M40 128 l-10 -14 h28 M160 128 l10 -14 h-28" fill="none" {...line} />
      <rect x={136} y={112} width={20} height={16} rx={3} fill="var(--butter)" {...line} strokeWidth={2} />
      <circle cx={46} cy={136} r={0} />
      <Wheel x={48} y={160} r={20} mesh />
      <Wheel x={152} y={160} r={20} mesh />
      <g transform="translate(100 138)">
        <ellipse cx={-10} cy={0} rx={3} ry={3.5} fill={INK} className="animate-blink" />
        <ellipse cx={10} cy={0} rx={3} ry={3.5} fill={INK} className="animate-blink" />
      </g>
    </g>
  );
}

function MiniRover({ x = 0, s = 1, accent = "var(--lavender)", wings, mast, big, rtg, mood = "happy" as const }: { x?: number; s?: number; accent?: string; wings?: boolean; mast?: boolean; big?: boolean; rtg?: boolean; mood?: "happy" | "wow" | "cool" }) {
  const wr = big ? 15 : 11;
  return (
    <g transform={`translate(${x} 0) translate(100 185) scale(${s}) translate(-100 -185)`}>
      <path d="M52 166 L76 138 L100 166 M100 166 L124 138 L148 166 M76 138 h48" fill="none" {...line} strokeWidth={3.5} />
      {wings && <path d="M24 118 L60 108 H140 L176 118 L140 128 H60 Z" fill="var(--sea-deep)" {...line} />}
      {wings && <path d="M60 108 v20 M80 108 v20 M100 108 v20 M120 108 v20 M140 108 v20" stroke="var(--sea-soft)" strokeWidth={1.4} />}
      {rtg && (
        <g>
          <path d="M40 128 L22 116 l-6 10 l18 12z" fill="var(--silver-deep)" {...line} strokeWidth={2} />
          <path d="M22 112 v18 M28 115 v18" stroke={INK} strokeWidth={1.5} />
        </g>
      )}
      <rect x={44} y={114} width={112} height={big ? 30 : 24} rx={8} fill={accent} {...line} />
      {mast && (
        <g>
          <path d="M136 114 V62" {...line} strokeWidth={4} fill="none" />
          <rect x={114} y={42} width={44} height={24} rx={8} fill="var(--paper)" {...line} />
          <circle cx={128} cy={54} r={6} fill="var(--night)" {...line} strokeWidth={2} />
          <circle cx={144} cy={54} r={6} fill="var(--night)" {...line} strokeWidth={2} />
          <circle cx={130} cy={52} r={1.8} fill="var(--paper)" className="animate-blink" />
          <circle cx={146} cy={52} r={1.8} fill="var(--paper)" className="animate-blink" />
        </g>
      )}
      <Face x={92} y={127 + (big ? 3 : 0)} s={big ? 1.1 : 0.9} mood={mood} />
      <Wheel x={52} y={170} r={wr} />
      <Wheel x={100} y={170} r={wr} />
      <Wheel x={148} y={170} r={wr} />
    </g>
  );
}

function Sojourner() {
  return (
    <g>
      <path d="M150 112 V86" {...line} />
      <circle cx={150} cy={84} r={4} fill="var(--peach)" {...line} strokeWidth={2} />
      <path d="M58 108 h84 l6 8 H52 z" fill="var(--sea-deep)" {...line} />
      <path d="M72 108 l-2 8 M88 108 v8 M104 108 v8 M120 108 v8 M134 108 l2 8" stroke="var(--sea-soft)" strokeWidth={1.4} />
      <MiniRover accent="var(--butter)" s={0.85} mood="wow" />
    </g>
  );
}

function Twins() {
  return (
    <g>
      <MiniRover x={-45} s={0.62} accent="var(--lavender)" wings mast />
      <MiniRover x={48} s={0.62} accent="var(--peach-soft)" wings mast />
    </g>
  );
}

function Curiosity({ tubes }: { tubes?: boolean }) {
  return (
    <g>
      {tubes && (
        <g>
          <rect x={14} y={178} width={20} height={6} rx={3} fill="var(--silver)" {...line} strokeWidth={1.8} />
          <rect x={170} y={176} width={20} height={6} rx={3} fill="var(--silver)" {...line} strokeWidth={1.8} transform="rotate(-14 180 179)" />
        </g>
      )}
      <MiniRover accent={tubes ? "var(--paper)" : "var(--silver)"} big mast rtg s={1} mood={tubes ? "happy" : "cool"} />
      <path d="M60 140 L40 150 L34 164" fill="none" {...line} strokeWidth={3.5} />
      <rect x={26} y={162} width={14} height={10} rx={3} fill="var(--butter)" {...line} strokeWidth={2} />
    </g>
  );
}

function Phoenix() {
  return (
    <g>
      <path d="M78 140 L58 182 M122 140 L142 182 M100 144 V184" fill="none" stroke="var(--silver-deep)" strokeWidth={5} strokeLinecap="round" />
      <Pad x={58} y={183} />
      <Pad x={142} y={183} />
      <Pad x={100} y={186} />
      {[34, 166].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={124} r={28} fill="var(--sea-deep)" {...line} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <path key={i} d={`M${cx} 124 L${cx + Math.cos(a) * 26} ${124 + Math.sin(a) * 26}`} stroke="var(--sea-soft)" strokeWidth={1.4} />;
          })}
        </g>
      ))}
      <path d="M64 112 L76 100 H124 L136 112 L124 144 H76 Z" fill="var(--paper)" {...line} />
      <path d="M124 104 L152 72 L176 86" fill="none" {...line} strokeWidth={4} />
      <path d="M170 82 l14 8 l-4 10 l-14 -4z" fill="var(--butter)" {...line} strokeWidth={2} />
      <path d="M92 100 V70" {...line} />
      <rect x={84} y={58} width={16} height={12} rx={3} fill="var(--lavender)" {...line} strokeWidth={2} />
      <Face x={100} y={124} />
    </g>
  );
}

function Ingenuity() {
  return (
    <g>
      <rect x={82} y={30} width={36} height={6} rx={2} fill="var(--sea-deep)" {...line} strokeWidth={2} />
      <path d="M100 36 V112" {...line} strokeWidth={4} />
      <g className="animate-rotor"><ellipse cx={100} cy={58} rx={72} ry={4} fill="var(--lavender-deep)" {...line} strokeWidth={2} /></g>
      <g className="animate-rotor" style={{ animationDelay: "0.06s" }}><ellipse cx={100} cy={74} rx={72} ry={4} fill="var(--lavender)" {...line} strokeWidth={2} /></g>
      <path d="M80 136 L54 184 M120 136 L146 184 M88 138 L74 184 M112 138 L126 184" fill="none" stroke="var(--silver-deep)" strokeWidth={3.5} strokeLinecap="round" />
      <rect x={72} y={104} width={56} height={38} rx={12} fill="var(--butter)" {...line} />
      <Face x={100} y={122} />
    </g>
  );
}

function Dish({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--paper)" {...line} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="var(--silver)" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke="var(--silver)" strokeWidth={2} />
    </g>
  );
}

function Probe({ variant }: { variant: "pioneer" | "voyager1" | "voyager2" }) {
  const isPioneer = variant === "pioneer";
  return (
    <g>
      {/* booms */}
      <path d="M100 120 L18 168" {...line} strokeWidth={2.5} />
      <path d="M100 120 L180 160" {...line} strokeWidth={2.5} />
      {isPioneer ? (
        <>
          <rect x={10} y={160} width={22} height={14} rx={4} fill="var(--silver-deep)" {...line} strokeWidth={2} transform="rotate(-30 21 167)" />
          <rect x={168} y={152} width={22} height={14} rx={4} fill="var(--silver-deep)" {...line} strokeWidth={2} transform="rotate(26 179 159)" />
        </>
      ) : (
        <>
          <circle cx={22} cy={166} r={7} fill="var(--silver-deep)" {...line} strokeWidth={2} />
          <circle cx={34} cy={159} r={7} fill="var(--silver-deep)" {...line} strokeWidth={2} />
          <rect x={166} y={148} width={22} height={18} rx={4} fill="var(--lavender)" {...line} strokeWidth={2} />
          <path d="M100 100 L186 30" stroke={INK} strokeWidth={1.5} strokeDasharray="2 4" />
        </>
      )}
      <path d="M78 118 L92 106 H108 L122 118 L108 132 H92 Z" fill={isPioneer ? "var(--silver)" : "var(--lavender-deep)"} {...line} />
      {!isPioneer && <circle cx={100} cy={120} r={8} fill="var(--gold)" {...line} strokeWidth={2} />}
      {isPioneer && <rect x={92} y={128} width={16} height={10} rx={2} fill="var(--gold)" {...line} strokeWidth={2} />}
      <Dish cx={100} cy={70} r={isPioneer ? 46 : 52} />
      <path d="M100 70 V46" {...line} />
      <circle cx={100} cy={44} r={3} fill={INK} />
      <Face x={100} y={82} s={1.1} mood={variant === "voyager2" ? "happy" : "cool"} />
    </g>
  );
}

function NewHorizons() {
  return (
    <g>
      <path d="M56 140 L20 160" {...line} strokeWidth={5} stroke="var(--silver-deep)" />
      <rect x={6} y={152} width={22} height={18} rx={5} fill="var(--silver-deep)" {...line} strokeWidth={2} transform="rotate(-28 17 161)" />
      <path d="M48 150 L120 92 L170 140 Z" fill="var(--gold)" {...line} />
      <path d="M70 140 L118 102 M90 146 L130 112" stroke="var(--gold-deep)" strokeWidth={1.5} />
      <Dish cx={112} cy={76} r={36} />
      <path d="M112 76 v-18" {...line} />
      <rect x={148} y={118} width={20} height={14} rx={3} fill="var(--peach)" {...line} strokeWidth={2} />
      <Face x={112} y={84} />
    </g>
  );
}

export function Craft({ variant }: { variant: CraftVariant }) {
  switch (variant) {
    case "surveyor": return <Surveyor />;
    case "eagle": return <LunarModule />;
    case "falcon": return <LunarModule extended tilt={-11} buggyPack />;
    case "challenger": return <LunarModule extended flag />;
    case "buggy": return <Buggy />;
    case "sojourner": return <Sojourner />;
    case "twins": return <Twins />;
    case "phoenix": return <Phoenix />;
    case "curiosity": return <Curiosity />;
    case "perseverance": return <Curiosity tubes />;
    case "ingenuity": return <Ingenuity />;
    case "pioneer": return <Probe variant="pioneer" />;
    case "voyager1": return <Probe variant="voyager1" />;
    case "voyager2": return <Probe variant="voyager2" />;
    case "newhorizons": return <NewHorizons />;
  }
}

export type CraftMotion = "hop" | "drive" | "liftoff" | "drift" | "wiggle";

export function craftMotion(variant: CraftVariant): CraftMotion {
  if (["surveyor", "challenger"].includes(variant)) return "hop";
  if (["eagle", "ingenuity"].includes(variant)) return "liftoff";
  if (["buggy", "sojourner", "twins", "curiosity", "perseverance"].includes(variant)) return "drive";
  if (["pioneer", "voyager1", "voyager2", "newhorizons"].includes(variant)) return "drift";
  return "wiggle";
}

export function CraftIcon({ variant, className }: { variant: CraftVariant; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <Craft variant={variant} />
    </svg>
  );
}

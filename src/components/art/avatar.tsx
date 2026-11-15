import type { CraftVariant } from "@/data/types";
import { speakerKind } from "@/lib/speakers";
import { Craft } from "./craft";
import { Face, INK, line } from "./bits";

const CRAFT_BY_NAME: [RegExp, CraftVariant][] = [
  [/surveyor/i, "surveyor"],
  [/eagle/i, "eagle"],
  [/columbia/i, "pioneer"],
  [/falcon/i, "falcon"],
  [/buggy|roving/i, "buggy"],
  [/challenger/i, "challenger"],
  [/sojourner/i, "sojourner"],
  [/spirit|opportunity/i, "sojourner"],
  [/phoenix/i, "phoenix"],
  [/curiosity/i, "curiosity"],
  [/perseverance/i, "perseverance"],
  [/ingenuity/i, "ingenuity"],
  [/pioneer/i, "pioneer"],
  [/voyager 1/i, "voyager1"],
  [/voyager 2/i, "voyager2"],
  [/new horizons/i, "newhorizons"],
];

const RING = ["var(--lavender-soft)", "var(--peach-soft)", "var(--sea-soft)", "var(--butter)"];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function Avatar({ name, fallback, size = 52 }: { name: string; fallback: CraftVariant; size?: number }) {
  const kind = speakerKind(name);
  const bg = RING[hash(name) % RING.length];
  let inner: React.ReactNode;
  switch (kind) {
    case "moon":
      inner = (
        <g>
          <circle cx={0} cy={0} r={17} fill="var(--butter)" {...line} />
          <circle cx={-8} cy={-9} r={3} fill="var(--moon-ground)" />
          <Face x={0} y={2} s={0.8} />
        </g>
      );
      break;
    case "mars":
      inner = (
        <g>
          <circle cx={0} cy={0} r={17} fill="var(--mars-ground)" {...line} />
          <Face x={0} y={2} s={0.8} />
        </g>
      );
      break;
    case "space":
      inner = (
        <g>
          <circle cx={0} cy={0} r={17} fill="var(--night)" {...line} />
          <path d="M-7 -3 l1.5 -3 l1.5 3 l-1.5 3z M7 -3 l1.5 -3 l1.5 3 l-1.5 3z" transform="translate(-1.5 0)" fill="var(--butter)" />
          <circle cx={-9} cy={9} r={1} fill="var(--paper)" />
          <circle cx={10} cy={-10} r={1.2} fill="var(--paper)" />
          <path d="M-4 6 h8" stroke="var(--paper)" strokeWidth={2} strokeLinecap="round" />
        </g>
      );
      break;
    case "astronaut":
      inner = (
        <g>
          <circle cx={0} cy={0} r={17} fill="var(--paper)" {...line} />
          <rect x={-12} y={-9} width={24} height={16} rx={8} fill="var(--gold)" {...line} strokeWidth={2} />
          <path d="M-7 -4 q3 -3 6 0" stroke="var(--paper)" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M-3 11 q3 3 6 0" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "computer":
      inner = (
        <g>
          <rect x={-16} y={-13} width={32} height={26} rx={5} fill="var(--silver)" {...line} />
          <rect x={-11} y={-8} width={22} height={13} rx={2} fill="var(--sea-deep)" />
          <path d="M-7 -2 h3 M4 -2 h3 M-3 2 q3 2 6 0" stroke="var(--butter)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <circle cx={-10} cy={9} r={1.5} fill="var(--peach)" />
        </g>
      );
      break;
    case "part":
      inner = (
        <g>
          <path d="M-9 -15 h18 l4 26 h-26z" fill="var(--silver)" {...line} />
          <path d="M-6 11 l-3 6 h18 l-3 -6" fill="var(--peach)" {...line} strokeWidth={2} />
          <path d="M-5 -6 l3 1 M5 -6 l-3 1" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
          <circle cx={-3.5} cy={-2} r={1.8} fill={INK} />
          <circle cx={3.5} cy={-2} r={1.8} fill={INK} />
          <path d="M-3 6 q3 -3 6 0" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case "mission":
      inner = (
        <g>
          <path d="M0 -17 c8 8 8 22 0 30 c-8 -8 -8 -22 0 -30z" fill="var(--paper)" {...line} />
          <circle cx={0} cy={-3} r={3.5} fill="var(--sea-deep)" {...line} strokeWidth={1.5} />
          <path d="M-3 13 l3 6 l3 -6" fill="var(--peach)" />
        </g>
      );
      break;
    default: {
      const v = CRAFT_BY_NAME.find(([re]) => re.test(name))?.[1] ?? fallback;
      inner = (
        <g transform="translate(-19 -21) scale(0.19)">
          <Craft variant={v} />
        </g>
      );
    }
  }
  return (
    <svg viewBox="-24 -24 48 48" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx={0} cy={0} r={23} fill={bg} stroke="var(--paper)" strokeWidth={2} />
      {inner}
    </svg>
  );
}

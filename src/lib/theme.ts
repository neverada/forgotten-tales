import type { World } from "@/data/types";

export const worldTheme: Record<World, { spine: string; edge: string; soft: string; text: string; ring: string }> = {
  moon: { spine: "bg-lavender", edge: "bg-lavender-deep", soft: "bg-lavender-soft", text: "text-lavender-deep", ring: "ring-lavender" },
  mars: { spine: "bg-peach", edge: "bg-peach-deep", soft: "bg-peach-soft", text: "text-peach-deep", ring: "ring-peach" },
  deep: { spine: "bg-sea", edge: "bg-sea-deep", soft: "bg-sea-soft", text: "text-sea-deep", ring: "ring-sea" },
};

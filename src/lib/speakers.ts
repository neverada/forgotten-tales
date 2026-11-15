export type SpeakerKind = "moon" | "mars" | "space" | "astronaut" | "computer" | "part" | "mission" | "craft";

const PART_WORDS = [
  "parking lot", "top half", "service module", "booster", "stage", "heat shield", "parachute",
  "sky crane", "drop tube", "pathfinder", "kick motor", "rocket",
];

export function speakerKind(name: string): SpeakerKind {
  const n = name.toLowerCase();
  if (n === "the moon") return "moon";
  if (n === "mars") return "mars";
  if (n === "deep space") return "space";
  if (n.includes("armstrong") || n.includes("aldrin") || n.includes("collins")) return "astronaut";
  if (n.includes("computer")) return "computer";
  if (n === "apollo") return "mission";
  if (PART_WORDS.some((w) => n.includes(w))) return "part";
  return "craft";
}

/** Short display name for bubbles, e.g. "Falcon (Apollo 15 Lunar Module)" -> "Falcon". */
export function shortName(name: string) {
  return name.replace(/\s*\(.*\)\s*/g, "").trim();
}

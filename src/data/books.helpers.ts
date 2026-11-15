import type { Line, Page } from "./types";
export type { Book, Chapter, Line, Page } from "./types";
export type RawSource = { heading: string; stage: string; lines: Line[] };

const FACT_SPEAKERS = new Set(["Info Box", "Fun Fact", "End"]);

/** Groups story lines into readable pages: up to 2 bubbles (3 if short); facts get their own page. */
export function buildPages(lines: Line[]): Page[] {
  const pages: Page[] = [];
  let bucket: Line[] = [];
  const flush = () => {
    if (bucket.length) pages.push({ kind: "dialogue", lines: bucket });
    bucket = [];
  };
  for (const line of lines) {
    if (FACT_SPEAKERS.has(line.speaker)) {
      flush();
      pages.push({ kind: "fact", label: line.speaker === "End" ? "The End" : line.speaker, text: line.text });
      continue;
    }
    const chars = bucket.reduce((n, l) => n + l.text.length, 0) + line.text.length;
    if (bucket.length >= 3 || (bucket.length >= 2 && chars > 260)) flush();
    bucket.push(line);
  }
  flush();
  return pages;
}

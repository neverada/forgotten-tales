export type World = "moon" | "mars" | "deep";

export type CraftVariant =
  | "surveyor"
  | "eagle"
  | "falcon"
  | "buggy"
  | "challenger"
  | "sojourner"
  | "twins"
  | "phoenix"
  | "curiosity"
  | "perseverance"
  | "ingenuity"
  | "pioneer"
  | "voyager1"
  | "voyager2"
  | "newhorizons";

export type Backdrop = "earth" | "moon" | "mars" | "jupiter" | "saturn" | "neptune" | "pluto" | "sun";

export type Line = { speaker: string; text: string };

export type Page =
  | { kind: "dialogue"; lines: Line[] }
  | { kind: "fact"; label: string; text: string };

export type Question = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type GameConfig =
  | { type: "landing"; title: string; intro: string; gravity: number; craft: CraftVariant }
  | { type: "match"; title: string; intro: string; pairs: [string, string][] }
  | { type: "order"; title: string; intro: string; items: string[] }
  | {
      type: "sort";
      title: string;
      intro: string;
      bins: [string, string];
      items: { label: string; bin: 0 | 1 }[];
    };

export type Chapter = {
  id: string;
  number: number;
  title: string;
  when: string;
  stage: string;
  craft: CraftVariant;
  backdrop: Backdrop;
  tapHint: string;
  pages: Page[];
  facts: string[];
  game: GameConfig;
  quiz: Question[];
};

export type Book = {
  id: string;
  title: string;
  world: World;
  blurb: string;
  tagline: string;
  chapters: Chapter[];
};

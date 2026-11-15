import { describe, expect, it } from "vitest";
import { books } from "@/data/books";
import { moonAudioForChapter, moonFactAudio } from "@/lib/moon-audio";

describe("Moon chapter narration", () => {
  const moon = books.find((book) => book.id === "moon-makers")!;

  it("plays Surveyor recordings in dialogue order", () => {
    const chapter = moon.chapters[0]!;
    const firstPage = chapter.pages.find((page) => page.kind === "dialogue")!;
    if (firstPage.kind !== "dialogue") throw new Error("Expected a dialogue page");

    const audio = moonAudioForChapter(chapter);
    const firstTrack = audio.get(firstPage.lines[0]!)?.audioSrc;
    const secondTrack = audio.get(firstPage.lines[1]!)?.audioSrc;

    expect(decodeURIComponent(firstTrack ?? "")).toContain("/Chapter 1/Surveyor 3.mp3");
    expect(decodeURIComponent(secondTrack ?? "")).toContain("/Chapter 1/Surveyor 3_2.0.mp3");
  });

  it("has recorded dialogue for every Moon chapter", () => {
    for (const chapter of moon.chapters) {
      const audio = moonAudioForChapter(chapter);
      expect(
        [...audio.values()].some((assignment) => assignment.audioSrc),
        chapter.title,
      ).toBe(true);
    }
  });

  it("uses the Apollo Legacy recording for the final chapter page", () => {
    const finalChapter = moon.chapters[4]!;

    expect(decodeURIComponent(moonFactAudio(finalChapter, "The End") ?? "")).toContain(
      "Final Narrator – The Apollo Legacy.mp3",
    );
  });
});

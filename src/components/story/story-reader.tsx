import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Lightbulb, Rocket as RocketIcon, Sparkles } from "lucide-react";
import type { Book, Chapter, Line, Page } from "@/data/types";
import { Scene } from "@/components/art/scene";
import { Avatar } from "@/components/art/avatar";
import { Button } from "@/components/ui/button";
import { PlayButton, VoiceToggle } from "./voice-controls";
import { useVoice, useVoiceMode, type Utterance } from "@/lib/voice";
import { shortName } from "@/lib/speakers";
import { worldTheme } from "@/lib/theme";
import { moonAudioForChapter, moonFactAudio } from "@/lib/moon-audio";
import { cn } from "@/lib/utils";

type TurnDirection = "next" | "previous";

function utterancesFor(
  page: Page,
  chapter: Chapter,
  first: boolean,
  recordedAudio: boolean,
  audioPlan?: Map<Line, { audioSrc?: string; skip?: boolean; text?: string }>,
): Utterance[] {
  const intro: Utterance[] = first
    ? [{ text: `Chapter ${chapter.number}. ${chapter.title}.` }]
    : [];
  if (page.kind === "fact") {
    const audioSrc = recordedAudio ? moonFactAudio(chapter, page.label) : undefined;
    return [...intro, { text: `${page.label}. ${page.text}`, ...(audioSrc ? { audioSrc } : {}) }];
  }
  const lines = page.lines.flatMap((line, lineIndex) => {
    const assignment = audioPlan?.get(line);
    if (assignment?.skip) return [];
    return [
      {
        speaker: line.speaker,
        text: assignment?.text ?? line.text,
        lineIndex,
        ...(assignment?.audioSrc ? { audioSrc: assignment.audioSrc } : {}),
      },
    ];
  });
  return [...intro, ...lines];
}

export function StoryReader({
  book,
  chapter,
  onFinish,
}: {
  book: Book;
  chapter: Chapter;
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState<TurnDirection>("next");
  const page = chapter.pages[index]!;
  const last = index === chapter.pages.length - 1;
  const voiceOn = useVoiceMode();
  const { play, stop, speakingIndex, speaking, error: voiceError } = useVoice();
  const t = worldTheme[book.world];
  const recordedAudio = book.id === "moon-makers";
  const audioPlan = useMemo(
    () => (recordedAudio ? moonAudioForChapter(chapter) : undefined),
    [recordedAudio, chapter],
  );
  const autoReadPage = useRef<number | null>(null);

  const utterancesForPage = useCallback(
    (pageIndex: number) => {
      const pageToRead = chapter.pages[pageIndex];
      return pageToRead
        ? utterancesFor(
            pageToRead,
            chapter,
            pageIndex === 0 && !recordedAudio,
            recordedAudio,
            audioPlan,
          )
        : [];
    },
    [chapter, recordedAudio, audioPlan],
  );
  const pageUtterances = useMemo(() => utterancesForPage(index), [utterancesForPage, index]);

  const speakPage = useCallback(
    (pageIndex: number) => {
      autoReadPage.current = pageIndex;
      play(utterancesForPage(pageIndex));
    },
    [play, utterancesForPage],
  );
  const readPage = useCallback(() => speakPage(index), [speakPage, index]);

  useEffect(() => {
    if (voiceOn && autoReadPage.current !== index) speakPage(index);
    if (!voiceOn) {
      autoReadPage.current = null;
      stop();
    }
  }, [voiceOn, index, speakPage, stop]);

  const go = useCallback(
    (d: number) => {
      stop();
      if (d > 0 && last) return onFinish();
      setTurnDirection(d > 0 ? "next" : "previous");
      const nextIndex = Math.min(Math.max(index + d, 0), chapter.pages.length - 1);
      if (voiceOn) speakPage(nextIndex);
      setIndex(nextIndex);
    },
    [stop, last, onFinish, chapter.pages.length, index, voiceOn, speakPage],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="storybook-stage">
      <div className="storybook-spread grid overflow-hidden rounded-[2rem] bg-card md:grid-cols-2">
        <div
          className={cn(
            "storybook-art-page relative aspect-[5/4] md:aspect-auto md:min-h-[460px]",
            t.soft,
          )}
        >
          <Scene
            world={book.world}
            backdrop={chapter.backdrop}
            craft={chapter.craft}
            hint={chapter.tapHint}
          />
        </div>
        <div
          key={index}
          className={cn(
            "storybook-text-page flex flex-col bg-paper p-6 md:p-9",
            `storybook-page-variant-${index % 4}`,
            turnDirection === "next" ? "storybook-turn-next" : "storybook-turn-previous",
          )}
        >
          <p className="eyebrow text-muted-foreground">
            Chapter {chapter.number} · {chapter.when}
          </p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{chapter.title}</h2>
          {index === 0 && (
            <p className={cn("mt-2 flex items-start gap-2 font-bold", t.text)}>
              <RocketIcon className="mt-0.5 h-4 w-4 shrink-0" /> {chapter.stage}
            </p>
          )}

          <div className="mt-5 flex-1 space-y-4">
            {page.kind === "dialogue" ? (
              page.lines.map((l, i) => {
                const right = i % 2 === 1;
                const active =
                  speakingIndex !== null && pageUtterances[speakingIndex]?.lineIndex === i;
                return (
                  <div
                    key={i}
                    className={cn(
                      "animate-pop-in flex items-start gap-3",
                      right && "flex-row-reverse",
                    )}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    <Avatar name={l.speaker} fallback={chapter.craft} />
                    <div className={cn("max-w-[85%]", right && "text-right")}>
                      <p className="text-sm font-extrabold">{shortName(l.speaker)}</p>
                      <p
                        className={cn(
                          "mt-1 rounded-2xl border-2 border-border bg-card px-4 py-3 text-left text-[1.05rem] leading-relaxed transition-all",
                          right ? "rounded-tr-sm" : "rounded-tl-sm",
                          active && "border-primary ring-4 ring-primary/15",
                        )}
                      >
                        {l.text}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={cn(
                  "animate-pop-in relative rotate-[-1deg] rounded-2xl p-6 shadow-soft",
                  page.label === "The End"
                    ? "bg-sea-soft"
                    : page.label === "Fun Fact"
                      ? "bg-butter"
                      : "bg-lavender-soft",
                  speakingIndex !== null && "ring-4 ring-primary/20",
                )}
              >
                <span
                  className="absolute -top-3 left-6 h-6 w-20 rotate-2 rounded bg-peach/70"
                  aria-hidden
                />
                <p className="flex items-center gap-2 font-display text-lg font-bold">
                  {page.label === "Fun Fact" ? (
                    <Sparkles className="h-5 w-5" />
                  ) : (
                    <Lightbulb className="h-5 w-5" />
                  )}
                  {page.label}
                </p>
                <p className="mt-3 text-lg leading-relaxed">{page.text}</p>
              </div>
            )}
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-1.5"
            aria-label={`Page ${index + 1} of ${chapter.pages.length}`}
          >
            {chapter.pages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to page ${i + 1}`}
                onClick={() => {
                  stop();
                  setTurnDirection(i > index ? "next" : "previous");
                  if (voiceOn) speakPage(i);
                  setIndex(i);
                }}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === index ? "w-7 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Button variant="paper" size="xl" onClick={() => go(-1)} disabled={index === 0}>
            <ArrowLeft /> Previous
          </Button>
          <Button variant={last ? "candy" : "story"} size="xl" onClick={() => go(1)}>
            {last ? "Discover facts" : "Next page"} <ArrowRight />
          </Button>
        </div>
        <div className="flex gap-3">
          <VoiceToggle onEnable={readPage} audioAvailable={recordedAudio} />
          <PlayButton
            speaking={speaking}
            onPlay={readPage}
            onStop={stop}
            audioAvailable={recordedAudio}
          />
        </div>
      </div>
      {voiceError && (
        <p role="alert" className="mt-3 text-right font-bold text-oops">
          {voiceError}
        </p>
      )}
    </div>
  );
}

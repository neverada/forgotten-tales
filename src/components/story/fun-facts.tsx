import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Chapter } from "@/data/types";
import { Button } from "@/components/ui/button";
import { useVoice, useVoiceMode } from "@/lib/voice";
import { cn } from "@/lib/utils";

const FRONTS = ["bg-lavender-soft", "bg-peach-soft", "bg-sea-soft"];

export function FunFacts({ chapter, onDone }: { chapter: Chapter; onDone: () => void }) {
  const [open, setOpen] = useState<boolean[]>(() => chapter.facts.map(() => false));
  const voiceOn = useVoiceMode();
  const { play } = useVoice();
  const all = open.every(Boolean);

  return (
    <div className="rounded-[2rem] bg-card p-6 shadow-lift md:p-10">
      <p className="eyebrow text-peach-deep">Fun fact time</p>
      <h2 className="mt-2 text-3xl font-bold">Tap each card to discover a secret</h2>
      <p className="mt-2 text-muted-foreground">Open every card to unlock the game.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {chapter.facts.map((f, i) => (
          <button
            key={i}
            onClick={() => {
              setOpen((o) => o.map((v, j) => (j === i ? true : v)));
              if (voiceOn) play([{ text: `Did you know? ${f}` }]);
            }}
            className="group h-56 [perspective:1000px]"
            aria-label={open[i] ? f : `Reveal fun fact ${i + 1}`}
          >
            <div
              className={cn(
                "relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d]",
                open[i] && "[transform:rotateY(180deg)]",
              )}
            >
              <div className={cn("absolute inset-0 grid place-items-center rounded-3xl p-6 shadow-soft [backface-visibility:hidden] group-hover:-translate-y-1", FRONTS[i % 3])}>
                <div className="text-center">
                  <Sparkles className="mx-auto h-10 w-10 animate-twinkle" />
                  <p className="mt-3 font-display text-2xl font-bold">Did you know?</p>
                  <p className="mt-1 text-muted-foreground">Tap to flip</p>
                </div>
              </div>
              <div className="absolute inset-0 grid place-items-center rounded-3xl bg-butter p-6 text-lg leading-relaxed shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {f}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button variant="candy" size="xl" disabled={!all} onClick={onDone}>
          {all ? "Play the game" : "Flip all cards first"} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

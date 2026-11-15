import { useEffect, useState } from "react";
import { GameShell, shuffle } from "./game-shell";
import { Sparkle } from "@/components/art/bits";
import { cn } from "@/lib/utils";

type Card = { id: number; pair: number; text: string };

export function MatchGame({ title, intro, pairs, onWin }: { title: string; intro: string; pairs: [string, string][]; onWin: () => void }) {
  const [cards] = useState<Card[]>(() =>
    shuffle(pairs.flatMap(([a, b], i) => [{ id: i * 2, pair: i, text: a }, { id: i * 2 + 1, pair: i, text: b }])),
  );
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped.map((id) => cards.find((c) => c.id === id));
    if (!a || !b) return undefined;
    const timer = setTimeout(() => {
      if (a.pair === b.pair) setMatched((m) => [...m, a.pair]);
      setFlipped([]);
    }, a.pair === b.pair ? 350 : 900);
    return () => clearTimeout(timer);
  }, [flipped, cards]);

  const won = matched.length === pairs.length;
  useEffect(() => {
    if (won) {
      const t = setTimeout(onWin, 900);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [won, onWin]);

  return (
    <GameShell title={title} intro={intro}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => {
          const isUp = flipped.includes(c.id) || matched.includes(c.pair);
          const isMatched = matched.includes(c.pair);
          return (
            <button
              key={c.id}
              disabled={isUp || flipped.length === 2}
              onClick={() => {
                if (flipped.length === 1) setMoves((m) => m + 1);
                setFlipped((f) => [...f, c.id]);
              }}
              className="h-32 [perspective:800px]"
              aria-label={isUp ? c.text : "Hidden card"}
            >
              <div className={cn("relative h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]", isUp && "[transform:rotateY(180deg)]")}>
                <div className="absolute inset-0 grid place-items-center rounded-2xl bg-lavender shadow-book [backface-visibility:hidden] hover:-translate-y-0.5">
                  <svg viewBox="-20 -20 40 40" className="h-10 w-10" aria-hidden>
                    <Sparkle x={0} y={0} size={14} color="var(--paper)" />
                  </svg>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 grid place-items-center rounded-2xl p-3 text-center font-bold leading-snug shadow-book [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    isMatched ? "bg-success-soft" : "bg-butter",
                  )}
                >
                  {c.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-center font-bold text-muted-foreground">
        {won ? "🎉 All matched! Brilliant memory!" : `Pairs found: ${matched.length}/${pairs.length} · Tries: ${moves}`}
      </p>
    </GameShell>
  );
}

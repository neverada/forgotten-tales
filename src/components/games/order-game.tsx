import { useEffect, useState } from "react";
import { GameShell, shuffle } from "./game-shell";
import { cn } from "@/lib/utils";

const CHIP = ["bg-lavender-soft", "bg-peach-soft", "bg-sea-soft", "bg-butter", "bg-mint"];

export function OrderGame({ title, intro, items, onWin }: { title: string; intro: string; items: string[]; onWin: () => void }) {
  const [pool] = useState(() => {
    let s = shuffle(items);
    while (items.length > 1 && s.every((v, i) => v === items[i])) s = shuffle(items);
    return s;
  });
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const won = placed.length === items.length;

  useEffect(() => {
    if (won) {
      const t = setTimeout(onWin, 900);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [won, onWin]);

  const tap = (item: string) => {
    if (item === items[placed.length]) {
      setPlaced((p) => [...p, item]);
      setWrong(null);
    } else {
      setWrong(item);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <GameShell title={title} intro={intro}>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3 text-muted-foreground">Tap the next one</p>
          <div className="flex flex-wrap gap-3">
            {pool.map((item, i) =>
              placed.includes(item) ? null : (
                <button
                  key={item}
                  onClick={() => tap(item)}
                  className={cn(
                    "rounded-2xl border-2 border-border px-4 py-3 text-left font-bold shadow-book transition-transform hover:-translate-y-1",
                    CHIP[i % CHIP.length],
                    wrong === item && "animate-shake border-oops",
                  )}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          {wrong && <p className="mt-3 font-bold text-oops">Not yet — think about what comes first!</p>}
        </div>
        <ol className="space-y-3">
          {items.map((_, i) => (
            <li
              key={i}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-2xl border-2 border-dashed border-border px-4 py-2",
                placed[i] && "animate-pop-in border-solid border-success bg-success-soft",
              )}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
              <span className="font-bold">{placed[i] ?? ""}</span>
            </li>
          ))}
        </ol>
      </div>
      {won && <p className="mt-6 text-center text-lg font-bold">🎉 Perfect order, space historian!</p>}
    </GameShell>
  );
}

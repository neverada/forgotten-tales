import { useEffect, useState } from "react";
import { GameShell, shuffle } from "./game-shell";
import { cn } from "@/lib/utils";

export function SortGame({
  title,
  intro,
  bins,
  items,
  onWin,
}: {
  title: string;
  intro: string;
  bins: [string, string];
  items: { label: string; bin: 0 | 1 }[];
  onWin: () => void;
}) {
  const [queue, setQueue] = useState(() => shuffle(items));
  const [sorted, setSorted] = useState<{ label: string; bin: 0 | 1 }[]>([]);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const current = queue[0];
  const won = queue.length === 0;

  useEffect(() => {
    if (won) {
      const t = setTimeout(onWin, 900);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [won, onWin]);

  const choose = (bin: 0 | 1) => {
    if (!current) return;
    if (current.bin === bin) {
      setSorted((s) => [...s, current]);
      setQueue((q) => q.slice(1));
      setHint(null);
    } else {
      setShake(true);
      setHint("Oops! Try the other basket.");
      setTimeout(() => setShake(false), 450);
    }
  };

  return (
    <GameShell title={title} intro={intro}>
      <div className="flex min-h-28 items-center justify-center">
        {current ? (
          <div
            key={current.label}
            className={cn("animate-pop-in rounded-3xl border-2 border-border bg-butter px-8 py-5 text-center font-display text-2xl font-bold shadow-lift", shake && "animate-shake")}
          >
            {current.label}
          </div>
        ) : (
          <p className="text-xl font-bold">🎉 Everything sorted!</p>
        )}
      </div>
      <p className="mt-2 h-6 text-center font-bold text-oops">{hint}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {bins.map((label, b) => (
          <button
            key={label}
            onClick={() => choose(b as 0 | 1)}
            disabled={!current}
            className={cn(
              "min-h-44 rounded-3xl border-4 border-dashed p-5 text-left transition-all hover:-translate-y-1",
              b === 0 ? "border-sea bg-sea-soft" : "border-peach bg-peach-soft",
            )}
          >
            <p className="font-display text-xl font-bold">{label}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sorted
                .filter((s) => s.bin === b)
                .map((s) => (
                  <span key={s.label} className="animate-pop-in rounded-full bg-card px-3 py-1 text-sm font-bold shadow-book">
                    {s.label}
                  </span>
                ))}
            </div>
          </button>
        ))}
      </div>
    </GameShell>
  );
}

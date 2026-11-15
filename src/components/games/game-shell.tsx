import { Gamepad2 } from "lucide-react";
import type { ReactNode } from "react";

export function GameShell({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="rounded-[2rem] bg-card p-6 shadow-lift md:p-10">
      <p className="eyebrow flex items-center gap-2 text-sea-deep">
        <Gamepad2 className="h-4 w-4" /> Mini game
      </p>
      <h2 className="mt-2 text-3xl font-bold">{title}</h2>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{intro}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

import { Link } from "@tanstack/react-router";
import { books } from "@/data/books";
import { Sparkle } from "@/components/art/bits";
import { worldTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const TILT = ["-rotate-3", "rotate-2", "-rotate-1"];
const HEIGHT = ["h-64 md:h-72", "h-72 md:h-80", "h-68 md:h-76"];

export function Shelf() {
  return (
    <div className="relative mx-auto mt-10 w-full max-w-3xl px-4">
      <svg className="pointer-events-none absolute inset-x-0 -top-4 h-24 w-full" viewBox="0 0 600 80" aria-hidden>
        <Sparkle x={70} y={40} size={12} filled={false} />
        <Sparkle x={300} y={30} size={12} />
        <Sparkle x={530} y={40} size={12} filled={false} delay={1.1} />
      </svg>
      <div className="flex items-end justify-center gap-6 px-6 pt-14 md:gap-10">
        {books.map((b, i) => {
          const t = worldTheme[b.world];
          return (
            <Link
              key={b.id}
              to="/book/$bookId"
              params={{ bookId: b.id }}
              aria-label={`Open ${b.title}`}
              className={cn(
                "group relative w-24 origin-bottom transition-all duration-300 hover:-translate-y-4 hover:rotate-0 md:w-28",
                TILT[i],
                HEIGHT[i],
              )}
            >
              <span className={cn("absolute inset-0 translate-x-2 rounded-xl opacity-40", t.edge)} />
              <span className={cn("absolute inset-0 overflow-hidden rounded-xl shadow-book", t.spine)}>
                <span className="absolute inset-y-0 left-0 w-2 bg-paper/40" />
                <span className="absolute inset-x-4 top-5 h-0.5 rounded bg-paper/70" />
                <span className="absolute inset-x-4 bottom-5 h-0.5 rounded bg-paper/70" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="-rotate-90 whitespace-nowrap font-display text-lg font-bold text-foreground md:text-xl">
                  {b.title}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="relative h-8 rounded-lg bg-wood shadow-soft">
        <div className="absolute inset-x-3 top-1.5 h-0.5 rounded bg-paper/60" />
        <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-lg bg-wood-deep" />
      </div>
    </div>
  );
}

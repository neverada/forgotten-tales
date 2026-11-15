import { Link } from "@tanstack/react-router";
import { SparkleIcon } from "@/components/art/bits";
import { Medal } from "@/components/art/cover";
import { useProgress } from "@/lib/progress";

export function SiteHeader({ right }: { right?: React.ReactNode }) {
  const progress = useProgress();
  const golds = Object.values(progress.chapters).filter((c) => c.badge === "gold").length;
  const silvers = Object.values(progress.chapters).filter((c) => c.badge === "silver").length;
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-6">
      <Link to="/" className="group flex items-center gap-3">
        <span className="relative grid h-11 w-11 -rotate-6 place-items-center rounded-xl bg-peach shadow-book transition-transform group-hover:rotate-6">
          <SparkleIcon className="h-5 w-5 text-foreground" />
        </span>
        <span className="font-display text-lg font-bold">Forgotten Tales</span>
      </Link>
      <div className="flex items-center gap-4">
        {right ?? <span className="eyebrow hidden text-muted-foreground md:inline">A little library of big discoveries</span>}
        <Link
          to="/badges"
          className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          <Medal kind="gold" size={18} />
          {golds}
          <Medal kind="silver" size={18} />
          {silvers}
        </Link>
      </div>
    </header>
  );
}

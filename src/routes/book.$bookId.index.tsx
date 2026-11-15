import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { getBook } from "@/data/books";
import { CraftIcon } from "@/components/art/craft";
import { CoverArt, Medal } from "@/components/art/cover";
import { SiteHeader } from "@/components/story/site-header";
import { Button } from "@/components/ui/button";
import { getChapterProgress, useProgress } from "@/lib/progress";
import { isChapterUnlocked } from "@/lib/rules";
import { worldTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$bookId/")({
  loader: ({ params }) => {
    const book = getBook(params.bookId);
    if (!book) throw notFound();
    return { bookId: book.id };
  },
  head: ({ loaderData }) => {
    const book = loaderData ? getBook(loaderData.bookId) : undefined;
    const title = book ? `${book.title} — Forgotten Tales` : "Book not found — Forgotten Tales";
    const description = book?.blurb ?? "This storybook could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BookPage,
});

function BookPage() {
  const { bookId } = Route.useLoaderData();
  const book = getBook(bookId)!;
  const progress = useProgress();
  const t = worldTheme[book.world];
  const ids = book.chapters.map((c) => c.id);
  const doneCount = book.chapters.filter((c) => getChapterProgress(progress, book.id, c.id).completed).length;
  const next = book.chapters.find((c) => !getChapterProgress(progress, book.id, c.id).completed);

  return (
    <div className="min-h-screen pb-24">
      <SiteHeader
        right={
          <Button asChild variant="paper" size="sm">
            <Link to="/">← Back to shelf</Link>
          </Button>
        }
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[320px_1fr]">
        <aside className="md:sticky md:top-6 md:self-start">
          <div className="overflow-hidden rounded-3xl shadow-lift">
            <div className="aspect-[5/6]">
              <CoverArt world={book.world} title={book.title} />
            </div>
          </div>
          <p className="eyebrow mt-6 text-muted-foreground">{book.tagline}</p>
          <p className="mt-2 text-lg text-muted-foreground">{book.blurb}</p>
          <div className="mt-5 rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex justify-between text-sm font-bold">
              <span>Your journey</span>
              <span>
                {doneCount}/{book.chapters.length}
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${(doneCount / book.chapters.length) * 100}%` }} />
            </div>
            {next ? (
              <Button asChild variant="story" size="xl" className="mt-4 w-full">
                <Link to="/book/$bookId/$chapterId" params={{ bookId: book.id, chapterId: next.id }}>
                  {doneCount ? "Continue" : "Start"} Chapter {next.number} →
                </Link>
              </Button>
            ) : (
              <p className="mt-4 rounded-xl bg-success-soft p-3 text-center font-bold">🎉 You finished this whole book!</p>
            )}
          </div>
        </aside>

        <div>
          <p className={cn("eyebrow", t.text)}>The chapter trail</p>
          <h1 className="mt-2 text-4xl font-extrabold">{book.title}</h1>
          <p className="mt-2 text-muted-foreground">Finish a chapter's game and quiz to unlock the next one. Pass a quiz on your first try for gold!</p>

          <ol className="relative mt-10 space-y-6">
            <span className="absolute bottom-8 left-9 top-8 w-0 border-l-4 border-dashed border-border" aria-hidden />
            {book.chapters.map((c, i) => {
              const p = getChapterProgress(progress, book.id, c.id);
              const unlocked = isChapterUnlocked(progress, book.id, ids, i);
              const inner = (
                <div
                  className={cn(
                    "relative flex items-center gap-5 rounded-3xl bg-card p-4 pr-6 shadow-soft transition-all",
                    unlocked ? "hover:-translate-y-1 hover:shadow-lift" : "opacity-60",
                    i % 2 ? "md:ml-12" : "",
                  )}
                >
                  <div className={cn("relative grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-2xl", t.soft)}>
                    <CraftIcon variant={c.craft} className="h-16 w-16" />
                    {!unlocked && (
                      <span className="absolute inset-0 grid place-items-center rounded-2xl bg-card/70">
                        <Lock className="h-6 w-6" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow text-muted-foreground">Chapter {c.number} · {c.when}</p>
                    <h2 className="mt-1 text-xl font-bold">{c.title}</h2>
                    <p className="mt-1 line-clamp-1 text-muted-foreground">{c.stage}</p>
                  </div>
                  <div className="shrink-0 text-center text-xs font-bold">
                    {p.completed ? (
                      p.badge ? (
                        <>
                          <Medal kind={p.badge} size={36} />
                          <span className="capitalize">{p.badge}</span>
                        </>
                      ) : (
                        <span className="rounded-full bg-success-soft px-3 py-1">Done ✓</span>
                      )
                    ) : unlocked ? (
                      <span className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">Read</span>
                    ) : (
                      <span className="text-muted-foreground">Locked</span>
                    )}
                  </div>
                </div>
              );
              return (
                <li key={c.id} className="animate-rise" style={{ animationDelay: `${i * 0.06}s` }}>
                  {unlocked ? (
                    <Link to="/book/$bookId/$chapterId" params={{ bookId: book.id, chapterId: c.id }}>
                      {inner}
                    </Link>
                  ) : (
                    <div aria-disabled>{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}

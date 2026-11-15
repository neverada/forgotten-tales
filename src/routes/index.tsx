import { createFileRoute, Link } from "@tanstack/react-router";
import { books } from "@/data/books";
import { CoverArt, Medal } from "@/components/art/cover";
import { SiteHeader } from "@/components/story/site-header";
import { Shelf } from "@/components/story/shelf";
import { Button } from "@/components/ui/button";
import { getChapterProgress, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Forgotten Tales — Talking Spacecraft Storybooks" },
      { name: "description", content: "Pick a book from the shelf and meet the Moon landers, Mars rovers and deep-space probes who tell their own stories." },
      { property: "og:title", content: "Forgotten Tales — Talking Spacecraft Storybooks" },
      { property: "og:description", content: "Interactive space stories with fun facts, mini games, quizzes and gold badges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const progress = useProgress();
  return (
    <div className="min-h-screen pb-20">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 pt-6 text-center">
        <span className="eyebrow inline-block rounded-full border-2 border-border bg-card px-5 py-2 text-muted-foreground">
          Open a world of wonder
        </span>
        <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">Where will curiosity take you?</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Pick a book from the shelf. Turn the pages. Meet the spacecraft who tell their own stories.
        </p>
        <Shelf />
        <p className="mt-5 text-muted-foreground">Tap a spine to start reading · Scroll down to discover the covers ↓</p>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <p className="eyebrow text-peach-deep">Three journeys await</p>
        <h2 className="mt-2 text-3xl font-bold">Meet the stories</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {books.map((b, i) => {
            const done = b.chapters.filter((c) => getChapterProgress(progress, b.id, c.id).completed);
            const gold = done.filter((c) => getChapterProgress(progress, b.id, c.id).badge === "gold").length;
            const silver = done.filter((c) => getChapterProgress(progress, b.id, c.id).badge === "silver").length;
            return (
              <article
                key={b.id}
                className="animate-rise group flex flex-col rounded-3xl bg-card p-3 shadow-soft transition-transform hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Link to="/book/$bookId" params={{ bookId: b.id }} className="block overflow-hidden rounded-2xl shadow-book">
                  <div className="aspect-[5/6] transition-transform duration-500 group-hover:scale-[1.03]">
                    <CoverArt world={b.world} title={b.title} />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col px-2 pt-4">
                  <p className="eyebrow text-muted-foreground">{b.tagline}</p>
                  <p className="mt-2 flex-1 text-muted-foreground">{b.blurb}</p>
                  <div className="mt-4 flex items-center justify-between text-sm font-bold">
                    <span>
                      {done.length}/{b.chapters.length} chapters
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Medal kind="gold" size={16} /> {gold}
                      <Medal kind="silver" size={16} /> {silver}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success transition-all" style={{ width: `${(done.length / b.chapters.length) * 100}%` }} />
                  </div>
                  <Button asChild variant="story" size="xl" className="mt-4 w-full">
                    <Link to="/book/$bookId" params={{ bookId: b.id }}>
                      {done.length ? "Keep reading →" : "Open this book →"}
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

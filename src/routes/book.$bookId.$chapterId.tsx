import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { getChapter } from "@/data/books";
import { ChapterExperience } from "@/components/story/chapter-experience";
import { SiteHeader } from "@/components/story/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book/$bookId/$chapterId")({
  loader: ({ params }) => {
    const result = getChapter(params.bookId, params.chapterId);
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.chapter.title} — ${loaderData.book.title}`
          : "Story — Forgotten Tales",
      },
      {
        name: "description",
        content: loaderData?.chapter.stage ?? "Read an interactive space story.",
      },
    ],
  }),
  component: ChapterPage,
});

function ChapterPage() {
  const { book, chapter } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pb-12">
      <SiteHeader
        right={
          <Button asChild variant="paper" size="sm">
            <Link to="/book/$bookId/" params={{ bookId: book.id }}>
              ← Back to book
            </Link>
          </Button>
        }
      />
      <section className="mx-auto max-w-6xl px-4 sm:px-5">
        <ChapterExperience
          book={book}
          chapter={chapter}
          onFinish={() => {
            void navigate({ to: "/book/$bookId/", params: { bookId: book.id } });
          }}
        />
      </section>
    </main>
  );
}

import { useCallback, useState } from "react";
import type { Book, Chapter } from "@/data/types";
import { LandingGame } from "@/components/games/landing-game";
import { MatchGame } from "@/components/games/match-game";
import { OrderGame } from "@/components/games/order-game";
import { SortGame } from "@/components/games/sort-game";
import { FunFacts } from "@/components/story/fun-facts";
import { Quiz } from "@/components/story/quiz";
import { getChapterProgress, markGameDone, recordQuiz, useProgress } from "@/lib/progress";
import { StoryReader } from "./story-reader";

type Step = "story" | "facts" | "game" | "quiz";

export function ChapterExperience({
  book,
  chapter,
  onFinish,
}: {
  book: Book;
  chapter: Chapter;
  onFinish: () => void;
}) {
  const [step, setStep] = useState<Step>("story");
  const progress = useProgress();
  const chapterProgress = getChapterProgress(progress, book.id, chapter.id);
  const attemptNumber = chapterProgress.attempts + 1;

  const onGameWin = useCallback(() => {
    markGameDone(book.id, chapter.id);
    setStep("quiz");
  }, [book.id, chapter.id]);

  const onQuizFinish = useCallback(
    (correct: number) => {
      if (recordQuiz(book.id, chapter.id, correct).completed) onFinish();
    },
    [book.id, chapter.id, onFinish],
  );

  if (step === "story") {
    return <StoryReader book={book} chapter={chapter} onFinish={() => setStep("facts")} />;
  }

  if (step === "facts") {
    return <FunFacts chapter={chapter} onDone={() => setStep("game")} />;
  }

  if (step === "quiz") {
    return (
      <Quiz
        key={attemptNumber}
        chapter={chapter}
        attemptNumber={attemptNumber}
        alreadyDone={chapterProgress.completed}
        onFinish={onQuizFinish}
      />
    );
  }

  const game = chapter.game;
  if (game.type === "landing") {
    return <LandingGame {...game} world={book.world} onWin={onGameWin} />;
  }
  if (game.type === "match") {
    return <MatchGame {...game} onWin={onGameWin} />;
  }
  if (game.type === "order") {
    return <OrderGame {...game} onWin={onGameWin} />;
  }
  return <SortGame {...game} onWin={onGameWin} />;
}

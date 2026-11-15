export type Badge = "gold" | "silver" | null;

export const QUIZ_PASS_MARK = 3; // correct answers needed out of each chapter's quiz

/** Gold for passing on the 1st attempt, silver on the 2nd, nothing after that. */
export function badgeForAttempt(attempt: number): Badge {
  if (attempt === 1) return "gold";
  if (attempt === 2) return "silver";
  return null;
}

export function isPassing(correct: number): boolean {
  return correct >= QUIZ_PASS_MARK;
}

export type ChapterProgress = {
  attempts: number;
  completed: boolean;
  badge: Badge;
  gameDone: boolean;
};

export type ProgressState = { chapters: Record<string, ChapterProgress> };

export const emptyChapter: ChapterProgress = { attempts: 0, completed: false, badge: null, gameDone: false };

export const chapterKey = (bookId: string, chapterId: string) => `${bookId}/${chapterId}`;

/** A chapter opens once the chapter before it has its quiz passed. Chapter 1 is always open. */
export function isChapterUnlocked(
  state: ProgressState,
  bookId: string,
  chapterIds: string[],
  index: number,
): boolean {
  if (index <= 0) return true;
  return Boolean(state.chapters[chapterKey(bookId, chapterIds[index - 1] ?? "")]?.completed);
}

/** Records one finished quiz try. Once a chapter is passed its badge never changes. */
export function applyQuizAttempt(prev: ChapterProgress, correct: number): ChapterProgress {
  if (prev.completed) return prev;
  const attempts = prev.attempts + 1;
  if (!isPassing(correct)) return { ...prev, attempts };
  return { ...prev, attempts, completed: true, badge: badgeForAttempt(attempts) };
}

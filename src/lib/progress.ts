import { useSyncExternalStore } from "react";
import {
  applyQuizAttempt,
  chapterKey,
  emptyChapter,
  type ChapterProgress,
  type ProgressState,
} from "./rules";

const KEY = "forgotten-tales-progress-v1";
const EMPTY: ProgressState = { chapters: {} };
let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function read(): ProgressState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as ProgressState) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function getChapterProgress(state: ProgressState, bookId: string, chapterId: string): ChapterProgress {
  return state.chapters[chapterKey(bookId, chapterId)] ?? emptyChapter;
}

function update(bookId: string, chapterId: string, fn: (p: ChapterProgress) => ChapterProgress) {
  const state = read();
  const key = chapterKey(bookId, chapterId);
  write({ ...state, chapters: { ...state.chapters, [key]: fn(state.chapters[key] ?? emptyChapter) } });
}

export function markGameDone(bookId: string, chapterId: string) {
  update(bookId, chapterId, (p) => ({ ...p, gameDone: true }));
}

export function recordQuiz(bookId: string, chapterId: string, correct: number): ChapterProgress {
  update(bookId, chapterId, (p) => applyQuizAttempt(p, correct));
  return getChapterProgress(read(), bookId, chapterId);
}

export function resetProgress() {
  write(EMPTY);
}

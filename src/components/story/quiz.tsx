import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, X, Volume2 } from "lucide-react";
import type { Chapter, Question } from "@/data/types";
import { Medal } from "@/components/art/cover";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/components/games/game-shell";
import { QUIZ_PASS_MARK, badgeForAttempt } from "@/lib/rules";
import { useVoice, useVoiceMode } from "@/lib/voice";
import { cn } from "@/lib/utils";

type Shuffled = Question & { order: number[] };

export function Quiz({
  chapter,
  attemptNumber,
  alreadyDone,
  onFinish,
}: {
  chapter: Chapter;
  attemptNumber: number;
  alreadyDone: boolean;
  onFinish: (correct: number) => void;
}) {
  const questions = useMemo<Shuffled[]>(
    () => chapter.quiz.map((q) => ({ ...q, order: shuffle(q.options.map((_, i) => i)) })),
    // a fresh shuffle for every attempt
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter.id, attemptNumber],
  );
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const voiceOn = useVoiceMode();
  const { play, stop } = useVoice();
  const q = questions[qi]!;
  const stake = alreadyDone ? null : badgeForAttempt(attemptNumber);

  const readQuestion = () =>
    play([{ text: q.q }, ...q.order.map((o, i) => ({ text: `${String.fromCharCode(65 + i)}. ${q.options[o]}` }))]);

  useEffect(() => {
    if (voiceOn) readQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, voiceOn]);

  const pick = (optionIndex: number) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    const right = optionIndex === q.answer;
    if (right) setCorrect((c) => c + 1);
    if (voiceOn) play([{ text: right ? `Yes! ${q.why}` : `Not quite. ${q.why}` }]);
  };

  const next = () => {
    stop();
    if (qi === questions.length - 1) return onFinish(correct);
    setQi((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="rounded-[2rem] bg-card p-6 shadow-lift md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-lavender-deep">Chapter quiz · must pass to finish</p>
          <h2 className="mt-2 text-3xl font-bold">Question {qi + 1} of {questions.length}</h2>
          <p className="mt-1 text-muted-foreground">Get {QUIZ_PASS_MARK} or more right to complete the chapter.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
          {stake ? <Medal kind={stake} size={34} /> : null}
          <div className="text-sm font-bold">
            <p>Attempt {attemptNumber}</p>
            <p className="text-muted-foreground">
              {alreadyDone ? "Practice round" : stake ? `Pass now for ${stake.toUpperCase()}` : "No badge left — but you can still finish!"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-1.5">
        {questions.map((_, i) => (
          <span key={i} className={cn("h-2 flex-1 rounded-full", i < qi ? "bg-success" : i === qi ? "bg-primary" : "bg-muted")} />
        ))}
      </div>

      <div key={qi} className="animate-rise mt-8">
        <div className="flex items-start gap-3">
          <p className="flex-1 font-display text-2xl font-bold leading-snug">{q.q}</p>
          <Button variant="paper" size="icon" onClick={readQuestion} aria-label="Read question aloud">
            <Volume2 />
          </Button>
        </div>
        <div className="mt-6 grid gap-3">
          {q.order.map((o, i) => {
            const isPicked = picked === o;
            const isAnswer = o === q.answer;
            const show = picked !== null;
            return (
              <button
                key={o}
                onClick={() => pick(o)}
                disabled={show}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border-2 bg-paper px-5 py-4 text-left text-lg font-bold transition-all",
                  !show && "border-border hover:-translate-y-0.5 hover:border-primary",
                  show && isAnswer && "animate-pop-in border-success bg-success-soft",
                  show && isPicked && !isAnswer && "animate-shake border-oops bg-oops-soft",
                  show && !isPicked && !isAnswer && "border-border opacity-60",
                )}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card font-display shadow-book">
                  {show && isAnswer ? <Check className="h-5 w-5" /> : show && isPicked ? <X className="h-5 w-5" /> : String.fromCharCode(65 + i)}
                </span>
                {q.options[o]}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="animate-pop-in mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-butter p-5">
            <p className="text-lg">
              <span className="font-bold">{picked === q.answer ? "Yes! " : "Not quite. "}</span>
              {q.why}
            </p>
            <Button variant="story" size="xl" onClick={next}>
              {qi === questions.length - 1 ? "See my score" : "Next question"} <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { speakerKind, type SpeakerKind } from "./speakers";

const PROFILES: Record<SpeakerKind | "narrator", { pitch: number; rate: number }> = {
  narrator: { pitch: 1.05, rate: 0.95 },
  moon: { pitch: 0.75, rate: 0.9 },
  mars: { pitch: 0.85, rate: 0.95 },
  space: { pitch: 0.5, rate: 0.82 },
  astronaut: { pitch: 0.95, rate: 0.98 },
  computer: { pitch: 1.6, rate: 1.08 },
  part: { pitch: 1.2, rate: 1.05 },
  mission: { pitch: 0.9, rate: 0.95 },
  craft: { pitch: 1.3, rate: 1.02 },
};

export type Utterance = { text: string; speaker?: string; audioSrc?: string; lineIndex?: number };

/** Shouty ALL-CAPS words are softened so the voice reads them as words, not letters. */
function speakable(text: string) {
  return text
    .replace(/\b([A-Z][A-Z'’]{2,})\b/g, (w) => w.charAt(0) + w.slice(1).toLowerCase())
    .replace(/\bgng\b/gi, "gang")
    .replace(/—/g, ", ");
}

export function voiceSupported() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

export function useVoiceSupported() {
  const [supported, setSupported] = useState(false);
  useEffect(() => setSupported(voiceSupported()), []);
  return supported;
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /en[-_]US/i.test(v.lang) && /Google|Samantha|Natural/i.test(v.name)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    null
  );
}

/** Reads a queue of lines aloud with a different voice "character" for each speaker. */
export function useVoice() {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    token.current++;
    if (voiceSupported()) window.speechSynthesis.cancel();
    audio.current?.pause();
    audio.current = null;
    setSpeakingIndex(null);
    setError(null);
  }, []);

  const play = useCallback(
    (items: Utterance[]) => {
      if (!voiceSupported() && !items.some((item) => item.audioSrc)) return;
      stop();
      const my = token.current;
      const voice = voiceSupported() ? pickVoice() : null;

      const playAt = (index: number) => {
        if (my !== token.current) return;
        const item = items[index];
        if (!item) {
          setSpeakingIndex(null);
          return;
        }

        setSpeakingIndex(index);
        if (item.audioSrc) {
          const currentAudio = new Audio(item.audioSrc);
          audio.current = currentAudio;
          currentAudio.onended = () => playAt(index + 1);
          currentAudio.onerror = () => {
            if (my === token.current) {
              setError("A story recording could not be played. Please try again.");
              setSpeakingIndex(null);
            }
          };
          void currentAudio.play().catch(() => {
            if (my === token.current) {
              setError("Audio playback was blocked. Press Play to try again.");
              setSpeakingIndex(null);
            }
          });
          return;
        }

        if (!voiceSupported()) {
          setError("This browser cannot read the remaining text aloud.");
          playAt(index + 1);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(speakable(item.text));
        const profile = PROFILES[item.speaker ? speakerKind(item.speaker) : "narrator"];
        utterance.pitch = profile.pitch;
        utterance.rate = profile.rate;
        if (voice) utterance.voice = voice;
        utterance.onend = () => playAt(index + 1);
        utterance.onerror = () => {
          if (my === token.current) {
            setError("Text-to-speech could not read this line.");
            setSpeakingIndex(null);
          }
        };
        window.speechSynthesis.speak(utterance);
      };

      setError(null);
      if (items.length) playAt(0);
      else setSpeakingIndex(null);
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { play, stop, speakingIndex, speaking: speakingIndex !== null, error };
}

/* ---- Voice mode on/off, remembered between visits ---- */
const VKEY = "forgotten-tales-voice";
const vListeners = new Set<() => void>();
function readVoiceMode() {
  try {
    return window.localStorage.getItem(VKEY) === "on";
  } catch {
    return false;
  }
}
export function setVoiceMode(on: boolean) {
  try {
    window.localStorage.setItem(VKEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (!on && voiceSupported()) window.speechSynthesis.cancel();
  vListeners.forEach((l) => l());
}
export function useVoiceMode(): boolean {
  return useSyncExternalStore(
    (cb) => {
      vListeners.add(cb);
      return () => vListeners.delete(cb);
    },
    readVoiceMode,
    () => false,
  );
}

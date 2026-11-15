import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setVoiceMode, useVoiceMode, useVoiceSupported } from "@/lib/voice";

export function VoiceToggle({
  onEnable,
  audioAvailable = false,
}: {
  onEnable: () => void;
  audioAvailable?: boolean;
}) {
  const on = useVoiceMode();
  const supported = useVoiceSupported() || audioAvailable;
  return (
    <Button
      variant="paper"
      size="xl"
      disabled={!supported}
      onClick={() => {
        setVoiceMode(!on);
        if (!on) onEnable();
      }}
      aria-pressed={on}
      title={
        supported
          ? "Automatically read each story page aloud"
          : "Speech is not supported in this browser"
      }
    >
      {supported && on ? <Volume2 /> : <VolumeX />}
      {!supported ? "Voice unavailable" : `Voice mode: ${on ? "On" : "Off"}`}
    </Button>
  );
}

export function PlayButton({
  speaking,
  onPlay,
  onStop,
  audioAvailable = false,
}: {
  speaking: boolean;
  onPlay: () => void;
  onStop: () => void;
  audioAvailable?: boolean;
}) {
  const supported = useVoiceSupported() || audioAvailable;
  return (
    <Button
      variant="story"
      size="xl"
      disabled={!supported}
      onClick={speaking ? onStop : onPlay}
      className={speaking ? "animate-speak" : undefined}
      title={supported ? undefined : "Speech is not supported in this browser"}
    >
      {!supported ? <VolumeX /> : speaking ? <Pause /> : <Play />}
      {!supported ? "Audio unavailable" : speaking ? "Stop" : "Play"}
    </Button>
  );
}

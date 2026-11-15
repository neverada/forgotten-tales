import type { Chapter, Line } from "@/data/types";

type AudioTrack = { chapter: number; title: string; url: string; version: number };
type SpeakerProfile = { key: string; speakers: string[]; tracks: string[] };
type LineAudio = { audioSrc?: string; skip?: boolean; text?: string };

const audioFiles = import.meta.glob<string>("/sound/Division 1/Chapter */*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});

const SPEAKERS: SpeakerProfile[] = [
  { key: "surveyor", speakers: ["Surveyor 3"], tracks: ["Surveyor 3"] },
  { key: "moon", speakers: ["The Moon"], tracks: ["The Moon"] },
  { key: "info-box", speakers: ["Info Box"], tracks: ["Info Box Narrator"] },
  { key: "neil", speakers: ["Neil Armstrong"], tracks: ["Neil Armstrong"] },
  { key: "eagle", speakers: ["Eagle (Lunar Module)"], tracks: ["Eagle"] },
  { key: "buzz", speakers: ['Edwin "Buzz" Aldrin'], tracks: ["Buzz Aldrin"] },
  {
    key: "computer",
    speakers: ["Apollo Guidance Computer"],
    tracks: ["Apollo Guidance Computer"],
  },
  {
    key: "columbia",
    speakers: ["Columbia (Command/Service Module)"],
    tracks: ["Columbia"],
  },
  { key: "collins", speakers: ["Michael Collins (Pilot)"], tracks: ["Michael Collins"] },
  {
    key: "service-module",
    speakers: ["Columbia’s Service Module"],
    tracks: ["Columbia's Service Module"],
  },
  {
    key: "parking-lot-eagle",
    speakers: ["The Parking Lot (Eagle’s Bottom Half)"],
    tracks: ["The Parking Lot – Eagle's Bottom Half"],
  },
  { key: "eagle-upper", speakers: ["Top Half of Eagle"], tracks: ["Eagle's Upper Half"] },
  {
    key: "falcon",
    speakers: ["Falcon (Apollo 15 Lunar Module)", "Falcon"],
    tracks: ["Falcon – Apollo 15 Lunar Module", "Falcon – The Big Landing Surprise"],
  },
  { key: "falcon-upper", speakers: ["Top Half of Falcon"], tracks: ["Falcon's Upper Half"] },
  { key: "moon-buggy", speakers: ["Moon Buggy"], tracks: ["Moon Buggy"] },
  { key: "apollo", speakers: ["Apollo"], tracks: ["Apollo"] },
  {
    key: "challenger",
    speakers: ["Challenger"],
    tracks: ["Challenger – Apollo 17 Lunar Module", "Challenger"],
  },
  {
    key: "parking-lot-final",
    speakers: ["The Parking Lot (All Left-Behind Spacecraft Together)"],
    tracks: ["The Parking Lot – All Left-Behind Spacecraft Together"],
  },
];

const speakerProfile = new Map(
  SPEAKERS.flatMap((profile) =>
    profile.speakers.map((name) => [normalize(name), profile] as const),
  ),
);

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function versionOf(title: string) {
  const suffix = title.match(/_\s*(\d+(?:\.\d+)?)$/);
  return suffix ? Number(suffix[1]) : 1;
}

function loadTracks(chapterNumber: number, names: string[]): AudioTrack[] {
  const nameOrder = new Map(names.map((name, index) => [normalize(name), index]));
  const tracks: AudioTrack[] = [];

  for (const [path, url] of Object.entries(audioFiles)) {
    const match = path.match(/\/Chapter (\d+)\/([^/]+)\.mp3$/i);
    if (!match || Number(match[1]) !== chapterNumber) continue;

    const title = match[2]!;
    const baseTitle = title.replace(/_\s*\d+(?:\.\d+)?$/, "");
    if (!nameOrder.has(normalize(baseTitle))) continue;
    tracks.push({ chapter: chapterNumber, title, url, version: versionOf(title) });
  }

  return tracks.sort((a, b) => {
    const nameDiff =
      nameOrder.get(normalize(a.title.replace(/_\s*\d+(?:\.\d+)?$/, "")))! -
      nameOrder.get(normalize(b.title.replace(/_\s*\d+(?:\.\d+)?$/, "")))!;
    return nameDiff || a.version - b.version || a.title.localeCompare(b.title);
  });
}

export function moonAudioForChapter(chapter: Chapter): Map<Line, LineAudio> {
  const runs: { profile: SpeakerProfile; lines: Line[] }[] = [];
  let current: { profile: SpeakerProfile; lines: Line[] } | undefined;

  for (const page of chapter.pages) {
    if (page.kind === "fact") {
      current = undefined;
      continue;
    }

    for (const line of page.lines) {
      const profile = speakerProfile.get(normalize(line.speaker));
      if (!profile) {
        current = undefined;
      } else if (current?.profile.key === profile.key) {
        current.lines.push(line);
      } else {
        current = { profile, lines: [line] };
        runs.push(current);
      }
    }
  }

  const audio = new Map<Line, LineAudio>();
  const profiles = new Set(runs.map((run) => run.profile.key));
  for (const key of profiles) {
    const profileRuns = runs.filter((run) => run.profile.key === key);
    const profile = profileRuns[0]!.profile;
    const occurrences = profileRuns.flatMap((run) => run.lines);
    const tracks = loadTracks(chapter.number, profile.tracks);

    if (tracks.length >= occurrences.length) {
      occurrences.forEach((line, index) => {
        const track = tracks[index];
        if (track) audio.set(line, { audioSrc: track.url });
      });
      continue;
    }

    profileRuns.forEach((run, index) => {
      const track = tracks[index];
      run.lines.forEach((line, lineIndex) => {
        audio.set(
          line,
          lineIndex === 0 && track
            ? { audioSrc: track.url, text: run.lines.map((item) => item.text).join(" ") }
            : { skip: true },
        );
      });
    });
  }

  return audio;
}

export function moonFactAudio(chapter: Chapter, label: string) {
  if (label === "The End") {
    return loadTracks(4, ["Final Narrator – The Apollo Legacy"])[0]?.url;
  }

  const name =
    label === "Fun Fact" && chapter.number === 2
      ? "Fun Fact – Info Box Narrator"
      : "Info Box Narrator";
  return loadTracks(chapter.number, [name])[0]?.url;
}

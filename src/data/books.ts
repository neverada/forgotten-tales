import type { Book, Chapter, Line, Page, RawSource } from "./books.helpers";
import { buildPages } from "./books.helpers";
import { moonRaw, marsRaw, deepRaw } from "./story-text";

type Meta = Omit<Chapter, "pages" | "stage" | "number">;

function assemble(raw: RawSource[], metas: Meta[]): Chapter[] {
  return metas.map((m, i) => {
    const src = raw[i]!;
    return {
      ...m,
      number: i + 1,
      stage: src.stage.replace(/^(Hardware Stage|Vibe):\s*/, ""),
      pages: buildPages(src.lines as Line[]),
    };
  });
}

const moonMeta: Meta[] = [
  {
    id: "surveyor-3",
    title: "Surveyor 3",
    when: "Robotic Lander · April 1967",
    craft: "surveyor",
    backdrop: "earth",
    tapHint: "Tap Surveyor to make it bounce",
    facts: [
      "In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean walked over to Surveyor 3 and brought pieces of it home.",
      "The Moon has no wind or rain, so footprints and tracks can stay there for millions of years.",
    ],
    game: {
      type: "landing",
      title: "Soft-land Surveyor",
      intro: "Hold the thruster button to slow down. Touch the ground gently — no basketball bounces this time!",
      gravity: 6,
      craft: "surveyor",
    },
    quiz: [
      { q: "When did Surveyor 3 land on the Moon?", options: ["1967", "1969", "1972"], answer: 0, why: "Surveyor 3 landed in April 1967 — two years before humans." },
      { q: "Why did engineers send Surveyor 3?", options: ["To bring back astronauts", "To test if the Moon's ground was solid", "To plant a flag"], answer: 1, why: "It checked whether the dust was like quicksand." },
      { q: "What happened when its radar glitched?", options: ["It bounced twice", "It flew back to Earth", "It landed upside down"], answer: 0, why: "It bounced TWICE like a basketball!" },
      { q: "What did Apollo 12 astronauts take back to Earth?", options: ["Its wheels", "Its TV camera", "Its whole body"], answer: 1, why: "They cut off its TV camera — its eyeballs got kidnapped!" },
    ],
  },
  {
    id: "apollo-11",
    title: "Eagle & Columbia",
    when: "Apollo 11 · First Crewed Landing · July 1969",
    craft: "eagle",
    backdrop: "earth",
    tapHint: "Tap Eagle to blast off",
    facts: [
      "Neil and Buzz spent about two and a half hours walking around outside on the Moon.",
      "They left a plaque on the Moon that says: “We came in peace for all mankind.”",
    ],
    game: {
      type: "sort",
      title: "Who made it home?",
      intro: "Columbia was the only spacecraft part to come home. Sort each one into the right basket!",
      bins: ["Came home to Earth", "Didn't make it home"],
      items: [
        { label: "Columbia capsule", bin: 0 },
        { label: "Neil Armstrong", bin: 0 },
        { label: "Eagle's bottom half", bin: 1 },
        { label: "Michael Collins", bin: 0 },
        { label: "Eagle's top half", bin: 1 },
        { label: "Columbia's Service Module", bin: 1 },
      ],
    },
    quiz: [
      { q: "What were Eagle's walls compared to?", options: ["Soda cans", "Brick walls", "Pillows"], answer: 0, why: "Eagle was stripped so light its walls were as thin as soda cans." },
      { q: "What did the Apollo Guidance Computer do when it got overloaded?", options: ["Shut down", "Ignored the extra junk and focused on landing", "Played music"], answer: 1, why: "It smartly ignored extra numbers and focused on landing safely." },
      { q: "Who flew Columbia alone behind the Moon?", options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins"], answer: 2, why: "Michael Collins piloted Columbia, cut off from Earth radio." },
      { q: "Where can you see the real Columbia capsule today?", options: ["On the Moon", "Smithsonian museum in Washington, D.C.", "At the bottom of the ocean"], answer: 1, why: "It's at the Smithsonian National Air and Space Museum." },
    ],
  },
  {
    id: "falcon",
    title: "Falcon",
    when: "Apollo 15 · Extended Lunar Module · July 1971",
    craft: "falcon",
    backdrop: "earth",
    tapHint: "Tap Falcon to give it a wobble",
    facts: [
      "Apollo 15 astronauts found the “Genesis Rock” — a piece of very, very old Moon crust.",
      "One full day on the Moon, from sunrise to sunrise, lasts about 29 and a half Earth days.",
    ],
    game: {
      type: "match",
      title: "Falcon's memory flip",
      intro: "Flip two cards at a time and match each clue to what it means.",
      pairs: [
        ["67 hours", "Time spent on the Moon"],
        ["11 degrees", "How much Falcon tilted"],
        ["Hammer & feather", "Hit the dirt together"],
        ["Quad 1", "Garage for the Moon Buggy"],
      ],
    },
    quiz: [
      { q: "What new thing did Falcon's side garage carry?", options: ["A helicopter", "The first Moon Buggy", "A telescope"], answer: 1, why: "Quad 1 carried the very first Moon Buggy." },
      { q: "How long did astronauts stay on the Moon with Falcon?", options: ["21 hours", "67 hours", "2 hours"], answer: 1, why: "67 hours — more than triple Eagle's 21-hour stay!" },
      { q: "Dave Scott dropped a hammer and a feather. What happened?", options: ["The hammer fell first", "The feather floated away", "They hit the ground together"], answer: 2, why: "With no air on the Moon, they landed at the same time!" },
      { q: "What did NASA do with Falcon's top half?", options: ["Crashed it into the Moon on purpose", "Brought it home", "Turned it into a rover"], answer: 0, why: "It was crashed to make a moonquake that scientists could measure." },
    ],
  },
  {
    id: "moon-buggy",
    title: "The Moon Buggy",
    when: "Lunar Roving Vehicle · 1971–1972",
    craft: "buggy",
    backdrop: "earth",
    tapHint: "Tap the Buggy to go for a drive",
    facts: [
      "The Moon Buggy ran on batteries — there was no gas station on the Moon!",
      "On Apollo 17, astronauts fixed a broken buggy fender using maps and tape.",
    ],
    game: {
      type: "sort",
      title: "Buggy gadget check",
      intro: "Did the Moon Buggy have it — or not? Sort each gadget.",
      bins: ["Moon Buggy had it", "Nope, not on the Buggy"],
      items: [
        { label: "Piano-wire tires", bin: 0 },
        { label: "GPS map", bin: 1 },
        { label: "T-bar joystick", bin: 0 },
        { label: "Spinning gyroscope", bin: 0 },
        { label: "Bouncy airbags", bin: 1 },
        { label: "Folding hinges", bin: 0 },
      ],
    },
    quiz: [
      { q: "How fast could the Moon Buggy go?", options: ["11 miles per hour", "100 miles per hour", "1 mile per hour"], answer: 0, why: "11 mph — way faster than walking astronauts!" },
      { q: "How did the buggy fit inside the lander?", options: ["It shrank", "It folded like origami", "It was carried outside on ropes"], answer: 1, why: "Spring-loaded hinges let it fold up like origami." },
      { q: "How did the buggy find its way without GPS?", options: ["A spinning gyroscope", "Asking the Moon", "Following footprints"], answer: 0, why: "A gyroscope helped it navigate." },
      { q: "Where are the Moon Buggies now?", options: ["In a museum", "Still on the Moon", "Floating in space"], answer: 1, why: "All three were left on the Moon." },
    ],
  },
  {
    id: "challenger",
    title: "Challenger",
    when: "Apollo 17 · Final Lunar Module · December 1972",
    craft: "challenger",
    backdrop: "earth",
    tapHint: "Tap Challenger for a victory hop",
    facts: [
      "Apollo 17's Gene Cernan was the last person to walk on the Moon — so far!",
      "The Apollo 17 crew snapped the famous “Blue Marble” photo of the whole round Earth.",
    ],
    game: {
      type: "order",
      title: "Build the Moon timeline",
      intro: "Tap the spacecraft in the order they reached the Moon — oldest first.",
      items: ["Surveyor 3 (1967)", "Eagle (1969)", "Falcon (1971)", "Challenger (1972)"],
    },
    quiz: [
      { q: "Challenger was the ____ Lunar Module to touch the Moon.", options: ["First", "Last", "Smallest"], answer: 1, why: "Challenger was the last and most upgraded Lunar Module." },
      { q: "How long did Challenger stay on the Moon?", options: ["A record 75 hours", "5 minutes", "A whole year"], answer: 0, why: "A record 75 hours on the surface." },
      { q: "Who did Challenger bring to the Moon for the first time?", options: ["A doctor", "A scientist-geologist", "A pilot dog"], answer: 1, why: "The first actual scientist-geologist went to the Moon." },
      { q: "What cool soil did they take from the Moon?", options: ["Blue sand", "Orange volcanic soil", "Green slime"], answer: 1, why: "The Moon complained they took its orange volcanic soil!" },
    ],
  },
];

const marsMeta: Meta[] = [
  {
    id: "sojourner",
    title: "Sojourner",
    when: "Mars Pathfinder · 1997",
    craft: "sojourner",
    backdrop: "sun",
    tapHint: "Tap Sojourner to zoom around",
    facts: [
      "Sojourner was named after Sojourner Truth, a hero who fought for freedom and equal rights.",
      "A day on Mars is called a “sol.” It lasts about 24 hours and 40 minutes.",
    ],
    game: {
      type: "match",
      title: "Tiny rover memory flip",
      intro: "Match each Sojourner number to what it means.",
      pairs: [
        ["23 pounds", "How much Sojourner weighed"],
        ["83 days", "How long it lasted"],
        ["15 bounces", "Airbag landing hops"],
        ["6 wheels", "Rocker-Bogie ride"],
      ],
    },
    quiz: [
      { q: "Sojourner was about the size of a…", options: ["Microwave oven", "School bus", "Football field"], answer: 0, why: "Only the size of a microwave oven!" },
      { q: "How did Pathfinder land on Mars?", options: ["On a runway", "Wrapped in giant airbags, bouncing", "With a parachute only"], answer: 1, why: "It bounced 15 times like a beach ball." },
      { q: "Sojourner was planned for 7 days. How long did it really last?", options: ["3 days", "83 days", "7 years"], answer: 1, why: "83 days instead of 7!" },
      { q: "How did Sojourner spot rocks and cliffs?", options: ["Tiny laser stripes", "A dog", "Its ears"], answer: 0, why: "It shot laser stripes onto the ground." },
    ],
  },
  {
    id: "spirit-opportunity",
    title: "Spirit & Opportunity",
    when: "Twin Rovers · 2004–2018",
    craft: "twins",
    backdrop: "sun",
    tapHint: "Tap the twins to race",
    facts: [
      "Mars looks red because its dusty ground is full of rusty iron.",
      "In 2018, Opportunity's last message home came during a giant dust storm that covered the whole planet.",
    ],
    game: {
      type: "sort",
      title: "Which twin was it?",
      intro: "Read each clue. Was it Spirit or Opportunity?",
      bins: ["Spirit", "Opportunity"],
      items: [
        { label: "Got stuck in deep sand", bin: 0 },
        { label: "Kept going for nearly 15 years", bin: 1 },
        { label: "Rolled for about 6 years", bin: 0 },
        { label: "Drove 28 miles — a marathon!", bin: 1 },
      ],
    },
    quiz: [
      { q: "How big were Spirit and Opportunity?", options: ["Golf-cart size", "Shoe size", "House size"], answer: 0, why: "Humans upgraded them to golf-cart size." },
      { q: "What powered the twins?", options: ["Nuclear batteries", "Solar-panel wings", "Gasoline"], answer: 1, why: "Giant solar-panel wings gave them power." },
      { q: "What were the “blueberries” the twins found?", options: ["Real fruit", "Tiny round mineral balls", "Blue rocks from Earth"], answer: 1, why: "They proved liquid water once flowed on Mars!" },
      { q: "How long were the twins supposed to work?", options: ["90 days", "15 years", "1 day"], answer: 0, why: "NASA gave them a 90-day battery timer — they smashed it." },
    ],
  },
  {
    id: "phoenix",
    title: "Phoenix",
    when: "Mars Polar Lander · 2008",
    craft: "phoenix",
    backdrop: "sun",
    tapHint: "Tap Phoenix to dig for ice",
    facts: [
      "Mars has two tiny moons named Phobos and Deimos.",
      "Phoenix spotted snow falling from clouds high in the Martian sky!",
    ],
    game: {
      type: "landing",
      title: "Land near the North Pole",
      intro: "No airbags! Fire Phoenix's rocket thrusters to land gently on the icy ground.",
      gravity: 9,
      craft: "phoenix",
    },
    quiz: [
      { q: "Phoenix was built from…", options: ["Brand new parts only", "Spare parts from earlier missions", "Moon rocks"], answer: 1, why: "It rose from the ashes of a crashed and a canceled mission." },
      { q: "Where on Mars did Phoenix land?", options: ["Near the icy North Pole", "On a volcano", "At the equator"], answer: 0, why: "It landed on fiery thrusters near the North Pole." },
      { q: "What did Phoenix find with its shovel?", options: ["Gold", "Real water ice", "Dinosaur bones"], answer: 1, why: "Frozen water just inches under the soil!" },
      { q: "What ended Phoenix's mission?", options: ["A meteor", "Freezing winter dry ice on its solar wings", "It drove off a cliff"], answer: 1, why: "Winter crushed its solar wings with dry ice." },
    ],
  },
  {
    id: "curiosity",
    title: "Curiosity",
    when: "Science Rover · 2012–Present",
    craft: "curiosity",
    backdrop: "sun",
    tapHint: "Tap Curiosity to fire its laser",
    facts: [
      "On its first birthday on Mars in 2013, Curiosity hummed “Happy Birthday” to itself!",
      "Olympus Mons on Mars is the tallest volcano in the solar system — about two and a half times taller than Mount Everest.",
    ],
    game: {
      type: "order",
      title: "Sky Crane countdown",
      intro: "Put Curiosity's trip to Mars in the right order.",
      items: [
        "Fly 350 million miles with the Cruise Stage",
        "Drop the Cruise Stage",
        "Sky Crane hovers on rocket jets",
        "Lowered down on nylon ropes",
        "Sky Crane flies away to crash",
      ],
    },
    quiz: [
      { q: "What powers Curiosity?", options: ["Solar panels", "A nuclear plutonium battery", "Wind"], answer: 1, why: "No solar panels needed — it's nuclear!" },
      { q: "What does Curiosity shoot from its head?", options: ["Water", "Lasers", "Confetti"], answer: 1, why: "It vaporizes rocks with lasers to study them." },
      { q: "How was Curiosity put on the ground?", options: ["Bouncing airbags", "A Sky Crane lowered it on ropes", "It jumped"], answer: 1, why: "Too heavy for airbags, so a Sky Crane lowered it like a spider." },
      { q: "Where has Curiosity been exploring since 2012?", options: ["Gale Crater", "Olympus Mons", "The Moon"], answer: 0, why: "It's been flexing on Gale Crater!" },
    ],
  },
  {
    id: "perseverance",
    title: "Perseverance",
    when: "Rover 2.0 · 2021–Present",
    craft: "perseverance",
    backdrop: "sun",
    tapHint: "Tap Perseverance to drop a sample",
    facts: [
      "Perseverance landed in Jezero Crater — a place that was once a lake billions of years ago.",
      "It carries a tiny chip with almost 11 million names of people from Earth.",
    ],
    game: {
      type: "match",
      title: "Gadget memory flip",
      intro: "Match each Perseverance gadget to its job.",
      pairs: [
        ["MOXIE", "Turns Mars air into oxygen"],
        ["Microphones", "Hear the Martian wind"],
        ["Titanium tubes", "Hold rock samples"],
        ["Curvy treads", "Tougher wheels"],
      ],
    },
    quiz: [
      { q: "Why did Perseverance get tougher wheels?", options: ["Sharp rocks poked holes in Curiosity's wheels", "To go faster", "For style"], answer: 0, why: "Engineers learned from Curiosity's damaged wheels." },
      { q: "How many cameras does Perseverance have?", options: ["2", "23", "100"], answer: 1, why: "23 cameras — plus microphones!" },
      { q: "What does MOXIE make?", options: ["Oxygen", "Pizza", "Electricity"], answer: 0, why: "It turns Mars's toxic air into breathable oxygen." },
      { q: "How many sample tubes did it drop on the ground?", options: ["1", "10", "50"], answer: 1, why: "10 tubes like shiny breadcrumbs!" },
    ],
  },
  {
    id: "ingenuity",
    title: "Ingenuity",
    when: "Mars Helicopter · 2021–2024",
    craft: "ingenuity",
    backdrop: "sun",
    tapHint: "Tap Ingenuity to take off",
    facts: [
      "Ingenuity made its first flight on April 19, 2021.",
      "Its first take-off spot on Mars was named “Wright Brothers Field.”",
    ],
    game: {
      type: "landing",
      title: "Helicopter touchdown",
      intro: "Mars air is super thin! Spin the blades (hold the button) to land Ingenuity softly.",
      gravity: 8,
      craft: "ingenuity",
    },
    quiz: [
      { q: "Ingenuity was the first ____ to fly on another planet.", options: ["Helicopter", "Airplane", "Bird"], answer: 0, why: "The FIRST helicopter in history on another world!" },
      { q: "How did Ingenuity travel to Mars?", options: ["On its own", "Tucked under Perseverance's belly", "Inside Curiosity"], answer: 1, why: "Like a baby kangaroo in a pouch!" },
      { q: "It was supposed to fly 5 times. How many flights did it make?", options: ["5", "20", "72"], answer: 2, why: "72 flights!" },
      { q: "What special piece does Ingenuity carry?", options: ["A Moon rock", "Fabric from the Wright Brothers' 1903 airplane", "A gold coin"], answer: 1, why: "A tiny piece of the very first airplane." },
    ],
  },
];

const deepMeta: Meta[] = [
  {
    id: "pioneer-10",
    title: "Pioneer 10",
    when: "Deep-Space Probe · 1972–2003",
    craft: "pioneer",
    backdrop: "jupiter",
    tapHint: "Tap Pioneer to drift through space",
    facts: [
      "Jupiter is so huge that more than 1,300 Earths could fit inside it.",
      "Pioneer 10's very last faint signal reached Earth in January 2003.",
    ],
    game: {
      type: "sort",
      title: "Pack Unc's gear",
      intro: "Which of these did Pioneer 10 really carry?",
      bins: ["Pioneer 10 had it", "No way, Unc"],
      items: [
        { label: "Nuclear batteries (RTGs)", bin: 0 },
        { label: "Solar panels", bin: 1 },
        { label: "Big 9-foot dish", bin: 0 },
        { label: "Six wheels", bin: 1 },
        { label: "Gold plaque with humans", bin: 0 },
        { label: "Bouncy airbags", bin: 1 },
      ],
    },
    quiz: [
      { q: "Pioneer 10 was the first spacecraft to visit which planet?", options: ["Mars", "Jupiter", "Neptune"], answer: 1, why: "First one ever to visit Jupiter." },
      { q: "What dangerous zone did Pioneer 10 cross?", options: ["The Asteroid Belt", "The Ocean of Storms", "Gale Crater"], answer: 0, why: "Everyone thought asteroids would shred it — Unc didn't flinch." },
      { q: "Why didn't Pioneer 10 need solar panels?", options: ["It had nuclear batteries", "It slept a lot", "It used wind power"], answer: 0, why: "Nuclear plutonium batteries (RTGs) kept it going far from the Sun." },
      { q: "What is on Pioneer 10's gold plaque?", options: ["A pizza recipe", "A drawing of humans and where Earth is", "A map of Mars"], answer: 1, why: "Just in case aliens pull up!" },
    ],
  },
  {
    id: "voyager-1",
    title: "Voyager 1",
    when: "Interstellar Probe · 1977–Present",
    craft: "voyager1",
    backdrop: "saturn",
    tapHint: "Tap Voyager to play its Golden Record",
    facts: [
      "A radio message from Voyager 1 takes almost a whole day to reach Earth.",
      "Voyager 1 is the farthest human-made object from Earth — ever.",
    ],
    game: {
      type: "match",
      title: "Golden memory flip",
      intro: "Match each Voyager 1 clue to its meaning.",
      pairs: [
        ["Golden Record", "Earth's sounds & music"],
        ["Pale Blue Dot", "Earth as one tiny pixel"],
        ["2012", "Entered interstellar space"],
        ["55 languages", "Greetings for aliens"],
      ],
    },
    quiz: [
      { q: "How fast is Voyager 1 moving?", options: ["38,000 mph", "11 mph", "500 mph"], answer: 0, why: "38,000 miles per hour!" },
      { q: "What is the “Pale Blue Dot”?", options: ["A blue planet near Pluto", "Earth seen as a tiny speck", "A blue star"], answer: 1, why: "Earth looked like one single pixel from 3.7 billion miles away." },
      { q: "What happened in 2012?", options: ["It landed on Saturn", "It entered interstellar space", "It came home"], answer: 1, why: "The first human-made object to leave the Sun's bubble." },
      { q: "What does the Golden Record hold?", options: ["Earth sounds, music and greetings", "Gold coins", "Moon rocks"], answer: 0, why: "Greetings in 55 languages — and a needle to play it!" },
    ],
  },
  {
    id: "voyager-2",
    title: "Voyager 2",
    when: "Interstellar Probe · 1977–Present",
    craft: "voyager2",
    backdrop: "neptune",
    tapHint: "Tap Voyager 2 to slingshot",
    facts: [
      "Neptune has the fastest winds in the whole solar system.",
      "Uranus spins tipped over on its side, rolling around the Sun like a ball.",
    ],
    game: {
      type: "order",
      title: "The Grand Tour",
      intro: "Tap the giant planets in the order Voyager 2 visited them.",
      items: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    },
    quiz: [
      { q: "How did Voyager 2 get free speed?", options: ["Using planets' gravity like a slingshot", "Extra-big fuel tanks", "Solar sails"], answer: 0, why: "Gravity slingshots — zero extra fuel." },
      { q: "How often do the outer planets line up for the Grand Tour?", options: ["Every year", "Once every 175 years", "Never"], answer: 1, why: "Once every 175 years!" },
      { q: "Voyager 2 is the only spacecraft to visit…", options: ["Uranus and Neptune", "The Sun", "Mars"], answer: 0, why: "It visited all four giant planets." },
      { q: "When did Voyager 2 cross into interstellar space?", options: ["1977", "2018", "2003"], answer: 1, why: "In 2018 — still whispering on 1970s hardware." },
    ],
  },
  {
    id: "new-horizons",
    title: "New Horizons",
    when: "Flyby Probe · 2006–Present",
    craft: "newhorizons",
    backdrop: "pluto",
    tapHint: "Tap New Horizons to zoom past Pluto",
    facts: [
      "Pluto's giant heart is named Tombaugh Regio, after Clyde Tombaugh, who discovered Pluto.",
      "A little bit of Clyde Tombaugh's ashes is riding along on New Horizons.",
    ],
    game: {
      type: "sort",
      title: "What's on Pluto?",
      intro: "Did New Horizons see it on Pluto — or not?",
      bins: ["Seen on Pluto", "Not on Pluto"],
      items: [
        { label: "Giant frozen heart", bin: 0 },
        { label: "Big shiny rings", bin: 1 },
        { label: "Floating blue haze", bin: 0 },
        { label: "Green rainforests", bin: 1 },
        { label: "Icy mountains", bin: 0 },
        { label: "Oceans of hot lava", bin: 1 },
      ],
    },
    quiz: [
      { q: "How long did New Horizons take to pass the Moon?", options: ["9 hours", "9 days", "9 years"], answer: 0, why: "Just nine hours — fastest launch ever!" },
      { q: "New Horizons is shaped like a…", options: ["Grand piano", "Bicycle", "Banana"], answer: 0, why: "Built light, shaped like a grand piano." },
      { q: "Pluto's giant heart is made of…", options: ["Nitrogen glaciers", "Chocolate", "Lava"], answer: 0, why: "A frozen heart of nitrogen glaciers." },
      { q: "What did New Horizons fly past after Pluto?", options: ["Arrokoth, a snowman-shaped space rock", "The Sun", "Jupiter"], answer: 0, why: "Arrokoth — 4 billion miles out!" },
    ],
  },
];

export const books: Book[] = [
  {
    id: "moon-makers",
    title: "The Moon Makers",
    world: "moon",
    tagline: "Moon · 1967–1972",
    blurb: "A bouncing robot, soda-can landers and a folding Moon Buggy spill the tea on how we reached the Moon.",
    chapters: assemble(moonRaw, moonMeta),
  },
  {
    id: "mars-message",
    title: "The Mars Message",
    world: "mars",
    tagline: "Mars · 1997–2024",
    blurb: "Six brave robots roll, dig, zap and fly across the red planet searching for clues.",
    chapters: assemble(marsRaw, marsMeta),
  },
  {
    id: "beyond-the-blue",
    title: "Beyond the Blue",
    world: "deep",
    tagline: "Deep Space · 1972–Now",
    blurb: "Four calm, cool travelers drift past giant planets carrying Earth's messages into the dark.",
    chapters: assemble(deepRaw, deepMeta),
  },
];

export function getBook(id: string) {
  return books.find((b) => b.id === id);
}

export function getChapter(bookId: string, chapterId: string) {
  const book = getBook(bookId);
  const index = book?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  if (!book || index < 0) return undefined;
  return { book, chapter: book.chapters[index], index };
}

export type { Page };

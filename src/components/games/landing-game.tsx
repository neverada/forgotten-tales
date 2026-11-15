import { useCallback, useEffect, useRef, useState } from "react";
import { Flame, RotateCcw } from "lucide-react";
import type { CraftVariant } from "@/data/types";
import { Craft } from "@/components/art/craft";
import { Stars } from "@/components/art/bits";
import { Button } from "@/components/ui/button";
import { GameShell } from "./game-shell";
import { cn } from "@/lib/utils";

export const SAFE_SPEED = 10; // units per second at touchdown
const FUEL_BURN = 20; // per second
const W = 360;
const H = 420;
const GROUND = 380;

type Status = "ready" | "flying" | "landed" | "crashed";

export function LandingGame({ title, intro, gravity, craft, world, onWin }: { title: string; intro: string; gravity: number; craft: CraftVariant; world: "moon" | "mars" | "deep"; onWin: () => void }) {
  const [status, setStatus] = useState<Status>("ready");
  const [alt, setAlt] = useState(100);
  const [speed, setSpeed] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [thrusting, setThrusting] = useState(false);
  const sim = useRef({ alt: 100, v: 0, fuel: 100, thrust: false });

  const reset = useCallback(() => {
    sim.current = { alt: 100, v: 2, fuel: 100, thrust: false };
    setAlt(100);
    setSpeed(2);
    setFuel(100);
    setThrusting(false);
    setStatus("flying");
  }, []);

  const setThrust = useCallback((on: boolean) => {
    sim.current.thrust = on;
    setThrusting(on);
  }, []);

  useEffect(() => {
    if (status !== "flying") return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = sim.current;
      const burning = s.thrust && s.fuel > 0;
      const accel = gravity - (burning ? gravity * 2.2 : 0);
      s.v += accel * dt;
      s.alt = Math.min(110, s.alt - s.v * dt);
      if (s.alt >= 110) s.v = Math.max(s.v, 0);
      if (burning) s.fuel = Math.max(0, s.fuel - FUEL_BURN * dt);
      if (s.alt <= 0) {
        s.alt = 0;
        setAlt(0);
        setSpeed(s.v);
        setStatus(s.v <= SAFE_SPEED ? "landed" : "crashed");
        sim.current.thrust = false;
        setThrusting(false);
        return;
      }
      setAlt(s.alt);
      setSpeed(s.v);
      setFuel(s.fuel);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status, gravity]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setThrust(true);
      }
    };
    const up = (e: KeyboardEvent) => e.code === "Space" && setThrust(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [setThrust]);

  useEffect(() => {
    if (status === "landed") {
      const t = setTimeout(onWin, 1400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [status, onWin]);

  const craftY = 20 + (1 - alt / 100) * (GROUND - 130 - 20);
  const safe = speed <= SAFE_SPEED;
  const ground = world === "mars" ? "var(--mars-ground)" : "var(--moon-ground)";
  const groundDeep = world === "mars" ? "var(--mars-ground-deep)" : "var(--moon-ground-deep)";
  const sky = world === "mars" ? "var(--peach-soft)" : "var(--lavender-soft)";

  return (
    <GameShell title={title} intro={intro}>
      <div className="grid items-center gap-8 md:grid-cols-[1fr_260px]">
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-soft">
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full select-none" role="img" aria-label="Landing game">
            <rect width={W} height={H} fill={sky} />
            <Stars w={W} h={260} count={20} seed={7} color="var(--lavender-deep)" />
            <path d={`M0 ${GROUND} Q90 ${GROUND - 18} 180 ${GROUND} T${W} ${GROUND} V${H} H0Z`} fill={ground} />
            <path d={`M0 ${GROUND + 18} Q120 ${GROUND + 6} 220 ${GROUND + 20} T${W} ${GROUND + 14} V${H} H0Z`} fill={groundDeep} />
            <rect x={130} y={GROUND - 4} width={100} height={8} rx={4} fill="var(--paper)" opacity={0.7} />
            <g transform={`translate(110 ${craftY}) scale(0.7)`} className={status === "crashed" ? "animate-hop" : undefined} style={{ transformBox: "fill-box" }}>
              {thrusting && fuel > 0 && (
                <g className="animate-flame">
                  <path d="M80 186 Q100 250 120 186 Z" fill="var(--peach)" />
                  <path d="M90 186 Q100 225 110 186 Z" fill="var(--butter)" />
                </g>
              )}
              <Craft variant={craft} />
            </g>
          </svg>
          {status === "ready" && (
            <div className="absolute inset-0 grid place-items-center bg-card/50 backdrop-blur-[2px]">
              <Button variant="story" size="xl" onClick={reset}>
                Start descent
              </Button>
            </div>
          )}
          {(status === "crashed" || status === "landed") && (
            <div className="animate-pop-in absolute inset-x-4 top-4 rounded-2xl bg-card p-4 text-center shadow-lift">
              {status === "landed" ? (
                <p className="font-display text-xl font-bold">🎉 Touchdown! Soft as a pillow.</p>
              ) : (
                <>
                  <p className="font-display text-xl font-bold">Boing! Too fast — {speed.toFixed(0)} speed.</p>
                  <p className="text-muted-foreground">Land at {SAFE_SPEED} or slower. Try again!</p>
                  <Button variant="story" className="mt-3" onClick={reset}>
                    <RotateCcw /> Try again
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Gauge label="Height" value={alt} max={100} tone="bg-lavender-deep" />
          <Gauge label="Fuel" value={fuel} max={100} tone="bg-gold" />
          <div className={cn("rounded-2xl p-4 text-center transition-colors", safe ? "bg-success-soft" : "bg-oops-soft")}>
            <p className="eyebrow text-muted-foreground">Falling speed</p>
            <p className="font-display text-4xl font-bold">{speed.toFixed(0)}</p>
            <p className="text-sm font-bold">{safe ? "Safe to land ✓" : "Too fast! Fire thrusters"}</p>
          </div>
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              setThrust(true);
            }}
            onPointerUp={() => setThrust(false)}
            onPointerLeave={() => setThrust(false)}
            onPointerCancel={() => setThrust(false)}
            onContextMenu={(e) => e.preventDefault()}
            disabled={status !== "flying"}
            className={cn(
              "flex w-full touch-none select-none items-center justify-center gap-2 rounded-2xl bg-accent py-6 font-display text-xl font-bold text-accent-foreground shadow-lift transition-transform disabled:opacity-40",
              thrusting && "scale-95",
            )}
          >
            <Flame className="h-6 w-6" /> Hold to fire
          </button>
          <p className="text-center text-sm text-muted-foreground">Or hold the space bar</p>
        </div>
      </div>
    </GameShell>
  );
}

function Gauge({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${(Math.max(0, value) / max) * 100}%` }} />
      </div>
    </div>
  );
}

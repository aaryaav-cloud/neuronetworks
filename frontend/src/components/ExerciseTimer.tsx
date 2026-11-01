import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ExerciseTimer as Timer } from '../api';

type PhaseKind = 'ready' | 'hold' | 'rest' | 'switch';

interface Phase {
  kind: PhaseKind;
  secs: number;
  cue: string;
  rep: number;
  side: number;
}

const READY_SECS = 5;
const SWITCH_SECS = 8;
const LABEL: Record<PhaseKind, string> = { ready: 'Get ready', hold: 'Hold', rest: 'Relax', switch: 'Switch sides' };

// Turns a card's timer settings into the list of steps the timer walks through.
function buildPhases(t: Timer): Phase[] {
  const phases: Phase[] = [{ kind: 'ready', secs: READY_SECS, cue: 'Get into your starting position', rep: 1, side: 1 }];
  for (let side = 1; side <= t.sides; side++) {
    for (let rep = 1; rep <= t.reps; rep++) {
      phases.push({ kind: 'hold', secs: t.hold, cue: t.holdCue, rep, side });
      if (rep < t.reps && t.rest > 0) phases.push({ kind: 'rest', secs: t.rest, cue: t.restCue, rep, side });
    }
    if (side < t.sides) {
      phases.push({ kind: 'switch', secs: SWITCH_SECS, cue: 'Now get ready on your other side', rep: 1, side: side + 1 });
    }
  }
  return phases;
}

export function totalSeconds(t: Timer): number {
  return buildPhases(t).reduce((sum, p) => sum + p.secs, 0);
}

export function formatDuration(secs: number): string {
  if (secs < 60) return `${secs} seconds`;
  const m = Math.round(secs / 60);
  return `about ${m} minute${m === 1 ? '' : 's'}`;
}

export function describeTimer(t: Timer): string {
  const reps = t.reps === 1 ? `Hold for ${t.hold} seconds` : `${t.reps} times, ${t.hold} second${t.hold === 1 ? '' : 's'} each`;
  return t.sides === 2 ? `${reps}, on each side` : reps;
}

const RADIUS = 88;
const CIRC = 2 * Math.PI * RADIUS;

export default function ExerciseTimer({ timer, onFinish }: { timer: Timer; onFinish?: () => void }) {
  const phases = useMemo(() => buildPhases(timer), [timer]);
  const [index, setIndex] = useState(0);
  const [leftMs, setLeftMs] = useState(phases[0].secs * 1000);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [sound, setSound] = useState(true);

  const indexRef = useRef(0);
  const leftRef = useRef(phases[0].secs * 1000);
  const lastRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const chime = useCallback((high: boolean) => {
    const ctx = audioRef.current;
    if (!ctx || !soundRef.current) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = high ? 660 : 520;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch {
      /* sound is optional */
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    lastRef.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      leftRef.current -= now - lastRef.current;
      lastRef.current = now;
      if (leftRef.current <= 0) {
        const next = indexRef.current + 1;
        if (next >= phases.length) {
          leftRef.current = 0;
          setLeftMs(0);
          setRunning(false);
          setDone(true);
          chime(true);
          onFinish?.();
          return;
        }
        indexRef.current = next;
        leftRef.current = phases[next].secs * 1000;
        setIndex(next);
        chime(phases[next].kind === 'hold');
      }
      setLeftMs(leftRef.current);
    }, 200);
    return () => window.clearInterval(id);
  }, [running, phases, chime, onFinish]);

  function start() {
    if (!audioRef.current) {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioRef.current = new Ctx();
      } catch {
        audioRef.current = null;
      }
    }
    audioRef.current?.resume?.().catch(() => {});
    setStarted(true);
    setRunning(true);
  }

  function restart() {
    indexRef.current = 0;
    leftRef.current = phases[0].secs * 1000;
    setIndex(0);
    setLeftMs(leftRef.current);
    setDone(false);
    setStarted(false);
    setRunning(false);
  }

  const phase = phases[index];
  const progress = done ? 1 : 1 - leftMs / (phase.secs * 1000);
  const seconds = Math.max(0, Math.ceil(leftMs / 1000));
  const kind: PhaseKind | 'done' = done ? 'done' : phase.kind;

  return (
    <div className={`timer timer-${kind}${running ? ' is-running' : ''}`}>
      <div className="timer-dial">
        <div className="breath" aria-hidden="true" />
        <svg viewBox="0 0 200 200" className="ring" aria-hidden="true">
          <circle cx="100" cy="100" r={RADIUS} className="ring-track" />
          <circle
            cx="100" cy="100" r={RADIUS} className="ring-fill"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="timer-center">
          {done ? (
            <span className="timer-done-mark" aria-hidden="true">✓</span>
          ) : (
            <>
              <span className="timer-phase">{LABEL[phase.kind]}</span>
              <span className="timer-seconds">{seconds}</span>
              <span className="timer-unit">seconds</span>
            </>
          )}
        </div>
      </div>

      <div className="timer-text" aria-live="polite">
        {done ? (
          <>
            <p className="timer-cue">All done. Nice, steady work.</p>
            <p className="timer-count">Take a slow breath before the next one.</p>
          </>
        ) : !started ? (
          <>
            <p className="timer-cue">{describeTimer(timer)}</p>
            <p className="timer-count">Takes {formatDuration(totalSeconds(timer))}. Press Start when you're ready.</p>
          </>
        ) : (
          <>
            <p className="timer-cue">{phase.cue}</p>
            <p className="timer-count">
              {phase.kind !== 'ready' && phase.kind !== 'switch' && `Repetition ${phase.rep} of ${timer.reps}`}
              {timer.sides === 2 && phase.kind !== 'ready' && ` · Side ${phase.side} of 2`}
            </p>
          </>
        )}
      </div>

      <div className="timer-controls">
        {done ? (
          <button type="button" className="btn-outline btn-big" onClick={restart}>Do it again</button>
        ) : !started ? (
          <button type="button" className="btn-primary btn-big" onClick={start}>Start</button>
        ) : (
          <>
            <button type="button" className="btn-primary btn-big" onClick={() => setRunning((r) => !r)}>
              {running ? 'Pause' : 'Resume'}
            </button>
            <button type="button" className="btn-outline btn-big" onClick={restart}>Start over</button>
          </>
        )}
        <button
          type="button"
          className="sound-toggle"
          aria-pressed={sound}
          onClick={() => setSound((s) => !s)}
        >
          {sound ? 'Sound on' : 'Sound off'}
        </button>
      </div>
    </div>
  );
}

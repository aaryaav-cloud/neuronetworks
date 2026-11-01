import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ApiError, api, type Checkin, type Plan, type PlanExercise } from '../api';
import { useAuth } from '../auth';
import ExerciseTimer, { describeTimer, formatDuration, totalSeconds } from '../components/ExerciseTimer';
import { Alert } from '../components/Fields';
import { IMAGE_CREDIT, exerciseImage } from '../exerciseImages';
import { MOODS, SYMPTOMS } from '../symptoms';

interface PlanState {
  checkin: Checkin;
  plan: Plan;
}

const EFFORT = ['', 'Gentle', 'Moderate', 'Challenging'];
const KIND = { stretch: 'Stretch', range: 'Range of motion', strength: 'Strength', core: 'Core' } as const;

const CARD_CREDIT =
  'Exercises, benefits, tips and illustrations are from the Brachial Plexus Program Exercise Cards by Lynnette Rasmussen, OTRL, Brachial Plexus Program, Michigan Medicine. © 2017 Regents of the University of Michigan. Used with credit for educational purposes. NeuroNetworks matched the cards’ benefits to symptoms; this is not medical advice.';

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] || 'friend';
  return first.charAt(0).toUpperCase() + first.slice(1);
}

// Steps on the cards start with "Inhale:" / "Exhale:" or a position label. Show it in bold.
function Step({ text }: { text: string }) {
  const m = text.match(/^(Inhale|Exhale|Standing or sitting|Standing|Lying on back):\s*(.*)$/);
  if (!m) return <li>{text}</li>;
  return (
    <li>
      <strong>{m[1]}:</strong> {m[2]}
    </li>
  );
}

function Picture({ ex, size }: { ex: PlanExercise; size: 'large' | 'thumb' }) {
  const src = exerciseImage(ex.id);
  if (!src) {
    return (
      <div className={`picture picture-${size} picture-empty`} role="img" aria-label={`No picture yet for ${ex.name}`}>
        <span className="picture-empty-no">{ex.id}</span>
        {size === 'large' && <span className="picture-empty-text">Picture coming soon. Follow the steps below.</span>}
      </div>
    );
  }
  return (
    <img
      className={`picture picture-${size}`}
      src={src}
      alt={size === 'large' ? `Drawing of a person doing the ${ex.name} exercise` : ''}
      loading={size === 'thumb' ? 'lazy' : 'eager'}
    />
  );
}

export default function Recommended() {
  const location = useLocation();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const state = location.state as Partial<PlanState> | null;
  const handedOver = state?.checkin && state?.plan?.exercises ? (state as PlanState) : null;

  const [data, setData] = useState<PlanState | null>(handedOver);
  const [loading, setLoading] = useState(!handedOver);
  const [error, setError] = useState('');
  const [noCheckin, setNoCheckin] = useState(false);

  useEffect(() => {
    if (handedOver) return;
    api
      .latestPlan()
      .then(setData)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNoCheckin(true);
        else setError((err as Error).message);
      })
      .finally(() => setLoading(false));
  }, [handedOver]);

  const rawStep = Number(params.get('step'));
  const exercises = data?.plan.exercises ?? [];
  // step: 0 = overview, 1..n = an exercise, n+1 = finished
  const step = Number.isInteger(rawStep) && rawStep >= 0 && rawStep <= exercises.length + 1 ? rawStep : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  function go(next: number) {
    setParams(next === 0 ? {} : { step: String(next) }, { state: location.state, replace: false });
  }

  const name = user ? firstName(user.name) : 'friend';

  let body;
  if (loading) {
    body = <p className="muted calm-status" role="status">Loading your exercises…</p>;
  } else if (noCheckin || (!data && !error)) {
    body = (
      <section className="calm-empty">
        <h1>Your exercises</h1>
        <p className="muted">Tell us how you feel today and which pain you have. We'll pick gentle exercises for you.</p>
        <Link to="/welcome" className="btn-primary btn-big">Start today's check-in</Link>
      </section>
    );
  } else if (error || !data) {
    body = <Alert kind="error">{error}</Alert>;
  } else if (step === 0) {
    body = <Overview data={data} name={name} onBegin={() => go(1)} onOpen={(i) => go(i + 1)} />;
  } else if (step <= exercises.length) {
    body = (
      <ExerciseStep
        key={exercises[step - 1].id}
        ex={exercises[step - 1]}
        index={step - 1}
        total={exercises.length}
        guidance={data.plan.guidance}
        onPrev={() => go(step - 1)}
        onNext={() => go(step + 1)}
        onJump={(i) => go(i + 1)}
      />
    );
  } else {
    body = (
      <section className="calm-finish">
        <div className="finish-mark" aria-hidden="true">✓</div>
        <h1>You did it, {name}.</h1>
        <p className="lead">
          You finished today's {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}. Drink some water and
          rest your arm. Small steps every few days add up.
        </p>
        <p className="muted">{data.plan.guidance.howOften}</p>
        <div className="finish-actions">
          <Link to="/welcome" className="btn-primary btn-big">Back to check-in</Link>
          <button type="button" className="btn-outline btn-big" onClick={() => go(0)}>See today's plan again</button>
        </div>
      </section>
    );
  }

  return (
    <div className="calm">
      <header className="calm-top">
        <div className="calm-top-inner">
          <Link to="/welcome" className="calm-brand" aria-label="NeuroNetworks, back to check-in">
            <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="19" fill="#3B5258" />
              <path d="M9 14 C16 14 18 20 24 20 M9 20 H24 M9 26 C16 26 18 20 24 20 M24 20 L31 14 M24 20 L31 26" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <circle cx="24" cy="20" r="2.6" fill="#F4C08A" />
            </svg>
            <span>NeuroNetworks</span>
          </Link>
          <Link to="/welcome" className="back-link"><span aria-hidden="true">←</span> Check-in</Link>
        </div>
      </header>

      <main className="calm-main">{body}</main>

      <footer className="calm-credit">
        <p>{CARD_CREDIT}</p>
      </footer>
    </div>
  );
}

function Overview({ data, name, onBegin, onOpen }: { data: PlanState; name: string; onBegin: () => void; onOpen: (i: number) => void }) {
  const { checkin, plan } = data;
  const chosen = SYMPTOMS.filter((s) => checkin.symptoms.includes(s.id));
  const totalMins = Math.max(1, Math.round(plan.exercises.reduce((s, e) => s + totalSeconds(e.timer), 0) / 60));
  const day = new Date(checkin.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <section className="overview">
      <div className="overview-hero">
        <span className="eyebrow">{day}</span>
        <h1>Here's your plan for today, {name}.</h1>
        <p className="lead">{plan.message}</p>
      </div>

      <div className="checkin-summary">
        <div className="summary-rating">
          <span className="summary-number">{checkin.rating}</span>
          <span className="summary-label">
            out of 10
            <br />
            <strong>{MOODS[checkin.rating]}</strong>
          </span>
        </div>
        <div className="summary-symptoms">
          <span className="summary-heading">Your pain today</span>
          {chosen.length ? (
            <div className="chips">
              {chosen.map((s) => <span key={s.id} className="chip chip-symptom">{s.title}</span>)}
            </div>
          ) : (
            <span className="muted small">No symptoms chosen</span>
          )}
        </div>
        <div className="summary-time">
          <span className="summary-heading">Time</span>
          <strong>About {totalMins} min</strong>
          <span className="muted small">{plan.exercises.length} exercises</span>
        </div>
      </div>

      <ol className="tiles">
        {plan.exercises.map((ex, i) => (
          <li key={ex.id}>
            <button type="button" className="tile" onClick={() => onOpen(i)}>
              <Picture ex={ex} size="thumb" />
              <span className="tile-body">
                <span className="tile-step">Exercise {i + 1}</span>
                <span className="tile-name">{ex.name}</span>
                <span className="tile-meta">{EFFORT[ex.effort]} · {formatDuration(totalSeconds(ex.timer))}</span>
                {ex.reasons[0] && <span className="tile-why">{ex.reasons[0].reason}</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="safety" role="note">
        <strong>Before you start:</strong> {plan.guidance.beforeYouBegin} Stop any exercise that causes pain, shortness of
        breath, or dizziness.
      </div>

      <button type="button" className="btn-primary btn-big btn-wide" onClick={onBegin}>
        Begin with {plan.exercises[0]?.name}
      </button>

      {plan.skipped.length > 0 && (
        <details className="skipped">
          <summary>Exercises we left out today ({plan.skipped.length})</summary>
          <ul>
            {plan.skipped.map((s) => (
              <li key={`${s.id}-${s.symptomTitle}`}>
                <strong>{s.name}</strong> (card {s.id}), because of {s.symptomTitle.toLowerCase()}: {s.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function ExerciseStep({
  ex, index, total, guidance, onPrev, onNext, onJump,
}: {
  ex: PlanExercise; index: number; total: number; guidance: Plan['guidance'];
  onPrev: () => void; onNext: () => void; onJump: (i: number) => void;
}) {
  const isLast = index === total - 1;

  return (
    <section className="session">
      <nav className="progress" aria-label="Exercises">
        <span className="progress-label">Exercise {index + 1} of {total}</span>
        <ol className="progress-dots">
          {Array.from({ length: total }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                className={i === index ? 'dot on' : i < index ? 'dot past' : 'dot'}
                aria-label={`Go to exercise ${i + 1}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => onJump(i)}
              />
            </li>
          ))}
        </ol>
      </nav>

      <div className="session-grid">
        <figure className="session-figure">
          <Picture ex={ex} size="large" />
          {exerciseImage(ex.id) && <figcaption>{IMAGE_CREDIT}</figcaption>}
        </figure>

        <div className="session-side">
          <div className="session-head">
            <span className="card-chip">Card {ex.id}</span>
            <h1>{ex.name}</h1>
            <div className="chips">
              <span className={`chip effort-${ex.effort}`}>{EFFORT[ex.effort]}</span>
              <span className="chip">{KIND[ex.kind]}</span>
              <span className="chip">{describeTimer(ex.timer)}</span>
            </div>
          </div>

          <div className="why-box">
            <h2>Why this one</h2>
            {ex.reasons.length ? (
              <ul>
                {ex.reasons.map((r) => (
                  <li key={r.symptom}>
                    <span className="why-label">For {r.symptomTitle.toLowerCase()}:</span> {r.reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p>A gentle general exercise from the deck to keep you moving.</p>
            )}
            {ex.reasons.every((r) => r.level !== 'direct') && (
              <p className="why-benefits"><strong>The card says it:</strong> {ex.benefits.join(' ')}</p>
            )}
          </div>

          <div className="need-box">
            <h2>What you need</h2>
            <p>{ex.need}</p>
            {ex.setup && (
              <>
                <h2>Set up</h2>
                <p>{ex.setup}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="timer-panel">
        <ExerciseTimer timer={ex.timer} />
      </div>

      <div className="howto">
        <h2>How to do it</h2>
        <ol className="steps big-steps">
          {ex.steps.map((s, i) => <Step key={i} text={s} />)}
        </ol>
        <p className="breath-tip">{guidance.breathing}</p>
        {ex.tips.length > 0 && (
          <details className="tips">
            <summary>Tips from the card</summary>
            <ul>{ex.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </details>
        )}
      </div>

      <div className="session-nav">
        <button type="button" className="btn-outline btn-big" onClick={onPrev}>
          {index === 0 ? '← Today’s plan' : '← Previous'}
        </button>
        <button type="button" className="btn-primary btn-big" onClick={onNext}>
          {isLast ? 'Finish' : 'Next exercise →'}
        </button>
      </div>
    </section>
  );
}

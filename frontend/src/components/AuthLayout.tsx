import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#3B5258" />
      <path
        d="M9 14 C16 14 18 20 24 20 M9 20 H24 M9 26 C16 26 18 20 24 20 M24 20 L31 14 M24 20 L31 26"
        stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round"
      />
      <circle cx="24" cy="20" r="2.6" fill="#F4C08A" />
    </svg>
  );
}

// The five nerve roots of the brachial plexus (C5–T1) joining and branching.
function PlexusArt() {
  const roots = ['C5', 'C6', 'C7', 'C8', 'T1'];
  return (
    <svg className="plexus" viewBox="0 0 360 200" aria-hidden="true">
      <g fill="none" stroke="#5E8580" strokeWidth="3" strokeLinecap="round">
        <path d="M48 24 C110 24 120 52 170 60" />
        <path d="M48 62 C110 62 120 60 170 60" />
        <path d="M48 100 C120 100 140 100 200 100" />
        <path d="M48 138 C110 138 120 140 170 140" />
        <path d="M48 176 C110 176 120 148 170 140" />
      </g>
      <g fill="none" stroke="#17313B" strokeWidth="3" strokeLinecap="round">
        <path d="M170 60 C220 60 240 70 300 50" />
        <path d="M170 60 C230 80 250 100 320 100" />
        <path d="M200 100 C250 100 260 120 320 130" />
        <path d="M170 140 C230 140 250 150 300 160" />
        <path d="M170 140 C220 130 250 120 320 130" />
      </g>
      <g fill="#F4C08A" stroke="#17313B" strokeWidth="1.5">
        <circle cx="170" cy="60" r="5" />
        <circle cx="200" cy="100" r="5" />
        <circle cx="170" cy="140" r="5" />
      </g>
      <g fill="#17313B" fontFamily="Lexend, system-ui, sans-serif" fontSize="13" fontWeight="500">
        {roots.map((r, i) => (
          <text key={r} x="12" y={28 + i * 38}>{r}</text>
        ))}
      </g>
    </svg>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const wide = pathname.startsWith('/welcome');

  // The exercise session uses its own open, full-width layout.
  if (pathname.startsWith('/recommended')) return <>{children}</>;

  return (
    <div className="shell">
      <aside className="brand">
        <div className="brand-mark">
          <Logo />
          <span>NeuroNetworks</span>
        </div>
        <div className="brand-copy">
          <h1>Gentle steps back to strength.</h1>
          <p>Guided exercises for brachial plexus injury recovery, shaped around how you feel today.</p>
        </div>
        <PlexusArt />
        <p className="brand-foot">
          Made for patients of every age, from young children to grandparents. Take your time on every screen.
        </p>
      </aside>
      <main className="content">
        <div className={wide ? 'card card-wide' : 'card'}>{children}</div>
      </main>
    </div>
  );
}

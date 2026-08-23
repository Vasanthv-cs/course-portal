import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── static decoration data ─────────────────────────────────────── */
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 6,
  size: Math.random() * 2.4 + 0.7,
  dur: 2.5 + Math.random() * 4.5,
}));

const FAKE_COURSES = [
  { id: 1, icon: '⚛️', title: 'React Mastery',       level: 'Advanced', duration: '24h', progress: 72, gradient: 'from-cyan-500 to-blue-600' },
  { id: 2, icon: '🐍', title: 'Python for Data',      level: 'Beginner', duration: '18h', progress: 38, gradient: 'from-emerald-500 to-teal-600' },
  { id: 3, icon: '🔷', title: 'TypeScript Deep Dive', level: 'Inter.',   duration: '15h', progress: 55, gradient: 'from-violet-500 to-purple-600' },
];

const FAKE_RECOMMENDED = [
  { id: 4, icon: '🦀', title: 'Rust Fundamentals',    level: 'Beginner', duration: '20h', gradient: 'from-orange-500 to-red-500' },
  { id: 5, icon: '☁️', title: 'AWS Cloud Essentials', level: 'Inter.',   duration: '22h', gradient: 'from-sky-500 to-blue-500' },
  { id: 6, icon: '🤖', title: 'Intro to ML',           level: 'Beginner', duration: '30h', gradient: 'from-pink-500 to-rose-500' },
];

const STATS = [
  { icon: '🔥', label: 'Enrolled Courses', value: '3' },
  { icon: '🎯', label: 'Lessons Done',     value: '24/61' },
  { icon: '📖', label: 'Quizzes',          value: '9' },
  { icon: '🏆', label: 'Avg Progress',     value: '55%' },
];

/* ── component ───────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Any click anywhere → go to /login */
  const goLogin = () => navigate('/login');

  /* Ripple effect on click then navigate */
  const handleClick = (e: React.MouseEvent) => {
    const el = overlayRef.current;
    if (!el) { goLogin(); return; }
    const ripple = document.createElement('span');
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:20px; height:20px;
      left:${x - 10}px; top:${y - 10}px;
      background:rgba(200,160,74,.45);
      transform:scale(0); animation:rippleOut .55s ease-out forwards;
      pointer-events:none; z-index:9999;
    `;
    el.appendChild(ripple);
    setTimeout(() => { ripple.remove(); goLogin(); }, 280);
  };

  /* Keyboard a11y */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') goLogin();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={handleClick}
      style={{
        minHeight: '100vh',
        background: '#11131d',
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes twinkle    { 0%,100%{opacity:.04} 50%{opacity:.55} }
        @keyframes glowPulse  { 0%,100%{opacity:.6}  50%{opacity:1}   }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rippleOut  { to{transform:scale(40);opacity:0} }
        @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .land-card  { background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.07); border-radius:14px; transition:border-color .25s; }
        .land-card:hover { border-color:rgba(200,160,74,.22); }
        .prog-bar   { height:6px; background:rgba(255,255,255,.08); border-radius:99px; overflow:hidden; }
        .prog-fill  { height:100%; background:linear-gradient(90deg,#c8a04a,#e8c870); border-radius:99px; }
        .grad-text  { background:linear-gradient(135deg,#c8a04a,#e8c870); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      {/* ── Stars ── */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position: 'fixed', left: `${s.left}vw`, top: `${s.top}vh`,
          width: s.size, height: s.size, borderRadius: '50%', background: '#c8d0ff',
          animation: `twinkle ${s.dur}s ease-in-out infinite`, animationDelay: `${s.delay}s`,
          pointerEvents: 'none', zIndex: 0,
        }}/>
      ))}

      {/* ── Ambient glow ── */}
      <div style={{
        position: 'fixed', top: '-120px', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,160,74,.10) 0%, transparent 70%)',
        filter: 'blur(10px)', pointerEvents: 'none', zIndex: 0,
        animation: 'glowPulse 4s ease-in-out infinite',
      }}/>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(17,19,29,.85)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#c8a04a,#e8a030)', borderRadius: 8, boxShadow: '0 0 14px rgba(200,150,30,.4)' }}/>
          <span style={{ fontFamily: "'Baloo 2',sans-serif", fontWeight: 800, fontSize: 20, color: '#fff' }}>EasyLearn</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            padding: '7px 18px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,.1)',
            color: '#9096b8', fontSize: 13, fontWeight: 600,
          }}>Sign In</div>
          <div style={{
            padding: '7px 18px', borderRadius: 8,
            background: 'linear-gradient(135deg,#c8a04a,#e8c870)',
            color: '#1a1005', fontSize: 13, fontWeight: 800,
            fontFamily: "'Baloo 2',sans-serif",
          }}>Get Started</div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto',
        padding: '100px 32px 60px', animation: 'fadeUp .7s ease both',
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
            background: 'rgba(200,160,74,.10)', border: '1px solid rgba(200,160,74,.25)',
            borderRadius: 99, padding: '6px 16px', animation: 'floatBadge 3s ease-in-out infinite',
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ color: '#c8a04a', fontSize: 13, fontWeight: 600 }}>Your Learning Dashboard Preview</span>
          </div>
          <h1 style={{
            fontFamily: "'Baloo 2',sans-serif", fontWeight: 800,
            fontSize: 'clamp(32px,5vw,58px)', color: '#fff',
            margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.02em',
          }}>
            Master Skills,{' '}
            <span className="grad-text">Learn Faster</span>
          </h1>
          <p style={{ fontSize: 17, color: '#5a6080', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.75 }}>
            Click anywhere to sign in and access your full personalised learning dashboard.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg,#c8a04a,#e8c870)',
            borderRadius: 10, padding: '13px 30px',
            color: '#1a1005', fontWeight: 800, fontSize: 16,
            fontFamily: "'Baloo 2',sans-serif",
            boxShadow: '0 12px 32px -8px rgba(200,160,74,.55)',
          }}>
            ▶ Start Learning Now
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 40 }}>
          {STATS.map((s, i) => (
            <div key={i} className="land-card" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 26, lineHeight: 1 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#e0e4f0' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#464d6e', fontWeight: 600, marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* In Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#c8ccdf', margin: 0 }}>In Progress</h2>
              <span style={{ fontSize: 13, color: '#c8a04a', fontWeight: 700 }}>View All →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FAKE_COURSES.map(c => (
                <div key={c.id} className="land-card" style={{ padding: '18px 20px', display: 'flex', gap: 18, alignItems: 'center' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 12, flexShrink: 0, fontSize: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, ${
                      c.id === 1 ? '#06b6d4,#2563eb' :
                      c.id === 2 ? '#10b981,#0d9488' :
                                   '#8b5cf6,#7c3aed'
                    })`,
                  }}>
                    {c.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#d0d4e8', marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: '#464d6e', marginBottom: 10 }}>
                      {c.level} · {c.duration}
                    </div>
                    <div className="prog-bar">
                      <div className="prog-fill" style={{ width: `${c.progress}%` }}/>
                    </div>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#c8a04a', flexShrink: 0 }}>{c.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="land-card" style={{ padding: '20px 22px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#c8ccdf', margin: '0 0 18px' }}>Recommended for You</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {FAKE_RECOMMENDED.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0, fontSize: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, ${
                      c.id === 4 ? '#f97316,#ef4444' :
                      c.id === 5 ? '#0ea5e9,#3b82f6' :
                                   '#ec4899,#f43f5e'
                    })`,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#bcc0d8', fontSize: 14 }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: '#464d6e', marginTop: 2 }}>{c.level} · {c.duration}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 20, padding: '10px', border: '1px solid rgba(255,255,255,.07)',
              borderRadius: 10, textAlign: 'center', color: '#6a7090', fontSize: 13, fontWeight: 600,
            }}>
              Explore Catalog
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div style={{
          marginTop: 56, textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 40,
        }}>
          <p style={{ color: '#3d4260', fontSize: 14 }}>
            👆 Click anywhere on the page to sign in
          </p>
        </div>
      </div>

      {/* Fixed bottom pill */}
      <div style={{
        position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(200,160,74,.12)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(200,160,74,.3)', borderRadius: 99,
        padding: '10px 26px', zIndex: 200,
        color: '#c8a04a', fontWeight: 700, fontSize: 14,
        boxShadow: '0 8px 28px rgba(0,0,0,.4)',
        animation: 'floatBadge 2.5s ease-in-out infinite',
        pointerEvents: 'none',
      }}>
        🔐 Click to Sign In &amp; Start Learning
      </div>
    </div>
  );
}

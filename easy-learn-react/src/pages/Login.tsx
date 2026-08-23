import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const STARS = Array.from({ length: 45 }, (_, i) => ({
  id: i, left: Math.random() * 100, top: Math.random() * 100,
  delay: Math.random() * 5, size: Math.random() * 2.2 + 0.8, dur: 2.5 + Math.random() * 4,
}));

const SPARKS = Array.from({ length: 12 }, (_, i) => ({
  id: i, angle: (i / 12) * 360,
  dist: 55 + Math.random() * 35, size: 3 + Math.random() * 4, dur: 0.5 + Math.random() * 0.4,
}));

export default function Login() {
  const [phase, setPhase] = useState<'idle'|'waking'|'awake'>('idle');
  const [bonk, setBonk]   = useState(false);
  const [sparks, setSparks] = useState(false);
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem('el_remember_me') === '1'
  );
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const googleError = params.get('error');

  const wake = () => {
    if (phase === 'awake') { setPhase('idle'); return; }
    if (phase !== 'idle') return;
    setPhase('waking');
    setBonk(true);
    setTimeout(() => setBonk(false), 700);
    setTimeout(() => { setSparks(true); setTimeout(() => setSparks(false), 900); }, 300);
    setTimeout(() => setPhase('awake'), 500);
  };

  const awake = phase === 'awake';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Persist "remember me" preference
      if (rememberMe) {
        localStorage.setItem('el_remember_me', '1');
      } else {
        localStorage.removeItem('el_remember_me');
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#11131d', fontFamily:"'Inter',sans-serif", display:'flex', overflow:'hidden', position:'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes twinkle   { 0%,100%{opacity:.05} 50%{opacity:.6} }
        @keyframes bonkAnim  { 0%{transform:rotate(0)} 15%{transform:rotate(-9deg)} 38%{transform:rotate(5.5deg)} 62%{transform:rotate(-2.5deg)} 82%{transform:rotate(1deg)} 100%{transform:rotate(0)} }
        @keyframes blinkEye  { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(.06)} }
        @keyframes pupilMove { 0%,100%{transform:translate(0,0)} 25%{transform:translate(2px,-1px)} 75%{transform:translate(-2px,1px)} }
        @keyframes sparkBurst{ 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideIn   { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes formFadeIn{ from{opacity:0;transform:scale(.97) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes glowPulse { 0%,100%{opacity:.7} 50%{opacity:1} }
        .l-input { width:100%; padding:12px 15px; background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.09); border-radius:11px; color:#e8eaf2; font-size:15px; font-family:'Inter',sans-serif; box-sizing:border-box; transition:border-color .3s,box-shadow .3s,background .3s; outline:none; }
        .l-input:focus { border-color:#c8a04a; box-shadow:0 0 0 4px rgba(200,160,74,.13); background:rgba(255,255,255,.06); }
        .l-input::placeholder { color:#3d4260; }
        .l-btn { width:100%; padding:13.5px; border:none; border-radius:11px; background:linear-gradient(135deg,#c8a04a,#e8c870); color:#1a1005; font-family:'Baloo 2',sans-serif; font-weight:800; font-size:16.5px; cursor:pointer; box-shadow:0 8px 24px -6px rgba(200,160,74,.55); transition:transform .15s,box-shadow .15s; position:relative; overflow:hidden; }
        .l-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 30px -6px rgba(200,160,74,.65); }
        .l-btn:active { transform:translateY(1px); }
        .l-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .l-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); background-size:200% 100%; animation:shimmer 2.2s linear infinite; }
        .g-btn { width:100%; padding:12px 14px; background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.09); border-radius:11px; color:#9096b8; font-size:14px; font-family:'Inter',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:background .2s,border-color .2s,color .2s; }
        .g-btn:hover { background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.18); color:#c0c6e0; }
        .link-a { color:#c8a04a; text-decoration:none; font-weight:600; transition:color .2s; }
        .link-a:hover { color:#e8c870; }
      `}</style>

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} style={{ position:'fixed', left:`${s.left}vw`, top:`${s.top}vh`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'#c8d0ff', animation:`twinkle ${s.dur}s ease-in-out infinite`, animationDelay:`${s.delay}s`, pointerEvents:'none', zIndex:0 }}/>
      ))}

      {/* LEFT — Lamp Panel */}
      <div style={{ width: awake?'50%':'100%', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', background: awake ? 'radial-gradient(ellipse 130% 90% at 50% -5%,#2a2010,#11131d 72%)' : 'radial-gradient(ellipse 80% 70% at 50% 20%,#1a1a2a,#11131d 80%)', borderRight: awake?'1px solid rgba(255,255,255,.06)':'none', transition:'width .85s cubic-bezier(.16,1,.3,1), background 1.2s ease', position:'relative', zIndex:1, flexShrink:0 }}>

        {/* Brand */}
        <div style={{ position:'absolute', top:28, left:32, display:'flex', alignItems:'center', gap:8, opacity: awake?1:.6, transition:'opacity .6s ease' }}>
          <div style={{ width:28, height:28, background:'linear-gradient(135deg,#c8a04a,#e8a030)', borderRadius:8, boxShadow: awake?'0 0 16px rgba(200,150,30,.5)':'none', transition:'box-shadow .8s ease' }}/>
          <span style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:700, fontSize:18, color:'#fff' }}>EasyLearn</span>
        </div>

        {/* Glow */}
        {awake && <div style={{ position:'absolute', top:0, left:'50%', width:'520px', height:'520px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,160,74,.18) 0%,rgba(200,130,30,.07) 45%,transparent 72%)', transform:'translate(-50%,-10%)', filter:'blur(4px)', pointerEvents:'none', animation:'glowPulse 3s ease-in-out infinite' }}/>}

        {/* Sparks */}
        {SPARKS.map(sp => {
          const rad = sp.angle * Math.PI / 180;
          return (
            <div key={sp.id} style={{ position:'absolute', top:'38%', left:'50%', width:sp.size, height:sp.size, borderRadius:'50%', background:'#ffd080', opacity:0, animation:sparks?`sparkBurst ${sp.dur}s ease-out forwards`:undefined, ['--tx' as any]:`${Math.cos(rad)*sp.dist}px`, ['--ty' as any]:`${Math.sin(rad)*sp.dist}px`, pointerEvents:'none', zIndex:5 }}/>
          );
        })}

        {/* Lamp SVG */}
        <div onClick={wake} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();wake();}}}
          style={{ cursor:'pointer', userSelect:'none', animation: bonk?'bonkAnim .7s ease':undefined, transformOrigin:'50% 100%' }}>
          <svg viewBox="0 0 140 200" style={{ width: awake?180:220, height: awake?240:280, transition:'width .6s ease,height .6s ease', overflow:'visible' }}>
            {/* Glow under lamp */}
            {awake && <ellipse cx="70" cy="195" rx="55" ry="10" fill="rgba(200,160,74,.25)" style={{ filter:'blur(6px)' }}/>}
            {/* Base */}
            <rect fill="#252a3c" x="45" y="175" width="50" height="12" rx="6"/>
            <ellipse fill="#1d2130" cx="70" cy="187" rx="28" ry="6"/>
            {/* Pole */}
            <rect fill={awake?'#b8903a':'#252a3c'} x="67" y="80" width="6" height="97" rx="3" style={{ transition:'fill .5s ease' }}/>
            {/* Arm */}
            <path fill="none" stroke={awake?'#b8903a':'#252a3c'} strokeWidth="5" strokeLinecap="round" d="M70 80 Q90 60 100 40" style={{ transition:'stroke .5s ease' }}/>
            {/* Shade */}
            <path fill={awake?'#c8a04a':'#252a3c'} d="M82 48 L118 48 L112 72 L88 72 Z" rx="2" style={{ transition:'fill .5s ease' }}/>
            <rect fill={awake?'#e8c870':'#1d2130'} x="82" y="44" width="36" height="6" rx="3" style={{ transition:'fill .5s ease' }}/>
            {/* Light cone */}
            {awake && <path fill="rgba(255,215,120,.07)" d="M88 72 L112 72 L126 130 L74 130 Z" style={{ filter:'blur(3px)' }}/>}
            {/* Face */}
            {awake ? (
              <g>
                <circle fill="#fff8e0" cx="92" cy="58" r="10"/>
                <circle fill="#2a2010" cx="89" cy="57" r="3.5" style={{ animation:'blinkEye 4s ease-in-out infinite' }}/>
                <circle fill="#fff" cx="90.2" cy="55.5" r="1.2"/>
                <circle fill="#2a2010" cx="92" cy="64" r="2" style={{ clipPath:'inset(0 0 50% 0)' }}/>
                <ellipse fill="#ff8080" cx="85" cy="63" rx="3" ry="2" style={{ opacity:.5, filter:'blur(1px)' }}/>
              </g>
            ) : (
              <g style={{ opacity:.4 }}>
                <circle fill="#252a3c" cx="92" cy="58" r="8"/>
                <path d="M87 56 Q89 53 91 56" stroke="#6a7090" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M88 62 Q92 59 96 62" stroke="#6a7090" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </g>
            )}
          </svg>
        </div>

        <p style={{ marginTop:8, fontSize:14, color: awake?'#c8a04a':phase==='waking'?'#705030':'#3a4060', textAlign:'center', transition:'color .8s ease', fontWeight: awake?500:400 }}>
          {awake ? '💡 lamp is awake! fill in your details.' : phase==='waking' ? 'waking up...' : 'tap the lamp to reveal the form'}
        </p>
        {!awake && <p style={{ marginTop:24, fontSize:13, color:'#252a38', textAlign:'center', maxWidth:260, lineHeight:1.7 }}>Sign in to continue your<br/>learning journey.</p>}
      </div>

      {/* RIGHT — Form Panel */}
      <div style={{ width: awake?'50%':'0%', minHeight:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#14161f', borderLeft:'1px solid rgba(255,255,255,.06)', transition:'width .85s cubic-bezier(.16,1,.3,1)', flexShrink:0, zIndex:1 }}>
        {awake && (
          <div style={{ width:'100%', maxWidth:400, padding:'0 40px', boxSizing:'border-box', animation:'slideIn .65s cubic-bezier(.16,1,.3,1) .28s both' }}>
            <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:800, fontSize:28, color:'#fff', margin:'0 0 6px', letterSpacing:'-.01em' }}>Welcome back</h2>
            <p style={{ fontSize:14, color:'#3d4260', margin:'0 0 24px', lineHeight:1.6 }}>Sign in to your EasyLearn account.</p>

            {/* Google Error */}
            {googleError && (
              <div style={{ background:'rgba(255,80,80,.1)', border:'1px solid rgba(255,80,80,.2)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#ff8080', fontSize:13 }}>
                ⚠️ Google sign-in failed. Please try again or use email.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{ background:'rgba(255,80,80,.1)', border:'1px solid rgba(255,80,80,.2)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#ff8080', fontSize:13 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ animation:'formFadeIn .5s ease .35s both' }}>
              {/* Email */}
              <div style={{ marginBottom:15 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#464d6e', marginBottom:7, letterSpacing:'.1em', textTransform:'uppercase' }}>Email address</label>
                <input className="l-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus/>
              </div>
              {/* Password */}
              <div style={{ marginBottom:6 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#464d6e', marginBottom:7, letterSpacing:'.1em', textTransform:'uppercase' }}>Password</label>
                <input className="l-input" type="password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} required/>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                {/* Remember Me */}
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <div
                    onClick={() => setRememberMe(v => !v)}
                    style={{
                      width:18, height:18, borderRadius:5,
                      border: rememberMe ? 'none' : '1.5px solid rgba(255,255,255,.14)',
                      background: rememberMe ? 'linear-gradient(135deg,#c8a04a,#e8c870)' : 'rgba(255,255,255,.04)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor:'pointer', flexShrink:0, transition:'all .2s',
                    }}
                  >
                    {rememberMe && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="#1a1005" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize:12, color: rememberMe ? '#c8a04a' : '#464d6e', fontWeight:600, transition:'color .2s' }}>
                    Remember me
                  </span>
                </label>
                <a href="#" style={{ fontSize:12, color:'#464d6e', textDecoration:'none' }}>Forgot password?</a>
              </div>
              <button className="l-btn" type="submit" disabled={loading}>
                {loading
                  ? <span style={{ display:'inline-block', width:18, height:18, border:'3px solid rgba(26,16,5,.3)', borderTopColor:'#1a1005', borderRadius:'50%', animation:'spin .7s linear infinite', verticalAlign:'middle' }}/>
                  : 'Sign In 💡'}
              </button>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', fontSize:11, color:'#252838' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,.06)' }}/> or <div style={{ flex:1, height:1, background:'rgba(255,255,255,.06)' }}/>
            </div>

            {/* Google Sign In */}
            <button className="g-btn" onClick={googleLogin} type="button">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <p style={{ marginTop:26, textAlign:'center', fontSize:13.5, color:'#3d4260' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="link-a">Sign up free</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

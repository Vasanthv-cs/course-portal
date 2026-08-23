import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const STARS = Array.from({ length: 45 }, (_, i) => ({
  id: i, left: Math.random() * 100, top: Math.random() * 100,
  delay: Math.random() * 5, size: Math.random() * 2.2 + 0.8, dur: 2.5 + Math.random() * 4,
}));
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i, angle: (i / 14) * 360,
  dist: 50 + Math.random() * 40, size: 3 + Math.random() * 4,
  dur: 0.5 + Math.random() * 0.35,
  color: ['#ffea80','#ffa040','#80ff9a','#c0ffb0','#fff8c0'][i % 5],
}));
const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function SignUp() {
  const [phase, setPhase] = useState<'idle'|'growing'|'bloomed'>('idle');
  const [sparks, setSparks] = useState(false);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const bloomed = phase === 'bloomed';

  const handleClick = () => {
    if (phase === 'idle') {
      setPhase('growing');
      setTimeout(() => {
        setPhase('bloomed');
        setSparks(true);
        setTimeout(() => setSparks(false), 900);
      }, 1000);
    } else if (phase === 'bloomed') {
      setPhase('idle');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const petalFill = phase==='bloomed'?'#ffb84d': phase==='growing'?'#c88820':'#252a3c';
  const stemFill  = phase!=='idle' ? '#4ade80' : '#252a3c';

  return (
    <div style={{ minHeight:'100vh', background:'#11131d', fontFamily:"'Inter',sans-serif", display:'flex', overflow:'hidden', position:'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes twinkle   { 0%,100%{opacity:.05} 50%{opacity:.6} }
        @keyframes bloom     { 0%{transform:scale(0) rotate(-30deg)} 60%{transform:scale(1.18) rotate(6deg)} 100%{transform:scale(1) rotate(0)} }
        @keyframes sway      { 0%,100%{transform:rotate(-3.5deg)} 50%{transform:rotate(3.5deg)} }
        @keyframes growStem  { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes growLeafL { from{transform:scale(0) rotate(35deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        @keyframes growLeafR { from{transform:scale(0) rotate(-35deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        @keyframes blinkEye  { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(.07)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideIn   { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes formFadeIn{ from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sparkBurst{ 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes petalWave { 0%,100%{transform:rotate(var(--a)) translateY(-23px) scale(1)} 50%{transform:rotate(var(--a)) translateY(-26px) scale(1.04)} }
        .s-input { width:100%; padding:12px 15px; background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.09); border-radius:11px; color:#e8eaf2; font-size:15px; font-family:'Inter',sans-serif; box-sizing:border-box; transition:border-color .3s,box-shadow .3s,background .3s; outline:none; }
        .s-input:focus { border-color:#ffb84d; box-shadow:0 0 0 4px rgba(255,184,77,.13); background:rgba(255,255,255,.06); }
        .s-input::placeholder { color:#3d4260; }
        .s-btn { width:100%; padding:13.5px; border:none; border-radius:11px; background:linear-gradient(135deg,#ffd06a,#ff9530); color:#1a1005; font-family:'Baloo 2',sans-serif; font-weight:800; font-size:16.5px; cursor:pointer; box-shadow:0 8px 24px -6px rgba(255,135,30,.55); transition:transform .15s,box-shadow .15s; position:relative; overflow:hidden; }
        .s-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 30px -6px rgba(255,135,30,.65); }
        .s-btn:active { transform:translateY(1px); }
        .s-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .s-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); background-size:200% 100%; animation:shimmer 2.2s linear infinite; }
        .link-a { color:#ffb84d; text-decoration:none; font-weight:600; transition:color .2s; }
        .link-a:hover { color:#ffd88a; }
      `}</style>

      {STARS.map(s=>(
        <div key={s.id} style={{ position:'fixed', left:`${s.left}vw`, top:`${s.top}vh`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:'50%', background:'#c8d0ff', animation:`twinkle ${s.dur}s ease-in-out infinite`, animationDelay:`${s.delay}s`, pointerEvents:'none', zIndex:0 }}/>
      ))}

      {/* LEFT — Flower Panel */}
      <div style={{ width: bloomed?'50%':'100%', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', background: bloomed ? 'radial-gradient(ellipse 130% 90% at 50% -5%,#1e2840,#11131d 72%)' : 'radial-gradient(ellipse 80% 70% at 50% 20%,#1a2238,#11131d 80%)', borderRight: bloomed?'1px solid rgba(255,255,255,.06)':'none', transition:'width .85s cubic-bezier(.16,1,.3,1), background 1.2s ease', position:'relative', zIndex:1, flexShrink:0 }}>

        <div style={{ position:'absolute', top:28, left:32, display:'flex', alignItems:'center', gap:8, opacity: bloomed?1:.6, transition:'opacity .6s ease' }}>
          <div style={{ width:28, height:28, background:'linear-gradient(135deg,#ffb84d,#ff7000)', borderRadius:8, boxShadow: bloomed?'0 0 16px rgba(255,150,30,.5)':'none', transition:'box-shadow .8s ease' }}/>
          <span style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:700, fontSize:18, color:'#fff' }}>EasyLearn</span>
        </div>

        <div style={{ position:'relative', width: bloomed?220:280, height: bloomed?280:340, transition:'width .7s ease,height .7s ease', flexShrink:0 }}>
          <div style={{ position:'absolute', top:0, left:'50%', width: bloomed?'480px':'10px', height: bloomed?'480px':'10px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,215,100,.22) 0%,rgba(255,180,60,.08) 45%,transparent 72%)', transform:'translate(-50%,-10%)', opacity: bloomed?1:0, filter:'blur(4px)', transition:'width 1.3s cubic-bezier(.16,1,.3,1),height 1.3s cubic-bezier(.16,1,.3,1),opacity 1s ease', pointerEvents:'none' }}/>

          {SPARKS.map(sp => {
            const rad = sp.angle * Math.PI / 180;
            return <div key={sp.id} style={{ position:'absolute', top:'38%', left:'50%', width:sp.size, height:sp.size, borderRadius:'50%', background:sp.color, opacity:0, animation:sparks?`sparkBurst ${sp.dur}s ease-out forwards`:undefined, ['--tx' as any]:`${Math.cos(rad)*sp.dist}px`, ['--ty' as any]:`${Math.sin(rad)*sp.dist}px`, pointerEvents:'none', zIndex:5 }}/>;
          })}

          <div onClick={handleClick} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();handleClick();}}} style={{ width:'100%', height:'100%', cursor:'pointer', userSelect:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg viewBox="0 0 200 265" style={{ width:'80%', height:'80%', overflow:'visible' }}>
              <path fill="#252a3c" d="M62 238 L74 196 L126 196 L138 238 Z"/>
              <ellipse fill="#1d2130" cx="100" cy="238" rx="38" ry="9"/>
              <rect fill="#30364f" x="66" y="192" width="68" height="9" rx="4"/>
              <ellipse fill="#1a1d2a" cx="100" cy="196" rx="28" ry="5.5"/>
              <ellipse fill="#221f30" cx="100" cy="195" rx="20" ry="4"/>
              <rect fill={stemFill} x="97" y="104" width="6" height="93" rx="3" style={{ transformOrigin:'100px 197px', transition:'fill .5s ease', animation: phase!=='idle'?'growStem 1s cubic-bezier(.22,1,.36,1) forwards':'' }}/>
              <path fill="#22c55e" style={{ transformOrigin:'100px 158px', opacity: bloomed?1:0, transition:'opacity .3s .5s', animation: bloomed?'growLeafL .7s cubic-bezier(.22,1,.36,1) .5s both':'' }} d="M100 158 Q74 140 67 112 Q90 130 100 158 Z"/>
              <path fill="#16a34a" style={{ transformOrigin:'100px 170px', opacity: bloomed?1:0, transition:'opacity .3s .65s', animation: bloomed?'growLeafR .7s cubic-bezier(.22,1,.36,1) .65s both':'' }} d="M100 170 Q128 152 135 124 Q114 144 100 170 Z"/>
              <g style={{ transformOrigin:'100px 100px', animation: phase==='bloomed'?'bloom .8s cubic-bezier(.22,1,.36,1) .08s both, sway 3.5s ease-in-out 1.4s infinite':phase==='growing'?'bloom .8s cubic-bezier(.22,1,.36,1) .08s both':'' }}>
                {PETALS.map((a, i) => (
                  <ellipse key={a} fill={petalFill} style={{ transformOrigin:'100px 100px', transform:`rotate(${a}deg) translateY(-23px)`, transition:'fill .9s ease', animation: bloomed?`petalWave ${2.2+i*.18}s ease-in-out ${i*.08}s infinite`:undefined, ['--a' as any]:`${a}deg` }} cx="100" cy="100" rx="10" ry="16"/>
                ))}
                {bloomed && PETALS.map(a=>(
                  <ellipse key={`sh${a}`} fill="rgba(255,255,255,.1)" style={{ transformOrigin:'100px 100px', transform:`rotate(${a}deg) translateY(-23px)` }} cx="100" cy="93" rx="4" ry="6"/>
                ))}
                <circle fill={bloomed?'#fff8d0':phase==='growing'?'#c0982a':'#1c2030'} cx="100" cy="100" r="20" style={{ transition:'fill .9s ease' }}/>
                {bloomed && (
                  <g>
                    <circle fill="#2a3060" cx="93" cy="97" r="5"/><circle fill="#4050a0" cx="93" cy="97" r="3.8"/>
                    <circle fill="#14151d" cx="93" cy="97" r="2.8" style={{ animation:'blinkEye 5s ease-in-out infinite' }}/>
                    <circle fill="rgba(255,255,255,.95)" cx="94.2" cy="95.2" r="1.2"/>
                    <circle fill="#2a3060" cx="107" cy="97" r="5"/><circle fill="#4050a0" cx="107" cy="97" r="3.8"/>
                    <circle fill="#14151d" cx="107" cy="97" r="2.8" style={{ animation:'blinkEye 5s ease-in-out .4s infinite' }}/>
                    <circle fill="rgba(255,255,255,.95)" cx="108.2" cy="95.2" r="1.2"/>
                    <ellipse fill="#ff9090" cx="87" cy="105" rx="4.5" ry="3" style={{ opacity:.55, filter:'blur(1px)' }}/>
                    <ellipse fill="#ff9090" cx="113" cy="105" rx="4.5" ry="3" style={{ opacity:.55, filter:'blur(1px)' }}/>
                    <path d="M91 109 Q100 118 109 109" stroke="#14151d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  </g>
                )}
              </g>
            </svg>
          </div>
        </div>

        <p style={{ marginTop:6, fontSize:14, color: bloomed?'#ffb84d':phase==='growing'?'#4a8060':'#3a4060', textAlign:'center', transition:'color .8s ease', fontWeight: bloomed?500:400 }}>
          {bloomed ? "it bloomed! let's grow together 🌸" : phase==='growing'?'🌱 growing...':'tap the flower to start'}
        </p>
        {!bloomed && <p style={{ marginTop:28, fontSize:13.5, color:'#252a38', textAlign:'center', maxWidth:280, lineHeight:1.7 }}>Join thousands of learners building<br/>real skills every single day.</p>}
      </div>

      {/* RIGHT — Form Panel */}
      <div style={{ width: bloomed?'50%':'0%', minHeight:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#14161f', borderLeft:'1px solid rgba(255,255,255,.06)', transition:'width .85s cubic-bezier(.16,1,.3,1)', flexShrink:0, zIndex:1 }}>
        {bloomed && (
          <div style={{ width:'100%', maxWidth:400, padding:'0 40px', boxSizing:'border-box', animation:'slideIn .65s cubic-bezier(.16,1,.3,1) .28s both' }}>
            <h2 style={{ fontFamily:"'Baloo 2',sans-serif", fontWeight:800, fontSize:28, color:'#fff', margin:'0 0 6px', letterSpacing:'-.01em' }}>Create your account</h2>
            <p style={{ fontSize:14, color:'#3d4260', margin:'0 0 20px', lineHeight:1.6 }}>Start learning for free — no credit card required.</p>

            {error && (
              <div style={{ background:'rgba(255,80,80,.1)', border:'1px solid rgba(255,80,80,.2)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#ff8080', fontSize:13 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              {[
                { label:'Full Name', type:'text', ph:'John Doe', val:name, set:setName },
                { label:'Email address', type:'email', ph:'you@example.com', val:email, set:setEmail },
                { label:'Password', type:'password', ph:'At least 8 characters', val:password, set:setPassword },
                { label:'Confirm Password', type:'password', ph:'Repeat your password', val:confirm, set:setConfirm },
              ].map((f,i)=>(
                <div key={f.label} style={{ marginBottom:15, animation:`formFadeIn .5s ease ${.35+i*.09}s both` }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#464d6e', marginBottom:7, letterSpacing:'.1em', textTransform:'uppercase' }}>{f.label}</label>
                  <input className="s-input" type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} required autoFocus={i===0}/>
                </div>
              ))}

              <div style={{ marginTop:6, animation:'formFadeIn .5s ease .72s both' }}>
                <button className="s-btn" type="submit" disabled={loading}>
                  {loading
                    ? <span style={{ display:'inline-block', width:18, height:18, border:'3px solid rgba(26,16,5,.3)', borderTopColor:'#1a1005', borderRadius:'50%', animation:'spin .7s linear infinite', verticalAlign:'middle' }}/>
                    : 'Create Account 🌸'}
                </button>
              </div>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', fontSize:11, color:'#252838', animation:'formFadeIn .5s ease .78s both' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,.06)' }}/> or <div style={{ flex:1, height:1, background:'rgba(255,255,255,.06)' }}/>
            </div>

            <div style={{ animation:'formFadeIn .5s ease .82s both' }}>
              <button onClick={googleLogin} type="button"
                style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,.04)', border:'1.5px solid rgba(255,255,255,.09)', borderRadius:11, color:'#9096b8', fontSize:14, fontFamily:"'Inter',sans-serif", cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'background .2s,border-color .2s,color .2s' }}
                onMouseOver={e=>{const b=e.currentTarget;b.style.background='rgba(255,255,255,.08)';b.style.borderColor='rgba(255,255,255,.18)';b.style.color='#c0c6e0';}}
                onMouseOut={e=>{const b=e.currentTarget;b.style.background='rgba(255,255,255,.04)';b.style.borderColor='rgba(255,255,255,.09)';b.style.color='#9096b8';}}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p style={{ marginTop:26, textAlign:'center', fontSize:13.5, color:'#3d4260', animation:'formFadeIn .5s ease .88s both' }}>
              Already have an account?{' '}
              <Link to="/login" className="link-a">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

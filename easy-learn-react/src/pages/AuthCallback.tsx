import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

/** Handles /auth/callback?token=...&name=...&email=...&avatar=...&id=... after Google OAuth */
const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { } = useAuth(); // ensure context loaded

  useEffect(() => {
    const token = params.get('token');
    const name  = params.get('name')  || '';
    const email = params.get('email') || '';
    const avatar= params.get('avatar')|| '';
    const id    = params.get('id')    || '';

    if (token) {
      setToken(token);
      // Store user info (context will pick it up on next /me call)
      // We reload so AuthContext re-initialises and calls /me
      sessionStorage.setItem('pendingUser', JSON.stringify({ id, name, email, avatar, role: 'student' }));
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login?error=google_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-slate-600 font-medium">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

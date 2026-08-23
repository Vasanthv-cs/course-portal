import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, setToken } from '../api/auth';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  currentStreak?: number;
  longestStreak?: number;
}

interface AuthCtx {
  user: User | null;
  notifications: Notification[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
  markNotificationsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      const data = await authApi.refresh();
      setToken(data.accessToken);
      const me = await authApi.me();
      setUser(me.user);
      setNotifications(me.notifications || []);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { initAuth(); }, [initAuth]);

  // Auto-refresh access token every 13 minutes
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const data = await authApi.refresh();
        setToken(data.accessToken);
      } catch { setUser(null); setToken(null); }
    }, 13 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setToken(data.accessToken);
    setUser(data.user);
    // After login, fetch me to get notifications and trigger streak update
    const me = await authApi.me();
    setUser(me.user);
    setNotifications(me.notifications || []);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* noop */ }
    setToken(null);
    setUser(null);
    setNotifications([]);
  };

  const markNotificationsRead = async () => {
    if (!user) return;
    try {
      await authApi.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error('Failed to mark read', err); }
  };

  return (
    <AuthContext.Provider value={{ user, notifications, loading, login, register, logout, googleLogin: authApi.googleLogin, markNotificationsRead }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

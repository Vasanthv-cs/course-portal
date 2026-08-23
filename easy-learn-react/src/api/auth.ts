const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let accessToken: string | null = null;

export const setToken = (t: string | null) => { accessToken = t; };
export const getToken = () => accessToken;

const req = async (path: string, opts: RequestInit = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...opts.headers }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const authApi = {
  register: (name: string, email: string, password: string) =>
    req('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => req('/auth/logout', { method: 'POST' }),

  refresh: () => req('/auth/refresh', { method: 'POST' }),

  me: () => req('/auth/me'),

  markNotificationsRead: () => req('/auth/notifications/read', { method: 'POST' }),

  googleLogin: () => { window.location.href = `${API}/auth/google`; }
};

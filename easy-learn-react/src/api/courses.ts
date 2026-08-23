const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { getToken } from './auth';

const req = async (path: string, opts: RequestInit = {}) => {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...opts,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const courseApi = {
  getAll: () => req('/courses'),
  getById: (id: string) => req(`/courses/${id}`),
  create: (course: any) => req('/courses', { method: 'POST', body: JSON.stringify(course) }),
  update: (id: string, course: any) => req(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) }),
  delete: (id: string) => req(`/courses/${id}`, { method: 'DELETE' }),
  seed: (courses: any[]) => req('/courses/seed', { method: 'POST', body: JSON.stringify(courses) })
};

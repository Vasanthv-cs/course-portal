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

export const progressApi = {
  getAll: () => req('/progress'),
  get: (courseId: string) => req(`/progress/${courseId}`),
  save: (courseId: string, payload: { completedLessons?: string[]; htmlQuizPassed?: boolean; htmlQuizBestScore?: number; lastLessonId?: string }) =>
    req(`/progress/${courseId}`, { method: 'POST', body: JSON.stringify(payload) }),
  saveQuizResult: (payload: { courseId: string; quizType: string; score: number; maxScore: number; passed: boolean; totalQuestions: number; correctAnswers: number }) =>
    req('/progress/quiz/result', { method: 'POST', body: JSON.stringify(payload) }),
  quizHistory: () => req('/progress/quiz/history')
};

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Award, RotateCcw, Code2, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { getRandomHTMLQuiz, HTML_QUIZ_MAX_MARKS } from '../data/htmlQuiz';
import type { HTMLQuizQuestion } from '../data/htmlQuiz';
import { progressApi } from '../api/progress';

interface Props {
  courseId: string;
  onPass: () => void;
  onClose: () => void;
  alreadyPassed: boolean;
}

const PASS_PERCENT = 60; // 60 out of 100 marks = pass

const HTMLQuizModal = ({ courseId, onPass, onClose, alreadyPassed }: Props) => {
  const [questions, setQuestions] = useState<HTMLQuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes

  const initQuiz = useCallback(() => {
    setQuestions(getRandomHTMLQuiz());
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(50 * 60);
  }, []);

  useEffect(() => { initQuiz(); }, [initQuiz]);

  useEffect(() => {
    if (submitted || questions.length === 0) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted, questions.length]);

  const handleSubmit = async () => {
    const total = questions.reduce((acc, q, i) => {
      const answered = answers[i];
      return answered !== undefined && answered === q.correctIndex ? acc + q.marks : acc;
    }, 0);
    setScore(total);
    setSubmitted(true);
    const passedQuiz = total >= PASS_PERCENT;
    const correctAnswers = questions.filter((q, i) => answers[i] === q.correctIndex).length;

    try {
      await progressApi.saveQuizResult({
        courseId,
        quizType: 'html-final',
        score: total,
        maxScore: HTML_QUIZ_MAX_MARKS,
        passed: passedQuiz,
        totalQuestions: questions.length,
        correctAnswers
      });
    } catch (err) {
      console.error('Failed to save quiz result', err);
    }

    if (passedQuiz) onPass();
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const diffColor = (d: string) => d === 'easy' ? 'bg-green-100 text-green-700' : d === 'medium' ? 'bg-amber-100 text-amber-700' : d === 'hard' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
  const passed = score >= PASS_PERCENT;

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (submitted) {
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Score header */}
          <div className={`p-8 text-center text-white ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              {passed ? <Award size={40} /> : <AlertTriangle size={40} />}
            </div>
            <h2 className="text-3xl font-extrabold mb-1">{passed ? '🎉 Passed!' : 'Not Passed'}</h2>
            <p className="text-white/80 mb-4">{passed ? 'You\'ve unlocked 100% course completion!' : `You need ${PASS_PERCENT} marks to pass.`}</p>
            <div className="text-5xl font-black">{score}<span className="text-2xl font-medium text-white/70"> / {HTML_QUIZ_MAX_MARKS}</span></div>
            <p className="text-white/80 mt-2">{correct} of {questions.length} correct</p>
            {/* Breakdown */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              {(['easy','medium','hard','coding'] as const).map(d => {
                const qs = questions.filter(q => q.difficulty === d);
                const c = qs.filter((q) => answers[questions.indexOf(q)] === q.correctIndex).length;
                const marks = qs.reduce((a, q) => answers[questions.indexOf(q)] === q.correctIndex ? a + q.marks : a, 0);
                return qs.length > 0 ? (
                  <div key={d} className="bg-white/20 rounded-lg px-3 py-2 text-center">
                    <div className="font-bold capitalize">{d}</div>
                    <div>{c}/{qs.length} • {marks}pts</div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Answer review */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Answer Review</h3>
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div key={q.id} className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" /> : <XCircle size={18} className="text-red-600 mt-0.5 shrink-0" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${diffColor(q.difficulty)}`}>{q.difficulty} • {q.marks}pt{q.marks > 1 ? 's' : ''}</span>
                      </div>
                      {q.codeSnippet && (
                        <pre className="bg-slate-900 text-green-400 text-xs p-3 rounded-lg mb-2 overflow-x-auto font-mono">{q.codeSnippet}</pre>
                      )}
                      <p className="font-semibold text-slate-800 text-sm mb-2">{i + 1}. {q.question}</p>
                      <p className="text-xs text-slate-500">Your answer: <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{userAns !== undefined ? q.options[userAns] : 'Not answered'}</span></p>
                      {!isCorrect && <p className="text-xs text-slate-500">Correct: <span className="text-green-700 font-semibold">{q.options[q.correctIndex]}</span></p>}
                      <p className="text-xs text-slate-500 mt-1 italic">💡 {q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-200 flex gap-3">
            {!passed && (
              <button onClick={initQuiz} className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-colors">
                <RotateCcw size={18} /> Retry Quiz
              </button>
            )}
            <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
              {passed ? 'Continue Learning' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ALREADY PASSED ──
  if (alreadyPassed) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Already Passed!</h2>
          <p className="text-slate-500 mb-6">You have already completed the HTML quiz. Your course is 100% complete.</p>
          <div className="flex gap-3">
            <button onClick={initQuiz} className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-semibold transition-colors">
              <RotateCcw size={16} /> Retake for Practice
            </button>
            <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ QUESTION SCREEN ──
  const q = questions[current];
  const answered = answers[current] !== undefined;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-lg">HTML Master Quiz</h2>
            <p className="text-slate-400 text-xs">{answeredCount}/{questions.length} answered • Pass: {PASS_PERCENT}/{HTML_QUIZ_MAX_MARKS} marks</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
              <Clock size={18} /> {fmt(timeLeft)}
            </div>
            <div className="text-sm font-semibold text-slate-300">{current + 1} / {questions.length}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-200">
          <div className="h-full bg-primary-500 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
            <span className="text-xs text-slate-500 font-medium">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
            {q.difficulty === 'coding' && <span className="flex items-center gap-1 text-xs text-blue-600 font-medium"><Code2 size={12} /> Code Analysis</span>}
          </div>

          {q.codeSnippet && (
            <pre className="bg-slate-900 text-green-400 text-sm p-4 rounded-xl mb-5 overflow-x-auto font-mono border border-slate-700">{q.codeSnippet}</pre>
          )}

          <h3 className="text-lg font-semibold text-slate-900 mb-5">{current + 1}. {q.question}</h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(prev => ({ ...prev, [current]: i }))}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selected
                      ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold shadow-sm'
                      : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${selected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer navigation */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrent(p => Math.max(0, p - 1))}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          >
            ← Previous
          </button>

          {/* Question dots (mini map) */}
          <div className="flex gap-1 overflow-x-auto max-w-xs">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                  i === current ? 'bg-primary-600' : answers[i] !== undefined ? 'bg-green-400' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {current === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Award size={16} /> Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrent(p => Math.min(questions.length - 1, p + 1))}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${answered ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HTMLQuizModal;

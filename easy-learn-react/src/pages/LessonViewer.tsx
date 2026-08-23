import { useState, useEffect } from 'react';
import { Play, FileText, CheckCircle, ChevronLeft, ChevronRight, Menu, Award, X, Lock, Trophy, BookOpen } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import type { Lesson } from '../data/courses';
import ReactMarkdown from 'react-markdown';
import { javaTheory } from '../data/javaTheory';
import { useLocation } from 'react-router-dom';
import HTMLQuizModal from '../components/HTMLQuizModal';
import { progressApi } from '../api/progress';

const LessonViewer = () => {
  const location = useLocation();
  const { courses } = useCourses();
  const state = location.state as { courseId?: string; viewMode?: 'video' | 'theory' } | null;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courseIdx, setCourseIdx] = useState(() => {
    if (state?.courseId) {
      const idx = courses.filter(c => c.enrolled).findIndex(c => c.id === state.courseId);
      return Math.max(0, idx);
    }
    return 0;
  });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showModuleQuiz, setShowModuleQuiz] = useState(false);
  const [quizModuleIdx, setQuizModuleIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<'video' | 'theory'>(state?.viewMode || 'video');
  const [showHTMLFinalQuiz, setShowHTMLFinalQuiz] = useState(false);
  const [lockedToast, setLockedToast] = useState(false);

  // Real Database Persistence State
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [htmlQuizPassed, setHtmlQuizPassed] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const enrolled = courses.filter(c => c.enrolled);
  const course = enrolled[courseIdx] || enrolled[0];

  // Fetch progress from backend when course changes
  useEffect(() => {
    if (!course) return;
    setLoadingProgress(true);
    progressApi.get(course.id)
      .then(res => {
        if (res.data) {
          setCompletedLessonIds(new Set(res.data.completedLessons || []));
          setHtmlQuizPassed(res.data.htmlQuizPassed || false);
        }
      })
      .catch(err => console.error('Failed to load progress', err))
      .finally(() => setLoadingProgress(false));
  }, [course?.id]);

  const handleQuizPass = () => {
    setHtmlQuizPassed(true);
    // Backend is already updated by HTMLQuizModal's saveQuizResult call,
    // but we can also sync it just in case.
    progressApi.save(course.id, { htmlQuizPassed: true }).catch(console.error);
  };

  const markLessonComplete = async () => {
    if (!currentLesson) return;
    const newCompleted = new Set(completedLessonIds);
    newCompleted.add(currentLesson.id);
    setCompletedLessonIds(newCompleted);

    try {
      await progressApi.save(course.id, {
        completedLessons: Array.from(newCompleted),
        htmlQuizPassed,
        lastLessonId: currentLesson.id
      });
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  // Flash locked toast
  useEffect(() => {
    if (lockedToast) { const t = setTimeout(() => setLockedToast(false), 2500); return () => clearTimeout(t); }
  }, [lockedToast]);

  if (!course) return <div className="p-8 text-center text-slate-500">Enroll in a course to start learning.</div>;

  const isHTMLCourse = course.id === 'html-css';
  const requiresQuiz = isHTMLCourse && course.htmlQuizRequired === true;

  // ── Module breakdown ──────────────────────────────────────────────────────
  const htmlModule  = requiresQuiz ? course.modules[0] : null;   // HTML Basics
  const cssModules  = requiresQuiz ? course.modules.slice(1) : []; // CSS Fundamentals+
  const htmlLessons = htmlModule?.lessons ?? [];
  const cssLessons  = cssModules.flatMap(m => m.lessons);

  // Is the current lesson inside the HTML module?
  const htmlLessonIds = new Set(htmlLessons.map(l => l.id));
  const cssLessonIds  = new Set(cssLessons.map(l => l.id));

  // Flat list for navigation — CSS lessons gated
  const allLessons = course.modules.flatMap(m => m.lessons);

  // Current lesson logic
  const currentLesson = activeLesson || (() => {
    for (const m of course.modules) {
      const found = m.lessons.find(l => !completedLessonIds.has(l.id));
      if (found) return found;
    }
    return course.modules[0]?.lessons[0];
  })();

  const currentIndex   = allLessons.findIndex(l => l.id === currentLesson?.id);
  const isInHTMLModule = requiresQuiz && htmlLessonIds.has(currentLesson?.id ?? '');
  const isLastHTMLLesson = requiresQuiz && isInHTMLModule && currentIndex === htmlLessons.length - 1;
  const isInCSSModule  = requiresQuiz && cssLessonIds.has(currentLesson?.id ?? '');

  // Prevent going to CSS before quiz passes
  const handleLessonClick = (lesson: Lesson) => {
    if (requiresQuiz && !htmlQuizPassed && cssLessonIds.has(lesson.id)) {
      setLockedToast(true);
      return;
    }
    setActiveLesson(lesson);
    setShowModuleQuiz(false);
  };

  // Smart Prev/Next: after last HTML lesson → quiz, not CSS
  const handleNext = () => {
    if (requiresQuiz && !htmlQuizPassed && isLastHTMLLesson) {
      setShowHTMLFinalQuiz(true);
      return;
    }
    const next = allLessons[currentIndex + 1];
    if (next) {
      if (requiresQuiz && !htmlQuizPassed && cssLessonIds.has(next.id)) {
        setLockedToast(true);
        return;
      }
      setActiveLesson(next);
      setShowModuleQuiz(false);
    }
  };
  const handlePrev = () => {
    const prev = allLessons[currentIndex - 1];
    if (prev) { setActiveLesson(prev); setShowModuleQuiz(false); }
  };

  // ── Progress calculation ──────────────────────────────────────────────────
  // Milestones: each HTML lesson (1pt) + quiz checkpoint (1pt) + each CSS lesson (1pt)
  const htmlCompleted = htmlLessons.filter(l => completedLessonIds.has(l.id)).length;
  const cssCompleted  = cssLessons.filter(l => completedLessonIds.has(l.id)).length;
  const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;

  let progressPct: number;
  if (requiresQuiz) {
    const totalMilestones = allLessons.length + 1; // +1 for the quiz checkpoint
    const doneMilestones  = htmlCompleted + (htmlQuizPassed ? 1 : 0) + (htmlQuizPassed ? cssCompleted : 0);
    progressPct = Math.round((doneMilestones / totalMilestones) * 100);
  } else {
    progressPct = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;
  }

  // Module quiz (small quiz per module)
  const openModuleQuiz = (modIdx: number) => {
    setQuizModuleIdx(modIdx);
    setShowModuleQuiz(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };
  const quizQuestions = course.modules[quizModuleIdx]?.quiz || [];
  const quizScore = quizSubmitted ? quizQuestions.filter((q, i) => quizAnswers[i] === q.correctIndex).length : 0;

  if (loadingProgress) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* ── Locked CSS Toast ── */}
      {lockedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top-4 duration-300">
          <Lock size={16} className="text-amber-400 shrink-0"/>
          Complete the HTML Quiz first to unlock CSS lessons.
        </div>
      )}

      {/* ── HTML Final Quiz Modal ── */}
      {showHTMLFinalQuiz && (
        <HTMLQuizModal
          courseId={course.id}
          alreadyPassed={htmlQuizPassed}
          onPass={handleQuizPass}
          onClose={() => setShowHTMLFinalQuiz(false)}
        />
      )}

      <div className="flex flex-col h-[calc(100vh-8rem)] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

        {/* ── Top Bar ── */}
        <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:text-slate-300 transition-colors shrink-0"><Menu size={20}/></button>
            <div className="font-semibold truncate text-sm">{course.title}</div>
            {enrolled.length > 1 && (
              <select className="bg-slate-800 text-sm rounded px-2 py-1 border border-slate-700 shrink-0"
                value={courseIdx} onChange={e => { setCourseIdx(Number(e.target.value)); setActiveLesson(null); setShowModuleQuiz(false); }}>
                {enrolled.map((c, i) => <option key={c.id} value={i}>{c.title}</option>)}
              </select>
            )}
            <div className="ml-2 flex items-center bg-slate-800 rounded-lg p-0.5 shrink-0">
              <button onClick={() => setViewMode('video')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'video' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Video</button>
              <button onClick={() => setViewMode('theory')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'theory' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>Theory</button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium shrink-0">
            <button onClick={handlePrev} disabled={currentIndex <= 0}
              className="flex items-center gap-1 text-slate-300 hover:text-white disabled:opacity-30 transition-colors px-2 py-1.5"><ChevronLeft size={16}/>Prev</button>
            <button onClick={handleNext}
              disabled={!isLastHTMLLesson && currentIndex >= allLessons.length - 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                requiresQuiz && !htmlQuizPassed && isLastHTMLLesson
                  ? 'bg-amber-500 hover:bg-amber-400 text-white'
                  : 'bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-30'
              }`}>
              {requiresQuiz && !htmlQuizPassed && isLastHTMLLesson ? <><Award size={14}/> Quiz</> : <>Next<ChevronRight size={16}/></>}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Sidebar ── */}
          {sidebarOpen && (
            <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">

              {/* Progress header */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-800 text-sm">Course Content</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${progressPct === 100 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{progressPct}%</span>
                </div>
                <div className="mt-2 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${progressPct}%` }}/>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {requiresQuiz
                    ? `${htmlCompleted}/${htmlLessons.length} HTML · ${htmlQuizPassed ? '✓ Quiz' : '🔒 Quiz'} · ${htmlQuizPassed ? cssCompleted : 0}/${cssLessons.length} CSS`
                    : `${completedCount}/${allLessons.length} lessons done`}
                </div>
              </div>

              {/* Modules */}
              <div className="flex-1">
                {course.modules.map((mod, mi) => {
                  const isHTMLMod = requiresQuiz && mi === 0;
                  const isCSSMod  = requiresQuiz && mi > 0;
                  const isLocked  = isCSSMod && !htmlQuizPassed;

                  return (
                     <div key={mi} className="border-b border-slate-200">
                      {/* Module header */}
                      <div className={`px-4 py-3 font-semibold text-xs uppercase tracking-wider flex justify-between items-center ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-700'}`}>
                        <span className="flex items-center gap-1.5">
                          {isLocked && <Lock size={11} className="text-slate-400"/>}
                          {mod.title}
                        </span>
                        {!isLocked && mod.quiz && mod.quiz.length > 0 && (
                          <button onClick={() => openModuleQuiz(mi)} className="text-[10px] bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-500 transition-colors flex items-center gap-1">
                            <Award size={10}/>Quiz
                          </button>
                        )}
                      </div>

                      {/* Lessons */}
                      <div className="bg-white">
                        {mod.lessons.map(lesson => {
                          const isActive  = currentLesson?.id === lesson.id && !showModuleQuiz;
                          const isLockedL = requiresQuiz && !htmlQuizPassed && cssLessonIds.has(lesson.id);
                          const isCompleted = completedLessonIds.has(lesson.id);
                          return (
                            <div key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              className={`flex items-start gap-3 px-4 py-3 border-l-4 transition-colors ${
                                isLockedL ? 'cursor-not-allowed opacity-50 border-transparent' :
                                isActive ? 'border-primary-600 bg-primary-50 cursor-pointer' :
                                'border-transparent hover:bg-slate-50 cursor-pointer'
                              }`}>
                              <div className="mt-0.5 shrink-0">
                                {isLockedL
                                  ? <Lock size={15} className="text-slate-400"/>
                                  : isCompleted
                                    ? <CheckCircle size={16} className="text-green-500"/>
                                    : <div className="w-4 h-4 rounded-full border-2 border-slate-300"/>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm truncate ${isActive ? 'font-semibold text-slate-900' : isLockedL ? 'text-slate-400' : 'text-slate-700'}`}>{lesson.title}</div>
                                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                                  {lesson.type === 'video' ? <Play size={11}/> : <FileText size={11}/>}
                                  {lesson.duration}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quiz gate between HTML and CSS */}
                      {isHTMLMod && requiresQuiz && (
                        <div className={`mx-3 my-3 p-3.5 rounded-xl border-2 ${htmlQuizPassed ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
                          {htmlQuizPassed ? (
                            <div className="flex items-center gap-2">
                              <Trophy size={18} className="text-green-600 shrink-0"/>
                              <div>
                                <p className="text-xs font-bold text-green-800">HTML Quiz Passed ✓</p>
                                <p className="text-[10px] text-green-600">CSS lessons unlocked!</p>
                              </div>
                              <button onClick={() => setShowHTMLFinalQuiz(true)} className="ml-auto text-[10px] text-green-600 underline shrink-0">Retake</button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Lock size={16} className="mx-auto text-amber-600 mb-1.5"/>
                              <p className="text-xs font-bold text-amber-900">HTML Quiz Required</p>
                              <p className="text-[10px] text-amber-700 mt-0.5">Pass to unlock CSS lessons</p>
                              <button onClick={() => setShowHTMLFinalQuiz(true)}
                                className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1">
                                <Award size={11}/> Take HTML Quiz
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Main Content ── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">

                {showModuleQuiz ? (
                  /* ── Module Mini-Quiz ── */
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">📝 {course.modules[quizModuleIdx]?.title} — Quiz</h2>
                      <button onClick={() => setShowModuleQuiz(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    {quizQuestions.map((q, qi) => (
                      <div key={qi} className="mb-6 pb-6 border-b border-slate-100 last:border-none">
                        <p className="font-semibold text-slate-800 mb-3">{qi + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => {
                            const selected = quizAnswers[qi] === oi;
                            const isCorrect = quizSubmitted && oi === q.correctIndex;
                            const isWrong   = quizSubmitted && selected && oi !== q.correctIndex;
                            return (
                              <button key={oi} disabled={quizSubmitted}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                                  isCorrect ? 'border-green-400 bg-green-50 text-green-800 font-semibold' :
                                  isWrong   ? 'border-red-400 bg-red-50 text-red-800' :
                                  selected  ? 'border-primary-400 bg-primary-50 text-primary-800 font-medium' :
                                              'border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}>{opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className={`mt-3 text-sm p-3 rounded-lg ${quizAnswers[qi] === q.correctIndex ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                    {!quizSubmitted ? (
                      <button onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors">
                        Submit Answers
                      </button>
                    ) : (
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-800">{quizScore}/{quizQuestions.length}</div>
                        <p className="text-slate-500 mt-1">{quizScore === quizQuestions.length ? '🎉 Perfect!' : quizScore >= quizQuestions.length / 2 ? '👍 Good job!' : '📚 Review and retry!'}</p>
                      </div>
                    )}
                  </div>

                ) : viewMode === 'theory' ? (
                  /* ── Theory View ── */
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 prose prose-slate max-w-none">
                    {course.id === 'java' ? (
                      <ReactMarkdown>{javaTheory}</ReactMarkdown>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 text-slate-300"/>
                        <h2 className="text-xl font-bold text-slate-700">Theory Materials Coming Soon</h2>
                        <p>Reading materials for {course.title} are being developed.</p>
                        <button onClick={() => setViewMode('video')} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                          Switch to Video Mode
                        </button>
                      </div>
                    )}
                  </div>

                ) : currentLesson?.youtubeId ? (
                  /* ── YouTube Video ── */
                  <>
                    <div className="w-full aspect-video bg-black rounded-xl shadow-md overflow-hidden">
                      <iframe src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0`}
                        title={currentLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen className="w-full h-full border-0"/>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h1 className="text-xl font-bold text-slate-900 mb-1">{currentLesson.title}</h1>
                          <p className="text-slate-500 text-sm">⏱ {currentLesson.duration} · 🎓 {course.instructor}</p>
                        </div>
                        {/* Mark complete button */}
                        {!completedLessonIds.has(currentLesson.id) && (
                          <button onClick={markLessonComplete} className="shrink-0 flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            <CheckCircle size={15}/> Mark Complete
                          </button>
                        )}
                        {completedLessonIds.has(currentLesson.id) && (
                          <span className="shrink-0 flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                            <CheckCircle size={16}/> Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── After last HTML lesson: Quiz gate ── */}
                    {requiresQuiz && isLastHTMLLesson && !htmlQuizPassed && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 text-center">
                        <Trophy size={36} className="mx-auto text-amber-600 mb-3"/>
                        <h3 className="text-xl font-bold text-amber-900 mb-2">HTML Module Complete! 🎉</h3>
                        <p className="text-amber-700 mb-4">You must pass the <strong>HTML Master Quiz</strong> to unlock the CSS section and continue your journey.</p>
                        <div className="flex justify-center gap-3 text-sm text-amber-800 mb-5 flex-wrap">
                          <span className="bg-amber-100 px-3 py-1 rounded-full font-medium">📝 50 Questions</span>
                          <span className="bg-amber-100 px-3 py-1 rounded-full font-medium">⏱ 50 Minutes</span>
                          <span className="bg-amber-100 px-3 py-1 rounded-full font-medium">🎯 Pass: 60/100</span>
                          <span className="bg-amber-100 px-3 py-1 rounded-full font-medium">🔁 Randomised each attempt</span>
                        </div>
                        <button onClick={() => setShowHTMLFinalQuiz(true)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all hover:shadow-lg flex items-center gap-2 mx-auto">
                          <Award size={20}/> Start HTML Quiz → Unlock CSS
                        </button>
                      </div>
                    )}

                    {/* ── Quiz passed confirmation ── */}
                    {requiresQuiz && htmlQuizPassed && isInHTMLModule && (
                      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle size={24} className="text-green-600 shrink-0"/>
                        <div>
                          <p className="font-bold text-green-800">HTML Quiz Passed!</p>
                          <p className="text-sm text-green-600">CSS Fundamentals are now unlocked. Continue your journey →</p>
                        </div>
                        <button onClick={() => {
                          const firstCss = cssLessons[0];
                          if (firstCss) setActiveLesson(firstCss);
                        }} className="ml-auto shrink-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                          Start CSS →
                        </button>
                      </div>
                    )}

                    {/* ── CSS locked warning when in CSS module ── */}
                    {requiresQuiz && htmlQuizPassed && isInCSSModule && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 text-sm text-blue-800">
                        <CheckCircle size={16} className="text-blue-500 shrink-0"/>
                        HTML Quiz completed · CSS section unlocked · Keep going!
                      </div>
                    )}
                  </>

                ) : (
                  /* ── Code Exercise ── */
                  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4"/>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">{currentLesson?.title}</h2>
                    <p className="text-slate-500">Open the Code Playground to complete this exercise.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonViewer;

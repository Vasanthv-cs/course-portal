import { Flame, Target, Trophy, Clock, PlayCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourses } from '../contexts/CourseContext';

const Dashboard = () => {
  const { courses } = useCourses();
  const enrolled = courses.filter(c => c.enrolled);
  const totalLessons = enrolled.reduce((s, c) => s + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0);
  const completedLessons = enrolled.reduce((s, c) => s + c.modules.reduce((a, m) => a + m.lessons.filter(l => l.completed).length, 0), 0);
  const totalQuizzes = enrolled.reduce((s, c) => s + c.modules.filter(m => m.quiz && m.quiz.length > 0).length, 0);
  const avgProgress = enrolled.length ? Math.round(enrolled.reduce((s, c) => s + c.progress, 0) / enrolled.length) : 0;

  // Recommended = courses NOT enrolled
  const recommended = courses.filter(c => !c.enrolled).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back! 👋</h1>
          <p className="text-slate-500 mt-1">You've completed {completedLessons} of {totalLessons} lessons. Keep going!</p>
        </div>
        <Link to="/dashboard/learning" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-primary-600/20 transition-all flex items-center gap-2">
          <PlayCircle size={20}/>Resume Learning
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Flame size={24}/></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{enrolled.length}</div>
            <div className="text-sm font-medium text-slate-500">Enrolled Courses</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Target size={24}/></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{completedLessons}/{totalLessons}</div>
            <div className="text-sm font-medium text-slate-500">Lessons Done</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><BookOpen size={24}/></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalQuizzes}</div>
            <div className="text-sm font-medium text-slate-500">Quizzes Available</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><Trophy size={24}/></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{avgProgress}%</div>
            <div className="text-sm font-medium text-slate-500">Avg. Progress</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* In Progress */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">In Progress</h2>
              <Link to="/dashboard/catalog" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</Link>
            </div>
            <div className="space-y-4">
              {enrolled.map(course => {
                const allL = course.modules.flatMap(m => m.lessons);
                const nextLesson = allL.find(l => !l.completed) || allL[0];
                return (
                  <Link to="/dashboard/learning" key={course.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-5 hover:border-primary-300 transition-colors cursor-pointer group">
                    <div className={`w-full sm:w-40 h-24 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${course.gradient}`}>
                      <span className="text-white font-bold text-3xl">{course.icon}</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">{course.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 mb-3">Next: {nextLesson?.title || 'All complete!'}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${course.progress}%` }}/>
                        </div>
                        <span className="text-sm font-bold text-slate-700 w-10 text-right">{course.progress}%</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {enrolled.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p>No courses enrolled yet.</p>
                  <Link to="/dashboard/catalog" className="text-primary-600 font-semibold mt-2 inline-block">Browse Catalog →</Link>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recommended */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {recommended.map(course => (
                <Link to="/dashboard/catalog" key={course.id} className="group cursor-pointer block">
                  <div className={`h-28 bg-gradient-to-br ${course.gradient} rounded-lg mb-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform`}>
                    <span className="text-white font-bold text-2xl">{course.icon}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors text-sm">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={14}/>{course.duration}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/dashboard/catalog" className="block w-full mt-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
              Explore Catalog
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

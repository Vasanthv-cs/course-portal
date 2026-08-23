import { useState } from 'react';
import { Search, Star, BookOpen } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { courses } = useCourses();
  const categories = ['All', 'Web Development', 'Data Science', 'Backend', 'DevOps'];
  const navigate = useNavigate();

  let filtered = activeCategory === 'All' ? courses : courses.filter(c => c.tags.includes(activeCategory));
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.instructor.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Course Catalog</h1>
        <p className="text-slate-500">Browse {courses.length} courses with real YouTube tutorials, quizzes & projects.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
          <input
            type="text" placeholder="Search courses, topics, instructors..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div className="flex w-full lg:w-auto overflow-x-auto gap-2 pb-2 lg:pb-0">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(course => {
          const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
          const totalQuizzes = course.modules.filter(m => m.quiz && m.quiz.length > 0).length;
          return (
            <div key={course.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col hover:border-primary-300">
              <div className={`h-44 w-full bg-gradient-to-br ${course.gradient} relative flex items-center justify-center`}>
                <span className="text-white font-bold text-4xl opacity-90 group-hover:scale-110 transition-transform duration-500">
                  {course.icon}
                </span>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
                  <Star size={14} className="text-yellow-500 fill-yellow-500"/>{course.rating}
                </div>
                {course.enrolled && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Enrolled
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {course.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">{tag}</span>
                  ))}
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-primary-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-1">By <span className="text-slate-700 font-medium">{course.instructor}</span></p>
                <p className="text-xs text-slate-400 mb-4">{totalLessons} lessons • {totalQuizzes} quizzes • {course.reviews.toLocaleString()} reviews</p>

                {course.enrolled && course.progress > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${course.progress}%` }}/>
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-10 text-right">{course.progress}%</span>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => navigate('/learning', { state: { courseId: course.id, viewMode: 'video' } })}
                    className="flex-1 bg-primary-50 text-primary-700 hover:bg-primary-100 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Learn Video
                  </button>
                  <button 
                    onClick={() => navigate('/learning', { state: { courseId: course.id, viewMode: 'theory' } })}
                    className="flex-1 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Read Theory
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50"/>
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm mt-1">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;

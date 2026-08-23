import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, PlayCircle, X, Flame, CheckCircle, Award, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  const { user, notifications, markNotificationsRead } = useAuth();
  const { courses } = useCourses();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = search.trim() === '' ? [] : courses.flatMap(course => {
    const courseMatches = course.title.toLowerCase().includes(search.toLowerCase());
    const matchedLessons = course.modules.flatMap(m => m.lessons).filter(l => 
      l.title.toLowerCase().includes(search.toLowerCase())
    );

    if (courseMatches || matchedLessons.length > 0) {
      return {
        course,
        lessons: matchedLessons.slice(0, 3)
      };
    }
    return [];
  }).slice(0, 5);

  const handleResultClick = (courseId: string) => {
    setSearch('');
    setShowResults(false);
    navigate('/learning', { state: { courseId } });
  };

  const toggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
    setShowNotifications(!showNotifications);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame size={16} className="text-orange-500" />;
      case 'quiz': return <Award size={16} className="text-green-500" />;
      case 'achievement': return <CheckCircle size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-700 shrink-0">
          <Menu size={24} />
        </button>

        <div className="relative max-w-md w-full" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search courses, lessons..." 
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}

          {showResults && search.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[80vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No results found for "{search}"</div>
              ) : (
                <div className="py-2">
                  {results.map((res, i) => (
                    <div key={res.course.id}>
                      <button 
                        onClick={() => handleResultClick(res.course.id)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-start gap-3"
                      >
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-white bg-gradient-to-br ${res.course.gradient}`}>
                          {res.course.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-800 text-sm truncate">{res.course.title}</div>
                          {res.lessons.length > 0 && (
                            <div className="mt-1 space-y-1">
                              {res.lessons.map(l => (
                                <div key={l.id} className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                                  <PlayCircle size={12} className="shrink-0 text-primary-500" />
                                  <span className="truncate">{l.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                      {i < results.length - 1 && <div className="mx-4 my-1 h-px bg-slate-100" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0 pl-2 md:pl-4">
        
        {/* Streak Tracker */}
        {user?.currentStreak !== undefined && user.currentStreak > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
            <Flame size={16} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-700">{user.currentStreak} Day{user.currentStreak > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={toggleNotifications} className="relative text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-50">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[80vh] flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                {unreadCount > 0 && <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    <Bell size={24} className="mx-auto text-slate-300 mb-2" />
                    No notifications yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((n, i) => (
                      <div key={n._id || i} className={`p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!n.read ? 'bg-primary-50/30' : ''}`}>
                        <div className={`p-2 rounded-full shrink-0 ${
                          n.type === 'streak' ? 'bg-orange-100' :
                          n.type === 'quiz' ? 'bg-green-100' :
                          n.type === 'achievement' ? 'bg-blue-100' : 'bg-slate-100'
                        }`}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 mb-0.5">{n.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2 uppercase font-semibold tracking-wider">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-2 md:pl-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">{user?.name || 'Student'}</div>
            <div className="text-[10px] uppercase tracking-wider text-primary-600 font-bold">{user?.role || 'PRO MEMBER'}</div>
          </div>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover shadow-sm border border-slate-200" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {(user?.name || 'S').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Home, BookOpen, Code, Award, Briefcase, User, Settings, Compass, HelpCircle, LogOut, Target, ShieldCheck, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: Props) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Course Catalog', icon: Compass, path: '/dashboard/catalog' },
    { name: 'My Learning', icon: BookOpen, path: '/dashboard/learning' },
    { name: 'Code Playground', icon: Code, path: '/dashboard/playground' },
    { name: 'Practice Labs', icon: Target, path: '/dashboard/labs' },
    { name: 'Secure Mock Test', icon: ShieldCheck, path: '/dashboard/mocktest' },
    { name: 'Certificates', icon: Award, path: '/dashboard/certificates' },
    { name: 'Career Center', icon: Briefcase, path: '/dashboard/career' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', icon: Settings, path: '/dashboard/admin' });
  }

  const bottomItems = [
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    { name: 'Help & Support', icon: HelpCircle, path: '/dashboard/support' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 h-screen flex flex-col transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Code size={24} />
            </div>
            EasyLearn<span className="text-primary-600">Pro</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === '/dashboard'
              ? location.pathname === '/dashboard' || location.pathname === '/dashboard/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-200">
          <nav className="space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => onClose()}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <item.icon size={20} className="text-slate-400" />
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => { logout(); onClose(); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors mt-2"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

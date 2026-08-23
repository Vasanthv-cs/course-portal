import { User, Mail, MapPin, Calendar, Award, BookOpen, Star, Activity, Briefcase } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900 w-full relative">
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            Edit Cover
          </button>
        </div>
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-slate-500 shadow-md relative overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 shrink-0">
              <span className="text-4xl font-bold text-primary-700">JD</span>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">John Doe</h1>
              <p className="text-slate-500 text-sm sm:text-base font-medium">Full Stack Developer • Lifelong Learner</p>
            </div>
            <div className="pb-2 flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm">
                Edit Profile
              </button>
              <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/> San Francisco, CA</div>
            <div className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400"/> john.doe@example.com</div>
            <div className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400"/> Joined Jan 2024</div>
            <div className="flex items-center gap-1.5 text-slate-800 hover:text-primary-600 cursor-pointer"><Github size={16}/> github.com/johndoe</div>
            <div className="flex items-center gap-1.5 text-slate-800 hover:text-primary-600 cursor-pointer"><Linkedin size={16}/> linkedin.com/in/johndoe</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* About Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <User size={18} className="text-primary-600"/> About
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Passionate software engineer transitioning into full-stack web development. I love building intuitive user interfaces and scalable backend systems. Currently focused on mastering React, Node.js, and Cloud Architecture.
            </p>
          </div>

          {/* Skills Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-primary-600"/> Top Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Python', 'SQL', 'Git', 'Tailwind'].map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-200 cursor-default transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-primary-600 flex justify-center mb-1"><BookOpen size={24}/></div>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Courses</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-yellow-500 flex justify-center mb-1"><Award size={24}/></div>
              <div className="text-2xl font-bold text-slate-800">8</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Certificates</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-purple-500 flex justify-center mb-1"><Star size={24}/></div>
              <div className="text-2xl font-bold text-slate-800">24.5k</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total XP</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Recent Achievements</h3>
              <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="p-0">
              <div className="flex items-start gap-4 p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Completed Advanced React Architecture</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Earned certificate and 500 XP.</p>
                  <div className="text-xs text-slate-400 mt-2">2 days ago</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Finished Capstone Project: E-commerce API</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Successfully deployed to production and passed all tests.</p>
                  <div className="text-xs text-slate-400 mt-2">1 week ago</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple stub for Settings icon in Profile since it's missing import
function Settings({size}: {size: number}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
}

function Github({size}: {size: number}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
}

function Linkedin({size}: {size: number}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
}

export default Profile;

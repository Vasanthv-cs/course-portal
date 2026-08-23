import { Briefcase, FileText, Search, MapPin, Building, ChevronRight, CheckCircle, FileCheck, Target } from 'lucide-react';

const Career = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Career Center</h1>
        <p className="text-slate-500 max-w-2xl">Land your dream job with our comprehensive career tools, ATS-friendly resume builder, and exclusive job board.</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">Resume Builder</h3>
          <p className="text-sm text-slate-500 mb-4">Create an ATS-optimized resume using our proven templates designed for tech roles.</p>
          <div className="flex justify-between items-center text-sm font-semibold text-primary-600">
            Start Building <ChevronRight size={16} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <FileCheck size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">ATS Scanner</h3>
          <p className="text-sm text-slate-500 mb-4">Upload your current resume and get a detailed score based on job description matching.</p>
          <div className="flex justify-between items-center text-sm font-semibold text-primary-600">
            Scan Resume <ChevronRight size={16} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Target size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">Interview Prep</h3>
          <p className="text-sm text-slate-500 mb-4">Practice with our AI interviewer. Get feedback on system design, algorithms, and behavioral questions.</p>
          <div className="flex justify-between items-center text-sm font-semibold text-primary-600">
            Start Practice <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Job Board Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Exclusive Job Board</h2>
            <p className="text-sm text-slate-500">Curated opportunities for EasyLearn graduates.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Job Item 1 */}
          <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                T
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Senior React Developer</h4>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Building size={14} /> TechCorp Inc.</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> Remote (US)</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> Full-time</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> Easy Apply
              </span>
              <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
                Apply Now
              </button>
            </div>
          </div>

          {/* Job Item 2 */}
          <div className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                G
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Backend Engineer (Node.js)</h4>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Building size={14} /> Global Systems</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> New York, NY</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> Hybrid</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-3">
              <span className="text-sm font-medium text-slate-500">Posted 2h ago</span>
              <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 text-center bg-slate-50">
          <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All 150+ Jobs</button>
        </div>
      </div>

    </div>
  );
};

export default Career;

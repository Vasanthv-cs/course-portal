import { useState } from 'react';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { courses as seedData } from '../data/courses';
import { Save, Plus, Trash2, Code, Database, RefreshCw } from 'lucide-react';
import { courseApi } from '../api/courses';

const AdminPanel = () => {
  const { courses, refreshCourses } = useCourses();
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | 'NEW'>('');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Access Denied: You must be an administrator to view this page.
      </div>
    );
  }

  const handleSelectCourse = (id: string | 'NEW') => {
    setSelectedCourseId(id);
    setError('');
    setSuccess('');
    
    if (id === 'NEW') {
      setJsonInput(JSON.stringify({
        id: 'new-course',
        title: 'New Course Title',
        description: 'Course description...',
        instructor: user.name,
        icon: '🚀',
        gradient: 'from-blue-500 to-cyan-500',
        modules: []
      }, null, 2));
    } else {
      const c = courses.find(c => c.id === id);
      if (c) {
        // Remove MongoDB internal fields for cleaner editing
        const clean = JSON.parse(JSON.stringify(c));
        delete clean._id;
        delete clean.__v;
        delete clean.createdAt;
        delete clean.updatedAt;
        setJsonInput(JSON.stringify(clean, null, 2));
      }
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.id || !parsed.title) throw new Error('Course must have at least an "id" and "title"');

      if (selectedCourseId === 'NEW') {
        await courseApi.create(parsed);
        setSuccess('Course created successfully!');
        setSelectedCourseId(parsed.id);
      } else {
        await courseApi.update(selectedCourseId, parsed);
        setSuccess('Course updated successfully!');
      }
      await refreshCourses();
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax or API error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This cannot be undone.')) return;
    setSaving(true);
    try {
      await courseApi.delete(selectedCourseId);
      await refreshCourses();
      setSelectedCourseId('');
      setJsonInput('');
      setSuccess('Course deleted.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('WARNING: This will wipe all existing courses and reset them to default values. Proceed?')) return;
    setSaving(true);
    try {
      await courseApi.seed(seedData);
      await refreshCourses();
      setSelectedCourseId('');
      setJsonInput('');
      setSuccess('Database seeded successfully!');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Database className="text-primary-600" />
            Course Database Admin
          </h1>
          <p className="text-slate-500 mt-1">Add, edit, or remove courses directly from the database.</p>
        </div>
        <button 
          onClick={handleSeed}
          className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={16} /> Factory Reset (Seed DB)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <button 
            onClick={() => handleSelectCourse('NEW')}
            className={`p-4 border-2 border-dashed rounded-xl flex items-center gap-3 justify-center font-bold transition-colors ${
              selectedCourseId === 'NEW' ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-slate-300 text-slate-500 hover:border-primary-400 hover:text-primary-500'
            }`}
          >
            <Plus size={20} /> Create New Course
          </button>
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 text-sm">
              Existing Courses ({courses.length})
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[60vh]">
              {courses.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleSelectCourse(c.id)}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                    selectedCourseId === c.id ? 'bg-primary-50 border-l-4 border-primary-600' : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <div className="truncate">
                    <div className={`font-semibold truncate text-sm ${selectedCourseId === c.id ? 'text-primary-700' : 'text-slate-800'}`}>
                      {c.title}
                    </div>
                    <div className="text-xs text-slate-400 font-mono truncate">{c.id}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[calc(100vh-12rem)] min-h-[600px]">
          {selectedCourseId ? (
            <>
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl shrink-0">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Code size={18} className="text-slate-500" /> 
                  JSON Editor: {selectedCourseId === 'NEW' ? 'New Course' : selectedCourseId}
                </h2>
                <div className="flex gap-2">
                  {selectedCourseId !== 'NEW' && (
                    <button 
                      onClick={handleDelete}
                      disabled={saving}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              
              {/* Feedback messages */}
              {error && <div className="mx-4 mt-4 p-3 bg-red-50 text-red-700 text-sm font-semibold border border-red-200 rounded-lg shrink-0">{error}</div>}
              {success && <div className="mx-4 mt-4 p-3 bg-green-50 text-green-700 text-sm font-semibold border border-green-200 rounded-lg shrink-0">{success}</div>}

              <div className="flex-1 p-4 overflow-hidden flex flex-col">
                <p className="text-xs text-slate-500 mb-2 font-medium flex-shrink-0">
                  Edit the course schema directly. Ensure it is valid JSON.
                </p>
                <textarea
                  className="w-full flex-1 bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3">
              <Database size={48} className="opacity-20" />
              <p className="font-medium text-slate-500">Select a course to edit or create a new one.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;

import { useState, useEffect, useRef } from 'react';
import { Award, Download, Share2, FileCheck } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import { progressApi } from '../api/progress';
import { useAuth } from '../contexts/AuthContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CompletedCourse {
  id: string;
  certId: string;
  title: string;
  date: string;
  instructor: string;
  skills: string[];
  image: string;
  gradient: string;
}

const Certificates = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [completedCerts, setCompletedCerts] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Hidden references for PDF generation
  const certRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await progressApi.getAll();
        const progresses = res.data;
        const certs: CompletedCourse[] = [];

        for (const p of progresses) {
          const course = courses.find(c => c.id === p.courseId);
          if (!course) continue;

          const isHTMLCourse = course.id === 'html-css';
          const requiresQuiz = isHTMLCourse && course.htmlQuizRequired === true;
          
          const allLessons = course.modules.flatMap(m => m.lessons);
          const completedCount = p.completedLessons.length;
          
          let isComplete = false;
          if (requiresQuiz) {
            // For HTML/CSS, all lessons + quiz passed
            isComplete = p.htmlQuizPassed && completedCount === allLessons.length;
          } else {
            isComplete = completedCount === allLessons.length && allLessons.length > 0;
          }

          if (isComplete) {
            const dateStr = new Date(p.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            certs.push({
              id: course.id,
              certId: `CERT-${user?.id?.substring(0, 5).toUpperCase()}-${course.id.substring(0, 4).toUpperCase()}`,
              title: course.title,
              date: dateStr,
              instructor: course.instructor,
              skills: [course.id.toUpperCase(), 'Web Development', 'Verified'],
              image: course.gradient,
              gradient: course.gradient
            });
          }
        }
        setCompletedCerts(certs);
      } catch (err) {
        console.error('Failed to load certificates', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCerts();
  }, [user]);

  const handleDownload = async (cert: CompletedCourse) => {
    setDownloadingId(cert.certId);
    try {
      const el = certRefs.current[cert.certId];
      if (!el) throw new Error('Certificate template not found');
      
      // Temporarily show the element so html2canvas can capture it properly
      el.style.display = 'block';
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      el.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${cert.title.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Certificates</h1>
        <p className="text-slate-500">View, download, and share your verified certificates.</p>
      </div>

      {completedCerts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
          <FileCheck size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No certificates yet</h2>
          <p className="text-slate-500 max-w-md mx-auto">Complete all lessons and pass the final module quizzes in a course to earn your verified certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {completedCerts.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              
              {/* Visual Certificate Representation (UI Version) */}
              <div className={`h-48 bg-gradient-to-br ${cert.image} relative p-6 flex flex-col justify-between text-white overflow-hidden`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Award size={120} />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="font-bold text-lg tracking-wider opacity-90">EasyLearn<span className="font-normal opacity-70">Pro</span></div>
                  <div className="text-xs font-mono opacity-80">{cert.certId}</div>
                </div>
                <div className="relative z-10">
                  <div className="text-sm opacity-80 uppercase tracking-widest mb-1 font-semibold">Certificate of Completion</div>
                  <h3 className="text-2xl font-bold leading-tight">{cert.title}</h3>
                </div>
              </div>
              
              {/* Details & Actions */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Issued To</p>
                    <p className="font-semibold text-slate-800">{user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-semibold text-slate-800">{cert.date}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-2">Verified By</p>
                  <p className="font-semibold text-slate-800">{cert.instructor}</p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                  <button 
                    onClick={() => handleDownload(cert)}
                    disabled={downloadingId === cert.certId}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    {downloadingId === cert.certId ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {downloadingId === cert.certId ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Hidden High-Res Template for PDF Generation */}
              <div 
                ref={(el) => { certRefs.current[cert.certId] = el; }}
                className="absolute top-[-9999px] left-[-9999px]"
                style={{ width: '1056px', height: '816px', display: 'none' }} // US Letter Landscape at 96 DPI
              >
                <div className={`w-full h-full bg-gradient-to-br ${cert.gradient} relative overflow-hidden flex flex-col items-center justify-center text-white p-12 border-[16px] border-white shadow-inner`}>
                  <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Award size={400} />
                  </div>
                  <div className="absolute top-12 left-12">
                    <div className="font-bold text-3xl tracking-widest opacity-90">EasyLearn<span className="font-normal opacity-70">Pro</span></div>
                  </div>
                  <div className="absolute top-12 right-12">
                    <div className="font-mono text-xl opacity-80">ID: {cert.certId}</div>
                  </div>

                  <div className="text-center z-10 w-full px-20">
                    <h4 className="text-2xl font-semibold uppercase tracking-[0.3em] opacity-80 mb-6">Certificate of Completion</h4>
                    <p className="text-xl opacity-90 mb-4">This is to certify that</p>
                    <h1 className="text-7xl font-bold mb-6 font-serif">{user?.name}</h1>
                    <p className="text-xl opacity-90 mb-8">has successfully completed the comprehensive course</p>
                    <h2 className="text-5xl font-extrabold mb-16 leading-tight">{cert.title}</h2>
                    
                    <div className="flex justify-between items-end border-t-2 border-white/30 pt-8 w-full">
                      <div className="text-left">
                        <p className="text-2xl font-bold">{cert.date}</p>
                        <p className="text-lg opacity-80 uppercase tracking-widest mt-1">Date Issued</p>
                      </div>
                      <div className="text-center">
                        <Award size={64} className="text-amber-400 mx-auto" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-signature italic">{cert.instructor}</p>
                        <p className="text-lg opacity-80 uppercase tracking-widest mt-1">Lead Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;

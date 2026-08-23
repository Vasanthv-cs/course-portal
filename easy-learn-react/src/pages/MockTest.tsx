import { useState, useEffect, useRef } from 'react';
import { Camera, Monitor, ShieldAlert, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { mockQuestions } from '../data/mockTest';
import { useNavigate } from 'react-router-dom';

const MockTest = () => {
  const [status, setStatus] = useState<'setup' | 'running' | 'completed'>('setup');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const navigate = useNavigate();

  // Stop tracks when unmounting or test completed
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, []);

  const stopMedia = () => {
    if (videoStream) videoStream.getTracks().forEach(t => t.stop());
    if (screenStream) screenStream.getTracks().forEach(t => t.stop());
  };

  const startTest = async () => {
    setError(null);
    try {
      // Request Camera & Mic
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(camStream);
      if (videoRef.current) videoRef.current.srcObject = camStream;

      // Request Screen Share
      const scnStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } });
      
      // Listen for stop sharing
      scnStream.getVideoTracks()[0].onended = () => {
        alert("Screen sharing stopped. The test requires screen sharing.");
        stopMedia();
        setStatus('setup');
      };

      setScreenStream(scnStream);
      if (screenRef.current) screenRef.current.srcObject = scnStream;

      // If both granted, start test
      setStatus('running');

      // Request full screen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(e => console.log(e));
      }

    } catch (err: any) {
      console.error(err);
      setError("Please grant camera, microphone, and screen sharing permissions to start the secure test.");
      stopMedia();
    }
  };

  const handleNext = () => {
    if (currentQ < mockQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setStatus('completed');
    stopMedia();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log(e));
    }
  };

  if (status === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Secure Mock Test</h1>
          <p className="text-slate-600 mb-6 text-sm">
            This is a proctored test environment. You will be required to share your entire screen, camera, and microphone. 
            The test contains {mockQuestions.length} questions.
          </p>
          
          <div className="space-y-3 text-left bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Camera size={18} className="text-slate-400" /> Web camera access required
            </div>
            <div className="flex items-center gap-3">
              <Monitor size={18} className="text-slate-400" /> Full screen sharing required
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-slate-400" /> Do not exit fullscreen mode
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-4 font-medium">{error}</div>}

          <button 
            onClick={startTest}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold shadow-sm transition-colors flex justify-center items-center gap-2"
          >
            <PlayCircle size={20} /> Start Secure Test
          </button>
        </div>
      </div>
    );
  }

  if (status === 'completed') {
    const score = Object.keys(answers).reduce((acc, qId) => {
      const q = mockQuestions.find(mq => mq.id === Number(qId));
      if (q && q.correctAnswer === answers[Number(qId)]) return acc + 1;
      return acc;
    }, 0);

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white p-10 rounded-xl border border-slate-200 shadow-sm max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Test Completed</h1>
          <p className="text-slate-500 mb-6">Your secure proctored session has ended.</p>
          
          <div className="bg-slate-50 py-6 rounded-lg border border-slate-100 mb-8">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Your Score</div>
            <div className="text-5xl font-extrabold text-slate-800">
              {score} <span className="text-2xl text-slate-400 font-medium">/ {mockQuestions.length}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = mockQuestions[currentQ];
  const hasAnsweredCurrent = answers[q.id] !== undefined;

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      {/* Main Question Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800">Mock Test</h2>
          <div className="text-sm font-medium px-3 py-1 bg-slate-200 text-slate-700 rounded-full">
            Question {currentQ + 1} of {mockQuestions.length}
          </div>
        </div>
        
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-8 leading-relaxed">
              {currentQ + 1}. {q.question}
            </h3>
            
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === i;
                return (
                  <button 
                    key={i}
                    onClick={() => setAnswers({...answers, [q.id]: i})}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium shadow-sm' 
                        : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="inline-block w-6 text-slate-400 font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <button 
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          
          {currentQ === mockQuestions.length - 1 ? (
            <button 
              onClick={finishTest}
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              Finish Test
            </button>
          ) : (
            <button 
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Proctoring Sidebar */}
      <div className="w-64 flex flex-col gap-4 shrink-0">
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-800 relative group aspect-video">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover transform -scale-x-100" 
          />
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
            REC
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-800 relative aspect-video">
          <video 
            ref={screenRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
            Screen Share
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Proctoring Status</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Camera active</li>
            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Screen shared</li>
            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Audio monitoring</li>
            <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Fullscreen mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MockTest;

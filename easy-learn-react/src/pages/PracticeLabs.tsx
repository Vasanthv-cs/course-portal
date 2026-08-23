import { useState } from 'react';
import { Code, CheckCircle, Play, Layers, Code2, Briefcase, ChevronRight, Terminal } from 'lucide-react';
import { labs } from '../data/labs';
import { algorithms } from '../data/algorithms';
import { projects } from '../data/projects';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const PracticeLabs = () => {
  const [activeTab, setActiveTab] = useState<'algorithms' | 'labs' | 'projects'>('algorithms');
  
  // Algorithms State
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [algoCode, setAlgoCode] = useState(algorithms[0].startingCode);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Labs State
  const [selectedLab, setSelectedLab] = useState(labs[0]);

  // Projects State
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const navigate = useNavigate();

  const handleStartCodingLab = () => {
    navigate('/playground', { 
      state: { 
        initialCode: selectedLab.startingCode,
        initialLanguage: selectedLab.language.toLowerCase().includes('html') ? 'html' : 'javascript'
      } 
    });
  };

  const handleAlgoSelect = (algo: any) => {
    setSelectedAlgo(algo);
    setAlgoCode(algo.startingCode);
    setTestResults([]);
  };

  const runAlgorithmTests = () => {
    setIsRunning(true);
    setTestResults([]);
    
    setTimeout(() => {
      try {
        // Safe evaluation of the user's code
        // We wrap it to return the function they defined
        // Using regex to find the function name
        const match = algoCode.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        if (!match) throw new Error("Could not find a function definition.");
        const fnName = match[1];
        
        const wrapper = `
          ${algoCode}
          return ${fnName};
        `;
        const userFn = new Function(wrapper)();

        const results = selectedAlgo.testCases.map((tc, index) => {
          try {
            const args = JSON.parse(tc.input);
            const output = userFn(...args);
            const passed = JSON.stringify(output) === JSON.stringify(tc.expectedOutput);
            return { index, passed, output, expected: tc.expectedOutput, input: tc.input };
          } catch (err: any) {
            return { index, passed: false, error: err.message, input: tc.input };
          }
        });

        setTestResults(results);
      } catch (err: any) {
        setTestResults([{ index: 0, passed: false, error: err.message, isCompileError: true }]);
      } finally {
        setIsRunning(false);
      }
    }, 500); // Simulate network/processing delay
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 p-2 flex gap-2 shrink-0">
        <button 
          onClick={() => setActiveTab('algorithms')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-colors ${
            activeTab === 'algorithms' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Code2 size={18} />
          Algorithm Practice
        </button>
        <button 
          onClick={() => setActiveTab('labs')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-colors ${
            activeTab === 'labs' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers size={18} />
          Frontend Labs
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-colors ${
            activeTab === 'projects' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Briefcase size={18} />
          Mini Projects
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* --- TAB: ALGORITHMS (LEETCODE STYLE) --- */}
        {activeTab === 'algorithms' && (
          <>
            <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-bold text-lg text-slate-800">Algorithms</h2>
                <p className="text-sm text-slate-500">Pass the test cases</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {algorithms.map((algo) => (
                  <div 
                    key={algo.id}
                    onClick={() => handleAlgoSelect(algo)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedAlgo.id === algo.id 
                        ? 'bg-primary-50 border-primary-300 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${selectedAlgo.id === algo.id ? 'text-primary-900' : 'text-slate-800'}`}>
                        {algo.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${
                        algo.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                        algo.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {algo.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col gap-4 overflow-hidden">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-y-auto flex-1 p-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">{selectedAlgo.title}</h1>
                <p className="text-slate-600 mb-6 leading-relaxed">{selectedAlgo.description}</p>
                
                <h3 className="font-bold text-slate-800 mb-3">Examples</h3>
                <div className="space-y-4">
                  {selectedAlgo.examples.map((ex, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono text-sm">
                      <div><span className="font-bold text-slate-500">Input:</span> {ex.input}</div>
                      <div className="mt-1"><span className="font-bold text-slate-500">Output:</span> {ex.output}</div>
                      {ex.explanation && <div className="mt-1 text-slate-500"><span className="font-bold">Explanation:</span> {ex.explanation}</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col flex-1 min-h-[300px]">
                <div className="p-3 border-b border-slate-200 bg-slate-900 flex justify-between items-center rounded-t-xl">
                  <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <Code2 size={16} /> JavaScript
                  </div>
                  <button 
                    onClick={runAlgorithmTests}
                    disabled={isRunning}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    <Play size={14} fill="currentColor" /> {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                </div>
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    language="javascript"
                    theme="vs-dark"
                    value={algoCode}
                    onChange={(val) => setAlgoCode(val || '')}
                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                  />
                </div>
                {testResults.length > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 h-48 overflow-y-auto">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Terminal size={16} /> Test Results
                    </h3>
                    {testResults[0].isCompileError ? (
                      <div className="text-red-600 font-mono text-sm p-3 bg-red-50 rounded border border-red-200">
                        <strong>Error:</strong> {testResults[0].error}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {testResults.map((tr, i) => (
                          <div key={i} className={`p-3 rounded border text-sm font-mono ${tr.passed ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <div className="font-bold mb-1">Test Case {i + 1}: {tr.passed ? '✅ Passed' : '❌ Failed'}</div>
                            <div className="text-slate-600">Input: {tr.input}</div>
                            {tr.error ? (
                              <div className="mt-1">Error: {tr.error}</div>
                            ) : !tr.passed ? (
                              <>
                                <div className="mt-1">Expected: {JSON.stringify(tr.expected)}</div>
                                <div>Actual: {JSON.stringify(tr.output)}</div>
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* --- TAB: FRONTEND LABS --- */}
        {activeTab === 'labs' && (
          <>
            <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-bold text-lg text-slate-800">Frontend Labs</h2>
                <p className="text-sm text-slate-500">Real-world coding exercises</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {labs.map((lab) => (
                  <div 
                    key={lab.id}
                    onClick={() => setSelectedLab(lab)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex items-start gap-3 ${
                      selectedLab.id === lab.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-1 ${selectedLab.id === lab.id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Code size={18} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${selectedLab.id === lab.id ? 'text-primary-900' : 'text-slate-800'}`}>{lab.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">{lab.language}</span>
                        <span className={`text-xs font-medium ${
                          lab.difficulty === 'Beginner' ? 'text-green-600' : lab.difficulty === 'Intermediate' ? 'text-orange-600' : 'text-red-600'
                        }`}>{lab.difficulty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{selectedLab.title}</h1>
                  <p className="text-slate-500 mt-2">{selectedLab.description}</p>
                </div>
                <button onClick={handleStartCodingLab} className="shrink-0 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition-all">
                  <Play size={18} fill="currentColor" /> Start Coding
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                  <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Target Outcome</h3>
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={selectedLab.outcomeImage} alt="Target outcome" className="w-full h-64 object-cover" />
                  </div>
                </section>
                <section>
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Implementation Flow</h3>
                  <div className="space-y-6">
                    {selectedLab.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shrink-0">{index + 1}</div>
                          {index < selectedLab.steps.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2"></div>}
                        </div>
                        <div className="pb-4">
                          <h4 className="font-bold text-slate-800">{step.title}</h4>
                          <p className="text-slate-600 mt-1 text-sm leading-relaxed">{step.description}</p>
                          {step.codeSnippet && (
                            <div className="mt-3 bg-slate-900 rounded-lg p-3 overflow-x-auto">
                              <pre className="text-sm text-slate-300 font-mono">{step.codeSnippet}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {/* --- TAB: MINI PROJECTS --- */}
        {activeTab === 'projects' && (
          <>
            <div className="w-full lg:w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-bold text-lg text-slate-800">Mini Projects</h2>
                <p className="text-sm text-slate-500">Build full applications</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {projects.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedProject.id === proj.id 
                        ? 'bg-primary-50 border-primary-300 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-primary-200'
                    }`}
                  >
                    <h3 className={`font-bold mb-1 ${selectedProject.id === proj.id ? 'text-primary-900' : 'text-slate-800'}`}>
                      {proj.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 2).map(tech => (
                        <span key={tech} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl font-bold text-slate-900">{selectedProject.title}</h1>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider ${
                    selectedProject.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                    selectedProject.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedProject.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {selectedProject.description}
                </p>
                
                <h3 className="font-bold text-slate-800 mb-3">Technologies Needed</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-slate-800 mb-4 text-xl">Core Tasks</h3>
                <div className="space-y-4">
                  {selectedProject.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                      <div className="mt-0.5 text-primary-600"><ChevronRight size={20} /></div>
                      <p className="text-slate-700 leading-relaxed">{task}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <h4 className="font-bold text-blue-900 mb-2">Ready to build?</h4>
                  <p className="text-blue-700 mb-4 text-sm">We recommend building projects locally in your own IDE (like VS Code) to get the true developer experience.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors">
                    Download Project Starter Files
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PracticeLabs;

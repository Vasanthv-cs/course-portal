import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Settings, Layout, Maximize, Code2, Terminal, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Playground = () => {
  const location = useLocation();
  const initialState = location.state as { initialCode?: string, initialLanguage?: string } | null;

  const [language, setLanguage] = useState(initialState?.initialLanguage || 'javascript');
  const [code, setCode] = useState(initialState?.initialCode || '// Welcome to EasyLearn Interactive Playground\n// Write your JavaScript code here\n\nfunction calculateFibonacci(n) {\n  if (n <= 1) return n;\n  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);\n}\n\nconsole.log("Fibonacci of 10 is:", calculateFibonacci(10));\n');
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    setOutput('Running...\n> Fibonacci of 10 is: 55\n\nExecution completed in 0.04s');
  };

  const handleReset = () => {
    setCode('// Write your code here\n');
    setOutput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toolbar */}
      <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <Code2 size={16} className="text-slate-400" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="javascript">JavaScript (Node 18)</option>
              <option value="python">Python 3.10</option>
              <option value="html">HTML/CSS/JS</option>
              <option value="java">Java 17</option>
              <option value="sql">SQL (PostgreSQL)</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors text-slate-300">
            <Sparkles size={14} className="text-purple-400" />
            AI Explain
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1"></div>
          <button onClick={handleReset} className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white" title="Reset">
            <RotateCcw size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white" title="Format">
            <Layout size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white" title="Settings">
            <Settings size={16} />
          </button>
          <button onClick={handleRunCode} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors ml-2 shadow-sm">
            <Play size={14} fill="currentColor" />
            Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Editor Area */}
        <div className="flex-1 border-r border-slate-200 flex flex-col relative">
          <div className="h-8 bg-slate-50 border-b border-slate-200 flex items-center px-4 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs font-medium text-slate-500 ml-4 flex-1 text-center mr-8">index.js</div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'html' ? 'html' : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              }}
            />
          </div>
        </div>

        {/* Terminal/Output Area */}
        <div className="w-1/3 bg-slate-900 flex flex-col shrink-0">
          <div className="h-8 bg-slate-800 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Terminal size={14} />
              Console Output
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Maximize size={14} />
            </button>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-slate-500 text-center mt-10">
                Click Run to execute your code
              </div>
            )}
          </div>
          
          {/* AI Assistant Mini-panel */}
          <div className="h-auto bg-slate-800 p-3 border-t border-slate-700">
            <div className="flex items-start gap-3">
              <div className="bg-slate-700 p-1.5 rounded-md text-purple-400 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-300 mb-1">AI Assistant</div>
                <div className="text-xs text-slate-400">Ready to help debug, explain, or optimize your code.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Playground;

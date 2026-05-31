import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, Terminal, Database, Code, Activity, Send, Copy, Trash2, 
  Clock, Fingerprint, AlertCircle
} from 'lucide-react';

import { Layout } from "../components/Layout/Layout";

const Card = ({ children, title, icon: Icon, description }) => (
  <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
    <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      </div>
    </div>
    <div className="p-5 flex-1">
      {children}
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100',
    outline: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 text-slate-700 dark:text-slate-300'
  };

  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default function App() {
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [jsonInput, setJsonInput] = useState('{"name": "Developer", "role": "Fullstack", "tools": ["React", "TypeScript", "Tailwind"]}');
  const [jsonError, setJsonError] = useState(null);

  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  const [copied, setCopied] = useState(false);

  const addLog = (message, level = 'info') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; 
    }
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRunApi = async () => {
    setIsLoading(true);
    addLog(`Initiating ${method} request to ${apiUrl}`, 'info');
    try {
      const response = await fetch(apiUrl, { method });
      const data = await response.json();
      setApiResponse(data);
      addLog(`Request successful: ${response.status} ${response.statusText}`, 'success');
    } catch (err) {
      setApiResponse({ error: err.message });
      addLog(`Request failed: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
      addLog('JSON formatted successfully', 'success');
    } catch (err) {
      setJsonError(err.message);
      addLog('JSON formatting failed', 'error');
    }
  };

  const generateUUID = () => {
    const uuid = crypto.randomUUID();
    addLog(`Generated UUID: ${uuid}`, 'info');
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
<Layout>
    <div className=" bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-8">
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Wrench size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Developer Toolkit</h1>
              <p className="text-slate-500 dark:text-slate-400">Useful utilities for testing and debugging your applications</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card title="API Tester" icon={Activity} description="Test REST endpoints quickly">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="md:w-32 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                  <input 
                    type="text" 
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.example.com/v1/resource"
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <Button onClick={handleRunApi} disabled={isLoading} icon={Send}>
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Response</span>
                    <div className={`w-2 h-2 rounded-full ${apiResponse ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <pre className="w-full h-64 bg-slate-900 rounded-xl p-4 overflow-auto text-xs font-mono text-indigo-300 border border-slate-800">
                    {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Response will appear here...'}
                  </pre>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Quick Utilities" icon={Database} description="One-click helpers">
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" icon={Fingerprint} className="justify-start text-left h-14" onClick={generateUUID}>
                <div>
                  <div className="text-sm font-semibold">{copied ? 'UUID Copied!' : 'Generate UUID'}</div>
                  <div className="text-[10px] opacity-60">Version 4 random identifier</div>
                </div>
              </Button>
              <Button variant="outline" icon={Clock} className="justify-start text-left h-14" onClick={() => addLog(`Unix Timestamp: ${Math.floor(Date.now()/1000)}`)}>
                <div>
                  <div className="text-sm font-semibold">Unix Timestamp</div>
                  <div className="text-[10px] opacity-60">{Math.floor(Date.now()/1000)}</div>
                </div>
              </Button>
              <Button variant="outline" icon={Copy} className="justify-start text-left h-14" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addLog('URL copied to clipboard', 'info');
              }}>
                <div>
                  <div className="text-sm font-semibold">Copy Current URL</div>
                  <div className="text-[10px] opacity-60">Save path to clipboard</div>
                </div>
              </Button>
            </div>
          </Card>

          <Card title="JSON Viewer" icon={Code} description="Validate and prettify objects">
            <div className="space-y-4">
              <div className="relative">
                <textarea 
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-48 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                  placeholder="Paste JSON here..."
                />
                {jsonError && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-red-500 text-[10px] font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded border border-red-100 dark:border-red-900/50">
                    <AlertCircle size={10} /> Invalid JSON
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" variant="secondary" onClick={formatJson}>
                  Format / Prettify
                </Button>
                <Button variant="outline" onClick={() => { setJsonInput(''); setJsonError(null); }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>

          <div className="xl:col-span-2">
            <Card title="Log Monitor" icon={Terminal} description="Real-time session events">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                <div className="px-4 py-2 bg-slate-800/50 flex items-center justify-between border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <button 
                    onClick={() => setLogs([])}
                    className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold"
                  >
                    Clear Logs
                  </button>
                </div>
                <div className="h-48 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
                  {logs.length === 0 ? (
                    <div className="text-slate-600 italic">No logs generated in this session...</div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="flex gap-3 mb-1 group">
                        <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                        <span className={`font-bold shrink-0 uppercase w-10 ${
                          log.level === 'error' ? 'text-red-400' : 
                          log.level === 'warn' ? 'text-amber-400' : 
                          log.level === 'success' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-slate-300 break-all">{log.message}</span>
                      </div>
                    ))
                  )}
                  <div ref={logEndRef} />
                </div>
              </div>
            </Card>
          </div>

        </div>

        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-xs">
            Built with React & Tailwind CSS • Dashboard Theme V2.4
          </p>
        </footer>
      </div>
    </div>
    </Layout>
  );
}

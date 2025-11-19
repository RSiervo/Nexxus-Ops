import React, { useState } from 'react';
import { analyzeSystemLogs } from '../services/geminiService';
import { AIAnalysisResult } from '../types';
import { Sparkles, AlertTriangle, CheckCircle, XCircle, Loader2, Copy, RefreshCw, FileText } from 'lucide-react';

const LogAnalyzer: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!logs.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeSystemLogs(logs);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze logs. Please check your API configuration and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleLogs = () => {
    setLogs(`[2023-10-27 14:23:45] ERROR [ConnectionPool] Timeout waiting for connection from pool
[2023-10-27 14:23:46] WARN  [RetryPolicy] Retrying operation request-ID: 9982
[2023-10-27 14:23:50] FATAL [Database] Transaction rollback failed due to deadlock detected in table 'orders'
[2023-10-27 14:23:51] INFO  [HealthCheck] Service 'OrderProcessing' is UNHEALTHY
[2023-10-27 14:24:00] ERROR [AppServer] OutOfMemoryError: Java heap space`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <div className="flex flex-col h-full space-y-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Log Input</h2>
            </div>
            <button 
              onClick={loadSampleLogs}
              className="text-xs text-slate-400 hover:text-cyan-400 underline"
            >
              Load Sample
            </button>
          </div>
          
          <textarea
            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
            placeholder="Paste system logs, stack traces, or error messages here..."
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
          />
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !logs.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze with Gemini
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex flex-col h-full">
        {result ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in flex-1 overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  Analysis Report
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  result.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                  result.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {result.severity} SEVERITY
                </span>
             </div>

             <div className="space-y-6">
               <div>
                 <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">Executive Summary</h3>
                 <p className="text-slate-200 leading-relaxed">{result.summary}</p>
               </div>

               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                 <h3 className="text-sm font-medium text-slate-400 uppercase mb-2 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-amber-400" />
                   Root Cause
                 </h3>
                 <p className="text-slate-200">{result.rootCause}</p>
               </div>

               <div>
                 <h3 className="text-sm font-medium text-slate-400 uppercase mb-3">Recommended Actions</h3>
                 <ul className="space-y-3">
                   {result.recommendations.map((rec, idx) => (
                     <li key={idx} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                       <div className="mt-0.5 bg-cyan-500/20 p-1 rounded text-cyan-400">
                         <CheckCircle className="w-4 h-4" />
                       </div>
                       <span className="text-slate-300 text-sm">{rec}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>
        ) : error ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex-1 flex items-center justify-center text-center">
             <div className="max-w-xs">
               <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <XCircle className="w-6 h-6" />
               </div>
               <h3 className="text-white font-medium mb-2">Analysis Failed</h3>
               <p className="text-slate-400 text-sm">{error}</p>
               <button onClick={() => setError(null)} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm">Try Again</button>
             </div>
          </div>
        ) : (
          <div className="bg-slate-800 border border-dashed border-slate-700 rounded-xl p-6 flex-1 flex items-center justify-center text-center">
            <div className="max-w-xs text-slate-500">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-slate-300 font-medium mb-2">Ready to Analyze</h3>
              <p className="text-sm">Paste your system logs on the left and let our Gemini AI model identify issues and solutions.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogAnalyzer;
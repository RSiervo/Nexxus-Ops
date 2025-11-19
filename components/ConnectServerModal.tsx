import React, { useState } from 'react';
import { X, Copy, Terminal, Check, Server, Loader2 } from 'lucide-react';
import { Server as ServerType, ServerStatus } from '../types';

interface ConnectServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (server: ServerType) => void;
}

const pythonScript = `
import psutil
import requests
import time
import os

# Nexus Ops Agent Configuration
SERVER_NAME = os.getenv('HOSTNAME', 'worker-node-01')
API_ENDPOINT = "https://api.nexus-ops.com/v1/ingest"
API_KEY = "nx_live_99882211"

def collect_metrics():
    """Collects system metrics using psutil"""
    return {
        "server_name": SERVER_NAME,
        "cpu": psutil.cpu_percent(interval=1),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "status": "ONLINE"
    }

print(f"🚀 Starting Nexus Agent on {SERVER_NAME}...")

while True:
    try:
        metrics = collect_metrics()
        # Send data to Django Backend
        # response = requests.post(
        #     API_ENDPOINT, 
        #     json=metrics, 
        #     headers={"Authorization": f"Bearer {API_KEY}"}
        # )
        print(f"✅ Metrics sent: {metrics}")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
    
    time.sleep(5)
`;

const ConnectServerModal: React.FC<ConnectServerModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateConnection = () => {
    setIsVerifying(true);
    // Simulate network delay and successful handshake
    setTimeout(() => {
      const newServer: ServerType = {
        id: `srv-${Math.floor(Math.random() * 10000)}`,
        name: `NEXUS-NEW-${Math.floor(Math.random() * 99)}`,
        ip: `10.0.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 255)}`,
        region: 'US-EAST-1',
        status: ServerStatus.ONLINE,
        cpuUsage: Math.floor(Math.random() * 30),
        memoryUsage: Math.floor(Math.random() * 40),
        diskUsage: 10,
        uptime: '0d 0h 1m',
        role: 'App Server',
      };
      onConnect(newServer);
      setIsVerifying(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <Server className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Connect Infrastructure</h2>
              <p className="text-sm text-slate-400">Install the Nexus Python Agent to stream metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Terminal className="w-5 h-5" />
              <span className="font-medium">Python / Linux</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-750 hover:text-slate-200 transition-all">
              <div className="w-5 h-5 flex items-center justify-center font-bold">Pw</div>
              <span className="font-medium">PowerShell</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-750 hover:text-slate-200 transition-all">
              <div className="w-5 h-5 flex items-center justify-center font-bold">Go</div>
              <span className="font-medium">Golang Agent</span>
            </button>
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agent Configuration Script</label>
               <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 rounded transition-colors"
               >
                 {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                 {copied ? <span className="text-emerald-400">Copied</span> : 'Copy to Clipboard'}
               </button>
             </div>
             
             <div className="relative">
               <pre className="bg-slate-950 rounded-lg p-4 text-xs text-slate-300 font-mono overflow-x-auto border border-slate-800 max-h-80 leading-relaxed">
                 <code>{pythonScript.trim()}</code>
               </pre>
             </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-4 flex gap-4 items-start">
            <div className="mt-1 bg-indigo-500/10 p-1.5 rounded text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="text-sm space-y-2">
              <p className="text-indigo-200 font-medium">Quick Start Guide</p>
              <ol className="list-decimal list-inside text-slate-400 space-y-1 ml-1">
                <li>SSH into your target Virtual Machine.</li>
                <li>Install dependencies: <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">pip install psutil requests</code></li>
                <li>Paste the script into <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">agent.py</code> and run it.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-xl flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden md:block">
            Waiting for heartbeat from <span className="font-mono text-slate-400">api.nexus-ops.com</span>...
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSimulateConnection}
              disabled={isVerifying}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Signal...
                </>
              ) : (
                <>
                  Verify Connection
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectServerModal;
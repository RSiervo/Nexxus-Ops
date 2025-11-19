import React from 'react';
import { NetworkNode } from '../types';
import { Globe, Server, Database, ShieldCheck, Activity } from 'lucide-react';

const NetworkTopology: React.FC = () => {
  // Mock topology data
  const nodes: NetworkNode[] = [
    { id: 'internet', type: 'INTERNET', label: 'Internet', status: 'active', x: 400, y: 50 },
    { id: 'lb1', type: 'LB', label: 'LB-External-01', status: 'active', x: 400, y: 200 },
    { id: 'app1', type: 'APP', label: 'App-Cluster-A', status: 'active', x: 200, y: 400 },
    { id: 'app2', type: 'APP', label: 'App-Cluster-B', status: 'active', x: 600, y: 400 },
    { id: 'db1', type: 'DB', label: 'Primary-DB', status: 'active', x: 300, y: 600 },
    { id: 'db2', type: 'DB', label: 'Replica-DB', status: 'active', x: 500, y: 600 },
  ];

  const connections = [
    { from: 'internet', to: 'lb1' },
    { from: 'lb1', to: 'app1' },
    { from: 'lb1', to: 'app2' },
    { from: 'app1', to: 'db1' },
    { from: 'app1', to: 'db2' },
    { from: 'app2', to: 'db1' },
    { from: 'app2', to: 'db2' },
  ];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'INTERNET': return <Globe className="w-6 h-6 text-blue-400" />;
      case 'LB': return <ShieldCheck className="w-6 h-6 text-purple-400" />;
      case 'APP': return <Server className="w-6 h-6 text-emerald-400" />;
      case 'DB': return <Database className="w-6 h-6 text-amber-400" />;
      default: return <Activity className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Network Topology
        </h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-400">Latency > 50ms</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden shadow-inner shadow-black/50">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>
          
          {/* Connections */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#334155"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                {/* Animated Packet */}
                <circle r="3" fill="#22d3ee">
                  <animateMotion 
                    dur={`${1.5 + idx * 0.2}s`} 
                    repeatCount="indefinite"
                    path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer group"
            style={{ left: node.x, top: node.y }}
          >
            <div className={`w-16 h-16 rounded-xl bg-slate-800 border-2 ${
              node.type === 'INTERNET' ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 
              'border-slate-700 group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            } flex items-center justify-center transition-all z-10 relative`}>
              {getNodeIcon(node.type)}
              
              {/* Status Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse"></div>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700 text-xs font-medium text-slate-300 whitespace-nowrap group-hover:text-white group-hover:border-cyan-500/50 transition-colors">
              {node.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkTopology;
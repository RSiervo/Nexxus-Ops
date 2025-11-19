import React from 'react';
import { LayoutDashboard, Server, FileText, Settings, Activity, Database, CloudLightning } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'servers', label: 'Infrastructure', icon: Server },
    { id: 'logs', label: 'AI Log Sentinel', icon: FileText },
    { id: 'network', label: 'Network Topology', icon: Activity },
    { id: 'storage', label: 'Storage Pools', icon: Database },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-cyan-500 p-2 rounded-lg">
          <CloudLightning className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">Nexus Ops</h1>
          <p className="text-xs text-slate-400">Data Center Monitor</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === 'settings'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
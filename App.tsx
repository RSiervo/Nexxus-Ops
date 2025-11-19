import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ServerList from './components/ServerList';
import LogAnalyzer from './components/LogAnalyzer';
import NetworkTopology from './components/NetworkTopology';
import StoragePools from './components/StoragePools';
import Settings from './components/Settings';
import { Server, ServerStatus } from './types';
import { Bell, Search, User } from 'lucide-react';

// Mock Data Generation
const generateInitialServers = (): Server[] => {
  const roles: Server['role'][] = ['Database', 'App Server', 'Load Balancer', 'Storage', 'AI Compute'];
  const statuses = [ServerStatus.ONLINE, ServerStatus.ONLINE, ServerStatus.ONLINE, ServerStatus.WARNING, ServerStatus.CRITICAL];
  const regions = ['US-EAST-1', 'US-WEST-2', 'EU-CENTRAL-1', 'AP-SOUTH-1'];
  
  return Array.from({ length: 15 }).map((_, i) => ({
    id: `srv-${i + 1}`,
    name: `NEXUS-${roles[i % roles.length].toUpperCase().slice(0, 3)}-0${i + 1}`,
    ip: `10.0.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 255)}`,
    region: regions[i % regions.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cpuUsage: Math.floor(Math.random() * 60) + 20,
    memoryUsage: Math.floor(Math.random() * 70) + 20,
    diskUsage: Math.floor(Math.random() * 90),
    uptime: `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 24)}h`,
    role: roles[i % roles.length],
  }));
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [servers, setServers] = useState<Server[]>(generateInitialServers());
  const [trafficData, setTrafficData] = useState<any[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(s => ({
        ...s,
        cpuUsage: Math.min(100, Math.max(0, s.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(0, s.memoryUsage + (Math.random() * 5 - 2.5))),
      })));

      const now = new Date();
      setTrafficData(prev => {
        const newData = [...prev, {
          time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          value: Math.floor(Math.random() * 50) + 20
        }];
        return newData.slice(-20); // Keep last 20 points
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate aggregate stats
  const statusCounts = servers.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<ServerStatus, number>);

  const resourceData = [
    { name: 'Databases', usage: 85 },
    { name: 'Compute', usage: 62 },
    { name: 'Storage', usage: 78 },
    { name: 'Network', usage: 45 },
  ];

  const handleAddServer = (newServer: Server) => {
    setServers(prev => [newServer, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard trafficData={trafficData} resourceData={resourceData} statusCounts={statusCounts} />;
      case 'servers':
        return <ServerList servers={servers} onAddServer={handleAddServer} />;
      case 'logs':
        return <LogAnalyzer />;
      case 'network':
        return <NetworkTopology />;
      case 'storage':
        return <StoragePools />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard trafficData={trafficData} resourceData={resourceData} statusCounts={statusCounts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold capitalize">{activeTab === 'logs' ? 'AI Log Sentinel' : activeTab}</h2>
            {activeTab === 'servers' && <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-700">{servers.length} Nodes</span>}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 py-1 px-2 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                JS
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium">Jane Smith</p>
                <p className="text-xs text-slate-500">Lead DevOps</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ServerStatus } from '../types';
import { Cpu, HardDrive, Activity, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  trafficData: any[];
  resourceData: any[];
  statusCounts: Record<ServerStatus, number>;
}

const MetricCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode; color: string }> = ({ title, value, sub, icon, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-start justify-between hover:border-slate-600 transition-all">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className={`text-xs ${color}`}>{sub}</p>
    </div>
    <div className={`p-3 rounded-lg bg-slate-700/50 text-slate-300`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ trafficData, resourceData, statusCounts }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total CPU Load" 
          value="74.2%" 
          sub="+4.5% from last hour" 
          icon={<Cpu className="w-6 h-6" />} 
          color="text-emerald-400"
        />
        <MetricCard 
          title="Network Traffic" 
          value="42.8 GB/s" 
          sub="Peak traffic detected" 
          icon={<Activity className="w-6 h-6" />} 
          color="text-amber-400"
        />
        <MetricCard 
          title="Storage Available" 
          value="1.2 PB" 
          sub="82% Capacity Used" 
          icon={<HardDrive className="w-6 h-6" />} 
          color="text-cyan-400"
        />
        <MetricCard 
          title="Active Alerts" 
          value={String(statusCounts[ServerStatus.CRITICAL] + statusCounts[ServerStatus.WARNING])}
          sub="Requires immediate attention" 
          icon={<AlertTriangle className="w-6 h-6 text-rose-500" />} 
          color="text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Global Network Traffic</h3>
            <select className="bg-slate-700 text-slate-300 text-sm border-none rounded px-3 py-1 focus:ring-0">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}GB`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Resource Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="usage" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 capitalize">{status.toLowerCase()}</span>
                <span className={`font-mono font-bold ${
                  status === 'ONLINE' ? 'text-emerald-400' :
                  status === 'CRITICAL' ? 'text-rose-400' :
                  status === 'WARNING' ? 'text-amber-400' : 'text-slate-500'
                }`}>{count} Servers</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
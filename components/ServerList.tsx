import React, { useState } from 'react';
import { Server, ServerStatus } from '../types';
import { Search, Filter, MoreHorizontal, Terminal, Power, AlertCircle } from 'lucide-react';

interface ServerListProps {
  servers: Server[];
}

const ServerList: React.FC<ServerListProps> = ({ servers }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredServers = servers.filter(s => {
    const matchesFilter = filter === 'ALL' || s.status === filter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.ip.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: ServerStatus) => {
    switch (status) {
      case ServerStatus.ONLINE: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ServerStatus.WARNING: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case ServerStatus.CRITICAL: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case ServerStatus.OFFLINE: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case ServerStatus.MAINTENANCE: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search servers by name or IP..." 
            className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ONLINE', 'WARNING', 'CRITICAL'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-slate-700 text-white border border-slate-600' 
                  : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
              }`}
            >
              {status === 'ALL' ? 'All Systems' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Server Name</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">CPU</th>
                <th className="px-6 py-4 font-medium">Memory</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredServers.map((server) => (
                <tr key={server.id} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-700 text-slate-300">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{server.name}</div>
                        <div className="text-xs text-slate-500">{server.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-300">{server.ip}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{server.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${server.cpuUsage > 80 ? 'bg-rose-500' : server.cpuUsage > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${server.cpuUsage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{server.cpuUsage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${server.memoryUsage > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`} 
                          style={{ width: `${server.memoryUsage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{server.memoryUsage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white" title="Restart">
                        <Power className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white" title="Logs">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white" title="More">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServers.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p>No servers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerList;
import React from 'react';
import { StoragePool } from '../types';
import { Database, HardDrive, AlertCircle, RefreshCw, PieChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

const StoragePools: React.FC = () => {
  const pools: StoragePool[] = [
    { id: 'sp-1', name: 'Primary-Block-NVMe', type: 'NVMe', capacity: 500, used: 342, iops: 125000, status: 'HEALTHY', raidLevel: 'RAID 10' },
    { id: 'sp-2', name: 'Archive-HDD-Array', type: 'HDD', capacity: 2500, used: 1890, iops: 4500, status: 'HEALTHY', raidLevel: 'RAID 5' },
    { id: 'sp-3', name: 'Object-Store-SSD', type: 'SSD', capacity: 1000, used: 850, iops: 45000, status: 'DEGRADED', raidLevel: 'RAID 5' },
  ];

  const COLORS = ['#0ea5e9', '#334155'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            Storage Pools
            </h2>
            <p className="text-slate-400 text-sm mt-1">Manage block storage, object stores, and backup arrays.</p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
            <div key={pool.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-white text-lg">{pool.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <span className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600">{pool.type}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600">{pool.raidLevel}</span>
                        </div>
                    </div>
                    {pool.status === 'HEALTHY' ? (
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <HardDrive className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg animate-pulse">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={[
                                        { name: 'Used', value: pool.used },
                                        { name: 'Free', value: pool.capacity - pool.used }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={45}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <Cell fill={pool.used / pool.capacity > 0.9 ? '#ef4444' : '#06b6d4'} stroke="none" />
                                    <Cell fill="#1e293b" stroke="none" />
                                </Pie>
                            </RechartsPieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xs font-bold text-slate-300">{Math.round((pool.used / pool.capacity) * 100)}%</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div>
                            <p className="text-xs text-slate-500">Capacity</p>
                            <p className="text-sm font-mono text-slate-200">{pool.used} TB / {pool.capacity} TB</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">IOPS</p>
                            <p className="text-sm font-mono text-slate-200">{pool.iops.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-medium uppercase">Drive Health</p>
                    <div className="grid grid-cols-8 gap-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-2 rounded-sm ${
                                    pool.status === 'DEGRADED' && i > 13 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500/50'
                                }`} 
                                title={`Disk ${i+1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default StoragePools;
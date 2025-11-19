export enum ServerStatus {
  ONLINE = 'ONLINE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Server {
  id: string;
  name: string;
  ip: string;
  region: string;
  status: ServerStatus;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
  role: 'Database' | 'App Server' | 'Load Balancer' | 'Storage' | 'AI Compute';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  source: string;
  message: string;
}

export interface MetricData {
  time: string;
  value: number;
  category: string;
}

export interface AIAnalysisResult {
  summary: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
  rootCause: string;
}

export interface StoragePool {
  id: string;
  name: string;
  type: 'NVMe' | 'SSD' | 'HDD';
  capacity: number; // in TB
  used: number; // in TB
  iops: number;
  status: 'HEALTHY' | 'DEGRADED' | 'REBUILDING';
  raidLevel: 'RAID 0' | 'RAID 5' | 'RAID 10';
}

export interface NetworkNode {
  id: string;
  type: 'LB' | 'APP' | 'DB' | 'INTERNET';
  label: string;
  status: 'active' | 'inactive' | 'error';
  x: number;
  y: number;
}
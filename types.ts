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

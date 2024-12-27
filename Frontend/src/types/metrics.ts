export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  temperature: number;
}

export interface MetricHistory {
  timestamp: string;
  value: number;
}
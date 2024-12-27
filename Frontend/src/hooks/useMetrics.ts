import { useState, useEffect } from 'react';

const HISTORY_LENGTH = 20;
const METRICS_URL = 'http://18.194.179.32:5000/metrics'; // Adjust to the actual URL for fetching metrics
const POLLING_INTERVAL = 2000; // Polling every 2 seconds

interface Metrics {
  cpu_usage: number;
  disk_usage: number;
  free_disk_space: number;
  total_disk_space: number;
  used_disk_space: number;
  free_memory: number;
  memory_usage: number;
  total_memory: number;
  used_memory: number;
  total_bytes_received: number;
  total_bytes_sent: number;
}

interface History {
  cpu: { timestamp: string; value: number }[];
  memory: { timestamp: string; value: number }[];
  disk: { timestamp: string; value: number }[];
  network_in: { timestamp: string; value: number }[];
  network_out: { timestamp: string; value: number }[];
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    cpu_usage: 0,
    disk_usage: 0,
    free_disk_space: 0,
    total_disk_space: 0,
    used_disk_space: 0,
    free_memory: 0,
    memory_usage: 0,
    total_memory: 0,
    used_memory: 0,
    total_bytes_received: 0,
    total_bytes_sent: 0,
  });
  
  const [history, setHistory] = useState<History>({
    cpu: [],
    memory: [],
    disk: [],
    network_in: [],
    network_out: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(METRICS_URL)
        .then(response => response.json())  // Parsing response as JSON
        .then((data) => {
          const parsedMetrics = parseMetrics(data);
          updateMetrics(parsedMetrics);
        })
        .catch(error => {
          console.error('Error fetching metrics:', error);
        });
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const parseMetrics = (data: any) => {
    return {
      cpu_usage: data['CPU Usage (%)'] || 0,
      disk_usage: data['Disk']['Disk Usage (%)'] || 0,
      free_disk_space: data['Disk']['Free Disk Space (GB)'] || 0,
      total_disk_space: data['Disk']['Total Disk Space (GB)'] || 0,
      used_disk_space: data['Disk']['Used Disk Space (GB)'] || 0,
      free_memory: data['Memory']['Free Memory (GB)'] || 0,
      memory_usage: data['Memory']['Memory Usage (%)'] || 0,
      total_memory: data['Memory']['Total Memory (GB)'] || 0,
      used_memory: data['Memory']['Used Memory (GB)'] || 0,
      total_bytes_received: data['Network']['Total Bytes Received (MB)'] || 0, // Nested under 'Network'
      total_bytes_sent: data['Network']['Total Bytes Sent (MB)'] || 0, // Nested under 'Network'
    };
  };
  

  const updateMetrics = (newMetrics: Metrics) => {
    const timestamp = new Date().toISOString();

    // Calculate the difference for network usage (in MB)
    const networkInUsage = newMetrics.total_bytes_received - metrics.total_bytes_received;
    const networkOutUsage = newMetrics.total_bytes_sent - metrics.total_bytes_sent;

    // Update metrics state
    setMetrics(newMetrics);

    // Update history state by adding the new metrics and ensuring history length
    setHistory(prev => ({
      cpu: addToHistory(prev.cpu, newMetrics.cpu_usage, timestamp),
      memory: addToHistory(prev.memory, newMetrics.memory_usage, timestamp),
      disk: addToHistory(prev.disk, newMetrics.disk_usage, timestamp),
      network_in: addToHistory(prev.network_in, networkInUsage, timestamp),
      network_out: addToHistory(prev.network_out, networkOutUsage, timestamp),
    }));
  };

  // Helper function to add new data to the history array and maintain the maximum length
  const addToHistory = (history: any[], value: number, timestamp: string) => {
    const newHistory = [...history, { timestamp, value }];
    return newHistory.length > HISTORY_LENGTH ? newHistory.slice(-HISTORY_LENGTH) : newHistory;
  };

  return { metrics, history };
};

import { Activity, Server, HardDrive, Network } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { GaugeChart } from './components/GaugeChart';
import { LineChart } from './components/LineChart';
import { useMetrics } from './hooks/useMetrics';

function App() {
  const { metrics, history } = useMetrics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Server className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold dark:text-white">Linux Server Metrics Dashboard</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold dark:text-white">System Status</h2>
            </div>
            <GaugeChart
              value={Math.round(metrics.cpu_usage)}
              max={100}
              title="CPU Usage"
              unit="%"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold dark:text-white">Storage</h2>
            </div>
            <GaugeChart
              value={Math.round(metrics.disk_usage)}
              max={100}
              title="Disk Usage"
              unit="%"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold dark:text-white">Network</h2>
            </div>
            <GaugeChart
              value={Math.ceil(metrics.total_bytes_sent)}
              max={5}
              title="Network In"
              unit="MB"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart
            data={history.cpu}
            title="CPU Usage Over Time"
            color="#3b82f6"
          />
          <LineChart
            data={history.memory}
            title="Memory Usage Over Time"
            color="#22c55e"
          />
          <LineChart
            data={history.network_in}
            title="Network Traffic In"
            color="#8b5cf6"
          />
          <LineChart
            data={history.network_out}
            title="Network Traffic Out"
            color="#ef4444"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

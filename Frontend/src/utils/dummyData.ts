export const generateDummyMetric = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateMetrics = () => ({
  cpu_usage: generateDummyMetric(20, 90),
  memory_usage: generateDummyMetric(30, 80),
  disk_usage: generateDummyMetric(40, 70),
  network_in: generateDummyMetric(100, 800),
  network_out: generateDummyMetric(50, 500),
  temperature: generateDummyMetric(40, 85)
});
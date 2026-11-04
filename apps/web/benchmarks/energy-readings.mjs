// Benchmark sintético isolado: não mede API, SQLite, navegador nem worker_threads.
import { performance } from 'node:perf_hooks';
const COUNT = 705_319;
const BATCH_SIZE = 10_000;
const base = Date.parse('2026-10-12T00:00:00.000Z');
const mib = n => Number((n / 1024 / 1024).toFixed(1));
const before = process.memoryUsage();
let peak = before.heapUsed;
const begin = performance.now();
let energy = 0;
let batches = 0;
for (let start = 0; start < COUNT; start += BATCH_SIZE) {
  const end = Math.min(COUNT, start + BATCH_SIZE);
  const batch = [];
  for (let index = start; index < end; index++) {
    const device = index % 4;
    const hour = Math.floor(index / 4);
    batch.push({
      id: `sim-device-${device}-${base + hour * 3600000}`,
      deviceId: `device-${device}`,
      intervalStart: new Date(base + hour * 3600000).toISOString(),
      energyKWh: (100 + (index * 17) % 1400) / 1000,
      source: 'simulated',
    });
  }
  for (const reading of batch) energy += reading.energyKWh;
  peak = Math.max(peak, process.memoryUsage().heapUsed);
  batches++;
}
const duration = performance.now() - begin;
console.log(JSON.stringify({
  type: 'isolated-synthetic-benchmark', records: COUNT, batchSize: BATCH_SIZE, batches,
  durationMs: Number(duration.toFixed(1)), energyKWh: Number(energy.toFixed(3)),
  heapBeforeMiB: mib(before.heapUsed), heapAfterMiB: mib(process.memoryUsage().heapUsed),
  observedPeakHeapMiB: mib(peak), node: process.version,
  disclaimer: 'Não mede o Eco Grid completo nem comprova desempenho do dashboard/API/SQLite.',
}, null, 2));

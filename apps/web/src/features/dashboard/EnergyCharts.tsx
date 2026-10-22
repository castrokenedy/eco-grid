import type { Device, Reading } from '@ecogrid/contracts';

export type DailyPoint = { label: string; energy: number };
export type DeviceTotal = { id: string; name: string; energy: number; powerW: number; environmentId: string };

export function dailySeries(readings: Reading[]): DailyPoint[] {
  const totals = new Map<string, number>();
  for (const reading of readings) {
    const key = reading.intervalStart.slice(0, 10);
    totals.set(key, (totals.get(key) ?? 0) + reading.energyKWh);
  }
  return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([label, energy]) => ({ label, energy }));
}
export function deviceSeries(readings: Reading[], devices: Device[]): DeviceTotal[] {
  const totals = new Map<string, number>();
  for (const reading of readings) totals.set(reading.deviceId, (totals.get(reading.deviceId) ?? 0) + reading.energyKWh);
  return devices.map(device => ({
    id: device.id, name: device.name, powerW: device.nominalPowerW, environmentId: device.environmentId,
    energy: totals.get(device.id) ?? 0,
  })).sort((a, b) => b.energy - a.energy);
}
export const number = (value: number, digits = 2) => value.toLocaleString('pt-BR', { maximumFractionDigits: digits });
const formatDay = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7);

export function DailyChart({ points }: { points: DailyPoint[] }) {
  if (!points.length) return <p className="py-12 text-center text-sm text-muted">Sem leituras para o gráfico no período selecionado.</p>;
  const max = Math.max(1, ...points.map(item => item.energy));
  const width = 780, height = 280, left = 58, right = 16, top = 24, bottom = 50;
  const innerW = width - left - right, innerH = height - top - bottom;
  const barGap = innerW / points.length, barWidth = Math.max(3, Math.min(48, barGap * 0.65));
  return <div className="overflow-x-auto">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de barras do consumo diário em kWh" className="min-w-[480px] w-full">
      {[0, 0.25, 0.5, 0.75, 1].map(tick => {
        const y = top + innerH * (1 - tick);
        return <g key={tick}><line x1={left} x2={width - right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 5"/><text x={left - 9} y={y + 4} textAnchor="end" fontSize="12" fill="#64748b">{number(max * tick, 1)}</text></g>;
      })}
      {points.map((point, index) => {
        const x = left + index * barGap + (barGap - barWidth) / 2;
        const barH = innerH * point.energy / max;
        return <g key={point.label}><rect x={x} y={top + innerH - barH} width={barWidth} height={Math.max(0, barH)} rx="5" fill="#16a34a"><title>{formatDay(point.label)}: {number(point.energy, 3)} kWh</title></rect><text x={x + barWidth / 2} y={height - 20} textAnchor="middle" fontSize="12" fill="#64748b">{formatDay(point.label)}</text></g>;
      })}
      <text x={left} y="13" fontSize="12" fill="#64748b">kWh/dia · UTC</text>
    </svg>
    <p className="sr-only">{points.map(point => formatDay(point.label) + ': ' + number(point.energy, 3) + ' kWh').join('; ')}</p>
  </div>;
}

export function DeviceChart({ items }: { items: DeviceTotal[] }) {
  const max = Math.max(1, ...items.map(item => item.energy));
  if (!items.length) return <p className="py-8 text-sm text-muted">Nenhum equipamento cadastrado.</p>;
  return <div className="space-y-4" role="list" aria-label="Consumo por equipamento">
    {items.map(item => <div key={item.id} role="listitem">
      <div className="mb-2 flex justify-between gap-3 text-sm"><span className="font-medium">{item.name}</span><span className="shrink-0 font-semibold">{number(item.energy, 3)} kWh</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: (item.energy / max * 100) + '%' }}/></div>
    </div>)}
  </div>;
}

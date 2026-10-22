import { describe, expect, it } from 'vitest';
import type { Device, Reading } from '@ecogrid/contracts';
import { dailySeries, deviceSeries } from './EnergyCharts';

const devices: Device[] = [
  { id: 'a', environmentId: 'lab', name: 'Luzes', nominalPowerW: 100 },
  { id: 'b', environmentId: 'lab', name: 'Computadores', nominalPowerW: 500 },
];
const readings: Reading[] = [
  { id: '1', deviceId: 'a', intervalStart: '2026-10-12T00:00:00.000Z', intervalEnd: '2026-10-12T01:00:00.000Z', energyKWh: 0.1, source: 'simulated' },
  { id: '2', deviceId: 'b', intervalStart: '2026-10-12T00:00:00.000Z', intervalEnd: '2026-10-12T01:00:00.000Z', energyKWh: 0.5, source: 'simulated' },
  { id: '3', deviceId: 'a', intervalStart: '2026-10-13T00:00:00.000Z', intervalEnd: '2026-10-13T01:00:00.000Z', energyKWh: 0.2, source: 'simulated' },
];
describe('agregações do dashboard', () => {
  it('agrupa leituras por data UTC e ordena os dias', () => {
    const result = dailySeries([...readings].reverse());
    expect(result.map(point => point.label)).toEqual(['2026-10-12', '2026-10-13']);
    expect(result[0].energy).toBeCloseTo(0.6);
    expect(result[1].energy).toBeCloseTo(0.2);
  });
  it('agrega consumo por equipamento sem confundir com potência nominal', () => {
    const result = deviceSeries(readings, devices);
    expect(result[0].id).toBe('b');
    expect(result[0].energy).toBeCloseTo(0.5);
    expect(result[0].powerW).toBe(500);
    expect(result[1].energy).toBeCloseTo(0.3);
  });
  it('mantém equipamentos com consumo zero em períodos vazios', () => {
    expect(deviceSeries([], devices).map(item => item.energy)).toEqual([0, 0]);
    expect(dailySeries([])).toEqual([]);
  });
});

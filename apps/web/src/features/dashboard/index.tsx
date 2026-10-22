import { useEffect, useMemo, useState } from 'react';
import { DEMO_PERIOD, type Device, type Environment, type Reading, type Summary } from '@ecogrid/contracts';
import { api } from '../../lib/api';
import { DailyChart, DeviceChart, dailySeries, deviceSeries, number } from './EnergyCharts';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const field = 'mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-ink';
const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6';
type Tab = 'overview' | 'devices' | 'history';
type Filters = { environmentId: string; from: string; to: string; tariff: string };
const initial: Filters = { environmentId: '', from: DEMO_PERIOD.from.slice(0, 10), to: DEMO_PERIOD.to.slice(0, 10), tariff: '0.80' };
function validate(filters: Filters): string {
  const from = Date.parse(filters.from + 'T00:00:00Z');
  const to = Date.parse(filters.to + 'T00:00:00Z');
  if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) return 'A data final deve ser posterior à inicial.';
  if (to - from > 31 * 86400000) return 'O período máximo permitido é de 31 dias.';
  if (filters.tariff.trim() === '' || !Number.isFinite(Number(filters.tariff)) || Number(filters.tariff) < 0 || Number(filters.tariff) > 100) return 'A tarifa deve estar entre R$ 0 e R$ 100 por kWh.';
  return '';
}
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className={panel}><h3 className="text-xs font-bold uppercase tracking-widest text-muted">{label}</h3><p className="mt-4 break-words text-3xl font-bold tracking-tight">{value}</p><p className="mt-2 text-xs leading-5 text-muted">{detail}</p></article>;
}
export function Dashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [draft, setDraft] = useState<Filters>(initial);
  const [filters, setFilters] = useState<Filters>(initial);
  const [revision, setRevision] = useState(0);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setSummary(null); setReadings([]);
    const period = new URLSearchParams({ from: filters.from + 'T00:00:00.000Z', to: filters.to + 'T00:00:00.000Z' });
    const summaryQuery = new URLSearchParams(period);
    summaryQuery.set('tariffBrlPerKWh', filters.tariff);
    if (filters.environmentId) { period.set('environmentId', filters.environmentId); summaryQuery.set('environmentId', filters.environmentId); }
    Promise.all([
      api.environments(controller.signal), api.devices(filters.environmentId, controller.signal),
      api.readings(period, controller.signal), api.summary(summaryQuery, controller.signal),
    ]).then(([envs, items, history, result]) => {
      if (controller.signal.aborted) return;
      setEnvironments(envs); setDevices(items); setReadings(history); setSummary(result);
    }).catch((failure: Error) => { if (!controller.signal.aborted) setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters, revision]);

  const daily = useMemo(() => dailySeries(readings), [readings]);
  const perDevice = useMemo(() => deviceSeries(readings, devices), [readings, devices]);
  const installedW = useMemo(() => devices.reduce((sum, device) => sum + device.nominalPowerW, 0), [devices]);
  const periodDays = (Date.parse(filters.to + 'T00:00:00Z') - Date.parse(filters.from + 'T00:00:00Z')) / 86400000;
  const average = summary?.energyKWh == null ? null : summary.energyKWh / periodDays;
  const missing = summary ? Math.max(0, summary.expectedReadingCount - summary.readingCount) : 0;
  const selectedEnvironment = environments.find(item => item.id === filters.environmentId);
  const empty = !!summary && summary.energyKWh === null;

  return <section aria-labelledby="dashboard-heading" className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Painel de gestão energética</p><h2 id="dashboard-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Monitoramento de energia</h2><p className="mt-2 text-sm text-muted">Consumo, histórico e inventário em uma única visão.</p></div>
      <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">● Dados 100% simulados</span>
    </div>

    <form className={panel} onSubmit={event => { event.preventDefault(); const issue = validate(draft); setValidationError(issue); if (!issue) setFilters({ ...draft }); }}>
      <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">Filtros de consulta</h3><span className="text-xs text-muted">UTC · fim exclusivo</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-semibold">Ambiente<select className={field} value={draft.environmentId} onChange={event => setDraft(value => ({ ...value, environmentId: event.target.value }))}><option value="">Todos os ambientes</option>{environments.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-sm font-semibold">Data inicial<input className={field} type="date" required value={draft.from} onChange={event => setDraft(value => ({ ...value, from: event.target.value }))}/></label>
        <label className="text-sm font-semibold">Data final<input className={field} type="date" required value={draft.to} onChange={event => setDraft(value => ({ ...value, to: event.target.value }))}/></label>
        <label className="text-sm font-semibold">Tarifa estimada (R$/kWh)<input className={field} type="number" min="0" max="100" step="0.01" required value={draft.tariff} onChange={event => setDraft(value => ({ ...value, tariff: event.target.value }))}/></label>
      </div>
      {validationError && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{validationError}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted">Base de exemplo: 12 a 19/10/2026. Até 31 dias por consulta.</p><button type="submit" disabled={loading} className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50">Aplicar filtros</button></div>
    </form>

    <nav aria-label="Seções do dashboard" className="flex flex-wrap gap-2">
      {([['overview', 'Visão geral'], ['devices', 'Equipamentos'], ['history', 'Histórico']] as const).map(([id, label]) =>
        <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={'rounded-xl px-5 py-3 text-sm font-bold transition ' + (tab === id ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-muted hover:border-primary')}>{label}</button>)}
    </nav>
    {loading && <div role="status" className={panel}>Consultando API local e preparando os indicadores…</div>}
    {error && <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-6"><h3 className="font-bold">Não foi possível carregar o painel</h3><p className="mt-2 text-sm">{error}</p><button type="button" className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => setRevision(value => value + 1)}>Tentar novamente</button></div>}
    {!loading && !error && summary && <div aria-live="polite" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Energia registrada" value={empty ? 'Sem dados' : number(summary.energyKWh ?? 0, 3) + ' kWh'} detail="Soma das leituras recebidas"/>
        <Stat label="Custo estimado" value={empty ? 'Sem dados' : money(summary.estimatedCostBrl ?? 0)} detail="Estimativa simples, não é uma fatura"/>
        <Stat label="Cobertura das leituras" value={number(summary.coveragePercent, 1) + '%'} detail={summary.readingCount + ' de ' + summary.expectedReadingCount + ' leituras esperadas'}/>
        <Stat label="Equipamentos" value={String(devices.length)} detail={selectedEnvironment?.name ?? 'Todos os ambientes'}/>
      </div>
      {summary.coveragePercent < 100 && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Cobertura incompleta: faltam {missing} leituras. O custo reflete somente os dados disponíveis.</div>}
      {tab === 'overview' && <>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <article className={panel}><div className="mb-4"><h3 className="text-lg font-bold">Consumo diário</h3><p className="text-sm text-muted">Energia registrada por dia (UTC), em kWh.</p></div><DailyChart points={daily}/></article>
          <article className={panel}><h3 className="text-lg font-bold">Consumo por equipamento</h3><p className="mb-6 text-sm text-muted">Participação absoluta no período.</p><DeviceChart items={perDevice}/></article>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Média por dia" value={average === null ? 'Sem dados' : number(average, 3) + ' kWh'} detail="Energia observada ÷ dias do intervalo"/>
          <Stat label="Potência nominal" value={number(installedW / 1000) + ' kW'} detail="Soma do cadastro; não é demanda medida"/>
          <Stat label="Leituras ausentes" value={String(missing)} detail="Diferença entre leituras esperadas e recebidas"/>
        </div>
      </>}
      {tab === 'devices' && <article className={panel}><h3 className="text-xl font-bold">Inventário de equipamentos</h3><p className="mt-1 text-sm text-muted">Cadastro demonstrativo consultado na API. Sem comandos de acionamento ou estado online.</p>
        <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[660px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-widest text-muted"><th scope="col" className="pb-3">Equipamento</th><th scope="col" className="pb-3">Ambiente</th><th scope="col" className="pb-3">Potência nominal</th><th scope="col" className="pb-3">Energia no período</th><th scope="col" className="pb-3">Fonte</th></tr></thead><tbody>{perDevice.map(item => <tr key={item.id} className="border-b border-slate-100"><th scope="row" className="py-4 font-semibold">{item.name}</th><td>{environments.find(env => env.id === item.environmentId)?.name ?? item.environmentId}</td><td>{number(item.powerW, 0)} W</td><td>{number(item.energy, 3)} kWh</td><td><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">Simulado</span></td></tr>)}</tbody></table>{!perDevice.length && <p className="py-6 text-muted">Nenhum equipamento encontrado.</p>}</div>
      </article>}
      {tab === 'history' && <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]"><article className={panel}><h3 className="text-xl font-bold">Histórico diário</h3><p className="mt-1 text-sm text-muted">Agregação das leituras horárias por data UTC.</p><DailyChart points={daily}/><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200"><th className="pb-3">Data UTC</th><th className="pb-3 text-right">Energia (kWh)</th></tr></thead><tbody>{daily.map(item => <tr className="border-b border-slate-100" key={item.label}><td className="py-2">{item.label.slice(8, 10) + '/' + item.label.slice(5, 7) + '/' + item.label.slice(0, 4)}</td><td className="text-right">{number(item.energy, 3)}</td></tr>)}</tbody></table></div></article>
        <article className={panel}><h3 className="text-lg font-bold">Qualidade da coleta</h3><p className="mt-2 text-sm text-muted">Leituras recebidas / leituras esperadas.</p><p className="mt-8 text-4xl font-bold">{number(summary.coveragePercent, 1)}%</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Cobertura das leituras" aria-valuenow={Math.max(0, Math.min(100, summary.coveragePercent))} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-primary" style={{ width: Math.max(0, Math.min(100, summary.coveragePercent)) + '%' }}/></div><p className="mt-5 text-sm text-muted">{summary.readingCount} leituras disponíveis de {summary.expectedReadingCount} previstas.</p></article></div>}
    </div>}
    <p className="text-xs leading-6 text-muted">Projeto acadêmico Eco Grid. Todos os dados são simulados. Nenhuma economia financeira real foi aferida. Automação, alertas operacionais e relatórios exportáveis pertencem a etapas e módulos distintos.</p>
  </section>;
}

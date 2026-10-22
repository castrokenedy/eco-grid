import { useState } from 'react';
import { Dashboard } from './features/dashboard';
import { Analytics } from './features/analytics';

type View = 'dashboard' | 'analytics';
export function App() {
  const [view, setView] = useState<View>('dashboard');
  return <div className="min-h-screen bg-surface text-ink">
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
      <aside className="border-b border-emerald-900 bg-[#102b23] px-5 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:px-6 lg:py-9">
        <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-white" aria-hidden="true">ϟ</div><div><h1 className="text-2xl font-bold tracking-tight">Eco Grid</h1><p className="text-xs text-emerald-200">Gestão inteligente de energia</p></div></div>
        <p className="mt-8 hidden text-[11px] font-bold uppercase tracking-[.2em] text-emerald-300 lg:block">Navegação</p>
        <nav aria-label="Módulos do sistema" className="mt-5 flex gap-2 lg:flex-col">
          {([['dashboard', '▦', 'Dashboard'], ['analytics', '◫', 'Análises e relatórios']] as const).map(([key, icon, label]) =>
            <button key={key} type="button" aria-current={view === key ? 'page' : undefined} onClick={() => setView(key)}
              className={'flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ' + (view === key ? 'bg-emerald-500 text-white' : 'text-emerald-100 hover:bg-white/10')}><span aria-hidden="true">{icon}</span>{label}</button>)}
        </nav>
        <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block"><p className="text-xs font-bold text-emerald-200">Projeto Integrador de Extensão</p><p className="mt-2 text-sm">ADS · 4º período</p><p className="mt-2 text-xs leading-5 text-emerald-100/80">Protótipo acadêmico. Dados fictícios, sem sensores conectados.</p></div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
          <div><p className="text-xs font-bold uppercase tracking-widest text-muted">Eco Grid / Plataforma acadêmica</p><p className="mt-1 text-sm font-semibold">{view === 'dashboard' ? 'Dashboard de energia' : 'Módulo de análises e relatórios'}</p></div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">● Ambiente de demonstração</span>
        </header>
        <main className="w-full flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{view === 'dashboard' ? <Dashboard/> : <Analytics/>}</main>
        <footer className="border-t border-slate-200 px-5 py-5 text-xs leading-6 text-muted sm:px-8">© Eco Grid · PIE ADS · Demonstração com dados simulados. Sem automação física ou medição real de economia.</footer>
      </div>
    </div>
  </div>;
}

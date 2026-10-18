import { useMemo, useState } from 'react';
import { MODEL_DATA_COVERAGE, type CoverageLevel } from '../data/modelDataCoverage';
import { BookOpen, ExternalLink, Search, ShieldAlert, CheckCircle2, CircleDashed } from 'lucide-react';

const statusLabels: Record<CoverageLevel, string> = {
  'source-backed-sample': 'Есть источник-ориентированный пример',
  'partial-existing-data': 'Частичные данные; нужна проверка',
  'not-yet-source-verified': 'Источники ещё не проверены'
};

const statusStyles: Record<CoverageLevel, string> = {
  'source-backed-sample': 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200',
  'partial-existing-data': 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200',
  'not-yet-source-verified': 'bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200'
};

export default function ModelDataCoveragePanel() {
  const [selectedId, setSelectedId] = useState(MODEL_DATA_COVERAGE[0]?.modelId ?? '');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => MODEL_DATA_COVERAGE.filter(item =>
    [item.make, item.model, item.modelId].some(value => value.toLowerCase().includes(search.toLowerCase().trim()))
  ), [search]);
  const selected = MODEL_DATA_COVERAGE.find(item => item.modelId === selectedId) ?? filtered[0] ?? MODEL_DATA_COVERAGE[0];
  const sourceBacked = MODEL_DATA_COVERAGE.filter(item => item.coverage === 'source-backed-sample').length;
  const partial = MODEL_DATA_COVERAGE.filter(item => item.coverage === 'partial-existing-data').length;

  return <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4">
    <div className="flex items-start gap-3">
      <div className="rounded-xl p-2.5 bg-slate-100 dark:bg-slate-800"><BookOpen className="w-5 h-5" /></div>
      <div className="flex-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Полнота базы по всем моделям</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Матрица источников и недостающих данных для каждой модели справочника. Ссылка на портал производителя — это точка поиска, а не автоматическое подтверждение применимости конкретной детали.</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><div className="text-xs text-slate-500">Моделей</div><div className="text-xl font-black">{MODEL_DATA_COVERAGE.length}</div></div>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><div className="text-xs text-slate-500">С примерами</div><div className="text-xl font-black">{sourceBacked}</div></div>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"><div className="text-xs text-slate-500">Частично</div><div className="text-xl font-black">{partial}</div></div>
    </div>
    <label className="relative block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Найти модель или марку..." className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
    <div className="flex flex-wrap gap-2">
      {filtered.map(item => <button key={item.modelId} type="button" onClick={() => setSelectedId(item.modelId)} className={`rounded-lg border px-3 py-2 text-xs font-semibold text-left ${selected?.modelId === item.modelId ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}>
        {item.make} · {item.model}
      </button>)}
      {filtered.length === 0 && <p className="text-sm text-slate-500">Совпадений нет.</p>}
    </div>
    {selected && <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div><h3 className="font-bold text-slate-900 dark:text-white">{selected.make} {selected.model}</h3><p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{selected.verifiedScope}</p></div>
        <span className={`inline-flex self-start rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[selected.coverage]}`}>{statusLabels[selected.coverage]}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Источники для проверки</h4>
        <div className="space-y-2">
          {selected.sources.map(source => <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-400">
            <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{source.label}</span><span className="block text-xs text-slate-500 mt-1">{source.note}</span><span className="block text-xs text-blue-600 dark:text-blue-400 mt-1 break-all">{source.url}</span></span>
          </a>)}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-600" /> Что нужно дополнить</h4>
        <ul className="space-y-1.5">{selected.remainingWork.map(task => <li key={task} className="flex gap-2 text-xs text-slate-700 dark:text-slate-200"><CircleDashed className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />{task}</li>)}</ul>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Данные считаются подтверждёнными только для совпадающих рынка, даты выпуска, кузова, двигателя, коробки и VIN/номера рамы. Не используйте общую карточку поколения как единственную основу для заказа детали или ремонта.</p>
    </div>}
  </section>;
}

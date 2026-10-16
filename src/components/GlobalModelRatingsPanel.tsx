import { useMemo, useState } from 'react';
import { GLOBAL_MODEL_RATINGS, GLOBAL_RATING_METHODOLOGY } from '../data/globalModelRatings';
import { GENERATION_BODY_CATALOG } from '../data/generationBodyCatalog';
import { BarChart3, Search, ChevronDown, ChevronUp, Info } from 'lucide-react';

const scoreLabel = (value: number | null) => value === null ? 'Нет сопоставимого значения' : `${value}/100`;
export default function GlobalModelRatingsPanel() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const rows = useMemo(() => GLOBAL_MODEL_RATINGS.map(rating => ({
    ...rating,
    vehicle: GENERATION_BODY_CATALOG.find(v => v.id === rating.recordId)!,
  })).filter(row => [row.vehicle.make, row.vehicle.model, row.vehicle.generation, row.vehicle.years, ...row.vehicle.chassisCodes].join(' ').toLowerCase().includes(query.toLowerCase().trim())), [query]);
  return <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><BarChart3 className="w-4 h-4" /> Глобальная популярность и надёжность</div>
        <h2 className="text-xl font-black mt-1">Международный рейтинг моделей</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Продажи — за 2024 год, надёжность — опубликованный брендовый индекс Consumer Reports 2025. Эти показатели имеют разный уровень детализации.</p>
      </div>
      <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-center"><div className="text-2xl font-black">{rows.length}</div><div className="text-xs text-slate-500">записей</div></div>
    </div>
    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-900 dark:text-amber-200 flex gap-2"><Info className="w-4 h-4 shrink-0" /><p>Рейтинг не выдумывает отсутствующие данные: для большинства поколений нет открытого сопоставимого мирового объёма продаж или модельного балла надёжности. Балл марки не является вероятностью безотказной работы конкретного автомобиля.</p></div>
    <label className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2"><Search className="w-4 h-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск марки, модели, поколения или кузова..." className="w-full bg-transparent outline-none text-sm" /></label>
    <div className="space-y-2">
      {rows.map(row => {
        const open = selected === row.recordId;
        return <article key={row.recordId} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button type="button" onClick={() => setSelected(open ? null : row.recordId)} className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
            <div className="min-w-0"><div className="text-xs text-slate-500">{row.vehicle.make} · {row.vehicle.generation} · {row.vehicle.years}</div><div className="font-bold">{row.vehicle.model}</div><div className="text-xs text-slate-500">{row.globalSalesRank2024 ? `Мировое место модели в 2024: #${row.globalSalesRank2024}` : 'Место в мировых продажах: не присвоено'}</div></div>
            <div className="text-right shrink-0"><div className="text-sm font-bold">{scoreLabel(row.combinedScore)}</div><div className="text-xs text-slate-500">сводный балл</div></div>
            {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>
          {open && <div className="p-3 pt-0 space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-500">Мировые продажи, 2024</div><div className="font-bold">{row.globalSalesUnits2024 ? row.globalSalesUnits2024.toLocaleString('ru-RU') + ' автомобилей' : 'Нет подтверждённого значения'}</div><p className="text-xs mt-1">{row.globalSalesNote}</p></div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-500">Надёжность марки</div><div className="font-bold">{scoreLabel(row.reliabilityBrandScore2025)}</div><p className="text-xs mt-1">{row.reliabilityBasis}</p></div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-500">Индекс популярности</div><div className="font-bold">{scoreLabel(row.popularityScore)}</div><p className="text-xs mt-1">Преобразование места продаж в шкалу: топ-10 = 100; топ-25 = 85; топ-50 = 70; топ-100 = 55.</p></div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-xs text-slate-500">Сводный балл</div><div className="font-bold">{scoreLabel(row.combinedScore)}</div><p className="text-xs mt-1">{row.caveat}</p></div>
            </div>
          </div>}
        </article>;
      })}
    </div>
    <div className="border-t border-slate-200 dark:border-slate-800 pt-3 text-xs text-slate-500">
      Методика: {GLOBAL_RATING_METHODOLOGY.formula}. Источники: {GLOBAL_RATING_METHODOLOGY.sources.map(s => s.label).join('; ')}.
    </div>
  </section>;
}

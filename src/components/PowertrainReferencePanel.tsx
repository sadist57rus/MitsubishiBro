import { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Cog, Gauge } from 'lucide-react';
import { POWERTRAIN_RECORDS } from '../data/powertrainReferenceBatch01';

export default function PowertrainReferencePanel() {
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<string | null>('outlander1-cu5w-4g69');
  const records = useMemo(() => POWERTRAIN_RECORDS.filter(r =>
    [r.model, r.generation, r.years, r.chassis, r.engine, r.displacement, ...r.transmissions, r.drive, r.notes]
      .join(' ').toLowerCase().includes(query.trim().toLowerCase())
  ), [query]);
  return <section className="rounded-2xl border border-amber-300/40 dark:border-amber-700/40 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-5 space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-amber-300"><Cog className="w-4 h-4" /> Двигатели и трансмиссии</div>
        <h2 className="text-xl font-black mt-1">Справочник силовых агрегатов</h2>
        <p className="text-sm text-slate-300 mt-1">Первые записи с привязкой к поколению, коду кузова и семейству двигателя. Применяемость зависит от рынка и VIN.</p>
      </div>
      <div className="rounded-xl border border-amber-400/30 bg-black/30 px-3 py-2 text-center"><div className="text-2xl font-black text-amber-300">{POWERTRAIN_RECORDS.length}</div><div className="text-xs text-slate-400">записей</div></div>
    </div>
    <label className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 bg-black/20"><Search className="w-4 h-4 text-amber-300" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Модель, двигатель, кузов, КПП..." className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500" /></label>
    <div className="space-y-2">
      {records.map(r => {
        const isOpen = opened === r.id;
        return <article key={r.id} className="rounded-xl border border-slate-700 overflow-hidden">
          <button type="button" onClick={() => setOpened(isOpen ? null : r.id)} className="w-full flex items-center justify-between gap-3 text-left p-3 hover:bg-white/5">
            <div><div className="text-xs text-amber-300">{r.generation} поколение · {r.years}</div><div className="font-bold">{r.model} · {r.engine}</div><div className="text-xs text-slate-400">{r.chassis} · {r.displacement}</div></div>
            {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>
          {isOpen && <div className="border-t border-slate-700 p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/5 p-3"><div className="text-xs text-slate-400">Конструкция</div><div className="text-sm font-semibold mt-1">{r.layout}</div></div>
              <div className="rounded-lg bg-white/5 p-3"><div className="text-xs text-slate-400">Привод ГРМ</div><div className="text-sm font-semibold mt-1">{r.timingDrive === 'belt' ? 'Ремень' : r.timingDrive === 'chain' ? 'Цепь' : 'Требуется проверка по коду'}</div></div>
              <div className="rounded-lg bg-white/5 p-3 sm:col-span-2"><div className="text-xs text-slate-400 flex items-center gap-1"><Gauge className="w-3 h-3" /> Коробки передач</div><ul className="list-disc pl-5 mt-1 text-sm">{r.transmissions.map(t => <li key={t}>{t}</li>)}</ul></div>
              <div className="rounded-lg bg-white/5 p-3 sm:col-span-2"><div className="text-xs text-slate-400">Ведущие колёса</div><div className="text-sm mt-1">{r.drive}</div></div>
            </div>
            <p className="text-sm text-slate-200">{r.notes}</p>
            <div className="text-xs text-slate-400"><span className="font-bold text-amber-300">Основание:</span> {r.evidence}</div>
            <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="inline-block text-xs underline underline-offset-2 text-amber-300">Открыть технический источник</a>
          </div>}
        </article>;
      })}
      {records.length === 0 && <p className="text-sm text-slate-400 py-5 text-center">Совпадений нет.</p>}
    </div>
    <p className="text-xs text-slate-400">Важно: это стартовая база по Outlander I–III, а не полный глобальный перечень всех комплектаций. Перед ремонтом сверяйте рынок, год выпуска, VIN и код агрегата; неподтверждённые передаточные числа, жидкости и интервалы не подставляются.</p>
  </section>;
}

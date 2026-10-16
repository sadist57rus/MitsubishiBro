import { useMemo, useState } from 'react';
import { TECHNICAL_REFERENCE_MATRIX } from '../data/technicalReferenceMatrix';
import { BookOpen, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function TechnicalReferenceMatrixPanel() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = useMemo(() => TECHNICAL_REFERENCE_MATRIX.filter(item =>
    [item.make, item.model, item.generation, item.years, ...item.chassisCodes, ...item.engines, ...item.transmissions]
      .join(' ').toLowerCase().includes(query.toLowerCase().trim())
  ), [query]);
  return <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><BookOpen className="w-4 h-4" /> Техническая база</div>
        <h2 className="text-xl font-black mt-1">Справочник технических систем</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Для каждого разделённого поколения собраны известные семейства агрегатов и список технических параметров, которые нужно подтвердить. Непроверенные числовые значения не подставляются автоматически.</p>
      </div>
      <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3"><div className="text-2xl font-black">{TECHNICAL_REFERENCE_MATRIX.length}</div><div className="text-xs text-slate-500">поколений / кузовных записей</div></div>
    </div>
    <label className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2"><Search className="w-4 h-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Модель, код кузова, двигатель, КПП..." className="w-full bg-transparent outline-none text-sm" /></label>
    <div className="space-y-2">
      {filtered.map(item => {
        const open = selected === item.recordId;
        return <article key={item.recordId} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button type="button" onClick={() => setSelected(open ? null : item.recordId)} className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
            <div><div className="text-xs text-slate-500">{item.make} · {item.generation} · {item.years}</div><div className="font-bold">{item.model}</div><div className="text-xs text-slate-500">Кузова: {item.chassisCodes.join(', ')}</div></div>
            {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>
          {open && <div className="p-3 pt-0 space-y-3">
            {item.sections.map(section => <div key={section.area} className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">
              <h3 className="font-bold text-sm">{section.title}</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">{section.known.map((x,i) => <li key={i}>{x}</li>)}</ul>
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-2">Нужно подтвердить</div>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">{section.verificationRequired.map(x => <li key={x}>{x}</li>)}</ul>
            </div>)}
            <p className="text-xs text-amber-800 dark:text-amber-300">{item.fitmentWarning}</p>
          </div>}
        </article>;
      })}
      {filtered.length === 0 && <p className="text-center text-sm text-slate-500 py-8">Ничего не найдено.</p>}
    </div>
  </section>;
}

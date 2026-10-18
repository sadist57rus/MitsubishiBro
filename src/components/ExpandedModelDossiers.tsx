import { useMemo, useState } from 'react';
import { EXPANDED_MODEL_DOSSIERS } from '../data/expandedModelDossiers';
import { BookOpen, Wrench, Gauge, AlertTriangle, Package, ClipboardList, ExternalLink } from 'lucide-react';

const brands = ['Все марки', 'Toyota', 'Subaru', 'Nissan', 'Suzuki', 'Honda', 'Mazda'];

export default function ExpandedModelDossiers() {
  const [brand, setBrand] = useState('Все марки');
  const [modelId, setModelId] = useState(EXPANDED_MODEL_DOSSIERS[0]?.modelId ?? '');
  const filtered = useMemo(() => EXPANDED_MODEL_DOSSIERS.filter(d => brand === 'Все марки' || d.make === brand), [brand]);
  const selected = filtered.find(d => d.modelId === modelId) ?? filtered[0];
  const chooseBrand = (value: string) => {
    setBrand(value);
    const next = EXPANDED_MODEL_DOSSIERS.find(d => value === 'Все марки' || d.make === value);
    if (next) setModelId(next.modelId);
  };
  return <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-5">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2.5"><Wrench className="w-5 h-5 text-blue-700 dark:text-blue-300" /></div>
      <div className="flex-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Технические досье: Toyota · Subaru · Nissan · Suzuki · Honda · Mazda</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Структурированные варианты двигателей, трансмиссий, жидкостей, обслуживания, диагностики, изнашиваемых деталей и узлов. Значения, зависящие от рынка/года, помечены и не считаются универсальными.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Марка
        <select value={brand} onChange={e => chooseBrand(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-sm text-slate-900 dark:text-white">
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Модель
        <select value={selected?.modelId ?? ''} onChange={e => setModelId(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-sm text-slate-900 dark:text-white">
          {filtered.map(d => <option key={d.modelId} value={d.modelId}>{d.make} {d.model}</option>)}
        </select>
      </label>
    </div>
    {selected && <>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-1">
        <h3 className="font-black text-slate-900 dark:text-white">{selected.make} {selected.model}</h3>
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{selected.generations}</p>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{selected.overview}</p>
        <p className="text-xs text-amber-800 dark:text-amber-200 flex gap-2 pt-1"><AlertTriangle className="w-4 h-4 shrink-0" />{selected.fitmentRule}</p>
      </div>
      <div className="space-y-3">
        <h4 className="font-bold flex items-center gap-2"><Gauge className="w-4 h-4" /> Двигатели и модификации</h4>
        {selected.engines.map(e => <div key={e.code} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-bold text-sm">{e.code}</span><span className="text-xs text-slate-500">{e.typicalOutput}</span></div>
          <p className="text-xs text-slate-700 dark:text-slate-200">{e.configuration}</p>
          <p className="text-xs text-slate-500">{e.marketNotes}</p>
          <ul className="list-disc pl-4 space-y-1">{e.serviceFocus.map(s => <li key={s} className="text-xs text-slate-600 dark:text-slate-300">{s}</li>)}</ul>
        </div>)}
      </div>
      <div className="space-y-3">
        <h4 className="font-bold flex items-center gap-2"><Wrench className="w-4 h-4" /> Коробки, приводы и агрегаты</h4>
        {selected.drivetrains.map(t => <div key={t.codeOrFamily} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-1">
          <div className="font-bold text-sm">{t.codeOrFamily}</div><div className="text-xs text-slate-600 dark:text-slate-300">{t.application}</div>
          <div className="text-xs"><span className="font-semibold">Жидкость/спецификация: </span>{t.fluidOrSpec}</div>
          <div className="text-xs"><span className="font-semibold">Объём: </span>{t.capacity}</div>
          <div className="text-xs text-amber-800 dark:text-amber-200">{t.caution}</div>
        </div>)}
      </div>
      <div className="space-y-3">
        <h4 className="font-bold flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Жидкости и ёмкости</h4>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-2">Узел</th><th className="p-2">Спецификация</th><th className="p-2">Объём/условия</th></tr></thead>
            <tbody>{selected.fluids.map((f, i) => <tr key={f.item} className={i % 2 ? 'bg-slate-50/60 dark:bg-slate-800/40' : ''}><td className="p-2 align-top font-semibold">{f.item}</td><td className="p-2 align-top">{f.spec}</td><td className="p-2 align-top">{f.capacity}<div className="text-slate-500 mt-1">{f.applicability}</div></td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-bold flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Регламент и проверки</h4>
        {selected.maintenance.map(m => <div key={m.task} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3"><div className="text-xs font-bold text-blue-700 dark:text-blue-300">{m.interval} · {m.applicability}</div><p className="text-xs mt-1">{m.task}</p></div>)}
      </div>
      <div className="space-y-2">
        <h4 className="font-bold flex items-center gap-2"><Gauge className="w-4 h-4" /> Диагностика</h4>
        <ol className="list-decimal pl-5 space-y-1.5">{selected.diagnostics.map(item => <li key={item} className="text-xs text-slate-700 dark:text-slate-300">{item}</li>)}</ol>
      </div>
      <div className="space-y-3">
        <h4 className="font-bold flex items-center gap-2"><Package className="w-4 h-4" /> Расходники и часто заменяемые детали</h4>
        {selected.wearParts.map(group => <div key={group.group} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><div className="font-bold text-sm">{group.group}</div><ul className="list-disc pl-4 mt-2 space-y-1">{group.items.map(item => <li key={item} className="text-xs">{item}</li>)}</ul><p className="text-xs text-amber-800 dark:text-amber-200 mt-2">{group.partNumberPolicy}</p></div>)}
      </div>
      <div className="space-y-2">
        <h4 className="font-bold flex items-center gap-2"><Package className="w-4 h-4" /> Полный перечень групп каталога</h4>
        <div className="flex flex-wrap gap-2">{selected.assemblies.map(a => <span key={a} className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs">{a}</span>)}</div>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold flex items-center gap-2"><BookOpen className="w-4 h-4" /> Оригинальные аксессуары и источники</h4>
        <ul className="list-disc pl-4 space-y-1">{selected.accessories.map(a => <li key={a} className="text-xs text-slate-700 dark:text-slate-300">{a}</li>)}</ul>
        {selected.sources.map(source => <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-400"><ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" /><span><span className="block text-sm font-semibold">{source.label}</span><span className="block text-xs text-slate-500 mt-1">{source.scope}</span><span className="block text-xs text-blue-600 dark:text-blue-400 mt-1 break-all">{source.url}</span></span></a>)}
      </div>
      <p className="text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-3">Статус данных: техническая структура и основные семейства агрегатов внесены. Точные моменты затяжки, номера OEM и универсальные интервалы намеренно не указаны без совпадающего заводского руководства/EPC для конкретной версии.</p>
    </>}
  </section>;
}

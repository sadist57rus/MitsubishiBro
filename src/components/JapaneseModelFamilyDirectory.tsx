import { useMemo, useState } from 'react';
import { JAPANESE_MODEL_FAMILIES } from '../data/japaneseModelFamilies';
import { Search, ListTree, Filter } from 'lucide-react';

export default function JapaneseModelFamilyDirectory() {
  const [query, setQuery] = useState('');
  const [make, setMake] = useState('Все марки');
  const makes = useMemo(() => ['Все марки', ...Array.from(new Set(JAPANESE_MODEL_FAMILIES.map(x => x.make))).sort()], []);
  const filtered = useMemo(() => JAPANESE_MODEL_FAMILIES.filter(x =>
    (make === 'Все марки' || x.make === make) &&
    (x.make + ' ' + x.model).toLowerCase().includes(query.toLowerCase().trim())
  ), [query, make]);
  const grouped = useMemo(() => filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
    (acc[item.make] ??= []).push(item);
    return acc;
  }, {}), [filtered]);
  return <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><ListTree className="w-4 h-4" /> Общий каталог моделей</div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">Японские марки и модельные семейства</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">В каталожный индекс добавлено {JAPANESE_MODEL_FAMILIES.length} названий моделей по {makes.length - 1} маркам. Для каждого семейства следующий шаг — импорт поколений, кодов кузова и модификаций. Это перечень для наполнения, не заявление о завершённой базе характеристик.</p>
      </div>
      <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 min-w-[110px]"><div className="text-2xl font-black">{filtered.length}</div><div className="text-xs text-slate-500">найдено моделей</div></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-2">
      <label className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2"><Search className="w-4 h-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по марке или модели..." className="w-full bg-transparent outline-none text-sm" /></label>
      <label className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2"><Filter className="w-4 h-4 text-slate-400" /><select value={make} onChange={e => setMake(e.target.value)} className="w-full bg-transparent outline-none text-sm">{makes.map(x => <option key={x} value={x}>{x}</option>)}</select></label>
    </div>
    <div className="space-y-4">
      {Object.entries(grouped).map(([brand, models]) => <div key={brand}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1 mb-2"><h3 className="font-bold">{brand}</h3><span className="text-xs text-slate-500">{models.length} моделей</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">{models.map(item => <div key={item.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
          <div className="font-semibold text-sm">{item.model}</div>
          <div className="text-[10px] text-amber-700 dark:text-amber-300 mt-1">Поколения и модификации: в очереди импорта</div>
        </div>)}</div>
      </div>)}
      {filtered.length === 0 && <p className="text-center text-sm text-slate-500 py-8">Модели не найдены.</p>}
    </div>
  </section>;
}

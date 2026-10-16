import { useMemo, useState } from 'react';
import { Search, CarFront } from 'lucide-react';
import { JAPANESE_CHASSIS_INDEX } from '../data/japaneseChassisIndex';

export default function JapaneseChassisIndexPanel() {
 const [query,setQuery] = useState('');
 const [brand,setBrand] = useState('Все марки');
 const brands = useMemo(() => ['Все марки', ...Array.from(new Set(JAPANESE_CHASSIS_INDEX.map(x=>x.make)))],[]);
 const filtered = useMemo(() => JAPANESE_CHASSIS_INDEX.filter(x =>
   (brand === 'Все марки' || x.make === brand) &&
   [x.make,x.model,x.chassis,x.year].join(' ').toLowerCase().includes(query.trim().toLowerCase())
 ),[query,brand]);
 return <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
  <div className="flex items-start justify-between gap-3">
   <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300"><CarFront className="w-4 h-4"/> Японские автомобили · 1966–2026</div><h2 className="text-xl font-black mt-1">Индекс моделей и кодов кузова</h2><p className="text-sm text-slate-500 mt-1">Toyota/Lexus, Nissan/Infiniti, Honda/Acura, Mazda, Subaru, Mitsubishi, Suzuki и Daihatsu.</p></div>
   <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-center"><div className="text-2xl font-black">{JAPANESE_CHASSIS_INDEX.length}</div><div className="text-xs text-slate-500">записей</div></div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
   <label className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2"><Search className="w-4 h-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Марка, модель, кузовной код, год..." className="w-full bg-transparent outline-none text-sm"/></label>
   <select value={brand} onChange={e=>setBrand(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm">{brands.map(b=><option key={b} value={b}>{b}</option>)}</select>
  </div>
  <div className="max-h-[620px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
   <table className="w-full text-sm"><thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-left"><tr><th className="p-3">Марка</th><th className="p-3">Модель</th><th className="p-3">Код кузова</th><th className="p-3">Год</th></tr></thead><tbody>
    {filtered.map((x,i)=><tr key={x.make+x.model+x.chassis} className={i%2===0?'':'bg-slate-50 dark:bg-slate-800/40'}><td className="p-3 whitespace-nowrap">{x.make}</td><td className="p-3">{x.model}</td><td className="p-3 font-mono font-bold whitespace-nowrap">{x.chassis}</td><td className="p-3 whitespace-nowrap">{x.year}</td></tr>)}
   </tbody></table>
   {filtered.length===0&&<p className="p-6 text-center text-sm text-slate-500">Ничего не найдено.</p>}
  </div>
  <p className="text-xs text-slate-500">Это навигационный индекс поколений, не полный каталог комплектаций. Коды и годы могут различаться по рынкам и типам кузова; перед подбором деталей сверяйте FRAME/VIN и код агрегата. Следующий слой данных — отдельные моторы, КПП, приводы, характеристики и регламенты для каждой модификации.</p>
 </section>;
}

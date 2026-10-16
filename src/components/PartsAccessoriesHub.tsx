import { useMemo, useState } from 'react';
import { JAPANESE_BRANDS } from '../data/japaneseBrandsData';
import { Search, Filter, Package, Wrench, ShoppingBag, ShieldCheck, AlertTriangle, BookOpen, CarFront } from 'lucide-react';

type CatalogGroup = 'consumables' | 'full' | 'accessories';
type Verification = 'verified' | 'partial' | 'unverified';
interface CatalogItem {
  id: string;
  title: string;
  group: CatalogGroup;
  category: string;
  fitment: string;
  oemNumber?: string;
  brand?: string;
  kind?: 'official' | 'aftermarket';
  verification: Verification;
  note: string;
  source?: string;
}

/**
 * Starter records intentionally avoid fabricated OEM numbers and universal fitment.
 * Add sourced, exact-variant entries here as OEM catalog coverage is researched.
 */
const STARTER_ITEMS: CatalogItem[] = [
  { id: 'engine-oil', title: 'Моторное масло', group: 'consumables', category: 'Жидкости и фильтры', fitment: 'Все модели — спецификацию подбирать индивидуально', verification: 'partial', note: 'Подбор по коду двигателя, рынку, климату и руководству владельца. Не использовать общую рекомендацию вместо допуска производителя.' },
  { id: 'oil-filter', title: 'Масляный фильтр', group: 'consumables', category: 'Жидкости и фильтры', fitment: 'Только после сверки двигателя и OEM-каталога', verification: 'unverified', note: 'Проверить резьбу, уплотнение, перепускной клапан и оригинальный номер для конкретной модификации.' },
  { id: 'air-filter', title: 'Воздушный фильтр двигателя', group: 'consumables', category: 'Жидкости и фильтры', fitment: 'По кузову, двигателю и году выпуска', verification: 'unverified', note: 'Форма корпуса и размеры могут различаться даже внутри одного поколения.' },
  { id: 'cabin-filter', title: 'Салонный фильтр', group: 'consumables', category: 'Жидкости и фильтры', fitment: 'По модели, рынку и комплектации', verification: 'unverified', note: 'Проверить наличие крышки/корпуса и направление воздушного потока.' },
  { id: 'brake-pads', title: 'Тормозные колодки', group: 'consumables', category: 'Тормозная система', fitment: 'По оси, суппорту и тормозному пакету', verification: 'unverified', note: 'Не заказывать только по названию модели: тормоза могут отличаться по рынку и комплектации.' },
  { id: 'wiper-blades', title: 'Щётки стеклоочистителя', group: 'consumables', category: 'Расходники', fitment: 'По длине, типу крепления и расположению руля', verification: 'unverified', note: 'Проверить длину каждой щётки и переходник крепления.' },
  { id: 'timing-drive', title: 'Комплект привода ГРМ', group: 'consumables', category: 'Двигатель', fitment: 'Только по коду двигателя и ревизии агрегата', verification: 'unverified', note: 'Комплект может включать ремни, ролики, натяжители и водяной насос — состав сверять по сервисной документации.' },
  { id: 'suspension-links', title: 'Стойки и втулки стабилизатора', group: 'consumables', category: 'Подвеска', fitment: 'По оси, подвеске и коду кузова', verification: 'unverified', note: 'Часто меняемые детали подвески; применимость и размеры требуют проверки по OEM-каталогу.' },
  { id: 'wheel-bearings', title: 'Ступичные подшипники / ступицы', group: 'consumables', category: 'Подвеска и ходовая', fitment: 'По оси, ABS, приводу и типу ступицы', verification: 'unverified', note: 'Проверить датчик ABS, количество креплений, шлицы и наличие ступицы в сборе.' },
  { id: 'cooling-hoses', title: 'Патрубки системы охлаждения', group: 'consumables', category: 'Охлаждение', fitment: 'По двигателю и схеме охлаждения', verification: 'unverified', note: 'Сходные на вид патрубки могут иметь разные изгибы и диаметры.' },
  { id: 'engine-mounts', title: 'Опоры двигателя и коробки', group: 'consumables', category: 'Двигатель и трансмиссия', fitment: 'По силовому агрегату и типу трансмиссии', verification: 'unverified', note: 'Количество и расположение опор зависят от привода и коробки.' },
  { id: 'suspension-arms', title: 'Рычаги подвески и сайлентблоки', group: 'full', category: 'Подвеска', fitment: 'По оси, стороне, кузову и комплектации', verification: 'unverified', note: 'Каталог должен различать левую/правую сторону, сборочный узел и отдельные сайлентблоки.' },
  { id: 'steering-rack', title: 'Рулевая рейка и элементы рулевого управления', group: 'full', category: 'Рулевое управление', fitment: 'По VIN, рынку и типу усилителя', verification: 'unverified', note: 'Проверить тип усилителя, разъёмы, передаточное отношение и ревизию узла.' },
  { id: 'transmission-assembly', title: 'Коробка передач и внутренние компоненты', group: 'full', category: 'Трансмиссия', fitment: 'По точному коду агрегата', verification: 'unverified', note: 'Код коробки обязателен; ATF/CVT/MTF и детали разных трансмиссий не взаимозаменяемы автоматически.' },
  { id: 'body-panels', title: 'Кузовные панели и крепёж', group: 'full', category: 'Кузов', fitment: 'По кузову, году, рынку и стороне', verification: 'unverified', note: 'Учитывать рестайлинг, отверстия под датчики, крепления и сторону установки.' },
  { id: 'electrical', title: 'Электрика, датчики и блоки управления', group: 'full', category: 'Электрика', fitment: 'По номеру детали, разъёму, прошивке и комплектации', verification: 'unverified', note: 'Сверять полный номер, суффикс, распиновку и совместимость программного обеспечения.' },
  { id: 'exhaust', title: 'Выпускная система и элементы очистки выхлопа', group: 'full', category: 'Выхлоп', fitment: 'По двигателю, экологическому классу и рынку', verification: 'unverified', note: 'Различаются длина, фланцы, датчики и требования к системам контроля выбросов.' },
  { id: 'genuine-floor-mats', title: 'Оригинальные коврики салона', group: 'accessories', category: 'Салон', fitment: 'По модели, поколению и кузову', kind: 'official', verification: 'unverified', note: 'Категория официальных аксессуаров. Артикул и наличие проверяются по оригинальному каталогу конкретной марки.' },
  { id: 'genuine-mudguards', title: 'Оригинальные брызговики', group: 'accessories', category: 'Экстерьер', fitment: 'По кузову, комплектации и рынку', kind: 'official', verification: 'unverified', note: 'Проверять комплектность крепежа и совместимость с заводскими обвесами.' },
  { id: 'genuine-roof-rack', title: 'Оригинальные поперечины / багажник на крышу', group: 'accessories', category: 'Перевозка грузов', fitment: 'По рейлингам, точкам крепления и допустимой нагрузке', kind: 'official', verification: 'unverified', note: 'Нагрузка на крышу и совместимость определяются руководством автомобиля и OEM-каталогом.' },
  { id: 'genuine-cargo-tray', title: 'Оригинальный коврик багажника', group: 'accessories', category: 'Багажник', fitment: 'По кузову и конфигурации пола багажника', kind: 'official', verification: 'unverified', note: 'Проверять форму пола, третий ряд сидений и наличие органайзеров.' },
  { id: 'genuine-splash-guards', title: 'Защитные накладки и аксессуары экстерьера', group: 'accessories', category: 'Экстерьер', fitment: 'По поколению и комплектации', kind: 'official', verification: 'unverified', note: 'В каталоге будут разделены заводские аксессуары и сторонние аналоги.' },
  { id: 'aftermarket-dashcam', title: 'Видеорегистратор', group: 'accessories', category: 'Электроника', kind: 'aftermarket', fitment: 'Универсальный аксессуар — проверить питание и место установки', verification: 'partial', note: 'Не является оригинальным аксессуаром без подтверждения каталога производителя; установка не должна мешать обзору и подушкам безопасности.' },
  { id: 'aftermarket-obd', title: 'OBD-II адаптер', group: 'accessories', category: 'Диагностика', kind: 'aftermarket', fitment: 'Совместимость зависит от протокола автомобиля и приложения', verification: 'partial', note: 'Поддержка универсального адаптера не гарантирует чтение фирменных блоков и расширенных параметров.' },
];

const GROUPS: { id: CatalogGroup; title: string; subtitle: string; icon: typeof Wrench }[] = [
  { id: 'consumables', title: 'Расходники и часто ломается', subtitle: 'ТО, изнашиваемые детали и распространённые узлы', icon: Wrench },
  { id: 'full', title: 'Полный каталог запчастей', subtitle: 'Двигатель, трансмиссия, подвеска, кузов, электрика и другие системы', icon: Package },
  { id: 'accessories', title: 'Аксессуары, включая оригинальные', subtitle: 'Официальные OEM-аксессуары и сторонние решения — отдельно', icon: ShoppingBag },
];

const statusText: Record<Verification, string> = {
  verified: 'Проверено по источнику',
  partial: 'Частично подтверждено',
  unverified: 'Требует сверки',
};

export default function PartsAccessoriesHub({ selectedBrandId, selectedModelId }: { selectedBrandId: string; selectedModelId: string }) {
  const [group, setGroup] = useState<CatalogGroup>('consumables');
  const [brandId, setBrandId] = useState(selectedBrandId || 'mitsubishi');
  const [modelId, setModelId] = useState(selectedModelId || 'outlander-1');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const brands = JAPANESE_BRANDS;
  const models = useMemo(() => brands.find(b => b.id === brandId)?.models ?? [], [brands, brandId]);
  const categories = useMemo(() => ['all', ...new Set(STARTER_ITEMS.filter(i => i.group === group).map(i => i.category))], [group]);
  const items = useMemo(() => STARTER_ITEMS.filter(item => item.group === group && (category === 'all' || item.category === category) && (!query.trim() || [item.title, item.category, item.fitment, item.note, item.oemNumber ?? '', item.brand ?? ''].some(v => v.toLowerCase().includes(query.toLowerCase().trim())))), [group, category, query]);
  const selectedModel = models.find(m => m.id === modelId) ?? models[0];

  return <div className="space-y-5">
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-[#173451] p-5 sm:p-7 text-white border border-slate-800">
      <div className="absolute -right-12 -top-16 w-64 h-64 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-red-300"><CarFront className="w-4 h-4" /> Car Brother · parts intelligence</div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Запчасти и аксессуары</h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">Три независимых каталога с подбором по марке и модели. Артикулы, официальность и применимость показываются только при наличии источника — неподтверждённые позиции помечены явно.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs min-w-44">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3"><span className="block text-slate-400">Стартовые позиции</span><strong className="text-xl font-mono">{STARTER_ITEMS.length}</strong></div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3"><span className="block text-slate-400">Проверено</span><strong className="text-xl font-mono">0</strong></div>
        </div>
      </div>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {GROUPS.map(item => {
        const Icon = item.icon;
        const active = group === item.id;
        return <button key={item.id} onClick={() => { setGroup(item.id); setCategory('all'); }} className={`text-left rounded-xl border p-4 transition min-h-28 ${active ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-950/15' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-red-400'}`}>
          <div className="flex items-center gap-2 font-bold text-sm"><Icon className="w-5 h-5" />{item.title}</div>
          <p className={`text-xs mt-2 leading-relaxed ${active ? 'text-red-100' : 'text-slate-500 dark:text-slate-400'}`}>{item.subtitle}</p>
        </button>;
      })}
    </div>

    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Марка
          <select value={brandId} onChange={e => { setBrandId(e.target.value); setModelId(''); }} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-sm font-normal">
            {brands.map(b => <option key={b.id} value={b.id}>{b.russianName} — {b.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Модель / поколение
          <select value={selectedModel?.id ?? ''} onChange={e => setModelId(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-sm font-normal">
            {models.map(m => <option key={m.id} value={m.id}>{m.name} · {m.years}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Поиск по каталогу
          <div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Название, система, артикул…" className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-red-500" /></div>
        </label>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-slate-400" />
        {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${category === c ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{c === 'all' ? 'Все системы' : c}</button>)}
      </div>
      {selectedModel && <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300 flex gap-2"><BookOpen className="w-4 h-4 shrink-0 text-red-500" /><span>Выбрано: <strong>{brands.find(b => b.id === brandId)?.name} {selectedModel.name}</strong>. Перед заказом проверяйте VIN, рынок, код кузова, двигатель, коробку и дату выпуска. Позиции ниже — стартовая структура каталога, а не подтверждение совместимости с выбранным автомобилем.</span></div>}
      <div className="flex items-center justify-between text-xs text-slate-500"><span>Показано позиций: <strong>{items.length}</strong></span><span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Уровень проверки указан на каждой позиции</span></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {items.map(item => <article key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3 hover:border-slate-400 dark:hover:border-slate-600 transition">
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-[10px] uppercase tracking-wider text-red-600 dark:text-red-400 font-bold">{item.category}</div><h2 className="font-bold text-sm mt-1 text-slate-900 dark:text-white">{item.title}</h2></div>
            <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${item.verification === 'verified' ? 'bg-emerald-100 text-emerald-800' : item.verification === 'partial' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{statusText[item.verification]}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Применимость: {item.fitment}</div>
          {item.kind && <div className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[11px] font-bold"><ShieldCheck className="w-3.5 h-3.5" />{item.kind === 'official' ? 'Категория: оригинальный аксессуар — артикул требует проверки' : 'Сторонний аксессуар'}</div>}
          {item.oemNumber && <div className="font-mono text-xs">OEM: {item.oemNumber}</div>}
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">{item.note}</p>
        </article>)}
        {items.length === 0 && <div className="col-span-full text-center p-10 text-sm text-slate-500">Ничего не найдено. Измени поисковый запрос или категорию.</div>}
      </div>
      <div className="rounded-xl border border-amber-300/70 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 p-3 flex gap-2 text-xs text-amber-900 dark:text-amber-200"><AlertTriangle className="w-4 h-4 shrink-0" /><p>Это начальный каркас расширяемого каталога. В нём намеренно нет выдуманных OEM-артикулов и заявлений о полной совместимости. Для реального полного каталога требуется последовательное наполнение заводскими каталогами по каждой модели и модификации.</p></div>
    </section>
  </div>;
}

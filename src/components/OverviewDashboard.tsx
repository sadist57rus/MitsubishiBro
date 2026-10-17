import { useMemo, useState } from 'react';
import {
  Award, Car, Layers, Zap, Wrench, AlertCircle, Disc, Calendar,
  Stethoscope, BookOpen, ArrowRight, Fuel, Droplet, ChevronRight,
  Lightbulb, Star, ClipboardCheck, Search, Settings2
} from 'lucide-react';
import type { EngineType } from '../types';
import type { TabId } from './Header';
import { BrandLogo } from './BrandLogos';
import { JAPANESE_BRANDS } from '../data/japaneseBrandsData';
import { useVehicle } from '../context/VehicleContext';

interface Props {
  onNavigate: (tab: TabId) => void;
  selectedEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
  selectedBrandId?: string;
  onSelectBrand?: (brandId: string) => void;
  onOpenBrandSelector?: () => void;
}

const SECTION_CATALOG = [
  { id: 'brands', title: 'Авто Японии', desc: 'Марки, поколения, история и характеристики моделей', icon: Award, group: 'Каталог' },
  { id: 'specs', title: 'Технические характеристики', desc: 'Размеры кузова, масса, объёмы и параметры конкретной модификации', icon: Car, group: 'Автомобиль' },
  { id: 'parts', title: 'Запчасти и аксессуары', desc: 'Каталог деталей, оригинальные номера и аналоги', icon: Layers, group: 'Автомобиль' },
  { id: 'fuses', title: 'Предохранители', desc: 'Схемы блоков, номиналы и защищаемые цепи', icon: Zap, group: 'Электрика' },
  { id: 'bulbs', title: 'Лампы и автосвет', desc: 'Типы ламп, цоколи и доступ к узлам освещения', icon: Lightbulb, group: 'Электрика' },
  { id: 'tuning', title: 'Тюнинг и доработки', desc: 'Совместимость деталей и варианты модернизации', icon: Settings2, group: 'Обслуживание' },
  { id: 'guides', title: 'Руководства по ремонту', desc: 'Пошаговые инструкции и технические процедуры', icon: Wrench, group: 'Обслуживание' },
  { id: 'issues', title: 'Неисправности', desc: 'Симптомы, диагностика и возможные причины', icon: AlertCircle, group: 'Обслуживание' },
  { id: 'fuel', title: 'Расход топлива', desc: 'Расход, заправки и стоимость поездок', icon: Fuel, group: 'Инструменты' },
  { id: 'wheels', title: 'Диски и шины', desc: 'Размеры, параметры колёс и калькулятор шин', icon: Disc, group: 'Автомобиль' },
  { id: 'maintenance', title: 'Регламент ТО', desc: 'Периодичность обслуживания и технические жидкости', icon: Calendar, group: 'Обслуживание' },
  { id: 'obd', title: 'Ошибки OBD-II', desc: 'Коды неисправностей и диагностические подсказки', icon: Stethoscope, group: 'Инструменты' },
  { id: 'logbook', title: 'Бортжурнал', desc: 'История работ, расходов и пробега', icon: BookOpen, group: 'Инструменты' },
] as const satisfies ReadonlyArray<{ id: TabId; title: string; desc: string; icon: typeof Car; group: string }>;

const QUICK_ACTIONS = [
  { id: 'maintenance', label: 'Запланировать ТО', icon: ClipboardCheck },
  { id: 'fuses', label: 'Предохранители', icon: Zap },
  { id: 'bulbs', label: 'Лампы', icon: Lightbulb },
  { id: 'obd', label: 'Ошибки OBD', icon: Stethoscope },
  { id: 'wheels', label: 'Шины и диски', icon: Disc },
  { id: 'fuel', label: 'Расход топлива', icon: Fuel },
] as const satisfies ReadonlyArray<{ id: TabId; label: string; icon: typeof Car }>;

function displayValue(value: unknown, suffix = ''): string {
  if (value === null || value === undefined || value === '' || value === 0 || value === '0') return 'нет данных';
  return `${value}${suffix}`;
}

export default function OverviewDashboard({
  onNavigate,
  selectedEngine,
  onSelectEngine,
  selectedBrandId,
  onSelectBrand,
  onOpenBrandSelector
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSections, setShowAllSections] = useState(false);
  const vehicle = useVehicle();
  const brandId = vehicle.brandId || selectedBrandId || 'mitsubishi';
  const brand = JAPANESE_BRANDS.find(item => item.id === brandId);
  const model = JAPANESE_BRANDS.flatMap(item => item.models).find(item => item.id === vehicle.modelId);
  const engineOptions = useMemo(() => {
    if (!model?.engines?.length) return [];
    return model.engines.map(engine => ({ id: engine.code, label: engine.code && engine.code !== 'УТОЧНИТЬ ПО ТАБЛИЧКЕ' ? engine.code : engine.name }))
      .filter((item, index, all) => item.id && all.findIndex(other => other.id === item.id) === index);
  }, [model]);
  const activeCatalogEngine = engineOptions.find(item => item.id === vehicle.activeVehicle.engine);
  const currentEngine = selectedEngine !== 'ALL' ? selectedEngine : (activeCatalogEngine?.id as EngineType | undefined) || vehicle.engine;
  const engineLabel = currentEngine === 'ALL'
    ? (vehicle.activeVehicle.engine && vehicle.activeVehicle.engine !== 'не указан' ? vehicle.activeVehicle.engine : engineOptions.length ? 'Все доступные варианты' : 'нет данных')
    : engineOptions.find(item => item.id === currentEngine)?.label || vehicle.activeVehicle.engine || 'нет данных';

  const sections = SECTION_CATALOG.filter(section =>
    !searchQuery.trim() || `${section.title} ${section.desc} ${section.group}`.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );
  const visibleSections = showAllSections ? sections : sections.slice(0, 6);
  const modelHasData = Boolean(model);
  const bodyType = model?.bodyType || 'нет данных';
  const generation = model?.generation || 'нет данных';
  const modelName = model?.name || 'Модель не выбрана';
  const brandName = brand?.russianName || brand?.name || 'Марка не выбрана';
  const dimensions = model?.dimensions;

  const quickSpecs = [
    { label: 'Год выпуска', value: displayValue(vehicle.activeVehicle.year) },
    { label: 'Пробег', value: displayValue(vehicle.activeVehicle.mileage, ' км') },
    { label: 'Кузов', value: bodyType },
    { label: 'Двигатель', value: engineLabel },
    { label: 'Колёсная база', value: displayValue(dimensions?.wheelbaseMm, ' мм') },
    { label: 'Топливный бак', value: displayValue(dimensions?.fuelTankLiters, ' л') },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-200 min-w-0">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="relative p-5 sm:p-7">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Моя машина · активна в гараже</div>
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-2">
                {brand ? <BrandLogo brandId={brand.id} className="w-10 h-10" /> : <Car className="w-8 h-8 text-slate-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">{brandName} · {generation}</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-words">{modelName}</h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {model?.overview || 'Для выбранной модели подробное досье пока не подготовлено. Откройте каталог «Авто Японии», чтобы проверить доступные поколения и варианты.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              {quickSpecs.map(item => (
                <div key={item.label} className="rounded-lg bg-slate-50 dark:bg-slate-950 p-3 min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white break-words">{item.value}</div>
                </div>
              ))}
            </div>

            {engineOptions.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Вариант двигателя</div>
                <div className="flex flex-wrap gap-2">
                  {engineOptions.map(engine => (
                    <button key={engine.id} type="button" onClick={() => onSelectEngine(engine.id as EngineType)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${currentEngine === engine.id ? 'bg-red-600 border-red-600 text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-red-400'}`}>
                      {engine.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!modelHasData && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 text-sm text-amber-900 dark:text-amber-200">
                Данные для этой модели ещё не проверены.{' '}
                <button type="button" onClick={() => onNavigate('brands')} className="font-semibold underline underline-offset-2">Открыть раздел «Авто Японии»</button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onOpenBrandSelector ?? (() => onNavigate('brands'))} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
                <Car className="h-4 w-4" /> Выбрать автомобиль
              </button>
              <button type="button" onClick={() => onNavigate('logbook')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Star className="h-4 w-4" /> Бортжурнал
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Быстрые действия</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Переход к частым задачам в один тап.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon;
            return <button key={action.id} type="button" onClick={() => onNavigate(action.id)} className="flex min-h-24 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"><Icon className="h-5 w-5" /></span>
              <span className="text-sm font-semibold leading-snug text-slate-900 dark:text-white">{action.label}</span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
            </button>;
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Все разделы</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{SECTION_CATALOG.length} разделов · выберите нужный модуль</p>
          </div>
          <label className="relative block w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Найти раздел…" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white outline-none focus:border-red-500" />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleSections.map(section => {
            const Icon = section.icon;
            return <button key={section.id} type="button" onClick={() => onNavigate(section.id)} className="group flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left hover:border-red-400 transition">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-900 dark:text-white">{section.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">{section.desc}</span>
              </span>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover:text-red-500" />
            </button>;
          })}
        </div>
        {!searchQuery && SECTION_CATALOG.length > 6 && (
          <button type="button" onClick={() => setShowAllSections(value => !value)} className="mx-auto flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            {showAllSections ? 'Свернуть разделы' : `Показать все ${SECTION_CATALOG.length} разделов`}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAllSections ? 'rotate-90' : ''}`} />
          </button>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
        <div className="flex items-center gap-2"><Droplet className="h-5 w-5 text-red-600" /><h2 className="font-bold text-slate-900 dark:text-white">Технические данные</h2></div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Значения показываются только для выбранной модели и доступного досье. Неизвестные параметры не подменяются характеристиками Outlander I.
        </p>
        <button type="button" onClick={() => onNavigate('brands')} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">Проверить данные в «Авто Японии» <ChevronRight className="h-4 w-4" /></button>
      </section>
    </div>
  );
}

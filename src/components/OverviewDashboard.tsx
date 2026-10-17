import { Car, Wrench, Zap, Lightbulb, Stethoscope, Fuel, CalendarDays, BookOpen, ChevronRight, Settings2 } from 'lucide-react';
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

const QUICK_ACTIONS = [
  { id: 'maintenance', label: 'ТО', hint: 'Обслуживание', icon: CalendarDays },
  { id: 'fuses', label: 'Предохранители', hint: 'Электрика', icon: Zap },
  { id: 'bulbs', label: 'Лампы', hint: 'Автосвет', icon: Lightbulb },
  { id: 'obd', label: 'Ошибки OBD', hint: 'Диагностика', icon: Stethoscope },
  { id: 'fuel', label: 'Топливо', hint: 'Расходы', icon: Fuel },
  { id: 'logbook', label: 'Бортжурнал', hint: 'Записи и расходы', icon: BookOpen },
] as const satisfies ReadonlyArray<{ id: TabId; label: string; hint: string; icon: typeof Car }>;

function valueOrUnknown(value: unknown, suffix = '') {
  if (value === null || value === undefined || value === '' || value === 0 || value === '0') return '—';
  return `${value}${suffix}`;
}

export default function OverviewDashboard({ onNavigate, onOpenBrandSelector }: Props) {
  const vehicle = useVehicle();
  const brand = JAPANESE_BRANDS.find(item => item.id === vehicle.brandId);
  const model = brand?.models.find(item => item.id === vehicle.modelId);
  const hasVehicle = Boolean(vehicle.activeVehicle && vehicle.vehicles.length);
  const title = hasVehicle
    ? [brand?.russianName || brand?.name, model?.name].filter(Boolean).join(' ')
    : 'Автомобиль не выбран';

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 md:space-y-7">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950 md:h-20 md:w-20">
            {brand ? <BrandLogo brandId={brand.id} className="h-full w-full" /> : <Car className="h-10 w-10 text-slate-500" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Мой автомобиль</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-slate-900 dark:text-white md:text-3xl">{title}</h1>
            {hasVehicle && <p className="mt-1 text-base text-slate-600 dark:text-slate-300">{[vehicle.activeVehicle.year || null, vehicle.activeVehicle.engine !== 'не указан' ? vehicle.activeVehicle.engine : null].filter(Boolean).join(' · ') || 'Профиль автомобиля'}</p>}
          </div>
          <button type="button" onClick={onOpenBrandSelector ?? (() => onNavigate('garage'))} aria-label="Выбрать или изменить автомобиль" className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-base font-bold text-white hover:bg-red-700 md:min-h-14">
            <Settings2 className="h-5 w-5" /><span className="hidden sm:inline">{hasVehicle ? 'Изменить' : 'Выбрать'}</span>
          </button>
        </div>
        {hasVehicle && <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950"><p className="text-sm text-slate-500 dark:text-slate-400">Пробег</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-white md:text-2xl">{valueOrUnknown(vehicle.activeVehicle.mileage, ' км')}</p></div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950"><p className="text-sm text-slate-500 dark:text-slate-400">Кузов</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-white md:text-2xl">{model?.bodyType || '—'}</p></div>
          <div className="col-span-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950 sm:col-span-1"><p className="text-sm text-slate-500 dark:text-slate-400">Поколение</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-white md:text-2xl">{model?.generation || '—'}</p></div>
        </div>}
      </section>

      <section aria-labelledby="quick-actions-title">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="quick-actions-title" className="text-xl font-black text-slate-900 dark:text-white md:text-2xl">Быстрый доступ</h2>
          <button type="button" onClick={() => onNavigate('garage')} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800">Гараж <ChevronRight className="inline h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon;
            return <button key={action.id} type="button" onClick={() => onNavigate(action.id)} className="group flex min-h-24 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-red-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 md:min-h-28 md:gap-4 md:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 md:h-14 md:w-14"><Icon className="h-7 w-7" /></span>
              <span className="min-w-0"><span className="block text-base font-bold leading-tight text-slate-900 dark:text-white md:text-lg">{action.label}</span><span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{action.hint}</span></span>
            </button>;
          })}
        </div>
      </section>

      <button type="button" onClick={() => onNavigate('brands')} className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:border-red-400 dark:border-slate-800 dark:bg-slate-900 md:p-5">
        <span className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800"><Car className="h-6 w-6" /></span><span><span className="block text-base font-bold text-slate-900 dark:text-white md:text-lg">Каталог автомобилей и разделов</span><span className="block text-sm text-slate-500 dark:text-slate-400">Открывайте нужное, когда это понадобится</span></span></span>
        <ChevronRight className="h-6 w-6 shrink-0 text-slate-400" />
      </button>
    </div>
  );
}

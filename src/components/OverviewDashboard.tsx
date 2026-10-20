import { Car, Zap, Lightbulb, Stethoscope, Fuel, CalendarDays, BookOpen, Settings2 } from 'lucide-react';
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
  { id: 'maintenance', label: 'ТО', icon: CalendarDays },
  { id: 'fuses', label: 'Предохранители', icon: Zap },
  { id: 'bulbs', label: 'Лампы', icon: Lightbulb },
  { id: 'obd', label: 'Ошибки OBD', icon: Stethoscope },
  { id: 'fuel', label: 'Топливо', icon: Fuel },
  { id: 'logbook', label: 'Журнал', icon: BookOpen },
] as const satisfies ReadonlyArray<{ id: TabId; label: string; icon: typeof Car }>;

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
    <div className="mx-auto w-full max-w-6xl space-y-4 md:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950 sm:h-14 sm:w-14 md:h-16 md:w-16">
            {hasVehicle && brand ? <BrandLogo brandId={brand.id} className="h-full w-full" /> : <Car className="h-10 w-10 text-slate-500" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Мой автомобиль</p>
            <h1 className="mt-0.5 text-lg font-black leading-tight text-slate-900 dark:text-white sm:text-xl md:text-2xl">{title}</h1>
            {hasVehicle && (
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:text-base">
                <span>{vehicle.activeVehicle.year || 'Год не указан'}</span>
                <span>Пробег: {valueOrUnknown(vehicle.activeVehicle.mileage, ' км')}</span>
              </div>
            )}
            {hasVehicle && vehicle.activeVehicle.engine && vehicle.activeVehicle.engine !== 'не указан' && <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">{vehicle.activeVehicle.engine}</p>}
          </div>
          {hasVehicle && (
            <button type="button" onClick={onOpenBrandSelector ?? (() => onNavigate('garage'))} aria-label="Выбрать или изменить автомобиль" className="flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 text-sm font-bold text-white hover:bg-red-700 md:min-h-14">
              <Settings2 className="h-5 w-5" /><span className="hidden sm:inline">Сменить авто</span>
            </button>
          )}
        </div>
        {!hasVehicle && (
          <button type="button" onClick={onOpenBrandSelector ?? (() => onNavigate('garage'))} aria-label="Выбрать автомобиль" className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-base font-bold text-white hover:bg-red-700 md:min-h-14">
            <Car aria-hidden="true" className="h-5 w-5" />Выбрать автомобиль
          </button>
        )}
        {hasVehicle && <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-950"><p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Кузов</p><p className="mt-0.5 text-sm font-bold leading-snug text-slate-900 dark:text-white sm:text-base md:text-lg">{model?.bodyType || '—'}</p></div>
          <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-950"><p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Поколение</p><p className="mt-0.5 text-sm font-bold leading-snug text-slate-900 dark:text-white sm:text-base md:text-lg">{model?.generation || '—'}</p></div>
        </div>}
      </section>

      <section aria-labelledby="quick-actions-title">
        <div className="mb-3">
          <h2 id="quick-actions-title" className="text-xl font-black text-slate-900 dark:text-white md:text-2xl">Быстрый доступ</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon;
            return <button key={action.id} type="button" onClick={() => onNavigate(action.id)} className="group flex min-h-24 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-red-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 md:min-h-28 md:gap-4 md:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 md:h-14 md:w-14"><Icon className="h-7 w-7" /></span>
              <span className="min-w-0"><span className="block text-base font-bold leading-tight text-slate-900 dark:text-white md:text-lg">{action.label}</span></span>
            </button>;
          })}
        </div>
      </section>
    </div>
  );
}

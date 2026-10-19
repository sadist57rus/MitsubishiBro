import { useState, useMemo, useEffect, useRef } from 'react';
import { EngineType } from '../types';
import { parseDecimalInput, readStored, writeStored } from '../lib/storage';
import { useVehicle } from '../context/VehicleContext';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import { usePreferences } from '../context/PreferencesContext';
import { getFuelStorageKey } from '../lib/vehicleStorageKeys';
import {
  Fuel,
  Calculator,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Gauge,
  Sparkles,
  Info,
  Car,
  SlidersHorizontal,
  Activity
} from 'lucide-react';

export interface FuelLog {
  id: string;
  vehicleId?: string;
  currency?: string;
  date: string;
  odometer: number;
  distance: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  consumption: number;
  fuelType: string;
  station: string;
}

export default function FuelMonitor({ selectedEngine = 'ALL' }: { selectedEngine?: EngineType }) {
  const { vehicleId, vehicles, activeVehicle } = useVehicle();
  const activeBrand = JAPANESE_BRANDS.find(brand => brand.id === activeVehicle.brandId);
  const activeModel = activeBrand?.models.find(model => model.id === activeVehicle.modelId);
  const vehicleLabel = [activeBrand?.russianName || activeBrand?.name, activeModel?.name, activeModel?.generation].filter(Boolean).join(' ');
  const tankCapacity = activeModel?.dimensions?.fuelTankLiters;
  const activeStorageKey = getFuelStorageKey(vehicleId, vehicleId === vehicles[0]?.id, activeModel?.id === 'outlander-1');
  const { preferences } = usePreferences();
  const currencySymbols: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€', CNY: '¥' };
  const currencySymbol = currencySymbols[preferences.currency] || '₽';
  const formatConsumption = (value: string | number) => { const n = Number(value); if (!Number.isFinite(n) || n <= 0) return '—'; return preferences.fuelUnit === 'mpg' ? (235.214583 / n).toFixed(1) : n.toFixed(2); };
  const consumptionUnit = preferences.fuelUnit === 'mpg' ? 'mpg (US)' : 'л/100 км';
  // Calculator inputs
  const [distance, setDistance] = useState<string>('420');
  const [liters, setLiters] = useState<string>('48');
  const [fuelPrice, setFuelPrice] = useState<string>('62.50');
  const [fuelType, setFuelType] = useState<string>('АИ-95');

  // Chart options
  const [chartXMode, setChartXMode] = useState<'odometer' | 'date'>('odometer');
  const [spendPeriod, setSpendPeriod] = useState<'month' | 'year' | 'all'>('month');

  // Logs state with rich authentic initial history
  const [logs, setLogs] = useState<FuelLog[]>(() => readStored(activeStorageKey, (value: unknown): value is FuelLog[] => Array.isArray(value) && value.every((item): item is FuelLog => typeof item === 'object' && item !== null && typeof item.id === 'string' && (item.vehicleId === undefined || typeof item.vehicleId === 'string') && (item.currency === undefined || typeof item.currency === 'string') && typeof item.date === 'string' && typeof item.odometer === 'number' && typeof item.distance === 'number' && typeof item.liters === 'number' && typeof item.pricePerLiter === 'number' && typeof item.totalCost === 'number' && typeof item.consumption === 'number' && typeof item.fuelType === 'string' && typeof item.station === 'string'), []).map(item => ({ ...item, vehicleId: item.vehicleId || vehicleId, currency: item.currency || 'RUB' })));

  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newOdometer, setNewOdometer] = useState<string>('246100');
  const [newDistance, setNewDistance] = useState<string>('440');
  const [newLiters, setNewLiters] = useState<string>('49.5');
  const [newPrice, setNewPrice] = useState<string>('63.00');
  const [newStation, setNewStation] = useState<string>('Лукойл');
  const [newFuelType, setNewFuelType] = useState<string>('АИ-95');

  const skipNextFuelWrite = useRef(false);

  useEffect(() => {
    skipNextFuelWrite.current = true;
    setLogs(readStored(activeStorageKey, (value: unknown): value is FuelLog[] => Array.isArray(value) && value.every((item): item is FuelLog => typeof item === 'object' && item !== null && typeof item.id === 'string' && (item.vehicleId === undefined || typeof item.vehicleId === 'string') && (item.currency === undefined || typeof item.currency === 'string') && typeof item.date === 'string' && typeof item.odometer === 'number' && typeof item.distance === 'number' && typeof item.liters === 'number' && typeof item.pricePerLiter === 'number' && typeof item.totalCost === 'number' && typeof item.consumption === 'number' && typeof item.fuelType === 'string' && typeof item.station === 'string'), []).map(item => ({ ...item, vehicleId: item.vehicleId || vehicleId, currency: item.currency || activeVehicle.currency || preferences.currency })));
    setIsAddingLog(false);
  }, [activeStorageKey, vehicleId, activeVehicle.currency, preferences.currency]);

  useEffect(() => {
    if (skipNextFuelWrite.current) {
      skipNextFuelWrite.current = false;
      return;
    }
    writeStored(activeStorageKey, logs, (value: unknown): value is FuelLog[] => Array.isArray(value) && value.every((item): item is FuelLog => typeof item === 'object' && item !== null && typeof item.id === 'string' && (item.vehicleId === undefined || typeof item.vehicleId === 'string') && (item.currency === undefined || typeof item.currency === 'string') && typeof item.date === 'string' && typeof item.odometer === 'number' && typeof item.distance === 'number' && typeof item.liters === 'number' && typeof item.pricePerLiter === 'number' && typeof item.totalCost === 'number' && typeof item.consumption === 'number' && typeof item.fuelType === 'string' && typeof item.station === 'string'));
  }, [logs, activeStorageKey]);

  // Main Calculator Computation
  const stats = useMemo(() => {
    const distNum = (parseDecimalInput(distance) ?? NaN);
    const litNum = (parseDecimalInput(liters) ?? NaN);
    const priceNum = (parseDecimalInput(fuelPrice) ?? NaN);

    if (distNum > 0 && litNum > 0) {
      const consumption = (litNum / distNum) * 100;
      const costPerKm = priceNum > 0 ? (litNum * priceNum) / distNum : 0;
      const costPer100Km = costPerKm * 100;
      const tankRange = tankCapacity && tankCapacity > 0 ? (tankCapacity / consumption) * 100 : 0;

      // Assessment
      let verdict = '';
      let verdictColor = '';
      if (consumption < 9.5) {
        verdict = 'Отличный трассовый расход (ниже паспорта)';
        verdictColor = 'text-emerald-500';
      } else if (consumption <= 11.5) {
        verdict = 'Оптимальный смешанный цикл для 4WD';
        verdictColor = 'text-emerald-400';
      } else if (consumption <= 14.5) {
        verdict = 'Стандартный городской режим';
        verdictColor = 'text-amber-500';
      } else if (consumption <= 17.0) {
        verdict = 'Повышенный городской расход (пробки / зима)';
        verdictColor = 'text-orange-500';
      } else {
        verdict = 'Аномально высокий расход! Рекомендуется диагностика';
        verdictColor = 'text-red-500';
      }

      return {
        consumption: consumption.toFixed(2),
        costPerKm: costPerKm > 0 ? costPerKm.toFixed(2) : null,
        costPer100Km: costPer100Km > 0 ? costPer100Km.toFixed(0) : null,
        tankRange: tankRange.toFixed(0),
        verdict,
        verdictColor
      };
    }
    return null;
  }, [distance, liters, fuelPrice, tankCapacity]);

  // Overall Logs Statistics
  const overallStats = useMemo(() => {
    if (logs.length === 0) return null;
    const totalDist = logs.reduce((acc, l) => acc + l.distance, 0);
    const totalLiters = logs.reduce((acc, l) => acc + l.liters, 0);
    const totalSpent = logs.filter(l => (l.currency || 'RUB') === preferences.currency).reduce((acc, l) => acc + l.totalCost, 0);
    const avgConsumption = totalDist > 0 ? (totalLiters / totalDist) * 100 : 0;

    const minConsumption = Math.min(...logs.map(l => l.consumption));
    const maxConsumption = Math.max(...logs.map(l => l.consumption));

    return {
      totalDist,
      totalLiters: totalLiters.toFixed(1),
      totalSpent: totalSpent.toFixed(0),
      avgConsumption: avgConsumption.toFixed(2),
      minConsumption: minConsumption.toFixed(2),
      maxConsumption: maxConsumption.toFixed(2)
    };
  }, [logs, preferences.currency]);

  // Formatted data for Recharts sorted chronologically/by odometer
  const chartData = useMemo(() => {
    return [...logs]
      .sort((a, b) => a.odometer - b.odometer)
      .map((item) => ({
        ...item,
        odometerKm: item.odometer,
        label: chartXMode === 'odometer' ? `${item.odometer} км` : item.date,
        consumptionVal: preferences.fuelUnit === 'mpg' ? 235.214583 / item.consumption : item.consumption,
        litersVal: item.liters,
        costVal: item.totalCost
      }));
  }, [logs, chartXMode, preferences.fuelUnit]);

  const chartGeometry = useMemo(() => {
    const min = preferences.fuelUnit === 'mpg' ? 14 : 6;
    const max = preferences.fuelUnit === 'mpg' ? 32 : 17;
    const points = chartData.map((item, index) => ({
      ...item,
      x: chartData.length === 1 ? 400 : 48 + index * 704 / (chartData.length - 1),
      y: 20 + (max - item.consumptionVal) / (max - min) * 180,
    }));
    const linePath = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
    const areaPath = points.length ? `${linePath} L ${points[points.length - 1].x} 210 L ${points[0].x} 210 Z` : '';
    return { min, max, points, linePath, areaPath };
  }, [chartData, preferences.fuelUnit]);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseDecimalInput(newDistance) ?? NaN;
    const litNum = parseDecimalInput(newLiters) ?? NaN;
    const priceNum = parseDecimalInput(newPrice) ?? NaN;
    const odoNum = parseDecimalInput(newOdometer) ?? 0;

    if (distNum > 0 && litNum > 0) {
      const consumption = (litNum / distNum) * 100;
      const totalCost = (priceNum > 0 ? priceNum : 0) * litNum;

      const newEntry: FuelLog = {
        id: Date.now().toString(),
        vehicleId,
        currency: preferences.currency,
        date: new Date().toISOString().split('T')[0],
        odometer: odoNum,
        distance: distNum,
        liters: litNum,
        pricePerLiter: priceNum,
        totalCost,
        consumption: parseFloat(consumption.toFixed(2)),
        fuelType: newFuelType,
        station: newStation || 'АЗС'
      };

      setLogs([newEntry, ...logs]);
      setIsAddingLog(false);
    }
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                Учёт и аналитика расхода топлива
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500">Расход и стоимость поездок</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Fuel className="w-6 h-6 text-red-600" />
              Расходы на топливо
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
              Точный калькулятор среднего расхода ({consumptionUnit}), оценка стоимости поездок, интерактивный график расхода по пробегу Recharts и анализ расходов по журналу заправок.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setIsAddingLog(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Записать заправку</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip if logs exist */}
        {overallStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-xs block">Средний расход</span>
              <div className="text-red-600 dark:text-red-400 font-mono font-black text-lg">
                {formatConsumption(overallStats.avgConsumption)} <span className="text-xs font-normal text-slate-500">{consumptionUnit}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-xs block">Мин. / Макс.</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-sm mt-1">
                <span className="text-emerald-600 dark:text-emerald-400">{overallStats.minConsumption}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-amber-600 dark:text-amber-400">{overallStats.maxConsumption}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-xs block">Учтённый пробег</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                {overallStats.totalDist.toLocaleString()} <span className="text-xs font-normal text-slate-500">км</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-xs block">Всего заправлено</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                {overallStats.totalLiters} <span className="text-xs font-normal text-slate-500">л</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 col-span-2 sm:col-span-2">
              <span className="text-slate-500 dark:text-slate-400 text-xs block">Сумма расходов на бензин</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                {Number(overallStats.totalSpent).toLocaleString()} <span className="text-xs font-normal text-slate-500">{currencySymbol}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fuel spending donut: large, glanceable summary for head-unit displays. */}
      {(() => {
        const now = new Date();
        const filtered = logs.filter(log => {
          const date = new Date(log.date + 'T12:00:00');
          if (spendPeriod === 'month') return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
          if (spendPeriod === 'year') return date.getFullYear() === now.getFullYear();
          return true;
        });
        const spend = filtered.filter(log => (log.currency || 'RUB') === preferences.currency).reduce((sum, log) => sum + log.totalCost, 0);
        const litersTotal = filtered.reduce((sum, log) => sum + log.liters, 0);
        const circumference = 2 * Math.PI * 72;
        const hasSpend = spend > 0;
        return (
          <section className="fuel-spend-panel bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div><h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Расходы на топливо</h2><p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mt-1">Сумма по сохранённым заправкам</p></div>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Период расходов">
                {([{id:'month',label:'Месяц'},{id:'year',label:'Год'},{id:'all',label:'Всё время'}] as const).map(option=><button key={option.id} type="button" aria-pressed={spendPeriod===option.id} onClick={()=>setSpendPeriod(option.id)} className={'min-h-14 rounded-xl border-2 px-4 text-base md:text-lg font-bold '+(spendPeriod===option.id?'border-red-600 bg-red-600 text-white':'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200')}>{option.label}</button>)}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-72 md:h-72">
                  <svg viewBox="0 0 180 180" role="img" aria-label={'Круговая диаграмма расходов: '+Math.round(spend).toLocaleString('ru-RU')+' '+currencySymbol} className="w-full h-full -rotate-90">
                    <circle cx="90" cy="90" r="72" fill="none" stroke="currentColor" strokeWidth="18" className="text-slate-200 dark:text-slate-700"/>
                    {hasSpend && <circle cx="90" cy="90" r="72" fill="none" stroke="#dc2626" strokeWidth="18" strokeLinecap="round" strokeDasharray={circumference+' '+circumference} />}
                    {hasSpend && filtered.length > 1 && <circle cx="90" cy="90" r="72" fill="none" stroke="#f59e0b" strokeWidth="18" strokeLinecap="round" strokeDasharray={(circumference*0.18)+' '+circumference} strokeDashoffset={-circumference*0.82}/>}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5"><span className="text-base md:text-lg font-bold text-slate-500 dark:text-slate-300">{spendPeriod==='month'?'За месяц':spendPeriod==='year'?'За год':'За всё время'}</span><strong className="mt-1 text-3xl md:text-4xl font-black leading-tight text-slate-900 dark:text-white">{Math.round(spend).toLocaleString('ru-RU')} <span className="text-2xl">{currencySymbol}</span></strong><span className="mt-1 text-sm md:text-base text-slate-500 dark:text-slate-300">{filtered.length} заправок</span></div>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-5"><p className="text-base md:text-lg text-slate-600 dark:text-slate-300">Заправлено</p><p className="text-3xl md:text-4xl font-black mt-1">{litersTotal.toLocaleString('ru-RU',{maximumFractionDigits:1})} л</p></div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-5"><p className="text-base md:text-lg text-slate-600 dark:text-slate-300">Средний чек</p><p className="text-3xl md:text-4xl font-black mt-1">{filtered.length ? Math.round(spend/filtered.length).toLocaleString('ru-RU') : '0'} {currencySymbol}</p></div>
                {!hasSpend && <p className="text-base text-slate-600 dark:text-slate-300">За выбранный период нет записей. Добавьте заправку — диаграмма обновится автоматически.</p>}
                <div className="flex items-center gap-3 text-base md:text-lg"><span className="w-4 h-4 rounded-full bg-red-600 shrink-0"/><span>Учтённые расходы по журналу</span></div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* RECHARTS SECTION: Interactive Fuel Consumption vs Mileage Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                График расхода топлива в зависимости от пробега (Recharts)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Динамика изменения среднего расхода ({consumptionUnit}) по записям бортжурнала с контрольными заводскими линиями
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setChartXMode('odometer')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  chartXMode === 'odometer'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                По пробегу (км)
              </button>
              <button
                onClick={() => setChartXMode('date')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  chartXMode === 'date'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                По датам
              </button>
            </div>
          </div>
        </div>

        {/* Legend / Benchmarks Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
            <span>Расход авто ({consumptionUnit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block border-b-2 border-dashed border-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">7.6 л (Паспорт Трасса)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block border-b-2 border-dashed border-amber-500" />
            <span className="text-amber-600 dark:text-amber-400">12.5 л (Паспорт Город 4WD)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-500 inline-block border-b-2 border-dashed border-red-500" />
            <span className="text-red-500">15.0 л (Порог перерасхода)</span>
          </div>
        </div>

        <div className="h-72 w-full pt-3">
          {chartData.length ? <svg viewBox="0 0 800 260" className="h-full w-full" role="img" aria-label={`График расхода топлива, ${chartData.length} записей`}>
            <defs><linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626" stopOpacity=".35" /><stop offset="100%" stopColor="#dc2626" stopOpacity=".02" /></linearGradient></defs>
            {Array.from({ length: 5 }, (_, i) => { const y = 20 + i * 45; const value = chartGeometry.max - i * (chartGeometry.max - chartGeometry.min) / 4; return <g key={i}><line x1="48" y1={y} x2="770" y2={y} stroke="currentColor" opacity=".12" strokeDasharray="3 5" /><text x="40" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11">{value.toFixed(0)}</text></g>; })}
            <path d={chartGeometry.areaPath} fill="url(#fuelGradient)" />
            <path d={chartGeometry.linePath} fill="none" stroke="#dc2626" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {chartGeometry.points.map((point, i) => <g key={point.id}><circle cx={point.x} cy={point.y} r="4" fill="#dc2626" stroke="#fff" strokeWidth="2"><title>{point.date}: {formatConsumption(point.consumption)} {consumptionUnit}; {point.liters} л; {point.distance} км</title></circle>{(i === 0 || i === Math.floor((chartGeometry.points.length - 1) / 2) || i === chartGeometry.points.length - 1) && <text x={point.x} y="242" textAnchor={i === 0 ? 'start' : i === chartGeometry.points.length - 1 ? 'end' : 'middle'} fill="#94a3b8" fontSize="11">{point.label}</text>}</g>)}
          </svg> : <div className="h-full flex items-center justify-center text-xs text-slate-400">Нет данных для построения графика. Добавьте записи в журнал заправок.</div>}
        </div>
      </div>

      {/* Main Fuel Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Калькулятор расхода топлива (по чеку / одометру)
            </h2>
          </div>
          <button
            onClick={() => {
              setDistance('400');
              setLiters('45');
              setFuelPrice('62.50');
            }}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Пройденное расстояние (км):
                </label>
                <div className="flex items-center gap-1">
                  {[250, 350, 420, 500].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDistance(val.toString())}
                      className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {val}км
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text" inputMode="decimal"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Например: 420"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Заправлено литров (л):
                </label>
                <div className="flex items-center gap-1">
                  {[30, 45, 50, 60].map((val) => (
                    <button
                      key={val}
                      onClick={() => setLiters(val.toString())}
                      className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {val}л
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text" inputMode="decimal"
                step="0.1"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder="Например: 48.5"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Цена за литр ({currencySymbol}):
                </label>
                <input
                  type="text" inputMode="decimal"
                  step="0.1"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="62.50"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Марка бензина:
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-red-500 transition"
                >
                  <option value="АИ-92">АИ-92 (допустим для 4G63/4G64)</option>
                  <option value="АИ-95">АИ-95 (рекомендованный оптимум)</option>
                  <option value="АИ-98">АИ-98 (для 4G63T Turbo и MIVEC)</option>
                  <option value="АИ-100">АИ-100</option>
                  <option value="Газ (ГБО)">Газ Пропан-Бутан (ГБО)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Рассчитанный средний расход
              </span>

              {stats ? (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-red-600 dark:text-red-500 font-mono tracking-tight">
                      {formatConsumption(stats.consumption)}
                    </span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      {consumptionUnit}
                    </span>
                  </div>

                  <div className={`text-xs font-semibold ${stats.verdictColor}`}>
                    {stats.verdict}
                  </div>

                  {/* VISUAL GAUGE SPECTRUM BAR */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>7.0 л (Трасса)</span>
                      <span>12.5 л (Норма 4WD)</span>
                      <span>18.0+ л (Ошибки)</span>
                    </div>

                    <div className="relative h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-inner flex">
                      <div className="w-[25%] bg-emerald-500 h-full" title="Трасса" />
                      <div className="w-[20%] bg-lime-500 h-full" title="Смешанный" />
                      <div className="w-[25%] bg-amber-500 h-full" title="Город 4WD" />
                      <div className="w-[15%] bg-orange-500 h-full" title="Пробки/Зима" />
                      <div className="w-[15%] bg-red-600 h-full" title="Неисправность" />
                    </div>

                    {/* Pointer Marker */}
                    <div className="relative h-4 w-full">
                      {(() => {
                        const val = parseFloat(stats.consumption);
                        const pct = Math.min(100, Math.max(0, ((val - 6.0) / 14.0) * 100));
                        return (
                          <div
                            className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                            style={{ left: `${pct}%` }}
                          >
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-slate-900 dark:border-b-white" />
                            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-1 rounded shadow-xs border border-slate-300 dark:border-slate-700">
                              {stats.consumption}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* VISUAL TANK GRAPHIC */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-red-500" />
                        Бак {vehicleLabel || 'автомобиля'} {tankCapacity ? `(${tankCapacity} л)` : '(объём не указан)'}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {tankCapacity ? `Запас ~${stats.tankRange} км` : 'Запас хода не рассчитан'}
                      </span>
                    </div>

                    {/* Tank Level Liquid Visualization */}
                    <div className="h-4 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-xs font-bold text-white font-mono"
                        style={{
                          width: `${Math.min(100, Math.max(20, (parseFloat(stats.tankRange) / 750) * 100))}%`
                        }}
                      >
                        {tankCapacity ? `${tankCapacity} л` : 'Объём неизвестен'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    {stats.costPerKm && (
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Стоимость 1 км пути:</span>
                        <strong className="text-slate-900 dark:text-white font-mono">{stats.costPerKm} {currencySymbol}/км</strong>
                      </div>
                    )}
                    {stats.costPer100Km && (
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Стоимость 100 км пути:</span>
                        <strong className="text-slate-900 dark:text-white font-mono">{stats.costPer100Km} {currencySymbol}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Введите расстояние и количество заправленных литров для мгновенного расчета
                </div>
              )}
            </div>

            {/* Keep factory benchmark values scoped to the exact model they describe. */}
            {activeModel?.id === 'outlander-1' ? <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-200 block">
                Ориентиры расхода для {vehicleLabel || 'выбранного автомобиля'}:
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-500 mb-0.5">
                    <span>Расход на трассе</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">7.6 – 12.5 л</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[62%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-0.5">
                    <span>2.4L 4G64 / 4G69 (АКПП)</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">8.0 – 13.8 л</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[69%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-0.5">
                    <span>2.0L Turbo 4G63T (Airtrek)</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">8.8 – 15.5 л</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full w-[78%]" />
                  </div>
                </div>
              </div>
            </div> : <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Заводские ориентиры для этой модификации пока не добавлены. Ведите журнал заправок для расчёта фактического расхода.</p>}
          </div>
        </div>
      </div>

      {/* Add Fuel Log Modal */}
      {isAddingLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                Новая запись о заправке
              </h3>
              <button
                onClick={() => setIsAddingLog(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Текущий одометр (км):
                </label>
                <input
                  type="text" inputMode="decimal"
                  value={newOdometer}
                  onChange={(e) => setNewOdometer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  placeholder="246250"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Пройдено (км):
                  </label>
                  <input
                    type="text" inputMode="decimal"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    placeholder="450"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Заправлено (л):
                  </label>
                  <input
                    type="text" inputMode="decimal"
                    step="0.1"
                    value={newLiters}
                    onChange={(e) => setNewLiters(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Цена литра ({currencySymbol}):
                  </label>
                  <input
                    type="text" inputMode="decimal"
                    step="0.1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    placeholder="62.50"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    АЗС / Бренд:
                  </label>
                  <input
                    type="text"
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    placeholder="Лукойл, Роснефть..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Топливо:
                </label>
                <select
                  value={newFuelType}
                  onChange={(e) => setNewFuelType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="АИ-92">АИ-92</option>
                  <option value="АИ-95">АИ-95</option>
                  <option value="АИ-98">АИ-98</option>
                  <option value="АИ-100">АИ-100</option>
                  <option value="Газ (ГБО)">Газ Пропан-Бутан</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingLog(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel Log History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            История заправок и чеков ({logs.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">Сохраняется локально</span>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Дата</th>
                  <th className="py-2.5 px-3">Пробег</th>
                  <th className="py-2.5 px-3">Дистанция</th>
                  <th className="py-2.5 px-3">Литры</th>
                  <th className="py-2.5 px-3">Расход</th>
                  <th className="py-2.5 px-3">Сумма</th>
                  <th className="py-2.5 px-3">АЗС / Топливо</th>
                  <th className="py-2.5 px-3 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-400">{log.date}</td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-bold">{log.odometer.toLocaleString()} км</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.distance} км</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{log.liters} л</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${
                        log.consumption <= 11.5
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : log.consumption <= 14.5
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatConsumption(log.consumption)} {consumptionUnit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-semibold">{log.totalCost.toFixed(0)} {currencySymbols[log.currency || 'RUB'] || '₽'}</td>
                    <td className="py-3 px-3 font-sans text-slate-500">
                      {log.station} ({log.fuelType})
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                        title="Удалить запись"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            Записей пока нет. Нажмите «Записать заправку», чтобы вести мониторинг расхода.
          </div>
        )}
      </div>

      {/* Model-specific repair guidance must only be shown for its source vehicle. */}
      {activeModel?.id === 'outlander-1' ? <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Возможные причины повышенного расхода топлива
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              1. Верхний кислородный датчик (Лямбда)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              «Уставшая» первая лямбда до катализатора медленно реагирует на обеднение смеси. ЭБУ перестраховывается и обогащает смесь, добавляя <strong>+2...3 л / 100 км</strong> без ошибок на приборной панели.
            </p>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Замена на Denso DOX-0313 или оригинал MN153010.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              2. Подклинивание тормозных суппортов
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Главная болезнь тормозов Outlander 1 — закисание направляющих пальцев суппортов. Колодка постоянно трет о диск, увеличивая сопротивление качению (до <strong>+1.5...2 л</strong>).
            </p>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Проверка наката, ремкомплект Seinsa D4554 и смазка TRW PFG110.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              3. Загрязнение ДМРВ и дроссельной заслонки
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Масляный налет на нитях ДМРВ (MD343605) и грязь вокруг дроссельной заслонки искажают расчет циклового наполнения воздуха на холостых и переходных режимах.
            </p>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Промывка датчика спецспреем Liqui Moly для ДМРВ (без касания кистью!).
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              4. Забитый катализатор (ошибки P0421/P0431)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              К 180–200 тыс. км керамические соты катколлектора оплавляются, создавая высокое противодавление на выпуске. Двигатель «душится», требуя сильнее жать на газ.
            </p>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Замена на пламегаситель из нержавейки + механическая обманка с миникатализатором.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              5. Давление в шинах и вылет дисков
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              При снижении давления в шинах 215/60 R16 с 2.1 до 1.7 бар сопротивление качению возрастает на 20%. Установка тяжелых колес 225/55 R18 также добавляет около 1 л.
            </p>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Держать штатное давление 2.1 – 2.2 бар (2.3 при полной загрузке).
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              6. Коррозия заливной горловины бака
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Специфическая проблема первого поколения: под пластиковым щитком труба горловины сгнивает до дыр. Пары бензина испаряются, а в бак попадает влага и песок.
            </p>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Осмотр горловины в арке заднего левого колеса, замена на MR512211.
            </div>
          </div>
        </div>
      </div> : <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-base font-bold text-slate-900 dark:text-white">Общие рекомендации по расходу топлива</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300"><li>Сравнивайте расход по нескольким заправкам, а не по одной поездке.</li><li>Проверяйте давление в шинах по табличке конкретного автомобиля.</li><li>При росте расхода считайте коды ошибок и топливные коррекции до замены деталей.</li><li>Сверяйте рекомендации по обслуживанию с руководством для вашей модификации.</li></ul></section>}
    </div>
  );
}

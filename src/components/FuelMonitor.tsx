import { useState, useMemo, useEffect } from 'react';
import { EngineType } from '../types';
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
  Car
} from 'lucide-react';

interface FuelLog {
  id: string;
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

const STORAGE_KEY = 'outlander1_fuel_logs_v1';

export default function FuelMonitor({ selectedEngine = 'ALL' }: { selectedEngine?: EngineType }) {
  // Calculator inputs
  const [distance, setDistance] = useState<string>('420');
  const [liters, setLiters] = useState<string>('48');
  const [fuelPrice, setFuelPrice] = useState<string>('62.50');
  const [fuelType, setFuelType] = useState<string>('АИ-95');

  // Logs state
  const [logs, setLogs] = useState<FuelLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: '1',
        date: '2026-03-28',
        odometer: 245300,
        distance: 430,
        liters: 49.5,
        pricePerLiter: 62.5,
        totalCost: 3093.75,
        consumption: 11.51,
        fuelType: 'АИ-95',
        station: 'Лукойл'
      },
      {
        id: '2',
        date: '2026-04-05',
        odometer: 245780,
        distance: 480,
        liters: 52.0,
        pricePerLiter: 63.1,
        totalCost: 3281.20,
        consumption: 10.83,
        fuelType: 'АИ-95',
        station: 'Газпромнефть'
      }
    ];
  });

  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newOdometer, setNewOdometer] = useState<string>('246250');
  const [newDistance, setNewDistance] = useState<string>('470');
  const [newLiters, setNewLiters] = useState<string>('51');
  const [newPrice, setNewPrice] = useState<string>('62.80');
  const [newStation, setNewStation] = useState<string>('Роснефть');
  const [newFuelType, setNewFuelType] = useState<string>('АИ-95');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // Main Calculator Computation
  const stats = useMemo(() => {
    const distNum = parseFloat(distance);
    const litNum = parseFloat(liters);
    const priceNum = parseFloat(fuelPrice);

    if (distNum > 0 && litNum > 0) {
      const consumption = (litNum / distNum) * 100;
      const costPerKm = priceNum > 0 ? (litNum * priceNum) / distNum : 0;
      const costPer100Km = costPerKm * 100;
      const tankRange = (60 / consumption) * 100; // 60L full tank Outlander 1

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
        verdict = 'Стандартный городской режим Outlander I';
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
  }, [distance, liters, fuelPrice]);

  // Overall Logs Statistics
  const overallStats = useMemo(() => {
    if (logs.length === 0) return null;
    const totalDist = logs.reduce((acc, l) => acc + l.distance, 0);
    const totalLiters = logs.reduce((acc, l) => acc + l.liters, 0);
    const totalSpent = logs.reduce((acc, l) => acc + l.totalCost, 0);
    const avgConsumption = totalDist > 0 ? (totalLiters / totalDist) * 100 : 0;

    return {
      totalDist,
      totalLiters: totalLiters.toFixed(1),
      totalSpent: totalSpent.toFixed(0),
      avgConsumption: avgConsumption.toFixed(2)
    };
  }, [logs]);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(newDistance);
    const litNum = parseFloat(newLiters);
    const priceNum = parseFloat(newPrice);
    const odoNum = parseFloat(newOdometer) || 0;

    if (distNum > 0 && litNum > 0) {
      const consumption = (litNum / distNum) * 100;
      const totalCost = (priceNum > 0 ? priceNum : 0) * litNum;

      const newEntry: FuelLog = {
        id: Date.now().toString(),
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
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Учёт и аналитика расхода топлива
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500">Бак 60 л (CU_W)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Fuel className="w-6 h-6 text-red-600" />
              Мониторинг топлива Outlander I
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Точный калькулятор среднего расхода (л/100км), оценка стоимости поездок, журнал заправок и диагностика повышенного аппетита
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setIsAddingLog(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Записать заправку</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip if logs exist */}
        {overallStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Средний расход по чекам</span>
              <div className="text-red-600 dark:text-red-400 font-mono font-black text-lg">
                {overallStats.avgConsumption} <span className="text-xs font-normal text-slate-500">л/100км</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Учтённый пробег</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                {overallStats.totalDist} <span className="text-xs font-normal text-slate-500">км</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Всего заправлено</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                {overallStats.totalLiters} <span className="text-xs font-normal text-slate-500">л</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Сумма расходов</span>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-lg">
                {overallStats.totalSpent} <span className="text-xs font-normal text-slate-500">₽</span>
              </div>
            </div>
          </div>
        )}
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
                  {[250, 350, 420, 500].map(val => (
                    <button
                      key={val}
                      onClick={() => setDistance(val.toString())}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {val}км
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                placeholder="Например: 420"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Заправлено топлива (литров):
                </label>
                <div className="flex items-center gap-1">
                  {[30, 40, 50, 60].map(val => (
                    <button
                      key={val}
                      onClick={() => setLiters(val.toString())}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {val}л
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                value={liters}
                onChange={e => setLiters(e.target.value)}
                placeholder="Например: 48"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Цена за литр (₽):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fuelPrice}
                  onChange={e => setFuelPrice(e.target.value)}
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
                  onChange={e => setFuelType(e.target.value)}
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
                      {stats.consumption}
                    </span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      л / 100 км
                    </span>
                  </div>

                  <div className={`text-xs font-semibold ${stats.verdictColor}`}>
                    {stats.verdict}
                  </div>

                  {/* VISUAL GAUGE SPECTRUM BAR */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
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
                        // Scale from 6.0L (0%) to 20.0L (100%)
                        const pct = Math.min(100, Math.max(0, ((val - 6.0) / 14.0) * 100));
                        return (
                          <div
                            className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                            style={{ left: `${pct}%` }}
                          >
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-slate-900 dark:border-b-white" />
                            <span className="text-[9px] font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-1 rounded shadow-xs border border-slate-300 dark:border-slate-700">
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
                        Бак Outlander 1 (60 л)
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Запас ~{stats.tankRange} км
                      </span>
                    </div>

                    {/* Tank Level Liquid Visualization */}
                    <div className="h-4 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-[9px] font-bold text-white font-mono"
                        style={{
                          width: `${Math.min(100, Math.max(20, (parseFloat(stats.tankRange) / 750) * 100))}%`
                        }}
                      >
                        60L Full
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    {stats.costPerKm && (
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Стоимость 1 км пути:</span>
                        <strong className="text-slate-900 dark:text-white font-mono">{stats.costPerKm} ₽/км</strong>
                      </div>
                    )}
                    {stats.costPer100Km && (
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Стоимость 100 км пути:</span>
                        <strong className="text-slate-900 dark:text-white font-mono">{stats.costPer100Km} ₽</strong>
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

            {/* Benchmark Comparison Bars */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-200 block">
                Заводские ориентиры Outlander I (город / трасса):
              </span>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div>
                  <div className="flex justify-between text-slate-500 mb-0.5">
                    <span>2.0L 4G63 (МКПП/АКПП)</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Add Fuel Log Modal / Form */}
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
                  type="number"
                  value={newOdometer}
                  onChange={e => setNewOdometer(e.target.value)}
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
                    type="number"
                    value={newDistance}
                    onChange={e => setNewDistance(e.target.value)}
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
                    type="number"
                    step="0.1"
                    value={newLiters}
                    onChange={e => setNewLiters(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Цена литра (₽):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
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
                    onChange={e => setNewStation(e.target.value)}
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
                  onChange={e => setNewFuelType(e.target.value)}
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
            История заправок и динамика расхода ({logs.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">Сохраняется локально</span>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
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
                        {log.consumption} л/100км
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-semibold">{log.totalCost.toFixed(0)} ₽</td>
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

      {/* Guide: Why Does Outlander 1 Consume Fuel & How to Reduce It */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Причины повышенного расхода топлива на Outlander I и методы решения
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              1. Верхний кислородный датчик (Лямбда)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              «Уставшая» первая лямбда до катализатора медленно реагирует на обеднение смеси. ЭБУ перестраховывается и обогащает смесь, добавляя <strong>+2...3 л / 100 км</strong> без ошибок на приборной панели.
            </p>
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Замена на Denso DOX-0313 или оригинал MN153010.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              2. Подклинивание тормозных суппортов
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Главная болезнь тормозов Outlander 1 — закисание направляющих пальцев суппортов. Колодка постоянно трет о диск, увеличивая сопротивление качению (до <strong>+1.5...2 л</strong>).
            </p>
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Проверка наката, ремкомплект Seinsa D4554 и смазка TRW PFG110.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              3. Загрязнение ДМРВ и дроссельной заслонки
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Масляный налет на нитях ДМРВ (MD343605) и грязь вокруг дроссельной заслонки искажают расчет циклового наполнения воздуха на холостых и переходных режимах.
            </p>
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Промывка датчика спецспреем Liqui Moly для ДМРВ (без касания кистью!).
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              4. Забитый катализатор (ошибки P0421/P0431)
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              К 180–200 тыс. км керамические соты катколлектора оплавляются, создавая высокое противодавление на выпуске. Двигатель «душится», требуя сильнее жать на газ.
            </p>
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Замена на пламегаситель из нержавейки + механическая обманка с миникатализатором.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              5. Давление в шинах и вылет дисков
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              При снижении давления в шинах 215/60 R16 с 2.1 до 1.7 бар сопротивление качению возрастает на 20%. Установка тяжелых колес 225/55 R18 также добавляет около 1 л.
            </p>
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Держать штатное давление 2.1 – 2.2 бар (2.3 при полной загрузке).
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              6. Коррозия заливной горловины бака
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Специфическая проблема первого поколения: под пластиковым щитком труба горловины сгнивает до дыр. Пары бензина испаряются, а в бак попадает влага и песок.
            </p>
            <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold pt-1">
              Решение: Осмотр горловины в арке заднего левого колеса, замена на MR512211.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

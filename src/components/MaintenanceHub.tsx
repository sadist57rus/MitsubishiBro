import { useState, useMemo } from 'react';
import { FLUIDS_DATA, TORQUE_SPECS_DATA, MAINTENANCE_SCHEDULE_TEMPLATE } from '../data/maintenanceData';
import { Droplet, Gauge, Calendar, CheckCircle2, AlertTriangle, Search, Info, Fuel, Calculator, RotateCcw, Sparkles } from 'lucide-react';

export default function MaintenanceHub() {
  const [currentMileage, setCurrentMileage] = useState<number>(180000);
  const [torqueSearch, setTorqueSearch] = useState('');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Fuel consumption calculator state
  const [distanceKm, setDistanceKm] = useState<string>('420');
  const [fuelLiters, setFuelLiters] = useState<string>('48');
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<string>('58.5');

  const fuelCalc = useMemo(() => {
    const dist = parseFloat(distanceKm);
    const liters = parseFloat(fuelLiters);
    const price = parseFloat(fuelPricePerLiter);

    if (isNaN(dist) || isNaN(liters) || dist <= 0 || liters <= 0) {
      return null;
    }

    const consumptionPer100Km = (liters / dist) * 100;
    const costTotal = !isNaN(price) && price > 0 ? liters * price : null;
    const costPerKm = costTotal !== null ? costTotal / dist : null;
    // Outlander 1 fuel tank capacity is 60 liters
    const estimatedFullTankRangeKm = (60 / consumptionPer100Km) * 100;

    let verdict: { status: 'excellent' | 'normal' | 'high' | 'critical'; label: string; comment: string };

    if (consumptionPer100Km < 8.8) {
      verdict = {
        status: 'excellent',
        label: 'Отличный экономичный расход (трасса)',
        comment: 'Показатели идеальны для загородного режима и исправной топливной системы.'
      };
    } else if (consumptionPer100Km <= 11.5) {
      verdict = {
        status: 'excellent',
        label: 'Оптимальный смешанный цикл',
        comment: 'Штатный норматив завода для Outlander 1 2.0 / 2.4 4WD в смешанном цикле.'
      };
    } else if (consumptionPer100Km <= 14.5) {
      verdict = {
        status: 'normal',
        label: 'Нормальный городской режим',
        comment: 'Обычный расход для плотного городского трафика, прогревов и кондиционера.'
      };
    } else if (consumptionPer100Km <= 17.5) {
      verdict = {
        status: 'high',
        label: 'Умеренно повышенный расход',
        comment: 'Типично для зимних прогревов, коротких поездок или активной езды на Turbo-версиях.'
      };
    } else {
      verdict = {
        status: 'critical',
        label: 'Аномально высокий расход!',
        comment: 'Рекомендуется проверить: 1) Верхний лямбда-зонд (ошибка P0135/P0171); 2) Зазоры и свечи зажигания; 3) Давление в шинах (норма 2.1-2.2 bar); 4) Подсос воздуха в дросселе; 5) Закисание направляющих задних суппортов.'
      };
    }

    return {
      consumption: +consumptionPer100Km.toFixed(2),
      costTotal: costTotal !== null ? +costTotal.toFixed(0) : null,
      costPerKm: costPerKm !== null ? +costPerKm.toFixed(2) : null,
      rangeOn60L: +estimatedFullTankRangeKm.toFixed(0),
      verdict
    };
  }, [distanceKm, fuelLiters, fuelPricePerLiter]);

  const toggleComplete = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTorque = TORQUE_SPECS_DATA.filter(t =>
    t.item.toLowerCase().includes(torqueSearch.toLowerCase()) ||
    t.notes.toLowerCase().includes(torqueSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner with Mileage Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              Регламент ТО и калькулятор обслуживания
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Введите ваш текущий одометр, чтобы увидеть регламентные работы и состояние жидкостей
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium">Пробег авто:</span>
            <input
              type="number"
              value={currentMileage}
              onChange={(e) => setCurrentMileage(Math.max(0, Number(e.target.value)))}
              step="5000"
              className="w-28 bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm px-2.5 py-1 rounded focus:border-red-500 outline-none text-right"
            />
            <span className="text-xs text-slate-400 font-mono">км</span>
          </div>
        </div>

        {/* Schedule Checklist Based on Current Mileage */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">
              План регламентного обслуживания:
            </span>
            <span className="text-slate-500">
              Выполнено: {Object.values(completedItems).filter(Boolean).length} из {MAINTENANCE_SCHEDULE_TEMPLATE.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MAINTENANCE_SCHEDULE_TEMPLATE.map((item) => {
              const isChecked = !!completedItems[item.id];
              const isDueSoon = currentMileage % item.frequencyKm < 2000;
              const nextDueKm = Math.ceil(currentMileage / item.frequencyKm) * item.frequencyKm;

              return (
                <div
                  key={item.id}
                  onClick={() => toggleComplete(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-start justify-between gap-3 ${
                    isChecked
                      ? 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      : isDueSoon
                      ? 'bg-amber-950/20 border-amber-800/60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      <CheckCircle2
                        className={`w-4 h-4 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`}
                      />
                    </div>
                    <div>
                      <span className={`text-xs font-semibold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.system} · Каждые <strong className="font-mono text-slate-400">{item.frequencyKm.toLocaleString()} км</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block">Следующее ТО</span>
                    <span className={`text-xs font-mono font-bold ${isDueSoon ? 'text-amber-400' : 'text-slate-300'}`}>
                      {nextDueKm.toLocaleString()} км
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fuel Consumption Calculator Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Fuel className="w-5 h-5 text-red-500" />
              Калькулятор расхода топлива Outlander I
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Расчет фактического среднего расхода (л/100 км), стоимости километра и оценка по заводским нормативам
            </p>
          </div>

          <button
            onClick={() => {
              setDistanceKm('400');
              setFuelLiters('45');
              setFuelPricePerLiter('58.5');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 rounded-lg border border-slate-800 transition self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить значения</span>
          </button>
        </div>

        {/* Inputs and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Пройденное расстояние (по одометру Trip):
                </label>
                <div className="flex gap-1 text-[10px]">
                  {['300', '420', '500'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDistanceKm(d)}
                      className={`px-1.5 py-0.5 rounded font-mono transition ${distanceKm === d ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                    >
                      {d} км
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  placeholder="Например: 420"
                  step="any"
                  min="1"
                  className="w-full bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded-lg px-3 py-2 pr-12 focus:border-red-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                  км
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Количество заправленного бензина:
                </label>
                <div className="flex gap-1 text-[10px]">
                  {['35', '45', '55'].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFuelLiters(l)}
                      className={`px-1.5 py-0.5 rounded font-mono transition ${fuelLiters === l ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                    >
                      {l} л
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={fuelLiters}
                  onChange={(e) => setFuelLiters(e.target.value)}
                  placeholder="Например: 48"
                  step="any"
                  min="0.1"
                  className="w-full bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded-lg px-3 py-2 pr-12 focus:border-red-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                  литров
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Совет: для максимальной точности заправляйте «до отсечки» пистолета на одной АЗС
              </span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Цена 1 литра топлива (опционально):
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={fuelPricePerLiter}
                  onChange={(e) => setFuelPricePerLiter(e.target.value)}
                  placeholder="58.5"
                  step="any"
                  min="0"
                  className="w-full bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm rounded-lg px-3 py-2 pr-12 focus:border-red-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                  ₽ / л
                </span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {fuelCalc ? (
              <div className="space-y-4">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-red-950/80 ring-1 ring-red-500/20 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Средний расход
                    </span>
                    <div className="my-1.5">
                      <span className="text-3xl font-black font-mono text-white">
                        {fuelCalc.consumption}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-red-400">
                      литров на 100 км
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Стоимость 1 км
                    </span>
                    <div className="my-1.5">
                      <span className="text-2xl font-black font-mono text-emerald-400">
                        {fuelCalc.costPerKm !== null ? `${fuelCalc.costPerKm} ₽` : '—'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {fuelCalc.costTotal !== null ? `Всего: ${fuelCalc.costTotal.toLocaleString('ru-RU')} ₽` : 'Укажите цену топлива'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Запас на баке 60 л
                    </span>
                    <div className="my-1.5">
                      <span className="text-2xl font-black font-mono text-amber-400">
                        ~{fuelCalc.rangeOn60L}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      километров пути
                    </span>
                  </div>
                </div>

                {/* Evaluation Alert Box */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  fuelCalc.verdict.status === 'excellent'
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : fuelCalc.verdict.status === 'normal'
                    ? 'bg-blue-950/30 border-blue-800/60 text-blue-200'
                    : fuelCalc.verdict.status === 'high'
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : 'bg-red-950/40 border-red-800/70 text-red-200'
                }`}>
                  {fuelCalc.verdict.status === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-sm block">
                      {fuelCalc.verdict.label}
                    </span>
                    <p className="text-xs mt-1 leading-relaxed text-slate-300">
                      {fuelCalc.verdict.comment}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full">
                <Calculator className="w-8 h-8 text-slate-600 mb-2" />
                <span>Введите пройденный километраж и количество литров для автоматического расчета.</span>
              </div>
            )}

            {/* Passport Consumption Reference Table */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Заводские нормы расхода Outlander 1 (паспортные данные):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] font-sans text-slate-500 block">2.0 4G63 (МКПП)</span>
                  <span className="text-slate-200 font-semibold">7.4 – 11.2 л</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] font-sans text-slate-500 block">2.4 4G64/69 (АКПП)</span>
                  <span className="text-slate-200 font-semibold">8.4 – 13.8 л</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] font-sans text-slate-500 block">Зима / Пробки</span>
                  <span className="text-amber-400 font-semibold">13.5 – 16.0 л</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] font-sans text-slate-500 block">2.0 Turbo (4G63T)</span>
                  <span className="text-red-400 font-semibold">10.5 – 17.5 л</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fluids and Capacities Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-500" />
            Заправочные объемы и спецификации технических жидкостей
          </h3>
          <p className="text-xs text-slate-400">
            Точные требования завода к маслам, антифризу и смазкам для Outlander I (CU)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLUIDS_DATA.map((fluid, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{fluid.name}</h4>
                    <span className="text-xs text-red-400 font-mono font-medium block mt-0.5">
                      {fluid.volume}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                    {fluid.changeInterval}
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Спецификация и допуск:</span>
                    <span className="text-slate-200 font-medium leading-relaxed block mt-0.5">{fluid.specification}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Проверенные бренды:</span>
                    <span className="text-slate-300 block mt-0.5">{fluid.recommendedBrands}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-amber-300 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{fluid.proTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Torque Specs Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              Шпаргалка моментов затяжки резьбовых соединений
            </h3>
            <p className="text-xs text-slate-400">
              Значения в Н·м (Ньютон-метр) по заводскому сервисному руководству Mitsubishi Workshop Manual
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={torqueSearch}
              onChange={(e) => setTorqueSearch(e.target.value)}
              placeholder="Поиск узла (колеса, свечи)..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg pl-9 pr-3 py-1.5 focus:border-red-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Узел / Соединение</th>
                <th className="py-2.5 px-3 font-medium">Момент (Н·м)</th>
                <th className="py-2.5 px-3 font-medium">Примечание мастера</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTorque.map((t, i) => (
                <tr key={i} className="text-slate-300 hover:bg-slate-950/40">
                  <td className="py-2.5 px-3 text-white font-sans font-medium">{t.item}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{t.value}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

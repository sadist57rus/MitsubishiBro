import { useState } from 'react';
import { MapPin, Zap, ShieldCheck, Info, Check, Wrench, Smartphone } from 'lucide-react';

export default function ObdPortLocationGraphic() {
  const [selectedPin, setSelectedPin] = useState<number | null>(7);

  const pins = [
    { pin: 1, name: 'ABS / TCS Test', desc: 'Линия самодиагностики ABS (замыкание на массу запускает мигание лампы ABS)', color: 'text-amber-500' },
    { pin: 4, name: 'Chassis Ground', desc: 'Масса кузова автомобиля (минус питания)', color: 'text-slate-400' },
    { pin: 5, name: 'Signal Ground', desc: 'Сигнальная масса датчиков ЭБУ', color: 'text-slate-400' },
    { pin: 7, name: 'ISO 9141-2 / KWP2000 K-Line', desc: 'Основная цифровая K-линия обмена данными с ЭБУ двигателя и коробки АКПП W4A42', color: 'text-red-500', important: true },
    { pin: 9, name: 'Vehicle Speed / ETACS', desc: 'Импульсы скорости от датчика VSS и диагностика блока салонной электрики ETACS', color: 'text-blue-500' },
    { pin: 16, name: '+12V Battery Power', desc: 'Постоянное питание сканера от АКБ через предохранитель F13 (10A) в салоне', color: 'text-emerald-500', important: true },
  ];

  const activePinInfo = pins.find(p => p.pin === selectedPin);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Локализация в автомобиле
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            Где находится диагностический разъём OBD-II в Outlander I
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Схема расположения под рулевой колонкой, распиновка 16-контактного разъема DLC и предохранитель питания
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono shrink-0">
          Протокол: <strong>ISO 9141-2 / K-Line</strong>
        </div>
      </div>

      {/* Main Visual: Cockpit Graphic + Pinout Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Driver Footwell Visual Schematic (SVG) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#070b12] rounded-xl border border-slate-200 dark:border-slate-850 p-4 sm:p-5 shadow-inner overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Схема водительского места (под торпедо)
            </span>
            <span className="text-[10px] text-red-600 dark:text-red-400 font-mono font-bold bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded">
              Разъем DLC направлен вниз
            </span>
          </div>

          <svg viewBox="0 0 520 320" className="w-full h-auto select-none">
            {/* Dashboard Lower Trim Outline */}
            <path
              d="M 30 50 
                 L 490 50 
                 L 490 140 
                 L 350 140 
                 L 350 280 
                 L 30 280 Z"
              fill="#1e293b"
              fillOpacity="0.25"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Center Console side (Right) */}
            <rect x="350" y="80" width="140" height="200" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="420" y="115" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="bold">Центральная</text>
            <text x="420" y="130" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="bold">консоль (АКПП)</text>

            {/* Gear Shifter */}
            <rect x="405" y="150" width="30" height="70" rx="6" fill="#1e293b" stroke="#dc2626" />
            <circle cx="420" cy="165" r="12" fill="#dc2626" />
            <text x="420" y="200" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" fontFamily="monospace">P R N D</text>

            {/* Steering Wheel Column (Center-Left) */}
            <g transform="translate(160, 40)">
              <rect x="-35" y="0" width="70" height="90" rx="8" fill="#334155" stroke="#475569" strokeWidth="2" />
              {/* Steering Wheel circle */}
              <circle cx="0" cy="20" r="55" fill="none" stroke="#64748b" strokeWidth="8" />
              <circle cx="0" cy="20" r="16" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />
              <text x="0" y="90" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontFamily="monospace">Рулевая колонка</text>
            </g>

            {/* Coin pocket / Fuse Box Door (Left) */}
            <rect x="45" y="90" width="65" height="50" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
            <text x="77" y="112" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="bold">Монетница</text>
            <text x="77" y="125" textAnchor="middle" fontSize="8" fill="#fef3c7">(Блок предохр.)</text>

            {/* Pedals (Bottom) */}
            {/* Brake pedal */}
            <rect x="155" y="220" width="35" height="45" rx="5" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <text x="172" y="247" textAnchor="middle" fontSize="9" fill="#cbd5e1">Тормоз</text>
            {/* Gas pedal */}
            <rect x="235" y="210" width="22" height="55" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <text x="246" y="242" textAnchor="middle" fontSize="9" fill="#cbd5e1">Газ</text>

            {/* EXACT OBD-II CONNECTOR LOCATION (Right of steering column under dash edge) */}
            <g transform="translate(260, 130)">
              {/* Pulsing Target Ring */}
              <circle cx="0" cy="0" r="28" fill="#ef4444" fillOpacity="0.15" className="animate-ping" />
              <circle cx="0" cy="0" r="20" fill="#ef4444" fillOpacity="0.3" />
              
              {/* Connector Body */}
              <polygon points="-18,-8 18,-8 14,14 -14,14" fill="#0f172a" stroke="#ef4444" strokeWidth="3" />
              <circle cx="0" cy="3" r="3" fill="#ffffff" />

              {/* Callout Pointer line */}
              <line x1="0" y1="0" x2="45" y2="-40" stroke="#ef4444" strokeWidth="2" />
              <line x1="45" y1="-40" x2="160" y2="-40" stroke="#ef4444" strokeWidth="2" />
              
              {/* Callout box */}
              <rect x="45" y="-62" width="165" height="36" rx="6" fill="#dc2626" />
              <text x="127" y="-47" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff" fontFamily="monospace">
                РАЗЪЁМ OBD-II
              </text>
              <text x="127" y="-33" textAnchor="middle" fontSize="9" fill="#fecaca">
                Справа от руля внизу
              </text>
            </g>

            {/* Instruction Callout at bottom */}
            <text x="180" y="305" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">
              * Загляните снизу под правый край рулевой колонки
            </text>
          </svg>
        </div>

        {/* Right: OBD-II 16-Pin DLC Connector Pinout */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-red-600" />
              Распиновка 16-контактного разъема DLC
            </span>
            <span className="text-[10px] font-mono text-slate-400">J1962</span>
          </div>

          {/* Trapezoid 16-Pin Visual Graphic */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            {/* Top row: Pins 1 to 8 */}
            <div className="flex gap-1 mb-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPin(p)}
                  className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center transition border ${
                    selectedPin === p
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : p === 7 || p === 16
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900'
                      : p === 4 || p === 5
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                  title={`Контакт ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Bottom row: Pins 9 to 16 */}
            <div className="flex gap-1">
              {[9, 10, 11, 12, 13, 14, 15, 16].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPin(p)}
                  className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center transition border ${
                    selectedPin === p
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : p === 16 || p === 7
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900'
                      : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                  title={`Контакт ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-slate-400 mt-2 font-mono">
              Трапеция (широкая сторона сверху)
            </span>
          </div>

          {/* Active Pin Info Card */}
          {activePinInfo ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-red-600 text-white font-mono text-[11px] flex items-center justify-center font-bold">
                    {activePinInfo.pin}
                  </span>
                  <span>{activePinInfo.name}</span>
                </span>
                {activePinInfo.important && (
                  <span className="text-[9px] font-mono font-bold text-red-600 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                    Ключевой
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {activePinInfo.desc}
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-400 p-3 text-center">
              Контакт не задействован в заводском протоколе Outlander I
            </div>
          )}

          {/* Power Fuse Pro-Tip */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Сканер не светится и нет питания?</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">
              Питание +12V на 16-й контакт подается через <strong>предохранитель F13 (10A)</strong> в салонном блоке (за монетницей слева от руля). Замените F13!
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Adapters & Software Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-red-500" />
            ELM327 Bluetooth / Wi-Fi:
          </span>
          <p className="text-slate-500 text-[11px] leading-snug">
            СТРОГО версия <strong>1.5</strong> на оригинальном чипе <strong>PIC18F25K80</strong>. Урезанные версии 2.1 НЕ читают протокол K-Line Outlander I!
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-red-500" />
            Дилерское оборудование:
          </span>
          <p className="text-slate-500 text-[11px] leading-snug">
            <strong>OpenPort 2.0</strong> (прошивка, чтение логов в EvoScan) и дилерский комплекс <strong>Mitsubishi MUT-III</strong> (чтение всех блоков, ABS, SRS, АКПП).
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            Программы для смартфона:
          </span>
          <p className="text-slate-500 text-[11px] leading-snug">
            <strong>Car Scanner ELM OBD2</strong> (профиль Mitsubishi), <strong>NMPS Reader</strong> (чтение АКПП W4A42 и температуры масла), <strong>Torque Pro</strong> с плагином MUT.
          </p>
        </div>
      </div>
    </div>
  );
}

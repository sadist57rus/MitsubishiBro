import { useState } from 'react';
import { FACTORY_SPECS, ALTERNATIVE_TIRES, OEM_WHEELS_GALLERY, calculateTire } from '../data/wheelsData';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Disc, Compass, Gauge, Copy, Check } from 'lucide-react';

export default function TireWheelCalculator() {
  // Current tire
  const [oldWidth, setOldWidth] = useState(215);
  const [oldAspect, setOldAspect] = useState(60);
  const [oldRim, setOldRim] = useState(16);
  const [oldEt, setOldEt] = useState(46);
  const [oldRimWidth, setOldRimWidth] = useState(6.5);

  // New tire
  const [newWidth, setNewWidth] = useState(215);
  const [newAspect, setNewAspect] = useState(65);
  const [newRim, setNewRim] = useState(16);
  const [newEt, setNewEt] = useState(46);
  const [newRimWidth, setNewRimWidth] = useState(6.5);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const oldCalc = calculateTire(oldWidth, oldAspect, oldRim);
  const newCalc = calculateTire(newWidth, newAspect, newRim);

  const diameterDiff = +(newCalc.totalDiameterMm - oldCalc.totalDiameterMm).toFixed(1);
  const clearanceDiff = +(diameterDiff / 2).toFixed(1);
  const speedoDiffPercent = +(((newCalc.totalDiameterMm / oldCalc.totalDiameterMm) - 1) * 100).toFixed(2);
  const widthDiff = newWidth - oldWidth;

  // Strut clearance calculation (ET + rim width influence)
  // Positive ET difference moves wheel inward towards strut
  const etDiff = newEt - oldEt;
  const innerRimShiftMm = +((newRimWidth - oldRimWidth) * 12.7 + etDiff).toFixed(1);
  const outerRimShiftMm = +((newRimWidth - oldRimWidth) * 12.7 - etDiff).toFixed(1);

  // Outlander 1 specific clearance check:
  // Stock tire 215/60 R16 diameter is ~664 mm. Max tire diameter on stock strut is ~708 mm (215/70 R16).
  // Distance to spring cup on stock front strut is ~25 mm with 215/60 R16.
  const clearanceToSpringCupMm = Math.max(0, +(25 - clearanceDiff).toFixed(1));

  let safetyStatus: 'safe' | 'caution' | 'danger' = 'safe';
  let safetyMessage = 'Размер безопасен, полностью совместим со штатной подвеской и арками Outlander 1.';

  if (newCalc.totalDiameterMm > 710) {
    safetyStatus = 'danger';
    safetyMessage = 'Критический диаметр! Колесо будет цеплять нижнюю чашку передней стойки амортизатора и тереть подкрылок при вывороте руля.';
  } else if (newCalc.totalDiameterMm > 695) {
    safetyStatus = 'caution';
    safetyMessage = 'Предельный размер! До чашки амортизатора остается менее 8-10 мм. Требуется исправная подвеска без просевших пружин.';
  } else if (newEt < 35) {
    safetyStatus = 'caution';
    safetyMessage = 'Слишком маленький вылет (ET < 35) выдвигает колесо наружу: повышенная нагрузка на ступичные подшипники и заброс грязи на борта.';
  }

  const applyPreset = (width: number, aspect: number, rim: number, rimW: number, et: number) => {
    setNewWidth(width);
    setNewAspect(aspect);
    setNewRim(rim);
    setNewRimWidth(rimW);
    setNewEt(et);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Factory Bolt Pattern */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h2 className="text-xl font-bold text-white tracking-wide">Параметры колес Mitsubishi Outlander I (CU)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Официальные заводские спецификации дисков и ступицы</p>
          </div>
          <button
            onClick={() => handleCopy('5x114.3 DIA 67.1 ET46 M12x1.5')}
            className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition"
          >
            {copiedText === '5x114.3 DIA 67.1 ET46 M12x1.5' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>Скопировать формулу: <strong className="font-mono text-amber-400">5x114.3 DIA 67.1 ET46</strong></span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Разболтовка (PCD)</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">5 x 114.3</span>
            <span className="text-[10px] text-slate-500">5 отверстий на 114.3 мм</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Ступица (DIA / ЦО)</span>
            <span className="text-base font-bold font-mono text-red-400 mt-0.5 block">67.1 мм</span>
            <span className="text-[10px] text-slate-500">При большем нужны кольца</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Штатный вылет (ET)</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">46 мм</span>
            <span className="text-[10px] text-slate-500">Допустимо: 38 – 46 мм</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Крепеж гайки</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">M12 x 1.5</span>
            <span className="text-[10px] text-slate-500">Конус 60° или пресс-шайба</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Момент затяжки</span>
            <span className="text-base font-bold font-mono text-amber-400 mt-0.5 block">98–118 Н·м</span>
            <span className="text-[10px] text-slate-500">10 – 12 кгс·м динамометром</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Штатное давление</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">2.1 – 2.2 bar</span>
            <span className="text-[10px] text-slate-500">Перед: 2.1, Зад: 2.1 (на R16)</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Tire & Wheel Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-red-500" />
              Интерактивный шинный калькулятор для Outlander 1
            </h3>
            <p className="text-xs text-slate-400">
              Сравнение размеров с расчетом клиренса, зазоров до чашки стойки амортизатора и погрешности спидометра
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Быстрые пресеты:</span>
            <button
              onClick={() => applyPreset(215, 60, 16, 6.5, 46)}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              215/60 R16 (Сток)
            </button>
            <button
              onClick={() => applyPreset(215, 65, 16, 6.5, 46)}
              className="px-2.5 py-1 text-xs rounded bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition font-medium"
            >
              215/65 R16 (Топ выбор)
            </button>
            <button
              onClick={() => applyPreset(215, 70, 16, 6.5, 46)}
              className="px-2.5 py-1 text-xs rounded bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 transition font-medium"
            >
              215/70 R16 (Лифт)
            </button>
            <button
              onClick={() => applyPreset(225, 55, 17, 7.0, 46)}
              className="px-2.5 py-1 text-xs rounded bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 transition font-medium"
            >
              225/55 R17 (Turbo)
            </button>
          </div>
        </div>

        {/* Sliders / Inputs Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current / Reference Wheel */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Штатный / Текущий размер</span>
              <span className="text-sm font-bold font-mono text-slate-200 bg-slate-800 px-2 py-0.5 rounded">
                {oldWidth}/{oldAspect} R{oldRim} · {oldRimWidth}J ET{oldEt}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ширина (мм)</label>
                <select
                  value={oldWidth}
                  onChange={(e) => setOldWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[205, 215, 225, 235, 245].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Профиль (%)</label>
                <select
                  value={oldAspect}
                  onChange={(e) => setOldAspect(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[45, 50, 55, 60, 65, 70, 75].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Диаметр (R")</label>
                <select
                  value={oldRim}
                  onChange={(e) => setOldRim(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[15, 16, 17, 18, 19].map(r => <option key={r} value={r}>R{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ширина диска (J)</label>
                <select
                  value={oldRimWidth}
                  onChange={(e) => setOldRimWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[6.0, 6.5, 7.0, 7.5, 8.0].map(j => <option key={j} value={j}>{j}J</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Вылет (ET, мм)</label>
                <input
                  type="number"
                  value={oldEt}
                  onChange={(e) => setOldEt(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                  min="25"
                  max="55"
                />
              </div>
            </div>

            {/* Calculations readout */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Внешний диаметр колеса:</span>
                <span className="font-mono font-semibold text-slate-200">{oldCalc.totalDiameterMm.toFixed(1)} мм</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Высота профиля шины:</span>
                <span className="font-mono text-slate-300">{oldCalc.sidewallMm.toFixed(1)} мм</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Длина окружности:</span>
                <span className="font-mono text-slate-300">{oldCalc.circumferenceMm.toFixed(0)} мм</span>
              </div>
            </div>
          </div>

          {/* New / Desired Wheel */}
          <div className="bg-slate-950/60 border border-red-950/60 rounded-xl p-4 ring-1 ring-red-500/20">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Новый расчетный размер</span>
              <span className="text-sm font-bold font-mono text-red-300 bg-red-950/50 px-2 py-0.5 rounded border border-red-800/40">
                {newWidth}/{newAspect} R{newRim} · {newRimWidth}J ET{newEt}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ширина (мм)</label>
                <select
                  value={newWidth}
                  onChange={(e) => setNewWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[205, 215, 225, 235, 245, 255].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Профиль (%)</label>
                <select
                  value={newAspect}
                  onChange={(e) => setNewAspect(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[40, 45, 50, 55, 60, 65, 70, 75].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Диаметр (R")</label>
                <select
                  value={newRim}
                  onChange={(e) => setNewRim(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[15, 16, 17, 18, 19].map(r => <option key={r} value={r}>R{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Ширина диска (J)</label>
                <select
                  value={newRimWidth}
                  onChange={(e) => setNewRimWidth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                >
                  {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map(j => <option key={j} value={j}>{j}J</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Вылет (ET, мм)</label>
                <input
                  type="number"
                  value={newEt}
                  onChange={(e) => setNewEt(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:border-red-500 outline-none"
                  min="20"
                  max="55"
                />
              </div>
            </div>

            {/* Calculations readout */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Внешний диаметр колеса:</span>
                <span className="font-mono font-semibold text-white">{newCalc.totalDiameterMm.toFixed(1)} мм</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Высота профиля шины:</span>
                <span className="font-mono text-slate-300">{newCalc.sidewallMm.toFixed(1)} мм</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Длина окружности:</span>
                <span className="font-mono text-slate-300">{newCalc.circumferenceMm.toFixed(0)} мм</span>
              </div>
            </div>
          </div>
        </div>

        {/* VISUAL SVG WHEEL & STRUT CLEARANCE DIAGRAM */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Disc className="w-4 h-4 text-red-500" />
              Визуальное сравнение профилей колес и зазора до стойки
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Масштабированный чертёж 1:1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Wheel Comparison Graphic */}
            <div className="md:col-span-8 flex justify-center py-2 overflow-x-auto">
              <svg viewBox="0 0 520 280" className="w-full max-w-lg h-auto">
                <defs>
                  <linearGradient id="tireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Road surface */}
                <line x1="20" y1="260" x2="500" y2="260" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                <text x="500" y="255" textAnchor="end" fontSize="10" fill="#64748b" fontFamily="monospace">Дорога</text>

                {/* Stock Wheel: 215/60 R16 */}
                <g transform="translate(130, 150)">
                  {/* Outer Tire */}
                  <circle cx="0" cy="0" r="100" fill="url(#tireGrad)" stroke="#64748b" strokeWidth="3" />
                  {/* Rim */}
                  <circle cx="0" cy="0" r="62" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  {/* Hub 5x114.3 */}
                  <circle cx="0" cy="0" r="14" fill="#dc2626" />
                  <text x="0" y="4" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold">67.1</text>
                  <text x="0" y="125" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="bold">
                    Штат: {oldWidth}/{oldAspect} R{oldRim}
                  </text>
                  <text x="0" y="140" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
                    Ø {oldCalc.totalDiameterMm.toFixed(0)} мм
                  </text>
                </g>

                {/* New Wheel: with dynamic radius ratio */}
                {(() => {
                  const scaleRatio = newCalc.totalDiameterMm / oldCalc.totalDiameterMm;
                  const newRadius = 100 * scaleRatio;
                  const newRimRadius = 62 * (newRim / oldRim);

                  return (
                    <g transform="translate(370, 150)">
                      {/* Outer Tire */}
                      <circle
                        cx="0"
                        cy="0"
                        r={newRadius}
                        fill="url(#tireGrad)"
                        stroke={safetyStatus === 'safe' ? '#10b981' : safetyStatus === 'caution' ? '#f59e0b' : '#ef4444'}
                        strokeWidth="3.5"
                      />
                      {/* Rim */}
                      <circle cx="0" cy="0" r={newRimRadius} fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                      {/* Hub 5x114.3 */}
                      <circle cx="0" cy="0" r="14" fill="#dc2626" />
                      <text x="0" y="4" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold">67.1</text>
                      <text x="0" y="125" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold">
                        Новый: {newWidth}/{newAspect} R{newRim}
                      </text>
                      <text x="0" y="140" textAnchor="middle" fontSize="10" fill="#38bdf8" fontFamily="monospace">
                        Ø {newCalc.totalDiameterMm.toFixed(0)} мм ({diameterDiff > 0 ? `+${diameterDiff}` : diameterDiff} мм)
                      </text>
                    </g>
                  );
                })()}

                {/* Strut Spring Cup Indicator on New Wheel */}
                <g transform="translate(370, 150)">
                  {/* Spring cup level simulation */}
                  <line
                    x1="-40"
                    y1={-100 - 25}
                    x2="40"
                    y2={-100 - 25}
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <text x="45" y={-100 - 22} fontSize="9" fill="#dc2626" fontFamily="monospace">
                    Чашка стойки
                  </text>

                  {/* Clearance distance arrow */}
                  <line
                    x1="0"
                    y1={-100 - 25}
                    x2="0"
                    y2={-100 * (newCalc.totalDiameterMm / oldCalc.totalDiameterMm)}
                    stroke={clearanceToSpringCupMm < 8 ? '#ef4444' : clearanceToSpringCupMm < 14 ? '#f59e0b' : '#10b981'}
                    strokeWidth="2"
                  />
                  <text
                    x="8"
                    y={-100 - 10}
                    fontSize="9"
                    fontWeight="bold"
                    fill={clearanceToSpringCupMm < 8 ? '#ef4444' : clearanceToSpringCupMm < 14 ? '#f59e0b' : '#10b981'}
                    fontFamily="monospace"
                  >
                    Зазор: ~{clearanceToSpringCupMm} мм
                  </text>
                </g>
              </svg>
            </div>

            {/* Quick Speedometer Deviation Dial Graphic */}
            <div className="md:col-span-4 bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Спидометр при 100 км/ч
              </span>

              <div className="flex items-center justify-center">
                <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
                  {/* Gauge Arc */}
                  <div className="absolute top-0 w-36 h-36 rounded-full border-8 border-slate-700 border-t-red-500 border-r-amber-500" />
                  
                  {/* Needle */}
                  <div
                    className="absolute bottom-0 w-1 h-16 bg-red-500 origin-bottom transition-transform duration-500 rounded-full shadow-lg"
                    style={{
                      transform: `rotate(${Math.min(45, Math.max(-45, speedoDiffPercent * 5))}deg)`
                    }}
                  />
                  <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-slate-900 z-10" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-black font-mono text-white">
                  {(100 * (1 + speedoDiffPercent / 100)).toFixed(1)} <span className="text-xs text-slate-400 font-normal">км/ч</span>
                </div>
                <div className={`text-[11px] font-semibold ${Math.abs(speedoDiffPercent) > 3 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {speedoDiffPercent > 0 ? `Завышает на ${speedoDiffPercent}%` : speedoDiffPercent < 0 ? `Занижает на ${speedoDiffPercent}%` : 'Идеальное совпадение'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 uppercase">Изменение клиренса</span>
            <div className="my-1">
              <span className={`text-xl font-bold font-mono ${clearanceDiff > 0 ? 'text-emerald-400' : clearanceDiff < 0 ? 'text-red-400' : 'text-slate-200'}`}>
                {clearanceDiff > 0 ? `+${clearanceDiff}` : clearanceDiff} мм
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {clearanceDiff > 0 ? 'Машина станет выше' : clearanceDiff < 0 ? 'Машина станет ниже' : 'Без изменений'}
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 uppercase">Разница диаметра</span>
            <div className="my-1">
              <span className={`text-xl font-bold font-mono ${diameterDiff > 0 ? 'text-amber-400' : diameterDiff < 0 ? 'text-blue-400' : 'text-slate-200'}`}>
                {diameterDiff > 0 ? `+${diameterDiff}` : diameterDiff} мм
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Общий диаметр колеса</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 uppercase">Зазор до чашки стойки</span>
            <div className="my-1">
              <span className={`text-xl font-bold font-mono ${clearanceToSpringCupMm < 8 ? 'text-red-400' : clearanceToSpringCupMm < 14 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ~{clearanceToSpringCupMm} мм
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              {clearanceToSpringCupMm < 8 ? 'Критически мало!' : 'Безопасное расстояние'}
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 uppercase">Погрешность спидометра</span>
            <div className="my-1">
              <span className={`text-xl font-bold font-mono ${Math.abs(speedoDiffPercent) > 5 ? 'text-amber-400' : 'text-slate-200'}`}>
                {speedoDiffPercent > 0 ? `+${speedoDiffPercent}%` : `${speedoDiffPercent}%`}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">При 100 км/ч: {(100 * (1 + speedoDiffPercent / 100)).toFixed(1)} км/ч</span>
          </div>
        </div>

        {/* Safety verdict box */}
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          safetyStatus === 'safe'
            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
            : safetyStatus === 'caution'
            ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
            : 'bg-red-950/30 border-red-800/60 text-red-200'
        }`}>
          {safetyStatus === 'safe' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {safetyStatus === 'caution' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {safetyStatus === 'danger' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          <div>
            <span className="font-bold text-sm block">Вердикт совместимости для Outlander 1:</span>
            <p className="text-xs mt-1 leading-relaxed">{safetyMessage}</p>
          </div>
        </div>

        {/* Speedometer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3 font-medium">Спидометр показывает</th>
                <th className="py-2 px-3 font-medium">60 км/ч</th>
                <th className="py-2 px-3 font-medium">90 км/ч</th>
                <th className="py-2 px-3 font-medium">110 км/ч</th>
                <th className="py-2 px-3 font-medium">130 км/ч</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="text-slate-300">
                <td className="py-2.5 px-3 text-slate-400 font-sans">Реальная скорость:</td>
                <td className="py-2.5 px-3 font-bold text-white">{(60 * (1 + speedoDiffPercent / 100)).toFixed(1)} км/ч</td>
                <td className="py-2.5 px-3 font-bold text-white">{(90 * (1 + speedoDiffPercent / 100)).toFixed(1)} км/ч</td>
                <td className="py-2.5 px-3 font-bold text-white">{(110 * (1 + speedoDiffPercent / 100)).toFixed(1)} км/ч</td>
                <td className="py-2.5 px-3 font-bold text-white">{(130 * (1 + speedoDiffPercent / 100)).toFixed(1)} км/ч</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog of Popular Tested Tires for Outlander I */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Проверенные альтернативные размеры шин для Outlander I
          </h3>
          <p className="text-xs text-slate-400">
            Опыт владельцев клуба Out-Club: что встает без задевания, плюсы, минусы и нюансы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALTERNATIVE_TIRES.map((item, idx) => (
            <div
              key={idx}
              className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition hover:border-slate-700 ${
                item.category === 'comfort' ? 'border-emerald-900/50' : item.category === 'offroad' ? 'border-amber-900/50' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-base font-bold font-mono text-white">{item.tireSize}</span>
                    <span className="text-[11px] block text-slate-400 mt-0.5">{item.categoryLabel}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    item.compatibilityStatus === 'ideal'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                      : 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                  }`}>
                    {item.clearanceChangeMm > 0 ? `+${item.clearanceChangeMm} мм` : `${item.clearanceChangeMm} мм`}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono bg-slate-950/60 px-2.5 py-1.5 rounded mb-3 border border-slate-800/80">
                  Рекомендуемый диск: <span className="text-amber-300 font-semibold">{item.rimRecommendation}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.notes}</p>

                {/* Pros */}
                <div className="space-y-1 mb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">Плюсы:</span>
                  {item.pros.slice(0, 2).map((pro, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">+</span>
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>

                {/* Cons */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Минусы / Особенности:</span>
                  {item.cons.slice(0, 2).map((con, i) => (
                    <div key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">−</span>
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">{item.compatibilityLabel}</span>
                <button
                  onClick={() => {
                    const [w, rest] = item.tireSize.split('/');
                    const [a, r] = rest.split(' R');
                    applyPreset(Number(w), Number(a), Number(r), 6.5, 46);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition"
                >
                  <span>Рассчитать</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OEM Rims Gallery */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-red-500" />
            Каталог оригинальных дисков Mitsubishi для Outlander I / Airtrek
          </h3>
          <p className="text-xs text-slate-400">
            Заводские литые диски конвейера с оригинальными артикулами и весом
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OEM_WHEELS_GALLERY.map((wheel) => (
            <div key={wheel.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-base font-bold text-white">{wheel.name}</h4>
                    <span className="text-xs text-red-400 font-mono font-medium">{wheel.size} · {wheel.et}</span>
                  </div>
                  <span className="text-xs font-mono bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">
                    {wheel.weightKg} кг
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300 mb-3">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">PCD: {wheel.pcd}</span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">DIA: {wheel.dia}</span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-amber-400">OEM: {wheel.oemNumber}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">{wheel.description}</p>
                <div className="text-[11px] text-slate-500">Производитель: {wheel.origin}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => handleCopy(wheel.oemNumber)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded transition"
                >
                  {copiedText === wheel.oemNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Копировать артикул</span>
                </button>
                <span className="text-[11px] text-slate-400">Гайки: под пресс-шайбу</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { OUTLANDER_BULBS_DATA, BulbItem } from '../data/bulbsData';
import {
  Lightbulb,
  Search,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Check,
  Copy,
  Zap,
  Wrench,
  Compass,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function BulbsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'front' | 'rear' | 'interior'>('all');
  const [selectedSocket, setSelectedSocket] = useState<string>('all');
  const [activeBulbId, setActiveBulbId] = useState<string>(OUTLANDER_BULBS_DATA[0].id);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeDiagramView, setActiveDiagramView] = useState<'front' | 'rear' | 'interior'>('front');

  // Filter bulbs
  const filteredBulbs = useMemo(() => {
    return OUTLANDER_BULBS_DATA.filter((bulb) => {
      // Category filter
      if (selectedCategory !== 'all' && bulb.category !== selectedCategory) {
        return false;
      }
      // Socket filter
      if (selectedSocket !== 'all' && !bulb.socket.toLowerCase().includes(selectedSocket.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = bulb.name.toLowerCase().includes(q);
        const matchesSocket = bulb.socket.toLowerCase().includes(q);
        const matchesLocation = bulb.location.toLowerCase().includes(q);
        const matchesOem = bulb.oemCode?.toLowerCase().includes(q);
        const matchesBrand = bulb.popularModels.some(
          m => m.brand.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
        );
        return matchesName || matchesSocket || matchesLocation || matchesOem || matchesBrand;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedSocket]);

  const activeBulb = OUTLANDER_BULBS_DATA.find((b) => b.id === activeBulbId) || filteredBulbs[0] || OUTLANDER_BULBS_DATA[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const socketTypes = [
    { id: 'all', label: 'Все цоколи' },
    { id: 'h7', label: 'H7 (Ближний)' },
    { id: 'h1', label: 'H1 (Дальний)' },
    { id: 'h3', label: 'H3 (ПТФ)' },
    { id: 'w5w', label: 'W5W / T10 (Габариты)' },
    { id: 'py21w', label: 'PY21W / BAU15s (Повороты)' },
    { id: 'w21/5w', label: 'W21/5W (Стоп/Габарит)' },
    { id: 'festoon', label: 'Festoon 31мм (Салон)' },
    { id: 't5', label: 'T5 / T3 (Приборка/Климат)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                Электрика и освещение Outlander I (CU_W / Airtrek)
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500">12 Вольт</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-amber-500" />
              Каталог ламп и цоколей автосвета
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
              Точные типы цоколей, мощность в ваттах, артикулы OEM, пошаговые инструкции по самостоятельной замене без снятия бампера и особенности перехода на LED.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold">Ближний свет</span>
              <strong className="text-slate-900 dark:text-white font-mono font-bold">H7 · 55W</strong>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold">Дальний свет</span>
              <strong className="text-slate-900 dark:text-white font-mono font-bold">H1 · 55W</strong>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">ПТФ туманки</span>
              <strong className="text-slate-900 dark:text-white font-mono font-bold">H3 · 55W</strong>
            </div>
          </div>
        </div>

        {/* Search and Category Filter Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по цоколю (H7, T10, W21/5W), фаре или артикулу..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
            />
          </div>

          <div className="md:col-span-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Все лампы' },
              { id: 'front', label: 'Передняя оптика' },
              { id: 'rear', label: 'Задние фонари' },
              { id: 'interior', label: 'Салон и приборка' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Socket Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Цоколь:
          </span>
          {socketTypes.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedSocket(st.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition shrink-0 ${
                selectedSocket === st.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Vehicle Layout Graphic */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Интерактивная карта расположения ламп на кузове Outlander I
            </h2>
          </div>

          {/* Toggle Graphic View: Front / Rear / Interior */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveDiagramView('front')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeDiagramView === 'front'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Передняя часть
            </button>
            <button
              onClick={() => setActiveDiagramView('rear')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeDiagramView === 'rear'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Задняя часть
            </button>
            <button
              onClick={() => setActiveDiagramView('interior')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeDiagramView === 'interior'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Салон и щиток
            </button>
          </div>
        </div>

        {/* SVG Visual Blueprint Display */}
        <div className="relative bg-slate-50 dark:bg-[#060a11] rounded-2xl border border-slate-200 dark:border-slate-850 p-4 overflow-hidden">
          {activeDiagramView === 'front' && (
            <div className="relative max-w-2xl mx-auto py-2">
              <svg viewBox="0 0 520 280" className="w-full h-auto select-none">
                {/* Car Hood and Front Outline */}
                <path
                  d="M 60 70 
                     C 100 45, 420 45, 460 70 
                     C 485 85, 495 150, 485 200 
                     C 475 240, 440 250, 390 255 
                     L 130 255 
                     C 80 250, 45 240, 35 200 
                     C 25 150, 35 85, 60 70 Z"
                  fill="#1e293b"
                  fillOpacity="0.12"
                  stroke="#475569"
                  strokeWidth="2.5"
                />

                {/* Windshield */}
                <path
                  d="M 90 70 C 130 52, 390 52, 430 70 L 410 110 C 370 100, 150 100, 110 110 Z"
                  fill="#0284c7"
                  fillOpacity="0.15"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />

                {/* Left Headlight Housing (driver perspective, right on screen) */}
                <polygon
                  points="340,140 450,130 470,170 360,185"
                  fill="#0f172a"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setActiveBulbId('low_beam')}
                />
                {/* Right Headlight Housing */}
                <polygon
                  points="180,140 70,130 50,170 160,185"
                  fill="#0f172a"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setActiveBulbId('low_beam')}
                />

                {/* Grille between headlights */}
                <rect x="200" y="145" width="120" height="40" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                <path d="M 260 152 L 253 165 L 267 165 Z" fill="#dc2626" />
                <path d="M 253 165 L 246 178 L 260 178 Z" fill="#dc2626" />
                <path d="M 267 165 L 260 178 L 274 178 Z" fill="#dc2626" />

                {/* Left Low Beam H7 (Outer) */}
                <circle cx="435" cy="150" r="14" fill="#fbbf24" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" className="cursor-pointer animate-pulse" onClick={() => setActiveBulbId('low_beam')} />
                <text x="435" y="154" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" fontFamily="monospace">H7</text>

                {/* Left High Beam H1 (Inner) */}
                <circle cx="375" cy="155" r="12" fill="#38bdf8" fillOpacity="0.3" stroke="#0284c7" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('high_beam')} />
                <text x="375" y="159" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" fontFamily="monospace">H1</text>

                {/* Left Parking Light W5W (Corner) */}
                <circle cx="455" cy="140" r="6" fill="#10b981" stroke="#059669" strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveBulbId('front_parking')} />

                {/* Left Turn Signal PY21W (Bottom corner) */}
                <circle cx="455" cy="175" r="9" fill="#f97316" stroke="#ea580c" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('front_turn')} />
                <text x="455" y="178" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">PY</text>

                {/* Right Low Beam H7 (Outer) */}
                <circle cx="85" cy="150" r="14" fill="#fbbf24" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" className="cursor-pointer animate-pulse" onClick={() => setActiveBulbId('low_beam')} />
                <text x="85" y="154" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" fontFamily="monospace">H7</text>

                {/* Right High Beam H1 (Inner) */}
                <circle cx="145" cy="155" r="12" fill="#38bdf8" fillOpacity="0.3" stroke="#0284c7" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('high_beam')} />
                <text x="145" y="159" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="bold" fontFamily="monospace">H1</text>

                {/* Right Parking Light W5W */}
                <circle cx="65" cy="140" r="6" fill="#10b981" stroke="#059669" strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveBulbId('front_parking')} />

                {/* Right Turn Signal PY21W */}
                <circle cx="65" cy="175" r="9" fill="#f97316" stroke="#ea580c" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('front_turn')} />
                <text x="65" y="178" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">PY</text>

                {/* Front Bumper Fog Lights (H3) */}
                <circle cx="115" cy="225" r="12" fill="#eab308" fillOpacity="0.4" stroke="#ca8a04" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('fog_lights')} />
                <text x="115" y="229" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" fontFamily="monospace">H3</text>

                <circle cx="405" cy="225" r="12" fill="#eab308" fillOpacity="0.4" stroke="#ca8a04" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('fog_lights')} />
                <text x="405" y="229" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold" fontFamily="monospace">H3</text>

                {/* Side Repeater Indicators on Fenders */}
                <rect x="25" y="115" width="8" height="16" rx="3" fill="#ea580c" stroke="#c2410c" className="cursor-pointer" onClick={() => setActiveBulbId('side_repeater')} />
                <rect x="487" y="115" width="8" height="16" rx="3" fill="#ea580c" stroke="#c2410c" className="cursor-pointer" onClick={() => setActiveBulbId('side_repeater')} />

                {/* Labels and Callout Guides */}
                <text x="260" y="25" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="bold">
                  Нажмите на любую фару для просмотра цоколя и инструкции
                </text>
              </svg>
            </div>
          )}

          {activeDiagramView === 'rear' && (
            <div className="relative max-w-2xl mx-auto py-2">
              <svg viewBox="0 0 520 280" className="w-full h-auto select-none">
                {/* Rear Car Body Silhouette */}
                <path
                  d="M 90 40 
                     C 150 25, 370 25, 430 40 
                     C 470 50, 480 120, 470 210 
                     C 460 250, 430 255, 380 255 
                     L 140 255 
                     C 90 255, 60 250, 50 210 
                     C 40 120, 50 50, 90 40 Z"
                  fill="#1e293b"
                  fillOpacity="0.12"
                  stroke="#475569"
                  strokeWidth="2.5"
                />

                {/* Rear Window */}
                <path
                  d="M 120 50 C 180 35, 340 35, 400 50 L 420 125 C 370 120, 150 120, 100 125 Z"
                  fill="#0284c7"
                  fillOpacity="0.15"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />

                {/* Upper High-Mount Stop Light (Spoiler) */}
                <rect
                  x="215"
                  y="38"
                  width="90"
                  height="12"
                  rx="3"
                  fill="#ef4444"
                  stroke="#b91c1c"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setActiveBulbId('high_mount_stop')}
                />
                <text x="260" y="48" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">4x W5W / LED</text>

                {/* Left Tail Lamp Cluster (Vertical Outlander 1 Signature) */}
                <rect
                  x="60"
                  y="90"
                  width="36"
                  height="115"
                  rx="6"
                  fill="#0f172a"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setActiveBulbId('rear_stop_tail')}
                />

                {/* Left Stop & Tail W21/5W */}
                <circle cx="78" cy="115" r="11" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('rear_stop_tail')} />
                <text x="78" y="118" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">21/5W</text>

                {/* Left Turn WY21W */}
                <circle cx="78" cy="148" r="10" fill="#f97316" stroke="#c2410c" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('rear_turn')} />
                <text x="78" y="151" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">WY21</text>

                {/* Left Fog or Reverse Light */}
                <circle cx="78" cy="180" r="10" fill="#dc2626" stroke="#991b1b" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('rear_fog')} />
                <text x="78" y="183" textAnchor="middle" fontSize="7" fill="#ffffff" fontWeight="bold">ПТФ</text>

                {/* Right Tail Lamp Cluster */}
                <rect
                  x="424"
                  y="90"
                  width="36"
                  height="115"
                  rx="6"
                  fill="#0f172a"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => setActiveBulbId('rear_stop_tail')}
                />

                {/* Right Stop & Tail W21/5W */}
                <circle cx="442" cy="115" r="11" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('rear_stop_tail')} />
                <text x="442" y="118" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">21/5W</text>

                {/* Right Turn WY21W */}
                <circle cx="442" cy="148" r="10" fill="#f97316" stroke="#c2410c" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('rear_turn')} />
                <text x="442" y="151" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">WY21</text>

                {/* Right Reverse Light W21W */}
                <circle cx="442" cy="180" r="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('reverse_light')} />
                <text x="442" y="183" textAnchor="middle" fontSize="7" fill="#0f172a" fontWeight="bold">W21W</text>

                {/* License Plate Lights (2x W5W) */}
                <rect x="220" y="170" width="80" height="35" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                <text x="260" y="192" textAnchor="middle" fontSize="10" fill="#ffffff" fontFamily="monospace">MITSUBISHI</text>

                <circle cx="235" cy="164" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveBulbId('license_plate')} />
                <circle cx="285" cy="164" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" className="cursor-pointer" onClick={() => setActiveBulbId('license_plate')} />

                <text x="260" y="240" textAnchor="middle" fontSize="10" fill="#94a3b8">
                  Подсветка номера: 2 лампы W5W (T10)
                </text>
              </svg>
            </div>
          )}

          {activeDiagramView === 'interior' && (
            <div className="relative max-w-2xl mx-auto py-2">
              <svg viewBox="0 0 520 280" className="w-full h-auto select-none">
                {/* Dashboard and Interior Schematic */}
                <rect x="50" y="50" width="420" height="190" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                {/* Front Map Light (Top center) */}
                <rect x="230" y="20" width="60" height="24" rx="4" fill="#1e293b" stroke="#eab308" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('interior_map')} />
                <circle cx="245" cy="32" r="5" fill="#fef08a" />
                <circle cx="275" cy="32" r="5" fill="#fef08a" />
                <text x="260" y="42" textAnchor="middle" fontSize="7" fill="#cbd5e1">2x W5W</text>

                {/* Instrument Cluster Gauges (Left) */}
                <g className="cursor-pointer" onClick={() => setActiveBulbId('cluster_backlight')}>
                  <circle cx="150" cy="120" r="42" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="150" cy="120" r="30" fill="none" stroke="#38bdf8" strokeDasharray="3 3" />
                  <text x="150" y="115" textAnchor="middle" fontSize="10" fill="#38bdf8" fontWeight="bold">СПИДОМЕТР</text>
                  <text x="150" y="130" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">4x T10 3W</text>
                </g>

                {/* Center Console Clock (Top Center) */}
                <rect x="235" y="70" width="50" height="25" rx="4" fill="#020617" stroke="#64748b" className="cursor-pointer" onClick={() => setActiveBulbId('clock_light')} />
                <text x="260" y="86" textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="monospace">12:45</text>

                {/* HVAC Climate Control Dials (Center) */}
                <g className="cursor-pointer" onClick={() => setActiveBulbId('hvac_climate')}>
                  <rect x="220" y="110" width="80" height="50" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="236" cy="135" r="9" fill="#0f172a" stroke="#f59e0b" />
                  <circle cx="260" cy="135" r="9" fill="#0f172a" stroke="#f59e0b" />
                  <circle cx="284" cy="135" r="9" fill="#0f172a" stroke="#f59e0b" />
                  <text x="260" y="156" textAnchor="middle" fontSize="7" fill="#fbbf24">КЛИМАТ: 2x T3</text>
                </g>

                {/* Automatic Shifter Light (Lower Center) */}
                <g className="cursor-pointer" onClick={() => setActiveBulbId('shifter_light')}>
                  <rect x="240" y="180" width="40" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" />
                  <text x="260" y="198" textAnchor="middle" fontSize="8" fill="#ffffff" fontFamily="monospace">P R N D</text>
                  <text x="260" y="220" textAnchor="middle" fontSize="7" fill="#94a3b8">T5 1.2W</text>
                </g>

                {/* Central Dome Light (Top Right) */}
                <rect x="360" y="60" width="60" height="26" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('interior_dome')} />
                <text x="390" y="76" textAnchor="middle" fontSize="8" fill="#fef08a" fontWeight="bold">Плафон салона</text>
                <text x="390" y="85" textAnchor="middle" fontSize="7" fill="#94a3b8">Festoon 31 мм</text>

                {/* Trunk Light (Bottom Right) */}
                <rect x="360" y="160" width="60" height="26" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveBulbId('interior_trunk')} />
                <text x="390" y="176" textAnchor="middle" fontSize="8" fill="#fef08a" fontWeight="bold">Багажник</text>
                <text x="390" y="185" textAnchor="middle" fontSize="7" fill="#94a3b8">Festoon 31 мм</text>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column View: Bulb List on Left & Detailed Specification / Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bulb List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Лампы в каталоге ({filteredBulbs.length}):
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Outlander I CU_W</span>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredBulbs.map((item) => {
              const isActive = activeBulb.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveBulbId(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-xs ring-1 ring-amber-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-xs font-black">
                        {item.socket}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.power}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        · {item.quantity} шт.
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {item.location}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-amber-500 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Bulb Specs & Step-by-Step Replacement Guide */}
        <div className="lg:col-span-7">
          {activeBulb && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header of Active Bulb */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-amber-500 font-mono">
                      {activeBulb.socket}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 font-semibold">
                      Цоколь: {activeBulb.baseCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-[11px] font-mono font-bold">
                      {activeBulb.power} · 12V
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeBulb.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeBulb.location}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Сложность: {activeBulb.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Кол-во: <strong>{activeBulb.quantity} шт.</strong> на авто
                  </span>
                </div>
              </div>

              {/* OEM Code and Popular Store Equivalents */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Оригинал и проверенные брендовые аналоги:
                  </span>
                  {activeBulb.oemCode && (
                    <button
                      onClick={() => handleCopy(activeBulb.oemCode!)}
                      className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-amber-600 transition"
                      title="Скопировать артикул OEM"
                    >
                      <span>OEM: <strong>{activeBulb.oemCode}</strong></span>
                      {copiedCode === activeBulb.oemCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeBulb.popularModels.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.brand} {item.code}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.name}</div>
                      </div>
                      <button
                        onClick={() => handleCopy(`${item.brand} ${item.code}`)}
                        className="text-slate-400 hover:text-amber-500 p-1"
                        title="Скопировать"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Replacement Instructions */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  Пошаговая инструкция по замене:
                </span>

                <div className="space-y-2">
                  {activeBulb.replacementGuide.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crucial Tips and Warnings */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Важные нюансы при замене на Outlander I:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeBulb.tips}
                </p>
              </div>

              {/* LED Upgrade Recommendation */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-400 font-bold">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Переход на светодиоды (LED):</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeBulb.ledUpgradeNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference Summary Table for Auto Parts Shopping */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Сводная шпаргалка по всем лампам Outlander I для покупки в автомагазине
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Штатная оптика</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Узел / Место установки</th>
                <th className="py-2.5 px-3">Тип цоколя</th>
                <th className="py-2.5 px-3">Мощность</th>
                <th className="py-2.5 px-3">База</th>
                <th className="py-2.5 px-3">Кол-во</th>
                <th className="py-2.5 px-3">Артикул OEM</th>
                <th className="py-2.5 px-3">Популярный аналог</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {OUTLANDER_BULBS_DATA.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setActiveBulbId(b.id)}
                  className={`hover:bg-amber-500/5 cursor-pointer transition ${
                    activeBulbId === b.id ? 'bg-amber-500/10 font-bold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans text-slate-800 dark:text-slate-200">{b.name}</td>
                  <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-black">{b.socket}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{b.power}</td>
                  <td className="py-2.5 px-3 text-slate-500">{b.baseCode}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{b.quantity}</td>
                  <td className="py-2.5 px-3 text-slate-500">{b.oemCode || '—'}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400">
                    {b.popularModels[0]?.brand} {b.popularModels[0]?.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

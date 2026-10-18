import { useState, useMemo } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import { OBD_CODES_DATA } from '../data/obdData';
import ObdPortLocationGraphic from './ObdPortLocationGraphic';
import {
  Activity,
  Search,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  MapPin,
  SlidersHorizontal,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';

export default function ObdDiagnostics() {
  const { brandId, modelId } = useVehicle();
  const activeBrand = JAPANESE_BRANDS.find(brand => brand.id === brandId);
  const activeModel = activeBrand?.models.find(model => model.id === modelId);
  const isOutlanderSourceModel = modelId === 'outlander-1';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<string>(OBD_CODES_DATA[0].code);
  const [showPortLocation, setShowPortLocation] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // System category filter buttons
  const systemFilters = [
    { id: 'all', label: `Все коды (${OBD_CODES_DATA.length})` },
    { id: 'выхлоп', label: 'Катализатор и Лямбды' },
    { id: 'топливо', label: 'Смесь и форсунки' },
    { id: 'зажигани', label: 'Зажигание и свечи' },
    { id: 'датчик', label: 'Датчики (ДМРВ/ДПКВ)' },
    { id: 'холост', label: 'Холостой ход и РХХ' },
    { id: 'акпп', label: 'АКПП W4A42' },
    { id: 'mivec', label: 'MIVEC и Турбо' },
    { id: 'abs', label: 'Тормоза и ABS' },
    { id: 'srs', label: 'Подушки SRS' },
    { id: 'evap', label: 'EVAP и Бак' },
  ];

  const filteredCodes = useMemo(() => {
    return OBD_CODES_DATA.filter((item) => {
      // System filter
      if (selectedSystem !== 'all') {
        const sysLower = (item.system + ' ' + item.title + ' ' + item.code).toLowerCase();
        if (!sysLower.includes(selectedSystem.toLowerCase())) {
          return false;
        }
      }
      // Severity filter
      if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSystem = item.system.toLowerCase().includes(q);
        const matchesSpec = item.outlanderSpecifics.toLowerCase().includes(q);
        const matchesSymptoms = item.symptoms.some(s => s.toLowerCase().includes(q));
        const matchesCauses = item.commonCauses.some(c => c.toLowerCase().includes(q));
        return matchesCode || matchesTitle || matchesSystem || matchesSpec || matchesSymptoms || matchesCauses;
      }
      return true;
    });
  }, [searchQuery, selectedSystem, selectedSeverity]);

  const activeCode = OBD_CODES_DATA.find((c) => c.code === selectedCode) || filteredCodes[0] || OBD_CODES_DATA[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isOutlanderSourceModel) return <section className="rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-900/60 dark:bg-slate-900"><h2 className="text-base font-bold">Диагностика для {activeBrand?.russianName || activeBrand?.name} {activeModel?.name}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Эта база кодов и пояснений подготовлена для одной исходной модификации справочника. Чтобы не показывать неподтверждённые сведения для другой машины, откройте карточку выбранной модели в «Авто Японии» или запросите данные.</p><a className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white" href={`https://github.com/sadist57rus/MitsubishiBro/issues/new?title=OBD%20data%20request%3A%20${encodeURIComponent(activeBrand?.name || brandId)}%20${encodeURIComponent(activeModel?.name || modelId)}`} target="_blank" rel="noreferrer">Запросить данные для модели</a></section>;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" />
                Диагностика ошибок Check Engine (DTC)
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500">
                База: {OBD_CODES_DATA.length} кодов
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-red-600" />
              Коды ошибок OBD-II для {activeBrand?.russianName || activeBrand?.name} {activeModel?.name} {activeModel?.generation}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
              Полный диагностический справочник со спецификой для моторов 4G63, 4G64, 4G69 MIVEC, турбо 4G63T, автомата INVECS-II (W4A42), систем ABS, SRS и EVAP.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setShowPortLocation(!showPortLocation)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                showPortLocation
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-red-600" />
              <span>{showPortLocation ? 'Скрыть схему разъема' : 'Где разъем OBD-II?'}</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите код ошибки (P0421, P0171, P0505, C1201), симптом (троит, глохнет, АКПП) или узел..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-mono"
          />
        </div>

        {/* System Category Horizontal Scroll Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Система:
          </span>
          {systemFilters.map((sf) => (
            <button
              key={sf.id}
              onClick={() => setSelectedSystem(sf.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition shrink-0 ${
                selectedSystem === sf.id
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prominent OBD-II Port Location Graphic & Diagnostic Guide */}
      {showPortLocation && (
        <div className="animate-in fade-in duration-200">
          <ObdPortLocationGraphic />
        </div>
      )}

      {/* Main Two-Column View: Code List on Left and Detailed View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Codes */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Найдено кодов ({filteredCodes.length}):
            </span>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-slate-400">Фильтр тяжести:</span>
              <button
                onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? 'all' : 'critical')}
                className={`px-1.5 py-0.5 rounded font-bold ${
                  selectedSeverity === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400'
                }`}
              >
                Критичные
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredCodes.map((item) => {
              const isSelected = activeCode.code === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setSelectedCode(item.code)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-red-600/10 border-red-500 text-slate-900 dark:text-white shadow-xs ring-1 ring-red-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-red-600 dark:text-red-400">
                        {item.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[170px]">
                        {item.system}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.severity === 'critical'
                            ? 'bg-red-500'
                            : item.severity === 'error'
                            ? 'bg-amber-500'
                            : 'bg-blue-400'
                        }`}
                        title={item.severity}
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {item.symptoms[0]}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-red-500 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}

            {filteredCodes.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                По запросу ничего не найдено. Попробуйте ввести номер ошибки (например, P0421) или выберите другую категорию.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Diagnostic Card */}
        <div className="lg:col-span-7">
          {activeCode && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header of Active Code */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-red-600 dark:text-red-500 font-mono tracking-tight">
                      {activeCode.code}
                    </span>
                    <button
                      onClick={() => handleCopy(activeCode.code)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
                      title="Скопировать код"
                    >
                      {copiedCode === activeCode.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 font-semibold">
                      {activeCode.system}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeCode.title}
                  </h3>
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold border inline-flex items-center gap-1.5 ${
                      activeCode.severity === 'critical'
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                        : activeCode.severity === 'error'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {activeCode.severity === 'critical' ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Критическая неисправность
                      </>
                    ) : activeCode.severity === 'error' ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Ошибка в работе узла
                      </>
                    ) : (
                      <>
                        <Info className="w-3.5 h-3.5" />
                        Предупреждение / Статус
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Outlander Specifics Callout Card */}
              <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Специфика первого поколения Outlander (CU_W / Airtrek):
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeCode.outlanderSpecifics}
                </p>
              </div>

              {/* Symptoms and Common Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Symptoms */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                    Симптомы при вождении:
                  </span>
                  <ul className="space-y-1.5">
                    {activeCode.symptoms.map((s, i) => (
                      <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Causes */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                    Вероятные причины:
                  </span>
                  <ul className="space-y-1.5">
                    {activeCode.commonCauses.map((c, i) => (
                      <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Diagnostic Steps with Scanner & Multimeter */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-2.5">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Пошаговая проверка сканером (ELM327 / MUT-III) и мультиметром:
                </span>
                <div className="space-y-2">
                  {activeCode.diagnosticSteps.map((step, i) => (
                    <div key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Fix */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Рекомендуемое решение проблемы:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeCode.recommendedFix}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { FUSE_BOX_METAS, UNDERHOOD_FUSES, CABIN_FUSES, FuseItem } from '../data/fusesData';
import { Zap, Search, ShieldAlert, Sparkles, MapPin, Wrench, Info, CheckCircle2, ChevronRight, AlertTriangle, Printer } from 'lucide-react';

export default function FuseDiagram() {
  const [activeBox, setActiveBox] = useState<'underhood' | 'cabin'>('cabin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmperage, setSelectedAmperage] = useState<number | 'ALL'>('ALL');
  const [selectedFuseId, setSelectedFuseId] = useState<string>('cb-f1'); // Default to cigarette lighter F1

  const currentFuses = activeBox === 'underhood' ? UNDERHOOD_FUSES : CABIN_FUSES;
  const currentMeta = FUSE_BOX_METAS[activeBox];

  // Quick symptom filter helpers
  const quickFilters = [
    { label: 'Прикуриватель / зарядка', query: 'прикуриватель', box: 'cabin' },
    { label: 'Стоп-сигналы / АКПП', query: 'стоп', box: 'cabin' },
    { label: 'Печка салона', query: 'печка', box: 'underhood' },
    { label: 'Бензонасос', query: 'бензонасос', box: 'underhood' },
    { label: 'Вентиляторы радиатора', query: 'вентилятор', box: 'underhood' },
    { label: 'Дворники / стеклоочиститель', query: 'дворник', box: 'cabin' },
    { label: 'Сканер OBD-II', query: 'OBD', box: 'cabin' },
    { label: 'Ближний свет', query: 'ближнего', box: 'underhood' },
  ];

  const filteredFuses = useMemo(() => {
    return currentFuses.filter((fuse) => {
      // Amperage filter
      if (selectedAmperage !== 'ALL' && fuse.amperage !== selectedAmperage) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSlot = fuse.slotNumber.toLowerCase().includes(q);
        const matchesName = fuse.name.toLowerCase().includes(q);
        const matchesSymptom = fuse.symptomIfBlown.toLowerCase().includes(q);
        const matchesConsumers = fuse.consumers.some(c => c.toLowerCase().includes(q));
        const matchesAmp = `${fuse.amperage}a`.includes(q) || `${fuse.amperage} а`.includes(q);
        return matchesSlot || matchesName || matchesSymptom || matchesConsumers || matchesAmp;
      }

      return true;
    });
  }, [currentFuses, selectedAmperage, searchQuery]);

  const activeFuse = currentFuses.find(f => f.id === selectedFuseId) || filteredFuses[0] || currentFuses[0];

  const handleSelectQuickFilter = (box: 'underhood' | 'cabin', query: string) => {
    setActiveBox(box);
    setSearchQuery(query);
    setSelectedAmperage('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Box Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Схема предохранителей Mitsubishi Outlander I
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Интерактивная карта монтажных блоков в салоне и под капотом с расшифровкой номиналов и защищаемых цепей
            </p>
          </div>

          {/* Main Box Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                setActiveBox('cabin');
                setSelectedFuseId('cb-f1');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeBox === 'cabin'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>🚗 Блок в салоне (19 шт)</span>
            </button>

            <button
              onClick={() => {
                setActiveBox('underhood');
                setSelectedFuseId('uh-f1');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeBox === 'underhood'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>⚙️ Блок под капотом (23 шт)</span>
            </button>
          </div>
        </div>

        {/* Location & Access Info Strip */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">{currentMeta.title}:</span>
              <span className="text-slate-400 leading-relaxed">{currentMeta.location}</span>
            </div>
          </div>
          <div className="shrink-0 text-[11px] text-amber-300/90 bg-amber-950/30 px-2.5 py-1.5 rounded border border-amber-900/40">
            {currentMeta.accessTip}
          </div>
        </div>

        {/* Search & Quick Symptoms */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по потребителю (прикуриватель, печка, фары, бензонасос), номеру (F1, FL3) или симптому..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Очистить
              </button>
            )}
          </div>

          {/* Quick Problem Shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Частые проблемы:</span>
            {quickFilters.map((qf, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectQuickFilter(qf.box as any, qf.query)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition ${
                  searchQuery === qf.query && activeBox === qf.box
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>

          {/* Amperage Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Номинал:</span>
            {(['ALL', 7.5, 10, 15, 20, 30, 40, 100] as const).map((amp) => (
              <button
                key={String(amp)}
                onClick={() => setSelectedAmperage(amp)}
                className={`px-2.5 py-0.5 rounded font-mono text-[11px] transition ${
                  selectedAmperage === amp
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {amp === 'ALL' ? 'Все' : `${amp}A`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Schematic Fuse Board (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Интерактивная панель блока ({activeBox === 'cabin' ? 'Салон' : 'Моторный отсек'})
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Нажмите на предохранитель для подробностей
              </span>
            </div>

            {/* Simulated Fuse Box Board Enclosure */}
            <div className="bg-black/60 p-4 sm:p-6 rounded-2xl border-2 border-slate-800 shadow-inner relative overflow-hidden">
              {/* Notch / Label indicating top of box */}
              <div className="flex justify-center mb-4">
                <div className="bg-slate-800 text-[10px] text-slate-400 px-4 py-1 rounded-full font-mono uppercase tracking-widest border border-slate-700">
                  ▲ ВЕРХ БЛОКА (ОРИЕНТАЦИЯ) ▲
                </div>
              </div>

              {/* Fuse Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentFuses.map((fuse) => {
                  const isSelected = activeFuse?.id === fuse.id;
                  const isMatchingSearch = searchQuery.trim() && filteredFuses.some(f => f.id === fuse.id);
                  const isDimmed = searchQuery.trim() && !isMatchingSearch;

                  return (
                    <button
                      key={fuse.id}
                      onClick={() => setSelectedFuseId(fuse.id)}
                      className={`relative group rounded-xl p-3 text-left transition flex flex-col justify-between border-2 ${
                        isSelected
                          ? 'border-red-600 bg-red-50 dark:bg-slate-800 shadow-xl scale-[1.03] z-10 ring-2 ring-red-500/20'
                          : isMatchingSearch
                          ? 'border-amber-400 bg-amber-100 dark:bg-amber-950/30 animate-pulse'
                          : 'border-slate-300 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 hover:border-slate-400 dark:hover:border-slate-700'
                      } ${isDimmed ? 'opacity-35 scale-95' : 'opacity-100'}`}
                      style={{
                        minHeight: fuse.amperage >= 40 ? '90px' : '78px'
                      }}
                    >
                      {/* Fuse Pin Head Simulation */}
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          {fuse.slotNumber}
                        </span>

                        {/* Physical fuse body styling with real automotive standard color */}
                        <div
                          className="px-2 py-0.5 rounded font-mono font-black text-xs shadow-sm flex items-center justify-center text-white"
                          style={{
                            backgroundColor: fuse.color,
                            boxShadow: `0 0 10px ${fuse.color}40`,
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                          }}
                        >
                          {fuse.amperage}A
                        </div>
                      </div>

                      {/* Name / function label */}
                      <div className="mt-2 w-full">
                        <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 line-clamp-2 leading-tight block">
                          {fuse.name}
                        </span>
                      </div>

                      {/* Fusible link tag if >= 30A */}
                      {fuse.amperage >= 30 && (
                        <div className="mt-1 text-[9px] uppercase font-mono text-amber-400 tracking-wider">
                          {fuse.amperage >= 40 ? 'Maxi вставка' : 'Силовой'}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Extra Spare & Puller Storage representation */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/80 rounded-sm"></div>
                  <span className="text-[11px]">Белый пинцет-съемник: на крышке под капотом</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">Резервные слоты (Spare): 10A, 15A, 20A</span>
                </div>
              </div>
            </div>

            {/* Standard Color Code Legend */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Стандартная цветовая маркировка автомобильных предохранителей:
              </span>
              <div className="flex items-center gap-2.5 flex-wrap text-[11px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#a16207]"></span> 7.5A (Коричневый)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#ef4444]"></span> 10A (Красный)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#3b82f6]"></span> 15A (Синий)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#eab308]"></span> 20A (Желтый)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#22c55e]"></span> 30A (Зеленый)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#f97316]"></span> 40A (Оранжевый)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Selected Fuse Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {activeFuse ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 sticky top-24">
              {/* Header with Slot & Amperage */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-white">
                      {activeFuse.slotNumber}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded font-mono font-bold text-xs text-white shadow-sm"
                      style={{ backgroundColor: activeFuse.color }}
                    >
                      {activeFuse.amperage} Ампер
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {activeFuse.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase block">Монтажный блок</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {activeFuse.box === 'cabin' ? 'Салон' : 'Под капотом'}
                  </span>
                </div>
              </div>

              {/* Symptom Callout if Blown */}
              <div className="p-3.5 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  Что произойдет при перегорании:
                </span>
                <p className="leading-relaxed text-red-100 font-medium">
                  {activeFuse.symptomIfBlown}
                </p>
              </div>

              {/* Protected Consumers List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Защищаемые потребители цепи:
                </span>
                <div className="space-y-1.5">
                  {activeFuse.consumers.map((consumer, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{consumer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Note / Installation Tip */}
              {activeFuse.notes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-400 block text-[11px]">Совет мастера:</span>
                    <span className="leading-relaxed">{activeFuse.notes}</span>
                  </div>
                </div>
              )}

              {/* Critical Safety Notice */}
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-[11px] text-amber-200/90 leading-relaxed space-y-1">
                <span className="font-bold text-amber-400 block">Правило безопасности:</span>
                <span>
                  Категорически запрещается устанавливать предохранители большего номинала (например, вместо 15A ставить 25A) или проволочные «жучки»! Это может привести к оплавлению проводки и возгоранию.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              Выберите предохранитель на схеме для отображения информации.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

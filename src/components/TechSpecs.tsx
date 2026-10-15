import { useState } from 'react';
import { OUTLANDER_TECH_SPECS, SpecCategory } from '../data/specsData';
import SpecsBlueprintGraphic from './SpecsBlueprintGraphic';
import {
  Maximize2,
  UserCheck,
  Package,
  Zap,
  Compass,
  Sliders,
  Scale,
  Gauge,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Copy,
  Check,
  Car,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function TechSpecs() {
  // Start with dimensions, cabin and trunk open by default, rest collapsed
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dimensions: true,
    cabin: true,
    trunk: true,
    engines: false,
    drivetrain: false,
    chassis: false,
    mass_capacities: false,
    performance: false,
  });

  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    OUTLANDER_TECH_SPECS.forEach(s => { allOpen[s.id] = true; });
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    OUTLANDER_TECH_SPECS.forEach(s => { allClosed[s.id] = false; });
    setOpenSections(allClosed);
  };

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(`${label}: ${value}`);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Maximize2': return Maximize2;
      case 'UserCheck': return UserCheck;
      case 'Package': return Package;
      case 'Zap': return Zap;
      case 'Compass': return Compass;
      case 'Sliders': return Sliders;
      case 'Scale': return Scale;
      case 'Gauge': return Gauge;
      default: return Layers;
    }
  };

  const filteredSpecs = OUTLANDER_TECH_SPECS.map(section => {
    if (!filterText.trim()) return section;
    const q = filterText.toLowerCase().trim();
    const matchesSection = section.title.toLowerCase().includes(q) || section.subtitle.toLowerCase().includes(q);
    const matchingItems = section.items.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.value.toLowerCase().includes(q) ||
      item.detail?.toLowerCase().includes(q)
    );

    if (matchesSection || matchingItems.length > 0) {
      return {
        ...section,
        items: matchingItems.length > 0 ? matchingItems : section.items
      };
    }
    return null;
  }).filter(Boolean) as SpecCategory[];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Quick Dimension Visuals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Заводские спецификации
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Mitsubishi Workshop Manual</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Car className="w-6 h-6 text-red-600" />
              Технические характеристики Outlander I
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Габариты кузова, замеры салона, точные размеры багажника, характеристики двигателей 4G6 и трансмиссии
            </p>
          </div>

          {/* Expand / Collapse Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            >
              Развернуть все
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            >
              Свернуть все
            </button>
          </div>
        </div>

        {/* 3 Core Dimension Quick Cards (Кузов, Салон, Багажник) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Кузов */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Maximize2 className="w-4 h-4 text-red-600" />
                <span>Габариты кузова</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">CU_W</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Длина:</span>
                <strong className="text-slate-900 dark:text-white">4 545 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Ширина:</span>
                <strong className="text-slate-900 dark:text-white">1 750 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Высота (с рейлингами):</span>
                <strong className="text-slate-900 dark:text-white">1 685 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Колесная база:</span>
                <strong className="text-slate-900 dark:text-white">2 625 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-red-600 dark:text-red-400 font-semibold">Клиренс:</span>
                <strong className="text-red-600 dark:text-red-400 font-bold">195 – 205 мм</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Салон */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <UserCheck className="w-4 h-4 text-red-600" />
                <span>Размеры салона</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">5 мест</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Длина салона:</span>
                <strong className="text-slate-900 dark:text-white">1 910 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Ширина спереди:</span>
                <strong className="text-slate-900 dark:text-white">1 470 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Ширина сзади:</span>
                <strong className="text-slate-900 dark:text-white">1 435 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Высота потолка:</span>
                <strong className="text-slate-900 dark:text-white">1 210 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Запас ног сзади:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">890 – 930 мм</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Багажник */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Package className="w-4 h-4 text-red-600" />
                <span>Багажное отделение</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">402 – 1705 л</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Длина (штатная):</span>
                <strong className="text-slate-900 dark:text-white">910 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Длина со сложенными:</span>
                <strong className="text-slate-900 dark:text-white">1 540 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Спальное место:</span>
                <strong className="text-slate-900 dark:text-white">1 720 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Ширина между арок:</span>
                <strong className="text-slate-900 dark:text-white">1 010 мм</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-red-600 dark:text-red-400 font-semibold">Погрузочная высота:</span>
                <strong className="text-slate-900 dark:text-white font-bold">690 мм</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Visual Blueprint Graphic */}
        <SpecsBlueprintGraphic />

        {/* Search input for specs */}
        <div className="pt-2">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Поиск по параметрам: клиренс, багажник, спальное место, мощность, масса, объем..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
        </div>
      </div>

      {/* Accordion Subsections (со скрытыми подразделами) */}
      <div className="space-y-4">
        {filteredSpecs.map((section) => {
          const isOpen = openSections[section.id] ?? false;
          const Icon = getIcon(section.iconName);

          return (
            <div
              key={section.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors"
            >
              {/* Collapsible Header Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-850/60 transition"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isOpen
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{section.title}</span>
                      <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">
                        ({section.items.length} параметров)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs text-slate-400 hidden md:inline font-medium">
                    {isOpen ? 'Скрыть' : 'Раскрыть'}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Collapsible Body Content */}
              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800 p-5 space-y-4 animate-in fade-in duration-150">
                  {/* Detailed Specs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-xs transition flex flex-col justify-between ${
                          item.highlight
                            ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            {item.label}
                          </span>
                          <button
                            onClick={() => copyValue(item.label, item.value)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded shrink-0"
                            title="Скопировать значение"
                          >
                            {copiedLabel === item.label ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="mt-1">
                          <div className={`font-mono text-sm font-bold ${
                            item.highlight ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {item.value}
                          </div>
                          {item.detail && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                              {item.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section Notes & Club Observations */}
                  {section.notes && section.notes.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        <Info className="w-3.5 h-3.5 text-red-500" />
                        <span>Практические заметки и особенности:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px] pl-1">
                        {section.notes.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

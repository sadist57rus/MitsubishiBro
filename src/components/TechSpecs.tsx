import { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import { OUTLANDER_TECH_SPECS, SpecCategory } from '../data/specsData';
import SpecsBlueprintGraphic from './SpecsBlueprintGraphic';
import { ENGINE_TECHNICAL_RECORDS, TECHNICAL_DATA_SOURCES } from '../data/technicalSpecRecords';
import ModelDataCoveragePanel from './ModelDataCoveragePanel';
import ExpandedModelDossiers from './ExpandedModelDossiers';
import GenerationBodyCatalogPanel from './GenerationBodyCatalogPanel';
import JapaneseModelFamilyDirectory from './JapaneseModelFamilyDirectory';
import TechnicalReferenceMatrixPanel from './TechnicalReferenceMatrixPanel';
import GlobalModelRatingsPanel from './GlobalModelRatingsPanel';
import PowertrainReferencePanel from './PowertrainReferencePanel';
import JapaneseChassisIndexPanel from './JapaneseChassisIndexPanel';
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
  const { brandId, modelId } = useVehicle();
  const activeBrand = JAPANESE_BRANDS.find(brand => brand.id === brandId);
  const activeModel = activeBrand?.models.find(model => model.id === modelId);
  const isOutlanderSourceModel = modelId === 'outlander-1';
  if (!isOutlanderSourceModel) return <section className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-900/60 dark:bg-slate-900"><h2 className="text-base font-bold">Технические данные для {activeBrand?.russianName || activeBrand?.name} {activeModel?.name}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">В этом разделе пока доступны подробные технические данные только для Mitsubishi Outlander I. Чтобы не подменять их характеристиками другой машины, откройте карточку выбранной модели в «Авто Японии» или запросите данные.</p><button type="button" onClick={() => window.history.back()} className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Вернуться к предыдущему экрану</button><a className="ml-2 inline-flex min-h-11 items-center rounded-xl border px-4 py-2 text-sm font-bold" href={\`https://github.com/sadist57rus/MitsubishiBro/issues/new?title=Tech%20data%20request%3A%20\${encodeURIComponent(activeBrand?.name || brandId)}%20\${encodeURIComponent(activeModel?.name || modelId)}\`} target="_blank" rel="noreferrer">Запросить данные</a></section>;
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
      <JapaneseChassisIndexPanel />
      <PowertrainReferencePanel />
      {isOutlanderSourceModel && <section className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300">Источник: сервисная документация · отдельная модификация</div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">Outlander CU5W · двигатель 4G69</h2>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mt-1">{ENGINE_TECHNICAL_RECORDS[0].summary}</p>
          </div>
          <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">Частично подтверждено</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {ENGINE_TECHNICAL_RECORDS[0].values.map(value => (
            <div key={value.label} className="rounded-lg border border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900 p-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{value.label}</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">{value.value}</div>
              {value.conditions && <div className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1">{value.conditions}</div>}
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <div className="font-bold">Ограничения применения</div>
          {ENGINE_TECHNICAL_RECORDS[0].limitations.map(note => <p key={note}>• {note}</p>)}
          <a href={TECHNICAL_DATA_SOURCES[0].url} target="_blank" rel="noreferrer" className="inline-block text-blue-700 dark:text-blue-300 underline underline-offset-2 mt-2">Открыть сервисный мануал 2006 года (раздел 4G69)</a>
        </div>
      </section>}

      <ModelDataCoveragePanel />
      <GlobalModelRatingsPanel />
      <JapaneseModelFamilyDirectory />
      <TechnicalReferenceMatrixPanel />
      <GenerationBodyCatalogPanel />
      <ExpandedModelDossiers />

      {/* Top Banner with Quick Dimension Visuals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Заводские спецификации
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Руководство производителя</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Car className="w-6 h-6 text-red-600" />
              Технические характеристики {activeBrand?.russianName || activeBrand?.name} {activeModel?.name} {activeModel?.generation}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Справочные размеры кузова, салона и багажника, а также сведения о двигателе и трансмиссии выбранной модели
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
          const verificationStatus = section.id === 'engines' ? ENGINE_TECHNICAL_RECORDS[0]?.verificationStatus ?? 'unverified' : 'unverified';
          const sourceIds = section.id === 'engines' ? (ENGINE_TECHNICAL_RECORDS[0]?.sourceIds ?? []) : [];
          const verificationLabel = verificationStatus === 'verified' ? 'Подтверждено' : verificationStatus === 'partially-verified' ? 'Частично подтверждено' : 'Не проверено';

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
                    <span title={verificationStatus === 'verified' ? 'Подтверждено источником для указанной модификации' : verificationStatus === 'partially-verified' ? 'Подтверждены только параметры, перечисленные в связанном источнике' : 'Для этого блока нет привязанного подтверждающего источника'} className={'mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold '+(verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : verificationStatus === 'partially-verified' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900')}>
                      {verificationLabel}
                    </span>
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
                  {verificationStatus === 'unverified' && <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">⚠ Сверьте по руководству</div>}
                  {sourceIds.length > 0 && <div className="flex flex-wrap gap-2 text-xs">{sourceIds.map(sourceId => { const source = TECHNICAL_DATA_SOURCES.find(item => item.id === sourceId); return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer" title={'Подтверждено: ' + source.scope} className="text-blue-700 underline underline-offset-2 dark:text-blue-300">Источник: {source.title}</a> : null; })}</div>}
                  {/* Detailed Specs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item, index) => (
                      <div
                        key={item.label}
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

import { useState, useMemo } from 'react';
import {
  JAPANESE_BRANDS,
  JapaneseBrand,
  JapaneseCarModel,
  JapaneseCarEngine
} from '../data/japaneseBrandsData';
import '../data/expandedJapaneseModels';
import { BrandLogo } from './BrandLogos';
import { TabId } from './Header';
import {
  Car,
  Search,
  Sparkles,
  ShieldCheck,
  Droplet,
  Gauge,
  Lightbulb,
  Stethoscope,
  AlertCircle,
  Wrench,
  ChevronRight,
  ArrowRight,
  Layers,
  Fuel,
  Zap,
  Check,
  Scale,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: TabId) => void;
  selectedBrandId?: string;
  onSelectBrand?: (brandId: string) => void;
  selectedModelId?: string;
  onSelectModel?: (modelId: string) => void;
}

export default function JapaneseBrandsHub({
  onNavigateTab,
  selectedBrandId: initialBrandId = 'mitsubishi',
  onSelectBrand,
  selectedModelId: initialModelId,
  onSelectModel
}: Props) {
  const [activeBrandId, setActiveBrandId] = useState<string>(initialBrandId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBodyType, setFilterBodyType] = useState<string>('ALL');
  const [activeTabSubSection, setActiveTabSubSection] = useState<
    'overview' | 'engines' | 'fluids' | 'bulbs' | 'obd' | 'issues' | 'compare'
  >('overview');

  // Comparison drawer state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareModelId, setCompareModelId] = useState<string>('outlander-1');

  // Currently active brand
  const currentBrand = useMemo(() => {
    return JAPANESE_BRANDS.find(b => b.id === activeBrandId) || JAPANESE_BRANDS[0];
  }, [activeBrandId]);

  // Currently active model
  const [currentModelId, setCurrentModelId] = useState<string>(() => {
    if (initialModelId) return initialModelId;
    return currentBrand.models[0]?.id || 'outlander-1';
  });

  const currentModel = useMemo(() => {
    const foundInBrand = currentBrand.models.find(m => m.id === currentModelId);
    if (foundInBrand) return foundInBrand;
    return currentBrand.models[0];
  }, [currentBrand, currentModelId]);

  const handleBrandChange = (brandId: string) => {
    setActiveBrandId(brandId);
    if (onSelectBrand) onSelectBrand(brandId);
    const brand = JAPANESE_BRANDS.find(b => b.id === brandId);
    if (brand && brand.models.length > 0) {
      setCurrentModelId(brand.models[0].id);
      if (onSelectModel) onSelectModel(brand.models[0].id);
    }
  };

  const handleModelChange = (modelId: string) => {
    const owner = JAPANESE_BRANDS.find(brand => brand.models.some(model => model.id === modelId));
    if (owner && owner.id !== activeBrandId) {
      setActiveBrandId(owner.id);
      if (onSelectBrand) onSelectBrand(owner.id);
    }
    setCurrentModelId(modelId);
    if (onSelectModel) onSelectModel(modelId);
  };

  // Search globally when a query is entered; otherwise show the selected brand.
  const filteredModels = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const source = query
      ? JAPANESE_BRANDS.flatMap(brand => brand.models)
      : currentBrand.models;
    return source.filter(model => {
      const matchQuery =
        !query ||
        model.name.toLowerCase().includes(query) ||
        model.generation.toLowerCase().includes(query) ||
        model.years.toLowerCase().includes(query) ||
        model.bodyType.toLowerCase().includes(query) ||
        model.engines.some(engine =>
          engine.code.toLowerCase().includes(query) ||
          engine.name.toLowerCase().includes(query)
        ) ||
        model.awdSystemName.toLowerCase().includes(query);

      const matchBody = filterBodyType === 'ALL' || model.bodyType === filterBodyType;
      return matchQuery && matchBody;
    });
  }, [currentBrand, searchQuery, filterBodyType]);

  // All models flat list for global search and comparison
  const allModelsFlat = useMemo(() => {
    const list: { brand: JapaneseBrand; model: JapaneseCarModel }[] = [];
    JAPANESE_BRANDS.forEach(brand => {
      brand.models.forEach(model => {
        list.push({ brand, model });
      });
    });
    return list;
  }, []);

  const compareTargetModel = useMemo(() => {
    return allModelsFlat.find(item => item.model.id === compareModelId)?.model || allModelsFlat[0].model;
  }, [allModelsFlat, compareModelId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Japanese Automotive Encyclopedia Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-800 p-6 sm:p-8 shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>Энциклопедия автомобильных брендов и моделей</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">11 производителей</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Справочник японских автомобилей и технологий
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Справочник поколений и модификаций Mitsubishi, Toyota, Nissan, Suzuki, Subaru, Honda, Mazda, Lexus, Infiniti, Daihatsu и Isuzu. Состав и полнота данных зависят от конкретной модели и постепенно расширяются.
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[11px]">Производители</span>
              <span className="font-mono font-bold text-red-400 text-sm">11 марок</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 block text-[11px]">Модели & ТТХ</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">Все поколения</span>
            </div>
            <div className="space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px]">Базовый исходник</span>
              <span className="font-mono font-bold text-amber-400 text-sm">Outlander I</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Selection Logo Grid: Click on Brand Logo to select! */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Выбор производителя по логотипу:
            </span>
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              (нажмите на эмблему марки)
            </span>
          </div>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Активная марка: <strong className="text-red-600 dark:text-red-400">{currentBrand.name} ({currentBrand.russianName})</strong>
          </span>
        </div>

        {/* Scrollable / Wrap Grid of 11 Japanese Brands */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {JAPANESE_BRANDS.map(brand => {
            const isSelected = brand.id === activeBrandId;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => handleBrandChange(brand.id)}
                className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-500/30 scale-102 z-10'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-red-400'
                }`}
                title={`${brand.name} (${brand.russianName})`}
              >
                {/* Brand Logo Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 mb-1.5 p-1 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <BrandLogo brandId={brand.id} className="w-7 h-7" useBrandColor={true} />
                </div>

                <span className="text-[12px] font-bold tracking-tight truncate w-full">
                  {brand.name.split(' ')[0]}
                </span>

                <span
                  className={`text-[10px] font-medium truncate w-full ${
                    isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {brand.russianName}
                </span>

                {brand.id === 'mitsubishi' && (
                  <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-amber-500 text-black text-[9px] font-black rounded-md shadow-2xs">
                    База
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Hero Card & AWD Philosophy */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center p-2.5 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
              <BrandLogo brandId={currentBrand.id} className="w-9 h-9" useBrandColor={true} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentBrand.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-bold">
                  {currentBrand.russianName}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                  с {currentBrand.founded} г.
                </span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                {currentBrand.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isCompareMode
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompareMode ? 'Скрыть сравнение' : 'Сравнить с Outlander I'}</span>
            </button>
          </div>
        </div>

        {/* Brand AWD and Philosophy Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/70 dark:border-slate-800/80 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Философия полного привода марки (AWD / 4WD)</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentBrand.awdPhilosophy}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/70 dark:border-slate-800/80 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Штаб-квартира & Наследие</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              {currentBrand.headquarters}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Основан в {currentBrand.founded} году
            </p>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs Bar for Active Brand */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5">
          <Search className="w-4 h-4 shrink-0 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Поиск по всем маркам, моделям, поколениям и кодам двигателей…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            aria-label="Поиск автомобиля по марке, модели или двигателю"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="text-xs text-red-600 hover:text-red-700">
              Очистить
            </button>
          )}
        </label>
        {searchQuery.trim() && (
          <p className="text-xs text-slate-500">
            Найдено моделей: {filteredModels.length}. Результаты поиска охватывают все марки.
          </p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-4 h-4 text-red-600" />
              <span>Модели {currentBrand.name}</span>
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
              ({currentBrand.models.length} в каталоге)
            </span>
          </div>

          {/* Body Type Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['ALL', 'Кроссовер', 'Внедорожник', 'Седан', 'Универсал', 'Хэтчбек', 'Минивэн', 'Купе/Спорт', 'Пикап'].map(bType => (
              <button
                key={bType}
                onClick={() => setFilterBodyType(bType)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition shrink-0 ${
                  filterBodyType === bType
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {bType === 'ALL' ? 'Все кузова' : bType}
              </button>
            ))}
          </div>
        </div>

        {/* Model Buttons Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {filteredModels.map(model => {
            const isModelSelected = currentModel?.id === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleModelChange(model.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border shadow-2xs ${
                  isModelSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{model.name}</span>
                {searchQuery.trim() && (
                  <span className="text-[10px] opacity-70">{JAPANESE_BRANDS.find(brand => brand.id === model.brandId)?.russianName}</span>
                )}
                {model.isOriginalSourceModel && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500 text-white font-mono font-bold">
                    База
                  </span>
                )}
                <span className="text-[10px] opacity-70 font-mono">
                  {model.years}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Model Details Showcase */}
      {currentModel && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Model Header Strip */}
          <div className="bg-linear-to-r from-slate-100 dark:from-slate-850 to-white dark:to-slate-900 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    {currentBrand.name} · {currentModel.generation}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {currentModel.bodyType}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {currentModel.years}
                  </span>
                  {currentModel.isOriginalSourceModel && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                      ★ Базовый автомобиль исходника
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentModel.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {currentModel.overview}
                </p>
                {currentModel.dataQualityNote && (
                  <div className="mt-2 max-w-3xl rounded-lg border border-amber-300/70 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold">Примечание по данным: </span>
                    {currentModel.dataQualityNote}
                  </div>
                )}
              </div>

              {/* Action Jump to Original Outlander I Tools */}
              {currentModel.isOriginalSourceModel ? (
                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => onNavigateTab('fuel')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Fuel className="w-4 h-4" />
                    <span>Мониторинг топлива (Recharts)</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('specs')}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                  >
                    <Car className="w-4 h-4 text-red-600" />
                    <span>Чертеж габаритов и багажника</span>
                  </button>
                </div>
              ) : (
                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setCompareModelId(currentModel.id);
                      setIsCompareMode(true);
                      window.scrollTo({ top: 800, behavior: 'smooth' });
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition shadow-sm"
                  >
                    <Scale className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                    <span>Сравнить с Outlander I</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Габариты (Д×Ш×В)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentModel.dimensions.lengthMm}×{currentModel.dimensions.widthMm}×{currentModel.dimensions.heightMm} мм
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Клиренс (просвет)</span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400">
                  {currentModel.dimensions.groundClearanceMm} мм
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Колесная база</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentModel.dimensions.wheelbaseMm} мм
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Багажник</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentModel.dimensions.trunkVolumeLiters}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Топливный бак</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentModel.dimensions.fuelTankLiters} л ({currentModel.fuelEconomy.fuelGrade})
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Трансмиссия 4WD</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block" title={currentModel.awdSystemName}>
                  {currentModel.awdSystemName}
                </span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs for the selected Model */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
            {[
              { id: 'overview' as const, label: 'Трансмиссия и привод', icon: Zap },
              { id: 'engines' as const, label: 'Линейка моторов', icon: Gauge, count: currentModel.engines.length },
              { id: 'fluids' as const, label: 'Жидкости и объемы', icon: Droplet },
              { id: 'bulbs' as const, label: 'Лампы и оптика', icon: Lightbulb },
              { id: 'obd' as const, label: 'OBD-II диагностика', icon: Stethoscope },
              { id: 'issues' as const, label: 'Типичные болячки', icon: AlertCircle, count: currentModel.knownIssues.length }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTabSubSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabSubSection(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Sub-Section Content */}
          <div className="p-5 sm:p-6">
            {/* 1. OVERVIEW & DRIVETRAIN */}
            {activeTabSubSection === 'overview' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>Система полного привода (4WD / AWD)</span>
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {currentModel.awdSystemName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentModel.drivetrain}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Коробки передач (Трансмиссии)</span>
                    </span>
                    <div className="space-y-1.5">
                      {currentModel.transmissions.map((t, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fuel Economy Box */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" />
                    <span>Расход топлива и бензин</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Городской цикл</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentModel.fuelEconomy.city}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Загородный (трасса)</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentModel.fuelEconomy.highway}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Смешанный</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentModel.fuelEconomy.combined}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Рекомендованный бензин</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">{currentModel.fuelEconomy.fuelGrade}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ENGINES */}
            {activeTabSubSection === 'engines' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Моторная линейка: характеристики, привод ГРМ и надежность
                  </h4>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                    {currentModel.engines.length} силовых агрегатов
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentModel.engines.map(eng => (
                    <div
                      key={eng.code}
                      className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black font-mono text-red-600 dark:text-red-400">
                              {eng.code}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {eng.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {eng.displacement} · {eng.valves}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                            {eng.powerHp}
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 block">
                            {eng.torqueNm}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-600 dark:text-slate-300 block">Система впрыска:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{eng.fuelSystem}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-300 block">Привод ГРМ:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{eng.timingDrive}</span>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Плюсы и ресурс:</span>
                          </span>
                          <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            {eng.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1 pt-1">
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Особенности и нюансы:</span>
                          </span>
                          <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            {eng.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. FLUIDS & CAPACITIES */}
            {activeTabSubSection === 'fluids' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-red-600" />
                    <span>Спецификации заводских жидкостей и заправочные объёмы</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Моторное масло</span>
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm block">
                      {currentModel.fluidsAndCapacities.engineOilVolume}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {currentModel.fluidsAndCapacities.engineOil}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Трансмиссионное масло (АКПП/Вариатор)</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {currentModel.fluidsAndCapacities.transmissionFluid}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Раздатка и дифференциалы</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {currentModel.fluidsAndCapacities.transferCaseAndDiff}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Охлаждающая жидкость (Антифриз)</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {currentModel.fluidsAndCapacities.coolant}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Тормозная жидкость</span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {currentModel.fluidsAndCapacities.brakeFluid}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. BULBS & LIGHTING */}
            {activeTabSubSection === 'bulbs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Справочник цоколей ламп освещения для {currentModel.name}</span>
                  </h4>
                  {currentModel.isOriginalSourceModel && (
                    <button
                      onClick={() => onNavigateTab('bulbs')}
                      className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Открыть интерактивные схемы оптики Outlander I</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Ближний свет</span>
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm block">
                      {currentModel.bulbsSummary.lowBeam}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Дальний свет</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block">
                      {currentModel.bulbsSummary.highBeam}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Противотуманки (ПТФ)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block">
                      {currentModel.bulbsSummary.fogLights}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Передний поворотник</span>
                    <span className="font-mono font-bold text-amber-500 text-sm block">
                      {currentModel.bulbsSummary.frontTurn}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Стоп-сигналы / габарит</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block">
                      {currentModel.bulbsSummary.tailStop}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Салон / плафоны</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block">
                      {currentModel.bulbsSummary.interior}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. OBD-II DIAGNOSTICS */}
            {activeTabSubSection === 'obd' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-red-600" />
                    <span>Диагностика OBD-II, протокол и расположение разъёма</span>
                  </h4>
                  {currentModel.isOriginalSourceModel && (
                    <button
                      onClick={() => onNavigateTab('obd')}
                      className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Открыть каталог 85+ кодов и графику разъема Outlander I</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Где находится диагностический разъем 16-pin OBD-II:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentModel.obdDiagnostics.portLocation}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Протокол обмена: <strong>{currentModel.obdDiagnostics.protocol}</strong>
                  </div>
                </div>

                {/* Common Codes List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    Характерные коды неисправностей DTC:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentModel.obdDiagnostics.commonCodes.map(codeItem => (
                      <div
                        key={codeItem.code}
                        className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-red-600 dark:text-red-400">
                            {codeItem.code}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {codeItem.title}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {codeItem.hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. KNOWN ISSUES */}
            {activeTabSubSection === 'issues' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Типичные проблемы, симптомы и проверенные решения</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentModel.knownIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                          {issue.title}
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-amber-600 block">Симптомы:</span>
                          <p className="text-slate-600 dark:text-slate-300">{issue.symptoms}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">Первопричина:</span>
                          <p className="text-slate-600 dark:text-slate-300">{issue.rootCause}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-emerald-600 block">Метод устранения:</span>
                          <p className="text-slate-600 dark:text-slate-300">{issue.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison Drawer / Section */}
      {isCompareMode && (
        <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-900/50 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Сравнение: {currentModel.name} против {compareTargetModel.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">С кем сравнить:</span>
              <select
                value={compareModelId}
                onChange={e => setCompareModelId(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {allModelsFlat.map(item => (
                  <option key={item.model.id} value={item.model.id}>
                    {item.brand.name} — {item.model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <th className="py-2.5 px-3 font-semibold text-slate-500">Параметр</th>
                  <th className="py-2.5 px-3 font-bold text-red-600 dark:text-red-400">
                    {currentModel.name}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {compareTargetModel.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Тип кузова</td>
                  <td className="py-2 px-3 font-mono">{currentModel.bodyType}</td>
                  <td className="py-2 px-3 font-mono">{compareTargetModel.bodyType}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Длина × Ширина × Высота</td>
                  <td className="py-2 px-3 font-mono">
                    {currentModel.dimensions.lengthMm} × {currentModel.dimensions.widthMm} × {currentModel.dimensions.heightMm} мм
                  </td>
                  <td className="py-2 px-3 font-mono">
                    {compareTargetModel.dimensions.lengthMm} × {compareTargetModel.dimensions.widthMm} × {compareTargetModel.dimensions.heightMm} мм
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Дорожный просвет (клиренс)</td>
                  <td className="py-2 px-3 font-mono font-bold text-red-600 dark:text-red-400">
                    {currentModel.dimensions.groundClearanceMm} мм
                  </td>
                  <td className="py-2 px-3 font-mono font-bold">
                    {compareTargetModel.dimensions.groundClearanceMm} мм
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Колесная база</td>
                  <td className="py-2 px-3 font-mono">{currentModel.dimensions.wheelbaseMm} мм</td>
                  <td className="py-2 px-3 font-mono">{compareTargetModel.dimensions.wheelbaseMm} мм</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Объем багажного отделения</td>
                  <td className="py-2 px-3 font-mono">{currentModel.dimensions.trunkVolumeLiters}</td>
                  <td className="py-2 px-3 font-mono">{compareTargetModel.dimensions.trunkVolumeLiters}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Система полного привода</td>
                  <td className="py-2 px-3 font-semibold text-emerald-600">{currentModel.awdSystemName}</td>
                  <td className="py-2 px-3 font-semibold text-emerald-600">{compareTargetModel.awdSystemName}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Бензобак и расход (город)</td>
                  <td className="py-2 px-3 font-mono">
                    {currentModel.dimensions.fuelTankLiters} л · {currentModel.fuelEconomy.city}
                  </td>
                  <td className="py-2 px-3 font-mono">
                    {compareTargetModel.dimensions.fuelTankLiters} л · {compareTargetModel.fuelEconomy.city}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { EngineType, DrivetrainType } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Home,
  Car,
  Layers,
  Wrench,
  AlertCircle,
  Disc,
  Calendar,
  Stethoscope,
  BookOpen,
  ChevronDown,
  Zap,
  Sparkles,
  Sun,
  Moon,
  LayoutGrid,
  Check,
  Fuel,
  Menu,
  Lightbulb,
  Smartphone,
  Award,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from './BrandLogos';
import { JAPANESE_BRANDS } from '../data/japaneseBrandsData';

export type TabId = 'overview' | 'garage' | 'settings' | 'brands' | 'fuel' | 'specs' | 'bulbs' | 'parts' | 'fuses' | 'tuning' | 'guides' | 'issues' | 'wheels' | 'maintenance' | 'obd' | 'logbook';
type UiMode = 'phone' | 'wide';

interface Props {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedEngine: EngineType;
  setSelectedEngine: (engine: EngineType) => void;
  selectedDrivetrain: DrivetrainType;
  setSelectedDrivetrain: (dt: DrivetrainType) => void;
  selectedBrandId?: string;
  selectedModelId?: string;
  onSelectBrand?: (brandId: string) => void;
  onOpenBrandSelector?: () => void;
  onOpenApkGuide?: () => void;
  uiMode?: UiMode;
  onChangeUiMode?: (mode: UiMode) => void;
  onRegisterBackHandler?: (handler: () => boolean) => void;
}

export interface NavSection {
  id: TabId;
  title: string;
  shortTitle: string;
  badge?: string;
  description: string;
  icon: any;
}

export default function Header({
  activeTab,
  setActiveTab,
  selectedEngine,
  setSelectedEngine,
  selectedDrivetrain,
  setSelectedDrivetrain,
  selectedBrandId = 'mitsubishi',
  selectedModelId,
  onSelectBrand,
  onOpenBrandSelector,
  onOpenApkGuide,
  uiMode = 'phone',
  onChangeUiMode,
  onRegisterBackHandler
}: Props) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  const sections: NavSection[] = [
    {
      id: 'overview',
      title: 'Главная (Начальная страница)',
      shortTitle: 'Главная',
      description: 'Центр управления, быстрый поиск и сводные данные',
      icon: Home
    },
    { id: 'garage', title: 'Гараж автомобилей', shortTitle: 'Гараж', description: 'Список автомобилей и активная машина', icon: Car },
    { id: 'settings', title: 'Настройки', shortTitle: 'Настройки', description: 'Валюта, единицы измерения и тема', icon: LayoutGrid },
    {
      id: 'brands',
      title: 'Японские автопроизводители и модели',
      shortTitle: 'Авто Японии',
      badge: '11 марок',
      description: 'Все авто Mitsubishi, Toyota, Nissan, Suzuki, Subaru, Honda, Mazda, Lexus, Infiniti, Daihatsu, Isuzu',
      icon: Award
    },
    {
      id: 'fuel',
      title: 'Мониторинг топлива и заправок',
      shortTitle: 'Мониторинг топлива',
      badge: 'Новое',
      description: 'Калькулятор среднего расхода (л/100км), история заправок, чеки',
      icon: Fuel
    },
    {
      id: 'specs',
      title: 'Технические характеристики и размеры',
      shortTitle: 'Размеры и ТТХ',
      badge: 'ТТХ',
      description: 'Габариты кузова, замеры салона, размеры багажника, моторы',
      icon: Car
    },
    {
      id: 'parts',
      title: 'Каталог запчастей (OEM и аналоги)',
      shortTitle: 'Запчасти и аксессуары',
      badge: 'OEM',
      description: 'Расходники, часто ломающиеся детали, каталог запчастей и аксессуары',
      icon: Layers
    },
    {
      id: 'fuses',
      title: 'Схема предохранителей и реле',
      shortTitle: 'Предохранители',
      badge: 'Интерактив',
      description: 'Блок в салоне (за монетницей) и под капотом',
      icon: Zap
    },
    {
      id: 'bulbs',
      title: 'Автосвет и лампы (цоколи H7, H1, H3, T10, W21/5W)',
      shortTitle: 'Лампы и автосвет',
      badge: 'Свет',
      description: 'Все лампочки, цоколи, мощность, интерактивные схемы оптики и замена',
      icon: Lightbulb
    },
    {
      id: 'tuning',
      title: 'Тюнинг, доработки и лайфхаки',
      shortTitle: 'Тюнинг',
      badge: 'Топ',
      description: 'Тормоза от XL, радиатор АКПП, распорки, свет, антикор',
      icon: Sparkles
    },
    {
      id: 'guides',
      title: 'Руководство по ремонту',
      shortTitle: 'Ремонт',
      description: 'Пошаговые мануалы, ГРМ с балансиром, моменты затяжки',
      icon: Wrench
    },
    {
      id: 'issues',
      title: 'Типичные проблемы и болячки',
      shortTitle: 'Болячки',
      description: 'Блок вентиляторов, горловина бака, развальные болты',
      icon: AlertCircle
    },
    {
      id: 'wheels',
      title: 'Диски, шины и калькулятор',
      shortTitle: 'Диски и шины',
      description: 'Шинный калькулятор, заводские параметры 5x114.3',
      icon: Disc
    },
    {
      id: 'maintenance',
      title: 'Регламент ТО и заправочные объёмы',
      shortTitle: 'Регламент ТО',
      description: 'Сетка обслуживания по пробегу, объемы масел и жидкостей',
      icon: Calendar
    },
    {
      id: 'obd',
      title: 'Коды ошибок OBD-II (DTC)',
      shortTitle: 'Ошибки OBD',
      description: 'Расшифровка ошибок P0421, P0431, P0171 и методы устранения',
      icon: Stethoscope
    },
    {
      id: 'logbook',
      title: 'Бортжурнал обслуживания',
      shortTitle: 'Бортжурнал',
      description: 'Учет затрат и выполненных работ с локальным сохранением',
      icon: BookOpen
    },
  ];

  const currentBrand = JAPANESE_BRANDS.find(b => b.id === selectedBrandId) || JAPANESE_BRANDS[0];
  const currentSection = sections.find(s => s.id === activeTab) || sections[0];

  const currentModel = currentBrand.models.find(model => model.id === selectedModelId) || currentBrand.models[0];
  const engines = [
    { id: 'ALL', label: 'Все ДВС' },
    ...(currentModel?.engines || []).map(engine => ({
      id: engine.code,
      label: `${engine.displacement || ''} ${engine.code} (${engine.powerHp || 'мощность не указана'})`.trim()
    }))
  ];

  const goToHome = () => {
    setActiveTab('overview');
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsBrandDropdownOpen(false);
      }
    }

    if (isDropdownOpen || isBrandDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen, isBrandDropdownOpen]);

  const handleSelectSection = (id: TabId) => {
    setActiveTab(id);
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    onRegisterBackHandler?.(() => {
      if (isDropdownOpen) { setIsDropdownOpen(false); return true; }
      if (isBrandDropdownOpen) { setIsBrandDropdownOpen(false); return true; }
      return false;
    });
  }, [isDropdownOpen, isBrandDropdownOpen, onRegisterBackHandler]);

  const isLight = resolvedTheme === 'light';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Block: Brand Logo Button + Home Jump + THE "РАЗДЕЛЫ" BUTTON */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* BRAND LOGO MENU: "У каждого бренда в меню должен быть свой логотип!" */}
            <div className="relative" ref={brandDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsBrandDropdownOpen(!isBrandDropdownOpen);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center gap-2 p-2 sm:px-2.5 sm:py-1.5 rounded-xl border transition cursor-pointer group shadow-2xs ${
                  isBrandDropdownOpen
                    ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-red-500/50'
                }`}
                title={`Выбор производителя: ${currentBrand.name} (${currentBrand.russianName}). Нажмите для меню брендов с логотипами`}
                aria-label={`Выбрать марку автомобиля, сейчас ${currentBrand.russianName || currentBrand.name}`}
                aria-expanded={isBrandDropdownOpen}
                aria-haspopup="dialog"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center p-2 shadow-2xs group-hover:scale-105 transition shrink-0 ${
                  isBrandDropdownOpen ? 'bg-white text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}>
                  <BrandLogo brandId={currentBrand.id} className="w-full h-full" useBrandColor={true} />
                </div>

                <div className="leading-tight text-left">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-black tracking-tight uppercase font-sans transition-colors ${
                      isBrandDropdownOpen ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400'
                    }`}>
                      {currentBrand.russianName || currentBrand.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isBrandDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-red-600'}`} />
                  </div>
                  <span className={`text-xs block ${isBrandDropdownOpen ? 'text-white/80' : 'text-slate-500'}`}>
                    Все бренды
                  </span>
                </div>
              </button>

              {/* BRAND DROPDOWN POPUP MENU - DISTINCT AUTHENTIC LOGO FOR EVERY BRAND */}
              {isBrandDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-[310px] sm:w-[350px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in duration-100 max-h-[85vh] overflow-y-auto">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Меню брендов ({JAPANESE_BRANDS.length})</span>
                    <span className="text-xs text-red-600 dark:text-red-400 font-bold">Оригинальные логотипы</span>
                  </div>

                  <div className="py-1.5 space-y-1">
                    {JAPANESE_BRANDS.map(brand => {
                      const isSelected = brand.id === currentBrand.id;
                      return (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => {
                            if (onSelectBrand) onSelectBrand(brand.id);
                            setActiveTab('brands');
                            setIsBrandDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left group ${
                            isSelected
                              ? 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Every brand has its distinct authentic logo in the menu */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-2 shrink-0 transition-transform group-hover:scale-105 border ${
                              isSelected
                                ? 'bg-white dark:bg-slate-900 border-red-300 dark:border-red-800 shadow-2xs'
                                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 group-hover:border-red-300'
                            }`}>
                              <BrandLogo brandId={brand.id} className="w-6 h-6" useBrandColor={true} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {brand.russianName}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  ({brand.name.split(' ')[0]})
                                </span>
                                {brand.id === 'mitsubishi' && (
                                  <span className="text-xs px-1 py-0.2 rounded bg-amber-500 text-black font-bold">
                                    База
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                                {brand.models.length} моделей · с {brand.founded} г.
                              </span>
                            </div>
                          </div>

                          {isSelected ? (
                            <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBrandDropdownOpen(false);
                        if (onOpenBrandSelector) onOpenBrandSelector();
                      }}
                      className="w-full py-1.5 text-center text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                    >
                      Открыть окно расширенного поиска по всем моделям →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Home Icon Button */}
            <button
              type="button"
              onClick={goToHome}
              className={`p-2 rounded-xl transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title="Открыть начальную страницу (Главная)"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* THE "РАЗДЕЛЫ" DROPDOWN BUTTON - Crisp, clear, NO truncated text */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-sm font-bold transition border shadow-xs ${
                  isDropdownOpen
                    ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700'
                }`}
                title="Нажмите, чтобы открыть меню всех разделов"
                aria-label="Открыть разделы приложения"
                aria-expanded={isDropdownOpen}
                aria-haspopup="dialog"
              >
                <LayoutGrid className={`w-4 h-4 shrink-0 ${isDropdownOpen ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />
                <span className="tracking-tight whitespace-nowrap">
                  Разделы
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 hidden lg:inline max-w-[120px] truncate">
                  ({currentSection.shortTitle})
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
              </button>

              {/* DROPDOWN POPUP MENU - Generous width, full text visibility, NO TRUNCATION! */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-[310px] sm:w-[380px] max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-100 max-h-[82vh] overflow-y-auto">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Все разделы приложения ({sections.length})</span>
                    <span className="text-xs font-mono text-slate-500">Нажмите для перехода</span>
                  </div>

                  <div className="py-1 space-y-1">
                    {sections.map((sec) => {
                      const Icon = sec.icon;
                      const isActive = activeTab === sec.id;

                      return (
                        <button
                          key={sec.id}
                          onClick={() => handleSelectSection(sec.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-start justify-between text-xs group ${
                            isActive
                              ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/60'
                              : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0 pr-2 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-600 dark:group-hover:text-red-400'
                            }`}>
                              {sec.id === 'brands' ? (
                                <BrandLogo brandId={selectedBrandId} className="w-5 h-5" />
                              ) : (
                                <Icon className="w-4 h-4" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                                  {sec.title}
                                </span>
                                {sec.badge && (
                                  <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {sec.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                                {sec.description}
                              </p>

                              {/* Direct in-menu brand logos row for quick switching */}
                              {sec.id === 'brands' && (
                                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                                    <span>Логотипы всех марок:</span>
                                    <span className="text-red-600 dark:text-red-400 font-bold">{currentBrand.russianName}</span>
                                  </div>
                                  <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-1">
                                    {JAPANESE_BRANDS.map(b => (
                                      <button
                                        key={b.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onSelectBrand) onSelectBrand(b.id);
                                          setActiveTab('brands');
                                          setIsDropdownOpen(false);
                                        }}
                                        className={`min-h-11 min-w-11 p-2 rounded-lg border flex flex-col items-center justify-center transition cursor-pointer ${
                                          b.id === selectedBrandId
                                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                                        }`}
                                        title={`${b.name} (${b.russianName})`}
                                      >
                                        <BrandLogo brandId={b.id} className="w-5 h-5" useBrandColor={b.id !== selectedBrandId} />
                                        <span className="text-xs font-bold mt-0.5 truncate w-full text-center">
                                          {b.russianName || b.name.split(' ')[0]}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {isActive && (
                            <Check className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Engine selector & Theme switch */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Engine Picker */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs">
              <span className="text-xs text-slate-600 dark:text-slate-300 uppercase font-semibold mr-1 hidden sm:inline">
                ДВС:
              </span>
              <select
                value={engines.some(engine => engine.id === selectedEngine) ? selectedEngine : 'ALL'}
                onChange={(e) => setSelectedEngine(e.target.value as EngineType)}
                aria-label="Выбрать двигатель"
                className="min-h-11 bg-transparent text-slate-900 dark:text-slate-100 font-mono font-medium outline-none cursor-pointer text-sm"
              >
                {engines.map(eng => (
                  <option key={eng.id} value={eng.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {eng.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Drivetrain Picker (Desktop) */}
            <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 text-xs font-mono">
              <button
                onClick={() => setSelectedDrivetrain('4WD')}
                className={`px-2 py-1 rounded-lg transition ${
                  selectedDrivetrain === '4WD'
                    ? 'bg-red-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                4WD
              </button>
              <button
                onClick={() => setSelectedDrivetrain('FWD')}
                className={`px-2 py-1 rounded-lg transition ${
                  selectedDrivetrain === 'FWD'
                    ? 'bg-red-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                FWD
              </button>
            </div>

            {/* Interface profile selector */}
            {onChangeUiMode && (
              <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5" title="Профиль интерфейса">
                <button type="button" onClick={() => onChangeUiMode('phone')} aria-pressed={uiMode === 'phone'} className={`rounded-lg px-2 py-1.5 text-xs font-bold transition ${uiMode === 'phone' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Телефон</button>
                <button type="button" onClick={() => onChangeUiMode('wide')} aria-pressed={uiMode === 'wide'} className={`rounded-lg px-2 py-1.5 text-xs font-bold transition ${uiMode === 'wide' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Планшет / магнитола</button>
              </div>
            )}

            {/* APK Guide Button */}
            {onOpenApkGuide && (
              <button
                onClick={onOpenApkGuide}
                aria-label="Инструкция по сборке APK"
                className="flex min-h-11 items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 transition shadow-2xs"
                title="Инструкция: как скачать или собрать APK для Android на GitHub"
              >
                <Smartphone className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span className="hidden md:inline font-mono font-bold">APK</span>
              </button>
            )}

            {/* Day / Night Theme Switch */}
            <button
              onClick={toggleTheme}
              className={`flex min-h-11 items-center gap-2 px-2.5 py-1.5 rounded-xl border text-sm font-semibold transition shadow-2xs ${
                isLight
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Переключить тему (Светлая дневная / Тёмная ночная)"
              aria-label="Переключить светлую или тёмную тему"
            >
              {isLight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">День</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Ночь</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

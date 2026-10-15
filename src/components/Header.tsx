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
  Menu
} from 'lucide-react';

export type TabId = 'overview' | 'fuel' | 'specs' | 'parts' | 'fuses' | 'tuning' | 'guides' | 'issues' | 'wheels' | 'maintenance' | 'obd' | 'logbook';

interface Props {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedEngine: EngineType;
  setSelectedEngine: (engine: EngineType) => void;
  selectedDrivetrain: DrivetrainType;
  setSelectedDrivetrain: (dt: DrivetrainType) => void;
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
  setSelectedDrivetrain
}: Props) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sections: NavSection[] = [
    {
      id: 'overview',
      title: 'Главная (Начальная страница)',
      shortTitle: 'Главная',
      description: 'Центр управления, быстрый поиск и сводные данные',
      icon: Home
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
      shortTitle: 'Запчасти',
      badge: 'OEM',
      description: 'Артикулы деталей, заменители CTR/Koyo, быстрый поиск',
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

  const currentSection = sections.find(s => s.id === activeTab) || sections[0];

  const engines = [
    { id: 'ALL', label: 'Все ДВС' },
    { id: '4G63', label: '2.0L 4G63 (136 л.с.)' },
    { id: '4G64', label: '2.4L 4G64 (139-147 л.с.)' },
    { id: '4G69', label: '2.4L 4G69 MIVEC (160 л.с.)' },
    { id: '4G63T', label: '2.0L Turbo 4G63T (201-240 л.с.)' },
  ] as const;

  const goToHome = () => {
    setActiveTab('overview');
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleSelectSection = (id: TabId) => {
    setActiveTab(id);
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLight = resolvedTheme === 'light';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Block: Logo Home Button + Dedicated Home Icon + THE "РАЗДЕЛЫ" BUTTON */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Logo Home Jump */}
            <button
              type="button"
              onClick={goToHome}
              className="flex items-center gap-2 text-left group cursor-pointer"
              title="Перейти на начальную страницу"
            >
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center p-1 shadow-xs group-hover:bg-red-700 transition shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                  <polygon points="50,6 63,28 50,50 37,28" />
                  <polygon points="50,50 63,72 89,72 76,50" />
                  <polygon points="50,50 37,72 11,72 24,50" />
                </svg>
              </div>

              <div className="leading-tight hidden md:block">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans block group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  OUTLANDER <span className="text-red-600">I</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Начальная страница</span>
              </div>
            </button>

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
                className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition border shadow-xs ${
                  isDropdownOpen
                    ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700'
                }`}
                title="Нажмите, чтобы открыть меню всех разделов"
                aria-expanded={isDropdownOpen}
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
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Все разделы приложения ({sections.length})</span>
                    <span className="text-[10px] font-mono text-slate-500">Нажмите для перехода</span>
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
                          <div className="flex items-start gap-2.5 min-w-0 pr-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-600 dark:group-hover:text-red-400'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                                  {sec.title}
                                </span>
                                {sec.badge && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    {sec.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                                {sec.description}
                              </p>
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
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mr-1 hidden sm:inline">
                ДВС:
              </span>
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value as EngineType)}
                className="bg-transparent text-slate-900 dark:text-slate-100 font-mono font-medium outline-none cursor-pointer text-xs"
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

            {/* Day / Night Theme Switch */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
                isLight
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Переключить тему (Светлая дневная / Тёмная ночная)"
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

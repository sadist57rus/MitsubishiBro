import { useState } from 'react';
import {
  Car,
  Layers,
  Zap,
  Sparkles,
  Wrench,
  AlertCircle,
  Disc,
  Calendar,
  Stethoscope,
  BookOpen,
  ArrowRight,
  Search,
  Fuel,
  Droplet,
  ShieldCheck,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { EngineType } from '../types';
import { TabId } from './Header';

interface Props {
  onNavigate: (tab: TabId) => void;
  selectedEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
}

export default function OverviewDashboard({ onNavigate, selectedEngine, onSelectEngine }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'specs' as const,
      title: 'Технические характеристики',
      tag: 'Размеры и ТТХ',
      desc: 'Габариты кузова, точные замеры салона и багажника (мм и литры), спальное место, моторы 4G6',
      icon: Car,
      highlight: '4545×1750 мм, салон 1910 мм, багажник 402–1705 л'
    },
    {
      id: 'parts' as const,
      title: 'Каталог запчастей',
      tag: 'OEM & Аналоги',
      desc: 'Оригинальные артикулы Mitsubishi и проверенные клубом заменители (Koyo, NTN, CTR, Gates)',
      icon: Layers,
      highlight: 'ГРМ, подвеска, фильтры'
    },
    {
      id: 'fuses' as const,
      title: 'Схема предохранителей',
      tag: 'Интерактивная карта',
      desc: 'Блок в салоне (за монетницей) и под капотом: прикуриватель, стоп-сигналы, вентиляторы, печка',
      icon: Zap,
      highlight: 'F1 15A, F9 10A, реле'
    },
    {
      id: 'tuning' as const,
      title: 'Тюнинг и доработки',
      tag: 'Проверенные решения',
      desc: '2-поршневые тормоза от Outlander XL, радиатор АКПП, распорка стоек, Bi-LED свет, антикор бака',
      icon: Sparkles,
      highlight: 'Болт-он тюнинг'
    },
    {
      id: 'guides' as const,
      title: 'Руководство по ремонту',
      tag: 'Спецификации и фото',
      desc: 'Замена ГРМ с секретом фазировки балансирного вала, чистка дросселя SAS, моменты затяжки',
      icon: Wrench,
      highlight: 'Пошаговые мануалы'
    },
    {
      id: 'issues' as const,
      title: 'Типичные болячки',
      tag: 'База неисправностей',
      desc: 'Блок управления вентиляторами, гниющая горловина бензобака, закисающие развальные болты',
      icon: AlertCircle,
      highlight: 'Симптомы и устранение'
    },
    {
      id: 'fuel' as const,
      title: 'Мониторинг топлива',
      tag: 'Калькулятор расхода',
      desc: 'Калькулятор среднего расхода (л/100км), оценка чеков заправок, стоимость километра пути',
      icon: Fuel,
      highlight: 'Калькулятор л/100км, заправки'
    },
    {
      id: 'wheels' as const,
      title: 'Диски и шины',
      tag: 'Шинный калькулятор',
      desc: 'Заводские параметры 5x114.3 DIA 67.1 ET46, расчет изменения клиренса и погрешности спидометра',
      icon: Disc,
      highlight: '215/60 R16, 215/65, 225/55 R17'
    },
    {
      id: 'maintenance' as const,
      title: 'Регламент ТО и жидкости',
      tag: 'Сетка обслуживания',
      desc: 'Регламент обслуживания по пробегу, заправочные объёмы масел (ДВС, АКПП, редукторы) и моменты затяжки',
      icon: Calendar,
      highlight: 'Сетка ТО, объемы масел'
    },
    {
      id: 'obd' as const,
      title: 'Коды ошибок OBD-II',
      tag: 'Диагностика DTC',
      desc: 'Специфика кодов для Outlander I: катализаторы P0421/P0431, бедная смесь P0171, датчики кислорода',
      icon: Stethoscope,
      highlight: 'P0421, P0431, P0171'
    },
    {
      id: 'logbook' as const,
      title: 'Бортжурнал владельца',
      tag: 'Локальное сохранение',
      desc: 'Учёт выполненных работ, расходов на ТО и пробега с сохранением данных в браузере',
      icon: BookOpen,
      highlight: 'История обслуживания'
    }
  ];

  // Quick search keywords router
  const quickSearches = [
    { label: 'Калькулятор расхода топлива', tab: 'fuel' as const },
    { label: 'Размеры кузова и багажника', tab: 'specs' as const },
    { label: 'Ремень ГРМ', tab: 'parts' as const },
    { label: 'Прикуриватель F1', tab: 'fuses' as const },
    { label: 'Тормоза от XL', tab: 'tuning' as const },
    { label: 'Блок вентиляторов', tab: 'issues' as const },
    { label: 'Ошибка P0421', tab: 'obd' as const },
    { label: 'Размер шин', tab: 'wheels' as const },
    { label: 'Масло в АКПП', tab: 'maintenance' as const }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Card: Compact, executive, authentic */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-red-600 dark:text-red-400 uppercase">
                Mitsubishi Motors · Поколение I (2001–2008)
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">CU2W / CU4W / CU5W</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Инженерный справочник Outlander I
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Актуальные артикулы, проверенные аналоги, подробные инструкции по ремонту, схемы электрооборудования и калькуляторы для владельцев первого поколения кроссовера.
            </p>
          </div>

          {/* Quick Engine Switcher */}
          <div className="shrink-0 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Выбор двигателя:</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">{selectedEngine}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'ALL', label: 'Все ДВС' },
                  { id: '4G63', label: '2.0L 4G63' },
                  { id: '4G64', label: '2.4L 4G64' },
                  { id: '4G69', label: '2.4L 4G69' },
                  { id: '4G63T', label: '2.0T Turbo' },
                ] as const
              ).map(eng => (
                <button
                  key={eng.id}
                  onClick={() => onSelectEngine(eng.id as EngineType)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedEngine === eng.id
                      ? 'bg-red-600 text-white shadow-sm font-semibold'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                  }`}
                >
                  {eng.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vital specs strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Разболтовка / PCD</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">5×114.3</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Ступица / ЦО (DIA)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">67.1 мм</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Заводской вылет</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">ET 46 мм</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Объём бензобака</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">60 литров</span>
          </div>
        </div>
      </div>

      {/* Quick Search & Popular queries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Быстрый переход по ключевым запросам
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {quickSearches.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>{item.label}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 9 Sections Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Разделы справочника
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            9 специализированных модулей
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className="group relative cursor-pointer bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/50 dark:hover:border-red-500/50 rounded-xl p-5 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-red-900/50 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {sec.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors flex items-center justify-between">
                      <span>{sec.title}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {sec.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Express Technical Reference Card (Verified Factory Fluids & Torque) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Экспресс-справочник жидкостей и объёмов
            </h2>
          </div>
          <button
            onClick={() => onNavigate('maintenance')}
            className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Полный регламент ТО и калькулятор топлива</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">Моторное масло</span>
            <div className="text-red-600 dark:text-red-400 font-mono font-bold text-sm">4.0 – 4.3 л</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              5W-30 / 5W-40 (ACEA A3/B4, API SN). Фильтр: MD356000 / Mann W610/3.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">Масло АКПП (W4A42)</span>
            <div className="text-red-600 dark:text-red-400 font-mono font-bold text-sm">7.7 л (полный)</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              СТРОГО DiaQueen ATF SP-III. Никаких Dexron и SP-IV. Частичная замена: 4.0–4.5 л.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">Раздатка и задний редуктор</span>
            <div className="text-red-600 dark:text-red-400 font-mono font-bold text-sm">0.55 л + 0.5 л</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              75W-90 API GL-5 Hypoid Gear Oil. Замена каждые 40 000 – 45 000 км.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">Антифриз (ОЖ)</span>
            <div className="text-red-600 dark:text-red-400 font-mono font-bold text-sm">7.0 литров</div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Карбоксилатный G12+ зеленый/красный. Замена крышки радиатора (0.9–1.1 бар) раз в 2 года.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

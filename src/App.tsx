/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header, { TabId } from './components/Header';
import OverviewDashboard from './components/OverviewDashboard';
import TechSpecs from './components/TechSpecs';
import PartsCatalog from './components/PartsCatalog';
import RepairGuides from './components/RepairGuides';
import Troubleshooter from './components/Troubleshooter';
import TireWheelCalculator from './components/TireWheelCalculator';
import MaintenanceHub from './components/MaintenanceHub';
import ObdDiagnostics from './components/ObdDiagnostics';
import GarageLogbook from './components/GarageLogbook';
import FuseDiagram from './components/FuseDiagram';
import TuningHub from './components/TuningHub';
import FuelMonitor from './components/FuelMonitor';
import { useTheme } from './context/ThemeContext';
import { EngineType, DrivetrainType } from './types';
import {
  ChevronLeft,
  Home,
  Fuel,
  Car,
  Layers,
  Zap,
  Sparkles,
  Wrench,
  AlertCircle,
  Disc,
  Calendar,
  Stethoscope,
  BookOpen
} from 'lucide-react';

export default function App() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedEngine, setSelectedEngine] = useState<EngineType>('ALL');
  const [selectedDrivetrain, setSelectedDrivetrain] = useState<DrivetrainType>('4WD');

  const tabTitles: Record<TabId, { title: string; icon: any }> = {
    overview: { title: 'Главная (Обзор)', icon: Home },
    fuel: { title: 'Мониторинг топлива и заправок', icon: Fuel },
    specs: { title: 'Технические характеристики и размеры', icon: Car },
    parts: { title: 'Каталог запчастей', icon: Layers },
    fuses: { title: 'Схема предохранителей', icon: Zap },
    tuning: { title: 'Тюнинг и доработки', icon: Sparkles },
    guides: { title: 'Руководство по ремонту', icon: Wrench },
    issues: { title: 'Типичные болячки', icon: AlertCircle },
    wheels: { title: 'Диски и шины (калькулятор)', icon: Disc },
    maintenance: { title: 'Регламент ТО и жидкости', icon: Calendar },
    obd: { title: 'Коды ошибок OBD-II', icon: Stethoscope },
    logbook: { title: 'Бортжурнал владельца', icon: BookOpen },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.overview;
  const TabIcon = currentTabInfo.icon;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-red-500 selection:text-white">
      {/* Top Header with prominent "Разделы" dropdown */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedEngine={selectedEngine}
        setSelectedEngine={setSelectedEngine}
        selectedDrivetrain={selectedDrivetrain}
        setSelectedDrivetrain={setSelectedDrivetrain}
      />

      {/* Breadcrumb Navigation when inside a sub-module */}
      {activeTab !== 'overview' && (
        <div className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xs transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition font-medium shrink-0"
                title="Вернуться на главную"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>На главную</span>
              </button>

              <span className="text-slate-300 dark:text-slate-700">/</span>

              <div className="flex items-center gap-1.5 min-w-0 font-bold text-slate-900 dark:text-white truncate">
                <TabIcon className="w-4 h-4 text-red-600 shrink-0" />
                <span className="truncate">{currentTabInfo.title}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>ДВС: <strong className="text-red-600 dark:text-red-400">{selectedEngine}</strong></span>
              <span>·</span>
              <span>Привод: <strong className="text-slate-800 dark:text-slate-200">{selectedDrivetrain}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            onNavigate={setActiveTab}
            selectedEngine={selectedEngine}
            onSelectEngine={setSelectedEngine}
          />
        )}

        {activeTab === 'fuel' && (
          <FuelMonitor selectedEngine={selectedEngine} />
        )}

        {activeTab === 'specs' && (
          <TechSpecs />
        )}

        {activeTab === 'parts' && (
          <PartsCatalog
            selectedEngine={selectedEngine}
            onSelectEngine={setSelectedEngine}
          />
        )}

        {activeTab === 'fuses' && (
          <FuseDiagram />
        )}

        {activeTab === 'tuning' && (
          <TuningHub />
        )}

        {activeTab === 'guides' && (
          <RepairGuides
            selectedEngine={selectedEngine}
          />
        )}

        {activeTab === 'issues' && (
          <Troubleshooter
            selectedEngine={selectedEngine}
          />
        )}

        {activeTab === 'wheels' && (
          <TireWheelCalculator />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceHub />
        )}

        {activeTab === 'obd' && (
          <ObdDiagnostics />
        )}

        {activeTab === 'logbook' && (
          <GarageLogbook />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-slate-200">
                Mitsubishi Outlander I (CU2W, CU4W, CU5W / Airtrek) Community Assistant
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Инженерный справочник на основе заводского Workshop Manual, схем электрооборудования и опыта Out-Club.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>PCD 5x114.3 · DIA 67.1 · ET 46</span>
              <span>·</span>
              <span>Бак 60 л</span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Данные выверены по заводским сервисным бюллетеням. Соблюдайте моменты затяжки при работах с ГРМ и тормозной системой.
            </p>
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="hover:text-red-600 dark:hover:text-red-400 transition"
              >
                Главная
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('specs')}
                className="hover:text-red-600 dark:hover:text-red-400 transition"
              >
                Характеристики
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

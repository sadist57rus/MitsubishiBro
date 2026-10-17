/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Star, Monitor, RotateCcw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import FavoriteSectionsPanel, { type FavoriteSection } from './components/FavoriteSectionsPanel';
import Header, { TabId } from './components/Header';
import OverviewDashboard from './components/OverviewDashboard';
import TechSpecs from './components/TechSpecs';
import PartsCatalog from './components/PartsCatalog';
import PartsAccessoriesHub from './components/PartsAccessoriesHub';
import RepairGuides from './components/RepairGuides';
import Troubleshooter from './components/Troubleshooter';
import TireWheelCalculator from './components/TireWheelCalculator';
import MaintenanceHub from './components/MaintenanceHub';
import ObdDiagnostics from './components/ObdDiagnostics';
import GarageLogbook from './components/GarageLogbook';
import FuseDiagram from './components/FuseDiagram';
import TuningHub from './components/TuningHub';
import FuelMonitor from './components/FuelMonitor';
import BulbsCatalog from './components/BulbsCatalog';
import ApkGuideModal from './components/ApkGuideModal';
import JapaneseBrandsHub from './components/JapaneseBrandsHub';
import BrandSelectorModal from './components/BrandSelectorModal';
import { useTheme } from './context/ThemeContext';
import { VehicleProvider, useVehicle } from './context/VehicleContext';
import VehicleDataGate from './components/VehicleDataGate';
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
  BookOpen,
  Lightbulb,
  Smartphone,
  Award
} from 'lucide-react';

function AppContent() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTabState] = useState<TabId>('overview');
  const activeTabRef = useRef<TabId>('overview');
  const handlingPopStateRef = useRef(false);
  const headerBackHandlerRef = useRef<() => boolean>(() => false);
  const lastBackPressRef = useRef(0);
  const [backHint, setBackHint] = useState('');
  const setActiveTab = (tab: TabId) => {
    if (tab === activeTabRef.current) return;
    activeTabRef.current = tab;
    setActiveTabState(tab);
    if (!handlingPopStateRef.current && typeof window !== 'undefined') {
      window.history.pushState({ carBrotherTab: tab }, '', window.location.href);
    }
  };
  const [uiMode, setUiMode] = useState<'phone' | 'wide'>(() => {
    try { return localStorage.getItem('car-brother-ui-mode') === 'wide' ? 'wide' : 'phone'; } catch { return 'phone'; }
  });
  const [orientationChosen, setOrientationChosen] = useState(() => {
    try { return localStorage.getItem('car-brother-orientation-chosen-v2') === 'yes'; } catch { return false; }
  });
  const applyUiMode = async (mode: 'phone' | 'wide') => {
    setUiMode(mode);
    try { await ScreenOrientation.lock({ orientation: mode === 'phone' ? 'portrait' : 'landscape' }); } catch (error) { console.warn('Screen orientation lock is unavailable in this runtime:', error); }
    try { localStorage.setItem('car-brother-ui-mode', mode); } catch { /* storage may be unavailable */ }
  };
  const chooseOrientation = async (mode: 'phone' | 'wide') => {
    await applyUiMode(mode);
    try { localStorage.setItem('car-brother-orientation-chosen-v2', 'yes'); } catch { /* storage may be unavailable */ }
    setOrientationChosen(true);
  };
  useEffect(() => {
    document.documentElement.dataset.uiMode = uiMode;
    try { localStorage.setItem('car-brother-ui-mode', uiMode); } catch { /* storage may be unavailable */ }
  }, [uiMode]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.history.replaceState({ ...(window.history.state || {}), carBrotherTab: activeTabRef.current }, '', window.location.href);
    const onPopState = (event: PopStateEvent) => {
      const next = (event.state?.carBrotherTab as TabId | undefined) || 'overview';
      handlingPopStateRef.current = true;
      activeTabRef.current = next;
      setActiveTabState(next);
      handlingPopStateRef.current = false;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const syncStatusBar = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: resolvedTheme === 'dark' ? '#070b12' : '#ffffff' });
        await StatusBar.setStyle({ style: resolvedTheme === 'dark' ? Style.Light : Style.Dark });
        await StatusBar.show();
      } catch (error) {
        console.warn('Status bar synchronization is unavailable:', error);
      }
    };
    void syncStatusBar();
  }, [resolvedTheme]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let active = true;
    const listener = CapacitorApp.addListener('backButton', () => {
      if (!active) return;
      if (isBrandSelectorOpen) { setIsBrandSelectorOpen(false); return; }
      if (isApkGuideOpen) { setIsApkGuideOpen(false); return; }
      if (headerBackHandlerRef.current()) return;
      if (activeTabRef.current !== 'overview') {
        if (window.history.state?.carBrotherTab) window.history.back();
        else setActiveTab('overview');
        return;
      }
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        void CapacitorApp.exitApp();
        return;
      }
      lastBackPressRef.current = now;
      setBackHint('Нажмите «Назад» ещё раз для выхода');
      window.setTimeout(() => setBackHint(''), 2000);
    });
    return () => {
      active = false;
      void listener.then(handle => handle.remove());
    };
  }, [isBrandSelectorOpen, isApkGuideOpen]);

  const { engine: selectedEngine, setEngine: setSelectedEngine, drivetrain: selectedDrivetrain, setDrivetrain: setSelectedDrivetrain, brandId: selectedBrandId, setBrandId: setSelectedBrandId, modelId: selectedModelId, setModelId: setSelectedModelId } = useVehicle();
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
  const [favoriteSections, setFavoriteSections] = useState<FavoriteSection[]>(() => {
    try { return JSON.parse(localStorage.getItem('car-brother-favorite-sections') || '[]') as FavoriteSection[]; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem('car-brother-favorite-sections', JSON.stringify(favoriteSections)); } catch { /* local storage may be unavailable */ } }, [favoriteSections]);
  const toggleFavorite = (tab: TabId) => setFavoriteSections(previous => previous.some(item => item.id === tab) ? previous.filter(item => item.id !== tab) : [...previous, { id: tab, title: tabTitles[tab]?.title || tab, savedAt: Date.now() }]);
  const removeFavorite = (tab: TabId) => setFavoriteSections(previous => previous.filter(item => item.id !== tab));

  const tabTitles: Record<TabId, { title: string; icon: LucideIcon }> = {
    overview: { title: 'Главная (Обзор)', icon: Home },
    brands: { title: 'Японские автопроизводители и модели', icon: Award },
    fuel: { title: 'Мониторинг топлива и заправок', icon: Fuel },
    specs: { title: 'Технические характеристики и размеры', icon: Car },
    bulbs: { title: 'Автосвет и лампы (цоколи H7, H1, H3, T10)', icon: Lightbulb },
    parts: { title: 'Каталог запчастей и аксессуаров', icon: Layers },
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

  if (!orientationChosen) {
    return (
      <main className="min-h-screen bg-[#070b12] text-white flex items-center justify-center p-5">
        <section className="w-full max-w-xl rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/50 bg-black text-amber-300"><RotateCcw className="h-8 w-8" /></div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-300">CAR BROTHER</p>
          <h1 className="mt-2 text-center text-2xl sm:text-3xl font-black">Выберите ориентацию экрана</h1>
          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-slate-300">Этот выбор появится только при первом запуске. Позже ориентацию можно изменить в настройках приложения.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => void chooseOrientation('phone')} className="rounded-2xl border border-amber-400/50 bg-amber-400/10 p-5 text-left transition hover:bg-amber-400/20"><Smartphone className="h-8 w-8 text-amber-300"/><span className="mt-3 block text-lg font-bold">Телефон</span><span className="mt-1 block text-sm text-slate-300">Портретная ориентация</span><span className="mt-3 block text-xs text-amber-300">Вертикально · по умолчанию</span></button>
            <button type="button" onClick={() => void chooseOrientation('wide')} className="rounded-2xl border border-slate-600 bg-white/5 p-5 text-left transition hover:border-amber-400/50 hover:bg-amber-400/10"><Monitor className="h-8 w-8 text-amber-300"/><span className="mt-3 block text-lg font-bold">Автомагнитола / планшет</span><span className="mt-1 block text-sm text-slate-300">Альбомная ориентация</span><span className="mt-3 block text-xs text-amber-300">Горизонтально</span></button>
          </div>
        </section>
      </main>
    );
  }

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
        selectedBrandId={selectedBrandId}
        onOpenBrandSelector={() => setIsBrandSelectorOpen(true)}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
        onRegisterBackHandler={(handler) => { headerBackHandlerRef.current = handler; }}
        uiMode={uiMode}
        onChangeUiMode={(mode) => { void applyUiMode(mode); }}
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

            <button onClick={() => toggleFavorite(activeTab)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-bold transition ${favoriteSections.some(item => item.id === activeTab) ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-amber-50 dark:bg-slate-800 dark:text-slate-300'}`}><Star className={`w-4 h-4 ${favoriteSections.some(item => item.id === activeTab) ? 'fill-current' : ''}`} />{favoriteSections.some(item => item.id === activeTab) ? 'В избранном' : 'Добавить в избранное'}</button>
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
          <div className="space-y-5"><FavoriteSectionsPanel favorites={favoriteSections} onNavigate={setActiveTab} onRemove={removeFavorite} /><OverviewDashboard
            onNavigate={setActiveTab}
            selectedEngine={selectedEngine}
            onSelectEngine={setSelectedEngine}
            selectedBrandId={selectedBrandId}
            onSelectBrand={setSelectedBrandId}
            onOpenBrandSelector={() => setIsBrandSelectorOpen(true)}
          /></div>
        )}

        {activeTab === 'brands' && (
          <JapaneseBrandsHub
            onNavigateTab={setActiveTab}
            selectedBrandId={selectedBrandId}
            onSelectBrand={setSelectedBrandId}
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
          />
        )}

        {activeTab === 'fuel' && (
          <FuelMonitor selectedEngine={selectedEngine} />
        )}

        {activeTab === 'specs' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><TechSpecs /></VehicleDataGate>
        )}

        {activeTab === 'bulbs' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><BulbsCatalog /></VehicleDataGate>
        )}

        {activeTab === 'parts' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><PartsAccessoriesHub selectedBrandId={selectedBrandId} selectedModelId={selectedModelId} /></VehicleDataGate>
        )}

        {activeTab === 'fuses' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><FuseDiagram /></VehicleDataGate>
        )}

        {activeTab === 'tuning' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><TuningHub /></VehicleDataGate>
        )}

        {activeTab === 'guides' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><RepairGuides selectedEngine={selectedEngine} /></VehicleDataGate>
        )}

        {activeTab === 'issues' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><Troubleshooter selectedEngine={selectedEngine} /></VehicleDataGate>
        )}

        {activeTab === 'wheels' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><TireWheelCalculator /></VehicleDataGate>
        )}

        {activeTab === 'maintenance' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><MaintenanceHub /></VehicleDataGate>
        )}

        {activeTab === 'obd' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><ObdDiagnostics /></VehicleDataGate>
        )}

        {activeTab === 'logbook' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><GarageLogbook /></VehicleDataGate>
        )}
      </main>

      {backHint && <div role="status" className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl">{backHint}</div>}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-slate-200">
                Car Brother — справочник японских автомобилей
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Технические данные, диагностика OBD-II и обслуживание. Сверяйте характеристики с руководством для конкретной модификации.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <button
                onClick={() => setIsApkGuideOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition font-sans font-bold"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Сборка APK на GitHub</span>
              </button>
              <span>Car Brother</span>
              <span>·</span>
              <span>Japan · Auto</span>
            </div>
          </div>
        </div>
      </footer>

      {/* APK Guide Modal */}
      <ApkGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />

      {/* Brand Selector Modal */}
      <BrandSelectorModal
        isOpen={isBrandSelectorOpen}
        onClose={() => setIsBrandSelectorOpen(false)}
        selectedBrandId={selectedBrandId}
        onSelectBrand={setSelectedBrandId}
        onSelectModel={setSelectedModelId}
      />
    </div>
  );
}


export default function App() {
  return <VehicleProvider><AppContent /></VehicleProvider>;
}

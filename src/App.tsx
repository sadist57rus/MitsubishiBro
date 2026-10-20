/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Star, Monitor, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import FavoriteSectionsPanel, { type FavoriteSection } from './components/FavoriteSectionsPanel';
import Header, { TabId } from './components/Header';
const Garage = lazy(() => import('./components/Garage'));
const Settings = lazy(() => import('./components/Settings'));
const OverviewDashboard = lazy(async () => { await import('./data/specsData'); return import('./components/OverviewDashboard'); });
const TechSpecs = lazy(async () => { await import('./data/specsData'); return import('./components/TechSpecs'); });
const PartsCatalog = lazy(async () => { await import('./data/partsData'); return import('./components/PartsCatalog'); });
const PartsAccessoriesHub = lazy(async () => { await import('./data/partsData'); return import('./components/PartsAccessoriesHub'); });
const RepairGuides = lazy(async () => { await import('./data/guidesData'); return import('./components/RepairGuides'); });
const Troubleshooter = lazy(async () => { await import('./data/issuesData'); return import('./components/Troubleshooter'); });
const TireWheelCalculator = lazy(async () => { await import('./data/wheelsData'); return import('./components/TireWheelCalculator'); });
const MaintenanceHub = lazy(async () => { await import('./data/maintenanceData'); return import('./components/MaintenanceHub'); });
const ObdDiagnostics = lazy(async () => { await import('./data/obdData'); return import('./components/ObdDiagnostics'); });
const GarageLogbook = lazy(async () => { return import('./components/GarageLogbook'); });
const FuseDiagram = lazy(async () => { await import('./data/fusesData'); return import('./components/FuseDiagram'); });
const TuningHub = lazy(async () => { await import('./data/tuningData'); return import('./components/TuningHub'); });
const FuelMonitor = lazy(async () => { return import('./components/FuelMonitor'); });
const BulbsCatalog = lazy(async () => { await import('./data/bulbsData'); return import('./components/BulbsCatalog'); });
import ApkGuideModal from './components/ApkGuideModal';
const JapaneseBrandsHub = lazy(async () => { await import('./data/vehicleCatalog'); return import('./components/JapaneseBrandsHub'); });
import BrandSelectorModal from './components/BrandSelectorModal';
import { useTheme } from './context/ThemeContext';
import { JAPANESE_BRANDS } from './data/vehicleCatalog';
import { VehicleProvider, useVehicle } from './context/VehicleContext';
import VehicleDataGate from './components/VehicleDataGate';
import { readStored } from './lib/storage';
import {
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


class SectionErrorBoundary extends React.Component<{ children: React.ReactNode; sectionKey: string }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('Section render failed:', this.props.sectionKey, error); }
  render() { if (!this.state.hasError) return this.props.children; return <section role="alert" className="mx-auto max-w-2xl rounded-2xl border border-red-300 bg-white p-6 text-slate-900 shadow dark:border-red-900 dark:bg-slate-900 dark:text-white"><h2 className="text-xl font-bold">Что-то пошло не так</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Не удалось открыть этот раздел. Можно сбросить его локальные данные и попробовать снова.</p><button className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white" onClick={() => { try { const keys: string[] = []; for (let i=0;i<localStorage.length;i++) { const key=localStorage.key(i); if (key && (key.includes(this.props.sectionKey) || key.includes('outlander1_'))) keys.push(key); } keys.forEach(key => localStorage.removeItem(key)); } catch (error) { console.warn('Storage reset failed', error); } this.setState({ hasError: false }); window.location.reload(); }}>Сбросить данные раздела</button></section>; }
}
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('App render failed:', error); }
  render() { if (!this.state.hasError) return this.props.children; return <main role="alert" className="min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-[#070b12] dark:text-white"><section className="mx-auto max-w-xl rounded-2xl border p-6"><h1 className="text-2xl font-bold">Что-то пошло не так</h1><p className="mt-2">Приложение столкнулось с ошибкой.</p><button className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white" onClick={() => window.location.reload()}>Перезапустить приложение</button></section></main>; }
}

function AppContent() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTabState] = useState<TabId>('overview');
  const activeTabRef = useRef<TabId>('overview');
  const handlingPopStateRef = useRef(false);
  const headerBackHandlerRef = useRef<() => boolean>(() => false);
  const lastBackPressRef = useRef(0);
  const [backHint, setBackHint] = useState('');
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState(false);
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
    try { return true; } catch { return true; }
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
    const statusBarColor = resolvedTheme === 'dark' ? '#070b12' : '#ffffff';
    // Keep browser chrome and the native Android status bar aligned with the active theme.
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', statusBarColor);
    if (!Capacitor.isNativePlatform()) return;

    const syncStatusBar = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: statusBarColor });
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

  const { vehicleId: activeVehicleId, engine: selectedEngine, setEngine: setSelectedEngine, brandId: selectedBrandId, setBrandId: setSelectedBrandId, modelId: selectedModelId, setModelId: setSelectedModelId, vehicles, activeVehicle, addVehicle, updateVehicle } = useVehicle();
  const [setupBrandId, setSetupBrandId] = useState('nissan');
  const setupBrand = JAPANESE_BRANDS.find(brand => brand.id === setupBrandId) || JAPANESE_BRANDS[0];
  const [setupModelId, setSetupModelId] = useState(setupBrand.models[0]?.id || '');
  const [setupYear, setSetupYear] = useState(new Date().getFullYear() - 5);
  const [setupEngine, setSetupEngine] = useState(setupBrand.models[0]?.engines[0]?.code || '');
  const [setupTransmission, setSetupTransmission] = useState(setupBrand.models[0]?.transmissions[0] || '');
  const [setupMileage, setSetupMileage] = useState('0');
  const [setupDrivetrain, setSetupDrivetrain] = useState<'ALL'|'FWD'|'4WD'>('ALL');
  const [setupVin, setSetupVin] = useState('');
  const [profileSelected, setProfileSelected] = useState(() => { try { return localStorage.getItem('car-brother-profile-selected-v1') === 'yes'; } catch { return false; } });
  useEffect(() => { const model=setupBrand.models.find(item=>item.id===setupModelId)||setupBrand.models[0]; if(model){setSetupModelId(model.id);setSetupEngine(model.engines[0]?.code||'');setSetupTransmission(model.transmissions[0]||'');} }, [setupBrandId]);
  const [favoriteSections, setFavoriteSections] = useState<FavoriteSection[]>(() => readStored<FavoriteSection[]>(
    'car-brother-favorite-sections',
    (value): value is FavoriteSection[] => Array.isArray(value) && value.every((item) =>
      !!item && typeof item === 'object' &&
      typeof (item as FavoriteSection).id === 'string' &&
      typeof (item as FavoriteSection).title === 'string' &&
      typeof (item as FavoriteSection).savedAt === 'number'
    ),
    []
  ));
  useEffect(() => { try { localStorage.setItem('car-brother-favorite-sections', JSON.stringify(favoriteSections)); } catch { /* local storage may be unavailable */ } }, [favoriteSections]);
  const toggleFavorite = (tab: TabId) => setFavoriteSections(previous => previous.some(item => item.id === tab) ? previous.filter(item => item.id !== tab) : [...previous, { id: tab, title: tabTitles[tab]?.title || tab, savedAt: Date.now() }]);
  const removeFavorite = (tab: TabId) => setFavoriteSections(previous => previous.filter(item => item.id !== tab));

  const tabTitles: Record<TabId, { title: string; icon: LucideIcon }> = {
    overview: { title: 'Главная (Обзор)', icon: Home },
    garage: { title: 'Гараж автомобилей', icon: Car },
    settings: { title: 'Настройки', icon: Monitor },
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
    more: { title: 'Ещё', icon: MoreHorizontal },
  };

  const phonePrimaryNavigation: TabId[] = ['overview', 'garage', 'maintenance', 'obd'];
  const widePrimaryNavigation: TabId[] = ['overview', 'garage', 'maintenance', 'obd', 'fuel', 'logbook'];
  const primaryNavigation = uiMode === 'wide' ? widePrimaryNavigation : phonePrimaryNavigation;
  const shortTabTitles: Record<TabId, string> = {
    overview: 'Главная', garage: 'Авто', settings: 'Настройки', brands: 'Марки',
    fuel: 'Топливо', specs: 'Характеристики', bulbs: 'Лампы', parts: 'Запчасти',
    fuses: 'Предохранители', tuning: 'Тюнинг', guides: 'Ремонт',
    issues: 'Частые поломки', wheels: 'Шины и диски', maintenance: 'ТО',
    obd: 'Ошибки OBD', logbook: 'Журнал', more: 'Ещё',
  };
  const currentTabInfo = tabTitles[activeTab] || tabTitles.overview;

  if (!orientationChosen) {
    return (
      <main className="min-h-screen bg-[#070b12] text-white flex items-center justify-center p-5">
        <section className="w-full max-w-xl rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
          <div className="mx-auto mb-5 flex justify-center">
            <img src="/app-icon.svg" alt="Car Brother" className="h-32 w-32 rounded-[1.6rem] border border-amber-300/50 shadow-[0_12px_45px_rgba(245,158,11,0.2)]" />
          </div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-300">GARAGE COMPANION</p>
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

  if (orientationChosen && (!profileSelected || vehicles.length === 0)) {
    const model = setupBrand.models.find(item => item.id === setupModelId) || setupBrand.models[0];
    return (
      <main className={"car-vehicle-setup min-h-screen bg-slate-100 dark:bg-[#070b12] text-slate-900 dark:text-white flex items-center justify-center p-4 " + (uiMode === 'wide' ? 'car-vehicle-setup-wide' : '')}>
        <section className="w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-6"><img src="/app-icon.svg" alt="Car Brother" className="h-16 w-16 shrink-0 rounded-2xl shadow-lg" /><div><p className="text-sm font-bold uppercase tracking-widest text-red-600">CAR BROTHER</p><h1 className="text-3xl md:text-4xl font-black">Добавим вашу машину</h1></div></div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8">Выберите автомобиль — стартовый экран, характеристики и журнал будут привязаны к нему. Никакой марки по умолчанию.</p>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-base md:text-lg font-bold">Марка<select className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-lg md:text-xl" value={setupBrandId} onChange={event => { const id=event.target.value; const brand=JAPANESE_BRANDS.find(item=>item.id===id)!; setSetupBrandId(id); setSetupModelId(brand.models[0]?.id||''); setSetupEngine(brand.models[0]?.engines[0]?.code||''); setSetupTransmission(brand.models[0]?.transmissions[0]||''); }}>{JAPANESE_BRANDS.map(brand=><option key={brand.id} value={brand.id}>{brand.russianName || brand.name}</option>)}</select></label>
            <label className="block text-base md:text-lg font-bold">Модель<select className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-lg md:text-xl" value={setupModelId} onChange={event=>{const id=event.target.value;const item=setupBrand.models.find(value=>value.id===id);setSetupModelId(id);setSetupEngine(item?.engines[0]?.code||''); setSetupTransmission(item?.transmissions[0]||'');}}>{setupBrand.models.map(item=><option key={item.id} value={item.id}>{item.name} ({item.years})</option>)}</select></label>
            <label className="block text-base md:text-lg font-bold">Год выпуска<input className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-xl" type="number" min="1950" max={new Date().getFullYear()+1} value={setupYear} onChange={event=>setSetupYear(Number(event.target.value))}/></label>
            <label className="block text-base md:text-lg font-bold">Двигатель<select className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-lg md:text-xl" value={setupEngine} onChange={event=>setSetupEngine(event.target.value)}><option value="">Пока не знаю</option>{(model?.engines||[]).map(engine=><option key={engine.code} value={engine.code}>{engine.displacement||''} {engine.code} {engine.powerHp ? '(' + engine.powerHp + ' л.с.)' : ''}</option>)}</select></label>
            <label className="block text-base md:text-lg font-bold">Коробка передач<select className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-lg md:text-xl" value={setupTransmission} onChange={event=>setSetupTransmission(event.target.value)}><option value="">Пока не знаю</option>{(model?.transmissions||[]).map(transmission=><option key={transmission} value={transmission}>{transmission}</option>)}</select></label>
            <label className="block text-base md:text-lg font-bold">Привод<select className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-lg md:text-xl" value={setupDrivetrain} onChange={event=>setSetupDrivetrain(event.target.value as 'ALL'|'FWD'|'4WD')}><option value="ALL">Не знаю / не указан</option><option value="FWD">Передний</option><option value="4WD">Полный</option></select></label>
            <label className="block text-base md:text-lg font-bold">VIN (необязательно)<input className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-lg md:text-xl" maxLength={17} value={setupVin} onChange={event=>setSetupVin(event.target.value.toUpperCase())} placeholder="17 символов"/></label>
            <label className="block text-base md:text-lg font-bold">Текущий пробег, км<input className="mt-2 min-h-16 w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-xl" type="number" min="0" inputMode="numeric" value={setupMileage} onChange={event=>setSetupMileage(event.target.value)}/></label>
          </div>
          <button className="mt-8 min-h-16 w-full rounded-2xl bg-red-600 px-6 text-xl md:text-2xl font-black text-white shadow-lg hover:bg-red-700" onClick={()=>{ const vehicle={brandId:setupBrand.id,modelId:model.id,year:setupYear,mileage:Math.max(0,Number(setupMileage)||0),vin:setupVin.trim()||undefined,engine:setupEngine||'не указан',transmission:setupTransmission||'не указана',drivetrain:setupDrivetrain,currency:'RUB'}; if(vehicles.length) updateVehicle({...activeVehicle,...vehicle}); else addVehicle(vehicle); try { localStorage.setItem('car-brother-profile-selected-v1','yes'); } catch {} setProfileSelected(true); }}>Сохранить автомобиль и открыть приложение</button>
        </section>
      </main>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-red-500 selection:text-white ${uiMode === "wide" ? "car-brother-wide" : ""}`}>
      <Header
        title={currentTabInfo.title}
        showBack={activeTab !== 'overview'}
        onBack={() => setActiveTab('overview')}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
        onRegisterBackHandler={(handler) => { headerBackHandlerRef.current = handler; }}
      />

      {uiMode === 'wide' && (
        <nav aria-label="Основная навигация" className="car-brother-rail" data-testid="wide-navigation-rail">
          {widePrimaryNavigation.map(id => {
            const item = tabTitles[id];
            const Icon = item.icon;
            return (
              <button
                key={id}
                type="button"
                data-testid={`wide-nav-item-${id}`}
                aria-label={shortTabTitles[id]}
                aria-current={activeTab === id ? 'page' : undefined}
                title={shortTabTitles[id]}
                onClick={() => setActiveTab(id)}
                className={`car-brother-rail-item ${activeTab === id ? 'is-active' : ''}`}
              >
                <Icon aria-hidden="true" size={28} />
                <span>{shortTabTitles[id]}</span>
              </button>
            );
          })}
          <button type="button" data-testid="wide-more-trigger" aria-label="Ещё" aria-current={activeTab === 'more' ? 'page' : undefined} onClick={() => setActiveTab('more')} className={`car-brother-rail-item ${activeTab === 'more' ? 'is-active' : ''}`}>
            <MoreHorizontal aria-hidden="true" size={28} /><span>Ещё</span>
          </button>
        </nav>
      )}

      {activeTab !== 'overview' && activeTab !== 'more' && (
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 flex justify-end">
          <button data-testid="section-favorite-toggle" type="button" aria-pressed={favoriteSections.some(item => item.id === activeTab)} onClick={() => toggleFavorite(activeTab)} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 font-semibold transition ${favoriteSections.some(item => item.id === activeTab) ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'}`}>
            <Star className={`w-4 h-4 ${favoriteSections.some(item => item.id === activeTab) ? 'fill-current' : ''}`} />
            {favoriteSections.some(item => item.id === activeTab) ? 'В избранном' : 'В избранное'}
          </button>
        </div>
      )}

      {/* Main Container */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          swipeStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const start = swipeStartRef.current;
          swipeStartRef.current = null;
          const touch = event.changedTouches[0];
          if (!start || !touch) return;
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (dx < 90 || Math.abs(dy) > 70 || dx < Math.abs(dy) * 1.25) return;
          if (isBrandSelectorOpen) { setIsBrandSelectorOpen(false); return; }
          if (isApkGuideOpen) { setIsApkGuideOpen(false); return; }
          if (headerBackHandlerRef.current()) return;
          if (activeTabRef.current !== 'overview') {
            if (window.history.state?.carBrotherTab) window.history.back();
            else setActiveTab('overview');
          }
        }}
      >
        <SectionErrorBoundary key={activeTab} sectionKey={activeTab}><Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Загрузка раздела…</div>}>
        {activeTab === 'overview' && (
          <div className="space-y-5"><OverviewDashboard
            onNavigate={setActiveTab}
            selectedEngine={selectedEngine}
            onSelectEngine={setSelectedEngine}
            selectedBrandId={selectedBrandId}
            onSelectBrand={setSelectedBrandId}
            onOpenBrandSelector={() => setIsBrandSelectorOpen(true)}
          /></div>
        )}

        {activeTab === 'more' && (
          <section className="mx-auto w-full max-w-6xl space-y-5" aria-labelledby="more-screen-title">
            {favoriteSections.length > 0 && <FavoriteSectionsPanel favorites={favoriteSections} onNavigate={setActiveTab} onRemove={removeFavorite} />}
            <div>
              <h2 id="more-screen-title" className="text-xl font-black text-slate-900 dark:text-white">Дополнительные разделы</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Справочные разделы и настройки</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" data-testid="more-screen-grid">
              {Object.entries(tabTitles).filter(([id]) => !primaryNavigation.includes(id as TabId) && id !== 'more').map(([id, item]) => {
                const sectionId = id as TabId;
                const Icon = item.icon;
                return <button key={id} type="button" data-testid={`more-nav-item-${id}`} onClick={() => setActiveTab(sectionId)} className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-900 transition hover:border-red-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-red-600 dark:bg-slate-800 dark:text-red-400"><Icon aria-hidden="true" size={24} /></span>
                  <span>{shortTabTitles[sectionId]}</span>
                </button>;
              })}
            </div>
          </section>
        )}

        {activeTab === 'garage' && <Garage />}
        {activeTab === 'settings' && <Settings uiMode={uiMode} onChangeUiMode={(mode) => { void applyUiMode(mode); }} />}

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
          <FuelMonitor key={activeVehicleId} selectedEngine={selectedEngine} />
        )}

        {activeTab === 'specs' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><TechSpecs /></VehicleDataGate>
        )}

        {activeTab === 'bulbs' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><BulbsCatalog /></VehicleDataGate>
        )}

        {activeTab === 'parts' && (
          <VehicleDataGate onOpenJapaneseCars={() => setActiveTab('brands')}><PartsAccessoriesHub selectedBrandId={selectedBrandId} selectedModelId={selectedModelId} /></VehicleDataGate>
        )}

        {activeTab === 'fuses' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><FuseDiagram /></VehicleDataGate>
        )}

        {activeTab === 'tuning' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><TuningHub /></VehicleDataGate>
        )}

        {activeTab === 'guides' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><RepairGuides selectedEngine={selectedEngine} /></VehicleDataGate>
        )}

        {activeTab === 'issues' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><Troubleshooter selectedEngine={selectedEngine} /></VehicleDataGate>
        )}

        {activeTab === 'wheels' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><TireWheelCalculator /></VehicleDataGate>
        )}

        {activeTab === 'maintenance' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><MaintenanceHub /></VehicleDataGate>
        )}

        {activeTab === 'obd' && (
          <VehicleDataGate requiredModelId="outlander-1" onOpenJapaneseCars={() => setActiveTab('brands')}><ObdDiagnostics /></VehicleDataGate>
        )}

        {activeTab === 'logbook' && <GarageLogbook key={activeVehicleId} />}
        </Suspense></SectionErrorBoundary>
      </main>

      {uiMode === 'phone' && (
        <nav aria-label="Основная навигация" className="car-brother-bottom-nav" data-testid="phone-bottom-navigation">
          {([
            { id: 'overview', label: 'Главная', icon: Home },
            { id: 'garage', label: 'Авто', icon: Car },
            { id: 'maintenance', label: 'ТО', icon: Calendar },
            { id: 'obd', label: 'Диагностика', icon: Stethoscope },
          ] as const).map(item => {
            const Icon = item.icon;
            return <button key={item.id} type="button" data-testid={`phone-nav-item-${item.id}`} aria-current={activeTab === item.id ? 'page' : undefined} onClick={() => setActiveTab(item.id)} className={`car-brother-bottom-nav-item ${activeTab === item.id ? 'is-active' : ''}`}>
              <Icon aria-hidden="true" size={21} /><span>{item.label}</span>
            </button>;
          })}
          <button type="button" data-testid="phone-more-trigger" className={`car-brother-bottom-nav-item ${activeTab === 'more' ? 'is-active' : ''}`} aria-current={activeTab === 'more' ? 'page' : undefined} aria-label="Ещё" onClick={() => setActiveTab('more')}>
            <MoreHorizontal aria-hidden="true" size={21} /><span>Ещё</span>
          </button>
        </nav>
      )}

      {backHint && <div role="status" className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl">{backHint}</div>}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-slate-200">
                Car Brother — справочник японских автомобилей
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Технические данные, диагностика OBD-II и обслуживание. Сверяйте характеристики с руководством для конкретной модификации.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <button
                onClick={() => setIsApkGuideOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition font-sans font-bold"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Сборка APK на GitHub</span>
              </button>
              <span>Car Brother</span>
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
        onClose={() => {
          setIsBrandSelectorOpen(false);
          window.requestAnimationFrame(() => {
            document.querySelector<HTMLButtonElement>('[aria-label^="Выбрать марку автомобиля"]')?.focus();
          });
        }}
        selectedBrandId={selectedBrandId}
        onSelectBrand={setSelectedBrandId}
        onSelectModel={setSelectedModelId}
      />
    </div>
  );
}


export default function App() {
  return <AppErrorBoundary><VehicleProvider><AppContent /></VehicleProvider></AppErrorBoundary>;
}

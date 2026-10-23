import { useState } from 'react';
import { removeStored } from '../lib/storage';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { EngineType, DrivetrainType } from '../types';
import { X, Sun, Moon, Laptop, Settings, Fuel, Wrench, Shield, Check, Trash2, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedEngine: EngineType;
  setSelectedEngine: (eng: EngineType) => void;
  selectedDrivetrain: DrivetrainType;
  setSelectedDrivetrain: (dt: DrivetrainType) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  selectedEngine,
  setSelectedEngine,
  selectedDrivetrain,
  setSelectedDrivetrain,
}: Props) {
  const { theme, setTheme } = useTheme();
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleClearCache = () => setShowResetConfirm(true);

  const confirmClearAppData = () => {
    const appKeys = [
      'car-brother-garage', 'car-brother-vehicle', 'car-brother-storage-schema',
      'car-brother-theme', 'outlander1_theme_v2', 'car-brother-color-palette',
      'outlander1_garage_logbook_v1', 'outlander1_fuel_logs_v2',
      'car-brother-ui-mode', 'car-brother-orientation-chosen-v2',
      'car-brother-profile-selected-v1', 'car-brother-favorite-sections',
    ];
    appKeys.forEach(removeStored);
    try {
      const dynamicKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('car-brother-logbook-') || key.startsWith('car-brother-fuel-logs-'))) dynamicKeys.push(key);
      }
      dynamicKeys.forEach(removeStored);
    } catch (error) {
      console.warn('Could not enumerate application storage keys:', error);
    }
    setShowResetConfirm(false);
    setResetConfirmed(true);
    window.setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Настройки приложения
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Тема оформления, параметры вашего авто и управление данными
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 overflow-y-auto text-xs">
          {/* Theme Selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Цветовая тема оформления
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                  theme === 'light'
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-600 text-red-600 dark:text-red-400 font-bold ring-2 ring-red-500/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Светлая</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                  theme === 'dark'
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-600 text-red-600 dark:text-red-400 font-bold ring-2 ring-red-500/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Темная</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition ${
                  theme === 'system'
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-600 text-red-600 dark:text-red-400 font-bold ring-2 ring-red-500/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Laptop className="w-5 h-5" />
                <span>Системная</span>
              </button>
            </div>
          </div>

          {/* Vehicle Engine Configuration */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Двигатель по умолчанию для каталога
            </span>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {[
                { id: 'ALL', label: 'Все двигатели' },
                { id: '4G63', label: '2.0L 4G63 (136 л.с.)' },
                { id: '4G64', label: '2.4L 4G64 (139-160 л.с.)' },
                { id: '4G69', label: '2.4L MIVEC 4G69 (160 л.с.)' },
                { id: '4G63T', label: '2.0L Turbo 4G63T (Airtrek)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedEngine(item.id as EngineType)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    selectedEngine === item.id
                      ? 'bg-red-50 dark:bg-red-950/50 border-red-600 text-red-600 dark:text-red-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drivetrain Option */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Тип привода
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setSelectedDrivetrain('4WD')}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  selectedDrivetrain === '4WD'
                    ? 'bg-red-50 dark:bg-red-950/50 border-red-600 text-red-600 dark:text-red-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold">4WD (Полный привод)</span>
                  <span className="text-xs text-slate-500">Постоянный 50:50 с вискомуфтой</span>
                </div>
                {selectedDrivetrain === '4WD' && <Check className="w-4 h-4 text-red-600 dark:text-red-400" />}
              </button>

              <button
                onClick={() => setSelectedDrivetrain('FWD')}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  selectedDrivetrain === 'FWD'
                    ? 'bg-red-50 dark:bg-red-950/50 border-red-600 text-red-600 dark:text-red-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold">2WD (Передний привод)</span>
                  <span className="text-xs text-slate-500">Модели без раздатки и редуктора</span>
                </div>
                {selectedDrivetrain === 'FWD' && <Check className="w-4 h-4 text-red-600 dark:text-red-400" />}
              </button>
            </div>
          </div>

          {/* Reset / Clear Data Button */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Данные бортжурнала:</span>
            <button
              onClick={handleClearCache}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Очистить хранилище</span>
            </button>
          </div>
        </div>

        {showResetConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="clear-app-data-title">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <h2 id="clear-app-data-title" className="text-lg font-bold">Очистить данные Nippon-Drive?</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Будут удалены сохранённые автомобили, записи бортжурнала и заправок, избранные разделы и настройки приложения. Другие данные сайта в браузере не затрагиваются.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowResetConfirm(false)} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold dark:border-slate-600">Отмена</button>
                <button type="button" onClick={confirmClearAppData} className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white">Очистить данные приложения</button>
              </div>
            </div>
          </div>
        )}
        {resetConfirmed && <p role="status" className="px-5 pb-3 text-sm text-emerald-700 dark:text-emerald-300">Данные приложения очищены. Перезапуск…</p>}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

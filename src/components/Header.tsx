import { useEffect } from 'react';
import { ChevronLeft, Smartphone } from 'lucide-react';

export type TabId = 'overview' | 'garage' | 'settings' | 'brands' | 'fuel' | 'specs' | 'bulbs' | 'parts' | 'fuses' | 'tuning' | 'guides' | 'issues' | 'wheels' | 'maintenance' | 'obd' | 'logbook' | 'more';

interface Props {
  title: string;
  showBack: boolean;
  onBack: () => void;
  onOpenApkGuide?: () => void;
  onRegisterBackHandler?: (handler: () => boolean) => void;
}

export default function Header({ title, showBack, onBack, onOpenApkGuide, onRegisterBackHandler }: Props) {
  useEffect(() => {
    onRegisterBackHandler?.(() => false);
    return () => onRegisterBackHandler?.(() => false);
  }, [onRegisterBackHandler]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex min-h-14 items-center gap-3 py-2">
          {showBack && (
            <button
              type="button"
              data-testid="header-back"
              aria-label="Назад"
              onClick={onBack}
              className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-800 transition hover:border-red-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <ChevronLeft aria-hidden="true" size={20} />
              <span>Назад</span>
            </button>
          )}
          <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-slate-900 dark:text-white" data-testid="header-section-title">{title}</h1>
          {onOpenApkGuide && (
            <button
              type="button"
              onClick={onOpenApkGuide}
              aria-label="Инструкция по сборке APK"
              title="Инструкция по сборке APK"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-700 transition hover:border-red-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Smartphone aria-hidden="true" size={20} />
              <span className="hidden sm:inline">APK</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { JAPANESE_BRANDS, JapaneseBrand } from '../data/vehicleCatalog';
import { BrandLogo } from './BrandLogos';
import { X, Search, Check, ChevronRight, Award, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedBrandId: string;
  onSelectBrand: (brandId: string) => void;
  onSelectModel?: (modelId: string) => void;
}

export default function BrandSelectorModal({
  isOpen,
  onClose,
  selectedBrandId,
  onSelectBrand,
  onSelectModel
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOtherBrands, setShowOtherBrands] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || []).filter(element => element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0);
    (focusable()[0] || dialog)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onCloseRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBrands = JAPANESE_BRANDS.filter(brand => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      brand.name.toLowerCase().includes(q) ||
      brand.russianName.toLowerCase().includes(q) ||
      brand.models.some(m => m.name.toLowerCase().includes(q))
    );
  });

  const primaryBrandIds = ['toyota', 'mitsubishi', 'nissan', 'mazda', 'honda'];
  const visibleBrands = searchQuery.trim()
    ? filteredBrands
    : filteredBrands.filter(brand => showOtherBrands || primaryBrandIds.includes(brand.id));

  const handleChooseBrand = (brand: JapaneseBrand) => {
    onSelectBrand(brand.id);
    if (onSelectModel && brand.models.length > 0) {
      onSelectModel(brand.models[0].id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brand-selector-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 id="brand-selector-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Выбор японского производителя
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Toyota, Mitsubishi, Nissan, Mazda, Honda и другие марки
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Закрыть выбор марки"
            className="min-h-11 min-w-11 p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по марке (Mitsubishi, Toyota, Nissan, Suzuki...) или модели..."
              aria-label="Поиск марки или модели"
              className="w-full min-h-11 pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {visibleBrands.map(brand => {
              const isSelected = brand.id === selectedBrandId;
              return (
                <div
                  key={brand.id}
                  onClick={() => handleChooseBrand(brand)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleChooseBrand(brand); } }}
                  aria-label={`Выбрать ${brand.russianName || brand.name}`}
                  className={`group flex min-w-0 min-h-11 flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border transition cursor-pointer text-center ${
                    isSelected
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-500 ring-2 ring-red-500/20'
                      : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-red-300'
                  }`}
                >
                  {/* Brand Logo Container */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center p-2 shrink-0 transition-transform group-hover:scale-105 border ${
                      isSelected
                        ? 'bg-white text-slate-900 border-red-500 shadow-2xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 group-hover:border-red-400'
                    }`}
                  >
                    <BrandLogo brandId={brand.id} className="w-7 h-7" useBrandColor={true} />
                  </div>

                  <div className="min-w-0 w-full">
                    <div className="flex min-w-0 items-center justify-center gap-1">
                      <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
                        <span className="max-w-full break-words font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {brand.name}
                        </span>
                        {brand.id === 'mitsubishi' && (
                          <span className="text-xs px-1.5 py-0.2 rounded bg-amber-500 text-black font-bold">
                            База
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1 text-xs sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>{brand.russianName}</span>
                      <span>·</span>
                      <span>с {brand.founded} г.</span>
                    </div>

                    <p className="hidden sm:block text-xs text-slate-600 dark:text-slate-400 mt-1 break-words">
                      Модели: {brand.models.map(m => m.name.split(' ')[0]).join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {!searchQuery.trim() && (
            <button
              type="button"
              aria-expanded={showOtherBrands}
              onClick={() => setShowOtherBrands(value => !value)}
              className="mt-3 min-h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transition"
            >
              {showOtherBrands ? 'Скрыть' : 'Другие'}
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="min-w-0 flex-1">Нажмите на любую марку, чтобы открыть её спецификации</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

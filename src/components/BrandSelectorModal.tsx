import React, { useState } from 'react';
import { JAPANESE_BRANDS, JapaneseBrand } from '../data/japaneseBrandsData';
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

  const handleChooseBrand = (brand: JapaneseBrand) => {
    onSelectBrand(brand.id);
    if (onSelectModel && brand.models.length > 0) {
      onSelectModel(brand.models[0].id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
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
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Выбор японского производителя
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                11 легендарных брендов Японии и все поколения моделей
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
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
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {filteredBrands.map(brand => {
              const isSelected = brand.id === selectedBrandId;
              return (
                <div
                  key={brand.id}
                  onClick={() => handleChooseBrand(brand)}
                  className={`group flex min-w-0 flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border transition cursor-pointer text-center ${
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
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-black font-bold">
                            База
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{brand.russianName}</span>
                      <span>·</span>
                      <span>с {brand.founded} г.</span>
                    </div>

                    <p className="hidden sm:block text-[11px] text-slate-600 dark:text-slate-400 mt-1 break-words">
                      Модели: {brand.models.map(m => m.name.split(' ')[0]).join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Нажмите на любую марку, чтобы открыть её спецификации</span>
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

import { useState, useMemo } from 'react';
import { PARTS_DATABASE } from '../data/partsData';
import { EngineType, PartItem } from '../types';
import { Search, Copy, Check, ExternalLink, AlertTriangle, ShieldCheck, Wrench, Layers, Tag, Fuel } from 'lucide-react';

interface Props {
  selectedEngine: EngineType;
  onSelectEngine: (engine: EngineType) => void;
}

export default function PartsCatalog({ selectedEngine, onSelectEngine }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Все категории' },
    { id: 'engine', label: 'Двигатель и ГРМ' },
    { id: 'cooling', label: 'Система охлаждения' },
    { id: 'filters_fluids', label: 'Фильтры и жидкости' },
    { id: 'suspension_front', label: 'Передняя подвеска' },
    { id: 'suspension_rear', label: 'Задняя подвеска' },
    { id: 'brakes', label: 'Тормозная система' },
    { id: 'transmission', label: 'Трансмиссия и кардан' },
    { id: 'ignition_sensors', label: 'Зажигание и датчики' },
    { id: 'body_interior', label: 'Кузов и бак' },
  ];

  const filteredParts = useMemo(() => {
    return PARTS_DATABASE.filter((part) => {
      // Category filter
      if (selectedCategory !== 'all' && part.category !== selectedCategory) {
        return false;
      }

      // Engine filter
      if (
        selectedEngine !== 'ALL' &&
        !part.engines.includes('ALL') &&
        !part.engines.includes(selectedEngine)
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = part.name.toLowerCase().includes(q);
        const matchesOem = part.oemNumber.toLowerCase().includes(q);
        const matchesAltOem = part.alternateOem?.some(o => o.toLowerCase().includes(q));
        const matchesAnalogs = part.analogs.some(
          a => a.brand.toLowerCase().includes(q) || a.partNumber.toLowerCase().includes(q)
        );
        const matchesDesc = part.description.toLowerCase().includes(q);
        return matchesName || matchesOem || matchesAltOem || matchesAnalogs || matchesDesc;
      }

      return true;
    });
  }, [selectedCategory, selectedEngine, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Engine Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              Каталог запчастей Outlander I
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Оригинальные артикулы Mitsubishi и проверенные аналоги проверенных брендов (Koyo, NTN, CTR, Gates)
            </p>
          </div>

          {/* Engine Selector Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-red-400" />
              Двигатель:
            </span>
            {(['ALL', '4G63', '4G64', '4G69', '4G63T'] as EngineType[]).map((eng) => (
              <button
                key={eng}
                onClick={() => onSelectEngine(eng)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition ${
                  selectedEngine === eng
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {eng === 'ALL' ? 'Все моторы' : eng}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию (ГРМ, рычаг), оригинальному OEM (MD326780) или аналогу (5535XS, CTR, Koyo)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Очистить
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Найдено позиций: <strong className="text-white font-mono">{filteredParts.length}</strong>
        </span>
        {selectedEngine !== 'ALL' && (
          <span className="text-red-400">
            Фильтр: совместимо с мотором <strong className="font-mono">{selectedEngine}</strong>
          </span>
        )}
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition space-y-4 shadow-sm"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">{part.categoryLabel}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{part.name}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Ориентир цены</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    ~{part.approxPriceRub.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              {/* OEM Badges with One-Click Copy */}
              <div className="mt-3 flex items-center flex-wrap gap-2">
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-1 tracking-wider">
                    OEM
                  </span>
                  <span className="text-xs font-mono font-bold text-white px-2.5 py-1">
                    {part.oemNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(part.oemNumber, `${part.id}-main`)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title="Копировать OEM артикул"
                  >
                    {copiedId === `${part.id}-main` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {part.alternateOem?.map((alt) => (
                  <div key={alt} className="flex items-center bg-slate-950/70 border border-slate-800/80 rounded-lg overflow-hidden">
                    <span className="text-[10px] text-slate-400 px-2 py-1 font-mono">
                      {alt}
                    </span>
                    <button
                      onClick={() => copyToClipboard(alt, `${part.id}-${alt}`)}
                      className="p-1 hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition"
                      title="Копировать артикул замены"
                    >
                      {copiedId === `${part.id}-${alt}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {part.description}
              </p>

              {/* Critical Warning if any */}
              {part.criticalWarning && (
                <div className="mt-3 p-3 bg-red-950/40 border border-red-900/60 rounded-lg flex items-start gap-2.5 text-xs text-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-red-300 block">Внимание мастера:</strong>
                    <span>{part.criticalWarning}</span>
                  </div>
                </div>
              )}

              {/* Install Tip */}
              {part.installTip && (
                <div className="mt-2.5 p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-start gap-2 text-xs text-slate-300">
                  <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-400">Совет по установке:</strong> {part.installTip}
                  </span>
                </div>
              )}

              {/* Verified Analogs Table */}
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Проверенные аналоги:
                </span>
                <div className="space-y-1">
                  {part.analogs.map((analog, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-slate-950/40 px-2.5 py-1.5 rounded border border-slate-800/60"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{analog.brand}</span>
                        <span className="font-mono text-slate-400">{analog.partNumber}</span>
                        {analog.comment && (
                          <span className="text-[11px] text-slate-500 hidden sm:inline">· {analog.comment}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            analog.quality === 'premium'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                              : analog.quality === 'recommended'
                              ? 'bg-blue-950 text-blue-400 border border-blue-900/50'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {analog.quality === 'premium' ? 'Конвейер/Топ' : analog.quality === 'recommended' ? 'Проверено' : 'Бюджет'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(analog.partNumber, `${part.id}-${analog.partNumber}`)}
                          className="p-1 hover:text-white text-slate-400 transition"
                          title="Скопировать номер аналога"
                        >
                          {copiedId === `${part.id}-${analog.partNumber}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: Compatible engines and Store search shortcuts */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500">Моторы:</span>
                {part.engines.map((e) => (
                  <span
                    key={e}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      selectedEngine === e
                        ? 'bg-red-950 text-red-300 font-bold border border-red-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {e}
                  </span>
                ))}
              </div>

              {/* Direct links to search on aggregators */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-500">Найти в:</span>
                <a
                  href={`https://www.autodoc.ru/price/579/${part.oemNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white hover:underline flex items-center gap-0.5"
                >
                  Autodoc
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <span className="text-slate-700">·</span>
                <a
                  href={`https://exist.ru/Price/?pcode=${part.oemNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white hover:underline flex items-center gap-0.5"
                >
                  Exist
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <span className="text-slate-700">·</span>
                <a
                  href={`https://emex.ru/products/${part.oemNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white hover:underline flex items-center gap-0.5"
                >
                  Emex
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredParts.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm">Ничего не найдено по вашему запросу "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg transition"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
import { TUNING_DATABASE, TuningItem } from '../data/tuningData';
import { Sparkles, Wrench, Shield, Star, DollarSign, CheckCircle2, Copy, Check, ChevronDown, ChevronUp, AlertCircle, Compass, Zap } from 'lucide-react';

export default function TuningHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string>(TUNING_DATABASE[0].id);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'Все доработки' },
    { id: 'cooling_engine', label: 'Охлаждение и ДВС' },
    { id: 'lift_offroad', label: 'Лифт и Off-Road' },
    { id: 'brakes', label: 'Тормозная система' },
    { id: 'light_electric', label: 'Свет и электрика' },
    { id: 'handling_swaps', label: 'Управляемость' },
    { id: 'comfort_body', label: 'Комфорт и защита' },
  ];

  const filteredItems = useMemo(() => {
    return TUNING_DATABASE.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesWhy = item.whyNeeded.toLowerCase().includes(q);
        const matchesParts = item.requiredParts.some(p => p.name.toLowerCase().includes(q) || p.partNumberOrSource.toLowerCase().includes(q));
        return matchesTitle || matchesSummary || matchesWhy || matchesParts;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Доработки, лайфхаки и тюнинг Outlander I
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Проверенные сообществом модификации: спасение радиатора, лифт подвески +30 мм, 2-поршневые тормоза, Bi-LED свет и вечный дроссель
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 shrink-0">
            <span>Проверенных рецептов:</span>
            <strong className="text-white font-mono">{TUNING_DATABASE.length}</strong>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию (проставки, радиатор, дроссель), запчастям или эффекту..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
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

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white font-medium shadow-md shadow-red-950/40'
                  : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main List of Tuning Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isFav = !!favoriteIds[item.id];

          return (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-xl transition ${
                isExpanded
                  ? 'border-red-500/40 shadow-lg ring-1 ring-red-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4 text-red-400" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className={`text-[11px] font-semibold ${
                        item.difficulty === 'Легко' ? 'text-emerald-400' : item.difficulty === 'Средне' ? 'text-blue-400' : 'text-amber-400'
                      }`}>
                        Сложность: {item.difficulty}
                      </span>
                      <span className="text-slate-600">·</span>
                      <div className="flex items-center text-amber-400 text-xs">
                        {Array.from({ length: item.effectRating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Ориентир цены</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {item.approxCostRub}
                    </span>
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className={`p-2 rounded-lg border transition ${
                      isFav
                        ? 'bg-amber-950/50 border-amber-800/60 text-amber-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title={isFav ? 'В избранном' : 'Добавить в избранное'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>

                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800 space-y-5 text-xs">
                  {/* Why Needed / Physics */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Зачем это нужно (суть проблемы и эффект):
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {item.whyNeeded}
                    </p>
                  </div>

                  {/* Required Parts Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Что потребуется для доработки:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {item.requiredParts.map((part, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-200 block">{part.name}</span>
                            <span className="font-mono text-red-400 text-[11px] block">{part.partNumberOrSource}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {part.approxPrice && (
                              <span className="text-xs font-mono text-emerald-400 font-bold">
                                {part.approxPrice}
                              </span>
                            )}
                            <button
                              onClick={() => handleCopy(part.partNumberOrSource)}
                              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                              title="Скопировать артикул"
                            >
                              {copiedText === part.partNumberOrSource ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step by step installation */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Порядок действий и монтажа:
                    </span>
                    <ol className="space-y-2">
                      {item.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center border border-emerald-800/60 shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Pro Tips & Club Verdict */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-xl space-y-1.5 text-blue-200">
                      <span className="font-bold text-blue-300 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        Советы и тонкости мастеров клуба:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {item.proTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-red-950/60 ring-1 ring-red-500/20 space-y-1 text-slate-300 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-red-400 text-xs block">
                          Вердикт сообщества Out-Club:
                        </span>
                        <p className="mt-1 leading-relaxed text-slate-200 font-medium">
                          «{item.clubVerdict}»
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 block">
                        Оценка полезности: {item.effectRating} из 5 ★
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { REPAIR_GUIDES } from '../data/guidesData';
import { EngineType, RepairGuide } from '../types';
import { Wrench, Clock, AlertTriangle, CheckSquare, Square, ChevronDown, ChevronUp, Copy, Check, ShieldAlert, Sparkles, Printer } from 'lucide-react';

interface Props {
  selectedEngine: EngineType;
}

export default function RepairGuides({ selectedEngine }: Props) {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(REPAIR_GUIDES[0].id);
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeGuide = REPAIR_GUIDES.find(g => g.id === selectedGuideId) || REPAIR_GUIDES[0];

  const toggleTool = (tool: string) => {
    setCheckedTools(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-red-500" />
              Руководство по ремонту Mitsubishi Outlander I
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Пошаговые фотоинструкции, проверенные хитрости мастеров, моменты затяжки и перечень инструмента
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Распечатать мануал</span>
          </button>
        </div>

        {/* Guides Switcher Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-slate-800 mt-4 no-scrollbar">
          {REPAIR_GUIDES.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`px-3.5 py-2 rounded-xl text-left transition shrink-0 border ${
                selectedGuideId === guide.id
                  ? 'bg-red-950/60 border-red-600 text-white shadow-md'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider">{guide.system}</div>
              <div className="text-xs font-semibold mt-0.5 max-w-[240px] truncate">{guide.title}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <span>⏱ {guide.timeEstimate}</span>
                <span>·</span>
                <span className={guide.difficulty === 'Сложно' ? 'text-amber-400' : 'text-emerald-400'}>
                  {guide.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Guide Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary, Tools, Parts Needed */}
        <div className="space-y-5 lg:col-span-1">
          {/* Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">{activeGuide.system}</span>
              <h3 className="text-base font-bold text-white mt-1">{activeGuide.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Время работы</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{activeGuide.timeEstimate}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Сложность</span>
                <span className={`font-semibold mt-0.5 block ${activeGuide.difficulty === 'Сложно' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {activeGuide.difficulty}
                </span>
              </div>
            </div>

            {/* Warning if any */}
            {activeGuide.warning && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-xs text-red-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{activeGuide.warning}</span>
              </div>
            )}

            {/* Symptoms / Causes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Когда делать (симптомы):</span>
              {activeGuide.symptoms.map((sym, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>{sym}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                Чеклист инструмента в гараже
              </h4>
              <span className="text-[10px] text-slate-500">
                {Object.values(checkedTools).filter(Boolean).length} / {activeGuide.toolsRequired.length}
              </span>
            </div>

            <div className="space-y-2">
              {activeGuide.toolsRequired.map((tool, idx) => {
                const isChecked = !!checkedTools[tool];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTool(tool)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs flex items-start gap-2.5 transition border ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200 line-through opacity-80'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <span>{tool}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parts Needed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              Необходимые запчасти и жидкости
            </h4>

            <div className="space-y-2">
              {activeGuide.partsNeeded.map((part, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-200 block">{part.name}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{part.oemOrAnalog}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(part.oemOrAnalog)}
                    className="p-1 hover:text-white text-slate-500 transition"
                    title="Копировать артикул"
                  >
                    {copiedText === part.oemOrAnalog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Instructions & Torque Table */}
        <div className="space-y-5 lg:col-span-2">
          {/* Steps */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Пошаговый план выполнения работы</h3>
              <span className="text-xs text-slate-400">Всего шагов: {activeGuide.steps.length}</span>
            </div>

            <div className="space-y-4">
              {activeGuide.steps.map((step) => (
                <div key={step.stepNumber} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 font-bold text-xs flex items-center justify-center border border-red-500/30">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-9">
                    {step.description}
                  </p>

                  {/* Step Caution */}
                  {step.caution && (
                    <div className="ml-9 p-2.5 bg-amber-950/30 border border-amber-900/50 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{step.caution}</span>
                    </div>
                  )}

                  {/* Step Torque */}
                  {step.torque && (
                    <div className="ml-9 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-900/40 inline-block">
                      Момент затяжки: {step.torque}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Torque Specifications Table */}
          {activeGuide.torqueSpecs && activeGuide.torqueSpecs.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Сводная таблица моментов затяжки для этого узла
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3 font-medium">Резьбовое соединение</th>
                      <th className="py-2 px-3 font-medium">Усилие затяжки (Н·м)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {activeGuide.torqueSpecs.map((spec, i) => (
                      <tr key={i} className="text-slate-300">
                        <td className="py-2 px-3 text-slate-200 font-sans">{spec.component}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pro Tips */}
          {activeGuide.proTips && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Секреты и лайфхаки мастеров Out-Club
              </h4>

              <div className="space-y-2">
                {activeGuide.proTips.map((tip, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">★</span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

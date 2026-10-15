import { useState, useMemo } from 'react';
import { KNOWN_ISSUES } from '../data/issuesData';
import { EngineType, KnownIssue } from '../types';
import { AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2, Copy, Check, ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react';

interface Props {
  selectedEngine: EngineType;
}

export default function Troubleshooter({ selectedEngine }: Props) {
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIssueId, setExpandedIssueId] = useState<string>(KNOWN_ISSUES[0].id);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const systems = [
    { id: 'all', label: 'Все системы' },
    { id: 'cooling', label: 'Охлаждение' },
    { id: 'engine', label: 'Двигатель' },
    { id: 'suspension', label: 'Подвеска' },
    { id: 'brakes', label: 'Тормоза' },
    { id: 'body', label: 'Кузов и бак' },
    { id: 'exhaust', label: 'Выпуск' },
  ];

  const filteredIssues = useMemo(() => {
    return KNOWN_ISSUES.filter((issue) => {
      if (selectedSystem !== 'all' && issue.system !== selectedSystem) return false;
      if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
      if (selectedEngine !== 'ALL' && !issue.affectedEngines.includes('ALL') && !issue.affectedEngines.includes(selectedEngine)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesSymptoms = issue.symptoms.some(s => s.toLowerCase().includes(q));
        const matchesRoot = issue.rootCause.toLowerCase().includes(q);
        return matchesTitle || matchesSymptoms || matchesRoot;
      }
      return true;
    });
  }, [selectedSystem, selectedSeverity, selectedEngine, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            База типичных неисправностей и «болячек» Outlander I
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Симптомы, скрытые первопричины, проверенные методы устранения и способы предотвращения поломок
          </p>
        </div>

        {/* Quick Symptoms Filters */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Быстрый поиск симптома:
          </span>
          {[
            { label: 'Вентиляторы воют', query: 'вентилятор' },
            { label: 'Трещина радиатора', query: 'радиатор' },
            { label: 'Жор масла', query: 'масло' },
            { label: 'Закис сход-развал', query: 'развал' },
            { label: 'Гниет труба бака', query: 'горловина' },
            { label: 'Клинят задние тормоза', query: 'суппорт' },
            { label: 'Ошибка P0421', query: 'P0421' },
          ].map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(tag.query)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              {tag.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-red-400 hover:text-red-300 underline ml-2"
            >
              Сброс
            </button>
          )}
        </div>

        {/* System Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {systems.map((sys) => (
            <button
              key={sys.id}
              onClick={() => setSelectedSystem(sys.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition ${
                selectedSystem === sys.id
                  ? 'bg-red-600 text-white font-medium shadow-md shadow-red-900/30'
                  : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {sys.label}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Accordion / Cards List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const isExpanded = expandedIssueId === issue.id;

          return (
            <div
              key={issue.id}
              className={`bg-slate-900 border rounded-xl transition ${
                isExpanded ? 'border-red-500/40 shadow-lg ring-1 ring-red-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Issue Summary Header Bar */}
              <div
                onClick={() => setExpandedIssueId(isExpanded ? '' : issue.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {issue.severity === 'Критическая' ? (
                      <span className="w-3 h-3 rounded-full bg-red-500 block ring-4 ring-red-950"></span>
                    ) : issue.severity === 'Высокая' ? (
                      <span className="w-3 h-3 rounded-full bg-amber-500 block ring-4 ring-amber-950"></span>
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-blue-500 block ring-4 ring-blue-950"></span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider">{issue.systemLabel}</span>
                      <span className="text-slate-600">·</span>
                      <span className={`text-[11px] font-semibold ${
                        issue.severity === 'Критическая' ? 'text-red-400' : issue.severity === 'Высокая' ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        Опасность: {issue.severity}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400">Частота: {issue.frequency}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">{issue.title}</h3>

                    {/* Brief primary symptom */}
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {issue.symptoms[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/40">
                    {issue.estimatedCostRub}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800 space-y-5 text-xs">
                  {/* Symptoms & Root Cause */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                        Как проявляется (симптомы):
                      </span>
                      <ul className="space-y-1.5">
                        {issue.symptoms.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <span className="text-amber-500 font-bold shrink-0">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block mb-2">
                        Первопричина неисправности:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {issue.rootCause}
                      </p>
                    </div>
                  </div>

                  {/* Verified Solution Steps */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      Проверенное решение проблемы:
                    </span>
                    <ol className="space-y-2">
                      {issue.solution.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center border border-emerald-800/60 shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Required Parts for Fix with Copy Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Детали для устранения поломки:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {issue.keyParts.map((part, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-200 block">{part.name}</span>
                            <span className="font-mono text-red-400 text-[11px] block">{part.oem}</span>
                            <span className="text-[10px] text-slate-500">{part.recommendation}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(part.oem)}
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                            title="Скопировать артикул"
                          >
                            {copiedText === part.oem ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prevention Advice */}
                  <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg text-blue-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-blue-300 block">Профилактика (как не допустить повторения):</strong>
                      <span className="text-slate-300">{issue.preventiveAdvice}</span>
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

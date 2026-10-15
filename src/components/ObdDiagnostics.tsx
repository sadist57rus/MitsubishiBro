import { useState, useMemo } from 'react';
import { OBD_CODES_DATA } from '../data/obdData';
import { Activity, Search, AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';

export default function ObdDiagnostics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>(OBD_CODES_DATA[0].code);

  const filteredCodes = useMemo(() => {
    if (!searchQuery.trim()) return OBD_CODES_DATA;
    const q = searchQuery.toLowerCase().trim();
    return OBD_CODES_DATA.filter(
      item =>
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.system.toLowerCase().includes(q) ||
        item.outlanderSpecifics.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeCode = OBD_CODES_DATA.find(c => c.code === selectedCode) || filteredCodes[0] || OBD_CODES_DATA[0];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-red-500" />
            База кодов ошибок OBD-II для Mitsubishi Outlander I
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Диагностика ошибок Check Engine (DTC) со спецификой для моторов 4G63 / 4G64 / 4G69 и коробок W4A42
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите код ошибки (например: P0421, P0171, P0505) или симптом..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Code List (Left) and Detailed Diagnostic View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Selector List */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block px-1">
            Коды в базе ({filteredCodes.length}):
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCodes.map((item) => (
              <button
                key={item.code}
                onClick={() => setSelectedCode(item.code)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                  selectedCode === item.code
                    ? 'bg-red-950/40 border-red-600 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-red-400">{item.code}</span>
                    <span className="text-[10px] text-slate-400">{item.system}</span>
                  </div>
                  <span className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="lg:col-span-2">
          {activeCode && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-bold font-mono text-red-500">{activeCode.code}</span>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {activeCode.system}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{activeCode.title}</h3>
                </div>

                <div className="shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                    activeCode.severity === 'critical'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : activeCode.severity === 'error'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {activeCode.severity === 'critical' ? 'Критическая ошибка' : activeCode.severity === 'error' ? 'Ошибка в работе узла' : 'Предупреждение'}
                  </span>
                </div>
              </div>

              {/* Outlander Specifics Callout */}
              <div className="p-4 bg-slate-950 rounded-xl border border-red-950/60 ring-1 ring-red-500/20 text-xs">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                  Специфика Outlander 1 (CU):
                </span>
                <p className="text-slate-200 leading-relaxed">{activeCode.outlanderSpecifics}</p>
              </div>

              {/* Symptoms and Common Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Симптомы при вождении:
                  </span>
                  <ul className="space-y-1.5">
                    {activeCode.symptoms.map((s, i) => (
                      <li key={i} className="text-slate-300 flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Вероятные причины:
                  </span>
                  <ul className="space-y-1.5">
                    {activeCode.commonCauses.map((c, i) => (
                      <li key={i} className="text-slate-300 flex items-start gap-2">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Diagnostic Steps */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  Пошаговая проверка сканером и мультиметром:
                </span>
                <div className="space-y-2">
                  {activeCode.diagnosticSteps.map((step, i) => (
                    <div key={i} className="text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-blue-950 text-blue-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-blue-800">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Fix */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl text-xs text-emerald-200">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Рекомендуемое решение проблемы:
                </span>
                <p className="text-slate-200 leading-relaxed">{activeCode.recommendedFix}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { parseDecimalInput, parseValidatedJson, readStored, writeStored } from '../lib/storage';
import { useVehicle } from '../context/VehicleContext';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import { usePreferences } from '../context/PreferencesContext';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LogEntry } from '../types';
import { BookOpen, Plus, Trash2, Download, Upload, DollarSign, Wrench, Calendar, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'outlander1_garage_logbook_v1';

const INITIAL_RECORDS: LogEntry[] = [
  {
    id: 'log-1',
    date: '2026-08-10',
    mileage: 182400,
    category: 'Двигатель и ГРМ',
    title: 'Замена комплекта ГРМ и ремня балансира со всеми роликами',
    partsUsed: 'Ремень Gates 5535XS, балансир Gates 5257XS, ролики Koyo LAT1018C/PU276033, натяжитель NTN',
    costTotal: 18500,
    notes: 'Выставили балансировочный вал по метке через технологическую заглушку блока (отвертка зашла на 65 мм). Вибраций нет, мотор шепчет.'
  },
  {
    id: 'log-2',
    date: '2026-06-22',
    mileage: 178500,
    category: 'Охлаждение',
    title: 'Замена блока управления вентиляторами и крышки радиатора',
    partsUsed: 'Блок 1355A124, термопаста Arctic MX-4, крышка радиатора Denso 0.9 bar (022510-1530)',
    costTotal: 4600,
    notes: 'Старый блок MR560127 выл на 100%. На новый нанес свежую термопасту. Крышка 0.9 bar защитит бачок от разрыва.'
  },
  {
    id: 'log-3',
    date: '2026-04-15',
    mileage: 175200,
    category: 'Шины и диски',
    title: 'Установка комплекта резины 215/65 R16 A/T',
    partsUsed: 'Шины Yokohama Geolandar A/T G015 215/65 R16 98H на штатных дисках R16',
    costTotal: 34000,
    notes: 'Машина поднялась на +11 мм. По ямам и гравийке идет значительно мягче. До чашки стойки огромный запас, нигде не задевает.'
  }
];

export default function GarageLogbook() {
  const { vehicleId, vehicles, activeVehicle } = useVehicle();
  const activeStorageKey = vehicleId === vehicles[0]?.id ? STORAGE_KEY : 'car-brother-logbook-' + vehicleId;
  const { preferences } = usePreferences();
  const currencySymbols: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€', CNY: '¥' };
  const selectedBrand = JAPANESE_BRANDS.find(brand => brand.id === activeVehicle.brandId);
  const selectedModel = selectedBrand?.models.find(model => model.id === activeVehicle.modelId);
  const vehicleLabel = activeVehicle.brandId === 'mitsubishi' && activeVehicle.modelId === 'outlander-1' ? 'Outlander I' : selectedModel?.name || activeVehicle.modelId;
  const [pendingImport, setPendingImport] = useState<{ fileName: string; records: LogEntry[]; foreignVehicleIds: string[]; duplicateIdsInFile: number } | null>(null);
  const [importMode, setImportMode] = useState<'add' | 'replace'>('add');
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [entries, setEntries] = useState<LogEntry[]>(() => readStored(activeStorageKey, (value: unknown): value is LogEntry[] => Array.isArray(value) && value.every((item): item is LogEntry => typeof item === 'object' && item !== null && typeof item.id === 'string' && (item.vehicleId === undefined || typeof item.vehicleId === 'string') && (item.currency === undefined || typeof item.currency === 'string') && typeof item.date === 'string' && typeof item.mileage === 'number' && typeof item.category === 'string' && typeof item.title === 'string' && typeof item.costTotal === 'number' && (item.partsUsed === undefined || typeof item.partsUsed === 'string') && (item.notes === undefined || typeof item.notes === 'string')), vehicleId === vehicles[0]?.id ? INITIAL_RECORDS : []).map(item => ({ ...item, vehicleId: item.vehicleId || vehicleId, currency: item.currency || 'RUB' })));

  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMileage, setNewMileage] = useState<string>('185000');
  const [newCategory, setNewCategory] = useState('Плановое ТО');
  const [newTitle, setNewTitle] = useState('');
  const [newParts, setNewParts] = useState('');
  const [newCost, setNewCost] = useState<string>('0');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => { writeStored(activeStorageKey, entries, (value: unknown): value is LogEntry[] => Array.isArray(value) && value.every((item): item is LogEntry => typeof item === 'object' && item !== null && typeof item.id === 'string' && typeof item.date === 'string' && typeof item.mileage === 'number' && typeof item.category === 'string' && typeof item.title === 'string' && typeof item.costTotal === 'number' && (item.partsUsed === undefined || typeof item.partsUsed === 'string') && (item.notes === undefined || typeof item.notes === 'string'))); }, [entries, activeStorageKey]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecord: LogEntry = {
      id: 'log-' + Date.now(),
      vehicleId,
      currency: activeVehicle.currency || preferences.currency,
      date: newDate,
      mileage: parseDecimalInput(newMileage) ?? 0,
      category: newCategory,
      title: newTitle.trim(),
      partsUsed: newParts.trim() || undefined,
      costTotal: parseDecimalInput(newCost) ?? 0,
      notes: newNotes.trim() || undefined
    };

    setEntries([newRecord, ...entries]);
    setIsAdding(false);
    setNewTitle('');
    setNewParts('');
    setNewCost('0');
    setNewNotes('');
  };

  const handleDelete = (id: string) => setPendingDeleteId(id);

  const handleExportJson = async () => {
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `nippon-drive-logbook-${date}.json`;
    const data = JSON.stringify(entries, null, 2);
    if (Capacitor.isNativePlatform()) {
      try {
        const saved = await Filesystem.writeFile({ path: fileName, data, directory: Directory.Cache, encoding: Encoding.UTF8 });
        await Share.share({ title: 'Бортжурнал Nippon Drive', text: 'Экспорт бортжурнала', url: saved.uri, dialogTitle: 'Поделиться бортжурналом' });
      } catch (error) {
        console.error('Native logbook export failed:', error);
        setDialogMessage('Не удалось подготовить файл для отправки. Попробуйте ещё раз.');
      }
      return;
    }
    // Browser/PWA fallback.
    const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = fileName;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onerror = () => setDialogMessage('Не удалось прочитать выбранный JSON-файл.');
    fileReader.onload = (event) => {
      try {
        const parsed = parseValidatedJson<LogEntry[]>(event.target?.result as string, (value: unknown): value is LogEntry[] => Array.isArray(value) && value.every((item): item is LogEntry => typeof item === 'object' && item !== null && typeof item.id === 'string' && typeof item.date === 'string' && typeof item.mileage === 'number' && typeof item.category === 'string' && typeof item.title === 'string' && typeof item.costTotal === 'number' && (item.vehicleId === undefined || typeof item.vehicleId === 'string') && (item.currency === undefined || typeof item.currency === 'string') && (item.partsUsed === undefined || typeof item.partsUsed === 'string') && (item.notes === undefined || typeof item.notes === 'string')));
        const seenIds = new Set<string>();
        let duplicateIdsInFile = 0;
        for (const record of parsed) {
          if (seenIds.has(record.id)) duplicateIdsInFile += 1;
          seenIds.add(record.id);
        }
        const foreignVehicleIds = [...new Set(parsed
          .map(record => record.vehicleId)
          .filter((id): id is string => typeof id === 'string' && id !== vehicleId))];
        setImportMode('add');
        setPendingImport({ fileName: file.name, records: parsed, foreignVehicleIds, duplicateIdsInFile });
      } catch {
        setDialogMessage('Ошибка чтения JSON-файла. Проверьте, что это корректный экспорт бортжурнала Nippon Drive.');
      }
    };
    fileReader.readAsText(file, 'UTF-8');
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    const records = pendingImport.records.map(item => ({
      ...item,
      currency: item.currency || activeVehicle.currency || preferences.currency,
    }));
    if (importMode === 'replace') {
      const seen = new Set<string>();
      const uniqueRecords = records.filter(record => {
        if (seen.has(record.id)) return false;
        seen.add(record.id);
        return true;
      });
      setEntries(uniqueRecords);
      setDialogMessage(`Импорт завершён: заменено записей — ${uniqueRecords.length}. Дубликаты ID внутри файла пропущены: ${records.length - uniqueRecords.length}.`);
    } else {
      const seen = new Set(entries.map(record => record.id));
      const additions = records.filter(record => {
        if (seen.has(record.id)) return false;
        seen.add(record.id);
        return true;
      });
      const skipped = records.length - additions.length;
      setEntries([...entries, ...additions]);
      setDialogMessage(`Импорт завершён: добавлено записей — ${additions.length}; пропущено записей с повторяющимися ID — ${skipped}.`);
    }
    setPendingImport(null);
  };

  const totalSpent = entries.reduce((acc, curr) => acc + (curr.costTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header and stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" />
              {`Бортжурнал владельца ${vehicleLabel}`}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Учет выполненных работ, пробегов, потраченных средств и артикулов установленных запчастей
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Закрыть форму' : 'Добавить запись'}</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition"
              title="Экспорт в файл JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Экспорт</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Импорт</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-xs uppercase text-slate-400 tracking-wider block">Всего расходов</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
              {totalSpent.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-xs uppercase text-slate-400 tracking-wider block">Записей в журнале</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">
              {entries.length}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-xs uppercase text-slate-400 tracking-wider block">Средний чек ремонта</span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">
              {entries.length > 0 ? Math.round(totalSpent / entries.length).toLocaleString('ru-RU') : 0} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Add New Entry Form Modal/Accordion */}
      {isAdding && (
        <form onSubmit={handleAddEntry} className="bg-slate-900 border border-red-900/60 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-500" />
            Новая запись о ремонте или обслуживании
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Дата</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Пробег (км)</label>
              <input
                type="text" inputMode="decimal"
                value={newMileage}
                onChange={(e) => setNewMileage(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white font-mono rounded-lg p-2.5 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Категория</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
              >
                <option value="Плановое ТО">Плановое ТО</option>
                <option value="Двигатель и ГРМ">Двигатель и ГРМ</option>
                <option value="Охлаждение">Охлаждение</option>
                <option value="Подвеска и рулевое">Подвеска и рулевое</option>
                <option value="Тормозная система">Тормозная система</option>
                <option value="Трансмиссия и 4WD">Трансмиссия и 4WD</option>
                <option value="Шины и диски">Шины и диски</option>
                <option value="Кузов и бак">Кузов и бак</option>
                <option value="Электрика">Электрика</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Что было сделано (название работы)</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Например: Замена масла ДВС и фильтра, ревизия тормозов"
              required
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Запчасти и артикулы</label>
              <input
                type="text"
                value={newParts}
                onChange={(e) => setNewParts(e.target.value)}
                placeholder="Масло Idemitsu 5W-30, фильтр Mann W610/3"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Сумма расходов ({activeVehicle.currency || preferences.currency})</label>
              <input
                type="text" inputMode="decimal"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="4500"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white font-mono rounded-lg p-2.5 focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Заметки и наблюдения мастера</label>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Нюансы по установке, состояние снятых деталей..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition"
            >
              Сохранить запись
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-red-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {entry.mileage.toLocaleString()} км
                </span>
                <span className="text-xs text-slate-400">{entry.date}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-medium text-slate-300">{entry.category}</span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {entry.costTotal.toLocaleString('ru-RU')} {currencySymbols[entry.currency || 'RUB'] || '₽'}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1 hover:text-red-400 text-slate-500 transition"
                  title="Удалить запись"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{entry.title}</h4>
              {entry.partsUsed && (
                <p className="text-xs text-slate-300 font-mono mt-1">
                  <span className="text-slate-500 font-sans">Запчасти: </span>
                  {entry.partsUsed}
                </p>
              )}
              {entry.notes && (
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {pendingImport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="logbook-import-title" className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4">
            <div>
              <h3 id="logbook-import-title" className="text-lg font-bold text-white">Импорт бортжурнала</h3>
              <p className="mt-1 text-sm text-slate-300 break-words">Файл: {pendingImport.fileName}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                <span className="block text-slate-400">В файле</span>
                <strong className="text-white">{pendingImport.records.length} записей</strong>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                <span className="block text-slate-400">Сейчас в журнале</span>
                <strong className="text-white">{entries.length} записей</strong>
              </div>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-white">Как импортировать?</legend>
              <label className="flex items-start gap-2 rounded-lg border border-slate-700 p-3 cursor-pointer">
                <input type="radio" name="logbook-import-mode" value="add" checked={importMode === 'add'} onChange={() => setImportMode('add')} className="mt-1" />
                <span><strong className="block text-white">Добавить к существующим</strong><span className="text-xs text-slate-400">По умолчанию. Записи с уже существующими ID будут пропущены.</span></span>
              </label>
              <label className="flex items-start gap-2 rounded-lg border border-slate-700 p-3 cursor-pointer">
                <input type="radio" name="logbook-import-mode" value="replace" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} className="mt-1" />
                <span><strong className="block text-white">Заменить все записи</strong><span className="text-xs text-slate-400">Текущий журнал будет заменён содержимым файла.</span></span>
              </label>
            </fieldset>
            {pendingImport.duplicateIdsInFile > 0 && (
              <p className="rounded-lg border border-amber-700/70 bg-amber-950/30 p-3 text-sm text-amber-200">В файле найдено повторяющихся ID: {pendingImport.duplicateIdsInFile}. Повторные записи будут пропущены.</p>
            )}
            {pendingImport.foreignVehicleIds.length > 0 && (
              <p className="rounded-lg border border-amber-700/70 bg-amber-950/30 p-3 text-sm text-amber-200">В файле есть записи для других автомобилей ({pendingImport.foreignVehicleIds.join(', ')}). Их vehicleId будет сохранён без изменений; проверьте принадлежность записей перед импортом.</p>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPendingImport(null)} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Отмена</button>
              <button type="button" onClick={confirmImport} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Подтвердить импорт</button>
            </div>
          </section>
        </div>
      )}

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="logbook-delete-title" className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4">
            <h3 id="logbook-delete-title" className="text-lg font-bold text-white">Удалить запись?</h3>
            <p className="text-sm text-slate-300">Запись будет удалена из текущего бортжурнала. Это действие нельзя отменить.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPendingDeleteId(null)} className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Отмена</button>
              <button type="button" onClick={() => { setEntries(entries.filter(entry => entry.id !== pendingDeleteId)); setPendingDeleteId(null); }} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Удалить</button>
            </div>
          </section>
        </div>
      )}

      {dialogMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="logbook-message-title" className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl space-y-4">
            <h3 id="logbook-message-title" className="text-lg font-bold text-white">Бортжурнал</h3>
            <p className="text-sm text-slate-300">{dialogMessage}</p>
            <div className="flex justify-end">
              <button type="button" onClick={() => setDialogMessage(null)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Понятно</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

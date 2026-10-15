import { useState, useEffect } from 'react';
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
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RECORDS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMileage, setNewMileage] = useState<number>(185000);
  const [newCategory, setNewCategory] = useState('Плановое ТО');
  const [newTitle, setNewTitle] = useState('');
  const [newParts, setNewParts] = useState('');
  const [newCost, setNewCost] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRecord: LogEntry = {
      id: 'log-' + Date.now(),
      date: newDate,
      mileage: Number(newMileage),
      category: newCategory,
      title: newTitle.trim(),
      partsUsed: newParts.trim() || undefined,
      costTotal: Number(newCost) || 0,
      notes: newNotes.trim() || undefined
    };

    setEntries([newRecord, ...entries]);
    setIsAdding(false);
    setNewTitle('');
    setNewParts('');
    setNewCost(0);
    setNewNotes('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту запись из бортжурнала?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `outlander1_logbook_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setEntries(parsed);
          }
        } catch (err) {
          alert('Ошибка чтения JSON файла');
        }
      };
    }
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
              Бортжурнал владельца Outlander I
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
            <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Всего расходов</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
              {totalSpent.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Записей в журнале</span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">
              {entries.length}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Средний чек ремонта</span>
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
                type="number"
                value={newMileage}
                onChange={(e) => setNewMileage(Number(e.target.value))}
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
              <label className="text-xs text-slate-400 block mb-1">Сумма расходов (руб)</label>
              <input
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(Number(e.target.value))}
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
                  {entry.costTotal.toLocaleString('ru-RU')} ₽
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
    </div>
  );
}

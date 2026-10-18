import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { isRecord } from '../lib/storage';

const BACKUP_SCHEMA_VERSION = 1;
type BackupPayload = { app: 'car-brother'; schemaVersion: number; createdAt: string; data: Record<string, string> };
type RestoreMode = 'merge' | 'replace';

function isBackup(value: unknown): value is BackupPayload {
  if (!isRecord(value) || value.app !== 'car-brother' || value.schemaVersion !== BACKUP_SCHEMA_VERSION || typeof value.createdAt !== 'string' || !isRecord(value.data)) return false;
  return Object.values(value.data).every(item => typeof item === 'string');
}

function createBackup(): BackupPayload {
  const data: Record<string, string> = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key) {
      const value = localStorage.getItem(key);
      if (value !== null) data[key] = value;
    }
  }
  return { app: 'car-brother', schemaVersion: BACKUP_SCHEMA_VERSION, createdAt: new Date().toISOString(), data };
}

function downloadJson(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function BackupManager() {
  const [pending, setPending] = useState<BackupPayload | null>(null);
  const [mode, setMode] = useState<RestoreMode>('merge');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const exportBackup = async () => {
    setError('');
    try {
      const backup = createBackup();
      const content = JSON.stringify(backup, null, 2);
      const fileName = 'car-brother-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      if (Capacitor.isNativePlatform()) {
        const saved = await Filesystem.writeFile({ path: fileName, data: content, directory: Directory.Cache, encoding: Encoding.UTF8 });
        await Share.share({ title: 'Резервная копия Car Brother', text: 'Полная резервная копия данных приложения', url: saved.uri, dialogTitle: 'Сохранить резервную копию' });
      } else {
        downloadJson(fileName, content);
      }
      setMessage('Резервная копия подготовлена.');
    } catch {
      setError('Не удалось создать или передать резервную копию.');
    }
  };

  const chooseBackup = async (file?: File) => {
    setError('');
    setMessage('');
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isBackup(parsed)) throw new Error('invalid backup');
      setPending(parsed);
      setMessage('Файл проверен. Выберите режим восстановления и подтвердите операцию.');
    } catch {
      setPending(null);
      setError('Файл повреждён или не соответствует формату резервной копии Car Brother. Данные не изменены.');
    }
  };

  const restore = () => {
    if (!pending) return;
    const snapshot: Record<string, string> = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) snapshot[key] = value;
      }
    }
    try {
      if (mode === 'replace') localStorage.clear();
      for (const [key, value] of Object.entries(pending.data)) localStorage.setItem(key, value);
      setPending(null);
      setMessage('Восстановление завершено. Перезагрузите приложение, чтобы все разделы перечитали данные.');
      setError('');
    } catch {
      try {
        localStorage.clear();
        for (const [key, value] of Object.entries(snapshot)) localStorage.setItem(key, value);
        setError('Восстановление не удалось. Предыдущие данные восстановлены из аварийного снимка.');
      } catch {
        setError('Критическая ошибка хранилища: автоматический откат не удался. Не закрывайте приложение.');
      }
    }
  };

  return <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div><h2 className="text-base font-bold">Резервная копия и восстановление</h2><p className="mt-1 text-sm text-slate-500">Экспортирует настройки, гараж, бортжурнал, заправки и другие данные локального хранилища в один JSON-файл.</p></div>
    <button type="button" onClick={() => void exportBackup()} className="min-h-12 rounded-xl bg-red-600 px-4 py-3 font-bold text-white">Создать полную резервную копию</button>
    <label className="block text-sm font-semibold">Выбрать файл для восстановления<input className="mt-2 block w-full text-sm" type="file" accept="application/json,.json" onChange={event => void chooseBackup(event.target.files?.[0])}/></label>
    {pending && <div className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-sm">Файл создан: {new Date(pending.createdAt).toLocaleString('ru-RU')}. Ключей данных: {Object.keys(pending.data).length}.</p>
      <label className="block text-sm">Режим восстановления<select className="mt-1 w-full rounded-xl border bg-transparent p-3" value={mode} onChange={event => setMode(event.target.value as RestoreMode)}><option value="merge">Объединить: данные из файла заменят одноимённые ключи</option><option value="replace">Заменить: очистить локальное хранилище и восстановить файл</option></select></label>
      <button type="button" onClick={restore} className="min-h-12 rounded-xl bg-red-600 px-4 py-3 font-bold text-white">Подтвердить восстановление</button>
      <button type="button" onClick={() => setPending(null)} className="ml-2 min-h-12 rounded-xl border px-4 py-3">Отмена</button>
    </div>}
    {message && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>}
    {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
  </section>;
}

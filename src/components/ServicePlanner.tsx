import { useEffect, useMemo, useState, type FormEvent, type SetStateAction } from 'react';
import { CalendarClock, Check, Circle, Gauge, Plus, Trash2, Wrench } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';

type ServiceTask = {
  id: string;
  title: string;
  category: string;
  dueMileage?: number;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
};

function readTasks(key: string): ServiceTask[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is ServiceTask =>
      item !== null && typeof item === 'object' &&
      typeof item.id === 'string' && typeof item.title === 'string' &&
      typeof item.category === 'string' && typeof item.completed === 'boolean' &&
      typeof item.createdAt === 'string' &&
      (item.dueMileage === undefined || (typeof item.dueMileage === 'number' && Number.isFinite(item.dueMileage))) &&
      (item.dueDate === undefined || typeof item.dueDate === 'string')
    );
  } catch {
    return [];
  }
}

function localDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function ServicePlanner() {
  const { vehicleId, activeVehicle } = useVehicle();
  const storageKey = `car-brother-service-plan-v1-${vehicleId || 'default'}`;
  const currentMileage = Number.isFinite(activeVehicle?.mileage) ? activeVehicle.mileage : 0;
  const [taskState, setTaskState] = useState<{ key: string; tasks: ServiceTask[] }>(() => ({ key: storageKey, tasks: readTasks(storageKey) }));
  const tasks = taskState.key === storageKey ? taskState.tasks : readTasks(storageKey);
  const setTasks = (action: SetStateAction<ServiceTask[]>) => setTaskState(previous => {
    const current = previous.key === storageKey ? previous.tasks : readTasks(storageKey);
    return { key: storageKey, tasks: typeof action === 'function' ? action(current) : action };
  });
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Плановое обслуживание');
  const [dueMileage, setDueMileage] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (taskState.key !== storageKey) setTaskState({ key: storageKey, tasks: readTasks(storageKey) });
  }, [storageKey, taskState.key]);

  useEffect(() => {
    if (taskState.key !== storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify(taskState.tasks)); } catch { /* Storage can be unavailable in private mode. */ }
  }, [storageKey, taskState]);

  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const aMileage = a.dueMileage ?? Number.MAX_SAFE_INTEGER;
    const bMileage = b.dueMileage ?? Number.MAX_SAFE_INTEGER;
    if (aMileage !== bMileage) return aMileage - bMileage;
    return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
  }), [tasks]);

  const pendingCount = tasks.filter(task => !task.completed).length;
  const overdueCount = tasks.filter(task => !task.completed && (
    (task.dueMileage !== undefined && currentMileage > 0 && task.dueMileage < currentMileage) ||
    (task.dueDate !== undefined && task.dueDate < localDateString())
  )).length;

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const parsedMileage = dueMileage.trim() ? Number(dueMileage) : undefined;
    const task: ServiceTask = {
      id: `service-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: cleanTitle,
      category: category.trim() || 'Обслуживание',
      ...(parsedMileage !== undefined && Number.isFinite(parsedMileage) && parsedMileage >= 0 ? { dueMileage: parsedMileage } : {}),
      ...(dueDate ? { dueDate } : {}),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(previous => [task, ...previous]);
    setTitle('');
    setDueMileage('');
    setDueDate('');
    setIsAdding(false);
  };

  const fieldClass = 'mt-1 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

  return (
    <section aria-labelledby="service-plan-title" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"><CalendarClock className="h-6 w-6" aria-hidden="true" /></span>
          <div className="min-w-0">
            <h2 id="service-plan-title" className="text-xl font-black text-slate-900 dark:text-white">План обслуживания</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ваши работы и напоминания — отдельно для каждого автомобиля.</p>
          </div>
        </div>
        <button type="button" onClick={() => setIsAdding(value => !value)} aria-expanded={isAdding} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
          <Plus className="h-5 w-5" aria-hidden="true" /> Добавить
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950"><p className="text-sm text-slate-500 dark:text-slate-400">В плане</p><p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{pendingCount}</p></div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950"><p className="text-sm text-slate-500 dark:text-slate-400">Просрочено</p><p className={`mt-1 text-2xl font-black tabular-nums ${overdueCount ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{overdueCount}</p></div>
        <div className="col-span-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950 sm:col-span-1"><p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Gauge className="h-4 w-4" aria-hidden="true" /> Текущий пробег</p><p className="mt-1 text-xl font-black tabular-nums text-slate-900 dark:text-white">{currentMileage > 0 ? `${currentMileage.toLocaleString('ru-RU')} км` : 'Не указан'}</p></div>
      </div>

      {isAdding && <form onSubmit={submitTask} className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700 sm:p-4">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Что нужно сделать
          <input autoFocus required value={title} onChange={event => setTitle(event.target.value)} maxLength={120} placeholder="Например, заменить масло" className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Категория
          <select value={category} onChange={event => setCategory(event.target.value)} className={fieldClass}>
            <option>Плановое обслуживание</option><option>Двигатель</option><option>Трансмиссия</option><option>Тормоза</option><option>Шины и колёса</option><option>Электрика</option><option>Другое</option>
          </select>
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Пробег напоминания, км
            <input inputMode="numeric" type="number" min="0" step="1" value={dueMileage} onChange={event => setDueMileage(event.target.value)} placeholder="Необязательно" className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">Дата напоминания
            <input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} className={fieldClass} />
          </label>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Интервалы не назначаются автоматически: укажите срок из руководства именно для вашей модификации или по рекомендации сервиса.</p>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="min-h-12 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">Сохранить напоминание</button>
          <button type="button" onClick={() => setIsAdding(false)} className="min-h-12 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Отмена</button>
        </div>
      </form>}

      {sortedTasks.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center dark:border-slate-700">
        <Wrench className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">Пока нет запланированных работ</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">Добавьте обслуживание, укажите пробег или дату — Nippon Drive напомнит о нём в этом плане.</p>
      </div> : <ol className="space-y-2">
        {sortedTasks.map(task => {
          const isOverdue = !task.completed && ((task.dueMileage !== undefined && currentMileage > 0 && task.dueMileage < currentMileage) || (task.dueDate !== undefined && task.dueDate < localDateString()));
          const isDueSoon = !task.completed && !isOverdue && task.dueMileage !== undefined && currentMileage > 0 && task.dueMileage - currentMileage <= 1000;
          return <li key={task.id} className={`flex items-start gap-3 rounded-xl border p-3 ${task.completed ? 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-950' : isOverdue ? 'border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-800'}`}>
            <button type="button" onClick={() => setTasks(previous => previous.map(item => item.id === task.id ? { ...item, completed: !item.completed } : item))} aria-label={task.completed ? `Вернуть в план: ${task.title}` : `Отметить выполненным: ${task.title}`} className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-red-400 dark:border-slate-700 dark:text-slate-300">
              {task.completed ? <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className={`font-bold leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>{task.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.category}</p>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
                {task.dueMileage !== undefined && <span className={isOverdue && task.dueMileage < currentMileage ? 'text-red-700 dark:text-red-400' : isDueSoon ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}>{task.dueMileage.toLocaleString('ru-RU')} км</span>}
                {task.dueDate && <span className={isOverdue && task.dueDate < localDateString() ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('ru-RU')}</span>}
                {isOverdue && <span className="font-bold text-red-700 dark:text-red-400">Просрочено</span>}
                {isDueSoon && <span className="font-bold text-amber-700 dark:text-amber-400">Скоро</span>}
                {task.completed && <span className="font-bold text-emerald-700 dark:text-emerald-400">Выполнено</span>}
              </div>
            </div>
            <button type="button" onClick={() => setTasks(previous => previous.filter(item => item.id !== task.id))} aria-label={`Удалить напоминание: ${task.title}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>;
        })}
      </ol>}
    </section>
  );
}

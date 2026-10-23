import type { ReactNode } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { getDataFor } from '../data/vehicleDataRegistry';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import { BookOpen, CarFront, MessageSquareWarning } from 'lucide-react';

export default function VehicleDataGate({ children, onOpenJapaneseCars, requiredModelId }: { children: ReactNode; onOpenJapaneseCars: () => void; requiredModelId?: string }) {
  const { brandId, modelId } = useVehicle();
  const brand = JAPANESE_BRANDS.find(item => item.id === brandId);
  const model = brand?.models.find(item => item.id === modelId);
  const data = getDataFor(modelId);
  if (data && (!requiredModelId || modelId === requiredModelId)) return <>{children}</>;
  const issueTitle = encodeURIComponent(`Запрос данных: ${brand?.name || brandId} ${model?.name || modelId}`);
  const issueBody = encodeURIComponent(`Модель ID: ${modelId}\nМарка: ${brand?.name || brandId}\nПоколение: ${model?.generation || 'не указано'}\n\nПрошу дополнить и проверить данные для этой модификации.`);
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-amber-900/60 dark:bg-slate-900 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"><CarFront className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Данные этой модификации не подтверждены</h2>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">Не используем данные другой машины. Для ремонта и подбора деталей нужны источники именно для выбранной модификации.</p>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{brand?.russianName || brand?.name} {model?.name} {model?.generation ? `· ${model.generation}` : ''}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onOpenJapaneseCars} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700"><BookOpen className="h-4 w-4" /> Карточка модели в «Авто Японии»</button>
            <a href={`https://github.com/sadist57rus/Nippon-Drive/issues/new?title=${issueTitle}&body=${issueBody}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200"><MessageSquareWarning className="h-4 w-4" /> Запросить данные / сообщить об ошибке</a>
          </div>
        </div>
      </div>
    </section>
  );
}

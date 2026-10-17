import type { ReactNode } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { getDataFor } from '../data/vehicleDataRegistry';
import { BookOpen, CarFront } from 'lucide-react';

export default function VehicleDataGate({ children, onOpenJapaneseCars }: { children: ReactNode; onOpenJapaneseCars: () => void }) {
  const { brandId, modelId } = useVehicle();
  const data = getDataFor(modelId);
  if (data) return <>{children}</>;
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm dark:border-amber-900/60 dark:bg-slate-900 sm:p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"><CarFront className="h-6 w-6" /></div>
      <h2 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">Данные для этой модели ещё не проверены</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">Мы не показываем сведения от другой машины вместо выбранной. Для безопасного подбора нужны данные именно для выбранной марки, модели, поколения и модификации.</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Выбрано: {brandId} / {modelId}</p>
      <button type="button" onClick={onOpenJapaneseCars} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"><BookOpen className="h-4 w-4" /> Открыть раздел «Авто Японии»</button>
    </section>
  );
}

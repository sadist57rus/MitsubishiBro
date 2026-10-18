import { BookOpen, CarFront, MessageSquareWarning } from 'lucide-react';

interface EmptyStateProps {
  brandName: string;
  modelName: string;
  generation?: string;
  onOpenModel: () => void;
  issueUrl: string;
}

export default function EmptyState({
  brandName,
  modelName,
  generation,
  onOpenModel,
  issueUrl,
}: EmptyStateProps) {
  return (
    <section
      aria-labelledby="vehicle-data-empty-state-title"
      data-testid="vehicle-data-empty-state"
      className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-amber-900/60 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          <CarFront className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="vehicle-data-empty-state-title" className="text-base font-extrabold text-slate-900 dark:text-white">
            Данные для этой модели ещё не проверены
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
            Не подставляем сведения от другой машины. Для ремонта и подбора деталей нужны данные именно для выбранной модификации и источники, которые можно проверить.
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {brandName} {modelName}{generation ? ` · ${generation}` : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenModel}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Карточка модели в «Авто Японии»
            </button>
            <a
              href={issueUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
              Сообщить об ошибке / запросить данные
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

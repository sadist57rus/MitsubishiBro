import type { ReactNode } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { getDataFor } from '../data/vehicleDataRegistry';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import EmptyState from './EmptyState';

export default function VehicleDataGate({ children, onOpenJapaneseCars, requiredModelId }: { children: ReactNode; onOpenJapaneseCars: () => void; requiredModelId?: string }) {
  const { vehicleId, vehicles, brandId, modelId } = useVehicle();
  const brand = JAPANESE_BRANDS.find(item => item.id === brandId);
  const model = brand?.models.find(item => item.id === modelId);
  const hasActiveVehicle = vehicles.some(vehicle => vehicle.id === vehicleId);
  const data = hasActiveVehicle ? getDataFor(modelId) : undefined;

  if (data && (!requiredModelId || modelId === requiredModelId)) return <>{children}</>;

  const issueTitle = encodeURIComponent(\`Запрос данных: \${brand?.name || brandId} \${model?.name || modelId}\`);
  const issueBody = encodeURIComponent([
    \`Модель ID: \${modelId}\`,
    \`Марка: \${brand?.name || brandId}\`,
    \`Поколение: \${model?.generation || 'не указано'}\`,
    '',
    'Прошу дополнить и проверить данные для этой модификации.',
  ].join('\n'));

  return (
    <EmptyState
      brandName={brand?.russianName || brand?.name || brandId}
      modelName={model?.name || modelId}
      generation={model?.generation}
      onOpenModel={onOpenJapaneseCars}
      issueUrl={\`https://github.com/sadist57rus/MitsubishiBro/issues/new?title=\${issueTitle}&body=\${issueBody}\`}
    />
  );
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { JAPANESE_BRANDS } from '../data/japaneseBrandsData';
import type { EngineType, DrivetrainType } from '../types';

export interface VehicleSelection {
  brandId: string;
  modelId: string;
  engine: EngineType;
  drivetrain: DrivetrainType;
}
interface VehicleContextValue extends VehicleSelection {
  setBrandId: (brandId: string) => void;
  setModelId: (modelId: string) => void;
  setEngine: (engine: EngineType) => void;
  setDrivetrain: (drivetrain: DrivetrainType) => void;
  selectVehicle: (brandId: string, modelId: string) => void;
}
const STORAGE_KEY = 'car-brother-vehicle';
const DEFAULT_SELECTION: VehicleSelection = { brandId: 'mitsubishi', modelId: 'outlander-1', engine: 'ALL', drivetrain: '4WD' };
const VehicleContext = createContext<VehicleContextValue | null>(null);

function readSelection(): VehicleSelection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SELECTION;
    const parsed = JSON.parse(raw) as Partial<VehicleSelection>;
    const brandId = typeof parsed.brandId === 'string' ? parsed.brandId : DEFAULT_SELECTION.brandId;
    const brand = JAPANESE_BRANDS.find(item => item.id === brandId);
    const modelId = typeof parsed.modelId === 'string' && brand?.models.some(model => model.id === parsed.modelId)
      ? parsed.modelId : (brand?.models[0]?.id ?? DEFAULT_SELECTION.modelId);
    return {
      brandId: brand?.id ?? DEFAULT_SELECTION.brandId,
      modelId,
      engine: parsed.engine ?? DEFAULT_SELECTION.engine,
      drivetrain: parsed.drivetrain ?? DEFAULT_SELECTION.drivetrain
    };
  } catch { return DEFAULT_SELECTION; }
}
export function VehicleProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<VehicleSelection>(readSelection);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selection)); } catch { /* storage unavailable */ } }, [selection]);
  const value = useMemo<VehicleContextValue>(() => ({
    ...selection,
    setBrandId: brandId => setSelection(previous => {
      const brand = JAPANESE_BRANDS.find(item => item.id === brandId);
      return { ...previous, brandId: brand?.id ?? previous.brandId, modelId: brand?.models[0]?.id ?? previous.modelId };
    }),
    setModelId: modelId => setSelection(previous => {
      const owner = JAPANESE_BRANDS.find(brand => brand.models.some(model => model.id === modelId));
      return owner ? { ...previous, brandId: owner.id, modelId } : previous;
    }),
    setEngine: engine => setSelection(previous => ({ ...previous, engine })),
    setDrivetrain: drivetrain => setSelection(previous => ({ ...previous, drivetrain })),
    selectVehicle: (brandId, modelId) => setSelection(previous => {
      const brand = JAPANESE_BRANDS.find(item => item.id === brandId);
      const model = brand?.models.find(item => item.id === modelId);
      return model && brand ? { ...previous, brandId: brand.id, modelId: model.id } : previous;
    })
  }), [selection]);
  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}
export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) throw new Error('useVehicle must be used inside VehicleProvider');
  return context;
}

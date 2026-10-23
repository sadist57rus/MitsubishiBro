/**
 * Exact vehicle-variant contract.
 * Fields are optional to support gradual migration of legacy records.
 * Validation checks only supplied values; it never infers or upgrades verification.
 */
import type { CarDimensions, TireOption, WiperBladeSize } from './types/carDimensions';

export type VerificationStatus = 'unverified' | 'partially-verified' | 'verified';

export interface VehicleVariantSource {
  label?: string;
  url?: string;
  sourceType?: 'oem-owner-manual' | 'oem-service-manual' | 'oem-parts-catalog' | 'oem-bulletin' | 'regulator' | 'secondary-reference';
  market?: string;
  scope?: string;
  pageOrSection?: string;
  accessedAt?: string;
}

export interface VehicleVariant {
  id?: string;
  modelId?: string;
  market?: string;
  modelYearFrom?: number;
  modelYearTo?: number;
  productionMonthFrom?: string; // YYYY-MM
  productionMonthTo?: string; // YYYY-MM
  bodyCode?: string;
  bodyStyle?: string;
  trimOrGrade?: string;
  engineCode?: string;
  transmissionCode?: string;
  transmissionType?: 'MT' | 'AT' | 'CVT' | 'DCT' | 'AMT' | 'EV-reduction' | 'other';
  drivetrain?: 'FWD' | 'RWD' | 'AWD' | '4WD' | 'other';
  steeringPosition?: 'LHD' | 'RHD' | 'both' | 'unknown';
  dimensions?: CarDimensions;
  tires?: TireOption[];
  wiperBladeSize?: WiperBladeSize[];
  specification?: {
    engineOil?: { viscosity?: string; approval?: string; refillWithFilter?: string; refillWithoutFilter?: string };
    transmissionFluid?: { specification?: string; serviceRefill?: string; dryFill?: string; levelCheckProcedure?: string };
    transferCaseFluid?: { specification?: string; capacity?: string };
    differentialFluid?: { front?: string; rear?: string; capacities?: string };
    coolant?: { type?: string; capacity?: string };
    brakeFluid?: string;
    bulbs?: Record<string, string>;
    fuses?: Record<string, string>;
    obd?: { protocol?: string; portLocation?: string; codes?: { code?: string; title?: string; sourceId?: string }[] };
    knownIssues?: { title?: string; conditions?: string; evidenceSourceIds?: string[] }[];
  };
  verificationStatus?: VerificationStatus;
  sources?: VehicleVariantSource[];
  lastReviewed?: string;
  notes?: string;
}

export function validateVehicleVariant(variant: VehicleVariant): string[] {
  const errors: string[] = [];
  if (variant.id !== undefined && !variant.id.trim()) errors.push('id must not be empty when supplied');
  if (variant.modelId !== undefined && !variant.modelId.trim()) errors.push('modelId must not be empty when supplied');
  if (variant.modelYearFrom !== undefined && (!Number.isInteger(variant.modelYearFrom) || variant.modelYearFrom < 1885)) {
    errors.push('modelYearFrom is invalid');
  }
  if (variant.modelYearTo !== undefined && variant.modelYearFrom !== undefined && variant.modelYearTo < variant.modelYearFrom) {
    errors.push('modelYearTo precedes modelYearFrom');
  }
  if (variant.verificationStatus === 'verified' && !(variant.sources?.length)) {
    errors.push('verified variants require source references');
  }
  if (variant.verificationStatus === 'verified' && variant.sources?.some((source) => !source.url || !source.scope || !source.market || !source.accessedAt)) {
    errors.push('verified variant has incomplete source metadata');
  }
  for (const [key, value] of Object.entries(variant.specification?.engineOil ?? {})) {
    if (value && /^(unknown|tbd|уточнить|зависит от)$/i.test(value.trim())) errors.push(`engineOil.${key} contains a placeholder`);
  }
  if (variant.dimensions) {
    for (const [key, value] of Object.entries(variant.dimensions)) {
      if (!Number.isFinite(value) || value <= 0) errors.push(`dimensions.${key} must be a positive number`);
    }
  }
  for (const tire of variant.tires ?? []) {
    if (!tire.size.trim()) errors.push('tire size must not be empty');
    for (const key of ['diameter', 'width', 'aspectRatio', 'rimDiameter'] as const) {
      if (!Number.isFinite(tire[key]) || tire[key] <= 0) errors.push(`tires.${key} must be a positive number`);
    }
    if (!tire.loadIndex.trim() || !tire.speedRating.trim() || !tire.notes.trim()) {
      errors.push(`tire ${tire.size || '(unknown size)'} is missing load index, speed rating, or notes`);
    }
  }
  for (const wiper of variant.wiperBladeSize ?? []) {
    if (!wiper.driverSide.trim() || !wiper.passengerSide.trim() || !wiper.notes.trim()) {
      errors.push('wiperBladeSize entry is incomplete');
    }
  }
  return errors;
}

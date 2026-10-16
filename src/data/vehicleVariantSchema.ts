/**
 * Exact vehicle-variant contract for future catalog migration.
 * One record must describe one market/body/powertrain/trim combination,
 * not a whole generation with multiple incompatible specifications.
 */
export type VerificationStatus = 'unverified' | 'partially-verified' | 'verified';

export interface VehicleVariantSource {
  label: string;
  url: string;
  sourceType: 'oem-owner-manual' | 'oem-service-manual' | 'oem-parts-catalog' | 'oem-bulletin' | 'regulator' | 'secondary-reference';
  market: string;
  scope: string;
  pageOrSection?: string;
  accessedAt: string;
}

export interface VehicleVariant {
  id: string;
  modelId: string;
  market: string;
  modelYearFrom: number;
  modelYearTo?: number;
  productionMonthFrom?: string; // YYYY-MM
  productionMonthTo?: string;   // YYYY-MM
  bodyCode: string;
  bodyStyle: string;
  trimOrGrade?: string;
  engineCode: string;
  transmissionCode: string;
  transmissionType: 'MT' | 'AT' | 'CVT' | 'DCT' | 'AMT' | 'EV-reduction' | 'other';
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD' | 'other';
  steeringPosition: 'LHD' | 'RHD' | 'both' | 'unknown';
  specification: {
    engineOil?: { viscosity?: string; approval?: string; refillWithFilter?: string; refillWithoutFilter?: string };
    transmissionFluid?: { specification?: string; serviceRefill?: string; dryFill?: string; levelCheckProcedure?: string };
    transferCaseFluid?: { specification?: string; capacity?: string };
    differentialFluid?: { front?: string; rear?: string; capacities?: string };
    coolant?: { type?: string; capacity?: string };
    brakeFluid?: string;
    bulbs?: Record<string, string>;
    fuses?: Record<string, string>;
    obd?: { protocol?: string; portLocation?: string; codes?: { code: string; title: string; sourceId?: string }[] };
    knownIssues?: { title: string; conditions?: string; evidenceSourceIds: string[] }[];
  };
  verificationStatus: VerificationStatus;
  sources: VehicleVariantSource[];
  lastReviewed?: string;
  notes?: string;
}

export function validateVehicleVariant(variant: VehicleVariant): string[] {
  const errors: string[] = [];
  if (!variant.id.trim()) errors.push('id is required');
  if (!variant.modelId.trim()) errors.push('modelId is required');
  if (!variant.market.trim()) errors.push('market is required');
  if (!Number.isInteger(variant.modelYearFrom) || variant.modelYearFrom < 1885) errors.push('modelYearFrom is invalid');
  if (variant.modelYearTo !== undefined && variant.modelYearTo < variant.modelYearFrom) errors.push('modelYearTo precedes modelYearFrom');
  if (!variant.bodyCode.trim()) errors.push('bodyCode is required');
  if (!variant.engineCode.trim()) errors.push('engineCode is required');
  if (!variant.transmissionCode.trim()) errors.push('transmissionCode is required');
  if (variant.verificationStatus === 'verified' && variant.sources.length === 0) errors.push('verified variants require source references');
  if (variant.verificationStatus === 'verified' && variant.sources.some((s) => !s.url || !s.scope || !s.market || !s.accessedAt)) errors.push('verified variant has incomplete source metadata');
  for (const [key, value] of Object.entries(variant.specification.engineOil ?? {})) {
    if (value && /^(unknown|tbd|уточнить|зависит от)$/i.test(value.trim())) errors.push(`engineOil.${key} contains a placeholder`);
  }
  return errors;
}

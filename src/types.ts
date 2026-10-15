export type EngineType = '4G63' | '4G64' | '4G69' | '4G63T' | 'ALL';

export type DrivetrainType = '4WD' | 'FWD' | 'ALL';

export interface VehicleConfig {
  engine: EngineType;
  drivetrain: DrivetrainType;
  year: number;
  transmission: 'AT' | 'MT';
}

export interface PartItem {
  id: string;
  name: string;
  category: 'engine' | 'transmission' | 'suspension_front' | 'suspension_rear' | 'brakes' | 'cooling' | 'filters_fluids' | 'ignition_sensors' | 'exhaust' | 'body_interior';
  categoryLabel: string;
  oemNumber: string;
  alternateOem?: string[];
  analogs: {
    brand: string;
    partNumber: string;
    quality: 'premium' | 'recommended' | 'budget';
    comment?: string;
  }[];
  engines: EngineType[];
  drivetrain?: DrivetrainType;
  description: string;
  installTip?: string;
  criticalWarning?: string;
  approxPriceRub: number;
}

export interface RepairGuideStep {
  stepNumber: number;
  title: string;
  description: string;
  torque?: string;
  tool?: string;
  caution?: string;
}

export interface RepairGuide {
  id: string;
  title: string;
  category: 'engine' | 'suspension' | 'brakes' | 'cooling' | 'transmission' | 'electrical';
  system: string;
  timeEstimate: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно' | 'Профи';
  applicableEngines: EngineType[];
  symptoms: string[];
  toolsRequired: string[];
  partsNeeded: {
    name: string;
    oemOrAnalog: string;
    qty?: string;
  }[];
  steps: RepairGuideStep[];
  torqueSpecs?: {
    component: string;
    value: string;
  }[];
  proTips: string[];
  warning?: string;
}

export interface KnownIssue {
  id: string;
  title: string;
  system: 'cooling' | 'engine' | 'suspension' | 'transmission' | 'brakes' | 'electrical' | 'body' | 'exhaust';
  systemLabel: string;
  frequency: 'Очень частая' | 'Частая' | 'Средняя';
  severity: 'Критическая' | 'Высокая' | 'Умеренная';
  symptoms: string[];
  rootCause: string;
  affectedEngines: EngineType[];
  affectedDrivetrain?: DrivetrainType;
  solution: string[];
  keyParts: {
    name: string;
    oem: string;
    recommendation: string;
  }[];
  preventiveAdvice: string;
  estimatedCostRub: string;
}

export interface TireSpec {
  width: number;       // e.g. 215
  aspectRatio: number; // e.g. 60
  rimDiameter: number; // e.g. 16
  rimWidth: number;    // e.g. 6.5
  offset: number;      // e.g. 46 (ET)
}

export interface MaintenanceInterval {
  mileageKm: number;
  periodMonths: number;
  title: string;
  isMajor: boolean;
  tasks: {
    item: string;
    type: 'replace' | 'inspect' | 'clean' | 'lubricate';
    fluidOrPart?: string;
    oemCode?: string;
  }[];
}

export interface LogEntry {
  id: string;
  date: string;
  mileage: number;
  category: string;
  title: string;
  partsUsed?: string;
  costTotal: number;
  notes?: string;
}

export interface ObdDtc {
  code: string;
  title: string;
  system: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  symptoms: string[];
  commonCauses: string[];
  diagnosticSteps: string[];
  outlanderSpecifics: string;
  recommendedFix: string;
}

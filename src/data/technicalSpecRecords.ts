/**
 * Source-backed technical data, grouped by exact engine/chassis application.
 * Do not merge these values into other markets/engines without evidence.
 */
export interface TechnicalDataSource {
  id: string;
  title: string;
  url: string;
  sourceType: 'service-manual-mirror' | 'oem-manual';
  accessedAt: string;
  scope: string;
}
export interface TechnicalValue {
  label: string;
  value: string;
  conditions?: string;
  sourceId: string;
}
export interface EngineTechnicalRecord {
  id: string;
  modelId: string;
  chassisCode: string;
  engineCode: string;
  marketScope: string;
  modelYears: string;
  verificationStatus: 'partially-verified' | 'verified';
  summary: string;
  values: TechnicalValue[];
  sourceIds: string[];
  limitations: string[];
}
export const TECHNICAL_DATA_SOURCES: TechnicalDataSource[] = [
  {
    id: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual',
    title: 'Mitsubishi Outlander 2006 Service Manual — engine mechanical 4G69',
    url: 'https://www.jdmfsm.info/Auto/Japan/Mitsubishi/Outlander/Manuals/2006/Service%20Manual%20PDF/WM/GR00000600-11E.pdf',
    sourceType: 'service-manual-mirror',
    accessedAt: '2026-10-16',
    scope: 'Service manual pages for Outlander CU5W / engine 4G69. Use the page/group identifiers printed in the manual and verify that the manual matches the vehicle market and model year.'
  }
];

export const ENGINE_TECHNICAL_RECORDS: EngineTechnicalRecord[] = [
  {
    id: 'mitsubishi-outlander-cu5w-4g69-2006-engine-mechanical',
    modelId: 'outlander-1',
    chassisCode: 'CU5W',
    engineCode: '4G69',
    marketScope: 'CU5W configuration covered by the referenced 2006 service manual; market must be confirmed by chassis/VIN',
    modelYears: 'Manual edition 2006; applicable production range must be confirmed from VIN',
    verificationStatus: 'partially-verified',
    summary: 'The service manual identifies the Outlander CU5W engine as 4G69-2, 2,378 cm³, SOHC 16-valve. The values below are service-manual specifications, not universal settings for every Mitsubishi vehicle using the 4G69 family.',
    sourceIds: ['mitsubishi-outlander-2006-cu5w-4g69-service-manual'],
    values: [
      { label: 'Engine displacement', value: '2,378 cm³', conditions: 'CU5W / 4G69-2', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Bore × stroke', value: '87 × 100 mm', conditions: 'Engine overhaul specification', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Compression ratio', value: '9.5:1', conditions: 'Engine overhaul specification', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Cylinder/head arrangement', value: 'Inline 4-cylinder, SOHC, 16 valves', conditions: 'Service-manual engine model table', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Fuel system', value: 'Electronically controlled multipoint fuel injection', conditions: 'Service-manual engine data', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Valve clearance — intake', value: '0.20 mm', conditions: 'Engine hot; check/adjust using the manual procedure', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Valve clearance — exhaust', value: '0.30 mm', conditions: 'Engine hot; check/adjust using the manual procedure', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Basic ignition timing', value: '5° BTDC ± 3°', conditions: 'Use specified diagnostic mode and manual procedure', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Idle speed — manual transmission', value: '680 ± 100 rpm', conditions: 'Service-manual standard value; required test conditions apply', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Idle speed — automatic transmission', value: '750 ± 100 rpm', conditions: 'Service-manual standard value; required test conditions apply', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Compression pressure — standard', value: '1,560 kPa at 200 rpm', conditions: 'Engine test procedure and battery/cranking conditions matter', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Compression pressure — limit', value: '1,130 kPa at 200 rpm', conditions: 'Service-manual limit; do not interpret without cylinder-to-cylinder comparison', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Maximum cylinder pressure difference', value: '98 kPa', conditions: 'Service-manual limit across cylinders', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Balancer belt deflection', value: '5–7 mm after adjustment/replacement; 5–10 mm when checked', conditions: 'Measure using the exact manual procedure and tools', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' },
      { label: 'Timing belt tensioner rod protrusion', value: '3.8–4.5 mm', conditions: 'Service-manual specification', sourceId: 'mitsubishi-outlander-2006-cu5w-4g69-service-manual' }
    ],
    limitations: [
      'This record covers CU5W/4G69 service specifications only; it does not establish compatibility for CU2W/4G63, other engines, other chassis, or other model years.',
      'The referenced document is a hosted mirror of a service manual, not a currently verified official manufacturer portal.',
      'Do not use these values as a substitute for the complete procedure, safety warnings, special-tool requirements, torque tables, or VIN-specific service information.',
      'Engine power/torque, fuel economy, fluid capacities, transmission service fluid and part numbers are deliberately not inferred from this engine-mechanical excerpt.'
    ]
  }
];

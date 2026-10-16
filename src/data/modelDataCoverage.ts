/**
 * Auditable coverage matrix for every model currently in japaneseBrandsData.ts.
 * Sources here are official documentation/catalog entry points, not proof that
 * a particular year/engine/market has been verified. Exact fitment still needs VIN/frame.
 */
export type CoverageLevel = 'source-backed-sample' | 'partial-existing-data' | 'not-yet-source-verified';
export interface ModelCoverageSource {
  label: string;
  url: string;
  kind: 'official-manuals' | 'official-parts' | 'service-information' | 'catalog-entry';
  note: string;
}
export interface ModelCoverageRecord {
  modelId: string;
  make: string;
  model: string;
  coverage: CoverageLevel;
  verifiedScope: string;
  sources: ModelCoverageSource[];
  remainingWork: string[];
}

const mitsubishiManuals = 'https://www.mitsubishi-motors.ru/for-mitsubishi-owners/manuals/';
const mitsubishiParts = 'https://parts.mitsubishicars.com/';
const mitsubishiService = 'https://www.mitsubishitechinfo.com/epacarb/svcoverview.jsp';

export const MODEL_DATA_COVERAGE: ModelCoverageRecord[] = [
  {
    modelId: 'outlander-1', make: 'Mitsubishi', model: 'Outlander I (CU_W / Airtrek)',
    coverage: 'source-backed-sample',
    verifiedScope: 'Limited sample: Outlander CU5W / 4G69 service-manual values; separate North American 2006 2.4L parts listings are only partial-fitment.',
    sources: [
      { label: 'Outlander 2006 service manual mirror — engine 4G69', url: 'https://www.jdmfsm.info/Auto/Japan/Mitsubishi/Outlander/Manuals/2006/Service%20Manual%20PDF/WM/GR00000600-11E.pdf', kind: 'service-information', note: 'Hosted mirror; verify manual market and chassis before repair.' },
      { label: 'Mitsubishi official parts store', url: 'https://parts.mitsubishicars.com/v-2006-mitsubishi-outlander--ls--2-4l-l4-gas', kind: 'official-parts', note: 'US-market 2006 2.4L; not a universal European CU5W catalogue.' },
      { label: 'European Outlander CU5W parts navigation', url: 'https://partsouq.com/', kind: 'catalog-entry', note: 'Select exact frame/VIN; this general entry page is not itself fitment evidence.' }
    ],
    remainingWork: ['All engine codes/outputs by market and production date', 'Manual/automatic transmission codes, capacities and approved fluids', 'Brakes, suspension, timing drive and electrical parts by VIN', 'OEM accessory part numbers by trim and market']
  },
  {
    modelId: 'outlander-xl', make: 'Mitsubishi', model: 'Outlander XL / II (CW_W)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; this matrix does not yet certify every engine, gearbox or market variant.',
    sources: [
      { label: 'Mitsubishi owner manuals (Russia)', url: mitsubishiManuals, kind: 'official-manuals', note: 'Choose exact model year; owner manual does not replace workshop manual.' },
      { label: 'Mitsubishi official parts store', url: mitsubishiParts, kind: 'official-parts', note: 'Choose year, trim and engine; US market only.' },
      { label: 'Mitsubishi technical service information', url: mitsubishiService, kind: 'service-information', note: 'Workshop manuals and bulletins for US-market vehicles; subscription may be required.' }
    ],
    remainingWork: ['Separate 2.0/2.4/3.0L and diesel applications by market', 'Identify CVT and automatic transmission codes before fluid/capacity claims', 'OEM part numbers and supersessions by VIN', 'Official accessory catalogue and trim compatibility']
  },
  {
    modelId: 'outlander-3', make: 'Mitsubishi', model: 'Outlander III (GF_W / PHEV)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; ICE and PHEV must be treated as distinct powertrain families.',
    sources: [
      { label: 'Mitsubishi owner manuals (Russia)', url: mitsubishiManuals, kind: 'official-manuals', note: 'Choose model year and PHEV/non-PHEV variant.' },
      { label: 'Mitsubishi official parts store', url: mitsubishiParts, kind: 'official-parts', note: 'VIN and trim needed; regional catalogue coverage varies.' },
      { label: 'Mitsubishi technical service information', url: mitsubishiService, kind: 'service-information', note: 'Use exact model year and drivetrain.' }
    ],
    remainingWork: ['Separate 2.0/2.4/3.0, diesel and PHEV by market/year', 'PHEV battery, inverter, charging and cooling service data from appropriate manual', 'Transmission/transfer/rear-drive variants', 'OEM accessories and superseded numbers']
  },
  {
    modelId: 'pajero-4', make: 'Mitsubishi', model: 'Pajero IV (V80 / V90)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; not yet validated for every V80/V90 engine, market and transmission.',
    sources: [
      { label: 'Mitsubishi owner manuals (Russia)', url: mitsubishiManuals, kind: 'official-manuals', note: 'Choose model year and engine family.' },
      { label: 'Mitsubishi official parts store', url: mitsubishiParts, kind: 'official-parts', note: 'Regional model coverage differs.' },
      { label: 'Mitsubishi technical service information', url: mitsubishiService, kind: 'service-information', note: 'Workshop procedures and bulletins.' }
    ],
    remainingWork: ['Map 3.0/3.8 petrol and 3.2 diesel by market/year', 'Identify transmission and Super Select transfer case variants', 'Service capacities, torque values and intervals from workshop manual', 'Chassis-specific suspension/brake parts and accessories']
  },
  {
    modelId: 'lancer-9', make: 'Mitsubishi', model: 'Lancer IX (CS_A / Classic)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; engine and gearbox details still require exact regional variant verification.',
    sources: [
      { label: 'Mitsubishi owner manuals (Russia)', url: mitsubishiManuals, kind: 'official-manuals', note: 'Coverage of older model years may be incomplete.' },
      { label: 'Mitsubishi official parts store', url: mitsubishiParts, kind: 'official-parts', note: 'US-market catalogue does not cover all CS_A variants.' },
      { label: 'Mitsubishi technical service information', url: mitsubishiService, kind: 'service-information', note: 'Use correct model year and engine.' }
    ],
    remainingWork: ['Map 1.3/1.6/2.0 petrol and regional diesel versions', 'Gearbox code-specific fluids and capacities', 'Timing belt/chain by engine code', 'OEM suspension, brake, electrical and accessory numbers']
  },
  {
    modelId: 'pajero-sport-3', make: 'Mitsubishi', model: 'Pajero Sport III (KS_W)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; 2.4 diesel/3.0 petrol and market variants need separation.',
    sources: [
      { label: 'Mitsubishi owner manuals (Russia)', url: mitsubishiManuals, kind: 'official-manuals', note: 'Choose model year and powertrain.' },
      { label: 'Mitsubishi official parts store', url: mitsubishiParts, kind: 'official-parts', note: 'Regional availability varies.' },
      { label: 'Mitsubishi technical service information', url: mitsubishiService, kind: 'service-information', note: 'Workshop data and bulletins.' }
    ],
    remainingWork: ['Engine output and emissions by market', '8-speed automatic code and ATF specification verified against manual', '4WD transfer case/differential fluids and capacities', 'VIN-specific chassis parts and official accessories']
  },
  {
    modelId: 'toyota-land-cruiser-100', make: 'Toyota', model: 'Land Cruiser 100 / Cygnus',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; Land Cruiser and Cygnus market/trim differences remain.',
    sources: [
      { label: 'Toyota owner manuals and warranty guides', url: 'https://www.toyota.com/owners/resources/warranty-owners-manuals', kind: 'official-manuals', note: 'US-market resource; older/global 100-series documents may be unavailable.' },
      { label: 'Toyota parts and service entry point', url: 'https://www.toyota.com/owners/', kind: 'official-parts', note: 'Use VIN/frame and regional EPC for exact parts.' }
    ],
    remainingWork: ['Separate 1HD-FTE, 2UZ-FE and regional engines', 'Identify A343F/A750F and transfer case by build data', 'Axle ratio, differential lock and suspension variations', 'OEM part numbers and supersessions by frame number']
  },
  {
    modelId: 'toyota-rav4-3', make: 'Toyota', model: 'RAV4 (XA30)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; AWD/FWD, engine and regional variants not all validated.',
    sources: [
      { label: 'Toyota owner manuals and warranty guides', url: 'https://www.toyota.com/owners/resources/warranty-owners-manuals', kind: 'official-manuals', note: 'Use exact year and destination market.' },
      { label: 'Toyota owner resources', url: 'https://www.toyota.com/owners/', kind: 'official-parts', note: 'Older/global EPC data may require dealer or frame-number lookup.' }
    ],
    remainingWork: ['Map 2.0/2.4/2.5/3.5 and diesel variants by market', 'Identify U-series automatic/CVT/manual gearbox per VIN', 'AWD rear coupling and differential service details', 'OEM part numbers by trim, build month and frame']
  },
  {
    modelId: 'toyota-camry-40', make: 'Toyota', model: 'Camry (XV40)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; engine and transmission code coverage remains incomplete.',
    sources: [
      { label: 'Toyota owner manuals and warranty guides', url: 'https://www.toyota.com/owners/resources/warranty-owners-manuals', kind: 'official-manuals', note: 'Use model year and market.' },
      { label: 'Toyota owner resources', url: 'https://www.toyota.com/owners/', kind: 'official-parts', note: 'Exact OEM fitment requires VIN/frame lookup.' }
    ],
    remainingWork: ['Separate 2.0/2.4/2.5/3.5 engines by region', 'Map U250E/U660E and other transmission codes', 'Timing drive and service data per engine', 'OEM suspension, brake, body and accessory numbers']
  },
  {
    modelId: 'nissan-xtrail-t31', make: 'Nissan', model: 'X-Trail (T31)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; market, engine, CVT and manual/automatic variants require separation.',
    sources: [
      { label: 'Nissan owner manuals and guides', url: 'https://www.nissanusa.com/owners/ownership/manuals-guides.html', kind: 'official-manuals', note: 'US resource; T31 regional manuals may need local Nissan documentation.' },
      { label: 'Nissan owners entry point', url: 'https://www.nissanusa.com/owners.html', kind: 'official-parts', note: 'Exact OEM parts need VIN and regional EPC.' }
    ],
    remainingWork: ['Map MR20DE, QR25DE and M9R diesel by market', 'Confirm JF011E/CVT vs automatic/manual gearbox codes', 'CVT fluid specification and capacity from matching manual', '4WD coupling, differential and chassis parts by VIN']
  },
  {
    modelId: 'nissan-patrol-y61', make: 'Nissan', model: 'Patrol GR (Y61)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; engine and axle/drivetrain variants vary substantially by market.',
    sources: [
      { label: 'Nissan owner manuals and guides', url: 'https://www.nissanusa.com/owners/ownership/manuals-guides.html', kind: 'official-manuals', note: 'US portal is not comprehensive for global Y61.' },
      { label: 'Nissan owners entry point', url: 'https://www.nissanusa.com/owners.html', kind: 'official-parts', note: 'Use regional EPC/frame lookup.' }
    ],
    remainingWork: ['Separate TB48DE, TB45E, ZD30, TD42 and regional engine revisions', 'Identify manual/automatic transmission and axle ratios', 'Hub, differential lock and transfer case variations', 'Chassis and body OEM parts by frame/VIN']
  },
  {
    modelId: 'suzuki-grand-vitara-2', make: 'Suzuki', model: 'Grand Vitara II (JT / Escudo)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; regional engine and drivetrain differences remain.',
    sources: [
      { label: 'Suzuki global site', url: 'https://www.globalsuzuki.com/', kind: 'official-manuals', note: 'Historical workshop manuals and EPC data may require a regional distributor.' },
      { label: 'Suzuki owners resources', url: 'https://www.suzuki.com/owners/', kind: 'official-parts', note: 'US owner resource; not proof of global JT fitment.' }
    ],
    remainingWork: ['Map J20A/J24B/N32A and diesel variants by market', 'Identify Aisin automatic and manual gearbox codes', 'Transfer case and differential fluids by 2WD/4WD variant', 'VIN-specific OEM chassis/body numbers']
  },
  {
    modelId: 'suzuki-jimny-3', make: 'Suzuki', model: 'Jimny (JB43 / JB74)',
    coverage: 'partial-existing-data',
    verifiedScope: 'JB43 and JB74 are separate generations/engine families; existing combined label must not imply shared parts.',
    sources: [
      { label: 'Suzuki global site', url: 'https://www.globalsuzuki.com/', kind: 'official-manuals', note: 'Select market-specific manuals or distributor documentation.' },
      { label: 'Suzuki owners resources', url: 'https://www.suzuki.com/owners/', kind: 'official-parts', note: 'US coverage does not establish fitment for every Jimny market.' }
    ],
    remainingWork: ['Split JB43 and JB74 into separate model records', 'Verify M13A/K15B and transmission codes by market', 'Transfer case, axle and gear oil capacities', 'Chassis-specific OEM parts and accessories']
  },
  {
    modelId: 'subaru-forester-sg-sh', make: 'Subaru', model: 'Forester (SG / SH)',
    coverage: 'partial-existing-data',
    verifiedScope: 'SG and SH combine different generations; turbo/NA and transmission families must be split.',
    sources: [
      { label: 'Subaru owner resources', url: 'https://www.subaru.com/owners/vehicle-resources.html', kind: 'official-manuals', note: 'Choose year and market; workshop manuals may be separate.' },
      { label: 'Subaru owners portal', url: 'https://www.subaru.com/owners.html', kind: 'official-parts', note: 'Exact OEM fitment requires VIN and market-specific EPC.' }
    ],
    remainingWork: ['Split SG and SH generations and turbo/NA engines', 'Identify 4EAT/5EAT/manual/CVT per build data', 'Confirm EJ/FB engine service values and timing-drive type', 'AWD drivetrain, suspension and OEM part numbers by VIN']
  },
  {
    modelId: 'honda-cr-v-3', make: 'Honda', model: 'CR-V (RE / III поколение)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Existing model card contains starter data; RE variants differ by region and drivetrain.',
    sources: [
      { label: 'Honda owner information', url: 'https://owners.honda.com/vehicle-information/information', kind: 'official-manuals', note: 'US-market owner information; workshop data may require Honda service access.' },
      { label: 'Honda owners entry point', url: 'https://owners.honda.com/', kind: 'official-parts', note: 'Use VIN and market-specific EPC for exact parts.' }
    ],
    remainingWork: ['Separate K20/K24 and diesel engines by market', 'Confirm automatic/manual gearbox and AWD rear differential fluid', 'Engine-specific valve clearance and timing chain service data', 'OEM parts and accessory fitment by VIN']
  },
  {
    modelId: 'mazda-cx5-ke-kf', make: 'Mazda', model: 'CX-5 (KE / KF)',
    coverage: 'partial-existing-data',
    verifiedScope: 'KE and KF are separate generations; Skyactiv petrol/diesel and transmission variants must be separated.',
    sources: [
      { label: 'Mazda owner manuals', url: 'https://www.mazdausa.com/owners', kind: 'official-manuals', note: 'Select exact year; US manuals do not cover all global diesel variants.' },
      { label: 'Mazda owner portal', url: 'https://www.mazdausa.com/owners', kind: 'official-parts', note: 'Use VIN and regional EPC; workshop specifications may require service access.' }
    ],
    remainingWork: ['Split KE/KF and engine codes by market', 'Confirm FW6A-EL/Skyactiv-Drive and manual gearbox variants', 'Diesel emissions/DPF and service-specific requirements', 'OEM chassis, body and accessory parts by VIN']
  },
  {
    modelId: 'lexus-rx-350', make: 'Lexus', model: 'RX 350 / RX 300 (XU30 / AL10)',
    coverage: 'partial-existing-data',
    verifiedScope: 'RX 300 and RX 350 across XU30/AL10 are distinct model/engine applications; do not share specs blindly.',
    sources: [
      { label: 'Lexus owner manuals', url: 'https://www.lexus.com/My-Lexus/resources/owners-manuals', kind: 'official-manuals', note: 'Select exact model year and model.' },
      { label: 'Lexus owner resources', url: 'https://www.lexus.com/My-Lexus', kind: 'official-parts', note: 'Exact parts require VIN and market-specific EPC.' }
    ],
    remainingWork: ['Split XU30 RX 300/330/350 and AL10 RX 350 by year/market', 'Identify engine and U-series transmission code', 'AWD transfer/differential service data', 'OEM suspension and accessory fitment by VIN']
  },
  {
    modelId: 'infiniti-fx-35-37', make: 'Infiniti', model: 'FX 35 / FX 37 / QX70 (S51)',
    coverage: 'partial-existing-data',
    verifiedScope: 'FX35/FX37/QX70 name and engine changes vary by model year and market.',
    sources: [
      { label: 'Infiniti manuals and guides', url: 'https://www.infinitiusa.com/owners/ownership/manuals-guides.html', kind: 'official-manuals', note: 'Select exact year/model; global FX/QX70 coverage may differ.' },
      { label: 'Infiniti owner portal', url: 'https://www.infinitiusa.com/owners.html', kind: 'official-parts', note: 'Exact OEM fitment needs VIN and regional EPC.' }
    ],
    remainingWork: ['Separate VQ35DE/VQ37VHR and market/year applications', 'Identify 5AT/7AT and AWD drivetrain codes', 'Fluid capacities and service procedures from exact manual', 'OEM chassis/body parts and accessory numbers']
  },
  {
    modelId: 'daihatsu-terios', make: 'Daihatsu', model: 'Terios / Be-go (J200 / Toyota Rush)',
    coverage: 'partial-existing-data',
    verifiedScope: 'Terios/Be-go/Rush naming overlaps across markets but not every component is interchangeable.',
    sources: [
      { label: 'Daihatsu official global site', url: 'https://www.daihatsu.com/', kind: 'official-manuals', note: 'Older model workshop information may need distributor support.' },
      { label: 'Toyota owner resources', url: 'https://www.toyota.com/owners/', kind: 'official-parts', note: 'Use only where Toyota Rush VIN/frame catalog confirms fitment; do not infer from shared platform.' }
    ],
    remainingWork: ['Map K3-VE/3SZ-VE and other market-specific engines', 'Confirm automatic/manual transmission and 4WD transfer variants', 'Separate Daihatsu/Toyota part-number namespaces', 'VIN/frame-specific OEM parts and accessories']
  },
  {
    modelId: 'isuzu-dmax', make: 'Isuzu', model: 'D-Max (RT50 / RG01)',
    coverage: 'partial-existing-data',
    verifiedScope: 'D-Max generation, diesel engine, transmission and emissions configuration vary by market.',
    sources: [
      { label: 'Isuzu official site', url: 'https://www.isuzu.co.jp/world/', kind: 'official-manuals', note: 'Global product site; older workshop manuals may require regional distributor access.' },
      { label: 'Isuzu commercial vehicle service and parts', url: 'https://www.isuzucv.com/en/parts/service', kind: 'official-parts', note: 'Regional applicability must be checked for RT50/RG01.' }
    ],
    remainingWork: ['Map 4JK1/4JJ1 and regional diesel revisions', 'Identify manual/automatic transmission and transfer case', 'Diesel fuel/emissions service data by year and market', 'Frame-number OEM parts and accessory catalog']
  }
];

export const MODEL_DATA_COVERAGE_BY_ID = Object.fromEntries(
  MODEL_DATA_COVERAGE.map(record => [record.modelId, record])
) as Record<string, ModelCoverageRecord>;

export function getModelCoverage(modelId: string): ModelCoverageRecord | undefined {
  return MODEL_DATA_COVERAGE_BY_ID[modelId];
}

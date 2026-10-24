import { JAPANESE_BRANDS } from '../src/data/japaneseBrandsData';
import '../src/data/expandedJapaneseModels';
import '../src/data/expandedMazdaSuzukiModels';
import '../src/data/expandedKeiCars';

type Model = (typeof JAPANESE_BRANDS)[number]['models'][number];

const errors: string[] = [];
const warnings: string[] = [];
const seenIds = new Set<string>();
const seenBodyYears = new Set<string>();
let modelCount = 0;
let unverifiedCount = 0;
let sourceBackedCount = 0;
let placeholderCount = 0;
const duplicateNames = new Map<string, string[]>();
const vague = /(уточнить|зависит от|не задано|не применимо|проверить по|по vin|по рынку|не подтвержд|unknown|tbd)/i;

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

for (const brand of JAPANESE_BRANDS) {
  check(Boolean(brand.id && brand.name), `Brand missing id/name: ${JSON.stringify(brand)}`);
  for (const model of brand.models as Model[]) {
    modelCount++;
    check(Boolean(model.id && model.brandId && model.name && model.generation && model.years), `Model missing identity fields: ${brand.name}/${model.name}`);
    check(model.brandId === brand.id, `Brand mismatch: ${brand.id}/${model.id} has brandId=${model.brandId}`);
    if (seenIds.has(model.id)) errors.push(`Duplicate model id: ${model.id}`);
    seenIds.add(model.id);
    const bodyYearsKey = `${brand.id}|${model.name.trim().toLocaleLowerCase('ru-RU')}|${model.bodyType}|${model.years.replace(/[–—]/g, '-').replace(/\s+/g, '')}`.toLocaleLowerCase('ru-RU');
    if (seenBodyYears.has(bodyYearsKey)) errors.push(`Duplicate make+name+body+years: ${brand.id}/${model.name}/${model.bodyType}/${model.years} (${model.id})`);
    seenBodyYears.add(bodyYearsKey);
    const normalizedName = `${brand.id}:${model.name.trim().toLocaleLowerCase('ru-RU').replace(/\s+/g, ' ')}`;
    duplicateNames.set(normalizedName, [...(duplicateNames.get(normalizedName) ?? []), model.id]);
    check(Array.isArray(model.engines) && model.engines.length > 0, `No engine entries: ${model.id}`);
    check(Array.isArray(model.transmissions) && model.transmissions.length > 0, `No transmission entries: ${model.id}`);
    if (model.engines.some((engine) => !engine.code.trim() || !engine.name.trim() || !engine.displacement.trim())) {
      errors.push(`Incomplete engine selection option: ${model.id}`);
    }
    if (model.transmissions.some((transmission) => !transmission.trim())) {
      errors.push(`Empty transmission selection option: ${model.id}`);
    }
    if (model.engines.some((engine) => vague.test(`${engine.code} ${engine.name} ${engine.displacement} ${engine.powerHp} ${engine.torqueNm}`))) {
      placeholderCount++;
      warnings.push(`Engine data is placeholder/vague: ${model.id}`);
    }
    if (model.transmissions.some((transmission) => vague.test(transmission))) warnings.push(`Transmission data is placeholder/vague: ${model.id}`);
    if (model.dimensions && [model.dimensions.lengthMm, model.dimensions.widthMm, model.dimensions.heightMm, model.dimensions.wheelbaseMm].some((n) => n === null || !Number.isFinite(n) || n <= 0)) warnings.push(`Missing/non-positive dimensions: ${model.id}`);
    const normalizedDimensions = model.dimensions;
    const normalizedDimensionFields = ['length', 'width', 'height', 'wheelbase', 'groundClearance', 'weight'] as const;
    const missingNormalizedDimensions = normalizedDimensionFields.filter((field) => {
      const value = normalizedDimensions?.[field];
      return !Number.isFinite(value) || (value ?? 0) <= 0;
    });
    if (missingNormalizedDimensions.length) {
      warnings.push(`Normalized dimensions missing for ${model.id}: ${missingNormalizedDimensions.join(', ')}`);
    }
    if (!Array.isArray(model.tires) || model.tires.length === 0) {
      warnings.push(`No tire options recorded: ${model.id}`);
    } else {
      for (const tire of model.tires) {
        const sizeMatch = /^(\d{3})\/(\d{2,3})R(\d{2}(?:\.\d)?)$/i.exec(tire.size.trim());
        if (!sizeMatch) {
          warnings.push(`Unrecognized tire size format: ${model.id} ${tire.size}`);
          continue;
        }
        const [, widthText, aspectText, rimText] = sizeMatch;
        const expectedWidth = Number(widthText);
        const expectedAspect = Number(aspectText);
        const expectedRimDiameter = Number(rimText) * 25.4;
        const expectedDiameter = expectedRimDiameter + 2 * expectedWidth * expectedAspect / 100;
        if (Math.abs(tire.width - expectedWidth) > 1 || Math.abs(tire.aspectRatio - expectedAspect) > 0.1 ||
            Math.abs(tire.rimDiameter - expectedRimDiameter) > 1 || Math.abs(tire.diameter - expectedDiameter) > 4) {
          errors.push(`Tire dimensions conflict with size notation: ${model.id} ${tire.size}`);
        }
        if (!tire.loadIndex.trim() || !tire.speedRating.trim() || !tire.notes.trim()) {
          errors.push(`Incomplete tire option: ${model.id} ${tire.size}`);
        }
      }
    }
    if (!Array.isArray(model.wiperBladeSize) || model.wiperBladeSize.length === 0) {
      warnings.push(`No wiper blade sizes recorded: ${model.id}`);
    } else {
      for (const wiper of model.wiperBladeSize) {
        if (!wiper.driverSide.trim() || !wiper.passengerSide.trim() || !wiper.notes.trim()) {
          errors.push(`Incomplete wiper blade entry: ${model.id}`);
        }
      }
    }
    if (!model.dataQualityNote) warnings.push(`Missing data-quality note: ${model.id}`);
    if (!model.verificationStatus || model.verificationStatus === 'unverified') warnings.push(`Not verified against exact variant sources: ${model.id}`);
    check(Boolean(model.fluidsAndCapacities?.engineOil && model.fluidsAndCapacities?.transmissionFluid), `Missing fluid guidance: ${model.id}`);
    check(Boolean(model.bulbsSummary?.lowBeam && model.bulbsSummary?.highBeam), `Missing lamp guidance: ${model.id}`);
    check(Array.isArray(model.obdDiagnostics?.commonCodes), `Missing OBD list: ${model.id}`);
    check(Array.isArray(model.knownIssues), `Missing known-issues list: ${model.id}`);

    if (model.verificationStatus !== 'verified') unverifiedCount++;
    if (model.sourceReferences?.length) sourceBackedCount++;
    if (model.verificationStatus === 'verified' && !model.sourceReferences?.length) {
      errors.push(`Incorrect verified status without source references: ${model.id}`);
    }
    if (model.verificationStatus === 'verified' && model.sourceReferences?.some((source) => !source.url || !source.scope || !source.label)) {
      errors.push(`Incomplete source reference on verified model: ${model.id}`);
    }
    if (model.fluidsAndCapacities?.engineOilVolume && /\d/.test(model.fluidsAndCapacities.engineOilVolume) && !model.sourceReferences?.length) {
      warnings.push(`Numerical engine-oil capacity has no attached evidence: ${model.id}`);
    }
    if (model.bulbsSummary?.lowBeam && /\b(H[1-9]|HB[1-9]|D[1-9]|H[0-9]{2})\b/i.test(model.bulbsSummary.lowBeam) && !model.sourceReferences?.length) {
      warnings.push(`Specific low-beam bulb has no attached evidence: ${model.id}`);
    }
    for (const code of model.obdDiagnostics?.commonCodes ?? []) {
      if (!/^[PBCU][0-9A-F]{4}$/i.test(code.code)) errors.push(`Invalid OBD code format: ${model.id} ${code.code}`);
      if (!code.title || !code.hint) errors.push(`Incomplete OBD code description: ${model.id} ${code.code}`);
    }
  }
}

console.log(`Catalog audit: ${JAPANESE_BRANDS.length} brands, ${modelCount} models`);
for (const [name, ids] of duplicateNames) if (ids.length > 1) warnings.push(`Possible duplicate model names within brand: ${name}: ${ids.join(', ')}`);
console.log(`Evidence: ${sourceBackedCount} models have source references; ${unverifiedCount} are not marked verified; ${placeholderCount} have placeholder engine data.`);
console.log(`Warnings: ${warnings.length}; errors: ${errors.length}`);
for (const warning of warnings.slice(0, 100)) console.warn(`WARN: ${warning}`);
if (warnings.length > 100) console.warn(`... plus ${warnings.length - 100} additional warnings`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exitCode = 1;

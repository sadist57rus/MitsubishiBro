import { JAPANESE_BRANDS } from '../src/data/japaneseBrandsData';
import '../src/data/expandedJapaneseModels';

type Model = (typeof JAPANESE_BRANDS)[number]['models'][number];

const errors: string[] = [];
const warnings: string[] = [];
const seenIds = new Set<string>();
let modelCount = 0;
let unverifiedCount = 0;
let sourceBackedCount = 0;

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
    check(Array.isArray(model.engines) && model.engines.length > 0, `No engine entries: ${model.id}`);
    check(Array.isArray(model.transmissions) && model.transmissions.length > 0, `No transmission entries: ${model.id}`);
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
console.log(`Evidence: ${sourceBackedCount} models have source references; ${unverifiedCount} are not marked verified.`);
console.log(`Warnings: ${warnings.length}; errors: ${errors.length}`);
for (const warning of warnings.slice(0, 100)) console.warn(`WARN: ${warning}`);
if (warnings.length > 100) console.warn(`... plus ${warnings.length - 100} additional warnings`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length) process.exitCode = 1;

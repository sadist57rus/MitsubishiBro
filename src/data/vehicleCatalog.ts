import { JAPANESE_BRANDS as baseBrands, type JapaneseBrand, type JapaneseCarModel } from './japaneseBrandsData';
import './expandedJapaneseModels';

/** One canonical catalog for onboarding, garage, header filters, and the model hub. */
function deduplicateModels(brand: JapaneseBrand): JapaneseCarModel[] {
  const seenIds = new Set<string>();
  const seenBodyYears = new Set<string>();
  return brand.models.filter((model) => {
    if (seenIds.has(model.id)) return false;
    seenIds.add(model.id);
    const years = model.years.replace(/[–—]/g, '-').replace(/\s+/g, '');
    const key = [brand.id, model.bodyType, years].join('|').toLocaleLowerCase('ru-RU');
    if (seenBodyYears.has(key)) return false;
    seenBodyYears.add(key);
    return true;
  });
}

for (const brand of baseBrands) brand.models = deduplicateModels(brand);
export const JAPANESE_BRANDS: JapaneseBrand[] = baseBrands;
export function getVehicleCatalog(): JapaneseBrand[] { return JAPANESE_BRANDS; }

export type { JapaneseBrand, JapaneseCarModel, JapaneseCarEngine } from './japaneseBrandsData';

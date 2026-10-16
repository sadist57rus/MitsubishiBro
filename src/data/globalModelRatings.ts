/**
 * Global popularity/reliability context for generation records.
 * Sales are full-year 2024 worldwide estimates where a cited public source reports a model-level figure.
 * Reliability scores are brand-level Consumer Reports predicted-reliability scores (2025 survey), NOT
 * model-specific probabilities. Missing model sales are explicitly unranked rather than invented.
 */
import { GENERATION_BODY_CATALOG } from './generationBodyCatalog';

export type EvidenceLevel = 'global-sales-reported' | 'brand-reliability-proxy' | 'insufficient-model-level-data';
export interface GlobalModelRating {
  recordId: string;
  globalSalesRank2024: number | null;
  globalSalesUnits2024: number | null;
  globalSalesNote: string;
  reliabilityBrandScore2025: number | null;
  reliabilityBasis: string;
  popularityScore: number | null;
  reliabilityScore: number | null;
  combinedScore: number | null;
  evidence: EvidenceLevel[];
  caveat: string;
}
const globalSales: Record<string, {rank:number; units:number; note:string}> = {
  'toyota-rav4-xa30': {rank:1, units:1187000, note:'Семейство RAV4/Wildlander: около 1,187 млн мировых продаж за 2024 год; показатель относится к модели в целом, не поколению XA30.'},
  'toyota-camry-xv40': {rank:8, units:593000, note:'Camry: около 593 тыс. мировых продаж за 2024 год; показатель модели в целом, не поколения XV40.'},
  'nissan-xtrail-t31': {rank:null as never, units:null as never, note:''} as never,
};
const brandReliability: Record<string, {score:number; basis:string}> = {
  Toyota: {score:66, basis:'Consumer Reports 2025 predicted reliability, brand-level score'},
  Subaru: {score:63, basis:'Consumer Reports 2025 predicted reliability, brand-level score'},
  Lexus: {score:60, basis:'Consumer Reports 2025 predicted reliability, brand-level score'},
  Honda: {score:59, basis:'Consumer Reports 2025 predicted reliability, brand-level score'},
  Nissan: {score:57, basis:'Consumer Reports 2025 predicted reliability, brand-level score'},
  Acura: {score:54, basis:'Consumer Reports 2025 predicted reliability, brand-level score'},
};
const popularityScore = (rank:number|null):number|null => {
  if (rank === null) return null;
  if (rank <= 10) return 100;
  if (rank <= 25) return 85;
  if (rank <= 50) return 70;
  if (rank <= 100) return 55;
  return 40;
};
export const GLOBAL_MODEL_RATINGS: GlobalModelRating[] = GENERATION_BODY_CATALOG.map(record => {
  const sales = globalSales[record.id];
  const reliability = brandReliability[record.make];
  const p = sales ? popularityScore(sales.rank) : null;
  const r = reliability?.score ?? null;
  return {
    recordId: record.id,
    globalSalesRank2024: sales?.rank ?? null,
    globalSalesUnits2024: sales?.units ?? null,
    globalSalesNote: sales?.note ?? 'Сопоставимые открытые мировые продажи именно этой модели/поколения не подтверждены; глобальное место не присваивается.',
    reliabilityBrandScore2025: r,
    reliabilityBasis: reliability?.basis ?? 'Сопоставимый открытый балл Consumer Reports для этой марки не опубликован/не подтверждён в используемом наборе данных.',
    popularityScore: p,
    reliabilityScore: r,
    combinedScore: p !== null && r !== null ? Math.round(p * 0.6 + r * 0.4) : null,
    evidence: [
      ...(sales ? ['global-sales-reported' as const] : ['insufficient-model-level-data' as const]),
      ...(reliability ? ['brand-reliability-proxy' as const] : ['insufficient-model-level-data' as const]),
    ],
    caveat: 'Индекс популярности и комбинированный балл рассчитываются только при наличии данных о продажах; надёжность здесь — прокси по марке, а не статистика конкретного двигателя/поколения. Не сравнивать как абсолютный рейтинг при разных рынках и возрастах автомобилей.',
  };
});
export const GLOBAL_RATING_METHODOLOGY = {
  salesYear: 2024,
  reliabilitySurveyYear: 2025,
  formula: 'combinedScore = 60% popularityScore + 40% brand reliability score; calculated only when model-level global sales rank and brand score are available',
  sources: [
    {label:'Global vehicle sales ranking, 2024', url:'https://www.focus2move.com/world-car-market-2024/', scope:'Worldwide model ranking; model-family sales, not individual generation'},
    {label:'JATO-derived global sales summary, 2024', url:'https://www.racv.com.au/royalauto/transport/cars/top-selling-car-in-the-world-2024.html', scope:'Worldwide model sales for leading models'},
    {label:'Consumer Reports reliability rankings, 2025', url:'https://www.consumerreports.org/cars/car-reliability-owner-satisfaction/who-makes-the-most-reliable-cars-a7824554938/', scope:'Brand-level predicted reliability scores, not all-model or generation-level reliability'},
  ],
};

/**
 * Дополнительные характеристики автомобиля.
 *
 * Числа в CarDimensions выражены в миллиметрах и килограммах.
 * Наличие значения не означает, что оно подтверждено для каждой комплектации:
 * уровень проверки хранится в записи модели/варианта и не повышается автоматически.
 */
export interface CarDimensions {
  length: number; // мм
  width: number; // мм
  height: number; // мм
  wheelbase: number; // мм
  groundClearance: number; // мм
  weight: number; // кг
}

export interface TireOption {
  /** Размер в маркировке боковины, например 225/55R17. */
  size: string;
  /** Расчётный внешний диаметр шины, мм. */
  diameter: number;
  /** Номинальная ширина шины, мм. */
  width: number;
  /** Высота профиля в процентах от ширины. */
  aspectRatio: number;
  /** Посадочный диаметр обода, мм (дюймы × 25,4). */
  rimDiameter: number;
  loadIndex: string;
  speedRating: string;
  /** Статус применимости и оговорки по рынку/комплектации. */
  notes: string;
}

export interface WiperBladeSize {
  driverSide: string;
  passengerSide: string;
  notes: string;
}

/**
 * Старый формат каталога сохранён для обратной совместимости UI.
 * Не путать с CarDimensions: это существовавшая до миграции схема.
 */
export interface LegacyCarDimensions {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  groundClearanceMm: number;
  trunkVolumeLiters: string;
  fuelTankLiters: number;
  curbWeightKg: string;
}

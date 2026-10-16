/**
 * Technical reference matrix for all currently separated generation/body entries.
 * Existing known data is reused from generationBodyCatalog; missing values are
 * explicitly represented as verification tasks rather than fabricated numbers.
 */
import { GENERATION_BODY_CATALOG, type GenerationBodyRecord } from './generationBodyCatalog';

export type TechnicalArea =
  | 'engine' | 'transmission' | 'drivetrain' | 'fluids' | 'maintenance'
  | 'diagnostics' | 'suspension-brakes' | 'electrical' | 'body-parts';

export interface TechnicalReferenceSection {
  area: TechnicalArea;
  title: string;
  known: string[];
  verificationRequired: string[];
}

export interface VehicleTechnicalReference {
  recordId: string;
  make: string;
  model: string;
  generation: string;
  chassisCodes: string[];
  years: string;
  bodyStyles: string[];
  engines: string[];
  transmissions: string[];
  sections: TechnicalReferenceSection[];
  fitmentWarning: string;
}

const sharedSections = (r: GenerationBodyRecord): TechnicalReferenceSection[] => [
  {
    area: 'engine',
    title: 'Двигатель и обслуживание',
    known: r.engineFamilies,
    verificationRequired: [
      'Точный индекс двигателя, мощность и крутящий момент по коду модификации и рынку',
      'Тип привода ГРМ, зазоры клапанов и регламент проверки по заводскому руководству',
      'Масло: SAE/API/ACEA/OEM-допуск и объём с фильтром/без фильтра',
      'Свечи/накал, фильтры, ремни, цепи и расходники — по индексу двигателя',
      'Моменты затяжки и последовательности сборки — по ремонтному руководству'
    ]
  },
  {
    area: 'transmission',
    title: 'Коробка передач и сцепление',
    known: r.transmissionFamilies,
    verificationRequired: [
      'Код агрегата и применимость по VIN/табличке',
      'Точный тип жидкости, спецификация, объём обслуживания и полный сухой объём',
      'Температура, положение автомобиля и процедура контроля уровня',
      'Регламент фильтра/сетки, прокладки, адаптации и обучения после ремонта',
      'Передаточные числа и допустимые сочетания с двигателем/приводом'
    ]
  },
  {
    area: 'drivetrain',
    title: 'Привод, раздатка и дифференциалы',
    known: [r.drivetrainNotes],
    verificationRequired: [
      'Код раздаточной коробки, муфты или межосевого дифференциала',
      'Спецификация и объём масла для каждого отдельного агрегата',
      'Передаточные числа главных пар и совместимость передней/задней оси',
      'Процедура диагностики муфты, карданов, ШРУСов и ступичных подшипников'
    ]
  },
  {
    area: 'fluids',
    title: 'Жидкости и заправочные объёмы',
    known: ['В этом индексе зафиксированы семейства силовых агрегатов; универсальные объёмы намеренно не подставляются.'],
    verificationRequired: [
      'Моторное масло: спецификация и объём по двигателю',
      'Охлаждающая жидкость: тип, полный объём и объём при обычной замене',
      'Трансмиссионная жидкость: отдельная спецификация для MT/AT/CVT/hybrid',
      'Тормозная жидкость, гидроусилитель/электроусилитель, кондиционер и хладагент',
      'Для AWD: раздатка, передний и задний редукторы — отдельными строками'
    ]
  },
  {
    area: 'maintenance',
    title: 'Регламент ТО',
    known: ['Набор узлов для регламентного обслуживания определяется конкретной модификацией и условиями эксплуатации.'],
    verificationRequired: [
      'Интервалы по времени и пробегу для масла, фильтров, свечей и ремней',
      'Осмотр тормозов, подвески, рулевого управления, шин и пыльников',
      'Проверка охлаждения, приводных ремней, аккумулятора и утечек',
      'Регламент тяжёлых условий эксплуатации и сокращённые интервалы',
      'Сброс сервисного индикатора и процедуры после обслуживания'
    ]
  },
  {
    area: 'diagnostics',
    title: 'Диагностика',
    known: ['Применимость диагностических протоколов и доступных блоков зависит от года, рынка и двигателя.'],
    verificationRequired: [
      'Разъём диагностики, поддерживаемые протоколы и перечень электронных блоков',
      'Заводские DTC, условия регистрации, контрольные значения и тест-планы',
      'Распиновки, точки массы, предохранители и реле по конкретному кузову',
      'Процедуры сброса адаптаций, калибровки датчиков и обучения агрегатов'
    ]
  },
  {
    area: 'suspension-brakes',
    title: 'Подвеска, рулевое управление и тормоза',
    known: [r.bodyStyles.join(', ')],
    verificationRequired: [
      'Тип подвески и различия передней/задней оси по кузову и приводу',
      'Размеры дисков, тип суппортов, колодки и применимость ABS/ESC',
      'Углы установки колёс, контрольные высоты и моменты затяжки',
      'OEM-номера рычагов, шаровых, сайлентблоков, амортизаторов и ступиц'
    ]
  },
  {
    area: 'electrical',
    title: 'Электрика и оборудование',
    known: ['Комплектация электрического оборудования зависит от рынка и пакета оснащения.'],
    verificationRequired: [
      'Тип и ёмкость аккумулятора, система зарядки и расположение блоков',
      'Предохранители, реле, лампы и схемы электропроводки',
      'Датчики двигателя, ABS/ESP, SRS и трансмиссии с разъёмами и распиновками',
      'Для гибридов/PHEV: высоковольтная система, батарея и правила HV-безопасности'
    ]
  },
  {
    area: 'body-parts',
    title: 'Кузов, детали и применимость',
    known: [`Коды кузова: ${r.chassisCodes.join(', ')}`, `Типы кузова: ${r.bodyStyles.join(', ')}`],
    verificationRequired: [
      'OEM-номера деталей с заменами и supersession-цепочками',
      'Различия по дате выпуска, рынку, комплектации, рестайлингу и стороне руля',
      'Размеры колёс, PCD, DIA, ET и допустимые шины по версии',
      'Кузовные панели, оптика, стёкла и элементы салона — по коду кузова'
    ]
  }
];

export const TECHNICAL_REFERENCE_MATRIX: VehicleTechnicalReference[] = GENERATION_BODY_CATALOG.map(r => ({
  recordId: r.id,
  make: r.make,
  model: r.model,
  generation: r.generation,
  chassisCodes: r.chassisCodes,
  years: r.years,
  bodyStyles: r.bodyStyles,
  engines: r.engineFamilies,
  transmissions: r.transmissionFamilies,
  sections: sharedSections(r),
  fitmentWarning: 'Справочная запись поколения. Перед ремонтом, заправкой жидкостей или заказом деталей требуется подтвердить рынок, дату выпуска, VIN/номер кузова и код агрегата.'
}));

export const TECHNICAL_REFERENCE_BY_RECORD_ID = Object.fromEntries(
  TECHNICAL_REFERENCE_MATRIX.map(item => [item.recordId, item])
) as Record<string, VehicleTechnicalReference>;

export const TECHNICAL_REFERENCE_COVERAGE = {
  generationBodyRecords: TECHNICAL_REFERENCE_MATRIX.length,
  recordsWithEngineFamilies: TECHNICAL_REFERENCE_MATRIX.filter(x => x.engines.length > 0).length,
  recordsWithTransmissionFamilies: TECHNICAL_REFERENCE_MATRIX.filter(x => x.transmissions.length > 0).length,
  sectionsPerRecord: 8,
  note: 'Это матрица технического наполнения и проверки; она не означает, что все точные числовые спецификации уже подтверждены.'
};

/**
 * Source-backed starter catalog batch.
 *
 * Scope is intentionally narrow: North American 2006 Outlander 2.4L 160 hp
 * records from the official Mitsubishi Motors Parts Store. Do not generalize
 * these numbers to European/Japanese CU5W variants without VIN/EPC confirmation.
 */
export type CatalogSection = 'consumables' | 'full' | 'accessories';
export type CatalogEvidenceStatus = 'verified-source-scope' | 'partial-fitment' | 'category-only';

export interface CatalogSource {
  id: string;
  title: string;
  url: string;
  sourceType: 'oem-parts-store' | 'oem-manual' | 'specialist-catalog';
  accessedAt: string;
  scope: string;
}

export interface SourceBackedPart {
  id: string;
  name: string;
  section: CatalogSection;
  category: string;
  maker: string;
  partNumber?: string;
  modelId: string;
  market: string;
  modelYears: string;
  engine: string;
  trimScope: string;
  status: CatalogEvidenceStatus;
  sourceIds: string[];
  notes: string;
}

export const PARTS_CATALOG_SOURCES: CatalogSource[] = [
  {
    id: 'mitsubishi-us-outlander-2006-air-filters',
    title: 'Official Mitsubishi Motors Parts Store — 2006 Outlander, air/fuel filters',
    url: 'https://parts.mitsubishicars.com/v-2006-mitsubishi-outlander--ls--2-4l-l4-gas/air-and-fuel-delivery--filters',
    sourceType: 'oem-parts-store',
    accessedAt: '2026-10-16',
    scope: 'US-market 2006 Outlander 2.4L L4 gasoline. The page lists air cleaner element MZ690193 among compatible listings; confirm VIN and supersessions.'
  },
  {
    id: 'mitsubishi-us-outlander-2006-engine-filters',
    title: 'Official Mitsubishi Motors Parts Store — 2006 Outlander, engine filters',
    url: 'https://parts.mitsubishicars.com/v-2006-mitsubishi-outlander--ls--2-4l-l4-gas/engine--filters',
    sourceType: 'oem-parts-store',
    accessedAt: '2026-10-16',
    scope: 'US-market 2006 Outlander LS 2.4L L4 gasoline. Lists oil filter MZ690116 and engine components; exact trim/VIN confirmation still required.'
  },
  {
    id: 'mitsubishi-us-outlander-2006-ignition',
    title: 'Official Mitsubishi Motors Parts Store — 2006 Outlander, ignition system',
    url: 'https://parts.mitsubishicars.com/v-2006-mitsubishi-outlander--ls--2-4l-l4-gas/electrical--ignition-system',
    sourceType: 'oem-parts-store',
    accessedAt: '2026-10-16',
    scope: 'US-market 2006 Outlander LS 2.4L L4 gasoline. Lists ignition and engine sensors; confirm vehicle-specific fitment before ordering.'
  },
  {
    id: 'mitsubishi-us-outlander-2006-transmission',
    title: 'Official Mitsubishi Motors Parts Store — 2006 Outlander, transmission hard parts',
    url: 'https://parts.mitsubishicars.com/v-2006-mitsubishi-outlander--ls--2-4l-l4-gas/transmission--transmission-hard-parts',
    sourceType: 'oem-parts-store',
    accessedAt: '2026-10-16',
    scope: 'US-market 2006 Outlander LS 2.4L L4 gasoline. The catalog lists transmission filter MD752072 and valve-body oil filter MD758684; transmission code and VIN must be checked.'
  },
  {
    id: 'mitsubishi-us-outlander-accessories',
    title: 'Official Mitsubishi Motors Parts Store — Outlander parts and accessories',
    url: 'https://parts.mitsubishicars.com/v-mitsubishi-outlander',
    sourceType: 'oem-parts-store',
    accessedAt: '2026-10-16',
    scope: 'Official category directory for maintenance, replacement parts and accessories. It is not proof that every listed accessory fits every generation.'
  },
  {
    id: 'partsouq-europe-cu5w',
    title: 'PartSouq — Mitsubishi Outlander Europe CU5W genuine parts catalog',
    url: 'https://partsouq.com/ru/catalog/genuine/parts?c=Mitsubishi&gid=19&q=JMBXRCU5W6U006740&ssd=%24%2AKwEzBxY5VnhjUlduc0w_A2t_X1hGNzg1NCYgL2lAfCRoIj0nEhsIWVJEUzRXMVBoZnw2NDckLSJkJ2J0CDcwMVQ0MDBEenpobCI9JEJVMlJ6emhibCU8I1hVTQEMBjciegAAAAB93OL6%24&vid=0',
    sourceType: 'specialist-catalog',
    accessedAt: '2026-10-16',
    scope: 'European-market CU5W catalog organized by frame/model and VIN query; use as a navigation source and confirm the exact vehicle frame before taking part numbers.'
  }
];

/**
 * Part numbers below are copied from the linked official US catalog pages.
 * Status means the source page supports the listing in its stated scope,
 * not that it fits every regional Outlander I or every 4G69 vehicle.
 */
export const SOURCE_BACKED_PARTS: SourceBackedPart[] = [
  {
    id: 'outlander-us-2006-air-filter-mz690193',
    name: 'Элемент воздушного фильтра двигателя',
    section: 'consumables',
    category: 'Фильтры',
    maker: 'Mitsubishi',
    partNumber: 'MZ690193',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2004–2006',
    engine: '2.4L бензин, 160 hp (каталог США; не автоматически равно любой 4G69)',
    trimScope: '2006 Outlander 2.4L; проверить комплектацию и VIN',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-air-filters'],
    notes: 'Официальная страница перечисляет этот номер для Outlander и ряда других моделей/двигателей. Перед заказом сверить VIN, размеры элемента и замену номера.'
  },
  {
    id: 'outlander-us-2006-oil-filter-mz690116',
    name: 'Масляный фильтр двигателя',
    section: 'consumables',
    category: 'Фильтры и ТО',
    maker: 'Mitsubishi',
    partNumber: 'MZ690116',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L L4 бензин',
    trimScope: 'Outlander LS 2.4L; VIN/двигатель проверить',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-engine-filters'],
    notes: 'Номер найден в официальном каталоге США как oil filter. Не считать подтверждённым для европейского CU5W/4G69 без проверки оригинального каталога по VIN.'
  },
  {
    id: 'outlander-us-2006-valve-cover-gasket-mn137117',
    name: 'Прокладка крышки клапанов',
    section: 'full',
    category: 'Двигатель и уплотнения',
    maker: 'Mitsubishi',
    partNumber: 'MN137117',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2004–2006 (как указано в карточке совместимости)',
    engine: '2.4L бензин, 160 hp',
    trimScope: 'Сверить VIN и код двигателя',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-engine-filters'],
    notes: 'Официальная карточка связывает прокладку с рядом Mitsubishi 2.4L, включая Outlander. Не распространять на все рынки и годы.'
  },
  {
    id: 'outlander-us-2006-oil-filler-cap-1250a015',
    name: 'Крышка маслозаливной горловины',
    section: 'full',
    category: 'Двигатель и уплотнения',
    maker: 'Mitsubishi',
    partNumber: '1250A015',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L бензин — по карточке каталога',
    trimScope: 'Проверить VIN и номер заменённой детали',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-engine-filters'],
    notes: 'Номер показан в официальном каталоге 2006 Outlander. Проверить применимость к конкретному рынку/двигателю.'
  },
  {
    id: 'outlander-us-2006-crankshaft-sensor-mr985119',
    name: 'Датчик положения коленчатого вала',
    section: 'full',
    category: 'Электрика и управление двигателем',
    maker: 'Mitsubishi',
    partNumber: 'MR985119',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L бензин, без турбонаддува — по карточке каталога',
    trimScope: 'Проверить VIN, разъём и ревизию',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-ignition'],
    notes: 'Официальная карточка перечисляет Outlander среди применений датчика. Требуется VIN-проверка перед заказом.'
  },
  {
    id: 'outlander-us-2006-camshaft-sensor-mr578768',
    name: 'Датчик положения распределительного вала',
    section: 'full',
    category: 'Электрика и управление двигателем',
    maker: 'Mitsubishi',
    partNumber: 'MR578768',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L бензин — по карточке каталога',
    trimScope: 'Проверить VIN, разъём и ревизию',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-ignition'],
    notes: 'Номер указан в официальной карточке датчика. Перед применением сверить с исходным номером и схемой для конкретного автомобиля.'
  },
  {
    id: 'outlander-us-2006-knock-sensor-mn137468',
    name: 'Датчик детонации',
    section: 'full',
    category: 'Электрика и управление двигателем',
    maker: 'Mitsubishi',
    partNumber: 'MN137468',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L бензин — по карточке каталога',
    trimScope: 'Проверить VIN, разъём и ревизию',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-ignition'],
    notes: 'Номер показан в официальном каталоге для 2.4L Outlander и родственных моделей. Не использовать как универсальную совместимость.'
  },
  {
    id: 'outlander-us-2006-transmission-filter-md752072',
    name: 'Фильтр автоматической трансмиссии',
    section: 'consumables',
    category: 'Трансмиссия и ТО',
    maker: 'Mitsubishi',
    partNumber: 'MD752072',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L L4 бензин',
    trimScope: 'Код трансмиссии обязателен; подтверждение по VIN',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-transmission'],
    notes: 'Официальная страница перечисляет transmission filter. Нельзя считать применимым к любой коробке Outlander без проверки кода агрегата.'
  },
  {
    id: 'outlander-us-2006-valve-body-filter-md758684',
    name: 'Фильтр гидроблока автоматической трансмиссии',
    section: 'full',
    category: 'Трансмиссия',
    maker: 'Mitsubishi',
    partNumber: 'MD758684',
    modelId: 'outlander-1',
    market: 'США / Северная Америка',
    modelYears: '2006',
    engine: '2.4L L4 бензин',
    trimScope: 'Код трансмиссии и VIN обязательны',
    status: 'partial-fitment',
    sourceIds: ['mitsubishi-us-outlander-2006-transmission'],
    notes: 'Каталог описывает позицию как OIL FILTER, A/T VALVE BODY. Требуется проверка по коду коробки и VIN.'
  },
  {
    id: 'outlander-oem-accessories-category',
    name: 'Оригинальные аксессуары Mitsubishi Outlander',
    section: 'accessories',
    category: 'Официальные аксессуары',
    maker: 'Mitsubishi Motors',
    modelId: 'outlander-1',
    market: 'Каталог США; ассортимент зависит от поколения',
    modelYears: 'Не универсально',
    engine: 'Не применимо',
    trimScope: 'Только после выбора поколения/комплектации и проверки по VIN',
    status: 'category-only',
    sourceIds: ['mitsubishi-us-outlander-accessories'],
    notes: 'Официальный магазин выделяет коврики, коврики багажника, багажные системы, дефлекторы, эмблемы и другие аксессуары. Конкретные артикулы для Outlander I пока не подтверждены в этой записи.'
  }
];

export function getCatalogSource(sourceId: string): CatalogSource | undefined {
  return PARTS_CATALOG_SOURCES.find(source => source.id === sourceId);
}

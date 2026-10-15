export interface FactoryWheelSpec {
  name: string;
  pcd: string;
  dia: number;
  fastener: string;
  thread: string;
  tighteningTorque: string;
  standardSizes: {
    tire: string;
    rim: string;
    et: number;
    pressureFrontBar: number;
    pressureRearBar: number;
    description: string;
  }[];
}

export const FACTORY_SPECS: FactoryWheelSpec = {
  name: 'Mitsubishi Outlander I (CU2W, CU4W, CU5W) / Airtrek (CU2W, CU4W)',
  pcd: '5x114.3 (5 болтов / шпилек на окружности 114.3 мм)',
  dia: 67.1,
  fastener: 'Колесные гайки с закрытым конусом 60° (или оригинальные с плоской пресс-шайбой на заводских дисках)',
  thread: 'M12 x 1.5 (шаг 1.5 мм)',
  tighteningTorque: '98 – 118 Н·м (10 – 12 кгс·м)',
  standardSizes: [
    {
      tire: '215/60 R16',
      rim: '6.5J x 16',
      et: 46,
      pressureFrontBar: 2.1,
      pressureRearBar: 2.1,
      description: 'Базовый заводской размер для большинства версий 2.0 (CU2W) и 2.4 (CU4W/CU5W). Идеальный баланс мягкости хода и управляемости.'
    },
    {
      tire: '215/58 R17',
      rim: '6.5J x 17',
      et: 46,
      pressureFrontBar: 2.2,
      pressureRearBar: 2.2,
      description: 'Редкий заводской размер первичной комплектации японского рынка Airtrek.'
    },
    {
      tire: '215/55 R17',
      rim: '7.0J x 17',
      et: 46,
      pressureFrontBar: 2.2,
      pressureRearBar: 2.2,
      description: 'Штатный размер для европейских версий Sport и двигателей 2.4 MIVEC. Точная реакция на руль.'
    },
    {
      tire: '225/55 R17',
      rim: '7.0J x 17',
      et: 46,
      pressureFrontBar: 2.2,
      pressureRearBar: 2.2,
      description: 'Штатный размер для версий Outlander Turbo 2.0 4G63T и рестайлинговых топ-комплектаций.'
    }
  ]
};

export interface AlternativeTireOption {
  tireSize: string;
  rimRecommendation: string;
  diameterMm: number;
  diameterDiffMm: number;
  clearanceChangeMm: number;
  speedoDiffPercent: number;
  category: 'comfort' | 'offroad' | 'sport' | 'budget';
  categoryLabel: string;
  pros: string[];
  cons: string[];
  compatibilityStatus: 'ideal' | 'tight' | 'rubbing_risk';
  compatibilityLabel: string;
  notes: string;
}

export const ALTERNATIVE_TIRES: AlternativeTireOption[] = [
  {
    tireSize: '215/65 R16',
    rimRecommendation: '6.5J – 7.0J x 16, ET 40–46',
    diameterMm: 686,
    diameterDiffMm: 22,
    clearanceChangeMm: 11.0,
    speedoDiffPercent: 3.3,
    category: 'comfort',
    categoryLabel: 'Комфорт / Народный выбор №1',
    pros: [
      '+11 мм к реальному дорожному просвету',
      'Огромный выбор резины в магазинах по приятным ценам',
      'Подвеска работает намного мягче, "глотает" ямы и трамвайные пути',
      'Защита диска от замятия на бездорожье'
    ],
    cons: [
      'Спидометр показывает реальную скорость 1:1 со спутником GPS (пропадает заводской запас спидометра)',
      'Чуть менее резкий отклик на руль в скоростных поворотах'
    ],
    compatibilityStatus: 'ideal',
    compatibilityLabel: 'Встает идеально без доработок',
    notes: 'Самый популярный и рекомендуемый размер среди владельцев Outlander 1 в РФ и СНГ. Нигде не трет даже при полной загрузке!'
  },
  {
    tireSize: '215/70 R16',
    rimRecommendation: '6.5J x 16, ET 42–46',
    diameterMm: 707,
    diameterDiffMm: 43,
    clearanceChangeMm: 21.5,
    speedoDiffPercent: 6.5,
    category: 'offroad',
    categoryLabel: 'Максимальный Off-Road лифт',
    pros: [
      '+21.5 мм клиренса без вмешательства в подвеску и без проставок!',
      'Брутальный вид кроссовера, отличная проходимость на колеях'
    ],
    cons: [
      'Зазор между протектором и нижней опорной чашкой передней стойки амортизатора всего 8-10 мм!',
      'При установке шин с агрессивным грязевым протектором (A/T, M/T) может слегка задевать передний пластиковый подкрылок при полном вывороте руля',
      'Увеличение расхода топлива на 0.5–0.8 л/100 км'
    ],
    compatibilityStatus: 'tight',
    compatibilityLabel: 'Предельный размер впритык',
    notes: 'Предельный размер для штатных стоек. Требует исправных незаниженных пружин. Цепи противоскольжения не поместятся.'
  },
  {
    tireSize: '225/60 R16',
    rimRecommendation: '6.5J – 7.0J x 16, ET 42–46',
    diameterMm: 676,
    diameterDiffMm: 12,
    clearanceChangeMm: 6.0,
    speedoDiffPercent: 1.8,
    category: 'comfort',
    categoryLabel: 'Широкий профиль',
    pros: [
      '+6 мм клиренса',
      'Шире пятно контакта (+10 мм): улучшенное сцепление на торможении и ускорении',
      'Уверенное поведение на мокром асфальте'
    ],
    cons: [
      'Чуть чувствительнее к колейности асфальта'
    ],
    compatibilityStatus: 'ideal',
    compatibilityLabel: 'Встает отлично',
    notes: 'Отличный вариант для тех, кто хочет чуть повыше и пошире, сохранив динамику.'
  },
  {
    tireSize: '225/55 R17',
    rimRecommendation: '7.0J x 17, ET 42–46',
    diameterMm: 679,
    diameterDiffMm: 15,
    clearanceChangeMm: 7.5,
    speedoDiffPercent: 2.3,
    category: 'sport',
    categoryLabel: 'Стиль & Управляемость R17',
    pros: [
      '+7.5 мм дорожного просвета по сравнению с 215/60 R16',
      'Отличная курсовая устойчивость на скоростях 120-150 км/ч',
      'Красивый заполненный вид колесной арки'
    ],
    cons: [
      'Шины R17 дороже, чем R16'
    ],
    compatibilityStatus: 'ideal',
    compatibilityLabel: 'Штатный размер версий Turbo',
    notes: 'Оптимальный компромисс между управляемостью на трассе и эстетикой 17-дюймовых дисков.'
  },
  {
    tireSize: '235/45 R18',
    rimRecommendation: '7.5J – 8.0J x 18, ET 38–42',
    diameterMm: 669,
    diameterDiffMm: 5,
    clearanceChangeMm: 2.5,
    speedoDiffPercent: 0.8,
    category: 'sport',
    categoryLabel: 'Тюнинг R18 Стрит',
    pros: [
      'Эффектный агрессивный внешний вид',
      'Минимальные крены в поворотах'
    ],
    cons: [
      'Жестко на неровностях и выбоинах',
      'Риск погнуть диск на глубоких ямах',
      'Высокая чувствительность к колее'
    ],
    compatibilityStatus: 'tight',
    compatibilityLabel: 'Требует аккуратной езды',
    notes: 'Для любителей визуального стайлинга и хороших асфальтовых дорог.'
  }
];

export interface OemWheelModel {
  id: string;
  name: string;
  size: string;
  pcd: string;
  dia: string;
  et: string;
  oemNumber: string;
  weightKg: number;
  origin: string;
  description: string;
}

export const OEM_WHEELS_GALLERY: OemWheelModel[] = [
  {
    id: 'oem-star-16',
    name: 'Оригинальные «5-конечные Звезды» R16',
    size: '6.5J x 16 H2',
    pcd: '5x114.3',
    dia: '67.1 мм',
    et: 'ET 46',
    oemNumber: 'MR594982 / MN101031',
    weightKg: 9.6,
    origin: 'Mitsubishi конвейер (Enkei / Asahi Tec)',
    description: 'Легендарные штатные литые диски европейского Outlander I. Очень прочные, выдерживают сильнейшие ямы без трещин. Крепление под гайки с пресс-шайбой.'
  },
  {
    id: 'oem-airtrek-snow-16',
    name: 'Airtrek «Снежинка» / Мультиспица R16',
    size: '6.0J x 16 H2',
    pcd: '5x114.3',
    dia: '67.1 мм',
    et: 'ET 46',
    oemNumber: 'MR594980',
    weightKg: 9.2,
    origin: 'Mitsubishi Japan (Airtrek JDM)',
    description: 'Элегантный дизайн с раздвоенными тонкими лучами. Часто встречается на праворульных японских Airtrek.'
  },
  {
    id: 'oem-turbo-enkei-17',
    name: 'Outlander Turbo / Airtrek Turbo-R R17 (Enkei)',
    size: '7.0J x 17 H2',
    pcd: '5x114.3',
    dia: '67.1 мм',
    et: 'ET 46',
    oemNumber: 'MN101034 / MR959042',
    weightKg: 10.4,
    origin: 'Enkei for Mitsubishi Ralliart',
    description: 'Штатные диски турбо-версий 201-240 л.с. Спроектированы с увеличенным пространством под крупные 2-поршневые тормозные суппорты 294 мм.'
  },
  {
    id: 'oem-galant-avance-17',
    name: 'Mitsubishi Galant / Grandis 5-лучевые R17',
    size: '7.0J x 17 H2',
    pcd: '5x114.3',
    dia: '67.1 мм',
    et: 'ET 46',
    oemNumber: 'MN100388',
    weightKg: 10.2,
    origin: 'Mitsubishi OEM',
    description: 'Шикарно смотрятся на Outlander 1, идеально совпадают по вылету ET46 и ЦО 67.1 без проставок.'
  }
];

export function calculateTire(width: number, aspect: number, rim: number) {
  const sidewallMm = width * (aspect / 100);
  const rimMm = rim * 25.4;
  const totalDiameterMm = rimMm + sidewallMm * 2;
  const circumferenceMm = Math.PI * totalDiameterMm;
  const revsPerKm = 1000000 / circumferenceMm;
  return {
    sidewallMm,
    rimMm,
    totalDiameterMm,
    circumferenceMm,
    revsPerKm
  };
}

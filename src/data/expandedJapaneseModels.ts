import { JAPANESE_BRANDS, JapaneseCarModel } from './japaneseBrandsData';

/**
 * Supplemental, market-aware model records.
 * Values marked as market-dependent must be checked against the vehicle's VIN,
 * production month and destination market before being used for repair work.
 */
const makeSupplementalModel = (data: {
  id: string;
  brandId: string;
  name: string;
  generation: string;
  years: string;
  bodyType: JapaneseCarModel['bodyType'];
  overview: string;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  groundClearanceMm: number;
  trunkVolumeLiters: string;
  fuelTankLiters: number;
  curbWeightKg: string;
  engines: JapaneseCarModel['engines'];
  transmissions: string[];
  drivetrain?: string;
  sourceNotes: string;
}): JapaneseCarModel {
  return {
    id: data.id,
    brandId: data.brandId,
    name: data.name,
    generation: data.generation,
    years: data.years,
    bodyType: data.bodyType,
    drivetrain: data.drivetrain ?? 'Зависит от рынка и комплектации; уточнять по VIN и табличке автомобиля.',
    awdSystemName: 'Зависит от модификации; проверять по VIN',
    overview: data.overview,
    dimensions: {
      lengthMm: data.lengthMm,
      widthMm: data.widthMm,
      heightMm: data.heightMm,
      wheelbaseMm: data.wheelbaseMm,
      groundClearanceMm: data.groundClearanceMm,
      trunkVolumeLiters: data.trunkVolumeLiters,
      fuelTankLiters: data.fuelTankLiters,
      curbWeightKg: data.curbWeightKg
    },
    engines: data.engines,
    transmissions: data.transmissions,
    fuelEconomy: {
      city: 'Зависит от двигателя, коробки, рынка и цикла измерения',
      highway: 'Зависит от двигателя, коробки, рынка и цикла измерения',
      combined: 'Уточнить для конкретной модификации',
      fuelGrade: 'Сверить с руководством для рынка поставки'
    },
    fluidsAndCapacities: {
      engineOil: 'Уточнить по коду двигателя и руководству конкретного рынка',
      engineOilVolume: 'Не задано: требуется проверка по коду двигателя',
      transmissionFluid: 'Уточнить по коду коробки передач',
      transferCaseAndDiff: 'Уточнить по типу привода и кодам агрегатов',
      coolant: 'Уточнить по руководству конкретной модификации',
      brakeFluid: 'Уточнить по руководству конкретной модификации'
    },
    bulbsSummary: {
      lowBeam: 'Зависит от фары и комплектации; проверить маркировку',
      highBeam: 'Зависит от фары и комплектации; проверить маркировку',
      fogLights: 'Зависит от комплектации',
      frontTurn: 'Проверить по каталогу для конкретной фары',
      tailStop: 'Зависит от кузова и фонаря',
      interior: 'Зависит от комплектации'
    },
    obdDiagnostics: {
      portLocation: 'Обычно под панелью приборов; точное место зависит от поколения и рынка',
      commonCodes: [],
      protocol: 'Уточнить по году выпуска и рынку; совместимость сканеров различается'
    },
    knownIssues: [],
    dataQualityNote: data.sourceNotes
  } as JapaneseCarModel & { dataQualityNote: string };
}

const supplementalModels: JapaneseCarModel[] = [
  makeSupplementalModel({
    id: 'toyota-corolla-axio-e140-sedan',
    brandId: 'toyota',
    name: 'Corolla Axio (E140)',
    generation: 'X поколение, японская версия',
    years: '2006–2012',
    bodyType: 'Седан',
    overview: 'Компактный седан японского рынка. Линейка включала бензиновые двигатели 1.5 и 1.8 л; мощность и привод различаются по модификации.',
    lengthMm: 4410, widthMm: 1695, heightMm: 1460, wheelbaseMm: 2600,
    groundClearanceMm: 155, trunkVolumeLiters: 'Зависит от комплектации', fuelTankLiters: 50,
    curbWeightKg: 'Ориентировочно 1100–1300 кг',
    engines: [
      { code: '1NZ-FE', name: '1.5 л бензин, VVT-i', displacement: '1496 см³', powerHp: 'Зависит от версии и привода', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый двигатель семейства Toyota'], weaknesses: ['Состояние зависит от обслуживания и пробега'] },
      { code: '2ZR-FE', name: '1.8 л бензин, Dual VVT-i', displacement: '1797 см³', powerHp: 'Зависит от рынка и года', torqueNm: 'Зависит от версии', valves: '16V DOHC Dual VVT-i', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Более высокий запас мощности'], weaknesses: ['Требует проверки конкретной модификации'] }
    ],
    transmissions: ['МКПП или автоматическая трансмиссия — по комплектации', 'Вариатор на отдельных версиях'],
    drivetrain: 'Передний привод; встречаются версии 4WD для японского рынка.',
    sourceNotes: 'Годы и тип кузова сверены с историей Corolla Toyota. Размеры и моторы требуют уточнения по коду кузова/рынку; точные сервисные объёмы не заполнены намеренно.'
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-fielder-e140-wagon',
    brandId: 'toyota',
    name: 'Corolla Fielder (E140)',
    generation: 'X поколение, японская версия',
    years: '2006–2012',
    bodyType: 'Универсал',
    overview: 'Универсал семейства Corolla для японского рынка. Отличается кузовом и грузовым отсеком от седана Axio; спецификации зависят от комплектации.',
    lengthMm: 4420, widthMm: 1695, heightMm: 1480, wheelbaseMm: 2600,
    groundClearanceMm: 155, trunkVolumeLiters: 'Универсал; объём зависит от методики измерения', fuelTankLiters: 50,
    curbWeightKg: 'Ориентировочно 1100–1350 кг',
    engines: [
      { code: '1NZ-FE', name: '1.5 л бензин, VVT-i', displacement: '1496 см³', powerHp: 'Зависит от версии и привода', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Широкая распространённость'], weaknesses: ['Параметры различаются по рынку'] },
      { code: '2ZR-FE', name: '1.8 л бензин, Dual VVT-i', displacement: '1797 см³', powerHp: 'Зависит от рынка и года', torqueNm: 'Зависит от версии', valves: '16V DOHC Dual VVT-i', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Более высокая мощность'], weaknesses: ['Нужна проверка точной комплектации'] }
    ],
    transmissions: ['МКПП / автоматическая трансмиссия / вариатор — в зависимости от версии'],
    drivetrain: 'Передний привод; на японском рынке доступны отдельные версии 4WD.',
    sourceNotes: 'Кузов универсал выделен отдельно от седана. Уточнить габариты и агрегаты по номеру кузова перед ремонтом.'
  }),
  makeSupplementalModel({
    id: 'honda-civic-fd-sedan',
    brandId: 'honda',
    name: 'Civic VIII (FD)',
    generation: 'VIII поколение',
    years: '2005–2011',
    bodyType: 'Седан',
    overview: 'Седан Civic восьмого поколения. Для разных рынков предлагались разные двигатели, коробки и системы безопасности; не все агрегаты взаимозаменяемы.',
    lengthMm: 4545, widthMm: 1750, heightMm: 1435, wheelbaseMm: 2700,
    groundClearanceMm: 150, trunkVolumeLiters: 'Около 389 л, зависит от рынка', fuelTankLiters: 50,
    curbWeightKg: 'Ориентировочно 1200–1350 кг',
    engines: [
      { code: 'R18A1', name: '1.8 л i-VTEC', displacement: '1799 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V SOHC i-VTEC', fuelSystem: 'Электронный впрыск PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Умеренный расход при исправной системе', 'Цепной привод ГРМ'], weaknesses: ['Проверять состояние опор двигателя и системы охлаждения'] },
      { code: 'K20Z', name: '2.0 л i-VTEC — отдельные версии', displacement: '1998 см³', powerHp: 'Зависит от модификации', torqueNm: 'Зависит от модификации', valves: '16V DOHC i-VTEC', fuelSystem: 'Электронный впрыск PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Высокий потенциал двигателя'], weaknesses: ['Не устанавливался на все рынки и кузова'] }
    ],
    transmissions: ['5-ступенчатая МКПП — отдельные версии', 'Автоматическая трансмиссия — по рынку и комплектации'],
    sourceNotes: 'Данные относятся к седану FD; двигатель K20 и трансмиссии зависят от рынка. Проверять по VIN.'
  }),
  makeSupplementalModel({
    id: 'honda-civic-fn-hatchback',
    brandId: 'honda',
    name: 'Civic VIII (FN/FK)',
    generation: 'VIII поколение, европейский хэтчбек',
    years: '2006–2011',
    bodyType: 'Хэтчбек',
    overview: 'Европейский пятидверный хэтчбек Civic VIII. Его кузов, подвеска и моторная гамма отличаются от североамериканского седана FD.',
    lengthMm: 4255, widthMm: 1765, heightMm: 1460, wheelbaseMm: 2635,
    groundClearanceMm: 140, trunkVolumeLiters: 'Около 485 л, методика зависит от рынка', fuelTankLiters: 50,
    curbWeightKg: 'Ориентировочно 1200–1400 кг',
    engines: [
      { code: 'R18A2', name: '1.8 л i-VTEC', displacement: '1799 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V SOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Широко распространённая бензиновая версия'], weaknesses: ['Требует проверки истории обслуживания'] },
      { code: 'N22A2', name: '2.2 л i-CTDi дизель — отдельные версии', displacement: '2204 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь ГРМ', strengths: ['Высокий крутящий момент'], weaknesses: ['Состояние турбонаддува и топливной аппаратуры требует диагностики'] }
    ],
    transmissions: ['6-ступенчатая МКПП — отдельные версии', 'Автоматическая трансмиссия — зависит от двигателя и рынка'],
    sourceNotes: 'Отдельная запись для хэтчбека: спецификации седана FD не следует автоматически переносить на европейский FN/FK.'
  }),
  makeSupplementalModel({
    id: 'subaru-impreza-ge-sedan',
    brandId: 'subaru',
    name: 'Impreza III (GE)',
    generation: 'III поколение',
    years: '2007–2011',
    bodyType: 'Седан',
    overview: 'Седан Impreza третьего поколения. Основная особенность марки — оппозитные двигатели; наличие симметричного полного привода зависит от версии и рынка.',
    lengthMm: 4580, widthMm: 1740, heightMm: 1475, wheelbaseMm: 2620,
    groundClearanceMm: 155, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 60,
    curbWeightKg: 'Ориентировочно 1250–1450 кг',
    engines: [
      { code: 'EJ20', name: '2.0 л оппозитный бензиновый', displacement: '1994 см³', powerHp: 'Зависит от атмосферной/турбированной версии', torqueNm: 'Зависит от версии', valves: '16V Boxer', fuelSystem: 'Электронный впрыск', timingDrive: 'Ремень ГРМ', strengths: ['Низкий центр тяжести'], weaknesses: ['Важны история обслуживания и контроль утечек масла'] }
    ],
    transmissions: ['МКПП', '4-ступенчатая АКПП на отдельных версиях', 'Трансмиссия зависит от рынка'],
    drivetrain: 'Symmetrical AWD на многих версиях; существуют рыночные исключения.',
    sourceNotes: 'Седан GE отделён от хэтчбека GH. Код EJ20 объединяет несколько модификаций; мощность и регламент нельзя назначать без полного кода двигателя.'
  }),
  makeSupplementalModel({
    id: 'subaru-impreza-gh-hatchback',
    brandId: 'subaru',
    name: 'Impreza III (GH)',
    generation: 'III поколение',
    years: '2007–2011',
    bodyType: 'Хэтчбек',
    overview: 'Пятидверный хэтчбек Impreza третьего поколения. Технические характеристики зависят от двигателя, рынка и версии полного привода.',
    lengthMm: 4415, widthMm: 1740, heightMm: 1475, wheelbaseMm: 2620,
    groundClearanceMm: 155, trunkVolumeLiters: 'Зависит от рынка и положения сидений', fuelTankLiters: 60,
    curbWeightKg: 'Ориентировочно 1250–1450 кг',
    engines: [
      { code: 'EJ15 / EJ20', name: 'Оппозитные бензиновые двигатели — по рынку', displacement: '1.5–2.0 л', powerHp: 'Зависит от кода двигателя', torqueNm: 'Зависит от кода двигателя', valves: 'SOHC/DOHC в зависимости от версии', fuelSystem: 'Электронный впрыск', timingDrive: 'Для многих EJ — ремень; проверить код двигателя', strengths: ['Низкий центр тяжести'], weaknesses: ['Нельзя выбирать регламент только по названию Impreza'] }
    ],
    transmissions: ['МКПП', 'АКПП — в зависимости от рынка и комплектации'],
    drivetrain: 'Symmetrical AWD на многих версиях; привод зависит от рынка.',
    sourceNotes: 'Кузов GH — хэтчбек, не смешивать с седаном GE и спортивными WRX/STI.'
  }),
  makeSupplementalModel({
    id: 'mazda3-bk-sedan',
    brandId: 'mazda',
    name: 'Mazda3 (BK)',
    generation: 'I поколение',
    years: '2003–2009',
    bodyType: 'Седан',
    overview: 'Седан Mazda3 первого поколения. Линейка двигателей и коробок различается по рынку; данные MPS не следует переносить на обычные версии.',
    lengthMm: 4490, widthMm: 1755, heightMm: 1465, wheelbaseMm: 2640,
    groundClearanceMm: 160, trunkVolumeLiters: 'Около 413 л, зависит от рынка', fuelTankLiters: 55,
    curbWeightKg: 'Ориентировочно 1200–1400 кг',
    engines: [
      { code: 'Z6', name: '1.6 л бензин', displacement: '1598 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Простая атмосферная конфигурация'], weaknesses: ['Проверять состояние системы охлаждения и опор двигателя'] },
      { code: 'LF', name: '2.0 л бензин', displacement: '1999 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Хороший баланс мощности и повседневной эксплуатации'], weaknesses: ['Параметры различаются по рынку'] }
    ],
    transmissions: ['5-ступенчатая МКПП', '4-ступенчатая АКПП — отдельные версии'],
    sourceNotes: 'Габариты приведены как ориентир для распространённого седана BK. Проверять конкретную комплектацию и рынок.'
  }),
  makeSupplementalModel({
    id: 'mazda3-bk-hatchback',
    brandId: 'mazda',
    name: 'Mazda3 (BK)',
    generation: 'I поколение',
    years: '2003–2009',
    bodyType: 'Хэтчбек',
    overview: 'Пятидверный хэтчбек Mazda3 первого поколения. Запись отделена от седана, поскольку отличаются длина кузова и багажное пространство.',
    lengthMm: 4420, widthMm: 1755, heightMm: 1465, wheelbaseMm: 2640,
    groundClearanceMm: 160, trunkVolumeLiters: 'Зависит от методики измерения', fuelTankLiters: 55,
    curbWeightKg: 'Ориентировочно 1200–1400 кг',
    engines: [
      { code: 'Z6', name: '1.6 л бензин', displacement: '1598 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферный двигатель'], weaknesses: ['Проверять фактическую комплектацию'] },
      { code: 'LF', name: '2.0 л бензин', displacement: '1999 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Более высокая мощность'], weaknesses: ['Параметры зависят от рынка'] }
    ],
    transmissions: ['5-ступенчатая МКПП', '4-ступенчатая АКПП — отдельные версии'],
    sourceNotes: 'Кузов хэтчбек выделен отдельно; точные сервисные данные требуют идентификации автомобиля.'
  }),
  makeSupplementalModel({
    id: 'suzuki-swift-zc11-hatchback',
    brandId: 'suzuki',
    name: 'Swift (ZC11/ZC21)',
    generation: 'III поколение',
    years: '2004–2010',
    bodyType: 'Хэтчбек',
    overview: 'Компактный хэтчбек Swift. В зависимости от рынка доступны двигатели 1.3 и 1.5 л, а также разные трансмиссии и варианты привода.',
    lengthMm: 3695, widthMm: 1690, heightMm: 1500, wheelbaseMm: 2390,
    groundClearanceMm: 145, trunkVolumeLiters: 'Около 213 л, зависит от версии', fuelTankLiters: 43,
    curbWeightKg: 'Ориентировочно 1000–1150 кг',
    engines: [
      { code: 'M13A', name: '1.3 л бензин', displacement: '1328 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC VVT на отдельных версиях', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Компактность и экономичность'], weaknesses: ['Проверять цепной привод и состояние системы охлаждения'] },
      { code: 'M15A', name: '1.5 л бензин', displacement: '1490 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC VVT', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Более высокая тяга'], weaknesses: ['Комплектации отличаются по рынкам'] }
    ],
    transmissions: ['5-ступенчатая МКПП', '4-ступенчатая АКПП — отдельные версии'],
    drivetrain: 'Передний привод; отдельные версии для некоторых рынков имеют 4WD.',
    sourceNotes: 'Данные ориентировочные для поколения ZC. Проверять код кузова, двигатель и привод.'
  }),
  makeSupplementalModel({
    id: 'nissan-note-e11-hatchback',
    brandId: 'nissan',
    name: 'Note (E11)',
    generation: 'I поколение',
    years: '2005–2013',
    bodyType: 'Хэтчбек',
    overview: 'Компактный пятидверный хэтчбек с высокой крышей и трансформируемым салоном. Двигатели и трансмиссии отличаются в зависимости от рынка поставки.',
    lengthMm: 4020, widthMm: 1690, heightMm: 1535, wheelbaseMm: 2600,
    groundClearanceMm: 145, trunkVolumeLiters: 'Зависит от положения заднего ряда', fuelTankLiters: 46,
    curbWeightKg: 'Ориентировочно 1050–1250 кг',
    engines: [
      { code: 'HR15DE', name: '1.5 л бензин', displacement: '1498 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Компактный атмосферный двигатель'], weaknesses: ['Проверять расход масла и историю обслуживания'] },
      { code: 'HR16DE', name: '1.6 л бензин — отдельные рынки', displacement: '1598 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Распространённое семейство двигателей Nissan'], weaknesses: ['Не ставился на все версии E11'] }
    ],
    transmissions: ['МКПП', 'АКПП или вариатор — в зависимости от рынка'],
    sourceNotes: 'Моторы и коробки не универсальны для всех E11. Объёмы жидкостей и лампы не указаны без точной модификации.'
  })
];

for (const model of supplementalModels) {
  const brand = JAPANESE_BRANDS.find(item => item.id === model.brandId);
  if (brand && !brand.models.some(item => item.id === model.id)) {
    brand.models.push(model);
  }
}

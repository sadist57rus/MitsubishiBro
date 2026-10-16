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
      engineOil: 'Подбирать по коду двигателя и рынку: вязкость SAE и допуск API/ACEA — по руководству конкретной модификации.',
      engineOilVolume: 'Точный объём с фильтром/без фильтра зависит от двигателя; сверить с руководством и финальным уровнем по щупу.',
      transmissionFluid: 'Только спецификация конкретной коробки: ATF/CVT/MTF не взаимозаменяемы. Уточнить код агрегата и процедуру проверки уровня.',
      transferCaseAndDiff: 'Для AWD отдельно проверить раздатку, передний и задний редукторы; тип и объём зависят от кодов агрегатов.',
      coolant: 'Тип и объём по руководству конкретной версии; не смешивать неизвестные охлаждающие жидкости.',
      brakeFluid: 'DOT-класс и процедура обслуживания — по крышке бачка/руководству; для гибридов соблюдать специальные процедуры.'
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
      commonCodes: [
        { code: 'P0300', title: 'Пропуски воспламенения в нескольких цилиндрах', hint: 'Проверить свечи, катушки/провода, форсунки, подсос воздуха и компрессию; код сам по себе не указывает на одну деталь.' },
        { code: 'P0171', title: 'Слишком бедная смесь (Bank 1)', hint: 'Проверить подсос воздуха, MAF/MAP, давление топлива и утечки во впуске до замены датчиков.' },
        { code: 'P0420', title: 'Эффективность катализатора ниже порога (Bank 1)', hint: 'Сначала исключить пропуски, утечки выхлопа и неисправность датчиков кислорода; не менять катализатор только по одному коду.' },
        { code: 'P0130', title: 'Цепь датчика кислорода (Bank 1 Sensor 1)', hint: 'Проверить разъём, проводку, питание/нагреватель и данные сканера по процедуре конкретной модели.' },
        { code: 'P0115', title: 'Цепь датчика температуры охлаждающей жидкости', hint: 'Сверить показания на холодном моторе, проверить разъём, проводку и сопротивление датчика по мануалу.' },
        { code: 'P0120', title: 'Цепь датчика положения дросселя/педали', hint: 'Проверить параметры в реальном времени, питание, массу и разъёмы; распиновка зависит от двигателя.' },
        { code: 'P0700', title: 'Запрос индикации неисправности трансмиссии', hint: 'Считать отдельные коды блока TCM/TCU; P0700 обычно не является диагнозом самой коробки.' }
      ],
      protocol: 'OBD-II/EOBD и доступные блоки зависят от года, рынка и силового агрегата. Общие коды — справочные; заводские коды читать совместимым сканером.'
    },
    knownIssues: [
      { title: 'Подсос воздуха во впуске', symptoms: 'Нестабильный холостой ход, коррекции смеси, P0171/P0507 на части машин.', rootCause: 'Трещины шлангов, прокладки, PCV, негерметичный впуск.', solution: 'Дымогенератор/проверка герметичности, затем ремонт подтверждённого места.' },
      { title: 'Система зажигания', symptoms: 'Троение, рывки под нагрузкой, P0300–P030x.', rootCause: 'Износ свечей, катушек или проводов; иногда причина механическая.', solution: 'Считать стоп-кадр, проверить свечи и искру, перестановкой катушки локализовать дефект; при необходимости проверить компрессию.' },
      { title: 'Старение охлаждающей системы', symptoms: 'Потеря антифриза, перегрев, нестабильная температура.', rootCause: 'Утечки радиатора/патрубков/помпы, крышка, термостат или вентилятор.', solution: 'Опрессовать систему на холодном двигателе и проверить работу вентиляторов; не открывать горячую систему.' },
      { title: 'Износ опор двигателя и трансмиссии', symptoms: 'Вибрации на холостом ходу, удар при выборе D/R или начале движения.', rootCause: 'Просевшие опоры либо неисправность привода/трансмиссии.', solution: 'Проверить опоры под нагрузкой и исключить пропуски зажигания до замены.' },
      { title: 'Состояние трансмиссии и приводов', symptoms: 'Гул, вибрация, задержки переключения, рывки.', rootCause: 'Уровень/состояние жидкости, утечки, опоры, ШРУСы или внутренняя неисправность агрегата.', solution: 'Проверить точный тип коробки и спецификацию жидкости по VIN/коду агрегата; не смешивать ATF/CVT/DCT.' }
    ],
    dataQualityNote: data.sourceNotes
  };
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
    id: 'mitsubishi-lancer-x-cy-sedan',
    brandId: 'mitsubishi',
    name: 'Lancer X (CY)',
    generation: 'X поколение',
    years: '2007–2017',
    bodyType: 'Седан',
    overview: 'Седан Lancer десятого поколения. Встречаются разные бензиновые двигатели, механические и автоматизированные трансмиссии; характеристики Evolution нельзя переносить на обычный Lancer.',
    lengthMm: 4570, widthMm: 1760, heightMm: 1505, wheelbaseMm: 2635,
    groundClearanceMm: 165, trunkVolumeLiters: 'Около 400 л, зависит от рынка', fuelTankLiters: 59,
    curbWeightKg: 'Ориентировочно 1300–1500 кг',
    engines: [
      { code: '4A91', name: '1.5 л бензин MIVEC', displacement: '1499 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC MIVEC', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Экономичность атмосферной версии'], weaknesses: ['Проверять расход масла и состояние цепного привода'] },
      { code: '4B10', name: '1.8 л бензин MIVEC', displacement: '1798 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC MIVEC', fuelSystem: 'Распределённый впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый двигатель семейства 4B'], weaknesses: ['Нужна проверка точной версии и регламента'] }
    ],
    transmissions: ['5-ступенчатая МКПП', 'Вариатор CVT — отдельные версии', 'АКПП — по рынку и двигателю'],
    sourceNotes: 'Ориентир для обычного седана CY. Lancer Sportback и Evolution являются отдельными вариантами; регламенты сверять по коду агрегата.'
  }),
  makeSupplementalModel({
    id: 'toyota-prius-xw30-liftback',
    brandId: 'toyota',
    name: 'Prius (XW30)',
    generation: 'III поколение',
    years: '2009–2015',
    bodyType: 'Хэтчбек',
    overview: 'Пятидверный гибридный лифтбек с бензиновым двигателем и электромотором. Для диагностики важны данные гибридной системы, высоковольтной батареи и инвертора.',
    lengthMm: 4460, widthMm: 1745, heightMm: 1490, wheelbaseMm: 2700,
    groundClearanceMm: 140, trunkVolumeLiters: 'Около 445 л, зависит от методики', fuelTankLiters: 45,
    curbWeightKg: 'Ориентировочно 1350–1450 кг',
    engines: [
      { code: '2ZR-FXE', name: '1.8 л Atkinson-cycle Hybrid', displacement: '1798 см³', powerHp: 'Система: около 136 л.с. суммарно; зависит от рынка', torqueNm: 'Зависит от методики указания для ДВС/системы', valves: '16V DOHC VVT-i', fuelSystem: 'Электронный впрыск, гибридная система', timingDrive: 'Цепь ГРМ', strengths: ['Низкий расход топлива в подходящих условиях'], weaknesses: ['Требует специализированной диагностики гибридной системы'] }
    ],
    transmissions: ['Гибридная трансмиссия e-CVT (планетарный делитель мощности)'],
    drivetrain: 'Передний привод в большинстве версий; привод зависит от рынка.',
    sourceNotes: 'Гибридная системная мощность не равна мощности ДВС. Перед ремонтом проверять спецификацию для рынка и высоковольтную безопасность.'
  }),
  makeSupplementalModel({
    id: 'nissan-tiida-c11-hatchback',
    brandId: 'nissan',
    name: 'Tiida (C11)',
    generation: 'I поколение',
    years: '2004–2012',
    bodyType: 'Хэтчбек',
    overview: 'Компактный хэтчбек с высоким салоном. Седан Tiida C11 имеет иной кузов; двигатель и трансмиссия зависят от рынка поставки.',
    lengthMm: 4205, widthMm: 1695, heightMm: 1535, wheelbaseMm: 2600,
    groundClearanceMm: 160, trunkVolumeLiters: 'Зависит от положения сидений и рынка', fuelTankLiters: 52,
    curbWeightKg: 'Ориентировочно 1150–1300 кг',
    engines: [
      { code: 'HR16DE', name: '1.6 л бензин', displacement: '1598 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Широко распространённый атмосферный двигатель'], weaknesses: ['Проверять состояние цепного привода и расход масла'] },
      { code: 'MR18DE', name: '1.8 л бензин — отдельные версии', displacement: '1798 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Более высокий запас мощности'], weaknesses: ['Не доступен во всех регионах'] }
    ],
    transmissions: ['МКПП', 'АКПП или вариатор — в зависимости от рынка'],
    sourceNotes: 'Данные для хэтчбека C11. Седан имеет отдельный кузовной код/параметры в зависимости от рынка.'
  }),
  makeSupplementalModel({
    id: 'lexus-is-xe20-sedan',
    brandId: 'lexus',
    name: 'IS (XE20)',
    generation: 'II поколение',
    years: '2005–2013',
    bodyType: 'Седан',
    overview: 'Премиальный спортивный седан с задним приводом и отдельными полноприводными версиями. Линейка двигателей и тормозные/подвесочные детали зависят от исполнения.',
    lengthMm: 4575, widthMm: 1795, heightMm: 1430, wheelbaseMm: 2730,
    groundClearanceMm: 145, trunkVolumeLiters: 'Около 378 л, зависит от версии', fuelTankLiters: 65,
    curbWeightKg: 'Ориентировочно 1500–1700 кг',
    engines: [
      { code: '4GR-FSE', name: '2.5 л V6 бензин D-4', displacement: '2499 см³', powerHp: 'Зависит от рынка и года', torqueNm: 'Зависит от версии', valves: '24V DOHC Dual VVT-i', fuelSystem: 'Комбинированные системы впрыска D-4 — уточнить версию', timingDrive: 'Цепь ГРМ', strengths: ['Плавная работа V6'], weaknesses: ['Система непосредственного впрыска требует квалифицированной диагностики'] },
      { code: '2GR-FSE', name: '3.5 л V6 бензин — IS 350', displacement: '3456 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC Dual VVT-i', fuelSystem: 'D-4S комбинированный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Высокая мощность'], weaknesses: ['Обслуживание дороже четырёхцилиндровых версий'] }
    ],
    transmissions: ['Автоматическая трансмиссия — по двигателю и рынку', 'МКПП на отдельных версиях'],
    drivetrain: 'Задний привод; AWD предлагался на отдельных модификациях.',
    sourceNotes: 'XE20 включает разные двигатели и обновления. Объёмы жидкостей и лампы нельзя считать универсальными.'
  }),
  makeSupplementalModel({
    id: 'infiniti-g-v36-sedan',
    brandId: 'infiniti',
    name: 'G (V36)',
    generation: 'IV поколение',
    years: '2006–2015',
    bodyType: 'Седан',
    overview: 'Премиальный спортивный седан с двигателями V6 семейства VQ. Седан и купе имеют разные кузова; мощность, трансмиссия и привод зависят от года и рынка.',
    lengthMm: 4775, widthMm: 1773, heightMm: 1450, wheelbaseMm: 2850,
    groundClearanceMm: 125, trunkVolumeLiters: 'Около 340 л, зависит от рынка', fuelTankLiters: 76,
    curbWeightKg: 'Ориентировочно 1550–1750 кг',
    engines: [
      { code: 'VQ35HR', name: '3.5 л V6 бензин', displacement: '3498 см³', powerHp: 'Зависит от года и рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC CVTCS', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Высокая отдача атмосферного V6'], weaknesses: ['Требует контроля уровня масла и состояния системы охлаждения'] },
      { code: 'VQ37VHR', name: '3.7 л V6 бензин — поздние версии', displacement: '3696 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC VVEL', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Высокая мощность и широкий диапазон тяги'], weaknesses: ['Ремонт и обслуживание дороже массовых моделей'] }
    ],
    transmissions: ['Автоматическая трансмиссия 5/7 ступеней — по году и версии', 'МКПП на отдельных версиях'],
    drivetrain: 'Задний привод; ATTESA E-TS AWD доступен на отдельных версиях.',
    sourceNotes: 'V36 включает обновления и разные рынки. Купе G37 — отдельная запись должна использовать параметры своего кузова.'
  }),
  makeSupplementalModel({
    id: 'isuzu-mux-uc-suv',
    brandId: 'isuzu',
    name: 'MU-X (UC)',
    generation: 'I поколение',
    years: '2013–2021',
    bodyType: 'Внедорожник',
    overview: 'Рамный семиместный внедорожник на базе пикапа D-Max. Дизельные двигатели, система 4WD и оснащение различаются по рынкам.',
    lengthMm: 4825, widthMm: 1860, heightMm: 1860, wheelbaseMm: 2845,
    groundClearanceMm: 230, trunkVolumeLiters: 'Зависит от числа поднятых рядов', fuelTankLiters: 65,
    curbWeightKg: 'Ориентировочно 1900–2150 кг',
    engines: [
      { code: '4JJ1-TC', name: '3.0 л турбодизель Common Rail', displacement: '2999 см³', powerHp: 'Зависит от рынка и года', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Уточнить по модификации двигателя', strengths: ['Высокий крутящий момент'], weaknesses: ['Состояние EGR/DPF зависит от экологической версии и условий эксплуатации'] }
    ],
    transmissions: ['МКПП — отдельные версии', 'Автоматическая трансмиссия — по рынку'],
    drivetrain: 'Задний привод или подключаемый Part-Time 4WD — по комплектации.',
    sourceNotes: 'MU-X UC добавлен как отдельная модель, не смешивать с D-Max. Точные агрегаты зависят от страны продажи.'
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

  makeSupplementalModel({
    id: 'mitsubishi-lancer-cs-sedan', brandId: 'mitsubishi', name: 'Lancer IX (CS)', generation: 'IX поколение', years: '2000–2010', bodyType: 'Седан',
    overview: 'Компактный седан; моторы 4G18/4G63/4G69 и трансмиссии зависят от рынка и комплектации.',
    lengthMm: 4535, widthMm: 1715, heightMm: 1445, wheelbaseMm: 2600, groundClearanceMm: 165, trunkVolumeLiters: '430 л (зависит от рынка)', fuelTankLiters: 50, curbWeightKg: '1100–1350 кг',
    engines: [
      { code: '4G18', name: '1.6 л SOHC', displacement: '1584 см³', powerHp: 'около 98 л.с. (по версии)', torqueNm: 'Зависит от версии', valves: '16V SOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Простая атмосферная конструкция'], weaknesses: ['Проверять ремень ГРМ и течи масла'] },
      { code: '4G63', name: '2.0 л DOHC', displacement: '1997 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Широкая распространённость'], weaknesses: ['Регламент ГРМ зависит от двигателя и года'] },
      { code: '4G69', name: '2.4 л MIVEC — отдельные версии', displacement: '2378 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V SOHC MIVEC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Не устанавливался на все рынки'] }
    ],
    transmissions: ['МКПП', 'АКПП — по двигателю и рынку'], drivetrain: 'Преимущественно передний привод; отдельные спортивные/региональные версии отличаются.',
    sourceNotes: 'Поколение CS включает много рынков и комплектаций. Код двигателя/коробки обязателен для точных жидкостей, ламп и регламента.'
  }),
  makeSupplementalModel({
    id: 'mitsubishi-lancer-cs-wagon', brandId: 'mitsubishi', name: 'Lancer IX Wagon (CS)', generation: 'IX поколение, универсал', years: '2003–2008', bodyType: 'Универсал',
    overview: 'Универсал семейства Lancer IX; кузов и некоторые агрегаты отличаются от седана.',
    lengthMm: 4485, widthMm: 1695, heightMm: 1465, wheelbaseMm: 2600, groundClearanceMm: 155, trunkVolumeLiters: 'Зависит от комплектации', fuelTankLiters: 50, curbWeightKg: '1200–1400 кг',
    engines: [
      { code: '4G18', name: '1.6 л бензин', displacement: '1584 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V SOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Простая конструкция'], weaknesses: ['Состояние ремня и роликов критично'] },
      { code: '4G63', name: '2.0 л бензин — отдельные рынки', displacement: '1997 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Запас тяги'], weaknesses: ['Проверять точный код мотора'] }
    ],
    transmissions: ['МКПП / АКПП по комплектации'], sourceNotes: 'Универсал выделен отдельной записью; не переносить параметры кузова, ламп и деталей седана без проверки.'
  }),
  makeSupplementalModel({
    id: 'mitsubishi-pajero-io-h76-suv', brandId: 'mitsubishi', name: 'Pajero iO / Pinin (H6/H7)', generation: 'I поколение', years: '1998–2007', bodyType: 'Внедорожник',
    overview: 'Компактный внедорожник с разными версиями трансмиссии 4WD; названия и моторы зависят от рынка.',
    lengthMm: 3975, widthMm: 1680, heightMm: 1700, wheelbaseMm: 2450, groundClearanceMm: 200, trunkVolumeLiters: 'Зависит от кузова', fuelTankLiters: 53, curbWeightKg: '1250–1500 кг',
    engines: [
      { code: '4G93', name: '1.8 л GDI/MPI', displacement: '1834 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'GDI или MPI — проверить конкретный мотор', timingDrive: 'Ремень ГРМ', strengths: ['Компактный размер и внедорожная трансмиссия'], weaknesses: ['GDI чувствителен к состоянию топливной системы'] },
      { code: '4G94', name: '2.0 л GDI — отдельные версии', displacement: '1999 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от рынка', valves: '16V DOHC', fuelSystem: 'GDI', timingDrive: 'Ремень ГРМ', strengths: ['Тяга для небольшого кузова'], weaknesses: ['Требует диагностики высокого давления и впуска'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Easy Select / Full-time 4WD — зависит от версии; проверить рычаг/код трансмиссии.',
    sourceNotes: 'Pajero iO/Pinin имеет отличия по рынкам и типу 4WD. Сервисные спецификации уточнять по номеру кузова.'
  }),
  makeSupplementalModel({
    id: 'toyota-camry-xv40-sedan', brandId: 'toyota', name: 'Camry (XV40)', generation: 'VI поколение', years: '2006–2011', bodyType: 'Седан',
    overview: 'Среднеразмерный седан; двигатели 2.4/3.5 и коробки зависят от рынка, есть гибридная версия на отдельных рынках.',
    lengthMm: 4815, widthMm: 1820, heightMm: 1480, wheelbaseMm: 2775, groundClearanceMm: 155, trunkVolumeLiters: '535 л (зависит от рынка)', fuelTankLiters: 70, curbWeightKg: '1450–1650 кг',
    engines: [
      { code: '2AZ-FE', name: '2.4 л бензин', displacement: '2362 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый мотор'], weaknesses: ['Проверять расход масла и состояние резьбы/охлаждения по истории конкретного двигателя'] },
      { code: '2GR-FE', name: '3.5 л V6', displacement: '3456 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC Dual VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Высокая мощность'], weaknesses: ['Обслуживание и доступ к узлам дороже'] }
    ],
    transmissions: ['5-ступенчатая АКПП', '6-ступенчатая АКПП — по версии'], sourceNotes: 'XV40 для разных рынков имеет разные двигатели и системы. Точные заправочные объёмы брать из руководства соответствующего рынка.'
  }),
  makeSupplementalModel({
    id: 'toyota-prado-j120-suv', brandId: 'toyota', name: 'Land Cruiser Prado (J120)', generation: 'III поколение', years: '2002–2009', bodyType: 'Внедорожник',
    overview: 'Рамный внедорожник с бензиновыми и дизельными моторами, постоянным/подключаемым 4WD в зависимости от исполнения.',
    lengthMm: 4715, widthMm: 1875, heightMm: 1870, wheelbaseMm: 2790, groundClearanceMm: 220, trunkVolumeLiters: 'Зависит от 3-го ряда', fuelTankLiters: 87, curbWeightKg: '1800–2200 кг',
    engines: [
      { code: '1GR-FE', name: '4.0 л V6 бензин', displacement: '3956 см³', powerHp: 'Зависит от года/рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC Dual VVT-i/ VVT-i по версии', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Проверять систему охлаждения и течи'] },
      { code: '1KD-FTV', name: '3.0 л турбодизель', displacement: '2982 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Ремень ГРМ', strengths: ['Высокий крутящий момент'], weaknesses: ['Форсунки и топливная система требуют диагностики'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: '4WD; схема блокировок и межосевого дифференциала зависит от комплектации.',
    sourceNotes: 'J120 включает несколько двигателей и рынков. Не переносить параметры J150 или Hilux; сверять код кузова и агрегатов.'
  }),
  makeSupplementalModel({
    id: 'toyota-yaris-xp90-hatchback', brandId: 'toyota', name: 'Yaris / Vitz (XP90)', generation: 'II поколение', years: '2005–2011', bodyType: 'Хэтчбек',
    overview: 'Компактный хэтчбек; Vitz — имя для японского рынка, Yaris — экспортное название.',
    lengthMm: 3750, widthMm: 1695, heightMm: 1530, wheelbaseMm: 2460, groundClearanceMm: 145, trunkVolumeLiters: 'Зависит от кузова и рынка', fuelTankLiters: 42, curbWeightKg: '950–1200 кг',
    engines: [
      { code: '1KR-FE', name: '1.0 л бензин', displacement: '996 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '12V DOHC VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Экономичность'], weaknesses: ['Требует контроля масла и охлаждения'] },
      { code: '1NZ-FE', name: '1.5 л бензин', displacement: '1496 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Надёжное распространённое семейство'], weaknesses: ['Проверять расход масла на возрастных экземплярах'] }
    ],
    transmissions: ['МКПП', 'АКПП/вариатор — по рынку'], sourceNotes: 'XP90 включает несколько кузовов и рынков; точные размеры, лампы и жидкости требуют конкретного кода кузова.'
  }),
  makeSupplementalModel({
    id: 'nissan-xtrail-t31-suv', brandId: 'nissan', name: 'X-Trail (T31)', generation: 'II поколение', years: '2007–2014', bodyType: 'Кроссовер',
    overview: 'Кроссовер с бензиновыми и дизельными двигателями; вариатор, механическая коробка и системы полного привода зависят от версии.',
    lengthMm: 4630, widthMm: 1785, heightMm: 1685, wheelbaseMm: 2630, groundClearanceMm: 200, trunkVolumeLiters: '603 л (методика зависит от рынка)', fuelTankLiters: 65, curbWeightKg: '1450–1700 кг',
    engines: [
      { code: 'MR20DE', name: '2.0 л бензин', displacement: '1997 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый двигатель'], weaknesses: ['Проверять расход масла, шум цепи и охлаждение'] },
      { code: 'QR25DE', name: '2.5 л бензин', displacement: '2488 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Состояние CVT критично при отсутствии обслуживания'] },
      { code: 'M9R', name: '2.0 л дизель — отдельные рынки', displacement: '1995 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь/привод по модификации', strengths: ['Экономичность на трассе'], weaknesses: ['Проверять EGR/DPF и топливную систему'] }
    ],
    transmissions: ['6-ступенчатая МКПП', 'CVT', 'АКПП — отдельные рынки'], drivetrain: '2WD или ALL MODE 4x4-i.',
    sourceNotes: 'T31 имеет разные коробки, включая CVT. Использовать только жидкость, указанную для конкретного кода трансмиссии.'
  }),
  makeSupplementalModel({
    id: 'nissan-qashqai-j10-crossover', brandId: 'nissan', name: 'Qashqai (J10)', generation: 'I поколение', years: '2006–2013', bodyType: 'Кроссовер',
    overview: 'Компактный кроссовер, доступный с передним или полным приводом; силовые агрегаты зависят от рынка.',
    lengthMm: 4315, widthMm: 1780, heightMm: 1615, wheelbaseMm: 2630, groundClearanceMm: 200, trunkVolumeLiters: '410 л (зависит от рынка)', fuelTankLiters: 65, curbWeightKg: '1300–1600 кг',
    engines: [
      { code: 'HR16DE', name: '1.6 л бензин', displacement: '1598 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Простая атмосферная версия'], weaknesses: ['Проверять шум цепи и расход масла'] },
      { code: 'MR20DE', name: '2.0 л бензин', displacement: '1997 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый мотор'], weaknesses: ['CVT требует истории обслуживания'] }
    ],
    transmissions: ['МКПП', 'CVT', 'АКПП — по рынку'], drivetrain: 'Передний привод или ALL MODE 4x4.',
    sourceNotes: 'J10 включает несколько силовых агрегатов и коробок. Уточнить тип CVT/AT по VIN до выбора жидкости.'
  }),
  makeSupplementalModel({
    id: 'honda-crv-rd7-suv', brandId: 'honda', name: 'CR-V (RD7/RD8)', generation: 'II поколение', years: '2001–2006', bodyType: 'Кроссовер',
    overview: 'Компактный кроссовер; мотор K24A и система Real Time 4WD встречаются на отдельных версиях.',
    lengthMm: 4630, widthMm: 1785, heightMm: 1710, wheelbaseMm: 2620, groundClearanceMm: 205, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 58, curbWeightKg: '1450–1600 кг',
    engines: [
      { code: 'K24A1', name: '2.4 л i-VTEC', displacement: '2354 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Проверять зазоры клапанов, течи и состояние охлаждения'] },
      { code: 'K20A', name: '2.0 л i-VTEC — отдельные рынки', displacement: '1998 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённое семейство'], weaknesses: ['Код K20A охватывает разные версии'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Передний привод или Real Time 4WD.',
    sourceNotes: 'RD7/RD8 — не единственные кузовные коды CR-V II. Жидкость заднего редуктора и коробки уточнять по рынку.'
  }),
  makeSupplementalModel({
    id: 'honda-fit-gd-hatchback', brandId: 'honda', name: 'Fit / Jazz (GD)', generation: 'I поколение', years: '2001–2008', bodyType: 'Хэтчбек',
    overview: 'Компактный хэтчбек с трансформируемым салоном; Fit — японское имя, Jazz — экспортное наименование.',
    lengthMm: 3830, widthMm: 1675, heightMm: 1525, wheelbaseMm: 2450, groundClearanceMm: 150, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 42, curbWeightKg: '990–1200 кг',
    engines: [
      { code: 'L13A', name: '1.3 л i-DSI/VTEC по версии', displacement: '1339 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '8/16V по версии', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Низкий расход топлива'], weaknesses: ['Многосвечная версия i-DSI требует правильных свечей и обслуживания'] },
      { code: 'L15A', name: '1.5 л VTEC', displacement: '1496 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V SOHC VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошее соотношение расхода и мощности'], weaknesses: ['Проверять коробку и историю замены жидкости'] }
    ],
    transmissions: ['МКПП', 'CVT', 'АКПП — по рынку'], sourceNotes: 'GD отличается по рынкам, включая тип трансмиссии. Для CVT требуется точная жидкость Honda для данного агрегата.'
  }),
  makeSupplementalModel({
    id: 'mazda-6-gg-sedan', brandId: 'mazda', name: 'Mazda6 (GG) седан', generation: 'I поколение', years: '2002–2008', bodyType: 'Седан',
    overview: 'Среднеразмерный седан; моторы MZR и дизели различаются по рынку и году.',
    lengthMm: 4670, widthMm: 1780, heightMm: 1435, wheelbaseMm: 2675, groundClearanceMm: 150, trunkVolumeLiters: '500 л (зависит от рынка)', fuelTankLiters: 64, curbWeightKg: '1300–1600 кг',
    engines: [
      { code: 'LF-DE', name: '2.0 л бензин MZR', displacement: '1999 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая доступность запчастей'], weaknesses: ['Проверять коррозию кузова и состояние охлаждения'] },
      { code: 'L3-VE', name: '2.3 л бензин', displacement: '2261 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Более высокая тяга'], weaknesses: ['Проверять расход масла и герметичность'] }
    ],
    transmissions: ['МКПП', 'АКПП'], sourceNotes: 'Кузов седан отделён от хэтчбека/универсала. Габариты и оптика различаются по рынкам.'
  }),
  makeSupplementalModel({
    id: 'mazda-6-gg-wagon', brandId: 'mazda', name: 'Mazda6 (GG) универсал', generation: 'I поколение', years: '2002–2008', bodyType: 'Универсал',
    overview: 'Универсал Mazda6 первого поколения; задняя часть кузова и светотехника отличаются от седана.',
    lengthMm: 4700, widthMm: 1780, heightMm: 1480, wheelbaseMm: 2675, groundClearanceMm: 150, trunkVolumeLiters: 'Зависит от методики измерения', fuelTankLiters: 64, curbWeightKg: '1400–1650 кг',
    engines: [
      { code: 'LF-DE', name: '2.0 л бензин MZR', displacement: '1999 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Практичный кузов'], weaknesses: ['Проверять коррозию порогов/арок и днища'] },
      { code: 'L3-VE', name: '2.3 л бензин', displacement: '2261 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая динамика'], weaknesses: ['Проверять состояние двигателя и коробки'] }
    ],
    transmissions: ['МКПП', 'АКПП'], sourceNotes: 'Универсал имеет отдельные детали кузова/фонарей; не использовать спецификации седана для ламп без сверки.'
  }),
  makeSupplementalModel({
    id: 'subaru-forester-sg-suv', brandId: 'subaru', name: 'Forester (SG)', generation: 'II поколение', years: '2002–2008', bodyType: 'Кроссовер',
    overview: 'Кроссовер с оппозитными бензиновыми двигателями; атмосферные и турбоверсии имеют существенные отличия.',
    lengthMm: 4485, widthMm: 1735, heightMm: 1590, wheelbaseMm: 2525, groundClearanceMm: 200, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 60, curbWeightKg: '1350–1600 кг',
    engines: [
      { code: 'EJ20', name: '2.0 л boxer', displacement: '1994 см³', powerHp: 'Зависит от атмосферной/турбо версии', torqueNm: 'Зависит от версии', valves: '16V SOHC/DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Низкий центр тяжести'], weaknesses: ['Проверять течи, охлаждение и историю ремня ГРМ'] },
      { code: 'EJ25', name: '2.5 л boxer', displacement: '2457 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V SOHC/DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Проверять герметичность двигателя и охлаждения'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Symmetrical AWD; тип межосевого распределения зависит от коробки.',
    sourceNotes: 'SG включает разные атмосферные и турбоверсии. Тип коробки определяет жидкость и процедуру проверки.'
  }),
  makeSupplementalModel({
    id: 'subaru-legacy-bp-wagon', brandId: 'subaru', name: 'Legacy (BP) универсал', generation: 'IV поколение', years: '2003–2009', bodyType: 'Универсал',
    overview: 'Универсал с оппозитными двигателями и Symmetrical AWD; моторы и коробки зависят от рынка.',
    lengthMm: 4680, widthMm: 1730, heightMm: 1470, wheelbaseMm: 2670, groundClearanceMm: 150, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 64, curbWeightKg: '1400–1650 кг',
    engines: [
      { code: 'EJ20', name: '2.0 л boxer', displacement: '1994 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V SOHC/DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Полный привод и устойчивость'], weaknesses: ['Проверять ремень ГРМ, охлаждение и утечки'] },
      { code: 'EJ25', name: '2.5 л boxer', displacement: '2457 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V SOHC/DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Тяга в среднем диапазоне'], weaknesses: ['Контролировать температуру и герметичность'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Symmetrical AWD.',
    sourceNotes: 'BP — универсал, не путать с седаном BL. Объёмы и спецификации различаются по мотору и трансмиссии.'
  }),
  makeSupplementalModel({
    id: 'suzuki-grand-vitara-jt-suv', brandId: 'suzuki', name: 'Grand Vitara (JT)', generation: 'III поколение', years: '2005–2015', bodyType: 'Внедорожник',
    overview: 'Внедорожник с несущим кузовом и встроенной рамой на части рынка; 4WD и моторы различаются по версии.',
    lengthMm: 4470, widthMm: 1810, heightMm: 1695, wheelbaseMm: 2640, groundClearanceMm: 200, trunkVolumeLiters: 'Зависит от кузова', fuelTankLiters: 66, curbWeightKg: '1450–1750 кг',
    engines: [
      { code: 'J20A', name: '2.0 л бензин', displacement: '1995 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Простая атмосферная версия'], weaknesses: ['Проверять цепной привод и охлаждение'] },
      { code: 'J24B', name: '2.4 л бензин', displacement: '2393 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC VVT', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Проверять историю обслуживания и течи'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: '2WD/4WD; наличие понижающей передачи зависит от версии.',
    sourceNotes: 'JT имеет 3/5-дверные варианты и разные трансмиссии. Жидкости раздатки/редукторов уточнять по коду агрегата.'
  }),
  makeSupplementalModel({
    id: 'daihatsu-terios-j200-suv', brandId: 'daihatsu', name: 'Terios (J200)', generation: 'II поколение', years: '2006–2017', bodyType: 'Кроссовер',
    overview: 'Компактный кроссовер с задним или полным приводом в зависимости от рынка.',
    lengthMm: 4055, widthMm: 1695, heightMm: 1690, wheelbaseMm: 2580, groundClearanceMm: 200, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 50, curbWeightKg: '1150–1350 кг',
    engines: [
      { code: '3SZ-VE', name: '1.5 л бензин DVVT', displacement: '1495 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC DVVT', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Компактность и доступный сервис'], weaknesses: ['Проверять охлаждение, шум цепи и состояние полного привода'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Задний привод или постоянный/полный привод — зависит от рынка.',
    sourceNotes: 'J200 продаётся в разных регионах под отличающимися спецификациями; параметры проверить по VIN.'
  }),
  makeSupplementalModel({
    id: 'isuzu-dmax-rg-pickup', brandId: 'isuzu', name: 'D-Max (RG)', generation: 'III поколение', years: '2019–н.в.', bodyType: 'Пикап',
    overview: 'Рамный пикап с дизельными двигателями и задним/подключаемым полным приводом. Точные характеристики различаются по рынку.',
    lengthMm: 5265, widthMm: 1870, heightMm: 1790, wheelbaseMm: 3125, groundClearanceMm: 235, trunkVolumeLiters: 'Грузовая платформа зависит от кабины', fuelTankLiters: 76, curbWeightKg: '1900–2300 кг',
    engines: [
      { code: 'RZ4E-TC', name: '1.9 л турбодизель', displacement: '1898 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь/привод по модификации', strengths: ['Экономичность для пикапа'], weaknesses: ['Проверять DPF/EGR и топливную систему'] },
      { code: '4JJ3-TCX', name: '3.0 л турбодизель', displacement: '2999 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь/привод по модификации', strengths: ['Высокий крутящий момент'], weaknesses: ['Экология и система впрыска требуют правильной диагностики'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'RWD или Part-Time 4WD.',
    sourceNotes: 'RG зависит от рынка, двигателя и кабины. Точные объёмы, масла мостов и АКПП — только по руководству для конкретной версии.'
  })


  makeSupplementalModel({
    id: 'toyota-rav4-xa30-crossover', brandId: 'toyota', name: 'RAV4 (XA30)', generation: 'III поколение', years: '2005–2012', bodyType: 'Кроссовер',
    overview: 'Компактный кроссовер с бензиновыми и дизельными двигателями; привод и трансмиссия зависят от рынка.',
    lengthMm: 4600, widthMm: 1855, heightMm: 1685, wheelbaseMm: 2660, groundClearanceMm: 190, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 60, curbWeightKg: '1450–1700 кг',
    engines: [
      { code: '2AZ-FE', name: '2.4 л бензин', displacement: '2362 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Широко распространённый двигатель'], weaknesses: ['Проверять расход масла и состояние охлаждения'] },
      { code: '3ZR-FE', name: '2.0 л бензин — отдельные рынки', displacement: '1987 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC Dual VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Умеренный расход'], weaknesses: ['Не устанавливался во всех странах'] }
    ],
    transmissions: ['МКПП', 'АКПП', 'CVT — по рынку'], drivetrain: 'Передний привод или AWD; схема зависит от рынка и комплектации.',
    sourceNotes: 'XA30 включает разные силовые агрегаты. Жидкость АКПП/CVT и редукторов не подбирать по одному названию модели.'
  }),
  makeSupplementalModel({
    id: 'toyota-hilux-an120-pickup', brandId: 'toyota', name: 'Hilux (AN120/AN130)', generation: 'VIII поколение', years: '2015–2025', bodyType: 'Пикап',
    overview: 'Рамный пикап с дизельными и бензиновыми двигателями; параметры зависят от региона, кабины и привода.',
    lengthMm: 5330, widthMm: 1855, heightMm: 1815, wheelbaseMm: 3085, groundClearanceMm: 279, trunkVolumeLiters: 'Грузовая платформа зависит от кабины', fuelTankLiters: 80, curbWeightKg: '1900–2300 кг',
    engines: [
      { code: '2GD-FTV', name: '2.4 л турбодизель', displacement: '2393 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь ГРМ', strengths: ['Высокая тяга на низких оборотах'], weaknesses: ['Проверять EGR/DPF и историю обслуживания'] },
      { code: '1GD-FTV', name: '2.8 л турбодизель', displacement: '2755 см³', powerHp: 'Зависит от рынка и года', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь ГРМ', strengths: ['Высокий крутящий момент'], weaknesses: ['Экологическая система и турбонаддув требуют диагностики'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'RWD или подключаемый 4WD; проверить конкретную комплектацию.',
    sourceNotes: 'Hilux сильно отличается по региону, двигателю и кабине. Масла мостов/раздатки выбирать по коду агрегата.'
  }),
  makeSupplementalModel({
    id: 'nissan-patrol-y61-suv', brandId: 'nissan', name: 'Patrol (Y61)', generation: 'V поколение', years: '1997–2016', bodyType: 'Внедорожник',
    overview: 'Рамный внедорожник; бензиновые и дизельные версии, трансмиссии и оснащение зависят от рынка.',
    lengthMm: 5080, widthMm: 1940, heightMm: 1855, wheelbaseMm: 2970, groundClearanceMm: 220, trunkVolumeLiters: 'Зависит от кузова и рядов сидений', fuelTankLiters: 95, curbWeightKg: '2200–2700 кг',
    engines: [
      { code: 'TB48DE', name: '4.8 л бензин', displacement: '4759 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Высокий ресурс при грамотном обслуживании'], weaknesses: ['Высокий расход топлива; важна исправность охлаждения'] },
      { code: 'ZD30DDTi', name: '3.0 л турбодизель', displacement: '2953 см³', powerHp: 'Зависит от года/версии', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail/электронное управление по версии', timingDrive: 'Проверить по модификации', strengths: ['Экономичнее бензинового V8-класса'], weaknesses: ['Требуется проверка турбины, впрыска и температуры'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Подключаемый полный привод с понижающей передачей; комплектация зависит от рынка.',
    sourceNotes: 'Y61 выпускался долго и с большим числом моторов. Нельзя объединять спецификации раннего и позднего ZD30.'
  }),
  makeSupplementalModel({
    id: 'honda-accord-cl-sedan', brandId: 'honda', name: 'Accord (CL/CM)', generation: 'VII поколение', years: '2002–2008', bodyType: 'Седан',
    overview: 'Среднеразмерный седан с разными моторами для Европы, Японии и Северной Америки.',
    lengthMm: 4665, widthMm: 1760, heightMm: 1450, wheelbaseMm: 2670, groundClearanceMm: 150, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 65, curbWeightKg: '1300–1600 кг',
    engines: [
      { code: 'K20A6', name: '2.0 л i-VTEC', displacement: '1998 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая балансировка расхода и мощности'], weaknesses: ['Проверять зазоры клапанов и состояние цепного привода'] },
      { code: 'K24A', name: '2.4 л i-VTEC', displacement: '2354 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Проверять течи и историю обслуживания'] }
    ],
    transmissions: ['МКПП', 'АКПП'], sourceNotes: 'Accord CL/CM включает региональные версии. Не путать с североамериканским Accord другого кода кузова.'
  }),
  makeSupplementalModel({
    id: 'honda-odyssey-ra-rb-minivan', brandId: 'honda', name: 'Odyssey (RA/RB)', generation: 'II–III поколения, семейство', years: '1999–2008', bodyType: 'Минивэн',
    overview: 'Семейство минивэнов с несколькими рынками и поколениями; японская Odyssey отличается от североамериканской по кузову и агрегатам.',
    lengthMm: 4770, widthMm: 1800, heightMm: 1550, wheelbaseMm: 2830, groundClearanceMm: 150, trunkVolumeLiters: 'Зависит от компоновки сидений', fuelTankLiters: 65, curbWeightKg: '1550–1850 кг',
    engines: [
      { code: 'K24A', name: '2.4 л i-VTEC', displacement: '2354 см³', powerHp: 'Зависит от поколения/рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый мотор Honda'], weaknesses: ['Проверять коробку, охлаждение и зазоры клапанов'] }
    ],
    transmissions: ['АКПП/CVT — по поколению и рынку'], sourceNotes: 'Запись объединяет семейство RA/RB только для поиска; перед ремонтом обязательно выбрать точный код кузова и рынок.'
  }),
  makeSupplementalModel({
    id: 'mazda-cx5-ke-crossover', brandId: 'mazda', name: 'CX-5 (KE)', generation: 'I поколение', years: '2012–2017', bodyType: 'Кроссовер',
    overview: 'Кроссовер с бензиновыми Skyactiv-G и дизельными Skyactiv-D; привод и коробка зависят от версии.',
    lengthMm: 4540, widthMm: 1840, heightMm: 1670, wheelbaseMm: 2700, groundClearanceMm: 210, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 58, curbWeightKg: '1400–1700 кг',
    engines: [
      { code: 'PE-VPS', name: '2.0 л Skyactiv-G', displacement: '1997 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'Непосредственный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Экономичность при исправной системе'], weaknesses: ['Требует качественного топлива и точного масла по спецификации'] },
      { code: 'PY-VPS', name: '2.5 л Skyactiv-G', displacement: '2488 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '16V DOHC', fuelSystem: 'Непосредственный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Хорошая тяга'], weaknesses: ['Проверять состояние охлаждения и впуска'] },
      { code: 'SH-VPTS', name: '2.2 л Skyactiv-D — отдельные рынки', displacement: '2191 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V DOHC Turbo Diesel', fuelSystem: 'Common Rail', timingDrive: 'Цепь ГРМ', strengths: ['Высокая тяга'], weaknesses: ['DPF/EGR и разжижение масла требуют контроля'] }
    ],
    transmissions: ['МКПП', 'АКПП Skyactiv-Drive'], drivetrain: 'FWD или AWD.',
    sourceNotes: 'KE имеет несколько поколений ПО и силовых агрегатов. Для дизеля особенно важны правильный уровень масла и регламент DPF.'
  }),
  makeSupplementalModel({
    id: 'subaru-outback-bp-wagon', brandId: 'subaru', name: 'Outback (BP)', generation: 'III поколение', years: '2003–2009', bodyType: 'Универсал',
    overview: 'Универсал повышенной проходимости на базе Legacy; атмосферные и турбированные оппозитные моторы различаются по рынку.',
    lengthMm: 4730, widthMm: 1770, heightMm: 1545, wheelbaseMm: 2670, groundClearanceMm: 200, trunkVolumeLiters: 'Зависит от рынка', fuelTankLiters: 64, curbWeightKg: '1450–1750 кг',
    engines: [
      { code: 'EJ25', name: '2.5 л boxer', displacement: '2457 см³', powerHp: 'Зависит от версии', torqueNm: 'Зависит от версии', valves: '16V SOHC/DOHC', fuelSystem: 'MPI', timingDrive: 'Ремень ГРМ', strengths: ['Комфорт и клиренс универсала'], weaknesses: ['Проверять ремень ГРМ, утечки и охлаждение'] },
      { code: 'EZ30', name: '3.0 л H6 — отдельные рынки', displacement: '3000 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Плавность шестицилиндрового двигателя'], weaknesses: ['Дороже обслуживание и ограничен доступ к некоторым узлам'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Symmetrical AWD.',
    sourceNotes: 'BP — Outback III; не смешивать с более поздними кузовами. Уточнять коробку и двигатель по VIN.'
  }),
  makeSupplementalModel({
    id: 'suzuki-jimny-jb23-suv', brandId: 'suzuki', name: 'Jimny (JB23)', generation: 'III поколение, kei-версия', years: '1998–2018', bodyType: 'Внедорожник',
    overview: 'Компактный рамный внедорожник японского рынка с турбомотором малого объёма и подключаемым полным приводом.',
    lengthMm: 3395, widthMm: 1475, heightMm: 1680, wheelbaseMm: 2250, groundClearanceMm: 190, trunkVolumeLiters: 'Небольшой, зависит от сидений', fuelTankLiters: 40, curbWeightKg: '950–1050 кг',
    engines: [
      { code: 'K6A', name: '0.66 л турбо', displacement: '658 см³', powerHp: 'Ограничено нормами kei', torqueNm: 'Зависит от версии', valves: '12V DOHC Turbo', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Малый вес и внедорожная геометрия'], weaknesses: ['Турбина и охлаждение требуют регулярного контроля'] }
    ],
    transmissions: ['МКПП', 'АКПП'], drivetrain: 'Подключаемый Part-Time 4WD с понижающей передачей.',
    sourceNotes: 'JB23 — японская kei-версия; не переносить её характеристики на экспортный Jimny JB33/JB43.'
  }),
  makeSupplementalModel({
    id: 'lexus-rx-al10-suv', brandId: 'lexus', name: 'RX (AL10)', generation: 'III поколение', years: '2008–2015', bodyType: 'Кроссовер',
    overview: 'Премиальный кроссовер с бензиновыми V6 и гибридной модификацией RX 450h; оснащение зависит от рынка.',
    lengthMm: 4770, widthMm: 1885, heightMm: 1725, wheelbaseMm: 2740, groundClearanceMm: 180, trunkVolumeLiters: 'Зависит от версии', fuelTankLiters: 72, curbWeightKg: '1850–2200 кг',
    engines: [
      { code: '2GR-FE', name: '3.5 л V6', displacement: '3456 см³', powerHp: 'Зависит от рынка', torqueNm: 'Зависит от версии', valves: '24V DOHC Dual VVT-i', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Плавная работа и тяга'], weaknesses: ['Проверять охлаждение, утечки и работу АКПП'] },
      { code: '2GR-FXE', name: '3.5 л V6 гибрид', displacement: '3456 см³', powerHp: 'Суммарная мощность зависит от рынка', torqueNm: 'Зависит от системы', valves: '24V DOHC Atkinson cycle', fuelSystem: 'MPI', timingDrive: 'Цепь ГРМ', strengths: ['Экономичность в городе для своего класса'], weaknesses: ['Высоковольтную систему диагностировать только безопасным оборудованием'] }
    ],
    transmissions: ['АКПП', 'Гибридная e-CVT'], drivetrain: 'FWD/AWD или гибридный AWD по версии.',
    sourceNotes: 'RX AL10 включает обычную и гибридную силовые установки. Жидкости гибридной трансмиссии и охлаждения HV-системы не взаимозаменяемы.'
  })

];

for (const model of supplementalModels) {
  const brand = JAPANESE_BRANDS.find(item => item.id === model.brandId);
  if (brand && !brand.models.some(item => item.id === model.id)) {
    brand.models.push(model);
  }
}

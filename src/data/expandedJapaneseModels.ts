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
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  wheelbaseMm: number | null;
  groundClearanceMm: number | null;
  trunkVolumeLiters: string;
  fuelTankLiters: number | null;
  curbWeightKg: string;
  engines: JapaneseCarModel['engines'];
  transmissions: string[];
  drivetrain?: string;
  sourceNotes: string;
  sourceReferences?: JapaneseCarModel['sourceReferences'];
}): JapaneseCarModel => {
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
      curbWeightKg: data.curbWeightKg,
      ...(data.lengthMm !== null ? { length: data.lengthMm } : {}),
      ...(data.widthMm !== null ? { width: data.widthMm } : {}),
      ...(data.heightMm !== null ? { height: data.heightMm } : {}),
      ...(data.wheelbaseMm !== null ? { wheelbase: data.wheelbaseMm } : {}),
      ...(data.groundClearanceMm !== null ? { groundClearance: data.groundClearanceMm } : {}),
      ...( /^\\s*\\d+(?:[.,]\\d+)?\\s*(?:кг)?\\s*$/i.test(data.curbWeightKg)
        ? { weight: Number(data.curbWeightKg.match(/\\d+(?:[.,]\\d+)?/)?.[0].replace(',', '.')) }
        : {})
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
    dataQualityNote: data.sourceNotes,
    verificationStatus: 'unverified',
    sourceReferences: data.sourceReferences ?? [],
    lastReviewed: '2026-10-21'
  };
}

const supplementalModels: JapaneseCarModel[] = [
  makeSupplementalModel({
    id: 'toyota-mr2-sw20-gt-s-1997',
    brandId: 'toyota', name: 'MR2 GT-S (SW20)', generation: 'II поколение, японская спецификация', years: '1997–1999',
    bodyType: 'Купе/Спорт',
    overview: 'Среднемоторное заднеприводное купе с турбированным 3S-GTE. Данные относятся к японскому GT-S выпуска 1997.12, а не ко всем SW20.',
    lengthMm: 4170, widthMm: 1695, heightMm: 1235, wheelbaseMm: 2400, groundClearanceMm: 130,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 54, curbWeightKg: '1270 кг для E-SW20 GT-S 1997.12',
    engines: [{ code: '3S-GTE', name: '2.0 л turbo', displacement: '1998 см³', powerHp: '245 PS при 6000 об/мин', torqueNm: '304 Н·м при 4000 об/мин', valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов', fuelSystem: 'EFI-D', timingDrive: 'Ремень ГРМ', strengths: ['Параметры относятся к GT-S поздней серии SW20'], weaknesses: ['Не переносить на ранний GT-S с 225 PS'] }],
    transmissions: ['5-ступенчатая МКПП для GT-S'],
    drivetrain: 'Среднемоторная компоновка, задний привод; LSD зависит от исполнения.',
    sourceNotes: 'Toyota GT-S E-SW20 (1997.12): 4170×1695×1235 мм, база 2400 мм, колея 1470/1450 мм, масса 1270 кг, 3S-GTE 1998 см³, 245 PS/304 Н·м, бак 54 л, 5MT. Заводская карточка также указывает компрессию 8.5 и турбонаддув с интеркулером. Точные размеры шин/дисков, передаточные числа и дворники требуют отдельной проверки по комплектации; не подставлять универсальные значения.',
    sourceReferences: [{ label: 'Toyota Japan — MR2 GT-S E-SW20 (1997.12)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-MR2/199712/1002263/', scope: 'Заводские габариты, масса, 3S-GTE, мощность, момент, коробка и бак конкретной версии.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-starlet-ep91-glanza-v',
    brandId: 'toyota', name: 'Starlet Glanza V (EP91)', generation: 'V поколение, японская спецификация', years: '1997–1999',
    bodyType: 'Хэтчбек',
    overview: 'Лёгкий трёхдверный переднеприводный хэтчбек с 4E-FTE turbo. Указана базовая Glanza V E-EP91, не motorsport package и не Glanza S.',
    lengthMm: 3790, widthMm: 1625, heightMm: 1400, wheelbaseMm: 2300, groundClearanceMm: 145,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 45, curbWeightKg: '920 кг для E-EP91 Glanza V (1997.04)',
    engines: [{ code: '4E-FTE', name: '1.3 л turbo с интеркулером', displacement: '1331 см³', powerHp: '135 PS при 6400 об/мин', torqueNm: '156.9 Н·м при 4800 об/мин', valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов', fuelSystem: 'EFI-D', timingDrive: 'Ремень ГРМ', strengths: ['Заводские параметры указаны для японской Glanza V'], weaknesses: ['Не переносить на атмосферную Glanza S с 4E-FE'] }],
    transmissions: ['5-ступенчатая МКПП — Glanza V', '4-ступенчатая АКПП — отдельные исполнения'],
    drivetrain: 'Передний привод (FF); передаточные числа и дифференциал уточнять по коробке.',
    sourceNotes: 'Toyota E-EP91 Glanza V (1997.04): 3790×1625×1400 мм, база 2300 мм, колея 1400/1395 мм, масса 920 кг, 4E-FTE 1331 см³, 135 PS/156.9 Н·м. Источник перечисляет 5MT и FF для Glanza V. Бак требует проверки карточки конкретной комплектации; штатные шины/диски, финальная пара и дворники в этой записи не утверждаются.',
    sourceReferences: [{ label: 'Toyota Japan — Starlet Glanza V E-EP91 (1997.04)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-STARLET/199704/1007056/', scope: 'Заводские размеры, масса, двигатель 4E-FTE, мощность и момент; комплектации Glanza отличаются.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-caldina-st215w-gt-t',
    brandId: 'toyota', name: 'Caldina GT-T (ST215W)', generation: 'II поколение, японская спецификация', years: '1997–2002',
    bodyType: 'Универсал',
    overview: 'Высокопроизводительный универсал с 3S-GTE и постоянным полным приводом. Версия GT-T отличается от GT-Four и более поздних Caldina.',
    lengthMm: 4580, widthMm: 1720, heightMm: 1495, wheelbaseMm: 2580, groundClearanceMm: 155,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 60, curbWeightKg: '1480 кг для E-ST215W GT-T (1997.09)',
    engines: [{ code: '3S-GTE', name: '2.0 л turbo', displacement: '1998 см³', powerHp: '260 PS при 6000 об/мин', torqueNm: '323.6 Н·м при 4400 об/мин', valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ', strengths: ['Заводские параметры для GT-T ST215W'], weaknesses: ['Не переносить на атмосферные 3S-FE версии Caldina'] }],
    transmissions: ['4-ступенчатая АКПП для E-ST215W GT-T'],
    drivetrain: 'Постоянный полный привод (full-time 4WD); передаточные числа и коды дифференциалов сверять по шильдику агрегатов.',
    sourceNotes: 'Toyota E-ST215W GT-T (1997.09): 4580×1720×1495 мм, база 2580 мм, колея 1480/1450 мм, масса 1480 кг, 3S-GTE 1998 см³, 260 PS/323.6 Н·м, бак 60 л, full-time 4WD, 4AT. Не переносить эти значения на GT-T S-version 2000.01 (другая масса/период). Размеры шин/дисков, финальные пары и дворники требуют проверки для точной комплектации.',
    sourceReferences: [{ label: 'Toyota Japan — Caldina Active Sports GT-T E-ST215W (1997.09)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-CALDINA/199709/1000351/', scope: 'Заводские размеры, масса, двигатель, мощность, момент, коробка и бак для GT-T 1997.09.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-crown-jzs171-athlete-v',
    brandId: 'toyota', name: 'Crown Athlete V (JZS171)', generation: 'XI поколение Crown, японская спецификация', years: '2001–2003',
    bodyType: 'Седан',
    overview: 'Заднеприводный седан с турбированным 1JZ-GTE. Запись относится к Crown Athlete V GH-JZS171, а не к атмосферному Athlete с 1JZ-GE.',
    lengthMm: 4820, widthMm: 1765, heightMm: 1455, wheelbaseMm: 2780, groundClearanceMm: 150,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1600 кг для GH-JZS171 (2001.08)',
    engines: [{ code: '1JZ-GTE', name: '2.5 л turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '378 Н·м при 2400 об/мин', valves: 'Рядный 6-цилиндровый DOHC, 24 клапана', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ', strengths: ['Паспортные параметры соответствуют Athlete V GH-JZS171'], weaknesses: ['Не смешивать с атмосферным JZS171 Athlete'] }],
    transmissions: ['4-ступенчатая АКПП — конкретную модель коробки проверить по коду комплектации'],
    drivetrain: 'Задний привод (FR); передаточное число главной пары и тип LSD требуют проверки по комплектации.',
    sourceNotes: 'Toyota GH-JZS171 Athlete V (2001.08): 4820×1765×1455 мм, база 2780 мм, колея 1495/1470 мм, масса 1600 кг, 1JZ-GTE 2491 см³, 280 PS/378 Н·м, бак 70 л. Это данные Athlete V, не обычного Athlete 1JZ-GE. Шины/диски, точная коробка, передаточные числа и дворники требуют отдельной сверки по заводскому коду.',
    sourceReferences: [{ label: 'Toyota Japan — Crown Athlete V GH-JZS171 (2001.08)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-CROWN/200108/1010188/', scope: 'Заводские габариты, масса, 1JZ-GTE, мощность, момент, бак и коробка.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-crown-estate-jzs171w-athlete-v',
    brandId: 'toyota', name: 'Crown Estate Athlete V (JZS171W)', generation: 'XI поколение Crown Estate, японская спецификация', years: '2001–2003',
    bodyType: 'Универсал',
    overview: 'Спортивный универсал с 1JZ-GTE turbo и задним приводом. Его кузовные размеры и масса отличаются от седана Crown Athlete V.',
    lengthMm: 4835, widthMm: 1765, heightMm: 1510, wheelbaseMm: 2780, groundClearanceMm: 150,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1680 кг для GH-JZS171W (2001.08)',
    engines: [{ code: '1JZ-GTE', name: '2.5 л turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '378 Н·м при 2400 об/мин', valves: 'Рядный 6-цилиндровый DOHC, 24 клапана', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ', strengths: ['Заводские данные отдельного кузова JZS171W'], weaknesses: ['Не переносить массу и кузовные параметры с седана JZS171'] }],
    transmissions: ['4-ступенчатая АКПП — по японской версии Athlete V'],
    drivetrain: 'Задний привод (FR); точная главная пара и дифференциал зависят от комплектации.',
    sourceNotes: 'Toyota GH-JZS171W Crown Estate Athlete V (2001.08): 4835×1765×1510 мм, база 2780 мм, колея 1495/1470 мм, масса 1680 кг, 1JZ-GTE 2491 см³, 280 PS/378 Н·м, бак 70 л. Это отдельная запись универсала, не седана. Штатные шины/диски, финальная пара и длины дворников не подтверждены в используемой карточке.',
    sourceReferences: [{ label: 'Toyota Japan — Crown Estate Athlete V GH-JZS171W (2001.08)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-CROWN_ESTATE/200108/1010173/', scope: 'Заводские размеры, масса, двигатель, мощность, момент и бак для кузова JZS171W.' }]
  }),

  // Batch 2: drift and JDM performance icons. Exact trim data is scoped in each source note.
  makeSupplementalModel({
    id: 'toyota-altezza-sxe10-rs200',
    brandId: 'toyota',
    name: 'Altezza RS200 (SXE10)',
    generation: 'I поколение, японская спецификация',
    years: '1998–2005',
    bodyType: 'Седан',
    overview: 'Компактный заднеприводный спортивный седан; RS200 оснащался атмосферным 3S-GE BEAMS. Не смешивать с Altezza AS200 и экспортным Lexus IS200.',
    lengthMm: 4400, widthMm: 1720, heightMm: 1410, wheelbaseMm: 2670,
    groundClearanceMm: 130, trunkVolumeLiters: 'Нет подтверждённых данных для указанной комплектации', fuelTankLiters: 60,
    curbWeightKg: '1330 кг для RS200 5AT; 1340 кг для RS200 6MT',
    engines: [{ code: '3S-GE', name: '2.0 л BEAMS, атмосферный', displacement: '1998 см³', powerHp: '200 PS при 7000 об/мин (5AT); 210 PS при 7600 об/мин (6MT)', torqueNm: '216 Н·м при 4800 об/мин (5AT); 216 Н·м при 6400 об/мин (6MT)', valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов', fuelSystem: 'EFI', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Заводские параметры различаются у 5AT и 6MT'], weaknesses: ['Нельзя переносить мощность версии 6MT на 5AT'] }],
    transmissions: ['6-ступенчатая МКПП — RS200', '5-ступенчатая АКПП Super ECT — RS200'],
    drivetrain: 'Задний привод (FR); передаточное число главной пары зависит от коробки и версии.',
    sourceNotes: 'Заводской Toyota GAZOO RS200 GF-SXE10 (1998.10): 4400×1720×1410 мм, база 2670 мм, колея 1495/1485 мм, масса 1330 кг для 5AT, 3S-GE 200 PS/216 Н·м, бак 60 л, FR, 5AT; главная пара 4.100. У 6MT и Z Edition другие мощность/масса. Шины, диски и длины дворников не включены без отдельного подтверждения для конкретной комплектации.',
    sourceReferences: [{ label: 'Toyota GAZOO — Altezza RS200 GF-SXE10 (1998.10)', url: 'https://gazoo.com/catalog/maker/TOYOTA/ALTEZZA/199810/1003926/', scope: 'Заводская карточка RS200: габариты, масса, двигатель, мощность, момент, бак, привод, 5AT и главная пара; не универсально для 6MT.' }, { label: 'Toyota — история Altezza', url: 'https://www.toyota.co.jp/jpn/company/history/75years/vehicle_lineage/car/id60000174/index.html', scope: 'Сопоставление комплектаций RS200 6MT/5AT и двигателя 3S-GE.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-aristo-jzs161-v300',
    brandId: 'toyota',
    name: 'Aristo V300 (JZS161)',
    generation: 'II поколение, японская спецификация',
    years: '1997–2005',
    bodyType: 'Седан',
    overview: 'Большой заднеприводный седан с 2JZ-GTE twin-turbo; известен также под экспортным именем Lexus GS 300, но комплектации и рынок различаются.',
    lengthMm: 4805, widthMm: 1800, heightMm: 1435, wheelbaseMm: 2800,
    groundClearanceMm: 150, trunkVolumeLiters: 'Нет подтверждённых данных для указанной комплектации', fuelTankLiters: 75,
    curbWeightKg: '1680 кг для V300 (JZS161, 1998.08)',
    engines: [{ code: '2JZ-GTE', name: '3.0 л twin-turbo', displacement: '2997 см³', powerHp: '280 PS при 5600 об/мин', torqueNm: '451 Н·м при 3600 об/мин', valves: 'Рядный 6-цилиндровый DOHC, 24 клапана', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ', strengths: ['Заводские параметры японской V300 подтверждены каталогом Toyota'], weaknesses: ['Не переносить спецификацию на Aristo S300 с 2JZ-GE'] }],
    transmissions: ['4-ступенчатая АКПП для японской V300'],
    drivetrain: 'Задний привод (FR); главная пара и дифференциал уточняются по коду комплектации.',
    sourceNotes: 'Toyota V300 E-JZS161 (1998.08): 4805×1800×1435 мм, база 2800 мм, колея 1535/1515 мм, масса 1680 кг, 2JZ-GTE 2997 см³, 280 PS/451 Н·м, бак 75 л, 4AT, FR. Размеры шин/дисков и дворников не установлены этой карточкой; не подбирать по одному лишь названию кузова.',
    sourceReferences: [{ label: 'Toyota Japan — Aristo V300 (1998.08)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-ARISTO/199808/1000838/', scope: 'Заводская карточка E-JZS161: размеры, масса, 2JZ-GTE, мощность, момент, бак и коробка.' }, { label: 'Toyota Japan — каталог Aristo', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-ARISTO/', scope: 'Сравнение V300/JZS161 и S300/JZS160; не смешивать моторы.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-levin-ae101-gt-apex',
    brandId: 'toyota',
    name: 'Corolla Levin GT APEX (AE101)',
    generation: 'VII поколение, японская спецификация',
    years: '1991–1995',
    bodyType: 'Купе/Спорт',
    overview: 'Лёгкое переднеприводное купе поколения AE101 с атмосферным 4A-GE 20V. Это отдельная модель от заднеприводных AE86.',
    lengthMm: 4275, widthMm: 1695, heightMm: 1305, wheelbaseMm: 2465,
    groundClearanceMm: 140, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 50,
    curbWeightKg: '1090 кг для GT APEX E-AE101 (1992.05)',
    engines: [{ code: '4A-GE', name: '1.6 л DOHC 20V', displacement: '1587 см³', powerHp: '160 PS при 7400 об/мин', torqueNm: '161.8 Н·м при 5200 об/мин', valves: 'Рядный 4-цилиндровый DOHC, 20 клапанов', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ', strengths: ['Точная спецификация для японского GT APEX E-AE101'], weaknesses: ['Не путать с 4A-GE 16V AE86 и версиями AE111'] }],
    transmissions: ['5-ступенчатая МКПП — по версии', '4-ступенчатая АКПП — по версии'],
    drivetrain: 'Передний привод (FF); данные редуктора и передаточных чисел требуют выбора точной коробки.',
    sourceNotes: 'Toyota GT APEX E-AE101 (1992.05): 4275×1695×1305 мм, база 2465 мм, масса 1090 кг, 4A-GE 1587 см³, 160 PS/161.8 Н·м, бак 50 л. Не выдавать эти данные за характеристики AE86. Точные штатные шины/диски, передаточные числа и дворники требуют отдельной сверки по коду модели.',
    sourceReferences: [{ label: 'Toyota Japan — Corolla Levin GT APEX E-AE101 (1992.05)', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-COROLLA_LEVIN/199205/10047148/', scope: 'Заводские данные японской AE101: габариты, масса, двигатель, мощность, момент, бак.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-skyline-gt-r-bnr34-v-spec-ii',
    brandId: 'nissan',
    name: 'Skyline GT-R V·spec II (BNR34)',
    generation: 'X поколение Skyline, японская спецификация',
    years: '2000–2002',
    bodyType: 'Купе/Спорт',
    overview: 'Высокопроизводительная версия BNR34 с RB26DETT и полным приводом ATTESA E-TS. Не смешивать с гоночными R34 GT500, которые имеют другие двигатель, массу, шины и привод.',
    lengthMm: 4600, widthMm: 1780, heightMm: 1360, wheelbaseMm: 2665,
    groundClearanceMm: 140, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 65,
    curbWeightKg: '1560 кг для V·spec II (заводская карточка Nissan)',
    engines: [{ code: 'RB26DETT', name: '2.6 л рядный 6-цилиндровый twin-turbo', displacement: '2568 см³', powerHp: '280 PS при 6800 об/мин', torqueNm: '392 Н·м при 4400 об/мин', valves: 'DOHC, 24 клапана', fuelSystem: 'Электронный впрыск, twin-turbo', timingDrive: 'Ремень ГРМ', strengths: ['Спецификация дорожной V·spec II отделена от гоночных машин'], weaknesses: ['Проверять фактический код кузова и агрегатов'] }],
    transmissions: ['6-ступенчатая МКПП Getrag — дорожная версия'],
    drivetrain: 'Полный привод ATTESA E-TS; задний активный дифференциал и передаточные числа уточнять по комплектации.',
    sourceNotes: 'Заводская дорожная V·spec II BNR34: 4600×1780×1360 мм, база 2665 мм, масса 1560 кг, RB26DETT 2568 см³, 280 PS/392 Н·м, шины 245/40ZR18. Источник Nissan указывает активный LSD для V·spec; конкретные диски и длины дворников не подтверждены в этой записи.',
    sourceReferences: [{ label: 'Nissan Heritage Collection — Skyline GT-R V·spec II (2000, BNR34)', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/280_skyline_gt-r_v-spec_ii.html', scope: 'Заводские данные дорожной V·spec II: размеры, масса, RB26DETT, мощность, момент и размер шин; не использовать спецификации гоночных машин.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-skyline-gt-r-bnr34-m-spec-nur',
    brandId: 'nissan',
    name: 'Skyline GT-R M·spec Nür (BNR34)',
    generation: 'X поколение Skyline, ограниченная серия',
    years: '2002',
    bodyType: 'Купе/Спорт',
    overview: 'Ограниченная дорожная серия BNR34 с двигателем RB26DETT на базе N1. Характеристики относятся к M·spec Nür и не должны переноситься на обычный GT-R.',
    lengthMm: 4600, widthMm: 1780, heightMm: 1360, wheelbaseMm: 2665,
    groundClearanceMm: 140, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 65,
    curbWeightKg: '1580 кг по карточке Nissan Heritage Collection',
    engines: [{ code: 'RB26DETT', name: '2.6 л рядный 6-цилиндровый twin-turbo, база N1', displacement: '2568 см³', powerHp: '280 PS при 6800 об/мин', torqueNm: '392 Н·м при 4400 об/мин', valves: 'DOHC, 24 клапана', fuelSystem: 'Электронный впрыск, twin-turbo', timingDrive: 'Ремень ГРМ', strengths: ['Ограниченная дорожная спецификация подтверждена Nissan'], weaknesses: ['Не путать с гоночными машинами и не считать заводскую паспортную мощность гарантией состояния старого мотора'] }],
    transmissions: ['6-ступенчатая МКПП — дорожный BNR34'],
    drivetrain: 'Полный привод ATTESA E-TS; дифференциалы и передаточные числа сверять по заводской документации конкретного кузова.',
    sourceNotes: 'Nissan указывает для M·spec Nür: 4600×1780×1360 мм, база 2665 мм, масса 1580 кг, RB26DETT 2568 см³, 280 PS/392 Н·м, шины 245/40ZR18. Точные диски, передаточные числа и дворники не подтверждены этой карточкой.',
    sourceReferences: [{ label: 'Nissan Heritage Collection — Skyline GT-R M·spec Nür (2000, BNR34)', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/306_skyline_gt-r_m-spec_nur.html', scope: 'Данные ограниченной дорожной серии BNR34: размеры, масса, двигатель, мощность, момент и шины.' }]
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
    overview: 'Восьмое поколение Civic. Представительная заводская спецификация для японского седана 1.8S/1.8GL/1.8G FD1 2005 года; другие рынки и комплектации отличаются.',
    lengthMm: 4540, widthMm: 1750, heightMm: 1435, wheelbaseMm: 2700,
    groundClearanceMm: 150, trunkVolumeLiters: 'Нет подтверждённых данных для указанной комплектации', fuelTankLiters: 50,
    curbWeightKg: '1200–1240 кг для японских версий FD1 в зависимости от комплектации',
    engines: [
      { code: 'R18A', name: '1.8 л i-VTEC', displacement: '1799 см³', powerHp: '140 PS для японской версии FD1', torqueNm: '174 Н·м для японской версии FD1', valves: 'SOHC, 16 клапанов, цепной привод', fuelSystem: 'Honda PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Заводские параметры относятся к японскому FD1'], weaknesses: ['Не переносить спецификацию на гибрид FD3, Type R и другие рынки'] }
    ],
    transmissions: ['5-ступенчатая автоматическая трансмиссия — отдельные версии', '5-ступенчатая МКПП — отдельные версии'],
    sourceNotes: 'Данные ограничены японским Civic FD1 1.8 2005 года по заводскому FACT BOOK Honda: длина 4540 мм, ширина 1750 мм, высота 1435/1440 мм в зависимости от версии, база 2700 мм, клиренс 150 мм, бак 50 л, двигатель R18A 1799 см³. Перед ремонтом сверять точный код модели и комплектацию.',
    sourceReferences: [{ label: 'Honda FACT BOOK — CIVIC/CIVIC HYBRID (2005)', url: 'https://www.honda.co.jp/factbook/auto/CIVIC/200509/26.html', scope: 'Заводская таблица японских FD1/FD3: габариты, масса, двигатель R18A, объём бака и типы трансмиссий.' }, { label: 'Honda — архив Civic 2006–2007', url: 'https://www.honda.co.jp/auto-archive/civic/4door/2007/', scope: 'Подтверждает японский период выпуска и каталог поколения; детали комплектации смотреть по выбранному типу.' }]
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
    overview: 'Компактный пятидверный хэтчбек. Ниже приведена спецификация конкретной японской Note 2WD 15S 2005 года с двигателем CR14DE; не переносить её на другие E11.',
    lengthMm: 3730, widthMm: 1670, heightMm: 1640, wheelbaseMm: 2430,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных для конкретной комплектации', fuelTankLiters: 45,
    curbWeightKg: '1070 кг — японская Note 2WD 15S (2005)',
    engines: [
      { code: 'CR14DE', name: '1.4 л бензиновый', displacement: '1386 см³', powerHp: '98 PS при 5600 об/мин (японская 15S)', torqueNm: '137 Н·м при 3200 об/мин (японская 15S)', valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов', fuelSystem: 'Электронный впрыск', timingDrive: 'Уточнить по сервисному руководству конкретного двигателя', strengths: ['Параметры подтверждены для японской 15S'], weaknesses: ['Не путать с HR15DE и экспортными версиями'] }
    ],
    transmissions: ['Не указана в выбранной архивной спецификации; уточнить по табличке автомобиля'],
    sourceNotes: 'Заменены ранее смешанные ориентировочные параметры на характеристики одной заводской версии Nissan Note 2WD 15S 2005 года: 3730×1670×1640 мм, база 2430 мм, масса 1070 кг, CR14DE 1386 см³, 98 PS/137 Н·м. Клиренс, трансмиссия и сервисные параметры оставлены неподтверждёнными.',
    sourceReferences: [{ label: 'Nissan Heritage — Note 2WD 15S (2005, E11)', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/479_note_2wd_15s.html', scope: 'Официальная спецификация японской Note 2WD 15S 2005 года; не распространять на все E11.' }, { label: 'Nissan FAQ — Note E11: топливный бак', url: 'https://faq2.nissan.co.jp/faq/show/10040?category_id=9&site_domain=default', scope: 'Официальный ответ Nissan указывает бак 45 л для всех комплектаций при запуске в январе 2005 года; применено к японской 15S 2005 года.' }]
  }),

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
    engines: [{"code":"HR16DE","name":"1.6L бензин","displacement":"1598 см³","powerHp":"114–117 PS по рынку/году","torqueNm":"156–158 Н·м по рынку/году","valves":"16V DOHC","fuelSystem":"MPI","timingDrive":"Цепь","strengths":["Подтверждённый двигатель J10"],"weaknesses":["Мощность различается по году/рынку"]},{"code":"MR20DE","name":"2.0L бензин","displacement":"1997 см³","powerHp":"139–141 PS по рынку/году","torqueNm":"196 Н·м для распространённой версии","valves":"16V DOHC","fuelSystem":"MPI","timingDrive":"Цепь","strengths":["Доступен с 6MT и CVT в ряде рынков"],"weaknesses":["Коробку выбирать по приводу и рынку"]},{"code":"K9K","name":"1.5L turbo diesel dCi","displacement":"1461 см³","powerHp":"103–110 PS по году/рынку","torqueNm":"240 Н·м для распространённых версий","valves":"8V/16V по версии","fuelSystem":"Common Rail","timingDrive":"Ремень","strengths":["Европейские дизельные версии"],"weaknesses":["Код подверсии K9K и нормы выбросов важны"]},{"code":"M9R","name":"2.0L turbo diesel dCi","displacement":"1995 см³","powerHp":"150 PS для распространённых европейских версий","torqueNm":"320 Н·м для указанной версии","valves":"16V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"Цепь","strengths":["Доступен с механической коробкой и отдельными AT grades"],"weaknesses":["КПП зависит от рынка и привода"]},{"code":"R9M","name":"1.6L turbo diesel dCi (поздние версии)","displacement":"1598 см³","powerHp":"130 PS для отдельных поздних исполнений","torqueNm":"320 Н·м для указанной версии","valves":"16V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"Цепь","strengths":["Поздняя европейская версия"],"weaknesses":["Не относится ко всем годам J10"]}],
    transmissions: ["5MT (HR16DE/K9K, selected grades)","6MT (MR20DE/M9R/R9M and selected K9K grades)","Xtronic CVT RE0F10A (MR20DE and selected regional grades)","6AT (selected M9R 4WD grades)"], drivetrain: 'Передний привод или ALL MODE 4x4.',
    sourceNotes: 'J10 включает несколько силовых агрегатов и коробок. Уточнить тип CVT/AT по VIN до выбора жидкости.',
    sourceReferences: [{"label":"Nissan Qashqai J10 — engine specifications","url":"https://www.nissanbook.ru/Qashqai/J10/main/manual/tehnicheskie-harakteristiki-dvigateley","scope":"Техническая таблица по J10 подтверждает HR16DE, MR20DE, K9K и M9R с рабочими объёмами и типами ГРМ; мощность и трансмиссию сверять по конкретной региональной комплектации."},{"label":"Nissan Qashqai J10 — catalog of engine variants","url":"https://www.drom.ru/catalog/nissan/qashqai/specs/engine_capacity/","scope":"Сводка модификаций по рынкам: HR16DE/MR20DE/K9K/M9R и сочетания МКПП/CVT/АКПП; не заменяет VIN-подбор."},{"label":"Nissan Qashqai J10 — regional powertrain reference","url":"https://ngn-techoil.ru/nissan/qashqai_j10/","scope":"Вторичная техническая сводка подтверждает поздний R9M и семейства коробок 5MT/6MT/CVT для отдельных рынков."}]

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
  }),


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
,
  makeSupplementalModel({
    id: 'toyota-yaris-xp10', brandId: 'toyota', name: 'Yaris / Vitz (XP10)', generation: 'I поколение', years: '1999–2005', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3610, widthMm: 1660, heightMm: 1500, wheelbaseMm: 2370, groundClearanceMm: 145,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 45, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'toyota-yaris-xp90', brandId: 'toyota', name: 'Yaris / Vitz (XP90)', generation: 'II поколение', years: '2005–2011', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3785, widthMm: 1695, heightMm: 1530, wheelbaseMm: 2460, groundClearanceMm: 145,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 42, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'toyota-yaris-xp130', brandId: 'toyota', name: 'Yaris / Vitz (XP130)', generation: 'III поколение', years: '2010–2020', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3885, widthMm: 1695, heightMm: 1510, wheelbaseMm: 2510, groundClearanceMm: 135,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 42, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'toyota-prius-xw10', brandId: 'toyota', name: 'Prius (XW10)', generation: 'I поколение', years: '1997–2003', bodyType: 'Хэтчбек',
    overview: 'Первое поколение Prius: представительская спецификация японской версии NHW10, выпущенной в декабре 1997 года. Экспортные версии и комплектации могли отличаться.',
    lengthMm: 4275, widthMm: 1695, heightMm: 1490, wheelbaseMm: 2550, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных для выбранной комплектации', fuelTankLiters: 50, curbWeightKg: '1240 кг — японская версия NHW10',
    engines: [{ code: '1NZ-FXE', name: '1.5 л гибридный бензиновый двигатель', displacement: '1496 см³', powerHp: '58 PS при 4000 об/мин (ДВС, японская NHW10)', torqueNm: 'Нет подтверждённых данных для этой карточки', valves: 'Рядный 4-цилиндровый DOHC', fuelSystem: 'Заводская гибридная система Toyota', timingDrive: 'Сверить по сервисному руководству конкретного двигателя', strengths: ['Гибридная силовая установка'], weaknesses: ['Мощность ДВС не равна суммарной мощности гибридной системы'] }], transmissions: ['Гибридная трансмиссия с планетарным механизмом распределения мощности; уточнять по версии'],
    drivetrain: 'Передний привод для указанной японской версии.',
    sourceNotes: 'Размеры, масса и двигатель взяты из Toyota Global Vehicle Lineage для представительной японской NHW10. Мощность указана для ДВС, а не системы в целом. Объём бака 50 л подтверждён карточкой Toyota GAZOO для NHW10 1998 года; клиренс, сервисные жидкости и момент не заполнены без подтверждения для точной комплектации.',
    sourceReferences: [{ label: 'Toyota Global — Prius NHW10 (1997)', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60012360/', scope: 'Заводские данные японской NHW10: 4275×1695×1490 мм, база 2550 мм, масса 1240 кг, двигатель 1NZ-FXE 1496 см³ и 58 PS.' }, { label: 'Toyota GAZOO — Prius NHW10, 1998', url: 'https://gazoo.com/catalog/maker/TOYOTA/PRIUS/199712/1008829/', scope: 'Карточка японской NHW10 подтверждает топливный бак 50 л.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-prius-xw20', brandId: 'toyota', name: 'Prius (XW20)', generation: 'II поколение', years: '2003–2009', bodyType: 'Хэтчбек',
    overview: 'Второе поколение Prius (NHW20), запущенное в Японии в сентябре 2003 года. Данные относятся к представительным японским комплектациям S/G, не ко всем рынкам.',
    lengthMm: 4445, widthMm: 1725, heightMm: 1490, wheelbaseMm: 2700, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных для выбранной комплектации', fuelTankLiters: 45, curbWeightKg: '1250–1270 кг — японские версии S/G',
    engines: [{ code: '1NZ-FXE', name: '1.5 л гибридный бензиновый двигатель', displacement: '1496 см³', powerHp: '77 PS при 5000 об/мин (ДВС, японская NHW20)', torqueNm: 'Нет подтверждённых данных для этой карточки', valves: 'Рядный 4-цилиндровый DOHC', fuelSystem: 'Toyota Hybrid System II (THS II)', timingDrive: 'Сверить по сервисному руководству конкретного двигателя', strengths: ['THS II; тяговый электромотор участвует в приводе'], weaknesses: ['77 PS — мощность ДВС, не суммарная мощность гибридной системы'] }], transmissions: ['Гибридная трансмиссия THS II с планетарным механизмом распределения мощности'],
    drivetrain: 'Передний привод для указанных японских версий.',
    sourceNotes: 'Toyota Global подтверждает для японских NHW20 S/G размеры 4445×1725×1490 мм, базу 2700 мм, массу 1250/1270 кг и двигатель 1NZ-FXE 1496 см³, 77 PS. Объём бака 45 л подтверждён карточкой Toyota GAZOO для японской NHW20 G 2007 года; клиренс, момент и сервисные объёмы не заявлены без подтверждения конкретной версии.',
    sourceReferences: [{ label: 'Toyota Global — Prius NHW20 (2003)', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60012399/index.html', scope: 'Заводские данные японских NHW20 S/G; характеристики относятся к представительским комплектациям.' }, { label: 'Toyota GAZOO — Prius NHW20 G, 2007', url: 'https://gazoo.com/catalog/maker/TOYOTA/PRIUS/200309/10038225/', scope: 'Карточка японской NHW20 G подтверждает топливный бак 45 л.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-prius-xw50', brandId: 'toyota', name: 'Prius (XW50)', generation: 'IV поколение', years: '2015–2022', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4540, widthMm: 1760, heightMm: 1470, wheelbaseMm: 2700, groundClearanceMm: 135,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 43, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'toyota-estima-xr50', brandId: 'toyota', name: 'Estima (XR50)', generation: 'III поколение', years: '2006–2019', bodyType: 'Минивэн',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4795, widthMm: 1800, heightMm: 1730, wheelbaseMm: 2950, groundClearanceMm: 160,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 65, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'nissan-skyline-v35', brandId: 'nissan', name: 'Skyline (V35)', generation: 'XI поколение', years: '2001–2007', bodyType: 'Седан',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4675, widthMm: 1750, heightMm: 1470, wheelbaseMm: 2850, groundClearanceMm: 140,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 80, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'nissan-skyline-v36', brandId: 'nissan', name: 'Skyline (V36)', generation: 'XII поколение', years: '2006–2014', bodyType: 'Седан',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4755, widthMm: 1770, heightMm: 1450, wheelbaseMm: 2850, groundClearanceMm: 130,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 80, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'nissan-march-k12', brandId: 'nissan', name: 'March / Micra (K12)', generation: 'III поколение', years: '2002–2010', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3725, widthMm: 1660, heightMm: 1525, wheelbaseMm: 2430, groundClearanceMm: 135,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 41, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'honda-fit-gd', brandId: 'honda', name: 'Fit / Jazz (GD)', generation: 'I поколение', years: '2001–2008', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3830, widthMm: 1675, heightMm: 1525, wheelbaseMm: 2450, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 42, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'honda-fit-ge', brandId: 'honda', name: 'Fit / Jazz (GE)', generation: 'II поколение', years: '2007–2014', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3900, widthMm: 1695, heightMm: 1525, wheelbaseMm: 2500, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 42, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'mazda-demio-dy', brandId: 'mazda', name: 'Demio / Mazda2 (DY)', generation: 'II поколение', years: '2002–2007', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3925, widthMm: 1680, heightMm: 1530, wheelbaseMm: 2490, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 45, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'mazda-demio-de', brandId: 'mazda', name: 'Demio / Mazda2 (DE)', generation: 'III поколение', years: '2007–2014', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3885, widthMm: 1695, heightMm: 1475, wheelbaseMm: 2490, groundClearanceMm: 155,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 41, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'subaru-legacy-bp', brandId: 'subaru', name: 'Legacy (BP/BL)', generation: 'IV поколение', years: '2003–2009', bodyType: 'Универсал',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4680, widthMm: 1730, heightMm: 1475, wheelbaseMm: 2670, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 64, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'subaru-legacy-bmbr', brandId: 'subaru', name: 'Legacy (BM/BR)', generation: 'V поколение', years: '2009–2014', bodyType: 'Универсал',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4790, widthMm: 1780, heightMm: 1535, wheelbaseMm: 2750, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 65, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'suzuki-swift-zc72', brandId: 'suzuki', name: 'Swift (ZC72/ZD72)', generation: 'III поколение', years: '2010–2017', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3850, widthMm: 1695, heightMm: 1510, wheelbaseMm: 2430, groundClearanceMm: 145,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 42, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'suzuki-alto-ha25', brandId: 'suzuki', name: 'Alto (HA25)', generation: 'VII поколение', years: '2009–2014', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3395, widthMm: 1475, heightMm: 1535, wheelbaseMm: 2400, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 30, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'daihatsu-mira-l275', brandId: 'daihatsu', name: 'Mira (L275)', generation: 'VII поколение', years: '2006–2018', bodyType: 'Хэтчбек',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 3395, widthMm: 1475, heightMm: 1530, wheelbaseMm: 2490, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 36, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'lexus-ls-xf30', brandId: 'lexus', name: 'LS (XF30)', generation: 'III поколение', years: '2000–2006', bodyType: 'Седан',
    overview: 'Семейство японских автомобилей. Двигатели, коробки, оснащение и спецификации различаются по поколению, рынку и комплектации.',
    lengthMm: 4995, widthMm: 1830, heightMm: 1490, wheelbaseMm: 2925, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 84, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }], transmissions: ['Зависит от года, рынка и комплектации; уточнять по коду агрегата'],
    drivetrain: 'Зависит от модификации и рынка.',
    sourceNotes: 'Запись семейства для расширения охвата. Размеры ориентировочные; двигатели, коробки, жидкости, лампы и заводские коды требуют проверки по VIN/коду кузова и первичному источнику.'
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-e100', brandId: 'toyota', name: 'Corolla (E100)', generation: 'VII поколение', years: '1991–1998', bodyType: 'Седан',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4270, widthMm: 1685, heightMm: 1380, wheelbaseMm: 2465, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 50, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-e120', brandId: 'toyota', name: 'Corolla (E120/E130)', generation: 'IX поколение', years: '2000–2007', bodyType: 'Седан',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4390, widthMm: 1695, heightMm: 1470, wheelbaseMm: 2600, groundClearanceMm: 160,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 50, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'toyota-camry-xv30', brandId: 'toyota', name: 'Camry (XV30)', generation: 'V поколение', years: '2001–2006', bodyType: 'Седан',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4815, widthMm: 1795, heightMm: 1490, wheelbaseMm: 2720, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 70, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'toyota-camry-xv40', brandId: 'toyota', name: 'Camry (XV40)', generation: 'VI поколение', years: '2006–2011', bodyType: 'Седан',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4815, widthMm: 1820, heightMm: 1480, wheelbaseMm: 2775, groundClearanceMm: 160,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 70, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'toyota-hilux-n50', brandId: 'toyota', name: 'Hilux (N50/N60/N70)', generation: 'VII поколение', years: '2004–2015', bodyType: 'Пикап',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 5260, widthMm: 1835, heightMm: 1860, wheelbaseMm: 3085, groundClearanceMm: 212,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 80, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'toyota-hiace-h200', brandId: 'toyota', name: 'HiAce (H200)', generation: 'V поколение', years: '2004–н.в.', bodyType: 'Минивэн',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4695, widthMm: 1695, heightMm: 1980, wheelbaseMm: 2570, groundClearanceMm: 185,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 70, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'nissan-x-trail-t30', brandId: 'nissan', name: 'X-Trail (T30)', generation: 'I поколение', years: '2000–2007', bodyType: 'Кроссовер',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4510, widthMm: 1765, heightMm: 1675, wheelbaseMm: 2625, groundClearanceMm: 200,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 60, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'nissan-x-trail-t31', brandId: 'nissan', name: 'X-Trail (T31)', generation: 'II поколение', years: '2007–2014', bodyType: 'Кроссовер',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4630, widthMm: 1785, heightMm: 1685, wheelbaseMm: 2630, groundClearanceMm: 200,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 65, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'nissan-serena-c25', brandId: 'nissan', name: 'Serena (C25)', generation: 'III поколение', years: '2005–2010', bodyType: 'Минивэн',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4680, widthMm: 1695, heightMm: 1840, wheelbaseMm: 2860, groundClearanceMm: 160,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 60, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'nissan-navara-d40', brandId: 'nissan', name: 'Navara (D40)', generation: 'III поколение', years: '2004–2015', bodyType: 'Пикап',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 5220, widthMm: 1850, heightMm: 1795, wheelbaseMm: 3200, groundClearanceMm: 228,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 80, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'honda-accord-cf', brandId: 'honda', name: 'Accord (CF)', generation: 'VI поколение', years: '1997–2002', bodyType: 'Седан',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4635, widthMm: 1695, heightMm: 1420, wheelbaseMm: 2665, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 60, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'honda-odyssey-ra', brandId: 'honda', name: 'Odyssey (RA)', generation: 'I поколение', years: '1994–1999', bodyType: 'Минивэн',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4750, widthMm: 1770, heightMm: 1685, wheelbaseMm: 2830, groundClearanceMm: 155,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 65, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'honda-cr-v-rd', brandId: 'honda', name: 'CR-V (RD)', generation: 'I поколение', years: '1995–2001', bodyType: 'Кроссовер',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4510, widthMm: 1750, heightMm: 1675, wheelbaseMm: 2620, groundClearanceMm: 205,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 58, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'mazda-bt50-up', brandId: 'mazda', name: 'BT-50 (UP/UR)', generation: 'II поколение', years: '2011–2020', bodyType: 'Пикап',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 5365, widthMm: 1850, heightMm: 1821, wheelbaseMm: 3220, groundClearanceMm: 237,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 80, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'mazda-mpv-lw', brandId: 'mazda', name: 'MPV (LW)', generation: 'II поколение', years: '1999–2006', bodyType: 'Минивэн',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4750, widthMm: 1830, heightMm: 1745, wheelbaseMm: 2840, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 75, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'subaru-forester-sf', brandId: 'subaru', name: 'Forester (SF)', generation: 'I поколение', years: '1997–2002', bodyType: 'Кроссовер',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4450, widthMm: 1735, heightMm: 1595, wheelbaseMm: 2525, groundClearanceMm: 190,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 60, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'subaru-impreza-gd', brandId: 'subaru', name: 'Impreza (GD/GG)', generation: 'II поколение', years: '2000–2007', bodyType: 'Седан',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4405, widthMm: 1730, heightMm: 1440, wheelbaseMm: 2525, groundClearanceMm: 150,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 50, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'mitsubishi-delica-d5', brandId: 'mitsubishi', name: 'Delica D:5 (CV)', generation: 'IV поколение', years: '2007–н.в.', bodyType: 'Минивэн',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4730, widthMm: 1795, heightMm: 1870, wheelbaseMm: 2850, groundClearanceMm: 210,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 66, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'mitsubishi-pajero-v20', brandId: 'mitsubishi', name: 'Pajero (V20/V40)', generation: 'II поколение', years: '1991–2000', bodyType: 'Внедорожник',
    overview: 'Семейство легковых автомобилей; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: 4680, widthMm: 1775, heightMm: 1900, wheelbaseMm: 2725, groundClearanceMm: 215,
    trunkVolumeLiters: 'Зависит от кузова и методики измерения', fuelTankLiters: 75, curbWeightKg: 'Зависит от версии',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'isuzu-elf-n-series', brandId: 'isuzu', name: 'Elf / N-Series', generation: 'Семейство коммерческих шасси', years: '1959–н.в.', bodyType: 'Пикап',
    overview: 'Семейство коммерческого транспорта; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null,
    trunkVolumeLiters: 'Не применимо: шасси/надстройка зависит от исполнения', fuelTankLiters: null, curbWeightKg: 'Зависит от колёсной базы, GVW и надстройки',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'hino-ranger', brandId: 'hino', name: 'Ranger / 500 Series', generation: 'Семейство среднетоннажных грузовиков', years: '1964–н.в.', bodyType: 'Пикап',
    overview: 'Семейство коммерческого транспорта; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null,
    trunkVolumeLiters: 'Не применимо: шасси/надстройка зависит от исполнения', fuelTankLiters: null, curbWeightKg: 'Зависит от колёсной базы, GVW и надстройки',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'fuso-canter', brandId: 'mitsubishi-fuso', name: 'Fuso Canter', generation: 'Семейство лёгких коммерческих грузовиков', years: '1963–н.в.', bodyType: 'Пикап',
    overview: 'Семейство коммерческого транспорта; точные параметры определяются рынком, кодом кузова, датой выпуска и комплектацией.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null,
    trunkVolumeLiters: 'Не применимо: шасси/надстройка зависит от исполнения', fuelTankLiters: null, curbWeightKg: 'Зависит от колёсной базы, GVW и надстройки',
    engines: [{ code: 'УТОЧНИТЬ ПО ТАБЛИЧКЕ', name: 'Состав двигателей зависит от рынка и года', displacement: 'Не задано без кода двигателя', powerHp: 'Не задано без точной модификации', torqueNm: 'Не задано без точной модификации', valves: 'Уточнить по коду двигателя', fuelSystem: 'Уточнить по коду двигателя', timingDrive: 'Уточнить по коду двигателя', strengths: [], weaknesses: [] }],
    transmissions: ['Уточнить по коду коробки и рынку'],
    drivetrain: 'Зависит от версии; сверять по VIN/табличке.',
    sourceNotes: 'Индекс семейства добавлен для покрытия каталога. Не использовать как руководство для ремонта: характеристики агрегатов, жидкости, лампы и предохранители требуют точной идентификации и OEM-источника.'
  }),
  makeSupplementalModel({
    id: 'toyota-land-cruiser-prado-90-j90-suv',
    brandId: 'toyota',
    name: 'Land Cruiser Prado 90 (J90)',
    generation: 'II поколение Prado (J90)',
    years: '1996–2002',
    bodyType: 'Внедорожник',
    overview: 'Prado серии J90 выпускался с короткой 3-дверной и длинной 5-дверной базой. В заводской линейке встречались бензиновые 2.7/3.4 л и дизельные 3.0 л; конкретная комбинация зависит от рынка и года.',
    lengthMm: 4675, widthMm: 1820, heightMm: 1880, wheelbaseMm: 2675,
    groundClearanceMm: 220, trunkVolumeLiters: 'Зависит от 3/5-дверного кузова', fuelTankLiters: 90,
    curbWeightKg: 'Примерно 1740–1960 кг для отдельных заводских исполнений; проверить табличку',
    engines: [
      { code: '3RZ-FE', name: '2.7 л бензин, рядный 4-цилиндровый', displacement: '2693 см³', powerHp: '150 PS для отдельных японских исполнений', torqueNm: 'Зависит от года и рынка', valves: '16V DOHC', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферная конструкция'], weaknesses: ['Мощность и калибровки различаются по рынкам'] },
      { code: '5VZ-FE', name: '3.4 л бензин V6', displacement: '3378 см³', powerHp: '185 PS для отдельных японских исполнений', torqueNm: '294 Н·м для отдельных японских исполнений', valves: '24V DOHC V6', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ; регламент по руководству конкретной версии', strengths: ['Плавная работа V6'], weaknesses: ['Требует соблюдения регламента ременного привода'] },
      { code: '1KZ-TE', name: '3.0 л турбодизель', displacement: '2982 см³', powerHp: '140 PS для отдельных исполнений с интеркулером', torqueNm: 'Зависит от года и рынка', valves: '8V SOHC турбодизель', fuelSystem: 'Электронно управляемый дизельный впрыск', timingDrive: 'Уточнять по руководству для конкретного рынка', strengths: ['Высокий крутящий момент'], weaknesses: ['Особенно важны исправность охлаждения и корректное обслуживание'] },
      { code: '1KD-FTV', name: '3.0 л турбодизель D-4D — поздние версии', displacement: '2982 см³', powerHp: 'Зависит от рынка и калибровки', torqueNm: 'Зависит от рынка и калибровки', valves: '16V DOHC турбодизель', fuelSystem: 'Common Rail', timingDrive: 'Уточнять по заводскому руководству', strengths: ['Более современная система впрыска'], weaknesses: ['Не смешивать с характеристиками 1KZ-TE'] }
    ],
    transmissions: ['МКПП или АКПП — по двигателю и рынку; точный код определить по табличке/VIN'],
    drivetrain: 'Для серии характерен полный привод; схема и блокировки зависят от исполнения.',
    sourceNotes: 'Заводская история Toyota подтверждает поколения, представительные размеры и часть моторной гаммы J90. Короткая и длинная базы имеют разные габариты; карточка показывает ориентир для 5-дверного кузова, а параметры конкретной машины нужно проверять по коду кузова.',
    sourceReferences: [
      { label: 'Toyota Global — Land Cruiser Prado 90 series', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60012615/index.html', scope: 'Заводская история J90, габариты отдельных 5-дверных и 3-дверных исполнений, коды и характеристики 3RZ-FE/5VZ-FE/1KZ-TE/1KD-FTV' },
      { label: 'Toyota Japan — каталог Prado, архив комплектаций', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-LAND_CRUISER_PRADO/200007/1007926/', scope: 'Пример японского 5-дверного J90 с 5VZ-FE; спецификация относится только к указанной комплектации' }
    ]
  }),
  makeSupplementalModel({
    id: 'toyota-land-cruiser-prado-120-j120-suv',
    brandId: 'toyota',
    name: 'Land Cruiser Prado 120 (J120)',
    generation: 'III поколение Prado (J120)',
    years: '2002–2009',
    bodyType: 'Внедорожник',
    overview: 'Prado J120 выпускался с короткой и длинной базой. На разных рынках встречались бензиновые 2.7/3.4/4.0 л и дизельные 3.0 л; двигатель, коробка и оснащение нельзя назначать только по названию модели.',
    lengthMm: 4715, widthMm: 1875, heightMm: 1870, wheelbaseMm: 2790,
    groundClearanceMm: 220, trunkVolumeLiters: 'Зависит от кузова, сидений и рынка', fuelTankLiters: 87,
    curbWeightKg: 'Примерно 1880–1990 кг для отдельных 5-дверных исполнений',
    engines: [
      { code: '3RZ-FE', name: '2.7 л бензин', displacement: '2693 см³', powerHp: '150 PS для отдельных японских исполнений', torqueNm: '235 Н·м для указанного исполнения', valves: '16V DOHC', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферный бензиновый двигатель'], weaknesses: ['Параметры отличаются по рынку'] },
      { code: '5VZ-FE', name: '3.4 л бензин V6', displacement: '3378 см³', powerHp: '185 PS для отдельных японских исполнений', torqueNm: '294 Н·м для отдельных японских исполнений', valves: '24V DOHC V6', fuelSystem: 'EFI', timingDrive: 'Ремень ГРМ; интервал по руководству конкретной версии', strengths: ['Плавная тяга V6'], weaknesses: ['Нужен подтверждённый регламент ремня'] },
      { code: '1GR-FE', name: '4.0 л бензин V6', displacement: '3955 см³', powerHp: 'Зависит от года и рынка; около 249 PS для отдельных поздних японских версий', torqueNm: 'Зависит от калибровки и рынка', valves: '24V DOHC V6 Dual VVT-i на отдельных версиях', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Хороший запас тяги'], weaknesses: ['Расход топлива и параметры зависят от исполнения'] },
      { code: '1KD-FTV', name: '3.0 л турбодизель D-4D', displacement: '2982 см³', powerHp: '127 кВт / 173 PS для отдельных исполнений', torqueNm: 'До 410 Н·м для отдельных исполнений', valves: '16V DOHC турбодизель', fuelSystem: 'Common Rail', timingDrive: 'Ремень ГРМ; регламент зависит от года и рынка', strengths: ['Высокая тяга на низких оборотах'], weaknesses: ['Требует правильной диагностики топливной системы и наддува'] }
    ],
    transmissions: ['5-ступенчатая МКПП и 4-/5-ступенчатые АКПП встречаются в зависимости от двигателя и рынка; точный код проверять по VIN'],
    drivetrain: 'Полный привод; межосевой дифференциал и блокировки зависят от комплектации.',
    sourceNotes: 'Размеры, масса и двигатели подтверждены для представительных заводских японских исполнений J120, а не для каждой машины СНГ. Не использовать объёмы жидкостей, номера деталей, моменты затяжки или интервалы без руководства для конкретного VIN.',
    sourceReferences: [
      { label: 'Toyota Global — Land Cruiser Prado 120 series', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60014203/index.html', scope: 'Заводская история J120 и представительные характеристики 5VZ-FE/3RZ-FE' },
      { label: 'Toyota Japan — каталог Prado 120 TX', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-LAND_CRUISER_PRADO/200210/1011687/', scope: 'Пример 5-дверной версии с 3RZ-FE, габаритами 4715×1875×1870 мм, базой 2790 мм и баком 87 л' },
      { label: 'Toyota Japan — каталог Prado 120 1GR-FE', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-LAND_CRUISER_PRADO/200508/10028727/', scope: 'Пример исполнения 2005 года с 1GR-FE; характеристики относятся к указанной комплектации' },
      { label: 'Toyota technical manuals — Land Cruiser Prado 120/125', url: 'https://toyotamanuals.gitlab.io/PZ471-Z00W0-CA/htmlweb/contents/pdf.html', scope: 'Заводская ремонтная документация для серий TRJ120/125, GRJ120/125, KDJ120/125 и других перечисленных серий' }
    ]
  }),
  makeSupplementalModel({
    id: 'toyota-land-cruiser-prado-150-j150-suv',
    brandId: 'toyota',
    name: 'Land Cruiser Prado 150 (J150)',
    generation: 'IV поколение Prado (J150)',
    years: '2009–2023',
    bodyType: 'Внедорожник',
    overview: 'Prado J150 — рамный внедорожник, выпускавшийся с несколькими бензиновыми и дизельными двигателями в зависимости от рынка и обновления. В этой записи собраны основные семейства моторов; точную модификацию необходимо выбирать по VIN, коду кузова и табличке агрегатов.',
    lengthMm: 4760, widthMm: 1885, heightMm: 1850, wheelbaseMm: 2790,
    groundClearanceMm: 215, trunkVolumeLiters: 'Зависит от 5/7-местной компоновки и рынка', fuelTankLiters: 87,
    curbWeightKg: 'Примерно 2090–2180 кг для отдельных японских бензиновых исполнений',
    engines: [
      { code: '2TR-FE', name: '2.7 л бензин', displacement: '2693 см³', powerHp: 'Зависит от года и рынка; 163 PS для ряда японских исполнений', torqueNm: '246 Н·м для указанного исполнения', valves: '16V DOHC Dual VVT-i на поздних версиях', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Простая атмосферная конфигурация'], weaknesses: ['Динамика зависит от массы и комплектации'] },
      { code: '1GR-FE', name: '4.0 л бензин V6', displacement: '3955 см³', powerHp: '276 PS для указанной японской версии 2009 года; другие рынки/годы отличаются', torqueNm: 'Зависит от калибровки и года', valves: '24V DOHC V6 Dual VVT-i', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Высокий запас мощности'], weaknesses: ['Расход топлива существенно зависит от условий и версии'] },
      { code: '1KD-FTV', name: '3.0 л турбодизель D-4D — ранние версии', displacement: '2982 см³', powerHp: 'Зависит от рынка и калибровки', torqueNm: 'Зависит от рынка и калибровки', valves: '16V DOHC турбодизель', fuelSystem: 'Common Rail', timingDrive: 'Ремень ГРМ; интервал по руководству конкретной версии', strengths: ['Высокая тяга на низких оборотах'], weaknesses: ['Необходимо проверять состояние топливной системы и наддува'] },
      { code: '1GD-FTV', name: '2.8 л турбодизель — поздние версии', displacement: '2755 см³', powerHp: 'Зависит от года и рынка', torqueNm: 'Зависит от калибровки и экологического исполнения', valves: '16V DOHC турбодизель', fuelSystem: 'Common Rail', timingDrive: 'Цепь ГРМ', strengths: ['Более современное дизельное семейство'], weaknesses: ['Системы очистки выхлопа зависят от рынка и года'] }
    ],
    transmissions: ['МКПП или АКПП; число передач и код агрегата зависят от двигателя, года и рынка. Проверять по VIN/табличке'],
    drivetrain: 'Полный привод; раздаточная коробка, межосевой дифференциал и блокировки зависят от комплектации.',
    sourceNotes: 'Заводские источники подтверждают габариты, базу и представительные двигатели J150, но рынок СНГ объединяет разные поставки. Значения дорожного просвета, массы, баков и моторных характеристик могут отличаться; перед ремонтом сверять точный кузовной код и руководство.',
    sourceReferences: [
      { label: 'Toyota Global — Land Cruiser Prado 150 series', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60001931/index.html', scope: 'Заводская история J150, габариты, база и представительная версия 1GR-FE' },
      { label: 'Toyota Japan — каталог Prado 150 TX L package', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-LAND_CRUISER_PRADO/200909/10057803/', scope: 'Пример ранней версии J150 с 2TR-FE, габаритами 4760×1885×1850 мм, базой 2790 мм и баком 87 л' },
      { label: 'Toyota Japan — официальные руководства Prado', url: 'https://manual.toyota.jp/landcruiserprado/', scope: 'Руководства владельца J150 по датам выпуска и типу двигателя; выбирать соответствующее производство/версию' }
    ]
  })

,
  makeSupplementalModel({
    id: 'nissan-pathfinder-r50-suv', brandId: 'nissan',
    name: 'Pathfinder R50', generation: 'II поколение (R50)', years: '1995–2004', bodyType: 'Внедорожник',
    overview: 'Pathfinder R50: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{ code: 'VG33E / QD32', name: 'Бензиновый V6 или дизель; рынок-зависимые версии', displacement: 'Уточнить по коду двигателя', powerHp: 'Нет подтверждённых универсальных данных', torqueNm: 'Нет подтверждённых универсальных данных', valves: 'Проверить по модификации', fuelSystem: 'Проверить по модификации', timingDrive: 'По заводскому руководству конкретного двигателя', strengths: ['Идентификация по коду двигателя обязательна'], weaknesses: ['Не использовать как спецификацию без VIN и рынка'] }],
    transmissions: ['АКПП или МКПП — только если предусмотрена конкретным рынком; код коробки проверить по VIN. Не указывать CVT без заводского подтверждения.'],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{ label: 'Nissan — официальный исторический/модельный источник', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/prairie_terrano.html', scope: 'Заводской архив Nissan содержит Pathfinder/Terrano; сверять рынок и кузовной код.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-pathfinder-r51-suv', brandId: 'nissan',
    name: 'Pathfinder R51', generation: 'III поколение (R51)', years: '2004–2012', bodyType: 'Внедорожник',
    overview: 'Pathfinder R51: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{"code":"VQ40DE","name":"4.0L бензин V6 (Северная Америка и отдельные рынки)","displacement":"3954 см³","powerHp":"266 hp (US specification)","torqueNm":"385 Н·м (US specification)","valves":"24V DOHC V6","fuelSystem":"MPI","timingDrive":"Цепь","strengths":["Подтверждённое семейство VQ40DE для R51"],"weaknesses":["Не переносить мощность и КПП на другие рынки без проверки"]},{"code":"YD25DDTi","name":"2.5L турбодизель (Европа/Азия, отдельные годы)","displacement":"2488 см³","powerHp":"174–190 PS по году и рынку","torqueNm":"403–450 Н·м по году и рынку","valves":"16V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"По заводскому руководству конкретной версии","strengths":["Доступен в нескольких региональных версиях"],"weaknesses":["Калибровка и коробка зависят от рынка"]},{"code":"V9X","name":"3.0L V6 турбодизель (поздние европейские версии)","displacement":"2993 см³","powerHp":"231 PS для указанной версии","torqueNm":"550 Н·м для указанной версии","valves":"24V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"Цепь","strengths":["Высокий крутящий момент"],"weaknesses":["Применимость ограничена поздними региональными комплектациями"]}],
    transmissions: ["5AT (автоматическая; распространённые бензиновые/дизельные версии по рынку)","6MT (отдельные дизельные версии)","7AT (отдельные поздние V9X версии)"],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{"label":"Nissan Genuine Parts catalog — Pathfinder R51, YD25DDTi/VQ40DE/V9X","url":"https://partsouq.com/en/catalog/genuine/diagram?c=NISSAN201809&number=3814040P00","scope":"Каталог оригинальных деталей показывает R51M и двигатели YD25DDTi, VQ40DE и V9X по рынку/году; коробку сверять по VIN."},{"label":"Nissan Genuine Parts catalog — Pathfinder R51 2010–2013","url":"https://partsouq.com/en/catalog/genuine/diagram?c=NISSAN201809&number=349105X00B","scope":"Подтверждает семейства двигателей и узлы управления автоматической трансмиссией для R51M; не заменяет подбор по VIN."}]
  }),
  makeSupplementalModel({
    id: 'nissan-pathfinder-r52-suv', brandId: 'nissan',
    name: 'Pathfinder R52', generation: 'IV поколение (R52)', years: '2012–2021', bodyType: 'Внедорожник',
    overview: 'Pathfinder R52: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{"code":"VQ35DE","name":"3.5L бензин V6 (США/Канада)","displacement":"3498 см³","powerHp":"260 hp при 6400 об/мин","torqueNm":"325 Н·м при 4400 об/мин","valves":"24V DOHC V6","fuelSystem":"Sequential multi-point EFI","timingDrive":"Цепь","strengths":["Официально указан для Pathfinder 2013–2015"],"weaknesses":["Мощность относится к североамериканским спецификациям"]},{"code":"QR25DER","name":"2.5L бензиновый supercharged hybrid","displacement":"2488 см³","powerHp":"230 hp двигатель; 250 hp суммарно для гибридной системы","torqueNm":"329 Н·м для двигателя; системный показатель зависит от методики","valves":"16V DOHC","fuelSystem":"EFI, компрессор, гибридный привод","timingDrive":"Цепь","strengths":["Подтверждённая гибридная версия 2014–2015"],"weaknesses":["Не считать мощность ДВС и суммарную мощность гибрида одним параметром"]}],
    transmissions: ["Xtronic CVT (VQ35DE, Pathfinder R52 североамериканского рынка)","CVT в составе гибридной трансмиссии (QR25DER; гибридная версия)"],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{"label":"Nissan USA — Pathfinder 2015 Press Kit","url":"https://usa.nissannews.com/en-US/releases/us-2015-nissan-pathfinder-press-kit","scope":"Официальная спецификация R52 для рынка США: VQ35DE 3.5L, 260 hp/240 lb-ft и Xtronic CVT."},{"label":"Nissan USA — Pathfinder Hybrid 2014","url":"https://usa.nissannews.com/en-US/releases/release-6b87ffcfc23e44d68116633b663f2caf-us-2014-nissan-pathfinder-hybrid","scope":"Официальная спецификация QR25DER 2.5L supercharged hybrid: 230 hp ДВС, 250 hp системная мощность и CVT."}]
  }),
  makeSupplementalModel({
    id: 'nissan-pathfinder-r53-suv', brandId: 'nissan',
    name: 'Pathfinder R53', generation: 'V поколение (R53)', years: '2021–наст. время', bodyType: 'Внедорожник',
    overview: 'Pathfinder R53: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{"code":"VQ35DD","name":"3.5L бензин V6 с непосредственным впрыском","displacement":"3498 см³","powerHp":"284 hp при 6400 об/мин (US specification)","torqueNm":"351 Н·м при 4800 об/мин (US specification)","valves":"24V DOHC V6","fuelSystem":"Direct Injection Gasoline","timingDrive":"Цепь","strengths":["Заводская спецификация Nissan 2022"],"weaknesses":["Параметры относятся к североамериканской версии"]}],
    transmissions: ["9AT (9-ступенчатая автоматическая трансмиссия; US-spec 2022+)"],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{"label":"Nissan USA — Pathfinder 2022 Press Kit","url":"https://usa.nissannews.com/en-US/releases/2022-nissan-pathfinder-press-kit","scope":"Официальная спецификация: VQ35DD 3.5L, 284 hp/259 lb-ft и 9-ступенчатая АКПП для R53 на рынке США."}]
  }),
  makeSupplementalModel({
    id: 'nissan-murano-z50-crossover', brandId: 'nissan',
    name: 'Murano Z50', generation: 'I поколение (Z50)', years: '2002–2007', bodyType: 'Кроссовер',
    overview: 'Murano Z50: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: 4770, widthMm: 1880, heightMm: 1685, wheelbaseMm: 2825,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: 82,
    curbWeightKg: '1720 кг — заводская спецификация японской версии 2WD 350XV 2004 года',
    engines: [{ code: 'VQ35DE', name: '3.5 л бензин V6 DOHC', displacement: '3498 см³', powerHp: '231 PS при 5600 об/мин для японской версии 2WD 350XV 2004 года', torqueNm: '333 Н·м при 2800 об/мин для указанной версии', valves: '24V DOHC V6', fuelSystem: 'EFI; исполнение зависит от рынка', timingDrive: 'Цепь ГРМ; точный регламент обслуживания сверять с руководством', strengths: ['Высокая плавность и тяга V6'], weaknesses: ['Параметры японской 2WD-версии нельзя автоматически переносить на AWD и экспортные исполнения'] }],
    transmissions: ['Вариатор CVT на ряде версий; точный код и спецификацию жидкости сверить по VIN/табличке агрегата'],
    drivetrain: 'Выпускались переднеприводные и полноприводные версии; привод и трансмиссию не определять только по названию Z50.',
    sourceNotes: 'Заводская карточка Nissan описывает японский Murano 2WD 350XV 2004 года: 4770×1880×1685 мм, база 2825 мм, масса 1720 кг, VQ35DE 3498 см³, 231 PS и 333 Н·м. Это одна конкретная версия, не универсальная спецификация всех Z50. Объём бака 82 л подтверждён японской карточкой GAZOO для 2WD 250XL/350XV Z50; дорожный просвет, сервисные жидкости и объёмы требуют руководства соответствующего рынка и трансмиссии.',
    sourceReferences: [{ label: 'Nissan Heritage — Murano 2WD 350XV (2004, PZ50)', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/467_murano_2wd_350xv.html', scope: 'Официальные размеры, масса и двигатель для японской 2WD-версии 2004 года; не распространять на все рынки.' }, { label: 'Toyota GAZOO — Nissan Murano 350XV (PZ50, 2004)', url: 'https://gazoo.com/catalog/maker/NISSAN/MURANO/200409/10023167/', scope: 'Карточка японской 2WD 350XV подтверждает топливный бак 82 л.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-murano-z51-crossover', brandId: 'nissan',
    name: 'Murano Z51', generation: 'II поколение (Z51)', years: '2008–2014', bodyType: 'Кроссовер',
    overview: 'Murano Z51: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{"code":"VQ35DE","name":"3.5L бензин V6 (США/Япония, selected grades)","displacement":"3498 см³","powerHp":"265 hp для ряда североамериканских версий; японские версии отличаются","torqueNm":"336 Н·м для указанной североамериканской версии","valves":"24V DOHC V6","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Основной бензиновый V6 Z51"],"weaknesses":["Мощность зависит от рынка и года"]},{"code":"QR25DE","name":"2.5L бензин (отдельные японские исполнения)","displacement":"2488 см³","powerHp":"170 PS для отдельных японских grade","torqueNm":"245 Н·м для указанного исполнения","valves":"16V DOHC","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Региональная версия 250XV"],"weaknesses":["Не доступен на всех рынках"]},{"code":"YD25DDTi","name":"2.5L турбодизель (отдельные европейские исполнения)","displacement":"2488 см³","powerHp":"190 PS для отдельных версий","torqueNm":"450 Н·м для указанной версии","valves":"16V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"Цепь","strengths":["Региональная дизельная версия"],"weaknesses":["Проверять по коду кузова и рынку"]}],
    transmissions: ["Xtronic CVT RE0F09A/RE0F09B (VQ35DE; год/рынок dependent)","CVT (QR25DE; selected Japanese grades)","6MT or 6AT (YD25DDTi diesel; selected European grades, confirm by VIN)"],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{"label":"Nissan Murano Z51 — engine fitment cross-check","url":"https://www.gspglobal.com/SITEDATA/DATA/article/20240306/GSP%20ENGINE%20MOUNTING%20CATALOGUE%202024.pdf","scope":"Каталог применимости перечисляет QR25DE и YD25DDTi для Z51, а также VQ35DE; рынок и дата выпуска указаны в таблице."},{"label":"Nissan Murano Z51 — regional engine/transmission data","url":"https://ngn-techoil.ru/nissan/murano_z51/","scope":"Вторичная техническая сводка указывает VQ35DE с CVT RE0F09A/RE0F09B, а также QR25DE/YD25DDTi для отдельных рынков; конкретную коробку сверять по VIN."}]
  }),
  makeSupplementalModel({
    id: 'nissan-murano-z52-crossover', brandId: 'nissan',
    name: 'Murano Z52', generation: 'III поколение (Z52)', years: '2014–2024', bodyType: 'Кроссовер',
    overview: 'Murano Z52: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{"code":"VQ35DE","name":"3.5L бензин V6 (US-spec)","displacement":"3498 см³","powerHp":"260 hp при 6000 об/мин","torqueNm":"325 Н·м при 4400 об/мин","valves":"24V DOHC V6","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Подтверждено официальной спецификацией Nissan USA"],"weaknesses":["Применимость и мощность сверять по рынку/году"]},{"code":"QR25DER","name":"2.5L supercharged hybrid (selected Japan-market grades)","displacement":"2488 см³","powerHp":"230 hp двигатель; системная мощность зависит от версии","torqueNm":"330 Н·м для ДВС в официальной технической таблице","valves":"16V DOHC","fuelSystem":"EFI, компрессор, гибридный привод","timingDrive":"Цепь","strengths":["Гибридное исполнение отличается от обычного VQ35DE"],"weaknesses":["ДВС и системную мощность нельзя смешивать"]}],
    transmissions: ["Xtronic CVT RE0F10J (VQ35DE, US-spec 2015–2024)","CVT в составе гибридной трансмиссии (QR25DER; selected Japanese grades)"],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{"label":"Nissan USA — Murano 2015 Press Kit","url":"https://usa.nissannews.com/en-US/releases/us-2015-nissan-murano-press-kit","scope":"Официальная спецификация VQ35DE 3.5L 260 hp/240 lb-ft и Xtronic CVT для североамериканского Z52."},{"label":"Nissan Technical Review — QR25DER hybrid powertrain","url":"https://www.nissan-global.com/JP/TECHNICALREVIEW/PDF/NISSAN_TECHINICAL_REVIEW_74.pdf","scope":"Официальная техническая публикация Nissan подтверждает QR25DER 2.5L supercharged hybrid и CVT; конкретную модель/grade сверять по региональному каталогу."}]
  }),
  makeSupplementalModel({
    id: 'nissan-murano-z53-crossover', brandId: 'nissan',
    name: 'Murano Z53', generation: 'IV поколение (Z53)', years: '2024–наст. время', bodyType: 'Кроссовер',
    overview: 'Murano Z53: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{"code":"KR20DDET","name":"2.0L VC-Turbo бензин","displacement":"1997 см³","powerHp":"241 hp (US specification)","torqueNm":"352 Н·м (US specification)","valves":"16V DOHC, variable compression","fuelSystem":"Direct injection turbo","timingDrive":"Цепь","strengths":["Указан для поколения Z53 в каталоге модификаций"],"weaknesses":["Не переносить характеристики на Z52 VQ35DE"]}],
    transmissions: ["9AT (9-ступенчатая автоматическая; US-spec 2025+)"],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{"label":"Drom — Nissan Murano engine catalogue by generation","url":"https://www.drom.ru/catalog/nissan/murano/specs/engine_capacity/","scope":"Каталог поколений показывает KR20DDET 2.0L turbo и 9AT для Murano Z53 на рынке США; для конкретного года/grade сверить официальный VIN-каталог."}]
  }),
  makeSupplementalModel({
    id: 'nissan-xtrail-t30-crossover', brandId: 'nissan',
    name: 'X-Trail T30', generation: 'I поколение (T30)', years: '2000–2007', bodyType: 'Кроссовер',
    overview: 'X-Trail T30: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: 4455, widthMm: 1765, heightMm: 1750, wheelbaseMm: 2625,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: '1400 кг — заводская спецификация NT30 4WD X 2003 года',
    engines: [{"code":"QR20DE","name":"2.0L бензин","displacement":"1998 см³","powerHp":"150 PS для японской версии NT30 4WD X 2003","torqueNm":"200 Н·м для указанной версии","valves":"16V DOHC","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Подтверждено Nissan Heritage для конкретной NT30"],"weaknesses":["Не переносить параметры на другие рынки/годы"]},{"code":"QR25DE","name":"2.5L бензин","displacement":"2488 см³","powerHp":"180 PS для отдельных японских версий","torqueNm":"245 Н·м для указанной версии","valves":"16V DOHC","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Доступен на отдельных рынках"],"weaknesses":["Мощность и коробка зависят от года/grade"]},{"code":"SR20VET","name":"2.0L turbo (X-Trail GT, Japan)","displacement":"1998 см³","powerHp":"280 PS (Japan-market X-Trail GT)","torqueNm":"309 Н·м для указанной версии","valves":"16V DOHC Turbo, NEO VVL","fuelSystem":"EFI, turbo","timingDrive":"Цепь","strengths":["Официально упомянут Nissan как GT-версия"],"weaknesses":["Только соответствующие японские GT-комплектации"]}],
    transmissions: ["4AT (автоматическая; распространённые бензиновые grades)","5MT (отдельные рынки/grade; confirm by chassis code)"],
    drivetrain: 'В источнике приведена версия NT30 4WD X; у поколения существовали и другие комплектации, поэтому привод уточнять по табличке/VIN.',
    sourceNotes: 'Заводская карточка Nissan описывает X-TRAIL 4WD X NT30 2003 года: 4455×1765×1750 мм, база 2625 мм, масса 1400 кг, QR20DE 1998 см³, 150 PS при 6000 об/мин и 200 Н·м при 4000 об/мин. Эти параметры относятся к конкретной японской версии. Дорожный просвет, объём бака, багажника и сервисные жидкости здесь не подтверждены универсально.',
    sourceReferences: [{"label":"Nissan Heritage — X-TRAIL 4WD X (NT30, 2003)","url":"https://www.nissan-global.com/EN/HERITAGE_COLLECTION/469_x_trail_x_4wd.html","scope":"Официальные параметры QR20DE для японской NT30 4WD X 2003 года."},{"label":"Nissan — X-Trail 25-year history","url":"https://www.nissan-global.com/EN/STORIES/RELEASES/the-x-trail-25-year-journey/","scope":"Официальная история Nissan подтверждает X-Trail GT для японского рынка с SR20VET 280 PS."},{"label":"Nissan Europe EPC — X-Trail T30 QR20DE 5MT","url":"https://nissan-europe.epc-data.com/x-trail/t30/146-qr20de/power_train/320/","scope":"Каталог оригинальных деталей подтверждает 5MT для конкретной европейской T30 QR20DE 4WD grade."}]
  }),
  makeSupplementalModel({
    id: 'nissan-xtrail-t31-crossover', brandId: 'nissan',
    name: 'X-Trail T31', generation: 'II поколение (T31)', years: '2007–2013', bodyType: 'Кроссовер',
    overview: 'X-Trail T31: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: 4635, widthMm: 1790, heightMm: 1785, wheelbaseMm: 2630,
    groundClearanceMm: null, trunkVolumeLiters: 'Зависит от комплектации и положения сидений', fuelTankLiters: 65,
    curbWeightKg: 'Зависит от двигателя, коробки и привода',
    engines: [{"code":"MR20DE","name":"2.0L бензин","displacement":"1997 см³","powerHp":"137 PS при 5200 об/мин (Japan-spec 2013)","torqueNm":"200 Н·м при 4400 об/мин (Japan-spec 2013)","valves":"16V DOHC","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Подтверждено заводской спецификацией Nissan Japan"],"weaknesses":["Параметры относятся к указанному рынку/году"]},{"code":"QR25DE","name":"2.5L бензин","displacement":"2488 см³","powerHp":"170 PS при 6000 об/мин (Japan-spec 2013)","torqueNm":"230 Н·м при 4400 об/мин (Japan-spec 2013)","valves":"16V DOHC","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Подтверждено заводской спецификацией Nissan Japan"],"weaknesses":["Параметры относятся к указанному рынку/году"]},{"code":"M9R","name":"2.0L турбодизель dCi (20GT)","displacement":"1995 см³","powerHp":"173 PS при 3750 об/мин (Japan-spec 20GT)","torqueNm":"360 Н·м при 2000 об/мин","valves":"16V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"Цепь","strengths":["Для 20GT предусмотрены отдельные коробки"],"weaknesses":["Не смешивать с бензиновыми версиями"]}],
    transmissions: ["Xtronic CVT (MR20DE; selected Japan-market grades)","Xtronic CVT-M6 (QR25DE; selected Japan-market grades)","6MT (M9R 20GT; selected grades)","6AT (M9R 20GT; selected grades)"],
    drivetrain: 'Передний привод или ALL MODE 4x4-i. На японском рынке существовали бензиновые MR20DE/QR25DE и дизельные 20GT с M9R.',
    sourceNotes: 'Заводская страница Nissan Japan для T31 2013 года указывает MR20DE 2.0 л — 137 PS/200 Н·м, QR25DE 2.5 л — 170 PS/230 Н·м и дизель M9R 2.0 л — 173 PS/360 Н·м для отдельных японских исполнений. Размеры, масса, коробки и выбросные системы нужно сверять по конкретному рынку/модификации.',
    sourceReferences: [{"label":"Nissan Japan — X-TRAIL T31 2013 grade matrix","url":"https://history.nissan.co.jp/X-TRAIL/T31/1312/grade.html","scope":"Официальная таблица связывает MR20DE с Xtronic CVT, QR25DE с CVT-M6, а M9R 20GT с 6MT и 6AT."},{"label":"Nissan Japan — X-TRAIL T31 performance","url":"https://history.nissan.co.jp/X-TRAIL/T31/1312/performance.html","scope":"Заводские характеристики MR20DE, QR25DE и M9R для отдельных японских комплектаций."}]
  }),
  makeSupplementalModel({
    id: 'nissan-xtrail-t32-crossover', brandId: 'nissan',
    name: 'X-Trail T32', generation: 'III поколение (T32)', years: '2013–2022', bodyType: 'Кроссовер',
    overview: 'X-Trail T32: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: 4640, widthMm: 1820, heightMm: 1715, wheelbaseMm: 2705,
    groundClearanceMm: null, trunkVolumeLiters: 'Зависит от сидений и комплектации', fuelTankLiters: null,
    curbWeightKg: 'Зависит от двигателя, привода и комплектации',
    engines: [{"code":"MR20DD","name":"2.0L бензин, непосредственный впрыск (Japan-spec)","displacement":"1997 см³","powerHp":"147 PS","torqueNm":"207 Н·м","valves":"16V DOHC","fuelSystem":"Direct injection","timingDrive":"Цепь","strengths":["Заводские параметры для японского T32"],"weaknesses":["Не переносить на другие рынки/годы"]},{"code":"QR25DE","name":"2.5L бензин (selected markets)","displacement":"2488 см³","powerHp":"170 hp для отдельных североамериканских версий","torqueNm":"233 Н·м для указанной версии","valves":"16V DOHC","fuelSystem":"EFI","timingDrive":"Цепь","strengths":["Региональная версия T32"],"weaknesses":["Не все рынки имели этот двигатель"]},{"code":"R9M","name":"1.6L turbo diesel dCi (Europe)","displacement":"1598 см³","powerHp":"130 PS для европейской версии","torqueNm":"320 Н·м для указанной версии","valves":"16V DOHC turbo diesel","fuelSystem":"Common Rail","timingDrive":"Цепь","strengths":["Европейская дизельная версия"],"weaknesses":["Применимость зависит от года/рынка"]},{"code":"QR25DER","name":"2.5L бензиновый hybrid (Japan-market selected grades)","displacement":"2488 см³","powerHp":"182 PS суммарно для указанной гибридной версии","torqueNm":"Суммарный момент не унифицирован в источнике","valves":"16V DOHC","fuelSystem":"EFI, hybrid system","timingDrive":"Цепь","strengths":["Гибридная версия отличается от обычного QR25DE"],"weaknesses":["Системную мощность не приравнивать к мощности ДВС"]}],
    transmissions: ["Xtronic CVT (Japanese gasoline grades MR20DD/QR25DE)","6MT (selected European gasoline/diesel grades)","Xtronic CVT (selected R9M diesel grades; confirm by VIN)","Hybrid CVT/electric drive (selected Japan-market hybrid grades)"],
    drivetrain: 'Передний или ALL MODE 4x4-i полный привод — по комплектации. Для гибрида имеются отдельные параметры силовой установки.',
    sourceNotes: 'Японские материалы Nissan для T32 указывают бензиновый MR20DD 1997 см³, 147 PS и 207 Н·м; гибридная система с мотором RM31 имеет суммарную мощность 182 PS для конкретной версии. Размеры и масса различаются по году, 5/7-местному кузову и приводу; не переносить параметры японского рынка на все машины СНГ.',
    sourceReferences: [{"label":"Nissan Japan — X-TRAIL T32 specifications","url":"https://history.nissan.co.jp/X-TRAIL/T32/1312/spec_specification.html","scope":"Заводская таблица японского T32: MR20DD и CVT для указанного model year."},{"label":"Nissan Japan — X-TRAIL T32 performance/hybrid","url":"https://history.nissan.co.jp/X-TRAIL/T32/1312/performance_mechanism.html","scope":"Заводские характеристики MR20DD и гибридной версии для указанного японского исполнения."},{"label":"Nissan — 25 years of X-Trail","url":"https://www.nissan-global.com/EN/STORIES/RELEASES/the-x-trail-25-year-journey/","scope":"Официальная история подтверждает бензиновые и гибридные силовые установки поколения T32."}]
  }),
  makeSupplementalModel({
    id: 'nissan-xtrail-t33-crossover', brandId: 'nissan',
    name: 'X-Trail T33', generation: 'IV поколение (T33)', years: '2020–наст. время', bodyType: 'Кроссовер',
    overview: 'X-Trail T33: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: 4660, widthMm: 1840, heightMm: 1720, wheelbaseMm: 2705,
    groundClearanceMm: 200, trunkVolumeLiters: 'Зависит от 5/7-местной компоновки', fuelTankLiters: 55,
    curbWeightKg: '1740–1880 кг в зависимости от 2WD/4WD и комплектации (японская спецификация 2022 года)',
    engines: [{ code: 'KR15DDT', name: '1.5 л VC-TURBO — двигатель-генератор системы e-POWER', displacement: '1497 см³', powerHp: '144 PS при 4400–5000 об/мин для японской версии 2022 года', torqueNm: '250 Н·м при 2400–4000 об/мин для указанной версии', valves: 'DOHC, рядный 3-цилиндровый', fuelSystem: 'Nissan Di, непосредственный впрыск', timingDrive: 'По заводскому руководству конкретного двигателя', strengths: ['В e-POWER колёса приводятся электромоторами; ДВС работает как генератор'], weaknesses: ['Нельзя описывать как обычную механическую связь двигателя с колёсами; спецификации различаются по году и рынку'] }],
    transmissions: ['Электрический привод e-POWER; традиционной ступенчатой КПП нет. Двигатель KR15DDT вырабатывает электричество; e-4ORCE — электрический полный привод на соответствующих версиях.'],
    drivetrain: 'Японская линейка включает 2WD и e-4ORCE 4WD. Компоновка и параметры зависят от года и комплектации.',
    sourceNotes: 'Для японского X-Trail T33 по заводскому листу 2022 года: 4660×1840×1720 мм, база 2705 мм, дорожный просвет 200 мм для ряда 2WD/185 мм для ряда e-4ORCE, бак 55 л; KR15DDT 1497 см³, 144 PS и 250 Н·м. Это спецификация японского рынка, а не универсальная спецификация СНГ. Системная мощность тяговых электромоторов отличается от мощности двигателя-генератора.',
    sourceReferences: [
      { label: 'Nissan Japan — X-TRAIL T33, заводская таблица характеристик (2022)', url: 'https://history.nissan.co.jp/ARCHIVES/PDF/X-TRAIL/T33/20220720/x-trail_specsheet.pdf', scope: 'Размеры, база, дорожный просвет, масса, бак, двигатель-генератор и моторы для японских версий 2WD/4WD.' },
      { label: 'Nissan Technical Review — e-POWER / VC-TURBO / e-4ORCE', url: 'https://www.nissan-global.com/EN/TECHNICALREVIEW/PDF/NISSAN_TECHINICAL_REVIEW_89_En_ALL.pdf', scope: 'Заводское техническое описание архитектуры e-POWER: двигатель вырабатывает электроэнергию, тягу создают электромоторы.' },
      { label: 'Nissan — 25 лет X-TRAIL', url: 'https://www.nissan-global.com/EN/STORIES/RELEASES/the-x-trail-25-year-journey/', scope: 'История поколений и основные технологические особенности T31/T32/T33.' }
    ]
  }),
  makeSupplementalModel({
    id: 'nissan-qashqai-j10-crossover', brandId: 'nissan',
    name: 'Qashqai J10', generation: 'I поколение (J10)', years: '2006–2013', bodyType: 'Кроссовер',
    overview: 'Qashqai J10: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{ code: 'HR16DE / MR20DE / K9K', name: 'Бензиновые и дизельные семейства; рынок-зависимые версии', displacement: 'Уточнить по коду двигателя', powerHp: 'Нет подтверждённых универсальных данных', torqueNm: 'Нет подтверждённых универсальных данных', valves: 'Проверить по модификации', fuelSystem: 'Проверить по модификации', timingDrive: 'По заводскому руководству конкретного двигателя', strengths: ['Идентификация по коду двигателя обязательна'], weaknesses: ['Не использовать как спецификацию без VIN и рынка'] }],
    transmissions: ['АКПП или МКПП — только если предусмотрена конкретным рынком; код коробки проверить по VIN. Не указывать CVT без заводского подтверждения.'],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{ label: 'Nissan — официальный исторический/модельный источник', url: 'https://www.nissan-global.com/EN/HERITAGE/STORIES/', scope: 'Официальная история Nissan указывает Qashqai/Dualis J10 в линейке кроссоверов.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-qashqai-j11-crossover', brandId: 'nissan',
    name: 'Qashqai J11', generation: 'II поколение (J11)', years: '2013–2021', bodyType: 'Кроссовер',
    overview: 'Qashqai J11: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{ code: 'HRA2DDT / MR20DD / K9K', name: 'Бензиновые и дизельные семейства; рынок-зависимые версии', displacement: 'Уточнить по коду двигателя', powerHp: 'Нет подтверждённых универсальных данных', torqueNm: 'Нет подтверждённых универсальных данных', valves: 'Проверить по модификации', fuelSystem: 'Проверить по модификации', timingDrive: 'По заводскому руководству конкретного двигателя', strengths: ['Идентификация по коду двигателя обязательна'], weaknesses: ['Не использовать как спецификацию без VIN и рынка'] }],
    transmissions: ['АКПП или МКПП — только если предусмотрена конкретным рынком; код коробки проверить по VIN. Не указывать CVT без заводского подтверждения.'],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{ label: 'Nissan — официальный исторический/модельный источник', url: 'https://www.nissan-global.com/EN/HERITAGE/STORIES/', scope: 'Исторический портал Nissan; параметры зависят от модификации.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-qashqai-j12-crossover', brandId: 'nissan',
    name: 'Qashqai J12', generation: 'III поколение (J12)', years: '2021–наст. время', bodyType: 'Кроссовер',
    overview: 'Qashqai J12: агрегаты, оснащение и привод зависят от рынка, года и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null,
    groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых универсальных данных', fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных для всех комплектаций',
    engines: [{ code: 'HR13DDT / e-POWER', name: 'Бензиновые и гибридные версии — по рынку', displacement: 'Уточнить по коду двигателя', powerHp: 'Нет подтверждённых универсальных данных', torqueNm: 'Нет подтверждённых универсальных данных', valves: 'Проверить по модификации', fuelSystem: 'Проверить по модификации', timingDrive: 'По заводскому руководству конкретного двигателя', strengths: ['Идентификация по коду двигателя обязательна'], weaknesses: ['Не использовать как спецификацию без VIN и рынка'] }],
    transmissions: ['АКПП или МКПП — только если предусмотрена конкретным рынком; код коробки проверить по VIN. Не указывать CVT без заводского подтверждения.'],
    drivetrain: 'Передний или полный привод в зависимости от поколения и комплектации.',
    sourceNotes: 'Карточка поколения для навигации по каталогу. Неподтверждённые размеры, ёмкости и сервисные параметры намеренно не заполнены; перед ремонтом сверить VIN, код кузова, двигатель, трансмиссию и руководство рынка.',
    sourceReferences: [{ label: 'Nissan — официальный исторический/модельный источник', url: 'https://www.nissan-global.com/EN/IR/FINANCIAL_RESULTS/ASSETS/DATA/2024/20243rd_presentation_script_147_e.pdf', scope: 'Материалы Nissan описывают развитие e-POWER и его применение в Qashqai.' }]
  }),
  makeSupplementalModel({
    id: 'honda-crv-re-suv', brandId: 'honda', name: 'CR-V (RE)', generation: 'III поколение', years: '2006–2011', bodyType: 'Кроссовер',
    overview: 'CR-V третьего поколения; двигатели и оснащение различаются по рынку.',
    lengthMm: 4520, widthMm: 1820, heightMm: 1690, wheelbaseMm: 2620, groundClearanceMm: null,
    trunkVolumeLiters: 'Зависит от рынка и методики измерения', fuelTankLiters: null, curbWeightKg: 'Нет подтверждённого единого значения для всех версий',
    engines: [
      { code: 'R20A', name: '2.0 л i-VTEC — отдельные рынки', displacement: '1997 см³', powerHp: 'Уточнить по рынку и коду исполнения', torqueNm: 'Уточнить по рынку и коду исполнения', valves: '16V SOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённое семейство Honda'], weaknesses: ['Калибровки зависят от рынка'] },
      { code: 'K24Z', name: '2.4 л i-VTEC — отдельные рынки', displacement: '2354 см³', powerHp: 'Уточнить по коду двигателя и рынку', torqueNm: 'Уточнить по коду двигателя и рынку', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённое семейство двигателей'], weaknesses: ['Не является мотором всех версий поколения'] }
    ],
    transmissions: ['МКПП/АКПП — по рынку и коду коробки; не переносить спецификации между версиями'],
    drivetrain: 'Передний привод или Real Time 4WD — в зависимости от рынка и комплектации.',
    sourceNotes: 'Период выпуска подтверждается официальным архивом Honda. Размеры 4520×1820×1690 мм приведены как ориентир для части версий RE; бак, клиренс, масса и сервисные объёмы оставлены неподтверждёнными.',
    sourceReferences: [{ label: 'Honda — официальный архив CR-V', url: 'https://www.honda.co.jp/auto-archive/cr-v/', scope: 'Подтверждает поколения и периоды выпуска.' }, { label: 'Honda — официальный каталог CR-V 2009–2011', url: 'https://www.honda.co.jp/auto-archive/cr-v/2011/', scope: 'Заводской каталог японского рынка; применимость зависит от версии.' }]
  }),
  makeSupplementalModel({
    id: 'honda-stepwgn-rg-minivan', brandId: 'honda', name: 'Stepwgn (RG)', generation: 'III поколение', years: '2005–2009', bodyType: 'Минивэн',
    overview: 'Японский минивэн Stepwgn третьего поколения; агрегаты зависят от версии и года.',
    lengthMm: 4630, widthMm: 1695, heightMm: 1770, wheelbaseMm: 2855, groundClearanceMm: null,
    trunkVolumeLiters: 'Зависит от положения сидений', fuelTankLiters: null, curbWeightKg: 'Нет подтверждённого единого значения для всех комплектаций',
    engines: [
      { code: 'K20A', name: '2.0 л i-VTEC', displacement: '1998 см³', powerHp: 'Зависит от года и исполнения', torqueNm: 'Зависит от года и исполнения', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённый двигатель Honda'], weaknesses: ['Код K20A включает разные калибровки'] },
      { code: 'K24A', name: '2.4 л i-VTEC — отдельные исполнения', displacement: '2354 см³', powerHp: 'Уточнить по исполнению', torqueNm: 'Уточнить по исполнению', valves: '16V DOHC i-VTEC', fuelSystem: 'PGM-FI', timingDrive: 'Цепь ГРМ', strengths: ['Более высокий крутящий момент'], weaknesses: ['Не устанавливался на все комплектации'] }
    ],
    transmissions: ['АКПП — тип и код проверять по табличке и каталогу комплектации'],
    drivetrain: 'Передний или полный привод в зависимости от комплектации.',
    sourceNotes: 'Период поколения подтверждается официальным архивом Honda. Размеры — ориентир для японской версии; массу, бак, коробку и жидкости сверять с конкретной модификацией.',
    sourceReferences: [{ label: 'Honda — официальный архив Stepwgn', url: 'https://www.honda.co.jp/auto-archive/stepwgn/', scope: 'Поколения и периоды выпуска.' }, { label: 'Honda — официальный архив Stepwgn Spada', url: 'https://www.honda.co.jp/auto-archive/stepwgn/spada/', scope: 'Отдельная линейка Spada; характеристики могут отличаться.' }]
  }),

  makeSupplementalModel({
    id: 'toyota-corolla-levin-ae86', brandId: 'toyota', name: 'Corolla Levin (AE85/AE86)', generation: 'V поколение', years: '1983–1987', bodyType: 'Купе/Спорт',
    overview: 'Заднеприводное купе японского рынка. AE85 и AE86 различаются двигателями и комплектациями; не переносить характеристики одной версии на другую.',
    lengthMm: 4200, widthMm: 1625, heightMm: 1335, wheelbaseMm: 2400, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: null, curbWeightKg: '880–960 кг для отдельных заводских комплектаций',
    engines: [
      { code: '4A-GEU', name: '1.6 л DOHC — отдельные AE86', displacement: '1587 см³', powerHp: '130 л.с. gross для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисной документации', strengths: ['Заводской высокооборотный двигатель'], weaknesses: ['Возраст и свапы требуют проверки'] },
      { code: '3A-U', name: '1.5 л — отдельные AE85', displacement: '1452 см³', powerHp: '85 л.с. gross для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'OHC', fuelSystem: 'Зависит от исполнения', timingDrive: 'Уточнить по сервисной документации', strengths: ['Простая заводская версия'], weaknesses: ['Не относится к спортивной спецификации AE86'] }
    ],
    transmissions: ['5-ступенчатая МКПП; 4-ступенчатая АКПП для отдельных версий — проверить код агрегата'],
    drivetrain: 'Задний привод для японских AE85/AE86.',
    sourceNotes: 'Заводская историческая карточка Toyota для представительных японских комплектаций. Мощность AE86 указана как gross и не сопоставима напрямую с современными net-значениями.',
    sourceReferences: [{ label: 'Toyota — Corolla Levin AE85/AE86', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60003763/index.html', scope: 'Заводские данные отдельных японских версий.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-levin-ae92', brandId: 'toyota', name: 'Corolla Levin (AE91/AE92)', generation: 'VI поколение', years: '1987–1991', bodyType: 'Купе/Спорт',
    overview: 'Переднеприводное купе шестого поколения; атмосферные и компрессорные двигатели относятся к разным комплектациям.',
    lengthMm: 4245, widthMm: 1680, heightMm: 1300, wheelbaseMm: 2430, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 50, curbWeightKg: '980–1070 кг для отдельных комплектаций',
    engines: [
      { code: '4A-GE', name: '1.6 л DOHC — отдельные AE92', displacement: '1587 см³', powerHp: '120 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисному руководству', strengths: ['Атмосферная версия'], weaknesses: ['Характеристики зависят от года и рынка'] },
      { code: '4A-GZE', name: '1.6 л с нагнетателем — GT-Z', displacement: '1587 см³', powerHp: '145 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V, supercharger', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисному руководству', strengths: ['Заводская компрессорная версия'], weaknesses: ['Не переносить данные GT-Z на атмосферные версии'] }
    ],
    transmissions: ['МКПП/АКПП по комплектации; точный код проверить по табличке'],
    drivetrain: 'Передний привод.',
    sourceNotes: 'Размеры и характеристики относятся к отдельным японским версиям; кузовная ширина зависит от комплектации.',
    sourceReferences: [{ label: 'Toyota — Corolla Levin AE91/AE92', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60003784/', scope: 'Заводские данные отдельных японских комплектаций.' }, { label: 'Toyota GAZOO — Corolla Levin GT-Z E-AE92 (1989.05)', url: 'https://gazoo.com/catalog/maker/TOYOTA/COROLLA_LEVIN/198905/1002393/', scope: 'Заводской каталог подтверждает бак 50 л для указанной японской версии; модельная запись охватывает поколение, комплектацию следует сверять по кузовному коду.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-levin-ae101', brandId: 'toyota', name: 'Corolla Levin (AE100/AE101)', generation: 'VII поколение', years: '1991–1995', bodyType: 'Купе/Спорт',
    overview: 'Переднеприводное купе японского рынка с несколькими версиями двигателей 1.5 и 1.6 л.',
    lengthMm: 4275, widthMm: 1695, heightMm: 1305, wheelbaseMm: 2465, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 50, curbWeightKg: '1020–1150 кг для отдельных комплектаций',
    engines: [
      { code: '4A-GE', name: '1.6 л DOHC 20V — GT APEX', displacement: '1587 см³', powerHp: '160 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 20V', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисному руководству', strengths: ['Высокооборотная 20-клапанная версия'], weaknesses: ['Не является характеристикой всех AE101'] },
      { code: '4A-GZE', name: '1.6 л с нагнетателем — GT-Z', displacement: '1587 см³', powerHp: '170 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V, supercharger', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисному руководству', strengths: ['Заводская компрессорная версия'], weaknesses: ['Не переносить характеристики GT-Z на атмосферные исполнения'] }
    ],
    transmissions: ['МКПП/АКПП по комплектации; код требует проверки'],
    drivetrain: 'Передний привод.',
    sourceNotes: 'Заводская карточка Toyota описывает представительные японские версии AE101; мощность не универсальна для поколения.',
    sourceReferences: [{ label: 'Toyota — Corolla Levin AE100/AE101', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60003913/index.html', scope: 'Заводские характеристики отдельных японских комплектаций.' }, { label: 'Toyota GAZOO — Corolla Levin GT-Z E-AE101 (1991.06)', url: 'https://gazoo.com/catalog/maker/TOYOTA/COROLLA_LEVIN/199106/1002406/', scope: 'Заводской каталог подтверждает бак 50 л для указанной японской версии; модельная запись охватывает поколение, комплектацию следует сверять по кузовному коду.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-corolla-levin-ae111', brandId: 'toyota', name: 'Corolla Levin (AE110/AE111)', generation: 'VIII поколение', years: '1995–2000', bodyType: 'Купе/Спорт',
    overview: 'Последнее поколение Corolla Levin для японского рынка; производство завершилось в 2000 году.',
    lengthMm: 4285, widthMm: 1695, heightMm: 1305, wheelbaseMm: 2465, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 50, curbWeightKg: '950–1020 кг для отдельных комплектаций',
    engines: [
      { code: '4A-GE', name: '1.6 л DOHC 20V — BZ-G', displacement: '1587 см³', powerHp: '165 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 20V', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисному руководству', strengths: ['Заводская спортивная версия'], weaknesses: ['Не относится ко всем AE111'] },
      { code: '4A-FE', name: '1.6 л DOHC — отдельные версии', displacement: '1587 см³', powerHp: '115 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V', fuelSystem: 'EFI', timingDrive: 'Уточнить по сервисному руководству', strengths: ['Менее форсированная заводская версия'], weaknesses: ['Требуется проверка кода кузова'] }
    ],
    transmissions: ['5-ступенчатая МКПП или 4-ступенчатая АКПП для отдельных версий; проверить код'],
    drivetrain: 'Передний привод.',
    sourceNotes: 'Заводская карточка Toyota для отдельных японских AE110/AE111. Мощность зависит от конкретного двигателя и комплектации.',
    sourceReferences: [{ label: 'Toyota — Corolla Levin AE110/AE111', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60004085B/index.html', scope: 'Заводские характеристики отдельных японских комплектаций.' }, { label: 'Toyota GAZOO — Corolla Levin BZ-R GF-AE111 (1998.04)', url: 'https://gazoo.com/catalog/maker/TOYOTA/COROLLA_LEVIN/199505/1002410/', scope: 'Заводской каталог подтверждает бак 50 л для указанной японской версии; модельная запись охватывает поколение, комплектацию следует сверять по кузовному коду.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-bb-ncp30', brandId: 'toyota', name: 'bB (NCP30/NCP31/NCP35)', generation: 'I поколение', years: '2000–2005', bodyType: 'Хэтчбек',
    overview: 'Компактный высокий универсал на платформе Vitz. Двигатели 1.3 и 1.5 л, привод зависят от кода кузова и комплектации.',
    lengthMm: 3845, widthMm: 1690, heightMm: 1640, wheelbaseMm: 2500, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: null, curbWeightKg: '1030–1040 кг для отдельных японских версий 2WD',
    engines: [
      { code: '2NZ-FE', name: '1.3 л бензин', displacement: '1298 см³', powerHp: '88 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Компактный атмосферный двигатель'], weaknesses: ['Проверить кузовной код'] },
      { code: '1NZ-FE', name: '1.5 л бензин', displacement: '1496 см³', powerHp: '110 л.с. для представительной версии', torqueNm: 'Нет подтверждённых данных', valves: 'DOHC 16V', fuelSystem: 'EFI', timingDrive: 'Цепь ГРМ', strengths: ['Распространённое семейство Toyota'], weaknesses: ['Мощность и привод зависят от версии'] }
    ],
    transmissions: ['4-ступенчатая АКПП для представительных японских версий; проверить код коробки'],
    drivetrain: 'Передний привод или full-time 4WD в зависимости от кузовного кода.',
    sourceNotes: 'Официальная история Toyota приводит данные для отдельных NCP30/NCP31. Бак и клиренс здесь не подтверждены; параметры не универсальны для всех версий.',
    sourceReferences: [{ label: 'Toyota — bB первого поколения', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60012257/index.html', scope: 'Заводские характеристики представительных японских NCP30/NCP31.' }, { label: 'Toyota — каталог bB', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-bB/', scope: 'Заводские комплектации и различия по кузовному коду.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-bb-qnc20', brandId: 'toyota', name: 'bB (QNC20/QNC21/QNC25)', generation: 'II поколение', years: '2005–2016', bodyType: 'Хэтчбек',
    overview: 'Второе поколение bB японского рынка. Двигатели, привод и трансмиссии зависят от комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: null, curbWeightKg: 'Нет подтверждённых данных',
    engines: [{ code: 'Нет подтверждённых данных', name: 'Двигатель не установлен по точной комплектации', displacement: 'Нет подтверждённых данных', powerHp: 'Нет подтверждённых данных', torqueNm: 'Нет подтверждённых данных', valves: 'Нет подтверждённых данных', fuelSystem: 'Нет подтверждённых данных', timingDrive: 'Нет подтверждённых данных', strengths: ['Не указывать без идентификации версии'], weaknesses: ['Требуется код кузова и заводская комплектация'] }], transmissions: ['Нет подтверждённых данных для всего поколения; сверить по коду кузова'],
    drivetrain: 'Зависит от кузовного кода и комплектации.',
    sourceNotes: 'Карточка поколения добавлена для навигации. Технические параметры оставлены незаполненными до проверки по конкретной заводской комплектации.',
    sourceReferences: [{ label: 'Toyota — официальный каталог bB', url: 'https://toyota.jp/ucar/catalog/brand-TOYOTA/car-bB/', scope: 'Поиск заводских японских комплектаций.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-cube-z10', brandId: 'nissan', name: 'Cube (Z10)', generation: 'I поколение', years: '1998–2002', bodyType: 'Минивэн',
    overview: 'Первое поколение Nissan Cube, компактный высокий кузов японского рынка. Двигатель и трансмиссию нужно уточнять по табличке.',
    lengthMm: 3750, widthMm: 1610, heightMm: 1625, wheelbaseMm: 2360, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 42, curbWeightKg: 'Зависит от комплектации',
    engines: [{ code: 'CG13DE', name: '1.3 л бензин — отдельные версии Z10', displacement: '1274 см³', powerHp: '82 л.с. для представительной версии', torqueNm: '106 Н·м для представительной версии', valves: 'DOHC 16V', fuelSystem: 'Nissan ECCS/EGI', timingDrive: 'Уточнить по сервисной документации', strengths: ['Компактный атмосферный двигатель'], weaknesses: ['Не все Z10 имеют одинаковые агрегаты'] }],
    transmissions: ['4-ступенчатая АКПП; вариатор встречается в отдельных версиях — проверить код коробки'],
    drivetrain: 'Передний привод для указанной заводской версии; другие варианты требуют проверки.',
    sourceNotes: 'Размеры и двигатель относятся к отдельным опубликованным спецификациям Z10, не ко всем комплектациям поколения. Объём бака 42 л подтверждён японскими карточками Z10 в каталоге GAZOO.',
    sourceReferences: [{ label: 'Nissan — официальный релиз Cube 1998', url: 'https://global.nissannews.com/en/releases/19980220-02-e', scope: 'Подтверждает запуск модели.' }, { label: 'Nissan — официальный FAQ Cube Z10', url: 'https://faq2.nissan.co.jp/faq/show/1127?category_id=66&site_domain=default', scope: 'Модельная страница Nissan по периоду Z10.' }, { label: 'Toyota GAZOO — Nissan Cube Z10 Yellow Version (1998)', url: 'https://gazoo.com/catalog/maker/NISSAN/CUBE/199802/1505935/', scope: 'Карточка японского Z10 с двигателем CG13DE подтверждает бак 42 л.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-cube-z11', brandId: 'nissan', name: 'Cube (Z11)', generation: 'II поколение', years: '2002–2008', bodyType: 'Минивэн',
    overview: 'Второе поколение Nissan Cube. Двигатель, трансмиссия и привод менялись по годам; сверять по кузовному коду и рынку.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 41, curbWeightKg: 'Нет подтверждённых данных',
    engines: [{ code: 'Нет подтверждённых данных', name: 'Двигатель не установлен по точной комплектации', displacement: 'Нет подтверждённых данных', powerHp: 'Нет подтверждённых данных', torqueNm: 'Нет подтверждённых данных', valves: 'Нет подтверждённых данных', fuelSystem: 'Нет подтверждённых данных', timingDrive: 'Нет подтверждённых данных', strengths: ['Не указывать без идентификации версии'], weaknesses: ['Требуется код кузова и заводская комплектация'] }], transmissions: ['Нет подтверждённых данных для единого описания поколения; проверить код агрегата'],
    drivetrain: 'Зависит от комплектации и кода кузова.',
    sourceNotes: 'Карточка поколения добавлена для навигации. Бак 41 л подтверждён японскими карточками Cube Z11; размеры, двигатель, коробка, жидкости и OBD-особенности не заполнены без первичного источника для конкретной версии.',
    sourceReferences: [{ label: 'Nissan service materials — перечень поколений Cube', url: 'https://faines.jaspa.or.jp/enduser/system/files/static/menu/touroku/ma_list1/nissan_list.html', scope: 'Перечень заводских сервисных материалов по Z10/Z11.' }, { label: 'Toyota GAZOO — Nissan Cube Z11 EX (2004)', url: 'https://gazoo.com/catalog/maker/NISSAN/CUBE/200210/10017904/', scope: 'Карточка японского Z11 подтверждает бак 41 л; отдельные характеристики зависят от комплектации.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-cube-z12', brandId: 'nissan', name: 'Cube (Z12)', generation: 'III поколение', years: '2008–2020', bodyType: 'Минивэн',
    overview: 'Третье поколение Nissan Cube. Спецификации менялись по году и комплектации.',
    lengthMm: null, widthMm: null, heightMm: null, wheelbaseMm: null, groundClearanceMm: null, trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 45, curbWeightKg: 'Нет подтверждённых данных',
    engines: [{ code: 'Нет подтверждённых данных', name: 'Двигатель не установлен по точной комплектации', displacement: 'Нет подтверждённых данных', powerHp: 'Нет подтверждённых данных', torqueNm: 'Нет подтверждённых данных', valves: 'Нет подтверждённых данных', fuelSystem: 'Нет подтверждённых данных', timingDrive: 'Нет подтверждённых данных', strengths: ['Не указывать без идентификации версии'], weaknesses: ['Требуется код кузова и заводская комплектация'] }], transmissions: ['Нет подтверждённых данных для единого описания поколения; сверить по кузовному коду'],
    drivetrain: 'Зависит от комплектации и рынка.',
    sourceNotes: 'Топливный бак 45 л подтверждён Nissan для японского Z12; остальные технические поля оставлены незаполненными до выбора комплектации.',
    sourceReferences: [{ label: 'Nissan — официальный архив Z12', url: 'https://history.nissan.co.jp/CUBE/Z12/0811/spec_specification.html', scope: 'Заводские спецификации японского рынка.' }, { label: 'Nissan — FAQ о топливе и баке Cube Z12', url: 'https://faq2.nissan.co.jp/faq/show/7399?category_id=645&site_domain=default', scope: 'Официально подтверждает бак около 45 л для Z12.' }]
  }),
  makeSupplementalModel({
    id: 'mazda-premacy-cp-fpde-japan',
    brandId: 'mazda',
    name: 'Premacy (CP, FP-DE 2WD)',
    generation: 'I поколение (CP), японская спецификация',
    years: '1999–2005',
    bodyType: 'Минивэн',
    overview: 'Первое поколение Mazda Premacy для японского рынка. Эта запись ограничена реперной версией 2WD с двигателем FP-DE 1.8 и 4-ступенчатой АКПП из пресс-релиза Mazda 1999 года; отдельные комплектации и 4WD могут отличаться.',
    lengthMm: 4295,
    widthMm: 1695,
    heightMm: 1570,
    wheelbaseMm: 2670,
    groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных',
    fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных',
    engines: [{
      code: 'FP-DE',
      name: '1.8 л бензиновый DOHC',
      displacement: '1839 см³',
      powerHp: '135 PS при 6200 об/мин для японской спецификации 1999 года',
      torqueNm: 'Около 162 Н·м при 4500 об/мин (пересчёт заводских 16,5 кгс·м)',
      valves: 'DOHC, 16 клапанов',
      fuelSystem: 'Нет подтверждённых данных в использованном пресс-релизе',
      timingDrive: 'Нет подтверждённых данных в использованном пресс-релизе',
      strengths: ['Двигатель и мощность привязаны к официальному релизу Mazda Japan 1999 года'],
      weaknesses: ['Не переносить характеристики на другие рынки и годы без проверки кода двигателя']
    }],
    transmissions: ['4-ступенчатая электронно-управляемая АКПП для японской версии 1999 года'],
    drivetrain: 'Передний привод для указанной размерной спецификации; японские версии также выпускались с full-time 4WD.',
    sourceNotes: 'Размеры указаны Mazda для 2WD: 4295×1695×1570 мм, колёсная база 2670 мм. Для 4WD в том же релизе длина 4320 мм и высота 1590 мм без рейлингов. Двигатель FP-DE 1839 см³, 135 PS/6200 об/мин и 16,5 кгс·м/4500 об/мин; 4-ступенчатая АКПП. Клиренс, бак и масса не заполнены: использованный первичный источник не подтверждает их.',
    sourceReferences: [{
      label: 'Mazda Japan — запуск Premacy, 26.04.1999',
      url: 'https://newsroom.mazda.com/en/publicity/release/1999/9904/990426e.html',
      scope: 'Заводской релиз: размеры 2WD/4WD, двигатель FP-DE, мощность, момент, АКПП и варианты привода.'
    }]
  }),
  makeSupplementalModel({
    id: 'mazda-mpv-lw-japan',
    brandId: 'mazda',
    name: 'MPV (LW, японская спецификация)',
    generation: 'II поколение (LW)',
    years: '1999–2006',
    bodyType: 'Минивэн',
    overview: 'Второе поколение Mazda MPV (LW), представленное в Японии в 1999 году. Двигатель, трансмиссию, размеры и жидкости необходимо уточнять по конкретному коду кузова и году выпуска.',
    lengthMm: null,
    widthMm: null,
    heightMm: null,
    wheelbaseMm: null,
    groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных',
    fuelTankLiters: null,
    curbWeightKg: 'Нет подтверждённых данных',
    engines: [{
      code: 'Нет подтверждённых данных',
      name: 'Двигатель не установлен по точной комплектации',
      displacement: 'Нет подтверждённых данных',
      powerHp: 'Нет подтверждённых данных',
      torqueNm: 'Нет подтверждённых данных',
      valves: 'Нет подтверждённых данных',
      fuelSystem: 'Нет подтверждённых данных',
      timingDrive: 'Нет подтверждённых данных',
      strengths: ['Не переносить характеристики между рынками и годами'],
      weaknesses: ['Требуется точный код кузова и двигатель']
    }],
    transmissions: ['Нет подтверждённых данных для единой спецификации LW'],
    drivetrain: 'Передний или полный привод в зависимости от комплектации.',
    sourceNotes: 'Навигационная карточка поколения, не подтверждает параметры конкретного автомобиля. Технические значения оставлены незаполненными до проверки заводского руководства для соответствующего года и кузовного кода.',
    sourceReferences: [{
      label: 'Mazda Japan — официальный архив руководств MPV',
      url: 'https://www.mazda.co.jp/owner_support/manual/mpv/',
      scope: 'Официальная точка входа к руководствам MPV; выбрать год и номер кузова для точных характеристик.'
    }]
  }),
  makeSupplementalModel({
    id: 'mazda3-bp-fastback', brandId: 'mazda', name: 'Mazda3 (BP, Fastback)',
    generation: 'IV поколение, японская спецификация', years: '2019–н.в.', bodyType: 'Хэтчбек',
    overview: 'Пятидверный Mazda3 Fastback поколения BP. Двигатели и трансмиссии различаются по году и рынку; сверять точную комплектацию по VIN.',
    lengthMm: 4460, widthMm: 1795, heightMm: 1440, wheelbaseMm: 2725, groundClearanceMm: 135,
    trunkVolumeLiters: 'Нет подтверждённых данных для всех рынков и комплектаций', fuelTankLiters: 51, curbWeightKg: 'Зависит от двигателя, привода и комплектации',
    engines: [
      { code: 'P5-VPS', name: 'SKYACTIV-G 1.5, отдельные версии', displacement: '1496 см³', powerHp: 'Зависит от года и рынка', torqueNm: 'Зависит от года и рынка', valves: '16V DOHC', fuelSystem: 'Непосредственный впрыск SKYACTIV-G', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферный бензиновый двигатель в соответствующих версиях'], weaknesses: ['Параметры зависят от рынка и года'] },
      { code: 'PE-VPS', name: 'SKYACTIV-G 2.0, отдельные версии', displacement: '1997 см³', powerHp: 'Зависит от года и рынка', torqueNm: 'Зависит от года и рынка', valves: '16V DOHC', fuelSystem: 'Непосредственный впрыск SKYACTIV-G', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферная бензиновая версия'], weaknesses: ['Не переносить спецификацию между рынками'] }
    ],
    transmissions: ['6-ступенчатая АКПП SKYACTIV-DRIVE — по версии', '6-ступенчатая МКПП — по версии'],
    drivetrain: 'Передний привод; AWD доступен на отдельных японских версиях.',
    sourceNotes: 'Габариты приведены для японской Mazda3 Fastback. Масса, бак, клиренс и силовая установка требуют проверки по конкретной комплектации; справочная запись не подтверждает совместимость деталей.',
    sourceReferences: [
      { label: 'Mazda Japan — MAZDA3 Fastback', url: 'https://www.mazda.co.jp/cars/passenger/mazda3/', scope: 'Официальная страница модели: габариты и доступные типы силовых установок японской линейки.' },
      { label: 'Mazda Japan — заводская таблица MAZDA3 2022', url: 'https://www.mazda.co.jp/globalassets/assets/cars/mazda3/common/pdf/mazda3_specification_202202.pdf', scope: 'Заводские данные для конкретных комплектаций поколения BP.' }
    ]
  }),
  makeSupplementalModel({
    id: 'mazda-mpv-ly3p-23c-2wd',
    brandId: 'mazda',
    name: 'MPV (LY3P, 23C 2WD)',
    generation: 'III поколение (LY), японская спецификация',
    years: '2006–2016',
    bodyType: 'Минивэн',
    overview: 'Трёхрядный минивэн японского рынка. Запись содержит заводскую реперную спецификацию MPV 23C с передним приводом на старте поколения в 2006 году; параметры не переносить на 4WD, 23T turbo или поздние комплектации без сверки.',
    lengthMm: 4860,
    widthMm: 1850,
    heightMm: 1685,
    wheelbaseMm: 2950,
    groundClearanceMm: 155,
    trunkVolumeLiters: 'Нет подтверждённых данных для единой конфигурации сидений',
    fuelTankLiters: 68,
    curbWeightKg: '1720 кг для японской версии 23C 2WD (2006)',
    engines: [
      {
        code: 'L3-VE',
        name: '2.3 л бензиновый атмосферный',
        displacement: '2260 см³',
        powerHp: '163 PS при 6500 об/мин для японской версии 23C 2WD (2006)',
        torqueNm: '210 Н·м при 4000 об/мин для японской версии 23C 2WD (2006)',
        valves: 'DOHC, 16 клапанов',
        fuelSystem: 'EGI, электронный впрыск',
        timingDrive: 'Нет подтверждённых данных в использованном заводском источнике',
        strengths: ['Параметры привязаны к заводской японской версии 23C 2WD'],
        weaknesses: ['Не переносить на L3-VDT turbo и версии 4WD']
      }
    ],
    transmissions: ['4-ступенчатая АКПП для японской версии 23C 2WD (2006)'],
    drivetrain: 'Передний привод (FF) для указанной реперной комплектации; 4WD имеет другие параметры.',
    sourceNotes: 'Реперная спецификация из релиза Mazda Japan от февраля 2006 года: MPV 23C FF, 4860×1850×1685 мм, база 2950 мм, клиренс 155 мм, масса 1720 кг, L3-VE 2260 см³, 163 PS/210 Н·м. Официальное руководство Mazda указывает бак 68 л для 2WD и 76 л для 4WD. Это не универсальная спецификация всего поколения LY: размеры, масса, бак, двигатель и коробка зависят от комплектации и года. Сверять VIN/код модели.',
    sourceReferences: [
      {
        label: 'Mazda Japan — пресс-релиз о новом MPV (2006)',
        url: 'https://newsroom.mazda.com/ja/publicity/release/2006/200602/060202.html',
        scope: 'Заводская таблица основных характеристик японского MPV 2006: габариты, база, клиренс, масса, L3-VE/L3-VDT, мощность и момент.'
      },
      {
        label: 'Mazda — официальное руководство MPV, сервисные данные',
        url: 'https://www2.mazda.co.jp/service/ownersmanual/mpv/lsi/70214.html',
        scope: 'Официально подтверждает топливо и ёмкость бака: 68 л для 2WD, 76 л для 4WD.'
      },
      {
        label: 'Mazda — официальное руководство MPV, заправка',
        url: 'https://www2.mazda.co.jp/service/ownersmanual/mpv/lsi/30111.html',
        scope: 'Указывает применимость топлива L3-VE/L3-VDT и различие ёмкости бака по приводу.'
      }
    ]
  }),
  makeSupplementalModel({
    id: 'mazda3-bp-sedan', brandId: 'mazda', name: 'Mazda3 (BP, Sedan)',
    generation: 'IV поколение, японская спецификация', years: '2019–н.в.', bodyType: 'Седан',
    overview: 'Четырёхдверный седан Mazda3 поколения BP. Кузовные детали и размеры не следует объединять с Fastback.',
    lengthMm: 4660, widthMm: 1795, heightMm: 1445, wheelbaseMm: 2725, groundClearanceMm: 135,
    trunkVolumeLiters: 'Нет подтверждённых данных для всех рынков и комплектаций', fuelTankLiters: 51, curbWeightKg: 'Зависит от двигателя и комплектации',
    engines: [
      { code: 'PE-VPS', name: 'SKYACTIV-G 2.0, отдельные версии', displacement: '1997 см³', powerHp: 'Зависит от года и рынка', torqueNm: 'Зависит от года и рынка', valves: '16V DOHC', fuelSystem: 'Непосредственный впрыск SKYACTIV-G', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферная бензиновая версия'], weaknesses: ['Мощность отличается между рынками'] },
      { code: 'PY-VPS', name: 'SKYACTIV-G 2.5, отдельные версии', displacement: '2488 см³', powerHp: 'Зависит от года и рынка', torqueNm: 'Зависит от года и рынка', valves: '16V DOHC', fuelSystem: 'Непосредственный впрыск SKYACTIV-G', timingDrive: 'Цепь ГРМ', strengths: ['Доступен на отдельных рынках'], weaknesses: ['Не является универсальным двигателем Mazda3'] }
    ],
    transmissions: ['6-ступенчатая АКПП SKYACTIV-DRIVE — по версии', 'МКПП — по версии и рынку'],
    drivetrain: 'Передний привод для указанной японской спецификации; уточнять по коду модели.',
    sourceNotes: 'Габариты относятся к японской Mazda3 Sedan. Не переносить их на Fastback или экспортные автомобили без проверки.',
    sourceReferences: [
      { label: 'Mazda Japan — MAZDA3 Sedan', url: 'https://www.mazda.co.jp/cars/passenger/mazda3-sedan/', scope: 'Официальные габариты седана и варианты силовых установок японского рынка.' },
      { label: 'Mazda Japan — заводская таблица MAZDA3 2022', url: 'https://www.mazda.co.jp/globalassets/assets/cars/mazda3/common/pdf/mazda3_specification_202202.pdf', scope: 'Заводская таблица спецификаций поколения BP для конкретных комплектаций.' }
    ]
  }),
  makeSupplementalModel({
    id: 'suzuki-swift-zc-zd-2023', brandId: 'suzuki', name: 'Swift (ZC/ZD, 2023–)',
    generation: 'VI поколение, японская спецификация', years: '2023–н.в.', bodyType: 'Хэтчбек',
    overview: 'Компактный пятидверный Swift нового поколения. Передний/полный привод и коробка зависят от комплектации.',
    lengthMm: 3860, widthMm: 1695, heightMm: 1500, wheelbaseMm: 2450, groundClearanceMm: 120,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 37, curbWeightKg: '910–1020 кг по японским комплектациям',
    engines: [{ code: 'Z12E', name: '1.2 л, 3 цилиндра, VVT', displacement: '1197 см³', powerHp: '82 PS для японской спецификации', torqueNm: '108 Н·м для японской спецификации', valves: 'DOHC, 12 клапанов, VVT', fuelSystem: 'EPI, электронный впрыск', timingDrive: 'Нет подтверждённых данных в используемой спецификации', strengths: ['Параметры подтверждены для японской версии Z12E'], weaknesses: ['Не переносить на предыдущие поколения и экспортные моторы'] }],
    transmissions: ['CVT — по комплектации', '5-ступенчатая МКПП — отдельные комплектации'],
    drivetrain: '2WD (передний привод) или full-time 4WD — по японской комплектации.',
    sourceNotes: 'Габариты, двигатель, бак и диапазон массы взяты из официальной японской спецификации Swift 2023 года. Для иных рынков сверить VIN и код модели.',
    sourceReferences: [
      { label: 'Suzuki Digital Library — Swift (2023)', url: 'https://www.suzuki.co.jp/suzuki_digital_library/1_auto/swift.html', scope: 'Официальные размеры, масса, двигатель Z12E, мощность, момент, коробки и бак.' },
      { label: 'Suzuki Japan — Swift комплектации', url: 'https://www.suzuki.co.jp/car/swift/detail/', scope: 'Коды моделей и различия 2WD/4WD и CVT/MT.' }
    ]
  }),
  makeSupplementalModel({
    id: 'suzuki-jimny-sierra-jb74', brandId: 'suzuki', name: 'Jimny Sierra (JB74)',
    generation: 'IV поколение, широкая версия', years: '2018–н.в.', bodyType: 'Внедорожник',
    overview: 'Компактный рамный внедорожник с жёсткими мостами и подключаемым полным приводом с понижающей передачей. Отличается от kei Jimny широкой колеёй и двигателем 1.5 л.',
    lengthMm: 3550, widthMm: 1645, heightMm: 1730, wheelbaseMm: 2250, groundClearanceMm: 210,
    trunkVolumeLiters: 'Нет подтверждённых данных для единой методики измерения', fuelTankLiters: 40, curbWeightKg: '1100–1110 кг для японских версий 5MT/4AT',
    engines: [{ code: 'K15B', name: '1.5 л бензиновый, рядный 4-цилиндровый', displacement: '1460 см³', powerHp: '101 PS для японской JB74', torqueNm: '130 Н·м для японской JB74', valves: '16V DOHC', fuelSystem: 'Электронный впрыск', timingDrive: 'Цепь ГРМ', strengths: ['Атмосферный двигатель и классическая внедорожная конструкция'], weaknesses: ['Экспортные настройки могут отличаться'] }],
    transmissions: ['5-ступенчатая МКПП', '4-ступенчатая АКПП'],
    drivetrain: 'Part-Time 4WD: подключаемый передний мост и понижающая передача; режим 4H/4L использовать согласно руководству.',
    sourceNotes: 'Японская спецификация JB74: 3550×1645×1730 мм, база 2250 мм, клиренс 210 мм, K15B 1460 см³, 101 PS/130 Н·м. Экспортные версии сверять по VIN.',
    sourceReferences: [
      { label: 'Suzuki Japan — история Jimny Sierra JB74', url: 'https://www.suzuki.co.jp/car/jimny/special/history/jb74.html', scope: 'Официальные характеристики JB74: двигатель, мощность, момент, размеры, масса и трансмиссии.' },
      { label: 'Suzuki Japan — заводской PDF Jimny Sierra', url: 'https://www.suzuki.co.jp/car/jimny_sierra/asset/pdf/detail/detail.pdf', scope: 'Заводские размеры и оборудование текущей японской модели.' }
    ]
  }),
  makeSupplementalModel({
    id: 'suzuki-sx4-ya11s-hatchback',
    brandId: 'suzuki',
    name: 'SX4 (YA11S/YA41S)',
    generation: 'I поколение, японская спецификация',
    years: '2006–2014',
    bodyType: 'Кроссовер',
    overview: 'Пятидверный SX4 первого поколения для японского рынка. Ниже приведена реперная спецификация SX4 1.5E с передним приводом; размеры, масса, двигатель и бак отличаются у 4WD и версий с двигателем 2.0.',
    lengthMm: 4115,
    widthMm: 1730,
    heightMm: 1585,
    wheelbaseMm: 2500,
    groundClearanceMm: 175,
    trunkVolumeLiters: 'Нет подтверждённых данных для указанной комплектации',
    fuelTankLiters: 50,
    curbWeightKg: '1180 кг для японской версии 1.5E 2WD',
    engines: [
      {
        code: 'M15A',
        name: '1.5 л бензин DOHC VVT',
        displacement: '1490 см³',
        powerHp: '110 PS при 6000 об/мин для японской версии',
        torqueNm: '143 Н·м при 4000 об/мин для японской версии',
        valves: 'DOHC, 16 клапанов, VVT',
        fuelSystem: 'EPI, электронный впрыск',
        timingDrive: 'Нет подтверждённых данных в использованной заводской спецификации',
        strengths: ['Заводские параметры привязаны к японской версии SX4 1.5E 2WD'],
        weaknesses: ['Не переносить характеристики на 4WD и двигатель J20A']
      }
    ],
    transmissions: ['4-ступенчатая АКПП для реперной японской спецификации'],
    drivetrain: 'Передний привод для указанной реперной версии; на семействе доступны варианты 4WD с системой i-AWD.',
    sourceNotes: 'Реперные данные из официального заводского PDF Suzuki Japan для SX4 1.5E 2WD (DBA-YA11S), выпуск с июля 2006 года: 4115×1730×1585 мм, база 2500 мм, клиренс 175 мм, масса 1180 кг, двигатель M15A 1490 см³, 110 PS/143 Н·м, бак 50 л. Для SX4 4WD и 2.0 параметры отличаются; перед ремонтом сверить код модели и VIN.',
    sourceReferences: [
      {
        label: 'Suzuki Digital Library — SX4, заводская таблица характеристик (2006)',
        url: 'https://www.suzuki.co.jp/suzuki_digital_library/pdf/1_auto/sx4/182.pdf',
        scope: 'Официальная таблица Suzuki Japan: кузов, коды YA11S/YB11S/YA41S/YB41S, размеры, клиренс, масса, двигатель M15A/J20A, выходные параметры, бак и трансмиссия.'
      },
      {
        label: 'Suzuki Digital Library — SX4',
        url: 'https://www.suzuki.co.jp/suzuki_digital_library/1_auto/sx4.html',
        scope: 'Официальная история модели и разделение SX4 hatchback 2006 и SX4 Sedan 2007.'
      }
    ]
  }),
  makeSupplementalModel({
    id: 'mazda3-bk-sedan-ru-16-at-2006',
    brandId: 'mazda',
    name: 'Mazda3 BK Sedan 1.6 AT Base (Россия)',
    generation: 'I поколение BK, рестайлинг, российская спецификация',
    years: '2006–2009',
    bodyType: 'Седан',
    overview: 'Отдельная запись для российского Mazda3 BK Sedan 1.6 AT Base: двигатель Z6 1.6, четырёхступенчатая АКПП и передний привод. Не смешивать с хэтчбеком, двигателем LF 2.0 и поколением BL.',
    lengthMm: 4490,
    widthMm: 1755,
    heightMm: 1465,
    wheelbaseMm: 2640,
    groundClearanceMm: 160,
    trunkVolumeLiters: '413 л (по вторичному каталогу; требуется сверка)',
    fuelTankLiters: 55,
    curbWeightKg: '1275 кг (по вторичному каталогу)',
    engines: [{
      code: 'Z6',
      name: '1.6 л MZR бензин DOHC',
      displacement: '1598 см³',
      powerHp: '105 л.с. при 6000 об/мин',
      torqueNm: '145 Н·м при 4000 об/мин',
      valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов',
      fuelSystem: 'Электронный распределённый впрыск',
      timingDrive: 'Цепь ГРМ',
      strengths: ['Параметры двигателя указаны для бензинового Z6 1.6; точную калибровку сверять по VIN'],
      weaknesses: ['Не переносить на LF 2.0, дизельные двигатели или Mazda3 поколения BL']
    }],
    transmissions: ['4-ступенчатая АКПП для российской комплектации 1.6 AT; код коробки сверить по VIN'],
    drivetrain: 'Передний привод (FF) для указанной комплектации.',
    sourceNotes: 'Отдельная запись для Mazda3 BK рестайлинг Sedan 1.6 AT Base российского рынка, ориентировочный период 08.2006–03.2009. Drom указывает двигатель Z6 1598 см³, 105 л.с., передний привод, 4-ступенчатую АКПП, габариты 4490×1755×1465 мм, базу 2640 мм, клиренс 160 мм, массу 1275 кг, багажник 413 л и шины 195/65 R15. Техническое руководство Mazda3 FL подтверждает общие параметры двигателя Z6 (1598 см³, 105 PS, 145 Н·м) и типы трансмиссий для семейства, но не подтверждает все детали российской комплектации. Запись оставлена unverified; перед ремонтом проверить VIN, табличку автомобиля и руководство для рынка поставки. Объём бака и применимость отдельных параметров требуют дополнительной проверки.',
    sourceReferences: [
      {
        label: 'Drom — Mazda3 1.6 AT Base, седан BK, Россия (2006–2009)',
        url: 'https://www.drom.ru/catalog/mazda/mazda3/2008/',
        scope: 'Вторичный каталог разделяет российские комплектации BK Sedan 1.6 AT Base/Touring/Flash Edition и указывает двигатель Z6, 105 л.с., передний привод и годы выпуска; проверить точную карточку по VIN.'
      },
      {
        label: 'Drom — Mazda3 1.6 MT Base, седан BK (2006–2009)',
        url: 'https://www.drom.ru/catalog/mazda/mazda3/92387/',
        scope: 'Вторичная карточка родственной седанной комплектации подтверждает кузов BK, 1598 см³, 105 л.с., габариты 4490×1755×1465 мм, базу 2640 мм, клиренс 160 мм, массу 1275 кг, багажник 413 л и размер шин 195/65 R15; не используется для подтверждения кода АКПП.'
      },
      {
        label: 'Mazda3 FL — руководство по технической подготовке (двигатель Z6)',
        url: 'https://pliki.elektroda.pl/1059664,mazda3_fl_english.html',
        scope: 'Технические данные семейства Z6: 1598 см³, 77 кВт/105 PS при 6000 об/мин, 145 Н·м при 4000 об/мин; перечислены 5MT и 4AT для 1.6. Документ не подтверждает российскую комплектацию целиком.'
      }
    ]
  }),

  makeSupplementalModel({
    id: 'suzuki-swift-zc72s-ru-12-at-2wd-2013',
    brandId: 'suzuki',
    name: 'Swift ZC72S 1.2 AT 2WD (Россия)',
    generation: 'IV поколение AZG, рестайлинг',
    years: '2013–2015',
    bodyType: 'Хэтчбек',
    overview: 'Пятидверный Swift для российского рынка: бензиновый K12B 1.2, 4-ступенчатая АКПП и передний привод. Не смешивать с японскими ZC72S CVT и полноприводным ZD72S.',
    lengthMm: 3850,
    widthMm: 1695,
    heightMm: 1510,
    wheelbaseMm: 2430,
    groundClearanceMm: 140,
    trunkVolumeLiters: '211 л (до 874 л при сложенных задних сиденьях; по вторичному каталогу)',
    fuelTankLiters: 42,
    curbWeightKg: '990 кг (по вторичному каталогу)',
    engines: [{
      code: 'K12B',
      name: '1.2 л бензин, Dual VVT',
      displacement: '1242 см³',
      powerHp: '94 л.с. при 6000 об/мин для российской версии',
      torqueNm: '118 Н·м при 4800 об/мин',
      valves: 'Рядный 4-цилиндровый DOHC, 16 клапанов',
      fuelSystem: 'Распределённый электронный впрыск',
      timingDrive: 'Цепь ГРМ; для сервисных работ сверить по документации двигателя',
      strengths: ['Параметры ограничены российской версией ZC72S 2WD AT 5dr GL'],
      weaknesses: ['Не переносить данные на ZD72S 4WD, японские CVT-версии или Swift Sport']
    }],
    transmissions: ['4-ступенчатая автоматическая коробка передач'],
    drivetrain: 'Передний привод (2WD/FF).',
    sourceNotes: 'Отдельная запись для Suzuki Swift ZC72S 1.2 2WD AT 5dr GL российского рынка, 10.2013–05.2015. Вторичный каталог Drom указывает K12B 1242 см³, 94 л.с./118 Н·м, 4AT, FF, размеры 3850×1695×1510 мм, базу 2430 мм, клиренс 140 мм, массу 990 кг, бак 42 л и шины 175/65R15. Дилерский материал Suzuki Moscow 2014 подтверждает 1.2 л, 94 л.с., 118 Н·м, 4AT, передний привод и основные габариты; заводская Suzuki Digital Library подтверждает семейство K12B и кузов ZC72S для японской версии, но не используется как доказательство российской калибровки. Запись остаётся unverified: перед ремонтным применением сверять VIN, табличку и руководство именно российского автомобиля; сервисные жидкости, лампы, коды и регламент не подтверждены.',
    sourceReferences: [
      { label: 'Suzuki Moscow — дилерский материал о Swift (2014)', url: 'https://www.moscow-suzuki.ru/bitrix/templates/suzuki/media/vehicle/2014_2.pdf', scope: 'Дилерский материал указывает 1.2 л, 94 л.с. при 6000 об/мин, 118 Н·м при 4800 об/мин, 4-ступенчатый автомат, передний привод и габариты 3850×1695×1510 мм; не подтверждает все данные комплектации.' },
      { label: 'Drom — Suzuki Swift 1.2 2WD AT 5dr GL, Россия (2013–2015)', url: 'https://www.drom.ru/catalog/suzuki/swift/73395/', scope: 'Вторичный каталог для точной российской комплектации ZC72S: код двигателя, мощность/момент, 4AT, привод, габариты, масса, клиренс, бак и размер шин. Значения требуют проверки по первичному документу/VIN.' },
      { label: 'Suzuki Digital Library — Swift 2010, кузов ZC72S', url: 'https://www.suzuki.co.jp/suzuki_digital_library/1_auto/swift.html', scope: 'Заводские данные для японской ZC72S: двигатель K12B, 1242 см³, 67 кВт/91 PS, габариты и колёсная база. Не подтверждает мощность и комплектацию российского автомобиля.' }
    ]
  }),
  makeSupplementalModel({
    id: 'toyota-mark-ii-x100-tourer-v', brandId: 'toyota', name: 'Mark II (X100, Tourer V)', generation: 'VIII поколение, X100', years: '1996–2000', bodyType: 'Седан',
    overview: 'Легендарный заднеприводный четырёхдверный Tourer V. Приведены характеристики японской версии E-JZX100 из каталога Toyota; параметры не следует автоматически переносить на другие комплектации Mark II X100.',
    lengthMm: 4760, widthMm: 1755, heightMm: 1400, wheelbaseMm: 2730, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1480 кг для японской версии Tourer V',
    engines: [{ code: '1JZ-GTE', name: '2.5 л турбо, рядный 6-цилиндровый DOHC 24V', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '377.6 Н·м при 2400 об/мин', valves: '24V DOHC Turbo', fuelSystem: 'EFI, электронный впрыск', timingDrive: 'Нет подтверждённых данных в использованной карточке', strengths: ['Задний привод и продольный рядный шестицилиндровый двигатель'], weaknesses: ['Состояние турбосистемы и следы модификаций требуют отдельной диагностики'] }],
    transmissions: ['5-ступенчатая МКПП или 4-ступенчатая АКПП — сверять по конкретной комплектации'],
    drivetrain: 'Задний привод (FR) для японского JZX100 Tourer V.',
    sourceNotes: 'Размеры, масса, двигатель 1JZ-GTE, мощность, момент и бак взяты из каталога Toyota GAZOO для Mark II Tourer V 1996 года. Неизвестные параметры не заполнены.',
    sourceReferences: [
      { label: 'Toyota GAZOO — Mark II Tourer V (1996, E-JZX100)', url: 'https://gazoo.com/catalog/maker/TOYOTA/MARK_II/199609/1001105/', scope: 'Заводская спецификация японской комплектации: габариты, база, масса, 1JZ-GTE, мощность, момент и бак.' },
      { label: 'Toyota Global — история и спецификации Mark II X100', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60013052/index.html', scope: 'Официальная история поколения и заводские характеристики семейства X100.' }
    ]
  }),

  // Drift legends batch: Toyota FR sports sedans/coupes and Nissan A31/C33.
  makeSupplementalModel({
    id: 'toyota-mark-ii-x90-tourer-v', brandId: 'toyota', name: 'Mark II (X90, Tourer V)', generation: 'VII поколение, X90', years: '1992–1996', bodyType: 'Купе/Спорт',
    overview: 'Японский заднеприводный Mark II Tourer V с 1JZ-GTE. Спецификация относится к E-JZX90 1993 года, а не ко всем X90.',
    lengthMm: 4750, widthMm: 1750, heightMm: 1390, wheelbaseMm: 2730, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1460 кг для японской Tourer V 1993 года',
    engines: [{ code: '1JZ-GTE', name: '2.5 л рядный 6-цилиндровый DOHC, twin-turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '362.8 Н·м при 4800 об/мин', valves: '24V DOHC twin-turbo', fuelSystem: 'EFI', timingDrive: 'Нет подтверждённых данных в использованной карточке', strengths: ['Продольный двигатель и задний привод'], weaknesses: ['Проверять состояние двух турбин и следы тюнинга'] }],
    transmissions: ['4-ступенчатая АКПП или 5-ступенчатая МКПП — по комплектации'],
    drivetrain: 'Задний привод (FR) для E-JZX90 Tourer V.',
    sourceNotes: 'Размеры, база, масса, двигатель и бак взяты из Toyota GAZOO для Mark II Tourer V 1993 года.',
    sourceReferences: [{ label: 'Toyota GAZOO — Mark II Tourer V E-JZX90 (1993)', url: 'https://gazoo.com/catalog/maker/TOYOTA/MARK_II/199210/1001078/', scope: 'Заводские параметры японской комплектации.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-chaser-x90-tourer-v', brandId: 'toyota', name: 'Chaser (X90, Tourer V)', generation: 'V поколение, X90', years: '1992–1996', bodyType: 'Купе/Спорт',
    overview: 'Спортивный четырёхдверный хардтоп Chaser X90. Здесь указана японская Tourer V 1993 года с 1JZ-GTE.',
    lengthMm: 4750, widthMm: 1750, heightMm: 1390, wheelbaseMm: 2730, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1450 кг для японской Tourer V 1993 года',
    engines: [{ code: '1JZ-GTE', name: '2.5 л рядный 6-цилиндровый DOHC, twin-turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '362.8 Н·м при 4800 об/мин', valves: '24V DOHC twin-turbo', fuelSystem: 'EFI', timingDrive: 'Нет подтверждённых данных в использованной карточке', strengths: ['Задний привод и независимая подвеска'], weaknesses: ['Проверять турбины, охлаждение и изменения после тюнинга'] }],
    transmissions: ['4-ступенчатая АКПП или 5-ступенчатая МКПП — по комплектации'],
    drivetrain: 'Задний привод (FR) для E-JZX90 Tourer V.',
    sourceNotes: 'Заводские параметры японской Tourer V 1993 года по Toyota GAZOO.',
    sourceReferences: [{ label: 'Toyota GAZOO — Chaser Tourer V E-JZX90 (1993)', url: 'https://gazoo.com/catalog/maker/TOYOTA/CHASER/199210/1011857/', scope: 'Заводские параметры японской комплектации.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-chaser-x100-tourer-v', brandId: 'toyota', name: 'Chaser (X100, Tourer V)', generation: 'VI поколение, X100', years: '1996–2001', bodyType: 'Купе/Спорт',
    overview: 'Заднеприводный Chaser Tourer V поколения X100 с 1JZ-GTE. Приведена японская спецификация 1998 года.',
    lengthMm: 4715, widthMm: 1755, heightMm: 1400, wheelbaseMm: 2730, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1480 кг для японской Tourer V 1998 года',
    engines: [{ code: '1JZ-GTE', name: '2.5 л рядный 6-цилиндровый DOHC turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '377.6 Н·м при 2400 об/мин', valves: '24V DOHC Turbo', fuelSystem: 'EFI', timingDrive: 'Нет подтверждённых данных в использованной карточке', strengths: ['Задний привод и турбированный рядный шестицилиндровый двигатель'], weaknesses: ['Состояние зависит от обслуживания и тюнинга'] }],
    transmissions: ['4-ступенчатая АКПП или 5-ступенчатая МКПП — по комплектации'],
    drivetrain: 'Задний привод (FR) для GF-JZX100 Tourer V.',
    sourceNotes: 'Заводские параметры японской Tourer V 1998 года по Toyota GAZOO.',
    sourceReferences: [{ label: 'Toyota GAZOO — Chaser Tourer V GF-JZX100 (1998)', url: 'https://gazoo.com/catalog/maker/TOYOTA/CHASER/199609/1001331/', scope: 'Заводские параметры японской комплектации.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-cresta-x100-rulant-g', brandId: 'toyota', name: 'Cresta (X100, Roulant G)', generation: 'V поколение, X100', years: '1996–2001', bodyType: 'Седан',
    overview: 'Четырёхдверный седан Cresta X100 в спортивной версии Roulant G. Данные относятся к японской GF-JZX100 1998 года.',
    lengthMm: 4760, widthMm: 1755, heightMm: 1420, wheelbaseMm: 2730, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1490 кг для японской Roulant G 1998 года',
    engines: [{ code: '1JZ-GTE', name: '2.5 л рядный 6-цилиндровый DOHC turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: '377.6 Н·м при 2400 об/мин', valves: '24V DOHC Turbo', fuelSystem: 'EFI', timingDrive: 'Нет подтверждённых данных в использованной карточке', strengths: ['Продольный двигатель и задний привод'], weaknesses: ['Не путать характеристики Roulant G с атмосферными версиями'] }],
    transmissions: ['4-ступенчатая АКПП для указанной версии'],
    drivetrain: 'Задний привод (FR) для GF-JZX100 Roulant G.',
    sourceNotes: 'Заводские параметры японской Roulant G 1998 года по Toyota GAZOO.',
    sourceReferences: [{ label: 'Toyota GAZOO — Cresta Roulant G GF-JZX100 (1998)', url: 'https://gazoo.com/catalog/maker/TOYOTA/CRESTA/199609/1001210/', scope: 'Заводские параметры японской комплектации.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-mark-ii-x110-grande-gtb', brandId: 'toyota', name: 'Mark II (X110, Grande G-tb)', generation: 'IX поколение, X110', years: '2000–2004', bodyType: 'Седан',
    overview: 'Последнее поколение Mark II с кузовом седан. Запись относится к японской заднеприводной GH-JZX110 Grande G-tb с турбомотором 1JZ-GTE.',
    lengthMm: 4735, widthMm: 1760, heightMm: 1460, wheelbaseMm: 2780, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1530 кг для японской GH-JZX110',
    engines: [{ code: '1JZ-GTE', name: '2.5 л рядный 6-цилиндровый DOHC turbo VVT-i', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: 'Нет подтверждённых данных в использованной спецификации', valves: 'DOHC VVT-i Turbo', fuelSystem: 'Нет подтверждённых данных в использованной спецификации', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Задний привод и турбированный 1JZ-GTE'], weaknesses: ['Не переносить характеристики на атмосферные версии JZX110/GX110'] }],
    transmissions: ['Автоматическая трансмиссия; другие варианты сверять по точной модификации'],
    drivetrain: 'Задний привод (FR) для GH-JZX110 Grande G-tb.',
    sourceNotes: 'Габариты, масса, код двигателя, объём, мощность и привод подтверждены Toyota Global. Неуказанные параметры оставлены без догадок.',
    sourceReferences: [{ label: 'Toyota Global — Mark II X110 (2000)', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60013047/index.html', scope: 'Заводские характеристики репрезентативных японских комплектаций X110.' }, { label: 'Toyota GAZOO — Mark II Grande G-tb GH-JZX110 (2000)', url: 'https://gazoo.com/catalog/maker/TOYOTA/MARK_II/200010/1008659/', scope: 'Японская версия Grande G-tb: объём бака 70 л.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-supra-a80-rz', brandId: 'toyota', name: 'Supra (A80, RZ)', generation: 'IV поколение, A80', years: '1993–2002', bodyType: 'Купе/Спорт',
    overview: 'Легендарное заднеприводное спортивное купе Supra A80. Приведена японская версия RZ с 2JZ-GTE.',
    lengthMm: 4520, widthMm: 1810, heightMm: 1275, wheelbaseMm: 2550, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1490 кг для японской RZ',
    engines: [{ code: '2JZ-GTE', name: '3.0 л рядный 6-цилиндровый DOHC twin-turbo', displacement: '2997 см³', powerHp: '280 PS при 5600 об/мин', torqueNm: 'Нет подтверждённых данных в использованной спецификации', valves: 'DOHC twin-turbo', fuelSystem: 'Нет подтверждённых данных в использованной спецификации', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Продольная компоновка и задний привод'], weaknesses: ['Проверять систему охлаждения, турбины и историю модификаций'] }],
    transmissions: ['6-ступенчатая МКПП для японской RZ; варианты зависят от grade'],
    drivetrain: 'Задний привод (FR) для японской Supra RZ.',
    sourceNotes: 'Заводские данные Toyota Global для японской JZA80 RZ: размеры, масса и 2JZ-GTE.',
    sourceReferences: [{ label: 'Toyota Global — Supra A80 (1993)', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60006850/index.html', scope: 'Заводские параметры японской Supra A80.' }, { label: 'Toyota GAZOO — Supra RZ E-JZA80 (1997)', url: 'https://gazoo.com/catalog/maker/TOYOTA/SUPRA/199305/1000971/', scope: 'Японская версия RZ: объём бака 70 л.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-soarer-jzz30-gt-twin-turbo', brandId: 'toyota', name: 'Soarer (JZZ30, 2.5 GT Twin Turbo L)', generation: 'III поколение, Z30', years: '1991–2000', bodyType: 'Купе/Спорт',
    overview: 'Большое заднеприводное купе Soarer Z30 с рядным 2.5-литровым 1JZ-GTE twin-turbo. Данные соответствуют японской версии 1991 года.',
    lengthMm: 4860, widthMm: 1790, heightMm: 1350, wheelbaseMm: 2690, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 78, curbWeightKg: '1590 кг для JZZ30',
    engines: [{ code: '1JZ-GTE', name: '2.5 л рядный 6-цилиндровый DOHC twin-turbo', displacement: '2491 см³', powerHp: '280 PS при 6200 об/мин', torqueNm: 'Нет подтверждённых данных в использованной спецификации', valves: '24V DOHC twin-turbo', fuelSystem: 'Нет подтверждённых данных в использованной спецификации', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Задний привод, независимая двухрычажная подвеска'], weaknesses: ['Возрастные электрические системы и турбонаддув требуют проверки'] }],
    transmissions: ['Автоматическая трансмиссия для указанной спецификации; другие варианты зависят от комплектации'],
    drivetrain: 'Задний привод (FR) для JZZ30.',
    sourceNotes: 'Габариты, масса, двигатель и мощность подтверждены Toyota Global для третьего поколения Soarer.',
    sourceReferences: [{ label: 'Toyota Global — Soarer Z30 (1991)', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60010598/index.html', scope: 'Заводские параметры японской 2.5 GT Twin Turbo L.' }, { label: 'Toyota GAZOO — Soarer 2.5 GT Twin Turbo L E-JZZ30 (1991)', url: 'https://gazoo.com/catalog/maker/TOYOTA/SOARER/199105/1000866/', scope: 'Японская версия 2.5 GT Twin Turbo L: объём бака 78 л.' }]
  }),
  makeSupplementalModel({
    id: 'toyota-supra-a70-gt-turbo', brandId: 'toyota', name: 'Supra (A70, 3.0 GT Turbo)', generation: 'III поколение, A70', years: '1986–1993', bodyType: 'Купе/Спорт',
    overview: 'Спортивное купе Supra A70 с продольным рядным шестицилиндровым турбомотором. Данные относятся к японской 3.0 GT Turbo 1986 года.',
    lengthMm: 4620, widthMm: 1690, heightMm: 1310, wheelbaseMm: 2595, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: 70, curbWeightKg: '1520 кг для японской 3.0 GT Turbo',
    engines: [{ code: '7M-GTEU', name: '3.0 л рядный 6-цилиндровый DOHC turbo', displacement: '2954 см³', powerHp: 'Нет подтверждённых данных в использованной спецификации', torqueNm: 'Нет подтверждённых данных в использованной спецификации', valves: 'DOHC Turbo', fuelSystem: 'Нет подтверждённых данных в использованной спецификации', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Продольная компоновка и задний привод'], weaknesses: ['Для старого турбомотора важна проверка охлаждения и истории обслуживания'] }],
    transmissions: ['Варианты трансмиссии зависят от комплектации'],
    drivetrain: 'Задний привод (FR) для японской 3.0 GT Turbo.',
    sourceNotes: 'Размеры, база, масса, код и объём двигателя подтверждены Toyota Global; бак 70 л дополнительно подтверждён карточкой японской 3.0 GT Turbo E-MA70 1989 года. Неизвестные мощность и момент намеренно не заполнены.',
    sourceReferences: [{ label: 'Toyota Global — Supra A70 (1986)', url: 'https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60006816/', scope: 'Заводские данные японской Supra A70.' }, { label: 'Toyota GAZOO — Supra 3.0 GT Turbo E-MA70 (1989)', url: 'https://gazoo.com/catalog/maker/TOYOTA/SUPRA/198908/1000938/', scope: 'Заводская карточка японской 3.0 GT Turbo подтверждает бак 70 л.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-cefiro-a31-rb20det', brandId: 'nissan', name: 'Cefiro (A31, RB20DET)', generation: 'I поколение, A31', years: '1988–1994', bodyType: 'Седан',
    overview: 'Культовый заднеприводный седан Cefiro A31, часто используемый как платформа для дрифта. Запись описывает японскую версию 1988 года с RB20DET.',
    lengthMm: 4690, widthMm: 1695, heightMm: 1375, wheelbaseMm: 2670, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: null, curbWeightKg: '1330 кг для японской версии 1988 года',
    engines: [{ code: 'RB20DET', name: '2.0 л рядный 6-цилиндровый DOHC turbo', displacement: '1998 см³', powerHp: '205 PS при 6400 об/мин', torqueNm: '265 Н·м при 3200 об/мин', valves: '24V DOHC Turbo', fuelSystem: 'Нет подтверждённых данных в использованной спецификации', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Задний привод и независимая многорычажная задняя подвеска'], weaknesses: ['Проверять систему охлаждения, турбину и переделки после дрифта'] }],
    transmissions: ['Варианты МКПП/АКПП зависят от комплектации'],
    drivetrain: 'Задний привод для указанной заводской версии; другие варианты сверять по конкретному автомобилю.',
    sourceNotes: 'Заводские данные Nissan Heritage Collection для Cefiro A31 1988 года.',
    sourceReferences: [{ label: 'Nissan Heritage Collection — Cefiro A31 (1988)', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/458_nissan_cefiro.html', scope: 'Заводские размеры, масса, RB20DET, мощность и момент.' }]
  }),
  makeSupplementalModel({
    id: 'nissan-laurel-c33-rb20-medalist', brandId: 'nissan', name: 'Laurel (C33, RB20 Medalist)', generation: 'VI поколение, C33', years: '1988–1993', bodyType: 'Седан',
    overview: 'Заднеприводный седан Laurel C33 с независимой многорычажной задней подвеской. Запись соответствует японскому RB20 Medalist 1990 года; это атмосферная версия, не RB20DET.',
    lengthMm: 4690, widthMm: 1695, heightMm: 1365, wheelbaseMm: 2670, groundClearanceMm: null,
    trunkVolumeLiters: 'Нет подтверждённых данных', fuelTankLiters: null, curbWeightKg: '1300 кг для японского RB20 Medalist 1990 года',
    engines: [{ code: 'RB20E', name: '2.0 л рядный 6-цилиндровый OHC', displacement: '1998 см³', powerHp: '125 PS при 5600 об/мин', torqueNm: '172 Н·м при 4400 об/мин', valves: 'OHC', fuelSystem: 'Нет подтверждённых данных в использованной спецификации', timingDrive: 'Нет подтверждённых данных в использованной спецификации', strengths: ['Продольная компоновка и многорычажная задняя подвеска'], weaknesses: ['Не путать с турбированными Club S/Club L и другими версиями'] }],
    transmissions: ['Варианты трансмиссии зависят от комплектации'],
    drivetrain: 'Задний привод для указанной японской версии.',
    sourceNotes: 'Заводские данные Nissan Heritage Collection для Laurel C33 RB20 Medalist 1990 года.',
    sourceReferences: [{ label: 'Nissan Heritage Collection — Laurel RB20 Medalist (1990, C33)', url: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/laurel_rb20.html', scope: 'Заводские размеры, масса, двигатель RB20E, мощность и момент.' }]
  }),
];

const historicalBrandSeeds = [
  { id: 'prince', name: 'Prince Motor Company', russianName: 'Принс', founded: 1952, headquarters: 'Токио, Япония', tagline: 'Историческая японская автомобильная марка', description: 'Исторический производитель, объединённый с Nissan в 1966 году; Skyline и Gloria имеют важную преемственность Prince/Nissan.', brandColor: '#475569', awdPhilosophy: 'Зависит от конкретной модели и эпохи.' },
  { id: 'datsun', name: 'Datsun', russianName: 'Датсун', founded: 1931, headquarters: 'Япония', tagline: 'Историческая экспортная марка Nissan', description: 'Марка, использовавшаяся Nissan для автомобилей на разных рынках и в разные периоды; нельзя смешивать поколения и региональные версии.', brandColor: '#1d4ed8', awdPhilosophy: 'Зависит от модели, поколения и рынка.' },
  { id: 'autozam', name: 'Autozam', russianName: 'Аутозам', founded: 1989, headquarters: 'Япония', tagline: 'Исторический японский суббренд Mazda', description: 'Один из суббрендов Mazda для японского рынка; часть моделей имела родственные версии под другими марками.', brandColor: '#64748b', awdPhilosophy: 'Зависит от конкретной модели.' },
  { id: 'eunos', name: 'Eunos', russianName: 'Эунос', founded: 1989, headquarters: 'Япония', tagline: 'Исторический суббренд Mazda', description: 'Суббренд Mazda, ориентированный на японский рынок; модели и спецификации должны учитываться отдельно от экспортных аналогов.', brandColor: '#0f766e', awdPhilosophy: 'Зависит от конкретной модели.' },
  { id: 'scion', name: 'Scion', russianName: 'Сайон', founded: 2003, headquarters: 'США', tagline: 'Исторический бренд Toyota для Северной Америки', description: 'Бренд Toyota для рынка Северной Америки, закрытый в 2016 году; некоторые модели имеют Toyota-аналоги, но спецификации рынка США учитываются отдельно.', brandColor: '#111827', awdPhilosophy: 'Зависит от модели и североамериканской комплектации.' }
] as const;

for (const seed of historicalBrandSeeds) {
  if (!JAPANESE_BRANDS.some((brand) => brand.id === seed.id)) {
    JAPANESE_BRANDS.push({ ...seed, country: 'Япония', models: [] });
  }
}

const commercialBrandSeeds = [
  { id: 'hino', name: 'Hino Motors', russianName: 'Хино', founded: 1942, headquarters: 'Хино, Токио, Япония', tagline: 'Японский коммерческий транспорт', description: 'Производитель грузовых автомобилей, автобусов и коммерческих шасси.', brandColor: '#b91c1c', awdPhilosophy: 'Конфигурации привода зависят от серии, шасси и назначения.' },
  { id: 'mitsubishi-fuso', name: 'Mitsubishi Fuso', russianName: 'Мицубиси Фусо', founded: 1932, headquarters: 'Кавасаки, Япония', tagline: 'Коммерческие автомобили и автобусы', description: 'Марка коммерческих грузовиков и автобусов; агрегаты зависят от серии и рынка.', brandColor: '#2563eb', awdPhilosophy: 'Зависит от серии и назначения шасси.' },
  { id: 'ud-trucks', name: 'UD Trucks', russianName: 'ЮД Тракс', founded: 1935, headquarters: 'Ageo, Сайтама, Япония', tagline: 'Средние и тяжёлые грузовые автомобили', description: 'Японский производитель грузовых автомобилей для региональных и магистральных перевозок.', brandColor: '#0f766e', awdPhilosophy: 'Обычно задний привод; специальные конфигурации уточняются по шасси.' }
] as const;

for (const seed of commercialBrandSeeds) {
  if (!JAPANESE_BRANDS.some((brand) => brand.id === seed.id)) {
    JAPANESE_BRANDS.push({ ...seed, country: 'Япония', models: [] });
  }
}

const supplementalFitments: Record<string, Pick<JapaneseCarModel, 'tires' | 'wiperBladeSize'>> = {
  'honda-civic-fd-sedan': {
    wiperBladeSize: [{ driverSide: '600 mm (24")', passengerSide: '400 mm (16")', notes: 'Справочная применимость зависит от рынка и года; перед заказом сверить маркировку старых щёток и тип крепления.' }],
    tires: [
      { size: '205/55R16', diameter: 631.9, width: 205, aspectRatio: 55, rimDiameter: 406.4, loadIndex: '91', speedRating: 'V', notes: 'Размер встречается у отдельных Civic FD комплектаций; сверить с табличкой конкретного рынка и комплектации.' },
      { size: '215/45R17', diameter: 625.3, width: 215, aspectRatio: 45, rimDiameter: 431.8, loadIndex: '87', speedRating: 'W', notes: 'Размер для отдельных колёсных пакетов; не считать универсальной заводской установкой.' }
    ]
  },
  'subaru-impreza-ge-sedan': {
    wiperBladeSize: [{ driverSide: '600 mm (24")', passengerSide: '400 mm (16")', notes: 'Каталоги ANCO/PIAA для Impreza GE/GH 2008–2011 указывают 24"/16"; задняя щётка зависит от кузова и года.' }],
    tires: [
      { size: '205/55R16', diameter: 631.9, width: 205, aspectRatio: 55, rimDiameter: 406.4, loadIndex: '91', speedRating: 'V', notes: 'Встречается у отдельных Impreza GE комплектаций; сверить рынок, привод и табличку.' },
      { size: '205/50R17', diameter: 636.8, width: 205, aspectRatio: 50, rimDiameter: 431.8, loadIndex: '89', speedRating: 'V', notes: 'Вариант для отдельных комплектаций; требуется сверка с заводской табличкой.' }
    ]
  },
  'mazda3-bp-fastback': {
    tires: [
      { size: '205/60R16', diameter: 652.4, width: 205, aspectRatio: 60, rimDiameter: 406.4, loadIndex: '92', speedRating: 'V', notes: 'Официальное руководство Mazda3 BP: штатный размер для соответствующих комплектаций. Проверить табличку на стойке двери и точный рынок. https://www2.mazda.co.jp/carlife/owner/manual/mazda3/bp/ebmo_202404/contents/70071000.html' },
      { size: '215/45R18', diameter: 650.7, width: 215, aspectRatio: 45, rimDiameter: 457.2, loadIndex: '89', speedRating: 'W', notes: 'Официальное руководство Mazda3 BP: размер для соответствующих комплектаций. Проверить табличку на стойке двери и точный рынок. https://www2.mazda.co.jp/carlife/owner/manual/mazda3/bp/ebmo_202404/contents/70071000.html' }
    ]
  },
  'mazda3-bp-sedan': {
    tires: [
      { size: '205/60R16', diameter: 652.4, width: 205, aspectRatio: 60, rimDiameter: 406.4, loadIndex: '92', speedRating: 'V', notes: 'Официальное руководство Mazda3 BP: штатный размер для соответствующих комплектаций. Проверить табличку на стойке двери и точный рынок. https://www2.mazda.co.jp/carlife/owner/manual/mazda3/bp/ebmo_202404/contents/70071000.html' },
      { size: '215/45R18', diameter: 650.7, width: 215, aspectRatio: 45, rimDiameter: 457.2, loadIndex: '89', speedRating: 'W', notes: 'Официальное руководство Mazda3 BP: размер для соответствующих комплектаций. Проверить табличку на стойке двери и точный рынок. https://www2.mazda.co.jp/carlife/owner/manual/mazda3/bp/ebmo_202404/contents/70071000.html' }
    ]
  },
  'mazda3-bk-sedan': {
    wiperBladeSize: [{ driverSide: '530 mm (21")', passengerSide: '475 mm (19")', notes: 'Каталоги fitment для Mazda3 BK 2003–2009 указывают 530/475 мм; крепление и региональная версия могут отличаться.' }],
    tires: [
      { size: '205/55R16', diameter: 631.9, width: 205, aspectRatio: 55, rimDiameter: 406.4, loadIndex: '91', speedRating: 'V', notes: 'Распространённый размер Mazda3 BK; проверить точную комплектацию и табличку.' },
      { size: '205/50R17', diameter: 636.8, width: 205, aspectRatio: 50, rimDiameter: 431.8, loadIndex: '89', speedRating: 'V', notes: 'Встречается на отдельных комплектациях; проверить разрешённый размер для рынка.' }
    ]
  },
  'mazda3-bk-hatchback': {
    wiperBladeSize: [{ driverSide: '530 mm (21")', passengerSide: '475 mm (19")', notes: 'Каталоги fitment для Mazda3 BK 2003–2009 указывают 530/475 мм; задняя щётка для хэтчбека около 350 мм. Проверить крепление.' }],
    tires: [
      { size: '205/55R16', diameter: 631.9, width: 205, aspectRatio: 55, rimDiameter: 406.4, loadIndex: '91', speedRating: 'V', notes: 'Распространённый размер Mazda3 BK; проверить точную комплектацию и табличку.' },
      { size: '205/50R17', diameter: 636.8, width: 205, aspectRatio: 50, rimDiameter: 431.8, loadIndex: '89', speedRating: 'V', notes: 'Встречается на отдельных комплектациях; проверить разрешённый размер для рынка.' }
    ]
  },
  'mitsubishi-lancer-x-cy-sedan': {
    wiperBladeSize: [{ driverSide: '600 mm (24")', passengerSide: '450 mm (18")', notes: 'Вторичные таблицы для Lancer X/CY указывают 24"/18"; проверить год, рынок и крепление. Не относится автоматически к Lancer IX.' }],
    tires: [
      { size: '205/60R16', diameter: 652.4, width: 205, aspectRatio: 60, rimDiameter: 406.4, loadIndex: '92', speedRating: 'H', notes: 'Размер встречается на обычных Lancer X комплектациях; не переносить на Evolution/Ralliart, проверить табличку.' },
      { size: '215/45R18', diameter: 650.7, width: 215, aspectRatio: 45, rimDiameter: 457.2, loadIndex: '93', speedRating: 'W', notes: 'Вариант отдельных комплектаций/колёсных пакетов; подтвердить по рынку и заводской табличке.' }
    ]
  },
  'honda-civic-fn-hatchback': {
    wiperBladeSize: [{ driverSide: '650 mm', passengerSide: '575 mm', notes: 'OXIMO catalogue lists 650/575 mm for Civic VIII FN/FK hatchback (2006–2011); other fitment tables differ by production date and market. Verify exact arm/connector. https://www.oximo.pl/en/wiper/honda-civic-viii-fn-fk-hatchback-2006-01-01-wgp350425-0/' }],
    tires: [
      { size: '225/45R17', diameter: 634.3, width: 225, aspectRatio: 45, rimDiameter: 431.8, loadIndex: '91', speedRating: 'W', notes: 'Listed for selected Civic VIII hatchback grades; confirm market and exact grade before treating as approved fitment.' }
    ]
  },
  'suzuki-swift-zc72s-ru-12-at-2wd-2013': {
    tires: [
      { size: '175/65R15', diameter: 608.5, width: 175, aspectRatio: 65, rimDiameter: 381, loadIndex: 'Не указан источником', speedRating: 'Не указан источником', notes: 'Drom указывает 175/65R15 для российской комплектации Swift ZC72S 1.2 2WD AT 5dr GL 2013–2015. Индексы нагрузки/скорости не подтверждены; проверить табличку конкретного автомобиля. https://www.drom.ru/catalog/suzuki/swift/73395/' }
    ]
  },
  'suzuki-swift-zc11-hatchback': {
    wiperBladeSize: [{ driverSide: '525 mm', passengerSide: '450 mm', notes: 'Japanese wiper chart lists ZC11S/ZD11S Swift: 525/450 mm front, 250 mm rear. https://wiper.jp/SUZUKI/SWIFT.html' }],
    tires: [
      { size: '165/70R14', diameter: 586.6, width: 165, aspectRatio: 70, rimDiameter: 355.6, loadIndex: '81', speedRating: 'T', notes: 'Cars Japan fitment table for Swift ZC11S 1.3 XE; trim-specific. https://cars-japan.net/tire/mdl0080017.html' },
      { size: '185/60R15', diameter: 603, width: 185, aspectRatio: 60, rimDiameter: 381, loadIndex: '84', speedRating: 'H', notes: 'Cars Japan fitment table for selected ZC11S/XG and 4WD grades; confirm exact grade. https://cars-japan.net/tire/mdl0080017.html' }
    ]
  },
  'toyota-prius-xw30-liftback': {
    tires: [
      { size: '185/65R15', diameter: 621.5, width: 185, aspectRatio: 65, rimDiameter: 381, loadIndex: '88', speedRating: 'S', notes: 'Руководство Toyota Prius для японской версии 2009–2015 перечисляет размер для отдельных комплектаций. Проверить год, grade и табличку автомобиля. Источник: https://manual.toyota.jp/pdf/prius/prius_201405.pdf' },
      { size: '195/65R15', diameter: 634.5, width: 195, aspectRatio: 65, rimDiameter: 381, loadIndex: '91', speedRating: 'S', notes: 'Руководство Toyota Prius для японской версии 2009–2015 перечисляет размер для отдельных комплектаций; индекс S/H и применимость сверить по конкретному автомобилю. Источник: https://manual.toyota.jp/pdf/prius/prius_201405.pdf' },
      { size: '215/45R17', diameter: 625.3, width: 215, aspectRatio: 45, rimDiameter: 431.8, loadIndex: '87', speedRating: 'W', notes: 'Руководство Toyota Prius для японской версии 2009–2015 перечисляет размер для отдельных комплектаций с низкопрофильными шинами; не универсален для всех XW30. Источник: https://manual.toyota.jp/pdf/prius/prius_201405.pdf' },
      { size: '215/40R18', diameter: 629.2, width: 215, aspectRatio: 40, rimDiameter: 457.2, loadIndex: '85', speedRating: 'W', notes: 'Руководство Toyota Prius для японской версии 2009–2015 перечисляет размер для отдельных комплектаций; перед установкой обязательно сверить grade, допуски колёс и табличку автомобиля. Источник: https://manual.toyota.jp/pdf/prius/prius_201405.pdf' }
    ]
  },
  'mazda-cx5-ke-crossover': {
    tires: [
      { size: '225/65R17', diameter: 724.3, width: 225, aspectRatio: 65, rimDiameter: 431.8, loadIndex: '102', speedRating: 'V', notes: 'Mazda owner manual lists this standard size for CX-5 KE; market/grade can change load-speed marking. https://www2.mazda.co.jp/carlife/owner/manual/cx-5/ke/ekshi/contents/07020200.html' },
      { size: '225/55R19', diameter: 730.1, width: 225, aspectRatio: 55, rimDiameter: 482.6, loadIndex: '99', speedRating: 'V', notes: 'Mazda owner manual lists this size for selected CX-5 KE grades. https://www2.mazda.co.jp/carlife/owner/manual/cx-5/ke/ekshi/contents/07020200.html' }
    ]
  },
  'mazda-6-gg-sedan': {
    tires: [
      { size: '195/65R15', diameter: 634.5, width: 195, aspectRatio: 65, rimDiameter: 381, loadIndex: '91', speedRating: 'V', notes: 'Listed for selected Mazda6 GG 1.8/2.0 sedan grades; engine and market affect approved set. https://club.autodoc.se/tyres/mazda/6/6-gg' },
      { size: '205/55R16', diameter: 631.9, width: 205, aspectRatio: 55, rimDiameter: 406.4, loadIndex: '91', speedRating: 'V', notes: 'Listed for selected Mazda6 GG grades; verify exact engine, year and placard. https://club.autodoc.se/tyres/mazda/6/6-gg' },
      { size: '215/45R17', diameter: 625.3, width: 215, aspectRatio: 45, rimDiameter: 431.8, loadIndex: '87', speedRating: 'W', notes: 'Listed for selected Mazda6 GG grades; verify exact engine, year and placard. https://club.autodoc.se/tyres/mazda/6/6-gg' }
    ]
  },
  'nissan-tiida-c11-hatchback': {
    wiperBladeSize: [{ driverSide: '550 mm', passengerSide: '400 mm', notes: 'Официальный FAQ Nissan для Tiida C11 (2004/09–2012/08): водительская 550 мм, пассажирская 400 мм; задняя 305 мм (стандарт) / 300 мм (холодный климат). Источник: https://faq2.nissan.co.jp/faq/show/7949' }],
    tires: [
      { size: '185/65R15', diameter: 621.5, width: 185, aspectRatio: 65, rimDiameter: 381, loadIndex: '88', speedRating: 'S', notes: 'Официальный FAQ Nissan: штатный размер для ряда комплектаций Tiida C11 2010/08–2012/08, включая 15S/15M/15G; другие годы и версии требуют отдельной сверки. Источник: https://faq2.nissan.co.jp/faq/show/9916' }
    ]
  },
  'nissan-note-e11-hatchback': {
    wiperBladeSize: [{ driverSide: '600 mm', passengerSide: '350 mm', notes: 'Официальный FAQ Nissan для Note E11 (2005/01–2012/08): передние 600/350 мм, задняя 305 мм (стандарт) / 300 мм (холодный климат). Источник: https://faq2.nissan.co.jp/faq/show/7953' }],
    tires: [
      { size: '175/65R14', diameter: 583.1, width: 175, aspectRatio: 65, rimDiameter: 355.6, loadIndex: '82', speedRating: 'S', notes: 'Официальный FAQ Nissan для Note E11 HR15DE: штатный размер на базовых 14-дюймовых комплектациях. Источник: https://faq2.nissan.co.jp/faq/show/10039' },
      { size: '175/60R15', diameter: 591, width: 175, aspectRatio: 60, rimDiameter: 381, loadIndex: '81', speedRating: 'H', notes: 'Официальный FAQ Nissan: опциональный размер для отдельных комплектаций E11; не универсальная установка. Источник: https://faq2.nissan.co.jp/faq/show/10039' }
    ]
  },
  'nissan-xtrail-t32-crossover': {
    tires: [
      { size: '225/65R17', diameter: 724.3, width: 225, aspectRatio: 65, rimDiameter: 431.8, loadIndex: '102', speedRating: 'H', notes: 'Официальный FAQ Nissan: штатный размер для ряда комплектаций X-Trail T32; давление и точная применимость зависят от двигателя, привода, года и комплектации. Источник: https://faq2.nissan.co.jp/faq/show/12541' },
      { size: '225/60R18', diameter: 727.2, width: 225, aspectRatio: 60, rimDiameter: 457.2, loadIndex: '100', speedRating: 'H', notes: 'Официальный FAQ Nissan: размер для отдельных комплектаций X-Trail T32; не универсален для всех версий. Источник: https://faq2.nissan.co.jp/faq/show/12541' },
      { size: '225/55R19', diameter: 730.1, width: 225, aspectRatio: 55, rimDiameter: 482.6, loadIndex: '99', speedRating: 'H', notes: 'Официальный FAQ Nissan: размер для отдельных комплектаций Mode Premier T32; подтвердить комплектацию и табличку автомобиля. Источник: https://faq2.nissan.co.jp/faq/show/12541' }
    ]
  },
  'nissan-xtrail-t31-suv': {
    wiperBladeSize: [{ driverSide: '600 mm', passengerSide: '400 mm', notes: 'Официальный FAQ Nissan для X-Trail T31 (2007/08–2015/02): передние 600/400 мм, задняя 350 мм. Источник: https://faq2.nissan.co.jp/faq/show/7939' }],
    tires: [
      { size: '215/65R16', diameter: 685.9, width: 215, aspectRatio: 65, rimDiameter: 406.4, loadIndex: '98', speedRating: 'S', notes: 'Официальный FAQ Nissan указывает для отдельных T31 комплектаций 215/65R16 98S; точная применимость зависит от года, двигателя и привода. Источник: https://faq2.nissan.co.jp/faq/show/24783' },
      { size: '225/60R17', diameter: 701.8, width: 225, aspectRatio: 60, rimDiameter: 431.8, loadIndex: '99', speedRating: 'H', notes: 'Официальный FAQ Nissan указывает для отдельных T31 комплектаций 225/60R17 99H; точная применимость зависит от года, двигателя и привода. Источник: https://faq2.nissan.co.jp/faq/show/24783' },
      { size: '225/55R18', diameter: 704.7, width: 225, aspectRatio: 55, rimDiameter: 457.2, loadIndex: '98', speedRating: 'H', notes: 'Официальный FAQ Nissan указывает для отдельных T31 комплектаций 225/55R18 98H; точная применимость зависит от года, двигателя и привода. Источник: https://faq2.nissan.co.jp/faq/show/24783' }
    ]
  },
  'nissan-qashqai-j10-crossover': {
    wiperBladeSize: [{ driverSide: '600 mm', passengerSide: '380 mm', notes: 'Официальный FAQ Nissan для Dualis/Qashqai J10 (2007/05–2013/06): передние 600/380 мм, задняя 300 мм. Источник: https://faq2.nissan.co.jp/faq/show/7952' }],
    tires: [
      { size: '215/65R16', diameter: 685.9, width: 215, aspectRatio: 65, rimDiameter: 406.4, loadIndex: '98', speedRating: 'H', notes: 'Официальный FAQ Nissan для Dualis J10: размер на комплектациях 20S/20S FOUR. Источник: https://faq2.nissan.co.jp/faq/show/8833' },
      { size: '215/60R17', diameter: 689.8, width: 215, aspectRatio: 60, rimDiameter: 431.8, loadIndex: '96', speedRating: 'H', notes: 'Официальный FAQ Nissan для Dualis J10: размер на комплектациях 20G/20G FOUR. Источник: https://faq2.nissan.co.jp/faq/show/8833' },
      { size: '215/55R18', diameter: 693.7, width: 215, aspectRatio: 55, rimDiameter: 457.2, loadIndex: '99', speedRating: 'V', notes: 'Официальный FAQ Nissan для отдельных J10 grades; для отдельных европейских 18-дюймовых шин Nissan отмечает особый индекс нагрузки/скорости. Источник: https://faq2.nissan.co.jp/faq/show/8833' }
    ]
  },
  'nissan-march-k12': {
    wiperBladeSize: [{ driverSide: '550 mm', passengerSide: '400 mm', notes: 'Официальный FAQ Nissan для March K12 (2002/02–2010/07): передние 550/400 мм, задняя 300 мм. Источник: https://faq2.nissan.co.jp/faq/show/7959' }],
    tires: [
      { size: '165/70R14', diameter: 586.6, width: 165, aspectRatio: 70, rimDiameter: 355.6, loadIndex: '81', speedRating: 'S', notes: 'Официальный FAQ Nissan для March K12: штатный размер на ряде 14-дюймовых комплектаций. Источник: https://faq2.nissan.co.jp/faq/show/10729' },
      { size: '175/60R15', diameter: 591, width: 175, aspectRatio: 60, rimDiameter: 381, loadIndex: '81', speedRating: 'H', notes: 'Официальный FAQ Nissan для March K12: размер опциональных 15-дюймовых колёс на отдельных комплектациях. Источник: https://faq2.nissan.co.jp/faq/show/10729' },
      { size: '185/55R15', diameter: 584.5, width: 185, aspectRatio: 55, rimDiameter: 381, loadIndex: '81', speedRating: 'V', notes: 'Официальный FAQ Nissan для March K12: размер на отдельных спортивных/старших комплектациях. Источник: https://faq2.nissan.co.jp/faq/show/10729' }
    ]
  },
  'nissan-serena-c25': {
    wiperBladeSize: [{ driverSide: '650 mm', passengerSide: '300 mm', notes: 'Официальный FAQ Nissan для Serena C25 (2005/05–2010/11): передние 650/300 мм, задняя 400 мм. Источник: https://faq2.nissan.co.jp/faq/show/7947' }],
    tires: [
      { size: '195/65R15', diameter: 634.5, width: 195, aspectRatio: 65, rimDiameter: 381, loadIndex: '91', speedRating: 'S', notes: 'Официальный FAQ Nissan: штатный размер для ряда Serena C25 2005/05–2010/11; давление и применимость зависят от привода, года и комплектации. Источник: https://faq2.nissan.co.jp/faq/show/10156' },
      { size: '195/60R16', diameter: 640.4, width: 195, aspectRatio: 60, rimDiameter: 406.4, loadIndex: '89', speedRating: 'H', notes: 'Официальный FAQ Nissan: размер для отдельных комплектаций Serena C25, включая некоторые версии Highway Star/20RS/20RX; не универсален для всех машин. Источник: https://faq2.nissan.co.jp/faq/show/10156' }
    ]
  },
  'lexus-is-xe20-sedan': {
    wiperBladeSize: [{ driverSide: '550 mm', passengerSide: '500 mm', notes: 'WIPERS.EE указывает 550/500 мм для Lexus IS XE20 sedan 2005–2013; проверять год и кузов.' }],
    tires: [
      { size: '205/55R16', diameter: 631.9, width: 205, aspectRatio: 55, rimDiameter: 406.4, loadIndex: '91', speedRating: 'V', notes: 'Встречается на отдельных XE20 комплектациях; сверить табличку и тормозной пакет.' },
      { size: '225/45R17', diameter: 634.3, width: 225, aspectRatio: 45, rimDiameter: 431.8, loadIndex: '91', speedRating: 'W', notes: 'Вариант отдельных XE20 комплектаций; подтвердить по точной версии и рынку.' }
    ]
  },
  'isuzu-mux-uc-suv': {
    wiperBladeSize: [{ driverSide: '530 mm (21")', passengerSide: '480 mm (19")', notes: 'Вторичная таблица Isuzu MU-X указывает эти размеры для ряда машин 2017–2021; не распространять автоматически на весь период UC 2013–2021.' }],
    tires: [
      { size: '255/65R17', diameter: 762.3, width: 255, aspectRatio: 65, rimDiameter: 431.8, loadIndex: '110', speedRating: 'S', notes: 'Встречается на отдельных MU-X комплектациях; подтвердить рынок, год и табличку.' },
      { size: '255/60R18', diameter: 763.2, width: 255, aspectRatio: 60, rimDiameter: 457.2, loadIndex: '108', speedRating: 'H', notes: 'Вариант отдельных комплектаций; подтвердить точную модификацию и индекс нагрузки.' }
    ]
  }
};

for (const model of supplementalModels) {
  const fitment = supplementalFitments[model.id];
  if (fitment) Object.assign(model, fitment);
}

for (const model of supplementalModels) {
  const brand = JAPANESE_BRANDS.find(item => item.id === model.brandId);
  if (!brand) continue;
  const normalizedYears = (years: string) => years.replace(/[–—]/g, '-').replace(/\s+/g, '');
  const duplicate = brand.models.some(item =>
    item.id === model.id ||
    (item.bodyType === model.bodyType && normalizedYears(item.years) === normalizedYears(model.years))
  );
  if (!duplicate) brand.models.push(model);
}


// Россия / СНГ: отдельная запись Mazda3 BL sedan. Данные вторичных каталогов
// остаются непроверенными до сверки с заводским документом точной комплектации.
const mazda3BlRussia = makeSupplementalModel({
  id: 'mazda3-bl-russia-sedan',
  brandId: 'mazda',
  name: 'Mazda3 (BL, седан, Россия)',
  generation: 'II поколение BL, российская спецификация',
  years: '2008–2011',
  bodyType: 'Седан',
  overview: 'Российская Mazda3 второго поколения в кузове седан. В дилерской линейке встречались бензиновые 1.6 Z6 и 2.0 LF-DE; точную коробку и оборудование необходимо определить по VIN/табличке. Запись не заменяет подбор конкретной модификации.',
  lengthMm: 4580,
  widthMm: 1755,
  heightMm: 1470,
  wheelbaseMm: 2640,
  groundClearanceMm: 155,
  trunkVolumeLiters: 'Нет подтверждённых данных для точной российской комплектации',
  fuelTankLiters: 55,
  curbWeightKg: 'Нет подтверждённых данных для точной комплектации',
  engines: [
    {
      code: 'Z6',
      name: '1.6 л бензин, российская версия',
      displacement: '1598 см³',
      powerHp: '105 л.с. (вторичный каталог; требует сверки с первичным документом)',
      torqueNm: 'Нет подтверждённых данных для точной комплектации',
      valves: 'Рядный 4-цилиндровый двигатель',
      fuelSystem: 'Нет подтверждённых данных для точной комплектации',
      timingDrive: 'Нет подтверждённых данных для точной комплектации',
      strengths: ['Указан в каталоге российских комплектаций Mazda3 BL'],
      weaknesses: ['Точные параметры и применимость требуют проверки по VIN и заводскому документу']
    },
    {
      code: 'LF-DE',
      name: '2.0 л бензин, российская версия',
      displacement: '1999 см³',
      powerHp: '150 л.с. (вторичный каталог; требует сверки с первичным документом)',
      torqueNm: 'Нет подтверждённых данных для точной комплектации',
      valves: 'Рядный 4-цилиндровый двигатель',
      fuelSystem: 'Нет подтверждённых данных для точной комплектации',
      timingDrive: 'Нет подтверждённых данных для точной комплектации',
      strengths: ['Указан в каталоге российских комплектаций Mazda3 BL'],
      weaknesses: ['Точные параметры и применимость требуют проверки по VIN и заводскому документу']
    }
  ],
  transmissions: [
    'МКПП — тип и число передач проверить по комплектации',
    'АКПП — тип и число передач проверить по комплектации'
  ],
  drivetrain: 'Передний привод для описанных российских комплектаций; подтвердить по документам конкретного автомобиля.',
  sourceNotes: 'Статус оставлен unverified. Drom описывает российскую Mazda3 BL sedan и указывает двигатели Z6 1.6 (105 л.с.) и LF-DE 2.0 (150 л.с.), а также МКПП/АКПП; это вторичный каталог, используемый только как ориентир. Размеры кузова и бак требуют дополнительной сверки с первичным источником для конкретного года/комплектации. Официальный портал Mazda Russia сообщает, что его руководство доступно только для автомобилей после 2013 года; доступного заводского документа для BL через этот портал не подтверждено. Не использовать эту запись для заказа деталей или выбора жидкостей без VIN-проверки.',
  sourceReferences: [
    {
      label: 'Drom — Mazda3 BL sedan, российский рынок (2008–2011)',
      url: 'https://www.drom.ru/catalog/mazda/mazda3/g_2008_1416/',
      scope: 'Вторичный каталог: российские комплектации и двигатели; не является первичным подтверждением сервисных параметров.'
    },
    {
      label: 'Mazda Russia — руководство по эксплуатации',
      url: 'https://www.mazda.ru/owning/owner-menu/manuals/',
      scope: 'Официальная страница указывает доступность руководств для автомобилей после 2013 года; заводской документ для BL на портале не подтверждён.'
    }
  ]
});
const mazdaBrandForBl = JAPANESE_BRANDS.find((brand) => brand.id === 'mazda');
if (mazdaBrandForBl && !mazdaBrandForBl.models.some((model) => model.id === mazda3BlRussia.id)) {
  mazdaBrandForBl.models.push(mazda3BlRussia);
}

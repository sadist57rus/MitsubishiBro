import { JAPANESE_BRANDS, type JapaneseCarModel } from './japaneseBrandsData';

/**
 * Japanese domestic-market kei-car index.
 * This batch intentionally records identity only: generation dates and all repair
 * specifications remain unverified until matched to a primary source for the exact chassis.
 */
type KeiIndexEntry = {
  id: string;
  brandId: 'toyota' | 'honda' | 'daihatsu' | 'suzuki';
  name: string;
  chassis: string;
  bodyType: JapaneseCarModel['bodyType'];
  sourceUrl: string;
  sourceLabel: string;
  dimensionsVerified?: { length: number; width: number; height: number; wheelbase: number; groundClearance: number };
  tireOptions?: { size: string; notes: string }[];
  wiper?: { driverSide: string; passengerSide: string; notes: string };
};

const NO_DATA = 'Нет подтверждённых данных для точной модификации';
const entries: KeiIndexEntry[] = [
  // Toyota — Pixis kei range
  { id: 'toyota-pixis-epoch-la300', brandId: 'toyota', name: 'Pixis Epoch (LA300A/LA310A)', chassis: 'LA300A/LA310A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/carlineup/', sourceLabel: 'Toyota Japan — каталог моделей' },
  { id: 'toyota-pixis-epoch-la350', brandId: 'toyota', name: 'Pixis Epoch (LA350A/LA360A)', chassis: 'LA350A/LA360A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/pixisepoch/', sourceLabel: 'Toyota Japan — Pixis Epoch' },
  { id: 'toyota-pixis-space-l575', brandId: 'toyota', name: 'Pixis Space (L575A/L585A)', chassis: 'L575A/L585A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/carlineup/', sourceLabel: 'Toyota Japan — каталог моделей' },
  { id: 'toyota-pixis-mega-la700', brandId: 'toyota', name: 'Pixis Mega (LA700A/LA710A)', chassis: 'LA700A/LA710A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/carlineup/', sourceLabel: 'Toyota Japan — каталог моделей' },
  { id: 'toyota-pixis-van-s321', brandId: 'toyota', name: 'Pixis Van (S321M/S331M)', chassis: 'S321M/S331M', bodyType: 'Минивэн', sourceUrl: 'https://toyota.jp/pixisvan/', sourceLabel: 'Toyota Japan — Pixis Van' },
  { id: 'toyota-pixis-van-s700', brandId: 'toyota', name: 'Pixis Van (S700M/S710M)', chassis: 'S700M/S710M', bodyType: 'Минивэн', sourceUrl: 'https://toyota.jp/pixisvan/', sourceLabel: 'Toyota Japan — Pixis Van' },
  { id: 'toyota-pixis-truck-s500', brandId: 'toyota', name: 'Pixis Truck (S500U/S510U)', chassis: 'S500U/S510U', bodyType: 'Пикап', sourceUrl: 'https://toyota.jp/pixistruck/', sourceLabel: 'Toyota Japan — Pixis Truck' },

  // Honda — N-series and earlier kei models
  { id: 'honda-nbox-jf1', brandId: 'honda', name: 'N-BOX (JF1/JF2)', chassis: 'JF1/JF2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/customer/auto/n-box/faq/qa015/', sourceLabel: 'Honda Japan — FAQ по колёсам N-BOX', tireOptions: [{ size: '145/80R13 75S', notes: 'Штатный размер для отдельных базовых комплектаций JF1/JF2; проверить шильдик автомобиля.' }, { size: '155/65R14 75S', notes: 'Для отдельных комплектаций JF1/JF2; проверить шильдик автомобиля.' }, { size: '165/55R15 75V', notes: 'Для отдельных турбированных комплектаций JF1/JF2; проверить шильдик автомобиля.' }], wiper: { driverSide: '450 мм (NWB M45S)', passengerSide: '430 мм (NWB M43S)', notes: 'NWB fitment chart для JF1/JF2; сверить год, крепление и задний дворник отдельно.' } },
  { id: 'honda-nbox-jf3', brandId: 'honda', name: 'N-BOX (JF3/JF4)', chassis: 'JF3/JF4', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/customer/auto/n-box/faq/qa015/', sourceLabel: 'Honda Japan — FAQ по колёсам N-BOX', tireOptions: [{ size: '155/65R14 75S', notes: 'Официальный размер для обычных версий JF3/JF4; давление и применимость сверять по табличке.' }, { size: '165/55R15 75V', notes: 'Официальный размер для отдельных версий Custom Turbo; давление и применимость сверять по табличке.' }], wiper: { driverSide: '480 мм (NWB M48S)', passengerSide: '430 мм (NWB M43S)', notes: 'NWB fitment chart для JF3/JF4; сверить год, крепление и задний дворник отдельно.' } },
  { id: 'honda-nbox-jf5', brandId: 'honda', name: 'N-BOX (JF5/JF6)', chassis: 'JF5/JF6', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/ownersmanual/webom/jpn/n-box/2026/details/136238090-15246.html', sourceLabel: 'Honda Japan — руководство владельца N-BOX 2026', tireOptions: [{ size: '155/65R14 75S', notes: 'Официальный размер для соответствующих комплектаций; давление по руководству: перед 240 кПа, зад 230 кПа.' }, { size: '165/55R15 75V', notes: 'Официальный размер для отдельных комплектаций; давление по руководству 220 кПа спереди и сзади. Проверить табличку конкретного автомобиля.' }] },
  { id: 'honda-nbox-plus-jf1', brandId: 'honda', name: 'N-BOX+ (JF1/JF2)', chassis: 'JF1/JF2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/N/papercraft/jp/index.html', sourceLabel: 'Honda — история и линейка N-серии' },
  { id: 'honda-nbox-slash-jf1', brandId: 'honda', name: 'N-BOX Slash (JF1/JF2)', chassis: 'JF1/JF2', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N/papercraft/jp/index.html', sourceLabel: 'Honda — история и линейка N-серии' },
  { id: 'honda-nwgn-jh1', brandId: 'honda', name: 'N-WGN (JH1/JH2)', chassis: 'JH1/JH2', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N-WGN/', sourceLabel: 'Honda Japan — N-WGN', wiper: { driverSide: '530 мм (NWB M53S)', passengerSide: '350 мм (NWB M35S)', notes: 'NWB fitment chart для JH1/JH2; крепление и год выпуска нужно сверить.' } },
  { id: 'honda-nwgn-jh3', brandId: 'honda', name: 'N-WGN (JH3/JH4)', chassis: 'JH3/JH4', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N-WGN/', sourceLabel: 'Honda Japan — N-WGN', wiper: { driverSide: '530 мм (NWB M53S)', passengerSide: '350 мм (NWB M35S)', notes: 'NWB fitment chart для JH3/JH4; крепление и год выпуска нужно сверить.' } },
  { id: 'honda-none-jg1', brandId: 'honda', name: 'N-ONE (JG1/JG2)', chassis: 'JG1/JG2', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N-ONE/', sourceLabel: 'Honda Japan — N-ONE', wiper: { driverSide: '480 мм (NWB M48S)', passengerSide: 'Нет подтверждённых данных', notes: 'NWB chart does not list a separate passenger-side blade for this model; do not infer it from another generation.' } },
  { id: 'honda-none-jg3', brandId: 'honda', name: 'N-ONE (JG3/JG4)', chassis: 'JG3/JG4', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N-ONE/', sourceLabel: 'Honda Japan — N-ONE', wiper: { driverSide: '480 мм (NWB M48S)', passengerSide: '380 мм (NWB M38S)', notes: 'NWB fitment chart для JG3/JG4; сверить год и крепление.' } },
  { id: 'honda-nvan-jj1', brandId: 'honda', name: 'N-VAN (JJ1/JJ2)', chassis: 'JJ1/JJ2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/N-VAN/', sourceLabel: 'Honda Japan — N-VAN', wiper: { driverSide: '500 мм (NWB M50S)', passengerSide: '400 мм (NWB M40S)', notes: 'NWB fitment chart для JJ1/JJ2; у high-roof/low-roof версий возможны отличия, сверить исполнение.' } },
  { id: 'honda-s660-jw5', brandId: 'honda', name: 'S660 (JW5)', chassis: 'JW5', bodyType: 'Купе/Спорт', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },
  { id: 'honda-life-jb5', brandId: 'honda', name: 'Life (JB5/JB6/JB7/JB8)', chassis: 'JB5/JB6/JB7/JB8', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },
  { id: 'honda-acty-hh5', brandId: 'honda', name: 'Acty Van (HH5/HH6)', chassis: 'HH5/HH6', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },
  { id: 'honda-vamos-hm1', brandId: 'honda', name: 'Vamos (HM1/HM2)', chassis: 'HM1/HM2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },

  // Daihatsu — passenger and commercial kei models
  { id: 'daihatsu-mira-es-la300', brandId: 'daihatsu', name: 'Mira e:S (LA300S/LA310S)', chassis: 'LA300S/LA310S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-mira-es-la350', brandId: 'daihatsu', name: 'Mira e:S (LA350S/LA360S)', chassis: 'LA350S/LA360S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/mira_e-s/', sourceLabel: 'Daihatsu Japan — Mira e:S' },
  { id: 'daihatsu-tanto-l375', brandId: 'daihatsu', name: 'Tanto (L375S/L385S)', chassis: 'L375S/L385S', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/tanto/index.htm', sourceLabel: 'Daihatsu Japan — Tanto' },
  { id: 'daihatsu-tanto-la600', brandId: 'daihatsu', name: 'Tanto (LA600S/LA610S)', chassis: 'LA600S/LA610S', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/tanto/index.htm', sourceLabel: 'Daihatsu Japan — Tanto' },
  { id: 'daihatsu-tanto-la650', brandId: 'daihatsu', name: 'Tanto (LA650S/LA660S)', chassis: 'LA650S/LA660S', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/tanto/index.htm', sourceLabel: 'Daihatsu Japan — Tanto' },
  { id: 'daihatsu-move-l175', brandId: 'daihatsu', name: 'Move (L175S/L185S)', chassis: 'L175S/L185S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-move-la100', brandId: 'daihatsu', name: 'Move (LA100S/LA110S)', chassis: 'LA100S/LA110S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-move-la150', brandId: 'daihatsu', name: 'Move (LA150S/LA160S)', chassis: 'LA150S/LA160S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/move/', sourceLabel: 'Daihatsu Japan — Move' },
  { id: 'daihatsu-hijet-cargo-s321', brandId: 'daihatsu', name: 'Hijet Cargo (S321V/S331V)', chassis: 'S321V/S331V', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-hijet-cargo-s700', brandId: 'daihatsu', name: 'Hijet Cargo (S700V/S710V)', chassis: 'S700V/S710V', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-hijet-truck-s500', brandId: 'daihatsu', name: 'Hijet Truck (S500P/S510P)', chassis: 'S500P/S510P', bodyType: 'Пикап', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-taft-la900', brandId: 'daihatsu', name: 'Taft (LA900S/LA910S)', chassis: 'LA900S/LA910S', bodyType: 'Кроссовер', sourceUrl: 'https://www.daihatsu.co.jp/lineup/taft/', sourceLabel: 'Daihatsu Japan — Taft' },
  { id: 'daihatsu-cast-la250', brandId: 'daihatsu', name: 'Cast (LA250S/LA260S)', chassis: 'LA250S/LA260S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-wake-la700', brandId: 'daihatsu', name: 'Wake (LA700S/LA710S)', chassis: 'LA700S/LA710S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-copen-la400', brandId: 'daihatsu', name: 'Copen (LA400K)', chassis: 'LA400K', bodyType: 'Купе/Спорт', sourceUrl: 'https://www.daihatsu.co.jp/lineup/copen/', sourceLabel: 'Daihatsu Japan — Copen' },

  // Suzuki — passenger and commercial kei models
  { id: 'suzuki-alto-ha24', brandId: 'suzuki', name: 'Alto (HA24S)', chassis: 'HA24S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-alto-ha36', brandId: 'suzuki', name: 'Alto (HA36S/HA36V)', chassis: 'HA36S/HA36V', bodyType: 'Хэтчбек', sourceUrl: 'https://www.suzuki.co.jp/car/alto/', sourceLabel: 'Suzuki Japan — Alto' },
  { id: 'suzuki-alto-ha37', brandId: 'suzuki', name: 'Alto (HA37S/HA97S)', chassis: 'HA37S/HA97S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.suzuki.co.jp/car/alto/assets/pdf/detail.pdf', sourceLabel: 'Suzuki Japan — официальная таблица характеристик Alto', dimensionsVerified: { length: 3395, width: 1475, height: 1525, wheelbase: 2460, groundClearance: 130 }, tireOptions: [{ size: '155/65R14 75S', notes: 'Размер указан в официальной таблице характеристик Alto; сверить комплектацию и маркировку на стойке двери.' }], wiper: { driverSide: '450 мм (NWB M45S)', passengerSide: '450 мм (NWB M45S)', notes: 'NWB fitment chart для HA37S/HA97S; задний дворник подбирается отдельно по кузову и креплению.' } },
  { id: 'suzuki-wagon-r-mh21', brandId: 'suzuki', name: 'Wagon R (MH21S/MH22S)', chassis: 'MH21S/MH22S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-wagon-r-mh34', brandId: 'suzuki', name: 'Wagon R (MH34S/MH44S)', chassis: 'MH34S/MH44S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-wagon-r-mh55', brandId: 'suzuki', name: 'Wagon R (MH55S/MH95S)', chassis: 'MH55S/MH95S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.suzuki.co.jp/car/wagonr/', sourceLabel: 'Suzuki Japan — Wagon R' },
  { id: 'suzuki-jimny-jb64', brandId: 'suzuki', name: 'Jimny (JB64W)', chassis: 'JB64W', bodyType: 'Внедорожник', sourceUrl: 'https://www.suzuki.co.jp/car/jimny/', sourceLabel: 'Suzuki Japan — Jimny' },
  { id: 'suzuki-hustler-mr31', brandId: 'suzuki', name: 'Hustler (MR31S/MR41S)', chassis: 'MR31S/MR41S', bodyType: 'Кроссовер', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-hustler-mr52', brandId: 'suzuki', name: 'Hustler (MR52S/MR92S)', chassis: 'MR52S/MR92S', bodyType: 'Кроссовер', sourceUrl: 'https://www.suzuki.co.jp/car/hustler/', sourceLabel: 'Suzuki Japan — Hustler' },
  { id: 'suzuki-spacia-mk32', brandId: 'suzuki', name: 'Spacia (MK32S/MK42S)', chassis: 'MK32S/MK42S', bodyType: 'Минивэн', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-spacia-mk53', brandId: 'suzuki', name: 'Spacia (MK53S)', chassis: 'MK53S', bodyType: 'Минивэн', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-every-da64', brandId: 'suzuki', name: 'Every (DA64V/DA64W)', chassis: 'DA64V/DA64W', bodyType: 'Минивэн', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
  { id: 'suzuki-every-da17', brandId: 'suzuki', name: 'Every (DA17V/DA17W)', chassis: 'DA17V/DA17W', bodyType: 'Минивэн', sourceUrl: 'https://www.suzuki.co.jp/car/every/', sourceLabel: 'Suzuki Japan — Every' },
  { id: 'suzuki-carry-da16', brandId: 'suzuki', name: 'Carry (DA16T)', chassis: 'DA16T', bodyType: 'Пикап', sourceUrl: 'https://www.suzuki.co.jp/accessory_car/', sourceLabel: 'Suzuki Japan — каталоги аксессуаров, включая прошлые модели' },
];

function makeKeiIndexModel(entry: KeiIndexEntry): JapaneseCarModel {
  return {
    id: entry.id,
    brandId: entry.brandId,
    name: entry.name,
    generation: `Кузов ${entry.chassis}; поколение и годы требуют подтверждения по первичному источнику`,
    years: NO_DATA,
    bodyType: entry.bodyType,
    drivetrain: 'Нет подтверждённых данных для точной модификации; проверить код кузова и комплектацию.',
    awdSystemName: 'Нет подтверждённых данных для точной модификации',
    overview: `Индекс японского кей-кара для внутреннего рынка. Код кузова указан для идентификации семейства; не переносить характеристики между поколениями, приводами и комплектациями.`,
    dimensions: {
      lengthMm: entry.dimensionsVerified?.length ?? null,
      widthMm: entry.dimensionsVerified?.width ?? null,
      heightMm: entry.dimensionsVerified?.height ?? null,
      wheelbaseMm: entry.dimensionsVerified?.wheelbase ?? null,
      groundClearanceMm: entry.dimensionsVerified?.groundClearance ?? null,
      trunkVolumeLiters: NO_DATA,
      fuelTankLiters: null,
      curbWeightKg: NO_DATA,
      ...(entry.dimensionsVerified ? {
        length: entry.dimensionsVerified.length,
        width: entry.dimensionsVerified.width,
        height: entry.dimensionsVerified.height,
        wheelbase: entry.dimensionsVerified.wheelbase,
        groundClearance: entry.dimensionsVerified.groundClearance,
      } : {}),
    },
    ...(entry.wiper ? { wiperBladeSize: [entry.wiper] } : {}),
    ...(entry.tireOptions ? {
      tires: entry.tireOptions.map((tire) => {
        const match = tire.size.match(/^(\d{3})\/(\d{2})R(\d{2})/);
        if (!match) throw new Error('Invalid tire size: ' + tire.size);
        const width = Number(match[1]);
        const aspectRatio = Number(match[2]);
        const rimDiameter = Number(match[3]) * 25.4;
        return {
          size: tire.size, width, aspectRatio, rimDiameter,
          diameter: rimDiameter + 2 * width * aspectRatio / 100,
          loadIndex: tire.size.includes('75V') ? '75' : '75',
          speedRating: tire.size.includes('75V') ? 'V' : 'S',
          notes: tire.notes,
        };
      }),
    } : {}),
    engines: [],
    transmissions: [],
    fuelEconomy: {
      city: NO_DATA,
      highway: NO_DATA,
      combined: NO_DATA,
      fuelGrade: NO_DATA,
    },
    fluidsAndCapacities: {
      engineOil: NO_DATA,
      engineOilVolume: NO_DATA,
      transmissionFluid: NO_DATA,
      transferCaseAndDiff: NO_DATA,
      coolant: NO_DATA,
      brakeFluid: NO_DATA,
    },
    bulbsSummary: {
      lowBeam: NO_DATA,
      highBeam: NO_DATA,
      fogLights: NO_DATA,
      frontTurn: NO_DATA,
      tailStop: NO_DATA,
      interior: NO_DATA,
    },
    obdDiagnostics: {
      portLocation: NO_DATA,
      commonCodes: [],
      protocol: NO_DATA,
    },
    knownIssues: [],
    dataQualityNote: entry.dimensionsVerified || entry.tireOptions ? 'Частичные параметры добавлены только по указанному официальному источнику. Остальные поля не подтверждены для точной модификации и не должны выводиться как известные. Размеры шин и давление необходимо сверять с табличкой конкретного автомобиля.' : 'Добавлена только индексная запись. Официальная ссылка подтверждает семейство/название модели, но не подтверждает здесь код кузова, годы выпуска или технические характеристики. До проверки руководства владельца/сервисного мануала точной версии эти поля намеренно оставлены неподтверждёнными.',
    verificationStatus: 'unverified',
    sourceReferences: [
      { label: entry.sourceLabel, url: entry.sourceUrl, scope: entry.dimensionsVerified || entry.tireOptions ? 'Официальный источник производителя; подтверждает только перечисленные параметры для соответствующей версии. Не переносить на другие комплектации или рынки.' : 'Официальный ресурс производителя для семейства/каталога. Не считать доказательством годов выпуска, точного кода кузова или технических параметров этой записи.' },
      ...(entry.wiper ? [{ label: 'NWB — таблица подбора стеклоочистителей', url: 'https://nwb.wiper-kensaku.com/docs/DCM_2_4_HONDA.pdf', scope: 'Подбор по коду кузова для Honda; номера серий NWB приведены в поле размера. Перед заказом сверить конкретный год, вариант кузова и крепление.' }] : []),
    ],
    lastReviewed: '2026-10-24',
  };
}

for (const entry of entries) {
  const brand = JAPANESE_BRANDS.find((candidate) => candidate.id === entry.brandId);
  if (!brand) throw new Error(`Unknown kei-car brand: ${entry.brandId}`);
  if (brand.models.some((model) => model.id === entry.id)) {
    throw new Error(`Duplicate kei-car model id: ${entry.id}`);
  }
  brand.models.push(makeKeiIndexModel(entry));
}

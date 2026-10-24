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
  dimensionsVerified?: Partial<{ length: number; width: number; height: number; wheelbase: number; groundClearance: number }>;
  additionalSources?: { label: string; url: string; scope: string }[];
  tireOptions?: { size: string; notes: string }[];
  fuelTankVerified?: number;
  wiper?: { driverSide: string; passengerSide: string; notes: string };
  wiperSource?: { label: string; url: string; scope: string };
  fluidsVerified?: Partial<JapaneseCarModel['fluidsAndCapacities']>;
  bulbsVerified?: Partial<JapaneseCarModel['bulbsSummary']>;
  maintenanceTips?: string[];
};

const NO_DATA = 'Нет подтверждённых данных для точной модификации';
const entries: KeiIndexEntry[] = [
  // Toyota — Pixis kei range
  { id: 'toyota-pixis-epoch-la300', brandId: 'toyota', name: 'Pixis Epoch (LA300A/LA310A)', chassis: 'LA300A/LA310A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/carlineup/', sourceLabel: 'Toyota Japan — каталог моделей' },
  { id: 'toyota-pixis-epoch-la350', brandId: 'toyota', name: 'Pixis Epoch (LA350A/LA360A)', chassis: 'LA350A/LA360A', bodyType: 'Хэтчбек', sourceUrl: 'https://manual.toyota.jp/pixisepoch/', sourceLabel: 'Toyota Japan — руководство владельца Pixis Epoch', tireOptions: [{ size: '155/65R14', notes: 'Размер указан для отдельных актуальных комплектаций Pixis Epoch в каталоге Toyota; проверить табличку автомобиля и точный типоразмер для конкретной комплектации.' }], wiper: { driverSide: '550 мм (специальный тип)', passengerSide: '350 мм (специальный тип)', notes: 'Для LA350A/LA360A в подборе по комплектациям указан также задний дворник 275 мм; тип крепления отличается от обычного U-hook, сверить перед покупкой.' }, wiperSource: { label: 'Wiper Jp — каталог по кузову Pixis Epoch', url: 'https://wiper.jp/TOYOTA/PIXIS-EPOCH.html', scope: 'Вторичный каталог по годам, кузову и комплектации: LA350A/LA360A — передние 550/350 мм специального типа, задний 275 мм.' }, maintenanceTips: ['Подбирать шины по табличке автомобиля и точной комплектации: данные каталога для одной версии не означают универсальную применимость ко всем LA350A/LA360A.', 'У передних дворников специальный тип крепления; одной длины щётки недостаточно для правильного подбора.'] },
  { id: 'toyota-pixis-space-l575', brandId: 'toyota', name: 'Pixis Space (L575A/L585A)', chassis: 'L575A/L585A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/carlineup/', sourceLabel: 'Toyota Japan — каталог моделей' },
  { id: 'toyota-pixis-mega-la700', brandId: 'toyota', name: 'Pixis Mega (LA700A/LA710A)', chassis: 'LA700A/LA710A', bodyType: 'Хэтчбек', sourceUrl: 'https://toyota.jp/carlineup/', sourceLabel: 'Toyota Japan — каталог моделей' },
  { id: 'toyota-pixis-van-s321', brandId: 'toyota', name: 'Pixis Van (S321M/S331M)', chassis: 'S321M/S331M', bodyType: 'Минивэн', sourceUrl: 'https://toyota.jp/pixisvan/', sourceLabel: 'Toyota Japan — Pixis Van' },
  { id: 'toyota-pixis-van-s700', brandId: 'toyota', name: 'Pixis Van (S700M/S710M)', chassis: 'S700M/S710M', bodyType: 'Минивэн', sourceUrl: 'https://toyota.jp/pixisvan/', sourceLabel: 'Toyota Japan — Pixis Van' },
  { id: 'toyota-pixis-truck-s500', brandId: 'toyota', name: 'Pixis Truck (S500U/S510U)', chassis: 'S500U/S510U', bodyType: 'Пикап', sourceUrl: 'https://toyota.jp/pixistruck/', sourceLabel: 'Toyota Japan — Pixis Truck' },

  // Honda — N-series and earlier kei models
  { id: 'honda-nbox-jf1', brandId: 'honda', name: 'N-BOX (JF1/JF2)', chassis: 'JF1/JF2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/customer/auto/n-box/faq/qa015/', sourceLabel: 'Honda Japan — FAQ по колёсам N-BOX', tireOptions: [{ size: '145/80R13 75S', notes: 'Штатный размер для отдельных базовых комплектаций JF1/JF2; проверить шильдик автомобиля.' }, { size: '155/65R14 75S', notes: 'Для отдельных комплектаций JF1/JF2; проверить шильдик автомобиля.' }, { size: '165/55R15 75V', notes: 'Для отдельных турбированных комплектаций JF1/JF2; проверить шильдик автомобиля.' }], wiper: { driverSide: '450 мм (NWB M45S)', passengerSide: '430 мм (NWB M43S)', notes: 'NWB fitment chart для JF1/JF2; сверить год, крепление и задний дворник отдельно.' } },
  { id: 'honda-nbox-jf3', brandId: 'honda', name: 'N-BOX (JF3/JF4)', chassis: 'JF3/JF4', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/customer/auto/n-box/faq/qa015/', sourceLabel: 'Honda Japan — FAQ по колёсам N-BOX', tireOptions: [{ size: '155/65R14 75S', notes: 'Официальный размер для обычных версий JF3/JF4; давление и применимость сверять по табличке.' }, { size: '165/55R15 75V', notes: 'Официальный размер для отдельных версий Custom Turbo; давление и применимость сверять по табличке.' }], wiper: { driverSide: '480 мм (NWB M48S)', passengerSide: '430 мм (NWB M43S)', notes: 'NWB fitment chart для JF3/JF4; сверить год, крепление и задний дворник отдельно.' } },
  { id: 'honda-nbox-jf5', brandId: 'honda', name: 'N-BOX (JF5/JF6)', chassis: 'JF5/JF6', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/ownersmanual/webom/jpn/n-box/2026/details/136238090-15246.html', sourceLabel: 'Honda Japan — руководство владельца N-BOX 2026', tireOptions: [{ size: '155/65R14 75S', notes: 'Официальный размер для соответствующих комплектаций; давление по руководству: перед 240 кПа, зад 230 кПа.' }, { size: '165/55R15 75V', notes: 'Официальный размер для отдельных комплектаций; давление по руководству 220 кПа спереди и сзади. Проверить табличку конкретного автомобиля.' }], fluidsVerified: { engineOil: 'Honda ULTRA NEXT / ULTRA Green / ULTRA LEO; API SN или выше, 0W-16 или 0W-20 (атмосферный двигатель). Для турбо: ULTRA LEO / ULTRA LTD, API SN или выше, 0W-20 или 5W-30.', engineOilVolume: '2,4 л при замене; 2,8 л с заменой фильтра', transmissionFluid: 'Honda Ultra HCF-2; 2,5 л (2WD) / 2,55 л (4WD) при замене', transferCaseAndDiff: 'Только 4WD: трансфер Honda Ultra DPSF-II — 0,43 л; задний дифференциал Honda Ultra HGO-μ — 0,33 л при замене', coolant: 'Honda Ultra e-Coolant, концентрация 50%; 2,81 л при замене (включая резервуар 0,31 л)', brakeFluid: 'Honda Genuine Brake Fluid DOT 3 или DOT 4' }, bulbsVerified: { lowBeam: 'LED', highBeam: 'LED', fogLights: 'Нет единой спецификации: зависит от комплектации', frontTurn: 'LED', tailStop: 'LED', interior: 'Салонные/карго лампы LED или 12V-8W/12V-5W в зависимости от места и комплектации' }, maintenanceTips: ['Давление и точный размер шин сверять с наклейкой на стойке двери: в руководстве есть разные значения для 14- и 15-дюймовых шин.', 'Не смешивать жидкости разных типов без проверки руководства; для вариатора указана Honda Ultra HCF-2.', 'На 4WD отдельно учитывать жидкость трансфера и заднего дифференциала; это разные узлы и разные жидкости.', 'Для турбоверсии руководство допускает другой набор моторных масел, чем для атмосферной версии.'] },
  { id: 'honda-nbox-plus-jf1', brandId: 'honda', name: 'N-BOX+ (JF1/JF2)', chassis: 'JF1/JF2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/auto-archive/nboxplus/2017/webcatalog/performance/spec/', sourceLabel: 'Honda Japan — официальный архив характеристик N-BOX+ 2017', dimensionsVerified: { length: 3395, width: 1475, height: 1780, wheelbase: 2520, groundClearance: 150 }, tireOptions: [{ size: '155/65R14 75S', notes: 'Указан в официальной таблице характеристик N-BOX+ 2017; перед подбором проверить конкретную комплектацию и маркировку шин.' }], maintenanceTips: ['У N-BOX+ высота кузова в официальной таблице различается по приводу: 1780 мм для 2WD и 1800 мм для 4WD; в каталоге указано значение 2WD, поэтому для 4WD высоту считать неподтверждённой.', 'Размер шин подтверждён архивной таблицей Honda, но давление для конкретной версии пока не внесено — сверить наклейку на автомобиле.'] },
  { id: 'honda-nbox-slash-jf1', brandId: 'honda', name: 'N-BOX Slash (JF1/JF2)', chassis: 'JF1/JF2', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N/papercraft/jp/index.html', sourceLabel: 'Honda — история и линейка N-серии' },
  { id: 'honda-nwgn-jh1', brandId: 'honda', name: 'N-WGN (JH1/JH2)', chassis: 'JH1/JH2', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N-WGN/', sourceLabel: 'Honda Japan — N-WGN', wiper: { driverSide: '530 мм (NWB M53S)', passengerSide: '350 мм (NWB M35S)', notes: 'NWB fitment chart для JH1/JH2; крепление и год выпуска нужно сверить.' } },
  { id: 'honda-nwgn-jh3', brandId: 'honda', name: 'N-WGN (JH3/JH4)', chassis: 'JH3/JH4', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/ownersmanual/webom/jpn/n-wgn/2026/details/136172090-15246.html', sourceLabel: 'Honda Japan — руководство владельца N-WGN 2026', tireOptions: [{ size: '155/65R14 75S', notes: 'Атмосферные версии: давление по руководству 240 кПа спереди и 230 кПа сзади.' }, { size: '165/55R15 75V', notes: 'Турбоверсии: давление по руководству 210 кПа спереди и сзади; сверить точную комплектацию.' }], fluidsVerified: { engineOil: 'Атмосферный: Honda ULTRA NEXT / ULTRA Green / ULTRA LEO, API SN или выше, 0W-16 или 0W-20. Турбо: ULTRA LEO / ULTRA LTD, API SN или выше, 0W-20 или 5W-30.', engineOilVolume: '2,4 л при замене; 2,8 л при замене масла и фильтра', transmissionFluid: 'Honda Ultra HCF-2; 2,5 л (2WD) / 2,55 л (4WD) при замене', transferCaseAndDiff: 'Только 4WD: трансфер Honda Ultra DPSF-II — 0,43 л; задний дифференциал Honda Ultra HGO-μ — 0,33 л при замене', coolant: 'Honda Ultra e-Coolant, 50%; 2,79 л атмосферный / 2,78 л турбо при замене (включая резервуар 0,31 л)', brakeFluid: 'Honda Genuine Brake Fluid DOT 3 или DOT 4' }, wiper: { driverSide: '530 мм (NWB M53S)', passengerSide: '350 мм (NWB M35S)', notes: 'NWB fitment chart для JH3/JH4; крепление и год выпуска нужно сверить.' }, maintenanceTips: ['Давление различается у атмосферных и турбоверсий: не использовать значение от другой комплектации.', 'Для 4WD в руководстве указаны отдельные жидкости трансфера и заднего дифференциала.', 'Подтверждённый размер шин и допустимое давление сверять с табличкой на автомобиле.'] },
  { id: 'honda-none-jg1', brandId: 'honda', name: 'N-ONE (JG1/JG2)', chassis: 'JG1/JG2', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/N-ONE/', sourceLabel: 'Honda Japan — N-ONE', wiper: { driverSide: '480 мм (NWB M48S)', passengerSide: 'Нет подтверждённых данных', notes: 'NWB chart does not list a separate passenger-side blade for this model; do not infer it from another generation.' } },
  { id: 'honda-none-jg3', brandId: 'honda', name: 'N-ONE (JG3/JG4)', chassis: 'JG3/JG4', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/ownersmanual/webom/jpn/n-one/2026/details/682ab283d57037-55892755.html', sourceLabel: 'Honda Japan — руководство владельца N-ONE 2026', dimensionsVerified: { length: 3395, width: 1475, wheelbase: 2520 }, tireOptions: [{ size: '155/65R14 75S', notes: 'Для версий с 14-дюймовыми колёсами: 240 кПа спереди и 230 кПа сзади.' }, { size: '165/55R15 75V', notes: 'Для версий с 15-дюймовыми колёсами: 210 кПа спереди и сзади. Проверить точную комплектацию.' }], fluidsVerified: { engineOil: 'Атмосферный: Honda ULTRA NEXT / ULTRA Green / ULTRA LEO, API SN или выше, 0W-16 или 0W-20. Турбо: ULTRA LEO / ULTRA LTD, API SN или выше, 0W-20 или 5W-30.', engineOilVolume: '2,4 л при замене; 2,8 л при замене масла и фильтра', transmissionFluid: 'Для CVT: Honda Ultra HCF-2; объём замены уточнять по 2WD/4WD и точной модификации', transferCaseAndDiff: 'Только 4WD: трансфер Honda Ultra DPSF-II — 0,43 л; задний дифференциал Honda Ultra HGO-μ — 0,33 л при замене', coolant: 'Honda Ultra e-Coolant, концентрация 50%; атмосферный 2,76 л, турбо CVT 2,83 л при замене (включая резервуар и отопитель; для отдельных версий значения отличаются)', brakeFluid: 'Honda Genuine Brake Fluid DOT 3 или DOT 4' }, bulbsVerified: { lowBeam: 'LED', highBeam: 'LED', fogLights: 'Зависит от комплектации', frontTurn: 'LED', tailStop: 'LED', interior: '12V-8W; отдельные плафоны/опции могут отличаться' }, wiper: { driverSide: '480 мм (NWB M48S)', passengerSide: '380 мм (NWB M38S)', notes: 'NWB fitment chart для JG3/JG4; сверить год и крепление.' }, maintenanceTips: ['Для атмосферных и турбоверсий допускаются разные вязкости моторного масла — сверить тип двигателя.', 'Давление зависит от диаметра колёс: 14 дюймов — 240/230 кПа, 15 дюймов — 210/210 кПа.', 'Для 4WD предусмотрены отдельные жидкости трансфера и заднего дифференциала.', 'При подборе ламп учитывать комплектацию: основные наружные световые приборы в руководстве указаны как LED.'] },
  { id: 'honda-nvan-jj1', brandId: 'honda', name: 'N-VAN (JJ1/JJ2)', chassis: 'JJ1/JJ2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/N-VAN/', sourceLabel: 'Honda Japan — N-VAN', wiper: { driverSide: '500 мм (NWB M50S)', passengerSide: '400 мм (NWB M40S)', notes: 'NWB fitment chart для JJ1/JJ2; у high-roof/low-roof версий возможны отличия, сверить исполнение.' } },
  { id: 'honda-s660-jw5', brandId: 'honda', name: 'S660 (JW5)', chassis: 'JW5', bodyType: 'Купе/Спорт', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },
  { id: 'honda-life-jb5', brandId: 'honda', name: 'Life (JB5/JB6/JB7/JB8)', chassis: 'JB5/JB6/JB7/JB8', bodyType: 'Хэтчбек', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },
  { id: 'honda-acty-hh5', brandId: 'honda', name: 'Acty Van (HH5/HH6)', chassis: 'HH5/HH6', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },
  { id: 'honda-vamos-hm1', brandId: 'honda', name: 'Vamos (HM1/HM2)', chassis: 'HM1/HM2', bodyType: 'Минивэн', sourceUrl: 'https://www.honda.co.jp/auto-archive/', sourceLabel: 'Honda — архив моделей' },

  // Daihatsu — passenger and commercial kei models
  { id: 'daihatsu-mira-es-la300', brandId: 'daihatsu', name: 'Mira e:S (LA300S/LA310S)', chassis: 'LA300S/LA310S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/', sourceLabel: 'Daihatsu Japan — каталог моделей' },
  { id: 'daihatsu-mira-es-la350', brandId: 'daihatsu', name: 'Mira e:S (LA350S/LA360S)', chassis: 'LA350S/LA360S', bodyType: 'Хэтчбек', sourceUrl: 'https://www.daihatsu.co.jp/lineup/mira_e-s/pdf/specifications.pdf', sourceLabel: 'Daihatsu Japan — официальная таблица характеристик Mira e:S', dimensionsVerified: { length: 3395, width: 1475, wheelbase: 2455 }, tireOptions: [{ size: '155/65R14 75S', notes: 'Официальная таблица характеристик для соответствующих комплектаций.' }, { size: '155/70R13 75S', notes: 'Официальная таблица характеристик для соответствующих комплектаций.' }], wiper: { driverSide: '550 мм (специальный тип)', passengerSide: '350 мм (специальный тип)', notes: 'Для LA350S/LA360S в подборе по комплектациям указан задний дворник 275 мм; передние щётки специального типа.' }, wiperSource: { label: 'Wiper Jp — каталог по кузову Mira e:S', url: 'https://wiper.jp/DAIHATSU/MIRA-ES.html', scope: 'Вторичный каталог по комплектациям LA350S/LA360S указывает передние щётки специального типа 550/350 мм и заднюю 275 мм.' }, maintenanceTips: ['Для указанных в руководстве размеров шин давление составляет 260 кПа (2,6 бар) спереди и сзади; перед накачиванием сверить размер с табличкой автомобиля.', 'Руководство рекомендует перестановку шин через каждые 5 000 км; учитывать направление вращения и рекомендации изготовителя шин.', 'Передние дворники специального типа; сверять крепление и заднюю щётку по кузову.'], additionalSources: [{ label: 'Daihatsu Mira e:S — руководство владельца (2025)', url: 'https://www.daihatsu.co.jp/service/torisetu/mira_e-s/pdf/mira_es_full_2506.pdf', scope: 'Руководство подтверждает давление 260 кПа для размеров 155/70R13 75S и 155/65R14 75S, а также рекомендацию по перестановке шин каждые 5 000 км.' }] },
  { id: 'daihatsu-tanto-l375', brandId: 'daihatsu', name: 'Tanto (L375S/L385S)', chassis: 'L375S/L385S', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/tanto/index.htm', sourceLabel: 'Daihatsu Japan — Tanto' },
  { id: 'daihatsu-tanto-la600', brandId: 'daihatsu', name: 'Tanto (LA600S/LA610S)', chassis: 'LA600S/LA610S', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/tanto/index.htm', sourceLabel: 'Daihatsu Japan — Tanto' },
  { id: 'daihatsu-tanto-la650', brandId: 'daihatsu', name: 'Tanto (LA650S/LA660S)', chassis: 'LA650S/LA660S', bodyType: 'Минивэн', sourceUrl: 'https://www.daihatsu.co.jp/lineup/tanto/pdf/specifications.pdf', sourceLabel: 'Daihatsu Japan — официальная таблица характеристик Tanto', fuelTankVerified: 30, tireOptions: [{ size: '155/65R14 75S', notes: 'Штатный размер для соответствующих комплектаций; в руководстве указано 240 кПа спереди и сзади.' }, { size: '165/55R15 75V', notes: 'Штатный размер для отдельных комплектаций; в руководстве указано 240 кПа спереди и сзади. Сверить размер по табличке автомобиля.' }], maintenanceTips: ['Проверять давление на холодных шинах; для двух указанных заводских размеров руководство приводит 240 кПа спереди и сзади.', 'Руководство рекомендует перестановку шин каждые 5 000 км для равномерного износа.', 'Номинальный объём топливного бака — 30 л; не путать с фактическим объёмом дозаправки.'], additionalSources: [{ label: 'Daihatsu Tanto — руководство владельца (2025)', url: 'https://www.daihatsu.co.jp/service/torisetu/tanto/pdf/tanto_slim_2506.pdf', scope: 'Подтверждает бак 30 л, давление 240 кПа для размеров 155/65R14 75S и 165/55R15 75V, а также рекомендацию по перестановке шин через 5 000 км.' }] },
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
  { id: 'suzuki-hustler-mr52', brandId: 'suzuki', name: 'Hustler (MR52S/MR92S)', chassis: 'MR52S/MR92S', bodyType: 'Кроссовер', sourceUrl: 'https://www.suzuki.co.jp/car/hustler/detail/pdf/detail.pdf', sourceLabel: 'Suzuki Japan — официальные характеристики Hustler', dimensionsVerified: { length: 3395, width: 1475, wheelbase: 2460 }, tireOptions: [{ size: '165/60R15 77H', notes: 'Размер для семейства MR52S/MR92S по официальным материалам Suzuki; проверить комплектацию и маркировку шин на автомобиле.' }], wiper: { driverSide: '400 мм', passengerSide: '425 мм', notes: 'Вторичный каталог по MR52S/MR92S; задний дворник указан 200 мм. Проверить крепление и год выпуска.' }, wiperSource: { label: 'Wiper Jp — каталог по кузову Hustler', url: 'https://wiper.jp/SUZUKI/HUSTLER.html', scope: 'Вторичный каталог по комплектациям MR52S/MR92S: передние 400/425 мм, задний 200 мм.' }, maintenanceTips: ['У Hustler размер шин 165/60R15; не переносить размер на Wagon R или другие Suzuki kei-модели.', 'Минимальный дорожный просвет отличается между 2WD и 4WD, поэтому для выбора маршрута и защиты днища учитывайте конкретный привод.'], additionalSources: [{ label: 'Suzuki Digital Library — Hustler второго поколения', url: 'https://www.suzuki.co.jp/suzuki_digital_library/pdf/1_auto/hustler/206.pdf', scope: 'Архивная официальная таблица подтверждает размер шин 165/60R15 77H для семейства второго поколения.' }] },
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
      fuelTankLiters: entry.fuelTankVerified ?? null,
      curbWeightKg: NO_DATA,
      ...(entry.dimensionsVerified?.length !== undefined ? { length: entry.dimensionsVerified.length } : {}),
      ...(entry.dimensionsVerified?.width !== undefined ? { width: entry.dimensionsVerified.width } : {}),
      ...(entry.dimensionsVerified?.height !== undefined ? { height: entry.dimensionsVerified.height } : {}),
      ...(entry.dimensionsVerified?.wheelbase !== undefined ? { wheelbase: entry.dimensionsVerified.wheelbase } : {}),
      ...(entry.dimensionsVerified?.groundClearance !== undefined ? { groundClearance: entry.dimensionsVerified.groundClearance } : {}),
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
          loadIndex: tire.size.match(/R\d{2}\s+(\d{2,3})[A-Z]$/)?.[1] ?? 'Нет данных',
          speedRating: tire.size.match(/R\d{2}\s+\d{2,3}([A-Z])$/)?.[1] ?? 'Нет данных',
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
      engineOil: entry.fluidsVerified?.engineOil ?? NO_DATA,
      engineOilVolume: entry.fluidsVerified?.engineOilVolume ?? NO_DATA,
      transmissionFluid: entry.fluidsVerified?.transmissionFluid ?? NO_DATA,
      transferCaseAndDiff: entry.fluidsVerified?.transferCaseAndDiff ?? NO_DATA,
      coolant: entry.fluidsVerified?.coolant ?? NO_DATA,
      brakeFluid: entry.fluidsVerified?.brakeFluid ?? NO_DATA,
    },
    bulbsSummary: {
      lowBeam: entry.bulbsVerified?.lowBeam ?? NO_DATA,
      highBeam: entry.bulbsVerified?.highBeam ?? NO_DATA,
      fogLights: entry.bulbsVerified?.fogLights ?? NO_DATA,
      frontTurn: entry.bulbsVerified?.frontTurn ?? NO_DATA,
      tailStop: entry.bulbsVerified?.tailStop ?? NO_DATA,
      interior: entry.bulbsVerified?.interior ?? NO_DATA,
    },
    ...(entry.maintenanceTips ? { maintenanceTips: entry.maintenanceTips } : {}),
    obdDiagnostics: {
      portLocation: NO_DATA,
      commonCodes: [],
      protocol: NO_DATA,
    },
    knownIssues: [],
    dataQualityNote: entry.dimensionsVerified || entry.tireOptions || entry.wiper ? 'Частичные параметры добавлены только по указанным источникам. Остальные поля не подтверждены для точной модификации и не должны выводиться как известные. Размеры шин, давление и длину/крепление дворников необходимо сверять с табличкой автомобиля и фактически установленными деталями.' : 'Добавлена только индексная запись. Официальная ссылка подтверждает семейство/название модели, но не подтверждает здесь код кузова, годы выпуска или технические характеристики. До проверки руководства владельца/сервисного мануала точной версии эти поля намеренно оставлены неподтверждёнными.',
    verificationStatus: 'unverified',
    sourceReferences: [
      { label: entry.sourceLabel, url: entry.sourceUrl, scope: entry.dimensionsVerified || entry.tireOptions ? 'Официальный источник производителя; подтверждает только перечисленные параметры для соответствующей версии. Не переносить на другие комплектации или рынки.' : 'Официальный ресурс производителя для семейства/каталога. Не считать доказательством годов выпуска, точного кода кузова или технических параметров этой записи.' },
      ...(entry.wiper ? [entry.wiperSource ?? { label: 'NWB — таблица подбора стеклоочистителей', url: entry.brandId === 'suzuki' ? 'https://nwb.wiper-kensaku.com/docs/DCM_5_9_SUZUKI.pdf' : 'https://nwb.wiper-kensaku.com/docs/DCM_2_4_HONDA.pdf', scope: 'Каталог подбора NWB по коду кузова; номера серий указаны вместе с длиной. Перед заказом сверить год, вариант кузова, крепление и задний дворник отдельно.' }] : []),
      ...(entry.additionalSources ?? []),
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

export interface FluidSpec {
  name: string;
  volume: string;
  specification: string;
  recommendedBrands: string;
  changeInterval: string;
  proTip: string;
}

export const FLUIDS_DATA: FluidSpec[] = [
  {
    name: 'Моторное масло (ДВС)',
    volume: '4.3 л (4G63 2.0L) / 4.6 л (4G64, 4G69 2.4L)',
    specification: 'API SN/SP, ACEA A3/B4, вязкость 5W-30 (для зимы и умеренного климата) или 5W-40 (для лета и пробегов 150k+)',
    recommendedBrands: 'Idemitsu Zepro 5W-30, Shell Helix Ultra 5W-40, Mobil 1 FS 5W-30, Lukoil Genesis Armortech 5W-40',
    changeInterval: 'Каждые 7 000 – 7 500 км (городской режим) или 250 моточасов',
    proTip: 'Двигатели серии 4G6 чувствительны к чистоте каналов гидрокомпенсаторов и нагару на кольцах. Никогда не катайте дилерские 15 000 км!'
  },
  {
    name: 'Масло в автоматическую коробку передач (АКПП)',
    volume: '7.8 – 8.1 л (полный объем гидротрансформатора и каналов) / ~4.2 л (частичный слив с поддона)',
    specification: 'СТРОГО спецификация Mitsubishi Diamond ATF SP-III (MZ320216)',
    recommendedBrands: 'Mitsubishi Diamond ATF SP-III, ZIC ATF SP-3, Idemitsu ATF Type-HK, Eneos ATF SP-III',
    changeInterval: 'Каждые 40 000 – 50 000 км (частичная или метод вытеснения)',
    proTip: 'Запрещено заливать современные маловязкие жидкости (WS, Mercon LV) или обычный Dexron! Уровень проверяется ТОЛЬКО на прогретой заведенной машине в положении "N".'
  },
  {
    name: 'Масло в механическую коробку передач (МКПП)',
    volume: '2.2 – 2.3 л',
    specification: 'API GL-4, SAE 75W-90 или 75W-85',
    recommendedBrands: 'Castrol Transmax Manual Multivehicle 75W-90, ZIC GFT 75W-90, Neste Pro Gear 75W-90',
    changeInterval: 'Каждые 60 000 км',
    proTip: 'Строго GL-4! Масла стандарта GL-5 содержат агрессивные присадки серы и фосфора, разрушающие бронзовые синхронизаторы МКПП.'
  },
  {
    name: 'Масло в раздаточную коробку (угловой редуктор 4WD)',
    volume: '0.55 л',
    specification: 'API GL-5 для гипоидных передач, SAE 75W-90 или 80W-90',
    recommendedBrands: 'Mobil 1 Mobilube 75W-90 GL-5, Motul Gear 300 75W-90, Castrol Syntrax Long Life',
    changeInterval: 'Каждые 40 000 – 50 000 км',
    proTip: 'Объем очень маленький (чуть больше пол-литра)! Даже незначительное подтекание через сальник привода способно осушить раздатку за 2000 км.'
  },
  {
    name: 'Масло в задний дифференциал (редуктор моста 4WD)',
    volume: '0.5 л',
    specification: 'API GL-5, SAE 80W-90 (умеренный) или 75W-90 (холодные зимы)',
    recommendedBrands: 'Mobilube HD 80W-90, Liqui Moly Vollsynthetisches Hypoid-Getriebeoil 75W-90',
    changeInterval: 'Каждые 40 000 – 50 000 км',
    proTip: 'Обязательно очищать магнит сливной пробки от металлического ежика. Проверять сапун редуктора на подвижность (если сапун забит грязью, масло выдавит через сальники).'
  },
  {
    name: 'Охлаждающая жидкость (антифриз)',
    volume: '7.0 – 7.5 л',
    specification: 'Карбоксилатный (OAT) или фосфатно-лобридный (P-OAT) антифриз класса G12 / G12+ (зеленый/синий или красный)',
    recommendedBrands: 'Coolstream JPN, TCL Long Life Coolant, Ravenol HJC, Sintec Platinum G12+',
    changeInterval: 'Каждые 3-4 года или 60 000 км',
    proTip: 'Не использовать дешевый тосол или силикатный G11 — он образует осадок и забивает тонкие каналы радиатора печки отопителя салона.'
  },
  {
    name: 'Тормозная жидкость и сцепление',
    volume: '1.0 л',
    specification: 'DOT 4 или DOT 4 Class 6 (с пониженной вязкостью для быстрой работы ABS зимой)',
    recommendedBrands: 'Castrol React DOT4 Low Temp, Brembo DOT4, ATE SL.6, Rosdot 4',
    changeInterval: 'Каждые 2 года или 30 000 км (гигроскопична, набирает влагу)',
    proTip: 'Тормозная жидкость с влажностью > 3% вызывает закипание в суппортах при затяжном торможении и внутреннюю коррозию поршней.'
  },
  {
    name: 'Жидкость гидроусилителя руля (ГУР)',
    volume: '1.0 л',
    specification: 'Mitsubishi Diamond ATF SP-III или качественный Dexron III',
    recommendedBrands: 'Idemitsu ATF, ZIC ATF 3, Mobil ATF 320',
    changeInterval: 'Каждые 40 000 – 50 000 км',
    proTip: 'В бачке ГУР снизу установлена мелкая сетка. При замене жидкости бачок желательно снять и промыть очистителем тормозов от осадка.'
  }
];

export const TORQUE_SPECS_DATA = [
  { item: 'Колесные гайки (M12x1.5)', value: '98 – 118 Н·м', notes: 'Затягивать крест-накрест' },
  { item: 'Свечи зажигания (резьба М14)', value: '25 Н·м', notes: 'Строго на холодном двигателе' },
  { item: 'Сливная пробка поддона картера ДВС', value: '39 – 44 Н·м', notes: 'Новая медная шайба MD050317' },
  { item: 'Сливная пробка поддона АКПП', value: '32 Н·м', notes: 'Очистить магнит от стружки' },
  { item: 'Пробки раздатки и редуктора (слив/залив)', value: '32 Н·м', notes: 'Алюминиевые шайбы MF660066' },
  { item: 'Ступичная гайка (передняя / задняя)', value: '196 – 255 Н·м', notes: 'Законтрить шплинтом / кернением' },
  { item: 'Болт шкива коленчатого вала', value: '167 – 176 Н·м', notes: 'Очистить резьбу, не смазывать' },
  { item: 'Болты направляющих пальцев суппорта', value: '32 Н·м', notes: 'Полигликолевая смазка' },
  { item: 'Болты крепления скобы переднего суппорта', value: '100 Н·м', notes: 'Синий фиксатор резьбы' },
  { item: 'Болты крепления скобы заднего суппорта', value: '60 Н·м', notes: 'Синий фиксатор резьбы' },
  { item: 'Гайки стоек переднего стабилизатора', value: '35 – 45 Н·м', notes: 'Придерживать палец шестигранником' },
  { item: 'Болты заднего поперечного рычага (развал)', value: '90 – 100 Н·м', notes: 'Затягивать под весом авто' }
];

export interface ServiceCheckItem {
  id: string;
  name: string;
  system: string;
  type: 'Замена' | 'Проверка' | 'Очистка' | 'Смазка';
  frequencyKm: number;
  frequencyMonths: number;
  importance: 'critical' | 'standard';
}

export const MAINTENANCE_SCHEDULE_TEMPLATE: ServiceCheckItem[] = [
  { id: 'eng-oil', name: 'Моторное масло и масляный фильтр', system: 'Двигатель', type: 'Замена', frequencyKm: 7500, frequencyMonths: 6, importance: 'critical' },
  { id: 'air-flt', name: 'Воздушный фильтр двигателя', system: 'Впуск', type: 'Замена', frequencyKm: 15000, frequencyMonths: 12, importance: 'standard' },
  { id: 'cab-flt', name: 'Салонный фильтр климата', system: 'Кузов', type: 'Замена', frequencyKm: 15000, frequencyMonths: 12, importance: 'standard' },
  { id: 'brk-chk', name: 'Проверка толщины колодок и подвижности суппортов', system: 'Тормоза', type: 'Проверка', frequencyKm: 15000, frequencyMonths: 12, importance: 'critical' },
  { id: 'brk-fld', name: 'Тормозная жидкость (DOT 4)', system: 'Тормоза', type: 'Замена', frequencyKm: 30000, frequencyMonths: 24, importance: 'critical' },
  { id: 'trn-fld', name: 'Масло в раздатке и заднем редукторе 4WD (GL-5)', system: 'Трансмиссия', type: 'Замена', frequencyKm: 45000, frequencyMonths: 36, importance: 'critical' },
  { id: 'atf-fld', name: 'Масло АКПП (Diamond ATF SP-III)', system: 'Трансмиссия', type: 'Замена', frequencyKm: 45000, frequencyMonths: 36, importance: 'critical' },
  { id: 'col-fld', name: 'Охлаждающая жидкость (антифриз G12+)', system: 'Охлаждение', type: 'Замена', frequencyKm: 60000, frequencyMonths: 48, importance: 'critical' },
  { id: 'spk-plg', name: 'Свечи зажигания (иридиевые)', system: 'Зажигание', type: 'Замена', frequencyKm: 60000, frequencyMonths: 48, importance: 'standard' },
  { id: 'tim-blt', name: 'Комплект ремней ГРМ, балансира и роликов', system: 'Двигатель', type: 'Замена', frequencyKm: 90000, frequencyMonths: 72, importance: 'critical' },
  { id: 'pmp-col', name: 'Водяная помпа охлаждения ДВС', system: 'Охлаждение', type: 'Замена', frequencyKm: 90000, frequencyMonths: 72, importance: 'critical' },
  { id: 'fal-chk', name: 'Очистка и проверка заливной горловины бака на коррозию', system: 'Топливная', type: 'Очистка', frequencyKm: 30000, frequencyMonths: 24, importance: 'critical' }
];

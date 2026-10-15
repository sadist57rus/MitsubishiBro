import { PartItem } from '../types';

export const PARTS_DATABASE: PartItem[] = [
  // ДВИГАТЕЛЬ И ГРМ
  {
    id: 'timing-belt-kit',
    name: 'Ремень ГРМ (зубчатый, 153 зуба)',
    category: 'engine',
    categoryLabel: 'Двигатель и ГРМ',
    oemNumber: 'MD326780',
    alternateOem: ['MD326781', 'MD360935'],
    analogs: [
      { brand: 'Gates', partNumber: '5535XS', quality: 'premium', comment: 'Усиленный корд, проверенный выбор клуба' },
      { brand: 'Contitech', partNumber: 'CT1000', quality: 'premium', comment: 'Высокая износостойкость резины HNBR' },
      { brand: 'Mitsuboshi', partNumber: '153YU29', quality: 'recommended', comment: 'Поставщик конвейера Mitsubishi в Японии' },
      { brand: 'Dayco', partNumber: '94875', quality: 'recommended', comment: 'Качественная альтернатива' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Основной приводной ремень газораспределительного механизма. Ресурс по регламенту 90 000 км или 6 лет.',
    installTip: 'Менять строго в паре с балансировочным ремнем и всеми роликами. Обязательно проверить свободный ход штока гидронатяжителя (3.8-4.5 мм).',
    criticalWarning: 'Обрыв ремня ГРМ на всех моторах 4G6x приводит к загибу клапанов!',
    approxPriceRub: 4200
  },
  {
    id: 'balance-belt',
    name: 'Ремень балансировочных валов (65 зубьев)',
    category: 'engine',
    categoryLabel: 'Двигатель и ГРМ',
    oemNumber: 'MD311828',
    alternateOem: ['MD182295', 'MR984778'],
    analogs: [
      { brand: 'Gates', partNumber: '5257XS', quality: 'premium', comment: 'Штатный размер и шаг зуба' },
      { brand: 'Mitsuboshi', partNumber: '65MY13', quality: 'premium', comment: 'Оригинальное качество OEM' },
      { brand: 'Contitech', partNumber: 'CT1008', quality: 'recommended' },
      { brand: 'Sun', partNumber: 'A213YU050', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Привод левого и правого балансировочных валов для гашения вибраций 2-го порядка 4-цилиндрового ДВС.',
    installTip: 'При установке обязательно совместить метку правого балансира отверткой через технологическую пробку в блоке (глубина погружения > 60 мм).',
    criticalWarning: 'При обрыве ремня балансира его ошметки почти всегда затягивает под основной ремень ГРМ, что ведет к загибу клапанов!',
    approxPriceRub: 1800
  },
  {
    id: 'timing-tensioner-pulley',
    name: 'Ролик натяжителя ремня ГРМ',
    category: 'engine',
    categoryLabel: 'Двигатель и ГРМ',
    oemNumber: 'MD182537',
    analogs: [
      { brand: 'Koyo', partNumber: 'LAT1018C', quality: 'premium', comment: 'Лежит в оригинальной коробке Mitsubishi' },
      { brand: 'NTN / SNR', partNumber: 'GE373.18', quality: 'premium', comment: 'Японский подшипник высшего класса' },
      { brand: 'INA', partNumber: '531 0147 20', quality: 'recommended' },
      { brand: 'GMB', partNumber: 'GT10022', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Эксцентриковый натяжной ролик основного ремня газораспределения.',
    installTip: 'Предварительная натяжка выполняется спецключом со штифтами перед отпусканием чеки гидронатяжителя.',
    approxPriceRub: 2300
  },
  {
    id: 'timing-idler-pulley',
    name: 'Ролик обводной (паразитный) ГРМ',
    category: 'engine',
    categoryLabel: 'Двигатель и ГРМ',
    oemNumber: 'MD156604',
    alternateOem: ['MD352473'],
    analogs: [
      { brand: 'Koyo', partNumber: 'PU276033RR1D', quality: 'premium', comment: 'Оригинальный производитель узла' },
      { brand: 'NTN / SNR', partNumber: 'GE373.17', quality: 'premium' },
      { brand: 'INA', partNumber: '532 0075 20', quality: 'recommended' },
      { brand: 'SKF', partNumber: 'VKM 25150', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Направляющий гладкий ролик ремня ГРМ.',
    approxPriceRub: 1900
  },
  {
    id: 'hydraulic-tensioner',
    name: 'Гидравлический натяжитель ремня ГРМ',
    category: 'engine',
    categoryLabel: 'Двигатель и ГРМ',
    oemNumber: 'MD308086',
    alternateOem: ['MN119818'],
    analogs: [
      { brand: 'NTN', partNumber: 'HAT705', quality: 'premium', comment: 'Лежит в оригинале, безупречная надежность' },
      { brand: 'Gates', partNumber: 'T43128', quality: 'recommended' },
      { brand: 'INA', partNumber: '533 0081 20', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Автоматический гидронатяжитель с демпфером колебаний ремня ГРМ.',
    installTip: 'Если гидронатяжитель вдавливается повторно, сжимать шток строго в тисках ВЕРТИКАЛЬНО со скоростью не быстрее 1 мм за 3 минуты!',
    criticalWarning: 'Быстрое сжатие в тисках повреждает внутренний клапан и выводит натяжитель из строя!',
    approxPriceRub: 4900
  },
  {
    id: 'water-pump',
    name: 'Водяной насос (помпа охлаждения)',
    category: 'cooling',
    categoryLabel: 'Система охлаждения',
    oemNumber: 'MD977464',
    alternateOem: ['1300A027', 'MD977465'],
    analogs: [
      { brand: 'GMB', partNumber: 'GWM-54A', quality: 'premium', comment: 'Надежная металлическая крыльчатка, ресурс 100k+' },
      { brand: 'Aisin', partNumber: 'WPM-048', quality: 'premium', comment: 'OEM поставщик японских автогигантов' },
      { brand: 'Dolz', partNumber: 'M-218', quality: 'recommended' },
      { brand: 'HEPU', partNumber: 'P7944', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69'],
    description: 'Водяная помпа приводится зубчатым ремнем ГРМ. Рекомендуется менять каждое второе ТО ГРМ (160-180 тыс. км).',
    installTip: 'Обязательно очистить привалочную плоскость блока и использовать новую резиновую прокладку с тонким слоем анаэробного герметика.',
    approxPriceRub: 3400
  },
  {
    id: 'fan-control-module',
    name: 'Блок управления вентиляторами радиатора (ECU Fan)',
    category: 'cooling',
    categoryLabel: 'Система охлаждения',
    oemNumber: 'MR560127',
    alternateOem: ['1355A124', '1355A053', 'AJ51-15-15YA'],
    analogs: [
      { brand: 'Mitsubishi OEM', partNumber: '1355A124', quality: 'premium', comment: 'Модернизированная ревизия с улучшенной термопастой' },
      { brand: 'SAT', partNumber: 'ST-MR560127', quality: 'budget', comment: 'Бюджетная замена, рекомендуется проверить термоинтерфейс' },
      { brand: 'Roers-Parts', partNumber: 'RPMR560127', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'ШИМ-контроллер скорости вращения вентиляторов охлаждения радиатора и кондиционера.',
    installTip: 'При установке обязательно нанести свежую теплопроводящую пасту (КПТ-8 или Arctic MX-4) на алюминиевый радиатор корпуса блока!',
    criticalWarning: 'Главная болезнь Outlander 1! При выходе из строя вентиляторы либо крутятся на 100% при включении зажигания, либо не включаются вовсе, приводя к перегреву!',
    approxPriceRub: 3800
  },
  {
    id: 'radiator-main',
    name: 'Радиатор охлаждения двигателя (основной)',
    category: 'cooling',
    categoryLabel: 'Система охлаждения',
    oemNumber: 'MR968056',
    alternateOem: ['MR968057', 'MN156092', '1350A049'],
    analogs: [
      { brand: 'Koyorad', partNumber: 'PL031652', quality: 'premium', comment: 'Японское качество, идеальная геометрия трубок' },
      { brand: 'Nissens', partNumber: '67032', quality: 'recommended', comment: 'Отличная теплоотдача' },
      { brand: 'Sakura', partNumber: '3321-1011', quality: 'recommended' },
      { brand: 'Luzar', partNumber: 'LRC 1118', quality: 'budget' }
    ],
    engines: ['4G63', '4G64', '4G69'],
    description: 'Алюминиевый трубчато-ленточный радиатор с встроенным теплообменником охлаждения масла АКПП.',
    installTip: 'При замене радиатора ОБЯЗАТЕЛЬНО ставьте новую крышку радиатора на 0.9 bar, а не 1.1 bar!',
    criticalWarning: 'Верхний пластиковый бачок склонен к микротрещинам из-за усталости пластика и избыточного давления клапана пробки.',
    approxPriceRub: 8200
  },
  {
    id: 'radiator-cap-09',
    name: 'Крышка радиатора (давление сброса 0.9 bar / 88 kPa)',
    category: 'cooling',
    categoryLabel: 'Система охлаждения',
    oemNumber: 'MR481216',
    alternateOem: ['MB660667'],
    analogs: [
      { brand: 'Denso', partNumber: '022510-1530', quality: 'premium', comment: 'Точнейшая калибровка перепускного клапана' },
      { brand: 'Gates', partNumber: 'RC124', quality: 'recommended' },
      { brand: 'HKT', partNumber: 'C-10', quality: 'recommended' },
      { brand: 'Tama', partNumber: 'RC-10', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Клапанная крышка радиатора со штуцером расширительного бачка.',
    installTip: 'Клубный лайфхак: заводская крышка 1.1 bar создает избыточное давление в стареющей системе. Установка крышки 0.9 bar защищает верхний бачок радиатора от разрыва без риска закипания.',
    approxPriceRub: 750
  },

  // ПОДВЕСКА И РУЛЕВОЕ
  {
    id: 'front-control-arm-l',
    name: 'Рычаг передней подвески левый нижний (в сборе)',
    category: 'suspension_front',
    categoryLabel: 'Передняя подвеска',
    oemNumber: 'MR403419',
    alternateOem: ['4013A281', '4013A015'],
    analogs: [
      { brand: 'CTR', partNumber: 'CQM-14L', quality: 'premium', comment: 'Корейский поставщик конвейера Hyundai/Kia' },
      { brand: '555', partNumber: 'SA-7872L', quality: 'premium', comment: 'Сделано в Японии (Sankei Industry)' },
      { brand: 'Sidewinder / Moog', partNumber: 'MI-WP-2244', quality: 'recommended' },
      { brand: 'Teknorot', partNumber: 'M-682', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Передний треугольный рычаг с запрессованной шаровой опорой и двумя сайлентблоками.',
    installTip: 'Окончательную затяжку болтов сайлентблоков производить ТОЛЬКО под нагрузкой на опущенном на колеса автомобиле!',
    approxPriceRub: 6400
  },
  {
    id: 'front-arm-rear-bushing',
    name: 'Задний сайлентблок переднего рычага ("таблетка")',
    category: 'suspension_front',
    categoryLabel: 'Передняя подвеска',
    oemNumber: 'MR403441',
    analogs: [
      { brand: 'CTR', partNumber: 'CBM-36', quality: 'premium', comment: 'Долговечная резина, не дубеет зимой' },
      { brand: 'RBI', partNumber: 'M2407WB', quality: 'recommended' },
      { brand: 'Jikiu', partNumber: 'BH23004', quality: 'recommended' },
      { brand: 'Точка Опоры', partNumber: '3-06-444', quality: 'budget', comment: 'Полиуретан (жестче, но вечный)' }
    ],
    engines: ['ALL'],
    description: 'Вертикальный резинометаллический сайлентблок. Испытывает максимальные нагрузки при торможении и разгоне.',
    installTip: 'При перепрессовке соблюдать ориентацию меток наплывов резины по ходу движения кузова.',
    approxPriceRub: 1100
  },
  {
    id: 'front-ball-joint',
    name: 'Шаровая опора переднего рычага',
    category: 'suspension_front',
    categoryLabel: 'Передняя подвеска',
    oemNumber: 'MR403419-BJ',
    analogs: [
      { brand: '555', partNumber: 'SB-7872', quality: 'premium', comment: 'Япония, с тавотницей для смазки или со стопорным кольцом' },
      { brand: 'CTR', partNumber: 'CBM-36', quality: 'premium' },
      { brand: 'Lemforder', partNumber: '34484 01', quality: 'recommended' },
      { brand: 'Teknorot', partNumber: 'M-684', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Шаровая опора запрессовывается в оригинальный рычаг при ремонте без покупки рычага целиком.',
    installTip: 'Обязательно фиксировать стопорным кольцом и дополнительно набить под пыльник качественную смазку ШРБ-4 или синтетическую литиевую.',
    approxPriceRub: 1400
  },
  {
    id: 'front-stabilizer-link',
    name: 'Стойка стабилизатора передняя (тяга / "линька")',
    category: 'suspension_front',
    categoryLabel: 'Передняя подвеска',
    oemNumber: 'MR392723',
    alternateOem: ['MN101368', '4056A015'],
    analogs: [
      { brand: 'CTR', partNumber: 'CLM-17', quality: 'premium', comment: 'Лучшее соотношение цена/ресурс (60-80k км)' },
      { brand: '555', partNumber: 'SL-7870', quality: 'premium' },
      { brand: 'Lemforder', partNumber: '34483 01', quality: 'recommended' },
      { brand: 'Febi', partNumber: '28004', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Стойка поперечной устойчивости передней подвески.',
    installTip: 'При монтаже придерживать палец шестигранником на 5 мм, затягивать гайку моментом 40 Н·м.',
    approxPriceRub: 950
  },
  {
    id: 'rear-trailing-arm-bushing',
    name: 'Сайлентблок продольного рычага задней подвески ("ушастый")',
    category: 'suspension_rear',
    categoryLabel: 'Задняя подвеска',
    oemNumber: 'MN100110',
    alternateOem: ['MR403441', 'MR554111'],
    analogs: [
      { brand: 'CTR', partNumber: 'CVM-14', quality: 'premium', comment: 'Усиленные кронштейны ушей' },
      { brand: 'Jikiu', partNumber: 'BH23005', quality: 'recommended' },
      { brand: 'Febest', partNumber: 'MAB-038', quality: 'budget' },
      { brand: 'VTR', partNumber: 'MI0502R', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Крупный сайлентблок заднего продольного рычага. Определяет стабильность задней оси в колее.',
    installTip: 'Выпрессовывается на месте специальным винтовым съемником без полного демонтажа рычага и без снятия бензобака!',
    criticalWarning: 'Разрыв ушастых сайлентблоков вызывает рыскание задней части авто на неровностях и ускоренный износ резины.',
    approxPriceRub: 1850
  },
  {
    id: 'rear-camber-arm',
    name: 'Поперечный развальный рычаг задний ("гантелька / косточка")',
    category: 'suspension_rear',
    categoryLabel: 'Задняя подвеска',
    oemNumber: 'MR403485',
    alternateOem: ['MN100109'],
    analogs: [
      { brand: 'CTR', partNumber: 'CQM-15', quality: 'premium' },
      { brand: '555', partNumber: 'SA-7874', quality: 'premium' },
      { brand: 'Yamato', partNumber: 'J95015YMT', quality: 'recommended' },
      { brand: 'Febest', partNumber: '0425-CU20', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Верхний поперечный рычаг задней подвески, регулирующий угол развала колес.',
    installTip: 'Регулировочные болты почти всегда закисают намертво во втулке сайлентблока! При замене рычага сразу покупайте новые развальные болты с шайбами и гайками.',
    approxPriceRub: 2200
  },
  {
    id: 'rear-camber-bolt-kit',
    name: 'Комплект развальных болтов задней подвески (болт + эксцентрик + гайка)',
    category: 'suspension_rear',
    categoryLabel: 'Задняя подвеска',
    oemNumber: 'MU000390',
    alternateOem: ['MR403464', 'MU431006'],
    analogs: [
      { brand: 'Mitsubishi OEM', partNumber: 'MU000390-KIT', quality: 'premium', comment: 'Только оригинал или качественный крепеж 10.9' },
      { brand: 'Febest', partNumber: '0429-001', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Эксцентриковый болт М12 с шайбой со шкалой для регулировки углов сход-развала задней оси.',
    installTip: 'Перед сборкой обильно смазать тело болта медной смазкой или пушечным салом, чтобы не закис через год!',
    approxPriceRub: 1200
  },
  {
    id: 'front-wheel-bearing',
    name: 'Подшипник передней ступицы',
    category: 'suspension_front',
    categoryLabel: 'Передняя подвеска',
    oemNumber: 'MR491449',
    alternateOem: ['MR527453', 'MR491450'],
    analogs: [
      { brand: 'Koyo', partNumber: 'DAC4074W-3CS80', quality: 'premium', comment: 'Поставщик оригинала на конвейер' },
      { brand: 'NTN / SNR', partNumber: 'R173.27', quality: 'premium' },
      { brand: 'SKF', partNumber: 'VKBA 6870', quality: 'premium' },
      { brand: 'ILJIN', partNumber: 'IJ111003', quality: 'recommended' }
    ],
    engines: ['ALL'],
    description: 'Двухрядный радиально-упорный подшипник передней ступицы. Имеет встроенное магнитное кольцо ABS.',
    installTip: 'Впрессовывать ТОЛЬКО магнитной стороной датчика ABS внутрь кулака! При ошибке загорится лампа ABS.',
    approxPriceRub: 2800
  },
  {
    id: 'rear-hub-assembly-4wd',
    name: 'Задняя ступица в сборе с подшипником (4WD)',
    category: 'suspension_rear',
    categoryLabel: 'Задняя подвеска',
    oemNumber: 'MR527453',
    alternateOem: ['MN101441'],
    analogs: [
      { brand: 'Koyo', partNumber: '3DACF026F-24S', quality: 'premium', comment: 'Японский оригинал Koyo' },
      { brand: 'NTN', partNumber: 'HUB081-37', quality: 'premium' },
      { brand: 'GMB', partNumber: 'GH31710', quality: 'recommended' },
      { brand: 'ILJIN', partNumber: 'IJ112015', quality: 'recommended' }
    ],
    engines: ['ALL'],
    drivetrain: '4WD',
    description: 'Ступичный узел задней оси под приводной вал 4WD со шлицами и интегрированным датчиком ABS.',
    approxPriceRub: 5400
  },

  // ТОРМОЗНАЯ СИСТЕМА
  {
    id: 'front-brake-pads',
    name: 'Колодки тормозные передние (дисковые)',
    category: 'brakes',
    categoryLabel: 'Тормозная система',
    oemNumber: 'MR527674',
    alternateOem: ['MN102618', 'MZ690186'],
    analogs: [
      { brand: 'Akebono', partNumber: 'AN-650WK', quality: 'premium', comment: 'Лучшие японские колодки: не пылят, берегут диск, не скрипят' },
      { brand: 'Nisshinbo', partNumber: 'NP3005', quality: 'premium', comment: 'Мягкое и эффективное торможение' },
      { brand: 'Brembo', partNumber: 'P 54 030', quality: 'recommended' },
      { brand: 'NiBK', partNumber: 'PN-3469', quality: 'recommended', comment: 'Комплект с пластинами и смазкой' }
    ],
    engines: ['ALL'],
    description: 'Передние тормозные колодки для 2-поршневых или 1-поршневых суппортов Outlander I.',
    installTip: 'Всегда очищать направляющие пазы скобы до блеска и наносить противоскрипную пасту на тыльную сторону колодки.',
    approxPriceRub: 2900
  },
  {
    id: 'front-brake-rotors',
    name: 'Диски тормозные передние вентилируемые (D=276мм / D=294мм)',
    category: 'brakes',
    categoryLabel: 'Тормозная система',
    oemNumber: 'MR510966',
    alternateOem: ['MR307412', 'MB699286'],
    analogs: [
      { brand: 'Brembo', partNumber: '09.7939.24', quality: 'premium', comment: 'Стойкость к короблению и перегреву' },
      { brand: 'TRW', partNumber: 'DF4228', quality: 'recommended' },
      { brand: 'Zimmermann', partNumber: '380.2163.20', quality: 'premium', comment: 'Антикоррозийное покрытие Coat Z' },
      { brand: 'Gerat', partNumber: 'DSK-346', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Передние вентилируемые тормозные диски 5x114.3. На версиях Turbo и некоторых 2.4 стоят диски увеличенного диаметра 294 мм.',
    installTip: 'Проверить биение ступицы индикатором часового типа перед установкой нового диска (норма до 0.03 мм).',
    approxPriceRub: 5100
  },
  {
    id: 'rear-caliper-pin-kit',
    name: 'Ремкомплект направляющих заднего суппорта с пыльниками',
    category: 'brakes',
    categoryLabel: 'Тормозная система',
    oemNumber: 'MR527546',
    analogs: [
      { brand: 'Frenkit', partNumber: '810012', quality: 'premium', comment: 'Высокоточная обработка пальцев, термостойкие пыльники' },
      { brand: 'Seinsa / Autofren', partNumber: 'D7089C', quality: 'recommended' },
      { brand: 'Quick Brake', partNumber: '113-1384X', quality: 'recommended' }
    ],
    engines: ['ALL'],
    description: 'Направляющие пальцы и резиновые манжеты суппорта. Частая причина неравномерного износа задних колодок.',
    installTip: 'Использовать ТОЛЬКО специальную полигликолевую смазку (TRW PFG110 или Seiken CF301). Обычная медная или литиевая смазка раздувает резинки!',
    criticalWarning: 'Закисание нижней направляющей заднего суппорта — постоянная болезнь всех Outlander 1!',
    approxPriceRub: 1300
  },

  // ФИЛЬТРЫ И ЖИДКОСТИ
  {
    id: 'oil-filter',
    name: 'Фильтр масляный двигателя',
    category: 'filters_fluids',
    categoryLabel: 'Фильтры и жидкости',
    oemNumber: 'MD360935',
    alternateOem: ['MD356000', 'MD352626', '1230A182'],
    analogs: [
      { brand: 'Mann-Filter', partNumber: 'W 610/3', quality: 'premium', comment: 'Идеальный противодренажный клапан из силикона' },
      { brand: 'Vic', partNumber: 'C-415', quality: 'premium', comment: 'Японский оригинал для внутреннего рынка' },
      { brand: 'Mahle / Knecht', partNumber: 'OC 196', quality: 'premium' },
      { brand: 'JS Asakashi', partNumber: 'C307J', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69', '4G63T'],
    description: 'Полнопоточный масляный фильтр с клапаном на 1.0 бар.',
    installTip: 'Смазать уплотнительное кольцо свежим моторным маслом, затягивать от руки на 3/4 оборота после касания блока.',
    approxPriceRub: 650
  },
  {
    id: 'air-filter',
    name: 'Фильтр воздушный двигателя',
    category: 'filters_fluids',
    categoryLabel: 'Фильтры и жидкости',
    oemNumber: 'MR571476',
    alternateOem: ['MR571477'],
    analogs: [
      { brand: 'Mann-Filter', partNumber: 'C 2645', quality: 'premium', comment: 'Плотный фильтрующий материал, защита ДМРВ' },
      { brand: 'JS Asakashi', partNumber: 'A3012', quality: 'recommended' },
      { brand: 'Filtron', partNumber: 'AP 107/1', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Панельный фильтр воздуха, защищает датчик расхода воздуха (MAF/ДМРВ) и цилиндры от абразивной пыли.',
    installTip: 'При каждой замене протирать начисто нижний пластиковый короб от песка влажной ветошью.',
    approxPriceRub: 750
  },
  {
    id: 'cabin-filter',
    name: 'Фильтр салона (угольный / пылевой)',
    category: 'filters_fluids',
    categoryLabel: 'Фильтры и жидкости',
    oemNumber: 'MR398288',
    alternateOem: ['MZ690361', 'XR398288'],
    analogs: [
      { brand: 'Mann-Filter', partNumber: 'CUK 2141', quality: 'premium', comment: 'Угольный, задерживает аллергены и запахи' },
      { brand: 'JS Asakashi', partNumber: 'AC303C', quality: 'recommended' },
      { brand: 'Filtron', partNumber: 'K 1121A', quality: 'recommended' }
    ],
    engines: ['ALL'],
    description: 'Расположен за перчаточным ящиком (бардачком). На некоторых ранних версиях Outlander 1 с завода стояла пластиковая заглушка, требовалась доустановка рамки!',
    installTip: 'Следить за стрелкой направления воздушного потока (Air Flow — вниз к вентилятору отопителя).',
    approxPriceRub: 600
  },
  {
    id: 'fuel-filter-tank',
    name: 'Топливный фильтр тонкой очистки (в бензобаке)',
    category: 'filters_fluids',
    categoryLabel: 'Фильтры и жидкости',
    oemNumber: 'MR552781',
    alternateOem: ['MR552780'],
    analogs: [
      { brand: 'JS Asakashi', partNumber: 'FS6500U', quality: 'premium', comment: 'Полное соответствие заводской геометрии штуцеров' },
      { brand: 'Masuma', partNumber: 'MFF-M407', quality: 'recommended' },
      { brand: 'Lynx', partNumber: 'LF-983M', quality: 'budget' }
    ],
    engines: ['ALL'],
    description: 'Пластиковый погружной корпус-фильтр бензонасоса в левой половине бака.',
    installTip: 'При замене не потерять маленькое резиновое уплотнительное кольцо регулятора давления топлива! Если его защемит, машина будет долго заводиться на холодную.',
    approxPriceRub: 2200
  },
  {
    id: 'fuel-strainer',
    name: 'Сетка грубой очистки бензонасоса (фильтр-памперс)',
    category: 'filters_fluids',
    categoryLabel: 'Фильтры и жидкости',
    oemNumber: 'MR571253',
    analogs: [
      { brand: 'Krauf', partNumber: 'KR1001F', quality: 'recommended' },
      { brand: 'Masuma', partNumber: 'MPU-024', quality: 'recommended' }
    ],
    engines: ['ALL'],
    description: 'Сетчатый фильтр заборника бензонасоса.',
    installTip: 'Обязательно менять вместе с основным фильтром тонкой очистки. При пробегах за 150к км часто забит ржавчиной от сгнивающей заливной горловины бака.',
    approxPriceRub: 450
  },

  // ТРАНСМИССИЯ И ПОЛНЫЙ ПРИВОД
  {
    id: 'atf-sp3-oil',
    name: 'Оригинальное трансмиссионное масло АКПП Mitsubishi Diamond ATF SP-III (4 л)',
    category: 'filters_fluids',
    categoryLabel: 'Фильтры и жидкости',
    oemNumber: 'MZ320216',
    alternateOem: ['4024610', 'ACH1ZC1X05'],
    analogs: [
      { brand: 'ZIC', partNumber: 'ATF SP 3 (162627)', quality: 'premium', comment: 'Официальный сертифицированный производитель базы SP-III' },
      { brand: 'Idemitsu', partNumber: 'ATF Type-HK (30040096-750)', quality: 'recommended' },
      { brand: 'Eneos', partNumber: 'ATF Model SP-III', quality: 'recommended' }
    ],
    engines: ['ALL'],
    description: 'Специфическая жидкость для 4-ступенчатых автоматических коробок передач Mitsubishi W4A42 / F4A42.',
    installTip: 'Полный объем коробки 7.8-8.1 л. При частичной замене сливается около 4.0-4.5 л. Уровень проверять на ПРОГРЕТОЙ коробке при работающем моторе в положении селектора "N" (НЕ "P"!).',
    criticalWarning: 'Заливать Dexron II/III или современные масла WS/Type-T4 СТРОГО ЗАПРЕЩЕНО — коробка начнет пинаться и сгорит блокировка гидротрансформатора!',
    approxPriceRub: 4400
  },
  {
    id: 'driveshaft-u-joint',
    name: 'Крестовина карданного вала (22х57.5 мм)',
    category: 'transmission',
    categoryLabel: 'Трансмиссия и кардан',
    oemNumber: 'MB000251',
    analogs: [
      { brand: 'Koyo', partNumber: 'TM-180', quality: 'premium', comment: 'Япония, максимальный ресурс игольчатых подшипников' },
      { brand: 'GMB', partNumber: 'GUM-81', quality: 'recommended', comment: 'Самый частый выбор при ремонте кардана' },
      { brand: 'GKN / Lobro', partNumber: 'U181', quality: 'recommended' }
    ],
    engines: ['ALL'],
    drivetrain: '4WD',
    description: 'Крестовина кардана. Заводской кардан Mitsubishi закернен (несъемный), поэтому замена требует перекернения или проточки канавок под стопорные кольца.',
    installTip: 'После перепрессовки крестовины кардан ОБЯЗАТЕЛЬНО нужно отбалансировать на стенде!',
    approxPriceRub: 1350
  },
  {
    id: 'driveshaft-support-bearing',
    name: 'Подвесной подшипник карданного вала в опоре',
    category: 'transmission',
    categoryLabel: 'Трансмиссия и кардан',
    oemNumber: 'MR580197',
    analogs: [
      { brand: 'Febest', partNumber: 'MCB-CU20', quality: 'recommended' },
      { brand: 'Jikiu', partNumber: 'CB23001', quality: 'recommended' },
      { brand: 'VTR', partNumber: 'MI5101R', quality: 'budget' }
    ],
    engines: ['ALL'],
    drivetrain: '4WD',
    description: 'Эластичная резиновая опора с закрытым подшипником для центральной части карданного вала.',
    installTip: 'Признак износа — вибрация по кузову при разгоне на скорости 70-90 км/ч.',
    approxPriceRub: 2900
  },

  // ЗАЖИГАНИЕ И ДАТЧИКИ
  {
    id: 'spark-plugs-4g69',
    name: 'Свечи зажигания иридиевые (комплект 4 шт.)',
    category: 'ignition_sensors',
    categoryLabel: 'Зажигание и датчики',
    oemNumber: 'MN163236',
    alternateOem: ['MS851336'],
    analogs: [
      { brand: 'NGK', partNumber: 'IFR6S / 5222', quality: 'premium', comment: 'Штатная иридиевая свеча с лазерной наваркой (ресурс 90-100k км)' },
      { brand: 'Denso', partNumber: 'IK20TT / SK20PR-A11', quality: 'premium', comment: 'Тонкий центральный электрод 0.4 мм' },
      { brand: 'Bosch', partNumber: 'FR 7 DPP 33+', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69'],
    description: 'Свечи зажигания с зазором 1.1 мм для оптимального воспламенения и экономии топлива.',
    installTip: 'Момент затяжки 25 Н·м в холодную ГБЦ. Не перетягивать, чтобы не сорвать резьбу в алюминиевой головке.',
    approxPriceRub: 3600
  },
  {
    id: 'o2-sensor-front',
    name: 'Датчик кислорода передний верхний (Лямбда-зонд 1)',
    category: 'ignition_sensors',
    categoryLabel: 'Зажигание и датчики',
    oemNumber: 'MN153010',
    alternateOem: ['MN153037', 'MR988406'],
    analogs: [
      { brand: 'Denso', partNumber: 'DOX-0313', quality: 'premium', comment: 'Прямой аналог с оригинальным разъемом "bolt-on"' },
      { brand: 'Bosch', partNumber: '0 258 006 537', quality: 'recommended', comment: 'Универсальный под перепиновку' },
      { brand: 'NTK / NGK', partNumber: 'OZA624-E4', quality: 'recommended' }
    ],
    engines: ['4G63', '4G64', '4G69'],
    description: 'Управляющий широкополосный или циркониевый датчик состава топливной смеси до катализатора.',
    installTip: 'Симптом поломки: ошибка P0135 (обрыв подогревателя), рост расхода топлива до 18-20 л/100 км, тупой разгон.',
    approxPriceRub: 5900
  },
  {
    id: 'fuel-filler-neck',
    name: 'Заливная горловина топливного бака (металлическая труба)',
    category: 'body_interior',
    categoryLabel: 'Кузов и бак',
    oemNumber: 'MR959771',
    alternateOem: ['MN120150'],
    analogs: [
      { brand: 'Polcar', partNumber: '5251ZP-1', quality: 'recommended', comment: 'Новая оцинкованная труба горловины' },
      { brand: 'Klokkerholm', partNumber: '3748525', quality: 'recommended' }
    ],
    engines: ['ALL'],
    description: 'Труба заливной горловины от лючка к бензобаку, расположенная под аркой заднего левого колеса.',
    installTip: 'Обязательно обработать новую горловину антикором (мовиль/Dinitrol) перед установкой! С завода под пластиковым грязезащитным щитком собирается грязь и соль, вызывая сквозную коррозию.',
    criticalWarning: 'Если горловина прогнила, при заправке бензин течет на выхлоп, а грязь и вода летят прямо в бак, убивая бензонасос и форсунки!',
    approxPriceRub: 6900
  }
];

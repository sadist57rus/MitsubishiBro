export interface JapaneseCarEngine {
  code: string;
  name: string;
  displacement: string; // e.g. "2.0 л (1997 см³)"
  powerHp: string;      // e.g. "136 л.с."
  torqueNm: string;     // e.g. "176 Н·м"
  valves: string;       // e.g. "16V DOHC" / "16V SOHC MIVEC"
  fuelSystem: string;   // e.g. "MPI (распределенный впрыск)"
  timingDrive: string;  // e.g. "Ремень (интервал 90 000 км)" / "Цепь"
  strengths: string[];
  weaknesses: string[];
}

export interface JapaneseCarModel {
  id: string;
  brandId: string;
  name: string;
  generation: string;
  years: string;
  bodyType: 'Кроссовер' | 'Внедорожник' | 'Седан' | 'Универсал' | 'Хэтчбек' | 'Минивэн' | 'Купе/Спорт' | 'Пикап';
  drivetrain: string; // e.g. "Постоянный полный 4WD с вискомуфтой (50:50)"
  awdSystemName: string;
  overview: string;
  dimensions: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    wheelbaseMm: number;
    groundClearanceMm: number;
    trunkVolumeLiters: string;
    fuelTankLiters: number;
    curbWeightKg: string;
  };
  engines: JapaneseCarEngine[];
  transmissions: string[];
  fuelEconomy: {
    city: string;
    highway: string;
    combined: string;
    fuelGrade: string;
  };
  fluidsAndCapacities: {
    engineOil: string;
    engineOilVolume: string;
    transmissionFluid: string;
    transferCaseAndDiff: string;
    coolant: string;
    brakeFluid: string;
  };
  bulbsSummary: {
    lowBeam: string;
    highBeam: string;
    fogLights: string;
    frontTurn: string;
    tailStop: string;
    interior: string;
  };
  obdDiagnostics: {
    portLocation: string;
    commonCodes: { code: string; title: string; hint: string }[];
    protocol: string;
  };
  knownIssues: {
    title: string;
    symptoms: string;
    rootCause: string;
    solution: string;
  }[];
  /** Notes about market coverage and the verification level of supplemental data. */
  dataQualityNote?: string;
  /** Conservative status: only set to verified when the exact variant is backed by an OEM document. */
  verificationStatus?: 'unverified' | 'partially-verified' | 'verified';
  /** Source links supporting this exact record; generic brand portals do not count as model-level verification. */
  sourceReferences?: { label: string; url: string; scope: string }[];
  /** ISO date of the last review of source references, not a claim that every field was re-verified. */
  lastReviewed?: string;
  isOriginalSourceModel?: boolean;
}

export interface JapaneseBrand {
  id: string;
  name: string;
  russianName: string;
  country: string;
  founded: number;
  headquarters: string;
  tagline: string;
  description: string;
  brandColor: string;
  awdPhilosophy: string;
  models: JapaneseCarModel[];
}

export const JAPANESE_BRANDS: JapaneseBrand[] = [
  // 1. MITSUBISHI MOTORS
  {
    id: 'mitsubishi',
    name: 'Mitsubishi Motors',
    russianName: 'Мицубиси',
    country: 'Япония',
    founded: 1870,
    headquarters: 'Токио, Минато, Япония',
    tagline: 'Drive your Ambition (Надежность, рожденная ралли Дакар и WRC)',
    description: 'Легендарная японская марка с тремя красными бриллиантами в эмблеме. Пионер полного привода 4WD (первый японский седан с 4WD PX33 в 1934 году), 12-кратный триумфатор ралли «Дакар» (Mitsubishi Pajero) и 4-кратный чемпион мира по ралли WRC (Lancer Evolution с Томи Мякиненом).',
    brandColor: '#dc2626', // Red
    awdPhilosophy: 'Super Select 4WD-II (межосевой дифф с возможностью отключения переднего моста на ходу) и S-AWC (Super All-Wheel Control с активным межосевым дифференциалом ACD и задним векторизатором AYC).',
    models: [
      {
        id: 'outlander-1',
        brandId: 'mitsubishi',
        name: 'Outlander I (CU_W / Airtrek)',
        generation: 'I поколение (2001–2008)',
        years: '2001–2008',
        bodyType: 'Кроссовер',
        drivetrain: 'Постоянный полный привод 4WD с межосевым дифференциалом и вискомуфтой блокировки (50:50). Также выпускались версии FWD.',
        awdSystemName: 'Full-Time 4WD (VCU Center Diff)',
        overview: 'Наш базовый исходный автомобиль! Первое поколение легендарного кроссовера, разработанного на платформе Mitsubishi Lancer / Galant. Отличается честным механическим постоянным полным приводом без перегревающихся муфт, образцовой управляемостью и выносливыми чугунными моторами серии 4G6 (Sirius).',
        isOriginalSourceModel: true,
        dimensions: {
          lengthMm: 4545,
          widthMm: 1750,
          heightMm: 1620,
          wheelbaseMm: 2625,
          groundClearanceMm: 195,
          trunkVolumeLiters: '402 – 1705 л (при сложенном втором ряде)',
          fuelTankLiters: 60,
          curbWeightKg: '1535 – 1615 кг'
        },
        engines: [
          {
            code: '4G63',
            name: '2.0L 16V DOHC Sirius',
            displacement: '1997 см³',
            powerHp: '136 л.с. @ 6000 об/мин',
            torqueNm: '176 Н·м @ 4500 об/мин',
            valves: '16V DOHC с балансирными валами',
            fuelSystem: 'MPI (многоточечный распределенный впрыск)',
            timingDrive: 'Зубчатый ремень (строго замена каждые 90 000 км вместе с ремнем балансира!)',
            strengths: ['Чугунный блок цилиндров, огромный ресурс (400 000+ км)', 'Всеядность к топливу (АИ-92/95)', 'Простота ремонта и доступность запчастей'],
            weaknesses: ['Обрыв ремня балансира затягивает его под ремень ГРМ — загиб клапанов', 'Требовательность к датчикам положения коленвала/распредвала']
          },
          {
            code: '4G64',
            name: '2.4L 16V SOHC Sirius',
            displacement: '2351 см³',
            powerHp: '139-147 л.с. @ 5500 об/мин',
            torqueNm: '205 Н·м @ 4000 об/мин',
            valves: '16V SOHC с гидрокомпенсаторами',
            fuelSystem: 'MPI распределенный впрыск',
            timingDrive: 'Ремень ГРМ + ремень балансирного вала',
            strengths: ['Высокий крутящий момент на низах', 'Мягкая и плавная работа с АКПП INVECS-II'],
            weaknesses: ['Повышенный расход бензина в городе (14-16 л/100км)', 'Прогар прокладки ГБЦ при перегреве']
          },
          {
            code: '4G69',
            name: '2.4L 16V SOHC MIVEC Sirius',
            displacement: '2378 см³',
            powerHp: '160 л.с. @ 5750 об/мин',
            torqueNm: '216 Н·м @ 4000 об/мин',
            valves: '16V SOHC с системой изменения фаз MIVEC',
            fuelSystem: 'MPI электронный впрыск',
            timingDrive: 'Ремень ГРМ + ремень балансира',
            strengths: ['Оптимальная динамика для тяжелого кроссовера (0-100 за 9.9 с)', 'Эластичность на средних и высоких оборотах благодаря MIVEC'],
            weaknesses: ['Регулировка тепловых зазоров клапанов шайбами каждые 90 тыс. км', 'Два катализатора с ошибками P0421/P0431']
          },
          {
            code: '4G63T',
            name: '2.0L Turbo DOHC (Airtrek Turbo-R)',
            displacement: '1997 см³ Turbo',
            powerHp: '201-240 л.с. @ 5500 об/мин',
            torqueNm: '343 Н·м @ 2500 об/мин',
            valves: '16V DOHC Turbo (турбина TD04HL)',
            fuelSystem: 'MPI Turbo с промежуточным охладителем (интеркулер)',
            timingDrive: 'Усиленный ремень ГРМ',
            strengths: ['Динамика спорткара (0-100 за 6.8 сек)', 'Родство с мотором легендарного Lancer Evolution VII/VIII'],
            weaknesses: ['Высокая температурная нагруженность, расход АИ-98 16-20 л', 'Требовательность к синтетическому маслу (замена каждые 5000 км)']
          }
        ],
        transmissions: [
          '5-ступенчатая МКПП F5M42 (FWD) / W5M42 (4WD)',
          '4-ступенчатый адаптивный автомат INVECS-II F4A42 (FWD) / W4A42 (4WD) с ручным режимом Sportronic'
        ],
        fuelEconomy: {
          city: '13.8 – 15.5 л/100 км (2.0 MT / 2.4 AT)',
          highway: '8.4 – 9.8 л/100 км',
          combined: '10.2 – 11.5 л/100 км',
          fuelGrade: 'АИ-95 (допускается качественный АИ-92 для 4G63/4G64)'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 API SN, ACEA A3/B4 (4.0–4.3 л с фильтром)',
          engineOilVolume: '4.3 литра (4G63/4G64/4G69)',
          transmissionFluid: 'СТРОГО Mitsubishi DiaQueen ATF SP-III (полный 7.7 л, частичная замена 4.2 л) для АКПП W4A42; 75W-85 GL-4 для МКПП (2.2 л)',
          transferCaseAndDiff: 'Раздаточная коробка: 0.55 л 75W-90 GL-5 Hypoid; Задний редуктор: 0.50 л 75W-90 GL-5',
          coolant: '7.0 л антифриза G12+ (зеленый/красный карбоксилатный)',
          brakeFluid: '1.0 л DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H7 12V 55W (цоколь PX26d)',
          highBeam: 'H1 12V 55W (цоколь P14.5s)',
          fogLights: 'H3 12V 55W (цоколь PK22s)',
          frontTurn: 'PY21W оранжевая (BAU15s)',
          tailStop: 'W21/5W двухнитевая безцокольная (W3x16q)',
          interior: 'W5W (T10) и C5W 31мм Festoon'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов слева от рулевой колонки (водительская сторона), над педалями рядом с ручкой открытия капота. Разъем 16-pin OBD-II направлен строго вертикально вниз.',
          commonCodes: [
            { code: 'P0421', title: 'Низкая эффективность катализатора B1', hint: 'Износ катализатора или обманка второго лямбда-зонда' },
            { code: 'P0431', title: 'Низкая эффективность катализатора B2', hint: 'Характерно для 4G69 с двумя коллекторными катами' },
            { code: 'P0171', title: 'Слишком бедная смесь в системе', hint: 'Подсос воздуха через прокладку впуска, грязный ДМРВ или слабый бензонасос' }
          ],
          protocol: 'ISO 9141-2 / K-Line (Pin 7) + MUT-II / MUT-III'
        },
        knownIssues: [
          {
            title: 'Блок управления вентиляторами охлаждения (Fan Control Module)',
            symptoms: 'Вентиляторы молотят на максимальных оборотах при выключенном зажигании, сажая аккумулятор, либо не включаются вовсе, приводя к перегреву двигателя.',
            rootCause: 'Пробой выходных силовых MOSFET-транзисторов внутри герметичного алюминиевого блока на диффузоре радиатора из-за вибраций и перегрева.',
            solution: 'Замена блока на модернизированный оригинал Mitsubishi 1355A124 (или 1355A053, аналог Gates, Mobiletron) либо перепайка транзисторов.'
          },
          {
            title: 'Сквозная коррозия заливной горловины топливного бака',
            symptoms: 'Запах бензина возле левого заднего колеса, шипение при заправке, ошибка P0440 / P0442 (утечка в системе EVAP), попадание грязи в топливный бак и забивание сетки насоса.',
            rootCause: 'Конструктивный пластиковый щиток задерживает мокрую грязь и дорожные реагенты прямо на тонкостенной металлической трубе.',
            solution: 'Замена горловины на новую (артикул MR959771) с обязательной антикоррозийной обработкой цинковым грунтом и полимерным антигравием.'
          },
          {
            title: 'Закисание развальных болтов в сайлентблоках задней многорычажки',
            symptoms: 'Невозможность выставить углы схода-развала задних колес («домик» задних колес), повышенный износ внутренней части протектора шин.',
            rootCause: 'Отсутствие смазки на заводе: стальные болты эксцентриков намертво прикипают к металлическим втулкам сайлентблоков поперечных рычагов.',
            solution: 'Спиливание сабельной пилой или болгаркой, установка новых болтов (MU000284), шайб и сайлентблоков с нанесением медной или водостойкой морской смазки.'
          }
        ]
      },
      {
        id: 'outlander-xl',
        brandId: 'mitsubishi',
        name: 'Outlander XL / II (CW_W)',
        generation: 'II поколение (2006–2012)',
        years: '2006–2012',
        bodyType: 'Кроссовер',
        drivetrain: 'Интеллектуальный подключаемый полный привод AWC (All-Wheel Control) с электромагнитной муфтой в приводе задней оси. Режимы 2WD, 4WD Auto, 4WD Lock.',
        awdSystemName: 'AWC (All-Wheel Control с муфтой JTEKT)',
        overview: 'Второе поколение на платформе Project Global (GS). Агрессивный дизайн Jet Fighter (рестайлинг), двухстворчатая крышка багажника с откидным бортом (выдерживает до 200 кг!), доступен мощный двигатель 3.0 V6 с классическим автоматом или 2.4 с вариатором Jatco.',
        dimensions: {
          lengthMm: 4640,
          widthMm: 1800,
          heightMm: 1680,
          wheelbaseMm: 2670,
          groundClearanceMm: 215,
          trunkVolumeLiters: '541 – 1691 л',
          fuelTankLiters: 60,
          curbWeightKg: '1570 – 1720 кг'
        },
        engines: [
          {
            code: '4B11',
            name: '2.0L 16V DOHC MIVEC',
            displacement: '1998 см³',
            powerHp: '147 л.с. @ 6000 об/мин',
            torqueNm: '199 Н·м @ 4200 об/мин',
            valves: '16V DOHC с двойным фазорегулятором MIVEC на впуске и выпуске',
            fuelSystem: 'Электронный распределенный впрыск ECI-MULTI',
            timingDrive: 'Надежная необслуживаемая цепь ГРМ (ресурс 250 000+ км)',
            strengths: ['Цепной привод ГРМ', 'Алюминиевый блок с чугунными гильзами', 'Экономичность'],
            weaknesses: ['Недостаток тяги для тяжелого кузова при полной загрузке']
          },
          {
            code: '4B12',
            name: '2.4L 16V DOHC MIVEC',
            displacement: '2360 см³',
            powerHp: '170 л.с. @ 6000 об/мин',
            torqueNm: '232 Н·м @ 4100 об/мин',
            valves: '16V DOHC MIVEC (впуск и выпуск)',
            fuelSystem: 'MPI ECI-MULTI',
            timingDrive: 'Цепь ГРМ со сроком службы более 250 тыс. км',
            strengths: ['Самый сбалансированный мотор для Outlander XL', 'Отличная тяга и ресурс при регулярной смене масла'],
            weaknesses: ['Течь переднего сальника коленвала к 120 тыс. км', 'Шум роликов навесного оборудования']
          },
          {
            code: '6B31',
            name: '3.0L 24V SOHC MIVEC V6',
            displacement: '2998 см³ V6',
            powerHp: '220-230 л.с. @ 6250 об/мин',
            torqueNm: '276-291 Н·м @ 4000 об/мин',
            valves: '24V SOHC V6 с фазовращателями MIVEC',
            fuelSystem: 'MPI распределенный впрыск',
            timingDrive: 'Зубчатый ремень ГРМ (замена строго каждые 90 000 км)',
            strengths: ['Великолепный разгон (0-100 за 8.9 с) и звук V6', 'Агрегатируется ТОЛЬКО с надежным классическим 6-ступенчатым автоматом Aisin!'],
            weaknesses: ['Дорогая замена ремня ГРМ с гидронатяжителем', 'Расход топлива 15-18 л по городу', 'Прогар гофр глушителя']
          }
        ],
        transmissions: [
          'Бесступенчатый вариатор Jatco JF011E (F1CJA / W1CJA) со степ-мотором и радиатором охлаждения',
          '6-ступенчатая гидромеханическая АКПП Aisin F6AJA / W6AJA (строго с двигателем 3.0 V6)',
          '5-ступенчатая МКПП F5MBB / W5MBB (с моторами 2.0 и 2.4)'
        ],
        fuelEconomy: {
          city: '12.4 – 15.8 л/100 км',
          highway: '7.9 – 9.5 л/100 км',
          combined: '9.3 – 10.6 л/100 км',
          fuelGrade: 'АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 API SN, ILSAC GF-5 (4.6 л для 4B12; 4.3 л для 6B31)',
          engineOilVolume: '4.6 л (2.4 4B12) / 4.3 л (3.0 6B31)',
          transmissionFluid: 'Вариатор JF011E: DiaQueen CVTF-J1 (7.1 л полная замена); АКПП 6-ст Aisin: DiaQueen ATF-J2 (8.2 л)',
          transferCaseAndDiff: 'Раздатка: 0.49 л 80W-90 GL-5; Задний дифференциал: 0.50 л 80W-90 GL-5',
          coolant: '7.5 – 9.5 л Super Long Life Coolant',
          brakeFluid: '1.0 л DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H7 55W (галоген) или D2S 35W (заводской ксенон с линзой)',
          highBeam: 'HB3 (9005) 60W',
          fogLights: 'H11 55W',
          frontTurn: 'WY21W (T20 оранжевая)',
          tailStop: 'Светодиодные модули LED (стопы) + W21W (задний ход)',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'В районе левой коленки водителя, снизу торпеды над педальным узлом.',
          commonCodes: [
            { code: 'P0845', title: 'Transmission Fluid Pressure Sensor Circuit', hint: 'Датчик давления в вариаторе JF011E' },
            { code: 'P1777', title: 'Stepper Motor Failure', hint: 'Степ-мотор управления передаточным отношением вариатора' },
            { code: 'P0420', title: 'Низкая эффективность катализатора', hint: 'Лямбда-зонд или старение сот нейтрализатора' }
          ],
          protocol: 'CAN ISO 15765-4 + K-Line MUT-III'
        },
        knownIssues: [
          {
            title: 'Перегрев вариатора Jatco JF011E (загорается надпись Slow Down)',
            symptoms: 'На скоростях выше 130 км/ч или в затяжных подъемах пищит зуммер и на приборке загорается надпись: «Transmission Temp High — Slow Down».',
            rootCause: 'Забивание грязью штатного радиатора вариатора, расположенного под левым передним подкрылком перед колесом.',
            solution: 'Промывка или перенос дополнительного масляного радиатора вариатора в зону основного обдува за решетку радиатора с установкой термостата.'
          },
          {
            title: 'Утечка через патрубки радиатора охлаждения АКПП/вариатора',
            symptoms: 'Следы масла в левой части переднего бампера, падение уровня рабочей жидкости в трансмиссии.',
            rootCause: 'Коррозия алюминиевых трубок радиатора охлаждения рабочей жидкости вариатора от зимних солей.',
            solution: 'Замена трубок на армированные маслостойкие шланги или замена узла на новый.'
          }
        ]
      },
      {
        id: 'outlander-3',
        brandId: 'mitsubishi',
        name: 'Outlander III (GF_W / PHEV)',
        generation: 'III поколение (2012–2021)',
        years: '2012–2021',
        bodyType: 'Кроссовер',
        drivetrain: 'Интеллектуальный привод All-Wheel Control (AWC) / Super All-Wheel Control (S-AWC с передним активным дифференциалом AFD) или Twin Motor 4WD (PHEV гибрид).',
        awdSystemName: 'S-AWC (Super All-Wheel Control) / Twin Motor 4WD',
        overview: 'Третье поколение стало бестселлером за счет просторного 5- или 7-местного салона, высокой шумоизоляции, усовершенствованной системы полного привода S-AWC и первой в мире полноприводной plug-in гибридной модификации Outlander PHEV (два электромотора по 60/70 кВт + ДВС 2.0/2.4).',
        dimensions: {
          lengthMm: 4695,
          widthMm: 1810,
          heightMm: 1710,
          wheelbaseMm: 2670,
          groundClearanceMm: 215,
          trunkVolumeLiters: '591 – 1754 л',
          fuelTankLiters: 60,
          curbWeightKg: '1480 – 1910 кг'
        },
        engines: [
          {
            code: '4J11',
            name: '2.0L 16V SOHC MIVEC Smart Valve',
            displacement: '1998 см³',
            powerHp: '146 л.с. @ 6000 об/мин',
            torqueNm: '196 Н·м @ 4200 об/мин',
            valves: '16V SOHC с инновационным приводом клапанов MIVEC (высота подъема регулируется бесступенчато)',
            fuelSystem: 'MPI электронный впрыск',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Экономичность (7.5 л по трассе)', 'Отсутствие дроссельной заслонки (управление высотой клапанов)', 'Надежная цепь'],
            weaknesses: ['Чувствительность к чистоте моторного масла для механизмов фазорегулятора']
          },
          {
            code: '4J12',
            name: '2.4L 16V SOHC MIVEC Smart Valve',
            displacement: '2360 см³',
            powerHp: '167 л.с. @ 6000 об/мин',
            torqueNm: '222 Н·м @ 4100 об/мин',
            valves: '16V SOHC MIVEC',
            fuelSystem: 'MPI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Энерговооруженность для трассы', 'Ресурс свыше 300 000 км'],
            weaknesses: ['Требование к периодической проверке зазоров клапанов']
          },
          {
            code: '6B31',
            name: '3.0L 24V SOHC MIVEC V6 Sport',
            displacement: '2998 см³ V6',
            powerHp: '227-230 л.с. @ 6250 об/мин',
            torqueNm: '292 Н·м @ 3750 об/мин',
            valves: '24V SOHC V6 MIVEC',
            fuelSystem: 'MPI',
            timingDrive: 'Ремень ГРМ',
            strengths: ['Разгон до 100 км/ч за 8.7 с', 'Система полного привода S-AWC в базе', 'Автомат 6-АКПП'],
            weaknesses: ['Транспортный налог, стоимость обслуживания ремня ГРМ']
          }
        ],
        transmissions: [
          'Вариатор Jatco JF016E (CVT8) со штатным контуром охлаждения',
          '6-ступенчатая гидромеханическая АКПП (только с 3.0 V6)',
          'Одноступенчатый редуктор с прямым приводом (PHEV)'
        ],
        fuelEconomy: {
          city: '9.8 – 12.2 л/100 км (PHEV: 1.8 – 5.5 л)',
          highway: '6.4 – 7.5 л/100 км',
          combined: '7.7 – 8.9 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 API SN/SP, ILSAC GF-6 (4.2 л)',
          engineOilVolume: '4.2 – 4.6 л',
          transmissionFluid: 'Вариатор JF016E: СТРОГО DiaQueen CVTF-J4 (7.1 л); АКПП 6-ст: DiaQueen ATF-J3 (8.2 л)',
          transferCaseAndDiff: 'Раздаточная коробка и задний дифференциал: 75W-85 GL-5 Hypoid (по 0.45 л)',
          coolant: '7.5 л Mitsubishi Super Long Life Coolant Premium (синий)',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H7 55W (галоген) или заводской светодиодный LED-модуль',
          highBeam: 'HB3 60W или LED',
          fogLights: 'H16 19W (пластиковые корпуса) или LED',
          frontTurn: 'WY21W',
          tailStop: 'LED комбинированные фонари',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под рулевой колонкой слева, удобный открытый доступ над площадкой для отдыха левой ноги.',
          commonCodes: [
            { code: 'P0746', title: 'Pressure Control Solenoid A Performance', hint: 'Редукционный клапан масляного насоса вариатора JF016E' },
            { code: 'P0135', title: 'O2 Sensor Heater Circuit (Bank 1, Sensor 1)', hint: 'Обрыв подогревателя верхнего датчика кислорода' }
          ],
          protocol: 'CAN ISO 15765-4 + UDS'
        },
        knownIssues: [
          {
            title: 'Зависание редукционного клапана масляного насоса вариатора JF016E',
            symptoms: 'Рывки и подергивания при плавном разгоне на скорости 20-40 км/ч, потеря давления в вариаторе.',
            rootCause: 'Продукты естественного износа ремня и конусов попадают под плунжер клапана масляного насоса, вызывая его заклинивание.',
            solution: 'Регулярная смена жидкости CVTF-J4 каждые 40 000 км с заменой фильтра тонкой очистки в теплообменнике (2920A096) и промывкой поддона с магнитами.'
          }
        ]
      },
      {
        id: 'pajero-4',
        brandId: 'mitsubishi',
        name: 'Pajero IV (V80 / V90)',
        generation: 'IV поколение (2006–2021)',
        years: '2006–2021',
        bodyType: 'Внедорожник',
        drivetrain: 'Полноценная легендарная трансмиссия Super Select 4WD-II: 2H (задний), 4H (постоянный полный с несимметричным диффом 33:67), 4HLc (блокировка центра), 4LLc (понижающая передача 1.9:1) + штатная 100% принудительная блокировка заднего межколесного дифференциала R/D Lock.',
        awdSystemName: 'Super Select 4WD-II (SS4-II) с межосевым дифференциалом планетарного типа',
        overview: 'Абсолютная икона внедорожного мира. Интегрированная в силовой каркас кузова лонжеронная рама, полностью независимая пружинная подвеска всех колес на двойных поперечных рычагах спереди и многорычажке сзади, бронебойная проходимость и статус «Короля пустыни Дакар».',
        dimensions: {
          lengthMm: 4900,
          widthMm: 1875,
          heightMm: 1870,
          wheelbaseMm: 2780,
          groundClearanceMm: 225,
          trunkVolumeLiters: '663 – 1790 л',
          fuelTankLiters: 88,
          curbWeightKg: '2110 – 2380 кг'
        },
        engines: [
          {
            code: '6G75',
            name: '3.8L 24V SOHC MIVEC V6 Cyclone',
            displacement: '3828 см³ V6',
            powerHp: '250 л.с. @ 6000 об/мин',
            torqueNm: '338 Н·м @ 2750 об/мин',
            valves: '24V SOHC V6 MIVEC',
            fuelSystem: 'MPI распределенный впрыск',
            timingDrive: 'Ремень ГРМ с гидронатяжителем (интервал 90 тыс. км)',
            strengths: ['Паровозная тяга с низов', 'Надежный чугунный блок V6'],
            weaknesses: ['Откручивание болтиков заслонок изменения геометрии впускного коллектора', 'Проворот вкладышей коленвала при масляном голодании']
          },
          {
            code: '6G72',
            name: '3.0L 24V SOHC V6 Cyclone',
            displacement: '2972 см³ V6',
            powerHp: '174-178 л.с. @ 5250 об/мин',
            torqueNm: '255-261 Н·м @ 4000 об/мин',
            valves: '24V SOHC V6 без фазовращателей (максимально простая конструкция)',
            fuelSystem: 'MPI распределенный впрыск',
            timingDrive: 'Ремень ГРМ',
            strengths: ['Легендарная неубиваемость (ресурс 500 000+ км)', 'Спокойно переваривает бензин АИ-92', 'Дешевые запчасти'],
            weaknesses: ['Неспешный разгон тяжелого внедорожника (0-100 около 13 сек)']
          },
          {
            code: '4M41',
            name: '3.2L 16V DOHC DI-D Common Rail Turbo Diesel',
            displacement: '3200 см³ Турбодизель',
            powerHp: '165-200 л.с. @ 3800 об/мин',
            torqueNm: '373-441 Н·м @ 2000 об/мин',
            valves: '16V DOHC турбодизель с интеркулером',
            fuelSystem: 'Common Rail с давлением впрыска до 1800 бар',
            timingDrive: 'Двухрядная цепь ГРМ (ресурс свыше 200 000 км)',
            strengths: ['Колоссальный крутящий момент (до 441 Н·м)', 'Умеренный расход солярки (9-11 л/100 км)'],
            weaknesses: ['Растяжение цепи ГРМ к 150-200 тыс. км', 'Чувствительность ТНВД и пьезофорсунок к качеству топлива']
          }
        ],
        transmissions: [
          '5-ступенчатая гидромеханическая АКПП INVECS-II V5A51 (с моторами 3.8 и 3.2)',
          '4- или 5-ступенчатая АКПП Aisin / INVECS-II V4A51 / V5A51 (с мотором 3.0)',
          '5-ступенчатая механическая коробка V5M31'
        ],
        fuelEconomy: {
          city: '11.2 – 17.5 л/100 км (Дизель: 11-12 л, Бензин V6: 16-19 л)',
          highway: '8.2 – 11.5 л/100 км',
          combined: '9.3 – 13.5 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95 или ДТ Евро-5'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 (4.9 л для бензиновых V6; 9.8 л для дизеля 3.2 DI-D)',
          engineOilVolume: '4.9 л (V6) / 9.8 л (3.2 DI-D)',
          transmissionFluid: 'АКПП: DiaQueen ATF-PA (для 5-ст АКПП V5A51) или ATF SP-III (9.7 л полный объем)',
          transferCaseAndDiff: 'Раздаточная коробка: 2.8 л 75W-90 GL-4; Передний редуктор: 1.15 л 80W-90 GL-5; Задний редуктор: 1.6 л 80W-90 GL-5 (для блокируемого)',
          coolant: '10.5 – 12.0 л антифриза',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H11 (галоген) или D2S (заводской ксенон)',
          highBeam: 'HB3 (9005) 60W',
          fogLights: 'H11 55W',
          frontTurn: 'PY21W',
          tailStop: 'W21/5W (комбинированная лампа)',
          interior: 'W5W (T10) и C5W'
        },
        obdDiagnostics: {
          portLocation: 'Под торпедой слева от руля, внизу у блока предохранителей.',
          commonCodes: [
            { code: 'P0106', title: 'Датчик абсолютного давления во впускном коллекторе MAP', hint: 'Закоксовывание трубки датчика нагаром от клапана EGR на 4M41' },
            { code: 'P2009', title: 'Привод заслонок впускного коллектора', hint: 'Люфт или откручивание болтиков заслонок на моторе 3.8 6G75' }
          ],
          protocol: 'CAN ISO 15765 + MUT-III'
        },
        knownIssues: [
          {
            title: 'Болтики заслонок изменения длины впускного коллектора (мотор 3.8 6G75)',
            symptoms: 'Шум впускного коллектора, при худшем сценарии — мгновенный стук и разрушение цилиндропоршневой группы.',
            rootCause: 'Заводские винтики крепления заслонок со временем выкручиваются от вибраций и всасываются прямо в цилиндр двигателя.',
            solution: 'Снятие коллектора, проверка заслонок и фиксация всех винтов на термостойкий резьбовой герметик (Локтайт).'
          },
          {
            title: 'Коррозия задних трубок второго контура кондиционера',
            symptoms: 'Кондиционер перестает холодить, утечка фреона под правым задним крылом.',
            rootCause: 'Алюминиевые трубки магистрали на второй контур обдува задних пассажиров проложены открыто под днищем и сгнивают за 3-5 зим.',
            solution: 'Замена сгнивших трубок на гибкие резиновые фреоновые шланги Goodyear/Galaxy или глушение второго контура.'
          }
        ]
      },
      {
        id: 'lancer-9',
        brandId: 'mitsubishi',
        name: 'Lancer IX (CS_A / Classic)',
        generation: 'IX поколение (2000–2010)',
        years: '2000–2010',
        bodyType: 'Седан',
        drivetrain: 'Передний привод (FWD) или постоянный полный привод (4WD для японского рынка Lancer Cedia).',
        awdSystemName: 'FWD / Full-Time 4WD (Cedia)',
        overview: 'Один из самых популярных и надежных японских седанов C-класса в истории. Независимая подвеска с эффектом подруливания сзади, выверенная управляемость, просторный салон и неприхотливые двигатели серии 4G18 и 4G63.',
        dimensions: {
          lengthMm: 4480,
          widthMm: 1695,
          heightMm: 1445,
          wheelbaseMm: 2600,
          groundClearanceMm: 165,
          trunkVolumeLiters: '430 л',
          fuelTankLiters: 50,
          curbWeightKg: '1185 – 1250 кг'
        },
        engines: [
          {
            code: '4G18',
            name: '1.6L 16V SOHC Orion',
            displacement: '1584 см³',
            powerHp: '98 л.с. @ 5000 об/мин',
            torqueNm: '150 Н·м @ 4000 об/мин',
            valves: '16V SOHC',
            fuelSystem: 'MPI распределенный впрыск',
            timingDrive: 'Ремень ГРМ (замена каждые 90 000 км)',
            strengths: ['Низкий расход топлива (6.5 л по трассе)', 'Надежный пуск в любые морозы'],
            weaknesses: ['Масложор из-за залегания маслосъемных колец к 120-150 тыс. км', 'Износ дроссельной заслонки (плавают обороты холостого хода)']
          },
          {
            code: '4G63',
            name: '2.0L 16V DOHC Sirius (Lancer 2.0 Sport)',
            displacement: '1997 см³',
            powerHp: '135 л.с. @ 5750 об/мин',
            torqueNm: '176 Н·м @ 4500 об/мин',
            valves: '16V DOHC',
            fuelSystem: 'MPI',
            timingDrive: 'Ремень ГРМ + ремень балансиров',
            strengths: ['Динамика, заводская растяжка передних стоек, спортивная подвеска', 'Высокий ресурс'],
            weaknesses: ['Дороже в обслуживании ремней ГРМ и балансирного вала']
          }
        ],
        transmissions: [
          '5-ступенчатая МКПП F5M41 / F5M42',
          '4-ступенчатый адаптивный автомат INVECS-II F4A41 / F4A42'
        ],
        fuelEconomy: {
          city: '8.8 – 10.5 л/100 км',
          highway: '5.5 – 6.8 л/100 км',
          combined: '6.7 – 8.0 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 (3.3 л для 4G18; 4.0 л для 4G63)',
          engineOilVolume: '3.3 – 4.0 л',
          transmissionFluid: 'АКПП: DiaQueen ATF SP-III (7.7 л полный объем); МКПП: 75W-80 / 75W-85 GL-4 (2.1 л)',
          transferCaseAndDiff: 'Не применяется (FWD)',
          coolant: '6.0 л антифриза',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H4 60/55W (совмещенный ближний/дальний)',
          highBeam: 'H4 60/55W',
          fogLights: 'H3 55W',
          frontTurn: 'PY21W',
          tailStop: 'P21/5W',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Слева под рулевой колонкой за лючком предохранителей.',
          commonCodes: [
            { code: 'P0421', title: 'Warm Up Catalyst Efficiency Below Threshold', hint: 'Проблема катализатора выпускного коллектора на 4G18' },
            { code: 'P0505', title: 'Idle Air Control System', hint: 'Износ дроссельного узла или шагового регулятора РХХ' }
          ],
          protocol: 'ISO 9141-2 / MUT-II'
        },
        knownIssues: [
          {
            title: 'Масложор на двигателе 1.6 4G18',
            symptoms: 'Расход масла от 500 мл до 1.5 литра на 1000 км, сизый дым при перегазовках.',
            rootCause: 'Залегание тонких штатных маслосъемных колец из-за городского режима и редкой смены масла.',
            solution: 'Раскоксовка (на ранней стадии) либо замена колец (комплект TP или RIK) и маслосъемных колпачков Nok.'
          },
          {
            title: 'Износ дроссельного узла (дроссель Титуса)',
            symptoms: 'Зависание оборотов холостого хода на уровне 1500–2000 об/мин при прогреве и сбросе газа.',
            rootCause: 'Выработка алюминиевого корпуса дросселя стальной заслонкой из-за радиального люфта оси.',
            solution: 'Расточка корпуса дросселя с установкой подшипника качения на ось и новой латунной заслонки (известный клубный метод «дроссель от Титуса»).'
          }
        ]
      },
      {
        id: 'pajero-sport-3',
        brandId: 'mitsubishi',
        name: 'Pajero Sport III (KS_W)',
        generation: 'III поколение (2015–наст. время)',
        years: '2015–наст. время',
        bodyType: 'Внедорожник',
        drivetrain: 'Рамный внедорожник с трансмиссией Super Select 4WD-II (электронный селектор-шайба режимов, межосевой дифференциал Torsen с распределением 40:60, режимы 2H, 4H, 4HLc, 4LLc, Off-Road Mode, помощь при спуске HDC, принудительная блокировка заднего моста).',
        awdSystemName: 'Super Select 4WD-II с самоблоком Torsen',
        overview: 'Настоящий рамный экспедиционник нового поколения. Построен на усиленном шасси пикапа L200, оснащается алюминиевым тяговитым дизелем 2.4 MIVEC с цепью ГРМ или 3.0 бензиновым V6, и современной 8-ступенчатой автоматической коробкой передач Aisin.',
        dimensions: {
          lengthMm: 4825,
          widthMm: 1815,
          heightMm: 1805,
          wheelbaseMm: 2800,
          groundClearanceMm: 218,
          trunkVolumeLiters: '715 – 1813 л',
          fuelTankLiters: 68,
          curbWeightKg: '2050 – 2160 кг'
        },
        engines: [
          {
            code: '4N15',
            name: '2.4L MIVEC Clean Diesel DOHC Turbo',
            displacement: '2442 см³ Турбодизель',
            powerHp: '181 л.с. @ 3500 об/мин',
            torqueNm: '430 Н·м @ 2500 об/мин',
            valves: '16V DOHC со сниженной степенью сжатия 15.5:1 и фазовращателями MIVEC на впуске',
            fuelSystem: 'Common Rail 2000 бар с турбиной с изменяемой геометрией VGT',
            timingDrive: 'Цепь ГРМ повышенной прочности',
            strengths: ['Огромный крутящий момент 430 Н·м', 'Низкий расход топлива (7.5-9 л)', 'Тихая работа благодаря MIVEC'],
            weaknesses: ['Чувствительность сажевого фильтра DPF к городским пробкам']
          },
          {
            code: '6B31',
            name: '3.0L MIVEC V6 Бензин',
            displacement: '2998 см³ V6',
            powerHp: '209 л.с. @ 6000 об/мин',
            torqueNm: '279 Н·м @ 4000 об/мин',
            valves: '24V SOHC V6 MIVEC',
            fuelSystem: 'MPI',
            timingDrive: 'Ремень ГРМ',
            strengths: ['Бензиновая надежность и моментальный прогрев зимой', 'Всеядность к топливу АИ-92'],
            weaknesses: ['Расход топлива в городе до 15-17 литров']
          }
        ],
        transmissions: [
          '8-ступенчатая гидромеханическая АКПП Aisin TL-80NF (AWR8L45)',
          '6-ступенчатая МКПП (для коммерческих версий)'
        ],
        fuelEconomy: {
          city: '9.8 – 14.5 л/100 км (Дизель: 9.8 л; Бензин: 14.5 л)',
          highway: '7.0 – 8.9 л/100 км',
          combined: '8.0 – 10.9 л/100 км',
          fuelGrade: 'ДТ Евро-5 или АИ-92/95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-30 / 5W-30 C3 / JASO DL-1 (для дизеля с DPF: 8.4 л); 5W-30 (для бензина: 4.3 л)',
          engineOilVolume: '8.4 л (4N15) / 4.3 л (6B31)',
          transmissionFluid: 'АКПП 8-ст Aisin: СТРОГО Mitsubishi ATF-MA1 (полный объем 10.9 л)',
          transferCaseAndDiff: 'Раздатка: 1.4 л 75W-90 GL-4; Передний мост: 1.15 л 80W-90 GL-5; Задний мост: 1.6 л 80W-90 GL-5',
          coolant: '9.0 л Super Long Life Coolant',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'Заводские Bi-LED линзованные фары (светодиодные)',
          highBeam: 'LED',
          fogLights: 'LED или H11',
          frontTurn: 'WY21W',
          tailStop: 'Фирменные «стекающие» вертикальные светодиодные LED фонари',
          interior: 'LED / W5W'
        },
        obdDiagnostics: {
          portLocation: 'Слева под рулевой колонкой.',
          commonCodes: [
            { code: 'P2463', title: 'Diesel Particulate Filter - Soot Accumulation', hint: 'Заполнение сажевого фильтра DPF, требуется принудительный прожиг' },
            { code: 'P0046', title: 'Turbocharger Boost Control Circuit', hint: 'Привод геометрии турбокомпрессора' }
          ],
          protocol: 'CAN ISO 15765-4 + UDS'
        },
        knownIssues: [
          {
            title: 'Забивание сажевого фильтра DPF при частых коротких поездках',
            symptoms: 'Повышение уровня моторного масла по щупу (выше отметки Х), загорание индикатора DPF на щитке приборов.',
            rootCause: 'Непрекращающиеся попытки автоматической регенерации сажевого фильтра приводят к смыванию солярки в картер двигателя.',
            solution: 'Выезд на загородную трассу со скоростью выше 80 км/ч на 25 минут для завершения прожига, либо принудительная сервисная регенерация через сканер.'
          }
        ]
      }
    ]
  },

  // 2. TOYOTA MOTOR CORPORATION
  {
    id: 'toyota',
    name: 'Toyota',
    russianName: 'Тойота',
    country: 'Япония',
    founded: 1937,
    headquarters: 'Тоёта, Айти, Япония',
    tagline: 'Lead the Way (Абсолютный эталон мировой надежности и качества QDR)',
    description: 'Крупнейший автопроизводитель планеты. Создатель непревзойденной производственной философии Toyota Production System (Кайдзен). Мировой лидер в гибридных технологиях (семейство THS/Hybrid Synergy Drive) и создатель бессмертных рамных внедорожников Land Cruiser.',
    brandColor: '#ef4444', // Toyota Red
    awdPhilosophy: 'Постоянный полный привод Full-Time 4WD с самоблокирующимся дифференциалом Torsen (Land Cruiser / Prado), подключаемый Part-Time 4WD (Hilux) и интеллектуальная система Dynamic Torque Vectoring AWD с двумя муфтами на задней оси (RAV4).',
    models: [
      {
        id: 'toyota-land-cruiser-100',
        brandId: 'toyota',
        name: 'Land Cruiser 100 / Cygnus',
        generation: 'Серия 100 (1998–2007)',
        years: '1998–2007',
        bodyType: 'Внедорожник',
        drivetrain: 'Постоянный полный привод Full-Time 4WD с симметричным межосевым дифференциалом, жесткой электромеханической блокировкой центра и понижающим рядом.',
        awdSystemName: 'Full-Time 4WD с блокировкой межосевого дифференциала',
        overview: 'Золотой эталон экспедиционных и статусных внедорожников. Чугунный блок двигателя V8 2UZ-FE называют «мотором-миллионником». Модель оснащалась гидравлической подвеской с регулировкой клиренса AHC (Active Height Control) и неразрезным задним мостом.',
        dimensions: {
          lengthMm: 4890,
          widthMm: 1940,
          heightMm: 1890,
          wheelbaseMm: 2850,
          groundClearanceMm: 220,
          trunkVolumeLiters: '830 – 1370 л',
          fuelTankLiters: 96,
          curbWeightKg: '2320 – 2580 кг'
        },
        engines: [
          {
            code: '2UZ-FE',
            name: '4.7L 32V DOHC V8 VVT-i',
            displacement: '4664 см³ V8',
            powerHp: '235-282 л.с. @ 4800 об/мин',
            torqueNm: '434 Н·м @ 3400 об/мин',
            valves: '32V DOHC V8, чугунный блок цилиндров',
            fuelSystem: 'Электронный распределенный впрыск EFI',
            timingDrive: 'Зубчатый ремень (ресурс 100–150 тыс. км)',
            strengths: ['Ресурс зависит от обслуживания и условий эксплуатации; фиксированный пробег без капремонта не гарантируется', 'Монументальный чугунный блок, тишина работы'],
            weaknesses: ['Расход бензина в городе (18–24 л/100 км)', 'Трещины выпускных коллекторов к 200 тыс. км']
          },
          {
            code: '1HD-FTE',
            name: '4.2L 24V SOHC Turbo Diesel',
            displacement: '4164 см³ Рядная 6-ка Турбодизель',
            powerHp: '204 л.с. @ 3400 об/мин',
            torqueNm: '430 Н·м @ 1800 об/мин',
            valves: '24V SOHC с прямым впрыском топлива',
            fuelSystem: 'Электронный ТНВД Denso V4',
            timingDrive: 'Ремень привода распредвала и шестерни',
            strengths: ['Колоссальная тяга и ресурс легендарного чугунного дизеля 1HD', 'Экономичность на трассе (10-11 л)'],
            weaknesses: ['Высокая стоимость форсунок и ТНВД при попадании воды']
          }
        ],
        transmissions: [
          '4-ступенчатый сверхнадежный автомат Aisin A343F (до 2002 года)',
          '5-ступенчатый автомат Aisin A750F (с 2003 года)'
        ],
        fuelEconomy: {
          city: '13.5 – 22.0 л/100 км',
          highway: '9.8 – 14.5 л/100 км',
          combined: '11.5 – 17.5 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95 или ДТ'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 API SN / CI-4 (6.8 л для 2UZ-FE; 11.4 л для 1HD-FTE)',
          engineOilVolume: '6.8 л (V8 2UZ) / 11.4 л (Дизель 1HD)',
          transmissionFluid: 'АКПП Aisin A343F: Toyota ATF D-II / T-IV; АКПП A750F: Toyota ATF WS (полный объем 11.0 л)',
          transferCaseAndDiff: 'Раздатка: 1.3 л 75W-90 GL-4/GL-5; Передний редуктор: 1.6 л 80W-90 GL-5; Задний мост: 3.3 л 80W-90 GL-5',
          coolant: '15.0 л Toyota Super Long Life Coolant (розовый)',
          brakeFluid: 'DOT 4 / Toyota Brake Fluid'
        },
        bulbsSummary: {
          lowBeam: 'HB4 (9006) 55W',
          highBeam: 'HB3 (9005) 60W',
          fogLights: 'HB4 55W',
          frontTurn: 'PY21W',
          tailStop: 'P21/5W (или светодиоды на Cygnus)',
          interior: 'Festoon 31мм и T10'
        },
        obdDiagnostics: {
          portLocation: 'Под рулевой колонкой слева у площадки отдыха левой ноги + круглый диагностический разъем DLC-1 под капотом (на ранних годах).',
          commonCodes: [
            { code: 'P0430', title: 'Катализатор Bank 2 ниже порога', hint: 'Естественный износ катализатора от бензина' },
            { code: 'P1220', title: 'Timer Control Valve (Дизель)', hint: 'Клапан опережения впрыска ТНВД' }
          ],
          protocol: 'Toyota OBD-II / ISO 9141-2 / K-Line + M-OBD'
        },
        knownIssues: [
          {
            title: 'Трещины выпускных коллекторов на моторе 2UZ-FE',
            symptoms: 'Характерное цоканье «на холодную» со стороны арок передних колес, пропадающее по мере прогрева двигателя.',
            rootCause: 'Усталостное термическое растрескивание сварных швов стальных труб выпускного коллектора.',
            solution: 'Замена коллекторов на чугунные от рестайлинговой версии либо качественная сварка полуавтоматом в среде аргона.'
          },
          {
            title: 'Отказ датчиков высоты подвески AHC',
            symptoms: 'Внедорожник падает в нижнее положение, моргает индикатор Off/Lo гидроподвески.',
            rootCause: 'Попадание влаги внутрь тяг и корпусов датчиков положения кузова на рычагах подвески.',
            solution: 'Переборка и герметизация датчиков или замена на новые оригинальные датчики высоты.'
          }
        ]
      },
      {
        id: 'toyota-rav4-3',
        brandId: 'toyota',
        name: 'RAV4 (XA30)',
        generation: 'III поколение (2005–2012)',
        years: '2005–2012',
        bodyType: 'Кроссовер',
        drivetrain: 'Интеллектуальный подключаемый привод ATC 4WD (Active Torque Control) с электромагнитной муфтой на заднем редукторе. Принудительная блокировка 4WD Lock на скорости до 40 км/ч.',
        awdSystemName: 'ATC 4WD (Active Torque Control)',
        overview: 'Самый популярный компактный кроссовер мира. Запасное колесо на распашной задней двери, просторный салон с ровным полом без тоннеля, феноменальная ликвидность на вторичном рынке и выносливые моторы 2.0 (1AZ-FE / 3ZR-FAE) и 2.4 (2AZ-FE).',
        dimensions: {
          lengthMm: 4395,
          widthMm: 1815,
          heightMm: 1685,
          wheelbaseMm: 2560,
          groundClearanceMm: 190,
          trunkVolumeLiters: '506 – 1469 л',
          fuelTankLiters: 60,
          curbWeightKg: '1500 – 1625 кг'
        },
        engines: [
          {
            code: '1AZ-FE',
            name: '2.0L 16V DOHC VVT-i',
            displacement: '1998 см³',
            powerHp: '152 л.с. @ 6000 об/мин',
            torqueNm: '194 Н·м @ 4000 об/мин',
            valves: '16V DOHC с фазорегулятором VVT-i на впуске',
            fuelSystem: 'EFI многоточечный впрыск',
            timingDrive: 'Однорядная цепь ГРМ (ресурс 200 000+ км)',
            strengths: ['Ресурс свыше 350 000 км', 'Неприхотливость к сервису и расходникам'],
            weaknesses: ['Вытягивание резьбы болтов ГБЦ из блока цилиндров на дорестайлинге (устранено после 2006 г)']
          },
          {
            code: '2AZ-FE',
            name: '2.4L 16V DOHC VVT-i',
            displacement: '2362 см³',
            powerHp: '170 л.с. @ 6000 об/мин',
            torqueNm: '224 Н·м @ 4000 об/мин',
            valves: '16V DOHC VVT-i',
            fuelSystem: 'EFI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Уверенная тяга для обгонов на трассе'],
            weaknesses: ['Повышенный расход моторного масла из-за залегания поршневых колец к 150 тыс. км']
          }
        ],
        transmissions: [
          '4-ступенчатый автомат Aisin U140F (надежнейшая классика)',
          'Бесступенчатый вариатор Aisin K111F / K112F (на рестайлинге 2.0 с 2010 года)',
          '5-ступенчатая или 6-ступенчатая МКПП'
        ],
        fuelEconomy: {
          city: '10.5 – 12.8 л/100 км',
          highway: '6.7 – 8.2 л/100 км',
          combined: '8.2 – 9.6 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 API SN/SP (4.2 л)',
          engineOilVolume: '4.2 литра',
          transmissionFluid: 'АКПП Aisin U140F: СТРОГО Toyota ATF T-IV (полный 8.0 л, частичная 3.8 л); Вариатор: Toyota CVT Fluid TC/FE',
          transferCaseAndDiff: 'Раздаточная коробка: 0.45 л 80W-90 GL-5; Задний дифференциал: 0.50 л 80W-90 GL-5',
          coolant: '6.8 л Toyota Super Long Life Coolant',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H11 55W',
          highBeam: 'HB3 60W',
          fogLights: 'H11 55W',
          frontTurn: 'WY21W',
          tailStop: 'Светодиодные LED фонари',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов со стороны водителя над педалью стояночного тормоза.',
          commonCodes: [
            { code: 'C1280', title: 'Four Wheel Drive System Malfunction', hint: 'Электромагнитная муфта включения заднего привода' },
            { code: 'P0138', title: 'O2 Sensor Circuit High Voltage (Bank 1, Sensor 2)', hint: 'Задний лямбда-зонд' }
          ],
          protocol: 'CAN ISO 15765-4 + Toyota Techstream'
        },
        knownIssues: [
          {
            title: 'Стук рулевой рейки и промежуточного вала',
            symptoms: 'Глухой металлический стук в руль при проезде мелких неровностей и гравийки.',
            rootCause: 'Износ пластиковой опорной втулки с правой стороны рулевой рейки и шлицевого соединения рулевого вала.',
            solution: 'Замена штатной втулки на фторопластовую/капролоновую или замена рулевого карданчика.'
          },
          {
            title: 'Гул подшипника электромагнитной муфты заднего редуктора',
            symptoms: 'Монотонный гул сзади на скорости от 40 км/ч, усиливающийся под нагрузкой.',
            rootCause: 'Попадание влаги через сальник и износ двухрядного опорного подшипника муфты (артикул 90363-95003 / NSK 95DSF01).',
            solution: 'Перепрессовка подшипника муфты без необходимости покупки редуктора в сборе.'
          }
        ]
      },
      {
        id: 'toyota-camry-40',
        brandId: 'toyota',
        name: 'Camry (XV40)',
        generation: 'VI поколение (2006–2011)',
        years: '2006–2011',
        bodyType: 'Седан',
        drivetrain: 'Передний привод (FWD).',
        awdSystemName: 'FWD',
        overview: 'Абсолютный король бизнес-седанов в России и странах СНГ. Непревзойденная плавность хода («ковёр-самолёт»), просторный задний диван, бронебойная подвеска типа МакФерсон спереди и сзади и статус надежного автомобиля чиновников и топ-менеджеров.',
        dimensions: {
          lengthMm: 4815,
          widthMm: 1820,
          heightMm: 1480,
          wheelbaseMm: 2775,
          groundClearanceMm: 160,
          trunkVolumeLiters: '535 л',
          fuelTankLiters: 70,
          curbWeightKg: '1520 – 1610 кг'
        },
        engines: [
          {
            code: '2AZ-FE',
            name: '2.4L 16V DOHC VVT-i',
            displacement: '2362 см³',
            powerHp: '167 л.с. @ 6000 об/мин',
            torqueNm: '224 Н·м @ 4000 об/мин',
            valves: '16V DOHC VVT-i с балансирными валами',
            fuelSystem: 'EFI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Ресурс свыше 400 тыс. км', 'Неприхотливость к топливу АИ-92'],
            weaknesses: ['Масложор поршневой группы на высоких оборотах']
          },
          {
            code: '2GR-FE',
            name: '3.5L 24V DOHC Dual VVT-i V6',
            displacement: '3456 см³ V6',
            powerHp: '277 л.с. @ 6200 об/мин',
            torqueNm: '346 Н·м @ 4700 об/мин',
            valves: '24V DOHC с двойным VVT-i на впуске и выпуске',
            fuelSystem: 'EFI',
            timingDrive: 'Три цепи ГРМ',
            strengths: ['Ураганная динамика (0-100 за 6.8 сек)', 'Шедевральная эластичность мотора V6'],
            weaknesses: ['Повышенная нагрузка на АКПП U660E (снос фрикционов и подшипника корпуса)']
          }
        ],
        transmissions: [
          '5-ступенчатая гидромеханическая АКПП Aisin U250E (с мотором 2.4)',
          '6-ступенчатая АКПП Aisin U660E (с мотором 3.5 V6)',
          '5-ступенчатая МКПП E351'
        ],
        fuelEconomy: {
          city: '11.6 – 14.8 л/100 км',
          highway: '6.7 – 7.8 л/100 км',
          combined: '8.5 – 10.2 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 (4.3 л для 2.4; 6.1 л для 3.5 V6)',
          engineOilVolume: '4.3 л (2.4) / 6.1 л (3.5)',
          transmissionFluid: 'АКПП Aisin U250E / U660E: СТРОГО Toyota ATF WS (World Standard)',
          transferCaseAndDiff: 'Не применяется',
          coolant: '7.8 л Toyota SLLC',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H11 55W (галоген) или D4S 35W (заводской ксенон)',
          highBeam: 'HB3 60W',
          fogLights: 'H11 55W',
          frontTurn: 'WY21W',
          tailStop: 'Светодиодные LED стоп-сигналы',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов слева от руля.',
          commonCodes: [
            { code: 'P0741', title: 'Torque Converter Clutch Solenoid Stuck Off', hint: 'Блокировка гидротрансформатора в АКПП U660E/U250E' },
            { code: 'P0012', title: 'Camshaft Position - Timing Over-Retarded', hint: 'Муфта VVT-i или клапан фазорегулятора' }
          ],
          protocol: 'CAN ISO 15765-4'
        },
        knownIssues: [
          {
            title: 'Преждевременный износ АКПП Aisin U660E на версии 3.5 V6',
            symptoms: 'Толчки и пробуксовки при переключениях со 2-й на 3-ю передачу, вибрации при интенсивном разгоне.',
            rootCause: 'Мощный крутящий момент мотора 2GR-FE (346 Н·м) разбивает посадочное место подшипника центральной шестерни в алюминиевом корпусе коробки.',
            solution: 'Установка модернизированного усиленного упорного подшипника и регулярная замена масла Toyota WS каждые 40-50 тыс. км с фильтром.'
          }
        ]
      }
    ]
  },

  // 3. NISSAN MOTOR CO.
  {
    id: 'nissan',
    name: 'Nissan',
    russianName: 'Ниссан',
    country: 'Япония',
    founded: 1933,
    headquarters: 'Иокогама, Канагава, Япония',
    tagline: 'Innovation that Excites (Инновации, спорт и покорители бездорожья)',
    description: 'Один из столпов японского автопрома. Создатель непревзойденного монстра суперкаров Nissan GT-R (Godzilla с полным приводом ATTESA E-TS), неубиваемого мостового джипа Patrol и основатель европейского сегмента городских кроссоверов Qashqai и X-Trail.',
    brandColor: '#c026d3', // Nissan Purple/Red accent
    awdPhilosophy: 'Легендарная система ATTESA E-TS (электронное распределение тяги на заднюю/переднюю ось в миллисекундах), All-Mode 4x4-i с интеллектуальным распределением крутящего момента и жесткий Part-Time 4WD на Patrol Y61.',
    models: [
      {
        id: 'nissan-xtrail-t31',
        brandId: 'nissan',
        name: 'X-Trail (T31)',
        generation: 'II поколение (2007–2014)',
        years: '2007–2014',
        bodyType: 'Кроссовер',
        drivetrain: 'Интеллектуальный привод All-Mode 4x4-i с электромагнитной муфтой, шайбой переключения режимов (2WD, Auto, Lock с блокировкой 50:50 до 40 км/ч) и системой помощи при спуске Hill Descent Control.',
        awdSystemName: 'All-Mode 4x4-i (активное распределение тяги по датчикам рыскания)',
        overview: 'Квадратный брутальный кроссовер повышенной вместимости. Огромный багажник с двойным дном и выдвижным ящиком для инструментов, моющийся пластик пола, прожекторы дальнего света в рейлингах на крыше и великолепная проходимость.',
        dimensions: {
          lengthMm: 4630,
          widthMm: 1785,
          heightMm: 1770,
          wheelbaseMm: 2630,
          groundClearanceMm: 210,
          trunkVolumeLiters: '603 – 1773 л (с выдвижным органайзером)',
          fuelTankLiters: 65,
          curbWeightKg: '1515 – 1675 кг'
        },
        engines: [
          {
            code: 'MR20DE',
            name: '2.0L 16V DOHC',
            displacement: '1997 см³',
            powerHp: '141 л.с. @ 6000 об/мин',
            torqueNm: '196 Н·м @ 4800 об/мин',
            valves: '16V DOHC с фазорегулятором на впуске',
            fuelSystem: 'Электронный распределенный впрыск',
            timingDrive: 'Однорядная цепь ГРМ (ресурс до 200 000 км)',
            strengths: ['Тихая и плавная работа', 'Хороший ресурс блока при аккуратной замене свечей зажигания'],
            weaknesses: ['Критическая опасность повреждения резьбы свечных колодцев при перетяжке свечей (трескается рубашка охлаждения, антифриз в цилиндр!)']
          },
          {
            code: 'QR25DE',
            name: '2.5L 16V DOHC',
            displacement: '2488 см³',
            powerHp: '169 л.с. @ 6000 об/мин',
            torqueNm: '233 Н·м @ 4400 об/мин',
            valves: '16V DOHC с балансирными валами',
            fuelSystem: 'Многоточечный впрыск EGI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Уверенная тяга для бездорожья и трассы', 'Ресурс свыше 300 000 км'],
            weaknesses: ['Масложор при агрессивной езде, растяжение цепи к 180 тыс. км']
          },
          {
            code: 'M9R',
            name: '2.0L dCi Common Rail Turbo Diesel',
            displacement: '1995 см³ Турбодизель',
            powerHp: '150-173 л.с. @ 4000 об/мин',
            torqueNm: '320-360 Н·м @ 2000 об/мин',
            valves: '16V DOHC турбодизель совместной разработки Renault-Nissan',
            fuelSystem: 'Common Rail Bosch с пьезофорсунками',
            timingDrive: 'Надежная цепь ГРМ',
            strengths: ['Тяговитость паровоза', 'Агрегатируется с классическим автоматом 6-АКПП Jatco JF613E вместо вариатора!'],
            weaknesses: ['Требовательность к качеству солярки и маслу C3 Low SAPS']
          }
        ],
        transmissions: [
          'Бесступенчатый вариатор Jatco JF011E (RE0F10A) со степ-мотором',
          '6-ступенчатая гидромеханическая АКПП Jatco JF613E (строго на дизеле 2.0 dCi)',
          '6-ступенчатая МКПП'
        ],
        fuelEconomy: {
          city: '10.8 – 13.5 л/100 км (Дизель: 8.5–9.5 л)',
          highway: '6.7 – 7.9 л/100 км',
          combined: '8.3 – 9.8 л/100 км',
          fuelGrade: 'АИ-95 или ДТ Евро-5'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 API SN / ACEA A3/B4 (4.4 л для MR20DE; 5.1 л для QR25DE; 7.4 л для дизеля M9R)',
          engineOilVolume: '4.4 – 5.1 л',
          transmissionFluid: 'Вариатор JF011E: СТРОГО Nissan NS-2 (7.5 л полный объем); 6-АКПП: Nissan Matic-S / Matic-J',
          transferCaseAndDiff: 'Угловой редуктор (раздатка): 0.38 л 80W-90 GL-5; Задний дифференциал: 0.55 л 80W-90 GL-5',
          coolant: '7.8 – 8.5 л Nissan Anti-freeze Coolant L250 / L248 (зеленый)',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H11 55W (галоген) или D2S 35W (линзованный ксенон)',
          highBeam: 'H1 55W + прожекторы в рейлингах H3 55W',
          fogLights: 'H8 35W / H11 55W',
          frontTurn: 'PY21W',
          tailStop: 'LED светодиодный блок стоп-сигналов',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под рулевой колонкой за лючком блока предохранителей в салоне.',
          commonCodes: [
            { code: 'P0826', title: 'Up and Down Switch Input Circuit', hint: 'Шлейф селектора ручного режима вариатора' },
            { code: 'P0725', title: 'Engine Speed Input Circuit', hint: 'Датчик частоты вращения коленвала' }
          ],
          protocol: 'CAN ISO 15765-4 + Nissan Consult-III'
        },
        knownIssues: [
          {
            title: 'Растрескивание свечного колодца ГБЦ на двигателе 2.0 MR20DE',
            symptoms: 'Троение на холодную, пропуски зажигания в 1-м или 2-м цилиндре, пузырение в расширительном бачке ОЖ, белый сладковатый дым.',
            rootCause: 'Затяжка свечей зажигания не по мануалу (момент затяжки строго 19 Н·м!). Тонкая стенка резьбы колодца лопается, и антифриз идет в камеру сгорания.',
            solution: 'Замена ГБЦ в сборе. При замене свечей использовать динамометрический ключ строго на 15-19 Н·м.'
          },
          {
            title: 'Разрыв подрулевого шлейфа («улитки» SRS)',
            symptoms: 'Моргает лампа Airbag (беременный человечек), перестают работать кнопки круиз-контроля и громкости на руле, пропадает сигнал клаксона.',
            rootCause: 'Перетирание гибкого ленточного шлейфа внутри кольца подушки безопасности.',
            solution: 'Замена подрулевого шлейфа (артикул 25567-EB301 / 25567-5X00A) на новый.'
          }
        ]
      },
      {
        id: 'nissan-patrol-y61',
        brandId: 'nissan',
        name: 'Patrol GR (Y61)',
        generation: 'V поколение (1997–2010)',
        years: '1997–2010',
        bodyType: 'Внедорожник',
        drivetrain: 'Тяжелый рамный внедорожник с жестко подключаемым передним мостом Part-Time 4WD, механическими или автоматическими хабами на ступицах, понижающей передачей и жесткой блокировкой заднего дифференциала.',
        awdSystemName: 'Part-Time 4WD с двумя неразрезными мостами и отключаемым задним стабилизатором',
        overview: 'Неубиваемая легенда тяжелых экспедиций и трофи-рейдов. Два массивных неразрезных моста на пружинах, гигантский запас прочности рамы, возможность установки колес диаметром 35–37 дюймов без резки арок и знаменитая рядная бензиновая «шестерка» 4.8 TB48DE.',
        dimensions: {
          lengthMm: 5080,
          widthMm: 1940,
          heightMm: 1855,
          wheelbaseMm: 2970,
          groundClearanceMm: 220,
          trunkVolumeLiters: '600 – 2226 л',
          fuelTankLiters: 95,
          curbWeightKg: '2470 – 2620 кг'
        },
        engines: [
          {
            code: 'TB48DE',
            name: '4.8L 24V DOHC Рядный 6-цилиндровый',
            displacement: '4759 см³ Рядный 6-цилиндровый',
            powerHp: '245-280 л.с. @ 4800 об/мин',
            torqueNm: '400-451 Н·м @ 3200 об/мин',
            valves: '24V DOHC с чугунным блоком',
            fuelSystem: 'EGI электронный впрыск',
            timingDrive: 'Мощная двухрядная цепь ГРМ',
            strengths: ['Бессмертный чугунный мотор, потенциал тюнинга с турбонаддувом до 1000+ л.с.'],
            weaknesses: ['Расход бензина в песках и городе от 22 до 30 л/100 км']
          },
          {
            code: 'ZD30DDTi',
            name: '3.0L 16V DOHC Direct Injection Turbo Diesel',
            displacement: '2953 см³ Турбодизель',
            powerHp: '158-160 л.с. @ 3600 об/мин',
            torqueNm: '380 Н·м @ 2000 об/мин',
            valves: '16V DOHC турбодизель с интеркулером',
            fuelSystem: 'ТНВД распределительного типа Bosch VP44',
            timingDrive: 'Шестеренно-цепной привод',
            strengths: ['Хорошая тяга и доступность контрактных запчастей'],
            weaknesses: ['Прогар поршней 3 и 4 цилиндров на моторах до 2004 года из-за бедной смеси и сбоев ДМРВ']
          }
        ],
        transmissions: [
          '4-ступенчатый или 5-ступенчатый гидромеханический автомат Jatco RE4R03A / RE5R05A',
          '5-ступенчатая механическая коробка передач FS5R30A (сверхнадежная)'
        ],
        fuelEconomy: {
          city: '14.5 – 25.0 л/100 км',
          highway: '10.5 – 16.5 л/100 км',
          combined: '12.5 – 19.5 л/100 км',
          fuelGrade: 'ДТ или АИ-92/95'
        },
        fluidsAndCapacities: {
          engineOil: '10W-40 / 5W-40 (8.2 л для дизеля ZD30; 9.5 л для TB48DE)',
          engineOilVolume: '8.2 – 9.5 л',
          transmissionFluid: 'АКПП Jatco: Nissan Matic Fluid D / J (11.0 л); МКПП: 75W-90 GL-4 (3.8 л)',
          transferCaseAndDiff: 'Раздатка: 1.9 л ATF / 75W-90; Передний неразрезной мост: 5.4 л 80W-90 GL-5; Задний мост H233B: 3.0 л 80W-90 GL-5',
          coolant: '13.5 л антифриза',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H4 60/55W',
          highBeam: 'H4 60/55W',
          fogLights: 'H3 55W',
          frontTurn: 'PY21W',
          tailStop: 'P21/5W (в бампере или кузове)',
          interior: 'Festoon 31мм'
        },
        obdDiagnostics: {
          portLocation: 'Слева под рулем + 14-пиновый разъем Nissan Consult под капотом.',
          commonCodes: [
            { code: '0707', title: 'Spill Valve / Injection Timing', hint: 'Электронный дозирующий клапан ТНВД Bosch VP44' },
            { code: '0102', title: 'Mass Air Flow Sensor', hint: 'ДМРВ на моторе ZD30' }
          ],
          protocol: 'Nissan DDL / Consult-II + OBD-II'
        },
        knownIssues: [
          {
            title: 'Прогар поршней на дизеле 3.0 ZD30 (дорестайл до 2004 г.)',
            symptoms: 'Белый дым, потеря компрессии, газы в картер двигателя.',
            rootCause: 'Загрязнение ДМРВ (занижает показания воздуха) приводит к обеднению смеси на наддуве и перегреву днища 3 и 4 поршней свыше 700°C.',
            solution: 'Установка датчика температуры выхлопных газов (EGT), манометра наддува, глушение клапана EGR и увеличение объема заливаемого масла (заводской щуп увеличен на 1.5 л).'
          }
        ]
      }
    ]
  },

  // 4. SUZUKI MOTOR CORPORATION
  {
    id: 'suzuki',
    name: 'Suzuki',
    russianName: 'Сузуки',
    country: 'Япония',
    founded: 1909,
    headquarters: 'Хамамацу, Сидзуока, Япония',
    tagline: 'Way of Life! (Мастера компактных полноприводных внедорожников)',
    description: 'Величайший в мире создатель легких рамных внедорожников (Jimny) и неубиваемой техники. Пионер класса SUV с раздаточной коробкой с понижающим рядом (Grand Vitara / Escudo), дарящий непревзойденную проходимость при минимальной массе.',
    brandColor: '#2563eb', // Suzuki Blue
    awdPhilosophy: 'Постоянный полный привод Full-Time 4WD с дифференциалом и блокировкой (Grand Vitara), жесткий мостовой Part-Time с понижайкой (Jimny) и система AllGrip Select с 4 режимами (SX4 / Vitara).',
    models: [
      {
        id: 'suzuki-grand-vitara-2',
        brandId: 'suzuki',
        name: 'Grand Vitara II (JT / Escudo)',
        generation: 'II поколение (2005–2015)',
        years: '2005–2015',
        bodyType: 'Кроссовер',
        drivetrain: 'Постоянный полный привод 4WD с коническим межосевым дифференциалом с кулачковой блокировкой повышенного трения LSD. Селектор раздаточной коробки на 4 положения: 4H (47:53), 4H Lock (блокировка 50:50), 4L Lock (пониженная передача 1.97:1), N (нейтраль для буксировки).',
        awdSystemName: 'Full-Time 4WD с честной понижающей передачей и блокировкой',
        overview: 'Уникальный автомобиль: сочетает комфорт городского кроссовера (независимая подвеска всех колес, несущий кузов) с проходимостью тяжелого внедорожника благодаря интегрированной в силовой каркас раме лестничного типа и полноценной механической раздатке с понижайкой.',
        dimensions: {
          lengthMm: 4470,
          widthMm: 1810,
          heightMm: 1695,
          wheelbaseMm: 2640,
          groundClearanceMm: 200,
          trunkVolumeLiters: '398 – 1386 л',
          fuelTankLiters: 66,
          curbWeightKg: '1580 – 1695 кг'
        },
        engines: [
          {
            code: 'J20A',
            name: '2.0L 16V DOHC',
            displacement: '1995 см³',
            powerHp: '140 л.с. @ 6000 об/мин',
            torqueNm: '183 Н·м @ 4000 об/мин',
            valves: '16V DOHC, чугунные гильзы в алюминиевом блоке',
            fuelSystem: 'Многоточечный впрыск MPI',
            timingDrive: 'Двухрядный цепной привод ГРМ (две цепи с гидронатяжителями)',
            strengths: ['Ресурс свыше 350 000 км', 'Всеядность к бензину АИ-92'],
            weaknesses: ['Шум и звон цепей ГРМ к 120-150 тыс. км из-за износа верхнего гидронатяжителя']
          },
          {
            code: 'J24B',
            name: '2.4L 16V DOHC VVT',
            displacement: '2393 см³',
            powerHp: '169 л.с. @ 6000 об/мин',
            torqueNm: '227 Н·м @ 3800 об/мин',
            valves: '16V DOHC с системой изменения фаз VVT на впуске',
            fuelSystem: 'MPI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Отличная тяга в гору и по песку', 'Плавная работа'],
            weaknesses: ['Микротрещины блока цилиндров между гильзами на моторах 2008–2009 годов выпуска (заводская сервисная кампания)']
          }
        ],
        transmissions: [
          '4-ступенчатый надежнейший гидромеханический автомат Aisin 03-72LS (A44DE)',
          '5-ступенчатая гидромеханическая АКПП Aisin A750 (на версиях V6 2.7 и 3.2)',
          '5-ступенчатая МКПП'
        ],
        fuelEconomy: {
          city: '11.5 – 14.5 л/100 км',
          highway: '7.8 – 9.2 л/100 км',
          combined: '9.2 – 11.0 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 API SN/CF (4.5 л для J20A; 4.8 л для J24B)',
          engineOilVolume: '4.5 – 4.8 л',
          transmissionFluid: 'АКПП Aisin: СТРОГО Suzuki ATF 3317 или Mobil ATF 3309 (полный 7.5 л); МКПП: 75W-90 GL-4 (1.9 л)',
          transferCaseAndDiff: 'Раздатка: 1.6 л 75W-90 GL-4; Передний редуктор: 1.0 л 80W-90 GL-5 Hypoid; Задний дифференциал: 0.9 л 80W-90 GL-5',
          coolant: '7.3 л Suzuki Super Coolant (синий/зеленый)',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H7 55W (галоген) или D2S 35W (заводской ксенон с автокорректором)',
          highBeam: 'HB3 (9005) 60W',
          fogLights: 'H11 55W',
          frontTurn: 'PY21W',
          tailStop: 'W21/5W безцокольная',
          interior: 'W5W (T10) и C5W 31мм'
        },
        obdDiagnostics: {
          portLocation: 'Под рулевой колонкой слева от педального узла.',
          commonCodes: [
            { code: 'P0420', title: 'Catalyst System Efficiency Below Threshold', hint: 'Верхний катализатор на двигателе J20A' },
            { code: 'C1075', title: 'Steering Angle Sensor Calibration', hint: 'Калибровка датчика угла поворота руля ESP' }
          ],
          protocol: 'CAN ISO 15765-4 + Suzuki SDT'
        },
        knownIssues: [
          {
            title: 'Износ натяжителей и растяжение цепей ГРМ на J20A',
            symptoms: 'Характерное металлическое стрекотание цепи при холодном пуске в течение 2-3 секунд, прогрессирующее в постоянный шум.',
            rootCause: 'Забивание масляного канала верхнего гидронатяжителя цепи шламом от редкой смены моторного масла.',
            solution: 'Комплектная замена двух цепей ГРМ, планок успокоителей и гидронатяжителей оригинальными деталями Suzuki каждые 120-150 тыс. км.'
          },
          {
            title: 'Попадание воды в передний редуктор через сапун',
            symptoms: 'Гул и вой спереди при движении на скорости 60-80 км/ч, эмульсия вместо масла в переднем мосту.',
            rootCause: 'Короткая штатная трубка сапуна переднего дифференциала: при преодолении даже неглубокого брода всасывается вода.',
            solution: 'Вывод удлиненного шланга сапуна редуктора наверх в подкапотное пространство с установкой фильтра.'
          }
        ]
      },
      {
        id: 'suzuki-jimny-3',
        brandId: 'suzuki',
        name: 'Jimny (JB43 / JB74)',
        generation: 'III и IV поколения',
        years: '1998–наст. время',
        bodyType: 'Внедорожник',
        drivetrain: 'Профессиональное рамное шасси с двумя неразрезными зависимыми мостами на пружинах, жестко подключаемый привод Part-Time 4WD (кнопки или рычаг), понижающая передача 2.0:1 / 2.64:1.',
        awdSystemName: 'AllGrip PRO (жесткий Part-Time с понижайкой и пневмохабами)',
        overview: 'Величайший маленький внедорожник всех времен. Не имеет аналогов в мире: весит около 1050 кг, имеет два моста-балки, угол въезда до 37 градусов и феноменальную маневренность в лесу, болотах и каменистых горах.',
        dimensions: {
          lengthMm: 3675,
          widthMm: 1600,
          heightMm: 1705,
          wheelbaseMm: 2250,
          groundClearanceMm: 210,
          trunkVolumeLiters: '113 – 830 л',
          fuelTankLiters: 40,
          curbWeightKg: '1060 – 1110 кг'
        },
        engines: [
          {
            code: 'M13A',
            name: '1.3L 16V DOHC VVT',
            displacement: '1328 см³',
            powerHp: '85 л.с. @ 6000 об/мин',
            torqueNm: '110 Н·м @ 4100 об/мин',
            valves: '16V DOHC VVT',
            fuelSystem: 'MPI электронный впрыск',
            timingDrive: 'Цепь ГРМ повышенного ресурса',
            strengths: ['Легендарная надежность мотора серии M', 'Цепной ГРМ'],
            weaknesses: ['Ограниченная мощность для скоростной езды по автомагистралям']
          },
          {
            code: 'K15B',
            name: '1.5L 16V DOHC VVT (JB74)',
            displacement: '1462 см³',
            powerHp: '102 л.с. @ 6000 об/мин',
            torqueNm: '130 Н·м @ 4000 об/мин',
            valves: '16V DOHC',
            fuelSystem: 'MPI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Заметно лучшая тяга на низах', 'Экономичность'],
            weaknesses: ['Требовательность к качеству воздушного фильтра на пыльных грунтовках']
          }
        ],
        transmissions: [
          '4-ступенчатый автомат Aisin 03-72LE (неубиваемая классика)',
          '5-ступенчатая механическая коробка'
        ],
        fuelEconomy: {
          city: '8.4 – 9.9 л/100 км',
          highway: '6.2 – 7.1 л/100 км',
          combined: '7.1 – 8.1 л/100 км',
          fuelGrade: 'АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 (4.0 л)',
          engineOilVolume: '4.0 литра',
          transmissionFluid: 'АКПП: Suzuki ATF 3317 (5.5 л полный); МКПП: 75W-90 GL-4 (1.3 л)',
          transferCaseAndDiff: 'Раздатка: 0.9 л 75W-90 GL-4; Передний мост: 1.6 л 80W-90 GL-5; Задний мост: 1.3 л 80W-90 GL-5',
          coolant: '5.0 л антифриза',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H4 60/55W или LED модули на JB74',
          highBeam: 'H4 60/55W',
          fogLights: 'H11 55W',
          frontTurn: 'PY21W',
          tailStop: 'P21/5W (в заднем бампере)',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов слева над педалью сцепления/тормоза.',
          commonCodes: [
            { code: 'C1024', title: 'Vacuum Switch Failure 4WD', hint: 'Вакуумная магистраль включения пневматических колесных хабов' },
            { code: 'P0135', title: 'O2 Heater Circuit', hint: 'Нагреватель верхнего датчика кислорода' }
          ],
          protocol: 'ISO 9141-2 / CAN ISO 15765-4'
        },
        knownIssues: [
          {
            title: 'Эффект шимми («Death Wobble») — биение передних колес',
            symptoms: 'Неистовая вибрация и тряска руля при попадании в ямку на скорости 60-80 км/ч, руль выбивает из рук.',
            rootCause: 'Износ шкворневых подшипников поворотных кулаков переднего моста и сайлентблоков тяги Панара.',
            solution: 'Замена шкворневых подшипников (Koyo), установка дистанционных регулировочных шайб и рулевого демпфера Tough Dog.'
          }
        ]
      }
    ]
  },

  // 5. SUBARU CORPORATION
  {
    id: 'subaru',
    name: 'Subaru',
    russianName: 'Субару',
    country: 'Япония',
    founded: 1953,
    headquarters: 'Сибуя, Токио, Япония',
    tagline: 'Confidence in Motion (Симметричный полный привод и оппозитные моторы Boxer)',
    description: 'Инженерная жемчужина Японии. Автомобили с низким центром тяжести благодаря горизонтально-оппозитным двигателям Boxer и легендарной симметричной трансмиссии Symmetrical AWD, прославленной Колином Макреем в WRC.',
    brandColor: '#0284c7', // Subaru Blue
    awdPhilosophy: 'Symmetrical AWD: идеальная развесовка по осям. Варианты: Continuous AWD с механическим межосевым дифференциалом и вискомуфтой 50:50 (МКПП), VTD с планетарным диффом 45:55 и гидромуфтой, и электронно-управляемая муфта Active Torque Split (CVT Lineartronic).',
    models: [
      {
        id: 'subaru-forester-sg-sh',
        brandId: 'subaru',
        name: 'Forester (SG / SH)',
        generation: 'II и III поколения (2002–2013)',
        years: '2002–2013',
        bodyType: 'Кроссовер',
        drivetrain: 'Симметричный постоянный полный привод Symmetrical AWD. На МКПП: межосевой дифференциал с вискомуфтой (50:50) + понижающий ряд Dual-Range на атмосферных версиях. На АКПП/CVT: муфта распределения крутящего момента ACT-4 / VTD.',
        awdSystemName: 'Symmetrical All-Wheel Drive (симметричный полный привод)',
        overview: 'Культовый японский универсал повышенной проходимости. Безрамочные стекла дверей (на поколении SG), огромный панорамный люк в крыше, высокий клиренс 205–215 мм и турбоверсии XT с двигателем от раллийной Impreza WRX.',
        dimensions: {
          lengthMm: 4560,
          widthMm: 1780,
          heightMm: 1700,
          wheelbaseMm: 2615,
          groundClearanceMm: 215,
          trunkVolumeLiters: '450 – 1660 л',
          fuelTankLiters: 60,
          curbWeightKg: '1430 – 1540 кг'
        },
        engines: [
          {
            code: 'EJ204',
            name: '2.0L 16V DOHC Boxer AVCS',
            displacement: '1994 см³ Оппозитный',
            powerHp: '150-158 л.с. @ 6400 об/мин',
            torqueNm: '196 Н·м @ 3200 об/мин',
            valves: '16V DOHC Boxer с фазовращателями AVCS на впуске',
            fuelSystem: 'MPI электронный впрыск',
            timingDrive: 'Длинный зубчатый ремень ГРМ с 4 роликами и гидронатяжителем',
            strengths: ['Низкий центр тяжести, идеальная балансировка без вибраций', 'Отличная управляемость в поворотах'],
            weaknesses: ['Течь прокладок клапанных крышек и свечных колодцев', 'Сложность замены свечей в стесненном подкапотном пространстве']
          },
          {
            code: 'EJ255',
            name: '2.5L 16V DOHC Turbo Boxer (XT)',
            displacement: '2457 см³ Турбо-оппозит',
            powerHp: '230 л.с. @ 5600 об/мин',
            torqueNm: '320 Н·м @ 3600 об/мин',
            valves: '16V DOHC Turbo с интеркулером и турбиной Mitsubishi TD04L',
            fuelSystem: 'MPI Turbo',
            timingDrive: 'Зубчатый ремень ГРМ',
            strengths: ['Динамика спорткара (0-100 за 6.0 сек)', 'Фирменный бубнящий звук выхлопа неравнодлинного коллектора'],
            weaknesses: ['Опасность перегрева 4-го цилиндра', 'Прогар прокладок ГБЦ при высоких наддувах']
          }
        ],
        transmissions: [
          '4-ступенчатый сверхвыносливый автомат 4EAT (Sportshift)',
          'Вариатор с цепным приводом Lineartronic TR690 (на SH/SJ)',
          '5-ступенчатая МКПП с понижающей передачей Dual-Range'
        ],
        fuelEconomy: {
          city: '11.0 – 14.5 л/100 км (Turbo: 14–18 л)',
          highway: '6.9 – 8.5 л/100 км',
          combined: '8.4 – 10.5 л/100 км',
          fuelGrade: 'АИ-95 (для Turbo строго АИ-98/100)'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 API SN / ACEA A3/B4 (4.5 л для EJ20; 4.8 л для FB20)',
          engineOilVolume: '4.5 – 4.8 л',
          transmissionFluid: 'АКПП 4EAT: Subaru ATF / Idemitsu ATF HP (9.3 л полный объем); CVT: Subaru CVTF Lineartronic High Torque',
          transferCaseAndDiff: 'Передний дифференциал (в картере АКПП): 1.2 л 75W-90 GL-5; Задний дифференциал: 0.8 л 75W-90 GL-5',
          coolant: '7.0 л Subaru Super Coolant',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'HB4 (галоген SG) или D2R / H7 / D2S (ксенон)',
          highBeam: 'HB3 60W',
          fogLights: 'HB4 55W (огромные круглые ПТФ на SG)',
          frontTurn: 'PY21W',
          tailStop: 'W21/5W',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов со стороны водителя.',
          commonCodes: [
            { code: 'P0026', title: 'Intake Valve Control Solenoid Circuit (Bank 1)', hint: 'Клапан управления фазовращателем AVCS' },
            { code: 'P0420', title: 'Catalyst System Efficiency Below Threshold', hint: 'Чувствительный задний датчик кислорода' }
          ],
          protocol: 'SSM (Subaru Select Monitor) + OBD-II ISO 9141-2 / CAN'
        },
        knownIssues: [
          {
            title: 'Прогар прокладок ГБЦ на атмосферных моторах EJ25',
            symptoms: 'Выдавливание антифриза в расширительный бачок при быстрой езде по трассе, запах ОЖ из печки.',
            rootCause: 'Тонкая однослойная заводская прокладка между алюминиевым блоком и ГБЦ не выдерживает температурных деформаций.',
            solution: 'Замена прокладок на усиленные многослойные стальные прокладки (MLS) от турбомотора EJ257 со шлифовкой плоскостей блока и ГБЦ.'
          }
        ]
      }
    ]
  },

  // 6. HONDA MOTOR CO.
  {
    id: 'honda',
    name: 'Honda',
    russianName: 'Хонда',
    country: 'Япония',
    founded: 1948,
    headquarters: 'Минато, Токио, Япония',
    tagline: 'The Power of Dreams (Высокооборотистые моторы VTEC и драйверский дух)',
    description: 'Легендарная инжиниринговая компания Соитиро Хонды. Многократный триумфатор Формулы-1, создатель феноменальной системы изменения фаз и высоты подъема клапанов VTEC, позволяющей моторам раскручиваться до 8500 об/мин без турбонаддува.',
    brandColor: '#dc2626', // Honda Red
    awdPhilosophy: 'Real Time 4WD с двойным насосом Dual Pump System (DPS) и передовая система SH-AWD (Super Handling All-Wheel Drive) с управляемым вектором тяги за счет индивидуальных электромагнитных пакетов фрикционов на каждое заднее колесо.',
    models: [
      {
        id: 'honda-cr-v-3',
        brandId: 'honda',
        name: 'CR-V (RE / III поколение)',
        generation: 'III поколение (2006–2012)',
        years: '2006–2012',
        bodyType: 'Кроссовер',
        drivetrain: 'Интеллектуальный подключаемый полный привод Real Time 4WD с гидравлическим сдвоенным насосом Dual Pump System (DPS).',
        awdSystemName: 'Real Time 4WD (Dual Pump System)',
        overview: 'Один из самых комфортных и практичных кроссоверов эпохи. Удобная полка-трансформер в багажнике, ровный пол в салоне, рычаг АКПП на приборной панели, образцовая эргономика и легендарные высокоресурсные моторы K20 и K24 i-VTEC.',
        dimensions: {
          lengthMm: 4570,
          widthMm: 1820,
          heightMm: 1675,
          wheelbaseMm: 2620,
          groundClearanceMm: 185,
          trunkVolumeLiters: '524 – 1532 л',
          fuelTankLiters: 58,
          curbWeightKg: '1530 – 1610 кг'
        },
        engines: [
          {
            code: 'K20A',
            name: '2.0L 16V DOHC i-VTEC',
            displacement: '1997 см³',
            powerHp: '150 л.с. @ 6200 об/мин',
            torqueNm: '192 Н·м @ 4200 об/мин',
            valves: '16V DOHC с интеллектуальной системой i-VTEC',
            fuelSystem: 'PGM-FI распределенный впрыск',
            timingDrive: 'Цепь ГРМ повышенного ресурса (250 тыс. км+)',
            strengths: ['Ресурс свыше 400 000 км при своевременной регулировке клапанов', 'Эластичность на высоких оборотах'],
            weaknesses: ['Критическая необходимость регулировки зазоров клапанов каждые 40 000 км (нет гидрокомпенсаторов!)']
          },
          {
            code: 'K24Z',
            name: '2.4L 16V DOHC i-VTEC',
            displacement: '2354 см³',
            powerHp: '166-190 л.с. @ 5800 об/мин',
            torqueNm: '220 Н·м @ 4200 об/мин',
            valves: '16V DOHC i-VTEC',
            fuelSystem: 'PGM-FI',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Отличный подхват с низов и уверенный обгон на трассе'],
            weaknesses: ['Износ кулачков выпускного распредвала при использовании неподходящего густого масла']
          }
        ],
        transmissions: [
          '5-ступенчатая гидромеханическая АКПП Honda (вального типа, без планетарных рядов — собственная патентованная конструкция)',
          '6-ступенчатая МКПП'
        ],
        fuelEconomy: {
          city: '11.1 – 13.5 л/100 км',
          highway: '6.8 – 8.2 л/100 км',
          combined: '8.4 – 9.8 л/100 км',
          fuelGrade: 'АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 API SN, ACEA A5/B5 (4.2 л)',
          engineOilVolume: '4.2 литра',
          transmissionFluid: 'АКПП Honda: СТРОГО Honda ATF-Z1 или Honda ATF DW-1 (частичная смена 3.2 л, полный объем 7.2 л)',
          transferCaseAndDiff: 'Задний редуктор DPS: СТРОГО Honda Dual Pump Fluid II (DPSF-II) объем 1.2 л',
          coolant: '6.6 л Honda Long Life Antifreeze Type 2 (синий)',
          brakeFluid: 'DOT 4 Honda'
        },
        bulbsSummary: {
          lowBeam: 'H1 55W или D2S (линзованный ксенон)',
          highBeam: 'HB3 60W',
          fogLights: 'H11 55W',
          frontTurn: 'PY21W',
          tailStop: 'LED светодиодные секции стопов',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов со стороны водителя по центру.',
          commonCodes: [
            { code: 'P1009', title: 'VTC Advance Malfunction', hint: 'Засорение сеточки клапана VTC или растяжение цепи ГРМ' },
            { code: 'P0141', title: 'O2 Sensor Heater Circuit (Bank 1, Sensor 2)', hint: 'Обрыв цепи подогрева заднего кислородного датчика' }
          ],
          protocol: 'CAN ISO 15765-4 + Honda HDS'
        },
        knownIssues: [
          {
            title: 'Износ кулачков выпускного распределительного вала (K20/K24)',
            symptoms: 'Посторонний цокот в верхней части клапанной крышки, потеря динамики на верхах.',
            rootCause: 'Масляное голодание пар трения кулачок-рокер из-за применения слишком густого масла (5W-50/10W-40) или редкой регулировки клапанов.',
            solution: 'Замена выпускного распредвала и регулярная проверка зазоров клапанов каждые 40 000 км с заливкой оригинального масла Honda 0W-20 / 5W-30.'
          },
          {
            title: 'Скрип и скрежет в заднем редукторе при вывороте колес',
            symptoms: 'Вибрация и стонущий гул сзади при медленном развороте на парковке с полностью вывернутым рулем.',
            rootCause: 'Деградация и старение рабочей жидкости Dual Pump Fluid II в межосевой муфте редуктора.',
            solution: 'Двукратная замена жидкости Honda DPSF-II с короткой промежуточной поездкой в режиме восьмерок на площадке.'
          }
        ]
      }
    ]
  },

  // 7. MAZDA MOTOR CORPORATION
  {
    id: 'mazda',
    name: 'Mazda',
    russianName: 'Мазда',
    country: 'Япония',
    founded: 1920,
    headquarters: 'Фучу, Аки, Хиросима, Япония',
    tagline: 'Zoom-Zoom / Jinba Ittai (Единство всадника и коня, технологии SkyActiv)',
    description: 'Инженерный бунтарь из Хиросимы. Единственный производитель в мире, выигравший 24 часа Ле-Мана на автомобиле с роторно-поршневым мотором Ванкеля (Mazda 787B), и создатель революционной линейки двигателей SkyActiv с рекордной степенью сжатия 14:1.',
    brandColor: '#e11d48', // Soul Red
    awdPhilosophy: 'Интеллектуальная предиктивная система i-ACTIV AWD, опрашивающая 27 датчиков автомобиля (температура на улице, работа стеклоочистителей, угол поворота руля) 200 раз в секунду для упреждающего подключения полного привода до проскальзывания колес.',
    models: [
      {
        id: 'mazda-cx5-ke-kf',
        brandId: 'mazda',
        name: 'CX-5 (KE / KF)',
        generation: 'I и II поколения (2012–наст. время)',
        years: '2012–наст. время',
        bodyType: 'Кроссовер',
        drivetrain: 'Интеллектуальный полный привод i-ACTIV AWD с электромагнитной муфтой с упреждающим контролем проскальзывания.',
        awdSystemName: 'i-ACTIV AWD (предиктивный полный привод)',
        overview: 'Один из самых стильных и драйверских кроссоверов мира. Фирменный цвет Soul Red Crystal, передовые технологии SkyActiv (высокая степень сжатия 14:1, выпускной коллектор 4-2-1), быстродействующий автомат SkyActiv-Drive с блокировкой гидротрансформатора с 8 км/ч.',
        dimensions: {
          lengthMm: 4550,
          widthMm: 1840,
          heightMm: 1680,
          wheelbaseMm: 2700,
          groundClearanceMm: 210,
          trunkVolumeLiters: '442 – 1560 л',
          fuelTankLiters: 58,
          curbWeightKg: '1455 – 1620 кг'
        },
        engines: [
          {
            code: 'PE-VPS',
            name: '2.0L SkyActiv-G 16V DOHC',
            displacement: '1998 см³',
            powerHp: '150 л.с. @ 6000 об/мин',
            torqueNm: '210 Н·м @ 4000 об/мин',
            valves: '16V DOHC с двойными фазовращателями Dual S-VT (электропривод на впуске)',
            fuelSystem: 'Прямой непосредственный впрыск топлива в цилиндры под давлением 200 бар',
            timingDrive: 'Цепь ГРМ повышенной прочности',
            strengths: ['Рекордная экономичность (6.2 л по трассе)', 'Мгновенный отклик на педаль газа'],
            weaknesses: ['Чувствительность ТНВД и форсунок к чистоте бензина (строго АИ-95/98)']
          },
          {
            code: 'PY-VPS',
            name: '2.5L SkyActiv-G 16V DOHC',
            displacement: '2488 см³',
            powerHp: '192-194 л.с. @ 5700 об/мин',
            torqueNm: '256 Н·м @ 3250 об/мин',
            valves: '16V DOHC Dual S-VT',
            fuelSystem: 'Direct Injection прямой впрыск',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Ураганная эластичность, разгон 0-100 за 7.9 с', 'Надежный ресурс'],
            weaknesses: ['Закоксовывание впускных клапанов от прямого впрыска к 100 тыс. км']
          }
        ],
        transmissions: [
          '6-ступенчатая гидромеханическая АКПП SkyActiv-Drive FW6A-EL / GW6A-EL (с широчайшим диапазоном блокировки гидротрансформатора)',
          '6-ступенчатая МКПП SkyActiv-MT'
        ],
        fuelEconomy: {
          city: '8.9 – 10.5 л/100 км',
          highway: '5.8 – 6.8 л/100 км',
          combined: '6.9 – 8.0 л/100 км',
          fuelGrade: 'АИ-95 / АИ-98'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 Mazda Supra-X / Ultra (4.2 л для 2.0; 4.5 л для 2.5)',
          engineOilVolume: '4.2 – 4.5 л',
          transmissionFluid: 'АКПП SkyActiv-Drive: СТРОГО Mazda ATF FZ (сине-зеленая жидкость, 7.8 л полный)',
          transferCaseAndDiff: 'Раздаточная коробка: 0.45 л 75W-85 GL-5; Задний дифференциал: 0.45 л 75W-85 GL-5',
          coolant: '7.5 л Mazda FL22 Long Life Coolant',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H11 (на базовых) или адаптивные светодиодные LED фары ALH',
          highBeam: 'HB3 60W или LED',
          fogLights: 'H11 или компактные LED',
          frontTurn: 'WY21W',
          tailStop: 'LED стопы',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов со стороны водителя слева над рычажком капота.',
          commonCodes: [
            { code: 'P0171', title: 'System Too Lean (Bank 1)', hint: 'Загрязнение датчика расхода воздуха MAF или подсос' },
            { code: 'P2096', title: 'Post Catalyst Fuel Trim System Too Lean', hint: 'Нижний датчик кислорода' }
          ],
          protocol: 'CAN ISO 15765-4 + Mazda IDS'
        },
        knownIssues: [
          {
            title: 'Отказ привода складывания боковых зеркал',
            symptoms: 'Зеркало заднего вида жужжит электромотором без остановки, но не складывается или не фиксируется.',
            rootCause: 'Срезание зубьев хрупкой пластиковой шестеренки механизма складывания при примерзании зимой.',
            solution: 'Замена пластиковой шестерни на латунную или металлический ремкомплект с AliExpress.'
          }
        ]
      }
    ]
  },

  // 8. LEXUS
  {
    id: 'lexus',
    name: 'Lexus',
    russianName: 'Лексус',
    country: 'Япония',
    founded: 1989,
    headquarters: 'Нагоя, Айти, Япония',
    tagline: 'Experience Amazing (Премиальная роскошь, тишина и абсолютная надежность)',
    description: 'Премиальное подразделение корпорации Toyota, созданное в 1989 году с триумфальным седаном LS 400. Сочетает отделку салона натуральным деревом Симамоку, кожу Semi-Aniline, аудиосистемы Mark Levinson и эталонную надежность.',
    brandColor: '#0f172a', // Lexus Slate/Black
    awdPhilosophy: 'Полноприводные трансмиссии Full-Time 4WD с дифференциалами Torsen (GX, LX) и интеллектуальные гибридные системы E-Four с отдельным независимым электромотором на задней оси (RX, NX).',
    models: [
      {
        id: 'lexus-rx-350',
        brandId: 'lexus',
        name: 'RX 350 / RX 300 (XU30 / AL10)',
        generation: 'II и III поколения (2003–2015)',
        years: '2003–2015',
        bodyType: 'Кроссовер',
        drivetrain: 'Постоянный полный привод 4WD с межосевым дифференциалом или интеллектуальный подключаемый Active Torque Control 4WD.',
        awdSystemName: 'Full-Time 4WD / E-Four Hybrid',
        overview: 'Родоначальник класса премиальных среднеразмерных кроссоверов. Тишайший салон с акустическим остеклением, пневмоподвеска с регулировкой клиренса (на топ-версиях), аудиосистема Mark Levinson с 15 динамиками и плавнейший V6 3.5 2GR-FE.',
        dimensions: {
          lengthMm: 4770,
          widthMm: 1885,
          heightMm: 1685,
          wheelbaseMm: 2740,
          groundClearanceMm: 190,
          trunkVolumeLiters: '496 – 1570 л',
          fuelTankLiters: 72,
          curbWeightKg: '1835 – 2020 кг'
        },
        engines: [
          {
            code: '2GR-FE',
            name: '3.5L 24V DOHC Dual VVT-i V6',
            displacement: '3456 см³ V6',
            powerHp: '277 л.с. @ 6200 об/мин',
            torqueNm: '346 Н·м @ 4700 об/мин',
            valves: '24V DOHC Dual VVT-i',
            fuelSystem: 'EFI многоточечный впрыск',
            timingDrive: 'Три надежные цепи ГРМ',
            strengths: ['Ресурс свыше 400 000 км', 'Великолепная динамика (0-100 за 7.8 с) и тишина'],
            weaknesses: ['Течь резинометаллической трубки подачи масла на муфты VVT-i (заводской отзыв на металлическую трубку)']
          }
        ],
        transmissions: [
          '5-ступенчатая гидромеханическая АКПП Aisin U151F (RX 330 / 350 до 2009)',
          '6-ступенчатая АКПП Aisin U660F (с 2009 года)'
        ],
        fuelEconomy: {
          city: '13.5 – 16.5 л/100 км',
          highway: '8.8 – 10.2 л/100 км',
          combined: '10.5 – 12.5 л/100 км',
          fuelGrade: 'АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '0W-20 / 5W-30 API SN (6.1 л)',
          engineOilVolume: '6.1 литра',
          transmissionFluid: 'АКПП Aisin: Toyota ATF WS (полный объем 8.5 л)',
          transferCaseAndDiff: 'Раздатка: 0.9 л 80W-90 GL-5; Задний дифференциал: 0.5 л 80W-90 GL-5',
          coolant: '9.5 л Toyota SLLC (розовый)',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'D4S 35W ксенон или светодиодные LED линзы',
          highBeam: 'HB3 60W',
          fogLights: 'H11 55W',
          frontTurn: 'WY21W',
          tailStop: 'LED светодиодные стопы',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под торпедой у левой ноги водителя.',
          commonCodes: [
            { code: 'P0015', title: 'Camshaft Position "B" - Timing Over-Retarded (Bank 1)', hint: 'Муфта фазорегулятора распредвала VVT-i' },
            { code: 'C1241', title: 'Low Battery Positive Voltage', hint: 'Просадка напряжения в бортовой сети' }
          ],
          protocol: 'CAN ISO 15765-4 + Techstream'
        },
        knownIssues: [
          {
            title: 'Разрыв резиновой вставки маслопровода VVT-i на 2GR-FE',
            symptoms: 'Внезапная массивная течь моторного масла под капотом, загорание масленки на приборной панели.',
            rootCause: 'Старая конструкция трубки имела резиновую секцию, которая лопалась от давления горячего масла.',
            solution: 'Замена составной трубки на цельнометаллическую оригинальную трубку Toyota 15772-31030.'
          }
        ]
      }
    ]
  },

  // 9. INFINITI
  {
    id: 'infiniti',
    name: 'Infiniti',
    russianName: 'Инфинити',
    country: 'Япония',
    founded: 1989,
    headquarters: 'Иокогама, Япония',
    tagline: 'Empower the Drive (Премиальная мощь и экспрессивный японский дизайн)',
    description: 'Люксовое крыло компании Nissan. Визитная карточка марки — спортивные кроссоверы FX с силуэтом «гепарда перед прыжком», заднеприводной платформой FM (Front Midship) и басовитым рыком легендарных моторов серии VQ.',
    brandColor: '#475569', // Metallic Slate
    awdPhilosophy: 'Интеллектуальный заднеприводный полный привод ATTESA E-TS с электронным распределением тяги от 0:100 (чистый задний привод на сухом асфальте) до 50:50 при ускорении и проскальзывании.',
    models: [
      {
        id: 'infiniti-fx-35-37',
        brandId: 'infiniti',
        name: 'FX 35 / FX 37 / QX70 (S51)',
        generation: 'II поколение (2008–2017)',
        years: '2008–2017',
        bodyType: 'Кроссовер',
        drivetrain: 'Заднеприводная компоновка Front Midship с интеллектуальным подключением передних колес ATTESA E-TS через электромагнитную муфту. Режим Snow для скользких дорог.',
        awdSystemName: 'ATTESA E-TS (Rear-biased спортивный полный привод)',
        overview: 'Спортивный кроссовер-бунтарь с громогласным породистым звуком выхлопа, 21-дюймовыми колесными дисками Enkei, превосходной спортивной рулежкой и роскошным салоном с отделкой стеганой кожей.',
        dimensions: {
          lengthMm: 4865,
          widthMm: 1925,
          heightMm: 1650,
          wheelbaseMm: 2885,
          groundClearanceMm: 185,
          trunkVolumeLiters: '410 – 1305 л',
          fuelTankLiters: 90,
          curbWeightKg: '1975 – 2120 кг'
        },
        engines: [
          {
            code: 'VQ37VHR',
            name: '3.7L 24V DOHC VVEL V6',
            displacement: '3696 см³ V6',
            powerHp: '333 л.с. @ 7000 об/мин',
            torqueNm: '363 Н·м @ 5200 об/мин',
            valves: '24V DOHC с электрогидравлической системой изменения высоты подъема клапанов VVEL',
            fuelSystem: 'EGI электронный впрыск',
            timingDrive: 'Цепной привод ГРМ',
            strengths: ['Ураганная тяга вплоть до 7500 об/мин, звук суперкара', 'Ресурс свыше 350 000 км'],
            weaknesses: ['Выдавливание бумажных прокладок масляных каналов под передней крышкой ГРМ (до 2012 года)']
          }
        ],
        transmissions: [
          '7-ступенчатая спортивная АКПП Jatco JR710E / JR711E с подрулевыми магниевыми лепестками и перегазовкой'
        ],
        fuelEconomy: {
          city: '15.0 – 19.5 л/100 км',
          highway: '9.5 – 11.5 л/100 км',
          combined: '12.1 – 14.5 л/100 км',
          fuelGrade: 'АИ-98 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 5W-40 API SN (4.9 л)',
          engineOilVolume: '4.9 литра',
          transmissionFluid: 'АКПП 7-ст Jatco: СТРОГО Nissan Matic-S (9.2 л полный объем)',
          transferCaseAndDiff: 'Раздатка ATTESA: 1.0 л Nissan Matic-D; Передний дифференциал: 0.65 л 80W-90 GL-5; Задний дифференциал: 1.4 л 75W-90 GL-5',
          coolant: '10.0 л Nissan L248/L250',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'D2S 35W линзованный биксенон',
          highBeam: 'D2S / H1',
          fogLights: 'H11 55W',
          frontTurn: 'WY21W',
          tailStop: 'LED кольца стоп-сигналов',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под рулевой колонкой слева.',
          commonCodes: [
            { code: 'P0524', title: 'Engine Oil Pressure Too Low', hint: 'Выдавливание картонных прокладок масляных каналов ГРМ' },
            { code: 'P0011', title: 'Camshaft Position Timing Over-Advanced (Bank 1)', hint: 'Падение давления масла на фазовращателях VVEL' }
          ],
          protocol: 'CAN ISO 15765-4 + Consult-III Plus'
        },
        knownIssues: [
          {
            title: 'Выдавливание картонных прокладок масляных каналов блока ГРМ (моторы VQ35HR / VQ37VHR)',
            symptoms: 'Ошибки P0011 / P0021, падение давления моторного масла до критических 0.6–0.8 бар, переход в аварийный режим с ограничением оборотов до 2500.',
            rootCause: 'Заводские прокладки масляных каналов масляной галереи («пистолетиков») были сделаны из хрупкого прессованного картона и срывались давлением масла к 100–140 тыс. км.',
            solution: 'Снятие передней крышки двигателя и замена картонных прокладок на усиленные металлопакетные прокладки с винтами под Torx.'
          }
        ]
      }
    ]
  },

  // 10. DAIHATSU
  {
    id: 'daihatsu',
    name: 'Daihatsu',
    russianName: 'Дайхатсу',
    country: 'Япония',
    founded: 1907,
    headquarters: 'Икеда, Осака, Япония',
    tagline: 'Light you up (Эксперты компактных автомобилей и кей-каров)',
    description: 'Старейший японский автопроизводитель, ныне входящий в состав концерна Toyota Motor Corporation. Лидер внутреннего японского рынка кей-каров и создатель компактного рамного кроссовера Terios.',
    brandColor: '#ea580c', // Orange-red
    awdPhilosophy: 'Постоянный полный привод Full-Time 4WD с принудительной электромеханической блокировкой межосевого дифференциала кнопкой из салона.',
    models: [
      {
        id: 'daihatsu-terios',
        brandId: 'daihatsu',
        name: 'Terios / Be-go (J200 / Toyota Rush)',
        generation: 'II поколение (2006–2017)',
        years: '2006–2017',
        bodyType: 'Кроссовер',
        drivetrain: 'Постоянный полный привод Full-Time 4WD с коническим межосевым дифференциалом и жесткой кнопкой блокировки (Lock), задний неразрезной мост на пружинах.',
        awdSystemName: 'Full-Time 4WD с блокировкой межосевого дифференциала',
        overview: 'Компактный внедорожник с удивительной геометрической проходимостью (клиренс 200 мм, короткая база), неразрезным задним мостом и надежным тойотовским мотором 1.5 3SZ-VE.',
        dimensions: {
          lengthMm: 4055,
          widthMm: 1695,
          heightMm: 1690,
          wheelbaseMm: 2580,
          groundClearanceMm: 200,
          trunkVolumeLiters: '380 – 755 л',
          fuelTankLiters: 50,
          curbWeightKg: '1170 – 1220 кг'
        },
        engines: [
          {
            code: '3SZ-VE',
            name: '1.5L 16V DOHC DVVT',
            displacement: '1495 см³',
            powerHp: '105 л.с. @ 6000 об/мин',
            torqueNm: '140 Н·м @ 4400 об/мин',
            valves: '16V DOHC с фазовращателем DVVT на впуске',
            fuelSystem: 'EFI многоточечный впрыск',
            timingDrive: 'Цепь ГРМ',
            strengths: ['Ресурс свыше 300 000 км', 'Простота обслуживания (родство с Toyota Yaris/Avanza)'],
            weaknesses: ['Шумность на скоростях свыше 110 км/ч']
          }
        ],
        transmissions: [
          '4-ступенчатая гидромеханическая АКПП Aisin',
          '5-ступенчатая МКПП'
        ],
        fuelEconomy: {
          city: '9.2 – 10.5 л/100 км',
          highway: '6.5 – 7.4 л/100 км',
          combined: '7.8 – 8.5 л/100 км',
          fuelGrade: 'АИ-92 / АИ-95'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 API SN (3.5 л)',
          engineOilVolume: '3.5 литра',
          transmissionFluid: 'АКПП: Toyota ATF T-IV / WS (5.5 л); МКПП: 75W-90 GL-4 (2.2 л)',
          transferCaseAndDiff: 'Раздаточная коробка: 1.4 л 75W-90 GL-4; Задний мост: 1.3 л 80W-90 GL-5',
          coolant: '5.5 л Toyota SLLC',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H7 55W',
          highBeam: 'HB3 60W',
          fogLights: 'H11 55W',
          frontTurn: 'PY21W',
          tailStop: 'W21/5W',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов со стороны водителя.',
          commonCodes: [
            { code: 'P0135', title: 'O2 Sensor Heater Malfunction', hint: 'Верхний лямбда-зонд' }
          ],
          protocol: 'OBD-II ISO 9141-2 / CAN'
        },
        knownIssues: [
          {
            title: 'Износ крестовин карданного вала',
            symptoms: 'Вибрация по кузову при наборе скорости от 40 до 70 км/ч.',
            rootCause: 'Закисание и вымывание смазки из нешприцуемых крестовин кардана.',
            solution: 'Замена крестовин в специализированном карданном сервисе с балансировкой вала.'
          }
        ]
      }
    ]
  },

  // 11. ISUZU
  {
    id: 'isuzu',
    name: 'Isuzu Motors',
    russianName: 'Исузу',
    country: 'Япония',
    founded: 1916,
    headquarters: 'Иокогама, Канагава, Япония',
    tagline: 'Trucks for Life (Мировой лидер в производстве коммерческих дизелей)',
    description: 'Старейший японский производитель дизельных двигателей и грузовой техники. Создатель неубиваемых рамных внедорожников Trooper / Bighorn, пикапов D-Max и дизелей с миллионным ресурсом (серии 4J и 6H).',
    brandColor: '#b91c1c', // Isuzu Crimson
    awdPhilosophy: 'Система полного привода TOD (Torque On Demand) от BorgWarner с автоматическим подключением переднего моста и классический жесткий Part-Time с механическим понижающим рядом.',
    models: [
      {
        id: 'isuzu-dmax',
        brandId: 'isuzu',
        name: 'D-Max (RT50 / RG01)',
        generation: 'II и III поколения (2012–наст. время)',
        years: '2012–наст. время',
        bodyType: 'Пикап',
        drivetrain: 'Тяжелая лестничная рама повышенной жесткости, подключаемый полный привод Part-Time 4WD (2H, 4H, 4L) с шайбой Terrain Command и принудительной 100% блокировкой заднего дифференциала.',
        awdSystemName: 'Part-Time 4WD с блокировкой заднего дифференциала и Terrain Command',
        overview: 'Настоящий бескомпромиссный рамный грузопассажирский вездеход. Способен перевозить в кузове более 1 тонны груза и буксировать прицеп массой 3.5 тонны. Оснащается легендарным 3-литровым чугунным турбодизелем 4JJ1 / 4JJ3 с шестеренчатым приводом ГРМ.',
        dimensions: {
          lengthMm: 5295,
          widthMm: 1860,
          heightMm: 1795,
          wheelbaseMm: 3125,
          groundClearanceMm: 235,
          trunkVolumeLiters: 'Кузов 1552×1530×465 мм (грузоподъемность 1000 кг)',
          fuelTankLiters: 76,
          curbWeightKg: '1940 – 2050 кг'
        },
        engines: [
          {
            code: '4JJ1-TCX',
            name: '3.0L D-di 16V DOHC Turbo Diesel',
            displacement: '2999 см³ Турбодизель',
            powerHp: '177 л.с. @ 3600 об/мин',
            torqueNm: '430 Н·м @ 1800-2800 об/мин',
            valves: '16V DOHC с чугунным блоком цилиндров',
            fuelSystem: 'Common Rail Denso 2000 бар с турбиной VGS',
            timingDrive: 'Комбинированный привод: нижний шестеренчатый каскад + короткая цепь ГРМ (ресурс свыше 500 000 км!)',
            strengths: ['Коммерческий дизель; ресурс зависит от обслуживания, нагрузки и режима эксплуатации', 'Колоссальный ресурс и неприхотливость к тяжелым нагрузкам'],
            weaknesses: ['Шумность и грубоватый звук работы на холостом ходу']
          }
        ],
        transmissions: [
          '6-ступенчатая гидромеханическая АКПП Aisin AWR6B45',
          '6-ступенчатая МКПП Isuzu'
        ],
        fuelEconomy: {
          city: '8.8 – 10.2 л/100 км',
          highway: '6.5 – 7.5 л/100 км',
          combined: '7.5 – 8.4 л/100 км',
          fuelGrade: 'ДТ Евро-5'
        },
        fluidsAndCapacities: {
          engineOil: '5W-30 / 10W-40 API CJ-4 / CK-4 / JASO DH-2 (7.6 л)',
          engineOilVolume: '7.6 литра',
          transmissionFluid: 'АКПП Aisin: Toyota ATF WS / Isuzu Besco ATF (полный объем 9.5 л); МКПП: 5W-30 / 75W-90 (3.0 л)',
          transferCaseAndDiff: 'Раздаточная коробка: 1.5 л 5W-30 / ATF; Передний мост: 1.4 л 80W-90 GL-5; Задний мост: 2.8 л 80W-90 GL-5',
          coolant: '9.0 л Isuzu LLC',
          brakeFluid: 'DOT 4'
        },
        bulbsSummary: {
          lowBeam: 'H11 55W или Bi-LED модули',
          highBeam: 'HB3 60W или LED',
          fogLights: 'H16 19W или LED',
          frontTurn: 'WY21W',
          tailStop: 'LED фонари со световодами',
          interior: 'W5W (T10)'
        },
        obdDiagnostics: {
          portLocation: 'Под панелью приборов со стороны водителя.',
          commonCodes: [
            { code: 'P2458', title: 'DPF Regeneration Duration', hint: 'Не завершена регенерация сажевого фильтра' },
            { code: 'P0401', title: 'EGR Flow Insufficient Detected', hint: 'Закоксовывание клапана рециркуляции отработавших газов' }
          ],
          protocol: 'CAN ISO 15765-4 + Isuzu E-IDSS'
        },
        knownIssues: [
          {
            title: 'Закоксовывание клапана и охладителя EGR сажей',
            symptoms: 'Потеря тяги при разгоне, загорание Check Engine с ошибкой P0401 / P0404.',
            rootCause: 'Низкие обороты мотора при езде внатяг приводят к оседанию сажи на штоке клапана EGR.',
            solution: 'Диагностировать EGR и впуск по сервисной процедуре для конкретной версии; при подтверждённом загрязнении очистить разрешённым средством и способом. Не отключать систему контроля выбросов как универсальный ремонт.'
          }
        ]
      }
    ]
  }
];

/**
 * Fail closed: legacy records without attached evidence must never appear as verified.
 * The audit status is promoted only after exact-variant OEM documentation is attached.
 */
for (const brand of JAPANESE_BRANDS) {
  for (const model of brand.models) {
    model.verificationStatus ??= 'unverified';
    model.sourceReferences ??= [];
  }
}

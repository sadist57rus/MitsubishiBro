import { useState } from 'react';
import {
  Maximize2,
  UserCheck,
  Package,
  Layers,
  ArrowRight,
  Info,
  Check,
  Compass,
  Car
} from 'lucide-react';

interface DimensionCallout {
  id: string;
  name: string;
  value: string;
  points: string;
  significance: string;
  category: 'exterior' | 'front_rear' | 'interior' | 'trunk';
}

export default function SpecsBlueprintGraphic() {
  const [activeTab, setActiveTab] = useState<'side' | 'front_rear' | 'interior' | 'trunk'>('side');
  const [selectedDimension, setSelectedDimension] = useState<string | null>('length');

  const dimensionsData: Record<string, DimensionCallout> = {
    length: {
      id: 'length',
      name: 'Габаритная длина кузова',
      value: '4 545 мм',
      points: 'От крайней точки переднего бампера до выступающей кромки заднего бампера.',
      significance: 'Европейская версия CU_W длиннее японского Airtrek (4410 мм) за счёт усиленных энергопоглощающих бамперов по стандарту безопасности ECE.',
      category: 'exterior'
    },
    wheelbase: {
      id: 'wheelbase',
      name: 'Колесная база (межосевое расстояние)',
      value: '2 625 мм',
      points: 'Расстояние между центрами ступиц передней и задней осей.',
      significance: 'Длинная база на платформе Lancer/Galant обеспечивает прямолинейную стабильность на трассе и минимизирует продольную раскачку.',
      category: 'exterior'
    },
    height: {
      id: 'height',
      name: 'Высота кузова с рейлингами',
      value: '1 685 мм',
      points: 'От поверхности дороги до верхней точки штатных продольных рейлингов.',
      significance: 'Высота без рейлингов — 1620 мм. Свободный въезд в любые подземные паркинги с ограничением 1.9–2.0 м даже с автобоксом на крыше.',
      category: 'exterior'
    },
    clearance: {
      id: 'clearance',
      name: 'Дорожный просвет (клиренс)',
      value: '195 мм',
      points: 'Расстояние от дороги до самой нижней точки (стальной подрамник / защита картера).',
      significance: 'У версии 4WD — 195 мм; версия Airtrek Sport Gear — 205 мм; Turbo-R — заниженная подвеска 170 мм. Ровное днище без свисающих элементов выхлопа.',
      category: 'exterior'
    },
    overhang_front: {
      id: 'overhang_front',
      name: 'Передний свес и угол въезда',
      value: '865 мм · 27°',
      points: 'От центра передней ступицы до носа бампера. Угол въезда 27 градусов.',
      significance: 'Скошенный снизу бампер позволяет преодолевать крутые съезды и высокие бордюры без касания пластиком.',
      category: 'exterior'
    },
    overhang_rear: {
      id: 'overhang_rear',
      name: 'Задний свес и угол съезда',
      value: '1 055 мм · 23°',
      points: 'От центра задней ступицы до заднего бампера. Угол съезда 23 градуса.',
      significance: 'Запасное колесо подвешено под днищем багажника, но не уменьшает угол съезда благодаря грамотной компоновке.',
      category: 'exterior'
    },
    width: {
      id: 'width',
      name: 'Ширина кузова (без / с зеркалами)',
      value: '1 750 мм / 1 810 мм',
      points: 'По внешним кромкам колесных арок без зеркал (1750 мм) и с боковыми зеркалами (1810 мм).',
      significance: 'Компактная ширина позволяет свободно маневрировать в тесных дворах и на лесных колеях.',
      category: 'front_rear'
    },
    track_front: {
      id: 'track_front',
      name: 'Колея передних колес',
      value: '1 495 – 1 515 мм',
      points: 'Расстояние между центрами пятен контакта передних шин при штатном вылете ET 46.',
      significance: 'Широкая колея обеспечивает высокую поперечную устойчивость и минимальные крены в поворотах.',
      category: 'front_rear'
    },
    track_rear: {
      id: 'track_rear',
      name: 'Колея задних колес',
      value: '1 505 – 1 525 мм',
      points: 'Расстояние между центрами пятен контакта задних шин.',
      significance: 'Задняя колея на 10 мм шире передней для улучшения поворачиваемости постоянного полного привода 4WD.',
      category: 'front_rear'
    },
    cabin_length: {
      id: 'cabin_length',
      name: 'Длина салона',
      value: '1 910 мм',
      points: 'От площадки педального узла до спинки заднего сиденья.',
      significance: 'Один из самых просторных салонов в классе компакт-кроссоверов 2000-х годов.',
      category: 'interior'
    },
    cabin_width: {
      id: 'cabin_width',
      name: 'Ширина салона спереди / сзади',
      value: '1 470 мм / 1 435 мм',
      points: 'На уровне плеч между обивками дверей переднего и заднего рядов.',
      significance: 'Спереди водитель и пассажир не соприкасаются локтями; сзади комфортно троим пассажирам.',
      category: 'interior'
    },
    cabin_height: {
      id: 'cabin_height',
      name: 'Высота салона от подушки до потолка',
      value: '1 015 мм (перед) · 970 мм (зад)',
      points: 'Вертикальный запас пространства над головой водителя и задних пассажиров.',
      significance: 'Высокая посадка «театром»: задний диван поднят на 50 мм относительно переднего для лучшего обзора дороги.',
      category: 'interior'
    },
    legroom_rear: {
      id: 'legroom_rear',
      name: 'Запас для ног задних пассажиров',
      value: '890 – 930 мм',
      points: 'От подушки заднего дивана до спинки переднего сиденья.',
      significance: 'Спинка заднего сиденья имеет регулировку угла наклона в 3 положениях (разделение 60/40).',
      category: 'interior'
    },
    trunk_normal: {
      id: 'trunk_normal',
      name: 'Длина багажника (номинальная)',
      value: '910 мм (402 литра)',
      points: 'Глубина от порога пятой двери до спинок задних сидений.',
      significance: 'Свободно помещаются 4 колеса R16 стоя или три больших дорожных чемодана под шторку.',
      category: 'trunk'
    },
    trunk_folded: {
      id: 'trunk_folded',
      name: 'Длина со сложенными сиденьями',
      value: '1 540 мм (1 070 литров)',
      points: 'От порога багажника до сложенных спинок заднего ряда (подушки откидываются вперед).',
      significance: 'Ровный горизонтальный пол без ступенек для перевозки длинномеров и крупной бытовой техники.',
      category: 'trunk'
    },
    trunk_bed: {
      id: 'trunk_bed',
      name: 'Спальное место (сдвинуты передние сиденья)',
      value: '1 720 мм (матрас на двоих)',
      points: 'От двери багажника до сдвинутых вперед передних кресел.',
      significance: 'Полноценное ровное спальное место в путешествиях для двоих взрослых ростом до 180 см!',
      category: 'trunk'
    },
    trunk_width_arches: {
      id: 'trunk_width_arches',
      name: 'Ширина багажника между колесными арками',
      value: '1 010 мм (1 350 мм в нишах)',
      points: 'Минимальное расстояние между пластиковыми обшивками колесных арок.',
      significance: 'Проходит стандартный строительный лист шириной 1 метр или европалета.',
      category: 'trunk'
    },
    trunk_liftover: {
      id: 'trunk_liftover',
      name: 'Погрузочная высота от дороги',
      value: '690 мм',
      points: 'От уровня дорожного покрытия до кромки пола багажника.',
      significance: 'Низкий порог погрузки не нагружает поясницу при погрузке тяжелых сумок и мешков.',
      category: 'trunk'
    }
  };

  const activeCallout = selectedDimension ? dimensionsData[selectedDimension] : null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
      {/* Top Header & Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Визуальные чертежи и контрольные точки кузова CU_W
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            Где и какие размеры находятся на кузове Outlander I
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Нажимайте на контрольные линии и метки на чертеже для подробной расшифровки каждого замера
          </p>
        </div>

        {/* 4 View Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('side'); setSelectedDimension('length'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'side'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. Профиль (Сбоку)
          </button>
          <button
            onClick={() => { setActiveTab('front_rear'); setSelectedDimension('width'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'front_rear'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2. Фас / Тыл (Колея)
          </button>
          <button
            onClick={() => { setActiveTab('interior'); setSelectedDimension('cabin_length'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'interior'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. Салон (Посадка)
          </button>
          <button
            onClick={() => { setActiveTab('trunk'); setSelectedDimension('trunk_bed'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'trunk'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            4. Багажник (Спальник)
          </button>
        </div>
      </div>

      {/* Main SVG Blueprint Display */}
      <div className="relative bg-white dark:bg-[#070b12] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 overflow-hidden shadow-inner">
        
        {/* VIEW 1: SIDE VIEW BLUEPRINT */}
        {activeTab === 'side' && (
          <div className="w-full max-w-4xl mx-auto space-y-2 animate-in fade-in duration-200">
            <svg viewBox="0 0 840 400" className="w-full h-auto select-none">
              <defs>
                <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#dc2626" />
                </marker>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
                </marker>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.08" />
                </linearGradient>
              </defs>

              {/* Ground road line */}
              <line x1="30" y1="310" x2="810" y2="310" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />
              <text x="810" y="305" textAnchor="end" fontSize="11" fill="#64748b" fontFamily="monospace">Дорожное полотно</text>

              {/* Front Wheel (R16 215/60) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('wheelbase')}>
                <circle cx="230" cy="275" r="35" fill="#1e293b" stroke="#dc2626" strokeWidth="3" />
                <circle cx="230" cy="275" r="22" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="230" cy="275" r="7" fill="#dc2626" />
                <text x="230" y="325" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">Ступица 1</text>
              </g>

              {/* Rear Wheel */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('wheelbase')}>
                <circle cx="610" cy="275" r="35" fill="#1e293b" stroke="#dc2626" strokeWidth="3" />
                <circle cx="610" cy="275" r="22" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="610" cy="275" r="7" fill="#dc2626" />
                <text x="610" y="325" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">Ступица 2</text>
              </g>

              {/* Outlander 1 Body Contour Path */}
              <path
                d="M 105 260 
                   L 130 240 
                   L 170 215 
                   L 275 185 
                   L 335 125 
                   L 575 125 
                   L 685 145 
                   L 715 205 
                   L 730 260 
                   L 695 275 
                   L 645 275 
                   A 35 35 0 0 0 575 275 
                   L 265 275 
                   A 35 35 0 0 0 195 275 
                   L 135 275 
                   Z"
                fill="url(#bodyGradient)"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Roof Rails */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('height')}>
                <line x1="335" y1="115" x2="575" y2="115" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
                <line x1="345" y1="115" x2="345" y2="125" stroke="#dc2626" strokeWidth="2" />
                <line x1="565" y1="115" x2="565" y2="125" stroke="#dc2626" strokeWidth="2" />
                <text x="455" y="108" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">Продольные рейлинги</text>
              </g>

              {/* Windows */}
              <path d="M 345 135 L 450 135 L 450 188 L 290 188 Z" fill="#38bdf8" fillOpacity="0.18" stroke="#0284c7" strokeWidth="1.5" />
              <path d="M 460 135 L 555 135 L 555 188 L 460 188 Z" fill="#38bdf8" fillOpacity="0.18" stroke="#0284c7" strokeWidth="1.5" />
              <path d="M 565 137 L 665 152 L 645 188 L 565 188 Z" fill="#38bdf8" fillOpacity="0.18" stroke="#0284c7" strokeWidth="1.5" />

              {/* 1. TOTAL LENGTH DIMENSION (4545 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('length')}>
                <line x1="105" y1="365" x2="730" y2="365" stroke={selectedDimension === 'length' ? '#ef4444' : '#64748b'} strokeWidth={selectedDimension === 'length' ? 3 : 1.5} markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <line x1="105" y1="265" x2="105" y2="375" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="730" y1="265" x2="730" y2="375" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <rect x="365" y="352" width="110" height="24" rx="6" fill={selectedDimension === 'length' ? '#dc2626' : '#0f172a'} />
                <text x="420" y="368" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff" fontFamily="monospace">ДЛИНА 4 545 мм</text>
              </g>

              {/* 2. WHEELBASE (2625 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('wheelbase')}>
                <line x1="230" y1="298" x2="610" y2="298" stroke={selectedDimension === 'wheelbase' ? '#0284c7' : '#64748b'} strokeWidth={selectedDimension === 'wheelbase' ? 2.5 : 1.5} markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="365" y="287" width="110" height="20" rx="5" fill={selectedDimension === 'wheelbase' ? '#0284c7' : '#0f172a'} />
                <text x="420" y="301" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff" fontFamily="monospace">БАЗА 2 625 мм</text>
              </g>

              {/* 3. GROUND CLEARANCE (195 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('clearance')}>
                <line x1="420" y1="275" x2="420" y2="310" stroke="#10b981" strokeWidth={selectedDimension === 'clearance' ? 3 : 2} markerStart="url(#arrowGreen)" markerEnd="url(#arrowGreen)" />
                <rect x="430" y="278" width="125" height="20" rx="5" fill={selectedDimension === 'clearance' ? '#059669' : '#064e3b'} />
                <text x="492" y="292" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff" fontFamily="monospace">КЛИРЕНС 195 мм</text>
              </g>

              {/* 4. TOTAL HEIGHT (1685 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('height')}>
                <line x1="55" y1="115" x2="55" y2="310" stroke={selectedDimension === 'height' ? '#ef4444' : '#64748b'} strokeWidth={selectedDimension === 'height' ? 2.5 : 1.5} markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <line x1="45" y1="115" x2="330" y2="115" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <line x1="45" y1="310" x2="105" y2="310" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <rect x="15" y="195" width="80" height="22" rx="6" fill={selectedDimension === 'height' ? '#dc2626' : '#0f172a'} />
                <text x="55" y="210" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff" fontFamily="monospace">1 685 мм</text>
              </g>

              {/* 5. FRONT OVERHANG (865 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('overhang_front')}>
                <line x1="105" y1="240" x2="230" y2="240" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="165" y="235" textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold" fontFamily="monospace">Свес 865 мм · 27°</text>
              </g>

              {/* 6. REAR OVERHANG (1055 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('overhang_rear')}>
                <line x1="610" y1="240" x2="730" y2="240" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="670" y="235" textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold" fontFamily="monospace">Свес 1055 мм · 23°</text>
              </g>
            </svg>
          </div>
        )}

        {/* VIEW 2: FRONT & REAR VIEW (WIDTH & TRACK) */}
        {activeTab === 'front_rear' && (
          <div className="w-full max-w-4xl mx-auto space-y-2 animate-in fade-in duration-200">
            <svg viewBox="0 0 840 380" className="w-full h-auto select-none">
              {/* Road line */}
              <line x1="40" y1="310" x2="800" y2="310" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />

              {/* FRONT VIEW (LEFT) */}
              <g transform="translate(40, 30)">
                <text x="180" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626" fontFamily="monospace">ВИД СПЕРЕДИ (ФАС)</text>

                {/* Left/Right Front Wheels */}
                <rect x="70" y="220" width="34" height="60" rx="6" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />
                <rect x="256" y="220" width="34" height="60" rx="6" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />

                {/* Front Body contour */}
                <path
                  d="M 65 240 
                     L 75 190 
                     L 105 130 
                     L 255 130 
                     L 285 190 
                     L 295 240 
                     L 275 260 
                     L 85 260 Z"
                  fill="url(#bodyGradient)"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />

                {/* Windshield */}
                <polygon points="115,135 245,135 265,185 95,185" fill="#38bdf8" fillOpacity="0.2" stroke="#0284c7" strokeWidth="1.5" />

                {/* Mirrors */}
                <rect x="45" y="165" width="22" height="15" rx="4" fill="#334155" stroke="#dc2626" />
                <rect x="293" y="165" width="22" height="15" rx="4" fill="#334155" stroke="#dc2626" />

                {/* Headlights */}
                <polygon points="85,195 125,195 120,210 85,210" fill="#fef08a" stroke="#ca8a04" />
                <polygon points="235,195 275,195 275,210 240,210" fill="#fef08a" stroke="#ca8a04" />

                {/* Grille with 3 diamonds */}
                <rect x="135" y="195" width="90" height="25" rx="4" fill="#0f172a" stroke="#dc2626" />
                <polygon points="180,200 186,210 180,220 174,210" fill="#dc2626" />

                {/* Track Front: 1495 mm */}
                <g className="cursor-pointer" onClick={() => setSelectedDimension('track_front')}>
                  <line x1="87" y1="295" x2="273" y2="295" stroke="#0284c7" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                  <rect x="125" y="285" width="110" height="20" rx="4" fill="#0f172a" />
                  <text x="180" y="299" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#38bdf8" fontFamily="monospace">КОЛЕЯ 1 495 мм</text>
                </g>

                {/* Width without mirrors: 1750 mm */}
                <g className="cursor-pointer" onClick={() => setSelectedDimension('width')}>
                  <line x1="65" y1="330" x2="295" y2="330" stroke="#dc2626" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                  <rect x="120" y="320" width="120" height="22" rx="4" fill="#dc2626" />
                  <text x="180" y="335" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff" fontFamily="monospace">ШИРИНА 1 750 мм</text>
                </g>
              </g>

              {/* REAR VIEW (RIGHT) */}
              <g transform="translate(440, 30)">
                <text x="180" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626" fontFamily="monospace">ВИД СЗАДИ (ТЫЛ)</text>

                {/* Rear Wheels */}
                <rect x="68" y="220" width="34" height="60" rx="6" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />
                <rect x="258" y="220" width="34" height="60" rx="6" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />

                {/* Rear Body Contour */}
                <path
                  d="M 65 245 
                     L 75 190 
                     L 110 130 
                     L 250 130 
                     L 285 190 
                     L 295 245 
                     L 275 265 
                     L 85 265 Z"
                  fill="url(#bodyGradient)"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />

                {/* Rear Window & Wiper */}
                <polygon points="120,135 240,135 255,185 105,185" fill="#38bdf8" fillOpacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="180" y1="180" x2="215" y2="170" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                {/* Tail lights */}
                <polygon points="85,185 105,185 105,225 85,220" fill="#ef4444" stroke="#991b1b" />
                <polygon points="255,185 275,185 275,220 255,225" fill="#ef4444" stroke="#991b1b" />

                {/* License plate & Trunk handle */}
                <rect x="145" y="215" width="70" height="20" rx="3" fill="#ffffff" stroke="#94a3b8" />
                <text x="180" y="229" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#000000">OUTLANDER</text>

                {/* Track Rear: 1505 mm */}
                <g className="cursor-pointer" onClick={() => setSelectedDimension('track_rear')}>
                  <line x1="85" y1="295" x2="275" y2="295" stroke="#0284c7" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                  <rect x="125" y="285" width="110" height="20" rx="4" fill="#0f172a" />
                  <text x="180" y="299" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#38bdf8" fontFamily="monospace">КОЛЕЯ 1 505 мм</text>
                </g>

                {/* Liftover height: 690 mm */}
                <g className="cursor-pointer" onClick={() => setSelectedDimension('trunk_liftover')}>
                  <line x1="180" y1="265" x2="180" y2="310" stroke="#10b981" strokeWidth="2" markerStart="url(#arrowGreen)" markerEnd="url(#arrowGreen)" />
                  <text x="180" y="325" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold" fontFamily="monospace">Порог 690 мм</text>
                </g>
              </g>
            </svg>
          </div>
        )}

        {/* VIEW 3: INTERIOR LAYOUT */}
        {activeTab === 'interior' && (
          <div className="w-full max-w-4xl mx-auto space-y-2 animate-in fade-in duration-200">
            <svg viewBox="0 0 840 370" className="w-full h-auto select-none">
              {/* Outer Cabin frame */}
              <rect x="90" y="55" width="660" height="235" rx="20" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="420" y="45" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626" fontFamily="monospace">САЛОН: ПЛАН ПОСАДОЧНЫХ МЕСТ И ЗАПАСА ПРОСТРАНСТВА</text>

              {/* Driver Seat */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('cabin_length')}>
                <rect x="230" y="75" width="75" height="80" rx="12" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />
                <text x="267" y="120" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold">Водитель</text>
              </g>

              {/* Passenger Seat */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('cabin_width')}>
                <rect x="230" y="190" width="75" height="80" rx="12" fill="#1e293b" stroke="#dc2626" strokeWidth="2" />
                <text x="267" y="235" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="bold">Пассажир</text>
              </g>

              {/* Steering wheel & pedals */}
              <circle cx="195" cy="115" r="18" fill="none" stroke="#dc2626" strokeWidth="3" />
              <line x1="140" y1="95" x2="140" y2="135" stroke="#ef4444" strokeWidth="4" />
              <text x="140" y="85" textAnchor="middle" fontSize="9" fill="#94a3b8">Педали</text>

              {/* Rear Seat Split 60/40 */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('legroom_rear')}>
                <rect x="440" y="75" width="85" height="195" rx="14" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
                <line x1="440" y1="185" x2="525" y2="185" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
                <text x="482" y="130" textAnchor="middle" fontSize="11" fill="#38bdf8" fontWeight="bold">Диван (60%)</text>
                <text x="482" y="225" textAnchor="middle" fontSize="11" fill="#38bdf8" fontWeight="bold">(40%)</text>
              </g>

              {/* Front Legroom (1070 mm) */}
              <line x1="140" y1="115" x2="230" y2="115" stroke="#10b981" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
              <text x="185" y="145" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold" fontFamily="monospace">1 070 мм</text>

              {/* Rear Legroom (890–930 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('legroom_rear')}>
                <line x1="305" y1="145" x2="440" y2="145" stroke="#10b981" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="340" y="135" width="70" height="20" rx="4" fill="#064e3b" />
                <text x="375" y="149" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a7f3d0" fontFamily="monospace">890–930 мм</text>
              </g>

              {/* Cabin Width front (1470 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('cabin_width')}>
                <line x1="267" y1="65" x2="267" y2="280" stroke="#dc2626" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="275" y="165" width="135" height="22" rx="4" fill="#0f172a" />
                <text x="342" y="180" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff" fontFamily="monospace">ШИРИНА 1 470 мм</text>
              </g>

              {/* Cabin Length (1910 mm) */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('cabin_length')}>
                <line x1="140" y1="320" x2="525" y2="320" stroke="#dc2626" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="280" y="308" width="125" height="24" rx="5" fill="#dc2626" />
                <text x="342" y="324" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff" fontFamily="monospace">ДЛИНА 1 910 мм</text>
              </g>
            </svg>
          </div>
        )}

        {/* VIEW 4: TRUNK & SLEEPING BERTH LAYOUT */}
        {activeTab === 'trunk' && (
          <div className="w-full max-w-4xl mx-auto space-y-2 animate-in fade-in duration-200">
            <svg viewBox="0 0 840 370" className="w-full h-auto select-none">
              {/* Trunk cutaway Floor Boundary */}
              <rect x="130" y="70" width="580" height="210" rx="16" fill="#1e293b" fillOpacity="0.3" stroke="#dc2626" strokeWidth="2.5" />
              <text x="420" y="55" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#dc2626" fontFamily="monospace">БАГАЖНОЕ ОТДЕЛЕНИЕ, АРКИ И СПАЛЬНИК 1720 мм</text>

              {/* Wheel Arches Inside Cabin */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('trunk_width_arches')}>
                <rect x="380" y="70" width="100" height="38" rx="8" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                <text x="430" y="94" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="bold" fontFamily="monospace">Левая арка</text>

                <rect x="380" y="242" width="100" height="38" rx="8" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                <text x="430" y="266" textAnchor="middle" fontSize="10" fill="#cbd5e1" fontWeight="bold" fontFamily="monospace">Правая арка</text>

                {/* Width Between Arches: 1010 mm */}
                <line x1="430" y1="108" x2="430" y2="242" stroke="#ef4444" strokeWidth="2.5" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="365" y="165" width="130" height="22" rx="4" fill="#0f172a" />
                <text x="430" y="180" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ef4444" fontFamily="monospace">МЕЖДУ АРОК 1 010 мм</text>
              </g>

              {/* Tailgate Lip */}
              <rect x="705" y="70" width="8" height="210" fill="#64748b" rx="2" />
              <text x="700" y="175" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">Пятая дверь</text>

              {/* 1. Normal Depth: 910 mm */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('trunk_normal')}>
                <line x1="535" y1="120" x2="705" y2="120" stroke="#0284c7" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="575" y="105" width="115" height="20" rx="4" fill="#0c4a6e" />
                <text x="632" y="119" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#38bdf8" fontFamily="monospace">ШТАТНАЯ 910 мм (402 л)</text>
              </g>

              {/* 2. Folded Seats Depth: 1540 mm */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('trunk_folded')}>
                <line x1="285" y1="215" x2="705" y2="215" stroke="#f59e0b" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                <rect x="440" y="202" width="140" height="22" rx="4" fill="#78350f" />
                <text x="510" y="217" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fef3c7" fontFamily="monospace">СЛОЖЕННЫЕ 1 540 мм (1070 л)</text>
              </g>

              {/* 3. Sleeping Berth Depth: 1720 mm */}
              <g className="cursor-pointer" onClick={() => setSelectedDimension('trunk_bed')}>
                <line x1="165" y1="310" x2="705" y2="310" stroke="#10b981" strokeWidth="3" markerStart="url(#arrowGreen)" markerEnd="url(#arrowGreen)" />
                <rect x="340" y="297" width="220" height="26" rx="6" fill="#064e3b" />
                <text x="450" y="314" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a7f3d0" fontFamily="monospace">СПАЛЬНОЕ МЕСТО 1 720 мм (ДВОЕ ВЗРОСЛЫХ)</text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Interactive Detail Card for the Selected Dimension */}
      {activeCallout && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Контрольный замер:</span>
              <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold">{activeCallout.name}</strong>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-red-600 dark:text-red-400">
              {activeCallout.value}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Контрольные точки:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{activeCallout.points}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Практическое значение для владельца:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{activeCallout.significance}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Dimension Pill Selectors */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Быстрый выбор контрольной точки:
        </span>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {Object.values(dimensionsData).map((dim) => (
            <button
              key={dim.id}
              onClick={() => {
                setSelectedDimension(dim.id);
                if (dim.category === 'exterior') setActiveTab('side');
                else if (dim.category === 'front_rear') setActiveTab('front_rear');
                else if (dim.category === 'interior') setActiveTab('interior');
                else if (dim.category === 'trunk') setActiveTab('trunk');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                selectedDimension === dim.id
                  ? 'bg-red-600 text-white font-bold border-red-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{dim.name.split('(')[0]}: <strong>{dim.value.split('·')[0]}</strong></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

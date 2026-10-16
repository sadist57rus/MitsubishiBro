import { useMemo, useState } from 'react';
import { Search, CarFront, ExternalLink, Filter, Info } from 'lucide-react';

type Generation = {
  name: string;
  years: string;
  body?: string;
  notes: string;
  source: string;
};
type Model = { name: string; category: string; generations: Generation[] };
type Brand = { name: string; country: string; models: Model[] };

const catalog: Brand[] = [
  { name: 'Toyota', country: 'Япония', models: [
    { name: 'Corolla', category: 'Компактный', generations: [
      { name: 'E10', years: '1966–1970', body: 'седан / универсал', notes: 'Первое поколение Corolla; начало массовой глобальной модели.', source: 'https://www.toyota-global.com/company/history_of_toyota/75years/data/automotive_business/products_technology/vehicle_lineage_chart/vehicle_lineage_chart/index.html' },
      { name: 'E30 / E50', years: '1974–1979', notes: 'Семейство второго поколения; кузова и сроки отличались по рынкам.', source: 'https://www.toyota-global.com/company/history_of_toyota/75years/data/automotive_business/products_technology/vehicle_lineage_chart/vehicle_lineage_chart/index.html' },
      { name: 'E120 / E130', years: '2000–2007', notes: 'Девятое поколение; набор кузовов и силовых агрегатов зависел от региона.', source: 'https://www.toyota-global.com/company/history_of_toyota/75years/data/automotive_business/products_technology/vehicle_lineage_chart/vehicle_lineage_chart/index.html' },
      { name: 'E210', years: '2018–н. в.', notes: 'Двенадцатое поколение; доступны разные кузова и гибридные версии в зависимости от рынка.', source: 'https://global.toyota/en/newsroom/' }
    ]},
    { name: 'Land Cruiser', category: 'Внедорожник', generations: [
      { name: 'J40', years: '1960–1984', notes: 'Классическое рамное семейство; даты производства отдельных вариантов различались.', source: 'https://www.toyota-global.com/company/history_of_toyota/75years/data/automotive_business/products_technology/vehicle_lineage_chart/vehicle_lineage_chart/index.html' },
      { name: 'J80', years: '1990–1997', notes: 'Большой рамный внедорожник с постоянным полным приводом на многих версиях.', source: 'https://www.toyota-global.com/company/history_of_toyota/75years/data/automotive_business/products_technology/vehicle_lineage_chart/vehicle_lineage_chart/index.html' },
      { name: 'J200', years: '2007–2021', notes: 'Флагманское поколение; двигатели и оснащение существенно различались по рынкам.', source: 'https://global.toyota/en/newsroom/' },
      { name: 'J300', years: '2021–н. в.', notes: 'Новое поколение рамного внедорожника; спецификации зависят от страны продажи.', source: 'https://global.toyota/en/newsroom/' }
    ]},
    { name: 'Prius', category: 'Гибрид', generations: [
      { name: 'XW10', years: '1997–2003', notes: 'Первое серийное поколение гибридного Prius.', source: 'https://global.toyota/en/prius/' },
      { name: 'XW30', years: '2009–2015', notes: 'Третье поколение гибрида; комплектации и мощность зависят от рынка.', source: 'https://global.toyota/en/prius/' },
      { name: 'XW60', years: '2022–н. в.', notes: 'Пятое поколение; предлагаются гибридные и подключаемые гибридные версии на отдельных рынках.', source: 'https://global.toyota/en/prius/' }
    ]}
  ]},
  { name: 'Nissan', country: 'Япония', models: [
    { name: 'Skyline', category: 'Спорт / седан', generations: [
      { name: 'C10', years: '1968–1972', notes: 'Поколение, получившее известность в том числе благодаря версии GT-R.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' },
      { name: 'R32', years: '1989–1994', notes: 'Известное поколение Skyline; GT-R оснащался RB26DETT и системой полного привода ATTESA E-TS.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' },
      { name: 'R34', years: '1998–2002', notes: 'Поколение с несколькими кузовами и большим числом комплектаций; GT-R выпускался до 2002 года.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' }
    ]},
    { name: 'Patrol', category: 'Внедорожник', generations: [
      { name: '60', years: '1959–1980', notes: 'Раннее поколение рамного внедорожника; сроки и обозначения варьируются по рынкам.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' },
      { name: 'Y60', years: '1987–1997', notes: 'Рамный внедорожник с зависимой подвеской; известен на экспортных рынках как Safari/Patrol.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' },
      { name: 'Y61', years: '1997–н. в. на отдельных рынках', notes: 'Долгоживущее поколение, продолжавшее продаваться в некоторых странах после выхода Y62.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' },
      { name: 'Y62', years: '2010–н. в.', notes: 'Крупный внедорожник; двигатель и оснащение зависят от рынка и года обновления.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' }
    ]},
    { name: 'Leaf', category: 'Электромобиль', generations: [
      { name: 'ZE0', years: '2010–2017', notes: 'Первое массовое поколение электромобиля Leaf.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' },
      { name: 'ZE1', years: '2017–н. в.', notes: 'Второе поколение; ёмкость батареи и запас хода зависят от версии и методики измерения.', source: 'https://www.nissan-global.com/EN/HERITAGE_COLLECTION/' }
    ]}
  ]},
  { name: 'Honda', country: 'Япония', models: [
    { name: 'Civic', category: 'Компактный', generations: [
      { name: 'SB1 / SG / SE / SS', years: '1972–1979', notes: 'Первое поколение Civic; кузова и обозначения различались по рынкам.', source: 'https://global.honda/en/heritage/' },
      { name: 'EG', years: '1991–1995', notes: 'Пятое поколение; популярные кузова хэтчбек, седан и купе в зависимости от рынка.', source: 'https://global.honda/en/heritage/' },
      { name: 'FD', years: '2005–2011', notes: 'Восьмое поколение в распространённых обозначениях; региональные версии заметно различались.', source: 'https://global.honda/en/heritage/' },
      { name: 'FE / FL', years: '2021–н. в.', notes: 'Современные поколения/версии Civic; гибридные и спортивные модификации доступны не во всех странах.', source: 'https://global.honda/en/heritage/' }
    ]},
    { name: 'CR-V', category: 'Кроссовер', generations: [
      { name: 'RD1–RD3', years: '1995–2001', notes: 'Первое поколение компактного кроссовера.', source: 'https://global.honda/en/heritage/' },
      { name: 'RE', years: '2006–2012', notes: 'Третье поколение; варианты двигателя и привода зависели от рынка.', source: 'https://global.honda/en/heritage/' },
      { name: 'RW / RT', years: '2016–2022', notes: 'Пятое поколение с бензиновыми и гибридными версиями в отдельных регионах.', source: 'https://global.honda/en/heritage/' },
      { name: 'RS', years: '2022–н. в.', notes: 'Шестое поколение; силовые агрегаты и размеры комплектаций различаются по рынкам.', source: 'https://global.honda/en/heritage/' }
    ]}
  ]},
  { name: 'Mitsubishi', country: 'Япония', models: [
    { name: 'Outlander / Airtrek', category: 'Кроссовер', generations: [
      { name: 'CU2W / CU4W / CU5W', years: '2001–2008', notes: 'Первое поколение; на японском рынке продавался как Airtrek. Встречаются двигатели 4G63, 4G64, 4G69 и турбоверсии в зависимости от рынка.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'CW4W / CW5W / CW6W', years: '2005–2012', notes: 'Второе поколение; доступны разные бензиновые, дизельные и региональные версии.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'GF / GG', years: '2012–2021', notes: 'Третье поколение; позже появились подключаемые гибридные версии PHEV.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'GN', years: '2021–н. в.', notes: 'Четвёртое поколение на многих рынках; силовые агрегаты и комплектации зависят от региона.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' }
    ]},
    { name: 'Lancer', category: 'Седан / универсал', generations: [
      { name: 'A70', years: '1973–1979', notes: 'Первое поколение Lancer; компактная модель с несколькими кузовными вариантами.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'Cedia / CS', years: '2000–2010-е (по рынку)', notes: 'Поколение, известное в том числе кузовами CS; годы выпуска различались по рынкам.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'CY / CX', years: '2007–2017 (основные рынки)', notes: 'Десятое поколение в распространённой нумерации; региональные продажи завершались в разные годы.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' }
    ]},
    { name: 'Pajero / Montero / Shogun', category: 'Внедорожник', generations: [
      { name: 'L040', years: '1982–1991', notes: 'Первое поколение рамного внедорожника.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'V20 / V40', years: '1991–1999', notes: 'Второе поколение; конструкция и моторы зависели от рынка.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'V60 / V70', years: '1999–2006', notes: 'Третье поколение с несущим кузовом и интегрированной рамной структурой.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' },
      { name: 'V80 / V90', years: '2006–2021', notes: 'Четвёртое поколение; производство завершилось в 2021 году.', source: 'https://www.mitsubishi-motors.com/en/company/history/car/' }
    ]}
  ]},
  { name: 'Mazda', country: 'Япония', models: [
    { name: 'MX-5 / Roadster', category: 'Родстер', generations: [
      { name: 'NA', years: '1989–1997', notes: 'Первое поколение лёгкого двухместного родстера.', source: 'https://www.mazda.com/en/experience/museum/' },
      { name: 'NB', years: '1998–2005', notes: 'Второе поколение; кузов с фиксированными фарами.', source: 'https://www.mazda.com/en/experience/museum/' },
      { name: 'ND', years: '2015–н. в.', notes: 'Четвёртое поколение; параметры зависят от двигателя и рынка.', source: 'https://www.mazda.com/en/experience/museum/' }
    ]},
    { name: 'Mazda3 / Axela', category: 'Компактный', generations: [
      { name: 'BK', years: '2003–2009', notes: 'Первое поколение; на японском рынке называлась Axela.', source: 'https://www.mazda.com/en/experience/museum/' },
      { name: 'BM / BN', years: '2013–2019', notes: 'Третье поколение; доступны седан и хэтчбек в зависимости от рынка.', source: 'https://www.mazda.com/en/experience/museum/' },
      { name: 'BP', years: '2019–н. в.', notes: 'Четвёртое поколение; оснащение и двигатели зависят от региона.', source: 'https://www.mazda.com/en/experience/museum/' }
    ]}
  ]},
  { name: 'Subaru', country: 'Япония', models: [
    { name: 'Impreza', category: 'Компактный', generations: [
      { name: 'GC / GF', years: '1992–2000', notes: 'Первое поколение; встречаются седан, купе и универсал.', source: 'https://www.subaru.co.jp/en/outline/history.html' },
      { name: 'GD / GG', years: '2000–2007', notes: 'Второе поколение; версии WRX/STI имеют отдельные спецификации.', source: 'https://www.subaru.co.jp/en/outline/history.html' },
      { name: 'GK / GT', years: '2016–2023', notes: 'Пятое поколение в распространённой нумерации; кузова седан и хэтчбек.', source: 'https://www.subaru.co.jp/en/outline/history.html' }
    ]},
    { name: 'Forester', category: 'Кроссовер', generations: [
      { name: 'SF', years: '1997–2002', notes: 'Первое поколение кроссовера с характерной для Subaru компоновкой.', source: 'https://www.subaru.co.jp/en/outline/history.html' },
      { name: 'SH', years: '2007–2013', notes: 'Третье поколение; комплектации и трансмиссии зависели от рынка.', source: 'https://www.subaru.co.jp/en/outline/history.html' },
      { name: 'SK', years: '2018–2024 (по рынку)', notes: 'Пятое поколение; гибридные версии доступны в отдельных странах.', source: 'https://www.subaru.co.jp/en/outline/history.html' }
    ]}
  ]},
  { name: 'Suzuki', country: 'Япония', models: [
    { name: 'Jimny', category: 'Внедорожник', generations: [
      { name: 'LJ10 / LJ20', years: '1970–1981', notes: 'Раннее компактное внедорожное семейство.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' },
      { name: 'SJ30 / SJ40 / JA', years: '1981–1998 (по версии)', notes: 'Второе семейство Jimny/Samurai; обозначения различаются по рынкам.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' },
      { name: 'JB23 / JB33 / JB43', years: '1998–2018', notes: 'Третье поколение; двигатели и кузовные версии зависели от рынка.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' },
      { name: 'JB64 / JB74', years: '2018–н. в.', notes: 'Современное поколение; JB64 — японская kei-версия, JB74 — экспортная Sierra в ряде стран.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' }
    ]},
    { name: 'Swift', category: 'Компактный', generations: [
      { name: 'RS / ZC', years: '2004–2010', notes: 'Первое поколение современной глобальной модели Swift.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' },
      { name: 'ZC / AZ', years: '2017–2023', notes: 'Четвёртое поколение; доступность мягкого гибрида зависит от рынка.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' },
      { name: 'ZC / ZD (новое поколение)', years: '2023–н. в.', notes: 'Современное поколение; спецификации нужно сверять с конкретной страной продажи.', source: 'https://www.suzuki.co.jp/suzuki_digital_library/' }
    ]}
  ]},
  { name: 'Lexus', country: 'Япония', models: [
    { name: 'LS', category: 'Премиум-седан', generations: [
      { name: 'XF10', years: '1989–1994', notes: 'Первое поколение LS; на японском рынке продавалось как Toyota Celsior.', source: 'https://global.toyota/en/lexus/' },
      { name: 'XF30', years: '2000–2006', notes: 'Третье поколение LS; региональные обозначения и комплектации различались.', source: 'https://global.toyota/en/lexus/' },
      { name: 'XF50', years: '2017–н. в.', notes: 'Пятое поколение; доступны разные гибридные и бензиновые версии по рынкам.', source: 'https://global.toyota/en/lexus/' }
    ]},
    { name: 'RX', category: 'Премиум-кроссовер', generations: [
      { name: 'XU10', years: '1998–2003', notes: 'Первое поколение RX; на отдельных рынках модель имела название Toyota Harrier.', source: 'https://global.toyota/en/lexus/' },
      { name: 'AL10', years: '2008–2015', notes: 'Третье поколение, включая гибридные варианты RX 450h.', source: 'https://global.toyota/en/lexus/' },
      { name: 'AL20', years: '2015–2022', notes: 'Четвёртое поколение; версии и двигатели зависят от региона.', source: 'https://global.toyota/en/lexus/' },
      { name: 'AL30', years: '2022–н. в.', notes: 'Пятое поколение; гибридные версии представлены на ряде рынков.', source: 'https://global.toyota/en/lexus/' }
    ]}
  ]}
];

export default function VehicleCatalog() {
  const [query, setQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('Все марки');
  const [categoryFilter, setCategoryFilter] = useState('Все типы');
  const [expanded, setExpanded] = useState<string | null>('Mitsubishi::Outlander / Airtrek');

  const brands = useMemo(() => catalog.filter(brand => brandFilter === 'Все марки' || brand.name === brandFilter)
    .map(brand => ({ ...brand, models: brand.models.filter(model =>
      (categoryFilter === 'Все типы' || model.category === categoryFilter) &&
      (query.trim() === '' || [brand.name, model.name, model.category, ...model.generations.flatMap(g => [g.name, g.years, g.notes])].join(' ').toLowerCase().includes(query.toLowerCase()))
    ) })).filter(brand => brand.models.length > 0), [query, brandFilter, categoryFilter]);
  const categories = [...new Set(catalog.flatMap(brand => brand.models.map(model => model.category)))];
  const count = brands.reduce((sum, brand) => sum + brand.models.reduce((n, model) => n + model.generations.length, 0), 0);

  return <div className="space-y-6">
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-6 sm:p-8 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-red-600 p-3"><CarFront className="h-7 w-7" /></div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-red-300">Offline reference</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black">Каталог японских автомобилей</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">Марки, модели и поколения в одном справочнике. Поиск работает локально — подключение к интернету для просмотра каталога не требуется.</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white/10 p-3"><div className="text-2xl font-black">{catalog.length}</div><div className="text-xs text-slate-300">марок</div></div>
        <div className="rounded-xl bg-white/10 p-3"><div className="text-2xl font-black">{catalog.reduce((n,b)=>n+b.models.length,0)}</div><div className="text-xs text-slate-300">моделей</div></div>
        <div className="rounded-xl bg-white/10 p-3 col-span-2 sm:col-span-1"><div className="text-2xl font-black">{count}+</div><div className="text-xs text-slate-300">записей поколений</div></div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по марке, модели, коду поколения…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-bold text-slate-500"><span className="mb-1.5 flex items-center gap-2"><Filter className="h-3.5 w-3.5"/>Марка</span>
          <select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <option>Все марки</option>{catalog.map(b=><option key={b.name}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-500">Тип автомобиля
          <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <option>Все типы</option>{categories.map(c=><option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <p className="text-xs text-slate-500">Найдено марок: {brands.length}. Данные сгруппированы по поколениям; точные ТТХ, моторы и комплектации зависят от года и рынка.</p>
    </div>

    {brands.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700"><Search className="mx-auto mb-3 h-7 w-7 opacity-50"/>Ничего не найдено. Измените запрос или фильтры.</div> :
      <div className="space-y-4">{brands.map(brand=><section key={brand.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <div><h2 className="text-lg font-black">{brand.name}</h2><p className="text-xs text-slate-500">{brand.country} · {brand.models.length} моделей в выдаче</p></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{brand.models.reduce((n,m)=>n+m.generations.length,0)} покол.</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">{brand.models.map(model=>{
          const key = brand.name+'::'+model.name;
          const isOpen = expanded === key;
          return <div key={model.name}>
            <button onClick={()=>setExpanded(isOpen?null:key)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <span><span className="block font-bold">{model.name}</span><span className="mt-1 block text-xs text-slate-500">{model.category} · {model.generations.length} поколений</span></span>
              <span className={'rounded-lg px-3 py-1.5 text-xs font-bold '+(isOpen?'bg-red-600 text-white':'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}>{isOpen?'Скрыть':'Открыть'}</span>
            </button>
            {isOpen && <div className="space-y-3 bg-slate-50/70 p-3 sm:p-4 dark:bg-slate-950/40">{model.generations.map((generation,i)=><article key={generation.name} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold">{generation.name}</h3><p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">{generation.years}</p></div><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500 dark:bg-slate-800">Поколение {i+1}</span></div>
              {generation.body && <p className="mt-2 text-xs text-slate-500">Кузова: {generation.body}</p>}
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{generation.notes}</p>
              <a href={generation.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"><ExternalLink className="h-3.5 w-3.5"/>Исторический источник</a>
            </article>)}</div>}
          </div>
        })}</div>
      </section>)}</div>
    }

    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
      <Info className="h-4 w-4 shrink-0 mt-0.5"/><p><strong>Важно:</strong> это стартовая историческая база, а не исчерпывающий каталог всех комплектаций. Годы выпуска иногда отличаются по рынкам; перед подбором деталей или ремонтом сверяйте VIN, код кузова, двигатель и официальный каталог производителя. Ссылки ведут на исторические разделы производителей.</p>
    </div>
  </div>;
}

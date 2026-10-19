# Car Brother — отчёт по APK-аудиту 19.10.2026

**Статус:** исправления подготовлены отдельными PR; ни один PR не слит. Это QA-отчёт, а не production-релиз. Не создавать релизный тег до интеграции всех изменений.

## Результаты по пунктам

### 1. Меню «Разделы» на телефоне
- PR: [#19](https://github.com/sadist57rus/MitsubishiBro/pull/19)
- Файлы: `src/components/Header.tsx`, `tests/smoke.spec.ts`
- Было: на ширине 360 px панель выходила вправо (x=173…517).
- Стало: нижняя панель с отступами 8 px, ширина 344 px при viewport 360 px; тест проверяет границы панели и горизонтальные границы каждой кнопки.
- Проверки: [Build and typecheck — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203603962), [Android debug APK — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203603885).
- Команды: `npm ci --no-audit --no-fund`, `npm run check`, `npm run test:smoke`, `npx cap sync android`, `./gradlew assembleDebug --no-daemon`.

### 2. Тёмная тема и axe
- PR: [#20](https://github.com/sadist57rus/MitsubishiBro/pull/20)
- Файлы: `src/components/Header.tsx`, `src/components/BrandLogos.tsx`, `src/components/OverviewDashboard.tsx`, `tests/smoke.spec.ts`, `.github/workflows/verify.yml`
- Было: чёрные логотипы теряли контраст на тёмной поверхности; подписи быстрых плиток могли ломаться посреди слова.
- Стало: белая подложка логотипов, корректная поверхность селектора марки, шапка без переноса контролов, плитки 12–14 px с line-clamp и нормальным переносом слов.
- Проверка: axe WCAG 2 A/AA и 2.1 A/AA для Главной, Гаража и Настроек в тёмной теме — [Build and typecheck — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203448231); [Android debug APK — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203448197).
- Команды: `npm ci --no-audit --no-fund`, `npm install --no-save --package-lock=false --ignore-scripts --no-audit --no-fund @axe-core/playwright@4.10.2 axe-core@4.10.3`, `npm run check`, `npm run test:smoke`.

### 3. Нейтральность топливного раздела
- PR: [#21](https://github.com/sadist57rus/MitsubishiBro/pull/21)
- Файлы: `src/components/FuelMonitor.tsx`, `tests/smoke.spec.ts`
- Было: универсальный выбор топлива показывал рекомендации, привязанные к 4G63/4G64/4G63T и MIVEC; заметка о тормозах называла Outlander.
- Стало: универсальные варианты АИ-92/АИ-95/АИ-98 без привязки к двигателю; нейтральный текст о сопротивлении качению. Модельные карточки остаются ограничены `outlander-1`.
- Тест: в 16 разделах проверяется отсутствие Outlander/Mitsubishi/Мицубиси/4G6-серии/MIVEC для Toyota, Nissan, Honda и Mazda; бренд-каталог исключён из этой проверки, потому что он закономерно перечисляет марки.
- Проверки: [Build and typecheck — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39202452690), [Android debug APK — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39202452653).
- Команды: `npm ci --no-audit --no-fund`, `npm run check`, `npm run test:smoke`, `npx cap sync android`, `./gradlew assembleDebug --no-daemon`.

### 4. Онбординг и год выпуска
- PR: [#22](https://github.com/sadist57rus/MitsubishiBro/pull/22)
- Файлы: `src/App.tsx`, `tests/smoke.spec.ts`
- Было: марка/модель заполнялись заранее, год задавался автоматически.
- Стало: поля марки, модели, года, двигателя и коробки начинаются пустыми; селекторы используют «Выберите…»; модель недоступна до выбора марки; год пуст и ограничен min/max выбранной модели; сохранение блокируется при неполных или выходящих за диапазон значениях. Фраза о зависимости л.с. от года/рынка отфильтровывается из подписи двигателя.
- Проверки: [Build and typecheck](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203775385), [Android debug APK](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203775470). Ссылки ведут на последние запуски этой версии.
- Команды: `npm ci --no-audit --no-fund`, `npm run check`, `npm run test:smoke`, `npx cap sync android`, `./gradlew assembleDebug --no-daemon`.

### 5. Touch targets и читаемость
- PR: [#23](https://github.com/sadist57rus/MitsubishiBro/pull/23)
- Файл: `tests/smoke.spec.ts`
- Было: проверки на пустом состоянии не гарантировали, что populated-экраны воспроизводят проблему.
- Стало: отдельный аудит с данными Outlander для OBD, Запчастей, Характеристик, Ламп и Шин при 360×800 и 800×480 в обеих темах. Порог — ноль видимых целей меньше 44×44 px и ноль текста меньше 12 px; нарушение валит CI.
- Проверка: [Build and typecheck — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39202895839).
- Команды: `npm ci --no-audit --no-fund`, `npm run check`, `npm run test:smoke`.

### 6. Roboto 500/700 и offline precache
- PR: [#24](https://github.com/sadist57rus/MitsubishiBro/pull/24)
- Файлы: `src/index.css`, `public/service-worker.js`, шесть файлов `public/fonts/roboto-*-{500,700}-normal.woff2`
- Было: локально были только веса 400.
- Стало: реальные WOFF2 веса 500 и 700 для Latin, Cyrillic и Cyrillic Extended; `font-display: swap`, корректные unicode-range, `font-synthesis: none`; все шесть файлов добавлены в precache service worker.
- Проверки: [Build and typecheck — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203057195), [Android debug APK — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203057237).
- Команды: `npm ci --no-audit --no-fund`, `npm run check`, `npm run test:smoke`, `npx cap sync android`, `./gradlew assembleDebug --no-daemon`.

### 7. График топлива, TechSpecs и размер
- PR: [#25](https://github.com/sadist57rus/MitsubishiBro/pull/25)
- Файлы: `src/components/FuelMonitor.tsx`, `src/components/TechSpecs.tsx`, `package.json`, `scripts/checkBundleBudget.mjs`
- Было: график топлива использовал Recharts; для главного entry не было жёсткого gzip-порога.
- Стало: SVG-график без Recharts в FuelMonitor; TechSpecs изолирует контент поддерживаемой модели, а неподдерживаемые марки/модели получают явное состояние «данные недоступны» вместо чужих характеристик; `npm run check` падает, если главный JS entry превышает 300 KiB gzip.
- Проверки: [Build and typecheck — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203355420), [Android debug APK — success](https://github.com/sadist57rus/MitsubishiBro/actions/runs/39203355353).
- Команды: `npm ci --no-audit --no-fund`, `npm run check` (включает `npm run check:bundle`), `npm run test:smoke`, `npx cap sync android`, `./gradlew assembleDebug --no-daemon`.

## Размеры сборки: было / стало

Размеры Vite из CI-лога (kB — десятичные единицы):

| Артефакт | Было raw / gzip | Стало raw / gzip |
|---|---:|---:|
| Главный `index-*.js` | 803.34 / 201.27 kB | 803.25 / 201.22 kB |
| `FuelMonitor-*.js` | 406.20 / 113.85 kB | 44.47 / 9.97 kB |
| `TechSpecs-*.js` | 389.78 / 66.31 kB | 389.87 / 66.36 kB |

Отдельная проверка gzip уровня 9 для главного entry: **194.69 KiB из 300 KiB** — проходит. Recharts удалён из топливного графика; основной entry и так был меньше 300 kB gzip, теперь это ограничение закреплено тестом.

## Инварианты и выпуск

- Технические данные автомобилей не менялись.
- `appId` не менялся.
- PR #19–#25 оставлены открытыми и не слиты; production release/tag не создавался.
- APK из CI — тестовые debug-сборки отдельных веток. Для одного итогового APK сначала нужно интегрировать все семь PR и собрать его с интегрированной ветки.

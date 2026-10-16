# MitsubishiBro

**MitsubishiBro — развиваемый справочник японских автомобилей: от исторических марок до современных легковых и коммерческих моделей.**

[![Build and typecheck](https://github.com/sadist57rus/MitsubishiBro/actions/workflows/verify.yml/badge.svg)](https://github.com/sadist57rus/MitsubishiBro/actions/workflows/verify.yml) [![Build Android APK](https://github.com/sadist57rus/MitsubishiBro/actions/workflows/android-apk.yml/badge.svg)](https://github.com/sadist57rus/MitsubishiBro/actions/workflows/android-apk.yml)

## Возможности

- Поиск по марке, модели, поколению, годам выпуска, кузову, двигателю и приводу.
- Справочные данные по поколениям, двигателям, трансмиссиям и диагностике OBD-II.
- Развитие каталога японских легковых и коммерческих марок, включая исторические бренды.
- Офлайн-оболочка веб-приложения и локальные статические ресурсы.
- Аудит каталога: обязательные поля, дубли идентификаторов, качество источников и предупреждения о неполных данных.
- Схема точной модификации для раздельного учёта рынка, периода выпуска, кузова, двигателя, коробки и сервисных характеристик.

## Важное предупреждение о технических данных

Каталог находится в разработке и **не является заменой заводскому руководству по ремонту**. Одна модель или поколение может иметь разные характеристики в зависимости от рынка, даты выпуска, кода кузова, двигателя, коробки и комплектации. Не используйте неподтверждённые значения для подбора масла, жидкостей, ламп, предохранителей или деталей. Для критичных данных сверяйтесь с OEM-руководством и каталогом для конкретного автомобиля.

Уровни проверки:
- `unverified` — данные ещё не подтверждены для точной модификации;
- `partially-verified` — источник подтверждает только часть полей;
- `verified` — точные характеристики должны быть подкреплены источниками для соответствующего рынка и версии.

## Технологии

- React, TypeScript, Vite
- Capacitor для Android WebView-оболочки
- GitHub Actions для проверки кода, аудита каталога и сборки APK

## Быстрый старт

Требуется Node.js 22 LTS и npm.

```bash
git clone https://github.com/sadist57rus/MitsubishiBro.git
cd MitsubishiBro
npm install
npm run dev
```

## Проверка и веб-сборка

```bash
npm run lint
npm run audit:catalog
npm run build
npm run preview
```

Результат `npm run build` находится в `dist/`.

## Сборка Android APK

APK собирается в GitHub Actions из кода текущей ветки `main`. Откройте [Build Android APK](https://github.com/sadist57rus/MitsubishiBro/actions/workflows/android-apk.yml), выберите последний успешный запуск и скачайте артефакт `MitsubishiBro-APK-debug`. Артефакт — отладочный APK для установки и тестирования, не подписанный production-релиз.

Для локальной сборки с установленными Android SDK, Java 21 и Gradle wrapper:

```bash
npm install
npm install --no-save @capacitor/core@^8.5.3 @capacitor/cli@^8.5.3 @capacitor/android@^8.5.3
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

Готовый debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`. Если папка `android/` уже существует, пропустите `npx cap add android` и выполните `npx cap sync android`.

Подробные инструкции: [docs/BUILD_GUIDE_RU.md](docs/BUILD_GUIDE_RU.md).

## Каталог и дорожная карта

- [Политика проверки данных](docs/DATA_VERIFICATION_POLICY.md)
- [План расширения покрытия](docs/CATALOG_COVERAGE_ROADMAP.md)
- [Схема точной модификации](src/data/vehicleVariantSchema.ts)

## Участие в развитии

Предлагайте исправления с указанием первоисточника, рынка, модельного года, кода кузова и точной модификации. Для масел, жидкостей, электрики и сервисных процедур предпочтительны заводские руководства, OEM-каталоги и сервисные бюллетени.

## Статус

Проект активно развивается. Наличие записи в каталоге не означает полного охвата всех кузовов, рынков и комплектаций; полнота и подтверждённость данных продолжают улучшаться.

## Ссылки

- Репозиторий: https://github.com/sadist57rus/MitsubishiBro
- Проверки и веб-сборка: https://github.com/sadist57rus/MitsubishiBro/actions/workflows/verify.yml
- Android APK: https://github.com/sadist57rus/MitsubishiBro/actions/workflows/android-apk.yml
- Capacitor: https://capacitorjs.com/docs/getting-started

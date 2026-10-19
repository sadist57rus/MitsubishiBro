# Сборка MitsubishiBro

## Требования

- Node.js 24 и npm (та же основная версия, что используется в GitHub Actions).
- Git.
- Для локальной Android-сборки: Android SDK/Android Studio и Java 21.

## 1. Получить проект

```bash
git clone https://github.com/sadist57rus/MitsubishiBro.git
cd MitsubishiBro
git checkout main
```

## 2. Запустить веб-приложение локально

```bash
npm install
npm run dev
```

## 3. Проверить и собрать веб-версию

```bash
npm run lint
npm run audit:catalog
npm run build
npm run preview
```

Сборка создаётся в `dist/`. Предупреждения аудита означают, что часть каталога неполная или не подтверждена. Не используйте непроверенные характеристики для обслуживания автомобиля.

## 4. Собрать APK автоматически на GitHub

Workflow Android-сборки запускается при каждом push в `main`, при push тега `v*` и вручную через GitHub Actions. Перед сборкой зависимости устанавливаются строго по закоммиченному `package-lock.json`; при изменении `package.json` обновите lockfile и закоммитьте его вместе с изменениями.

1. Откройте [Build Android APK](https://github.com/sadist57rus/MitsubishiBro/actions/workflows/android-apk.yml).
2. Выберите последний запуск на нужном коммите и дождитесь статуса **Success**.
3. Откройте страницу запуска, в разделе **Artifacts** скачайте `Car-Brother-APK-debug`.
4. Распакуйте ZIP и установите `app-debug.apk` на Android. Если Android блокирует установку, разрешите установку приложений из выбранного источника в настройках устройства.

Артефакт хранится 14 дней. Workflow также публикует этот debug APK в GitHub как prerelease `test-build-N`. Это **тестовая debug-сборка**, не production-релиз для магазина приложений. Для production-релиза нужна защищённая подпись и настроенные GitHub Actions Secrets.

## 5. Собрать APK локально

Установите Android Studio/Android SDK и Java 21, затем выполните:

```bash
npm install
npm install --no-save @capacitor/core@^8.5.3 @capacitor/cli@^8.5.3 @capacitor/android@^8.5.3
npm run lint
npm run audit:catalog
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

APK будет здесь: `android/app/build/outputs/apk/debug/app-debug.apk`. Если `android/` уже существует, не запускайте `npx cap add android` повторно — выполните только `npx cap sync android` перед сборкой.

## Ссылки

- Репозиторий: https://github.com/sadist57rus/MitsubishiBro
- Веб-проверки: https://github.com/sadist57rus/MitsubishiBro/actions/workflows/verify.yml
- Сборка APK: https://github.com/sadist57rus/MitsubishiBro/actions/workflows/android-apk.yml
- Политика проверки технических данных: [DATA_VERIFICATION_POLICY.md](DATA_VERIFICATION_POLICY.md)
- План покрытия каталога: [CATALOG_COVERAGE_ROADMAP.md](CATALOG_COVERAGE_ROADMAP.md)

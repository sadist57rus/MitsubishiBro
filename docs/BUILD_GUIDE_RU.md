# Сборка MitsubishiBro

## Требования

- Node.js 22 LTS (рекомендуется именно 22, как в CI).
- npm, который поставляется вместе с Node.js.
- Git — если проект клонируется из GitHub.
- Для установки на Android нужен Android Studio; веб-проект сам по себе ещё не является APK.

## 1. Скачать исходники

```bash
git clone https://github.com/sadist57rus/MitsubishiBro.git
cd MitsubishiBro
git checkout main
```

Чтобы проверить изменения из PR №2, пока он не влит в main:

```bash
git fetch origin pull/2/head:pr-2
git checkout pr-2
```

## 2. Установить зависимости

```bash
npm install
```

## 3. Проверить код и каталог

```bash
npm run lint
npm run audit:catalog
```

- `lint` проверяет TypeScript.
- `audit:catalog` проверяет обязательные поля, дубли ID, формат OBD-кодов, источники и предупреждает о пустых/неподтверждённых характеристиках.
- Предупреждение аудита не является подтверждением, что значение технически верно. До появления OEM-источника используйте такие данные только как незавершённую справочную запись.

## 4. Собрать веб-версию

```bash
npm run build
```

Готовые файлы появятся в каталоге `dist/`. Для локального просмотра:

```bash
npm run preview
```

Команда покажет локальный адрес; откройте его в браузере. Для разработки с горячей перезагрузкой:

```bash
npm run dev
```

## 5. Скачать собранный артефакт из GitHub Actions

1. Откройте вкладку Actions репозитория: https://github.com/sadist57rus/MitsubishiBro/actions
2. Выберите успешный запуск **Build and typecheck** на нужном коммите.
3. Внизу страницы откройте Artifacts и скачайте `MitsubishiBro-web-build`.
4. Артефакт содержит веб-сборку, а не APK. В workflow он хранится 14 дней.

## 6. Android / APK

Текущий репозиторий содержит Vite/React веб-приложение. Нельзя получить корректный APK простым переименованием файлов из `dist/`. Для APK потребуется отдельная Android-обвязка (например, Capacitor) или полноценный Android-проект, настройка Android SDK/JDK и отдельный CI workflow, который собирает и подписывает APK. Подпись релизного APK требует приватного keystore; не коммитьте его и пароли в репозиторий.

Пока Android-проект не синхронизирован и отдельная сборка APK не прошла успешно, считайте артефакт Actions веб-сборкой.

## Полезные ссылки

- Репозиторий: https://github.com/sadist57rus/MitsubishiBro
- PR расширения каталога: https://github.com/sadist57rus/MitsubishiBro/pull/2
- Запуски сборки: https://github.com/sadist57rus/MitsubishiBro/actions
- Политика проверки технических данных: [DATA_VERIFICATION_POLICY.md](DATA_VERIFICATION_POLICY.md)

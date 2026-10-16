import { useState } from 'react';
import {
  Smartphone,
  Github,
  Download,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApkGuideModal({ isOpen, onClose }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'actions' | 'capacitor' | 'pwa'>('actions');

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const githubWorkflowYaml = `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Install Dependencies & Build Web App
        run: |
          npm ci
          npm run build

      - name: Install Capacitor & Android Platform
        run: |
          npm install @capacitor/core @capacitor/cli @capacitor/android
          npx cap init "Outlander 1 Guide" "com.outlander.assistant" --web-dir dist
          npx cap add android
          npx cap sync android

      - name: Build Android APK with Gradle
        run: |
          cd android
          chmod +x ./gradlew
          ./gradlew assembleDebug

      - name: Upload APK to GitHub Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: Outlander1-Assistant-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk

      - name: Create GitHub Release with APK
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: android/app/build/outputs/apk/debug/app-debug.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  const capacitorCommands = `# 1. Установите зависимости Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Соберите проект
npm run build

# 3. Инициализируйте проект и добавьте Android
npx cap init "Outlander Assistant" "com.outlander.assistant" --web-dir dist
npx cap add android

# 4. Откройте в Android Studio для сборки APK:
npx cap open android
# В Android Studio: Build -> Build Bundle(s) / APK(s) -> Build APK(s)`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Как получить и собрать APK для Android на GitHub
              </h2>
              <p className="text-xs text-slate-500">
                Пошаговая инструкция автоматической сборки через GitHub Actions или Capacitor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'actions'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            1. GitHub Actions (Автоматически)
          </button>
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'capacitor'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            2. Локально через Capacitor
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'pwa'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            3. Без сборки (PWA в Chrome)
          </button>
        </div>

        {/* Content Tab 1: GitHub Actions */}
        {activeTab === 'actions' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Самый простой способ: бесплатная сборка в облаке GitHub
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Вам не нужно устанавливать тяжелый Android Studio и SDK на свой компьютер. Создайте файл workflow в вашем репозитории на GitHub, и робот GitHub сам скомпилирует готовый <strong>.apk</strong> при каждом пуше!
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Шаги настройки:
              </span>
              <ol className="space-y-1.5 list-decimal pl-4 text-slate-700 dark:text-slate-300">
                <li>В вашем репозитории на GitHub создайте файл: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">.github/workflows/build-apk.yml</code></li>
                <li>Вставьте в него код workflow, приведенный ниже.</li>
                <li>Сделайте коммит и пуш (git push).</li>
                <li>Перейдите во вкладку <strong>Actions</strong> на странице вашего репозитория.</li>
                <li>После завершения сборки (зеленая галочка) скачайте готовый APK из блока <strong>Artifacts</strong> внизу страницы запуска!</li>
              </ol>
            </div>

            {/* Code Block with Copy */}
            <div className="relative">
              <div className="flex justify-between items-center bg-slate-800 text-slate-300 px-3 py-1.5 rounded-t-lg text-[10px] font-mono">
                <span>.github/workflows/build-apk.yml</span>
                <button
                  onClick={() => handleCopy('workflow', githubWorkflowYaml)}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  {copiedKey === 'workflow' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Копировать YAML</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-3 rounded-b-lg overflow-x-auto text-[10px] font-mono max-h-56 leading-relaxed">
                {githubWorkflowYaml}
              </pre>
            </div>
          </div>
        )}

        {/* Content Tab 2: Capacitor */}
        {activeTab === 'capacitor' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Сборка на компьютере через официальный Capacitor CLI
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Если у вас на компьютере установлен Android Studio, вы можете обернуть приложение в нативный Android проект за 4 команды терминала:
              </p>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center bg-slate-800 text-slate-300 px-3 py-1.5 rounded-t-lg text-[10px] font-mono">
                <span>Команды в терминале:</span>
                <button
                  onClick={() => handleCopy('capacitor', capacitorCommands)}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  {copiedKey === 'capacitor' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Копировать команды</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-3 rounded-b-lg overflow-x-auto text-[10px] font-mono leading-relaxed">
                {capacitorCommands}
              </pre>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
              Готовый файл APK появится в папке: <code className="font-mono font-bold">android/app/build/outputs/apk/debug/app-debug.apk</code>. Перекиньте его на телефон через Telegram или USB-кабель и разрешите установку из неизвестных источников.
            </div>
          </div>
        )}

        {/* Content Tab 3: PWA */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Установка без компиляции APK (как PWA-приложение)
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Это современный веб-стандарт Progressive Web App. Приложение устанавливается на рабочий стол телефона как полноценная иконка, работает в полноэкранном режиме без адресной строки браузера и кэширует данные!
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Как установить за 10 секунд на телефон:
              </span>
              <ol className="space-y-1.5 list-decimal pl-4 text-slate-700 dark:text-slate-300">
                <li>Откройте ссылку приложения в браузере <strong>Google Chrome</strong> или <strong>Яндекс.Браузер</strong> на Android.</li>
                <li>Нажмите меню браузера (три точки в правом верхнем углу).</li>
                <li>Выберите пункт <strong>«Добавить на главный экран»</strong> или <strong>«Установить приложение»</strong>.</li>
                <li>На рабочем столе телефона появится значок с логотипом Outlander I, запускающийся как отдельное нативное приложение!</li>
              </ol>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

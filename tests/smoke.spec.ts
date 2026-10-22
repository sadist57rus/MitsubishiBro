import { expect, test, type Page } from '@playwright/test';
import { parseDecimalInput } from '../src/lib/storage';

type Viewport = { width: number; height: number };
type Theme = 'light' | 'dark';
type AuditScreen = 'home' | 'garage' | 'settings';
type AuditThreshold = { smallText: number; smallTargets: number };

const viewports: Viewport[] = [
  { width: 360, height: 800 },
  { width: 800, height: 480 },
  { width: 1280, height: 720 },
];
const themes: Theme[] = ['light', 'dark'];

const sectionGroups: { name: string; sections: string[] }[] = [
  { name: 'core-and-catalog', sections: ['overview', 'garage', 'settings', 'brands'] },
  { name: 'vehicle-data', sections: ['fuel', 'specs', 'bulbs', 'parts'] },
  { name: 'maintenance', sections: ['fuses', 'tuning', 'guides', 'issues'] },
  { name: 'tools-and-records', sections: ['wheels', 'maintenance', 'obd', 'logbook'] },
];

// Baselines are intentionally explicit. Any increase fails CI; new screen/viewport
// combinations default to zero until reviewed and deliberately baselined.
const auditThresholds: Record<string, AuditThreshold> = {
  'home:360x800': { smallText: 0, smallTargets: 0 },
  'garage:360x800': { smallText: 0, smallTargets: 0 },
  'settings:360x800': { smallText: 0, smallTargets: 0 },
  'home:800x480': { smallText: 0, smallTargets: 0 },
  'garage:800x480': { smallText: 0, smallTargets: 0 },
  'settings:800x480': { smallText: 0, smallTargets: 0 },
};

async function chooseToyota(page: Page) {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__car_brother_smoke_initialized')) {
      localStorage.clear();
      sessionStorage.setItem('__car_brother_smoke_initialized', 'yes');
    }
  });
  await page.goto('/');
  const orientationHeading = page.getByRole('heading', { name: /Выберите ориентацию экрана/i });
  if (await orientationHeading.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /Телефон/i }).click();
  }
  const setupHeading = page.getByRole('heading', { name: /Добавим вашу машину/i });
  if (await setupHeading.isVisible().catch(() => false)) {
    const brand = page.locator('select').first();
    await brand.selectOption({ value: 'toyota' });
    await page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-garage') || '')).toContain('toyota');
  }
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
}

async function prepare(page: Page, viewport: Viewport, theme: Theme) {
  await page.setViewportSize(viewport);
  const consoleErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  await chooseToyota(page);
  await page.evaluate(mode => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.dataset.theme = mode;
  }, theme);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  return consoleErrors;
}

async function assertReadableAndTouchSafe(
  page: Page,
  label: string,
  screen: AuditScreen,
  viewport: Viewport,
) {
  const violations = await page.evaluate(() => {
    const interactive = [...document.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [role="button"], [role="tab"], [role="switch"], [tabindex]:not([tabindex="-1"])')];
    const smallTargets = interactive.filter(el => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return false;
      return rect.width < 44 || rect.height < 44;
    }).map(el => ({ tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 70), width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) }));
    const smallText = [...document.querySelectorAll<HTMLElement>('body *')].filter(el => {
      if (el.children.length > 0) return false;
      const text = (el.textContent || '').trim();
      if (!text) return false;
      const style = getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.fontSize) < 12;
    }).map(el => ({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 70), size: getComputedStyle(el).fontSize }));
    const headerOverflow = [...document.querySelectorAll<HTMLElement>('header button, header a[href], header select, header input')].filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < 0 || rect.right > window.innerWidth);
    }).map(el => ({ text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 70), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) }));
    return { smallTargets, smallText, headerOverflow };
  });
  const viewportKey = viewport.width + 'x' + viewport.height;
  const threshold = auditThresholds[screen + ':' + viewportKey] ?? { smallText: 0, smallTargets: 0 };
  console.log('[ui-audit] ' + label + ': text<12px=' + violations.smallText.length + ' (limit ' + threshold.smallText + '), interactive<44x44=' + violations.smallTargets.length + ' (limit ' + threshold.smallTargets + ')');
  expect(violations.smallTargets.length, label + ': interactive targets below 44x44: ' + JSON.stringify(violations.smallTargets)).toBeLessThanOrEqual(threshold.smallTargets);
  expect(violations.smallText.length, label + ': visible text below 12px: ' + JSON.stringify(violations.smallText)).toBeLessThanOrEqual(threshold.smallText);
  expect(violations.headerOverflow, label + ': header controls outside viewport: ' + JSON.stringify(violations.headerOverflow)).toEqual([]);
}

async function openNavItem(page: Page, sectionId: string) {
  const phoneNav = page.getByTestId('phone-bottom-navigation');
  if (await phoneNav.isVisible().catch(() => false)) {
    const phonePrimary = ['overview', 'garage', 'maintenance', 'obd'];
    if (phonePrimary.includes(sectionId)) {
      await page.getByTestId('phone-nav-item-' + sectionId).click();
      return;
    }
    await page.getByTestId('phone-more-trigger').click();
  } else {
    const widePrimary = ['overview', 'garage', 'maintenance', 'obd', 'fuel', 'logbook'];
    if (widePrimary.includes(sectionId)) {
      await page.getByTestId('wide-nav-item-' + sectionId).click();
      return;
    }
    await page.getByTestId('wide-more-trigger').click();
  }
  await page.getByTestId('more-nav-item-' + sectionId).click();
}

for (const viewport of viewports) {
  for (const theme of themes) {
    const suffix = viewport.width + 'x' + viewport.height + ', ' + theme;

    test('home, garage and settings accessibility: ' + suffix, async ({ page }) => {
      const consoleErrors = await prepare(page, viewport, theme);
      await assertReadableAndTouchSafe(page, 'home ' + suffix, 'home', viewport);
      await openNavItem(page, 'garage');
      await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
      await assertReadableAndTouchSafe(page, 'garage ' + suffix, 'garage', viewport);

      await page.getByRole('button', { name: /Добавить машину/i }).click();
      const brand = page.locator('form select').first();
      await brand.selectOption({ value: 'toyota' });
      const modelValues = await page.locator('form select').nth(1).locator('option').evaluateAll(options => options.map(option => option.getAttribute('value')));
      expect(new Set(modelValues).size, 'model ids in the garage selector must be unique').toBe(modelValues.length);
      const modelLabels = await page.locator('form select').nth(1).locator('option').evaluateAll(options => options.map(option => (option.textContent || '').trim().toLocaleLowerCase('ru-RU')));
      expect(new Set(modelLabels).size, 'model names and years in the garage selector must be unique').toBe(modelLabels.length);
      await page.getByRole('button', { name: /Отмена/i }).click();

      await page.reload();
      await openNavItem(page, 'settings');
      await expect(page.getByRole('heading', { name: /Настройки/i })).toBeVisible();
      await assertReadableAndTouchSafe(page, 'settings ' + suffix, 'settings', viewport);
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });

    for (const group of sectionGroups) {
      test('section group ' + group.name + ': ' + suffix, async ({ page }) => {
        const consoleErrors = await prepare(page, viewport, theme);
        for (const sectionId of group.sections) {
          await openNavItem(page, sectionId);
          expect(await page.locator('body').innerText(), 'selected Toyota must not inherit Outlander copy in section ' + sectionId).not.toMatch(/Outlander/i);
          await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        }
        expect(consoleErrors, 'browser console/page errors').toEqual([]);
      });
    }

    test('more screen keyboard navigation and existing APK guide: ' + suffix, async ({ page }) => {
      const consoleErrors = await prepare(page, viewport, theme);
      await expect(page.locator('header').getByRole('button', { name: /APK/i })).toHaveCount(0);
      await expect(page.getByText('Japan · Auto')).toHaveCount(0);
      const phoneNav = page.getByTestId('phone-bottom-navigation');
      const moreTrigger = await phoneNav.isVisible().catch(() => false)
        ? page.getByTestId('phone-more-trigger')
        : page.getByTestId('wide-more-trigger');
      await moreTrigger.focus();
      await moreTrigger.press('Enter');
      const settingsItem = page.getByTestId('more-nav-item-settings');
      await expect(settingsItem).toBeVisible();
      await settingsItem.focus();
      await settingsItem.press('Enter');
      await expect(page.getByRole('heading', { name: /Настройки/i })).toBeVisible();
      await expect(page.getByTestId('header-back')).toBeVisible();
      await page.getByTestId('header-back').focus();
      await page.getByTestId('header-back').press('Enter');
      await expect(page.getByTestId('header-section-title')).toHaveText('Главная');
      await expect(page.getByRole('button', { name: /Изменить автомобиль|Выбрать автомобиль/i })).toBeVisible();

      const apkTrigger = page.getByRole('button', { name: /Сборка APK на GitHub/i });
      await apkTrigger.click();
      const apkDialog = page.getByRole('dialog');
      await expect(apkDialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(apkDialog).toBeHidden();
      await expect(apkTrigger).toBeFocused();

      for (const brand of [{ id: 'nissan', value: 'nissan' }, { id: 'honda', value: 'honda' }]) {
        await page.getByRole('button', { name: /Изменить автомобиль/i }).click();
        await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
        await page.getByRole('button', { name: 'Изменить' }).first().click();
        await page.locator('form select').first().selectOption({ value: brand.value });
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await openNavItem(page, 'fuel');
        expect(await page.locator('body').innerText(), brand.id + ' fuel section must not show Outlander-specific copy').not.toMatch(/Outlander/i);
        await page.getByTestId('header-back').click();
      }
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });
  }
}


test('главная показывает шесть быстрых действий и ведёт к гаражу для смены автомобиля', async ({ page }) => {
  await prepare(page, { width: 390, height: 844 }, 'light');
  const actions = ['maintenance', 'fuses', 'bulbs', 'obd', 'fuel', 'logbook'];
  for (const id of actions) await expect(page.getByTestId('home-quick-action-' + id)).toBeVisible();
  await expect(page.locator('[data-testid^="home-quick-action-"]')).toHaveCount(6);
  await expect(page.locator('section details')).toHaveCount(1);
  await expect(page.locator('section details')).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: /Изменить автомобиль/i }).click();
  await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
});

test('настройки применяют цветовую палитру и выбор марки читаем в ночной теме', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');
  await page.getByLabel('Тема интерфейса').selectOption('dark');
  await expect.poll(() => page.locator('html').getAttribute('data-theme')).toBe('dark');

  const paletteButton = page.getByRole('button', { name: /Чёрный \/ жёлтый/ });
  await paletteButton.click();
  await expect(page.getByRole('button', { name: 'Применить', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await expect.poll(() => page.locator('html').getAttribute('data-palette')).toBe('black-yellow');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-color-palette'))).toBe('black-yellow');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--palette-accent').trim())).toBe('#facc15');

  await expect(page.getByTestId('header-section-title')).toHaveText('Настройки');
  const moreTrigger = page.getByTestId('phone-more-trigger');
  await expect(moreTrigger).toBeVisible();
  await moreTrigger.click();
  await expect(page.getByTestId('more-screen-grid')).toBeVisible();
  await expect(page.getByTestId('more-nav-item-brands')).toBeVisible();

});


test('экран «Ещё» помещается на телефоне и содержит справочные разделы', async ({ page }) => {
  await prepare(page, { width: 360, height: 800 }, 'light');
  await page.getByTestId('phone-more-trigger').click();
  const grid = page.getByTestId('more-screen-grid');
  await expect(grid).toBeVisible();
  const bounds = await grid.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(360);
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.bottom).toBeLessThanOrEqual(800);
  for (const id of ['settings', 'brands', 'specs', 'bulbs', 'parts', 'fuses', 'tuning', 'guides', 'issues', 'wheels']) {
    await expect(page.getByTestId('more-nav-item-' + id)).toBeVisible();
  }
  await expect(page.getByRole('button', { name: /Открыть разделы приложения/i })).toHaveCount(0);
});


test('decimal input parser accepts comma and dot separators', () => {
  expect(parseDecimalInput('58,5')).toBe(58.5);
  expect(parseDecimalInput('58.5')).toBe(58.5);
  expect(parseDecimalInput(' 1 234,75 ')).toBe(1234.75);
  expect(parseDecimalInput('')).toBeNull();
  expect(parseDecimalInput('58,5,2')).toBeNull();
});

test('maintenance fuel calculator accepts decimal comma on text inputs', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__car_brother_smoke_initialized')) {
      localStorage.clear();
      sessionStorage.setItem('__car_brother_smoke_initialized', 'yes');
    }
  });
  await page.goto('/');
  const orientationHeading = page.getByRole('heading', { name: /Выберите ориентацию экрана/i });
  if (await orientationHeading.isVisible().catch(() => false)) await page.getByRole('button', { name: /Телефон/i }).click();
  const setupHeading = page.getByRole('heading', { name: /Добавим вашу машину/i });
  if (await setupHeading.isVisible().catch(() => false)) {
    await page.locator('select').first().selectOption({ value: 'mitsubishi' });
    await page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-garage') || '')).toContain('outlander-1');
  }
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
  await openNavItem(page, 'maintenance');
  await expect(page.getByRole('heading', { name: /Калькулятор расхода топлива/ })).toBeVisible();

  await page.getByPlaceholder('Например: 420').fill('420,5');
  await page.getByPlaceholder('Например: 48').fill('48,5');
  await page.getByPlaceholder('58.5').fill('58,5');

  await expect(page.getByText('Всего: 2 837 ₽').or(page.getByText('Всего: 2 837 ₽'))).toBeVisible();
  await expect(page.getByText('11.53', { exact: true })).toBeVisible();
});


test('показывает пять основных марок, остальные раскрываются кнопкой «Другие»', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await chooseToyota(page);
  await openNavItem(page, 'brands');

  const otherToggle = page.getByRole('button', { name: 'Другие', exact: true });
  await expect(otherToggle).toBeVisible();
  for (const brand of [/Toyota/i, /Mitsubishi/i, /Nissan/i, /Mazda/i, /Honda/i]) {
    await expect(page.getByRole('button', { name: brand }).first()).toBeVisible();
  }
  await expect(page.getByRole('button', { name: /Suzuki/i })).toHaveCount(0);

  await otherToggle.click();
  await expect(page.getByRole('button', { name: /Suzuki/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Скрыть', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Скрыть', exact: true }).click();
  await expect(page.getByRole('button', { name: /Suzuki/i })).toHaveCount(0);
});

test('theme mode and color palette selections update the active document styles', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');
  const themeSelect = page.getByLabel('Тема интерфейса');
  await themeSelect.selectOption('dark');
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);

  await page.getByRole('button', { name: /Чёрный \/ жёлтый/ }).click();
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.palette)).toBe('black-yellow');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--palette-accent').trim())).toBe('#facc15');

  await themeSelect.selectOption('light');
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
});


test('palette selection persists and the section header remains visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');

  const palettes = [
    { name: 'Чёрный / жёлтый', id: 'black-yellow', background: 'rgb(250, 204, 21)', foreground: 'rgb(17, 24, 39)' },
    { name: 'Белый / красный', id: 'white-red', background: 'rgb(220, 38, 38)', foreground: 'rgb(255, 255, 255)' },
    { name: 'Чёрный / оранжевый', id: 'black-orange', background: 'rgb(249, 115, 22)', foreground: 'rgb(67, 20, 7)' },
    { name: 'Ночной синий', id: 'midnight-blue', background: 'rgb(56, 189, 248)', foreground: 'rgb(8, 47, 73)' },
    { name: 'Графит / зелёный', id: 'forest-green', background: 'rgb(34, 197, 94)', foreground: 'rgb(5, 46, 22)' },
  ];

  for (const palette of palettes) {
    const paletteButton = page.getByRole('button', { name: new RegExp(palette.name) });
    await paletteButton.click();
    await page.getByRole('button', { name: 'Применить', exact: true }).click();
    await expect.poll(() => page.locator('html').getAttribute('data-palette')).toBe(palette.id);
    await expect(paletteButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('header-section-title')).toHaveText('Настройки');
  }
});

test('driver mode tokens enforce readable text and minimum touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseToyota(page);

  for (const mode of ['phone', 'wide'] as const) {
    await page.evaluate(value => { document.documentElement.dataset.uiMode = value; }, mode);
    const metrics = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const minHeight = [...document.querySelectorAll<HTMLElement>('button, [role="button"], input, select, textarea')]
        .filter(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
        })
        .map(el => ({ label: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 50), height: el.getBoundingClientRect().height }));
      const smallText = [...document.querySelectorAll<HTMLElement>('main .text-xs, header .text-xs, main small, header small')]
        .filter(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && (el.textContent || '').trim().length > 0;
        })
        .map(el => ({ text: (el.textContent || '').trim().slice(0, 50), size: Number.parseFloat(getComputedStyle(el).fontSize) }));
      return { tapSize: Number.parseFloat(root.getPropertyValue('--tap-size')) * 16, minHeight, smallText };
    });
    const target = mode === 'wide' ? 56 : 48;
    const fontFloor = 14;
    expect(metrics.tapSize, mode + ' token').toBeGreaterThanOrEqual(target);
    expect(metrics.minHeight.filter(item => item.height + 0.5 < target), mode + ' undersized controls: ' + JSON.stringify(metrics.minHeight.filter(item => item.height + 0.5 < target))).toEqual([]);
    expect(metrics.smallText.filter(item => item.size + 0.1 < fontFloor), mode + ' undersized secondary text: ' + JSON.stringify(metrics.smallText.filter(item => item.size + 0.1 < fontFloor))).toEqual([]);
  }
});

test('wide navigation exposes six primary destinations and a dedicated More screen', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');
  await page.getByRole('button', { name: /Планшет \/ магнитола/i }).click();

  const rail = page.getByTestId('wide-navigation-rail');
  await expect(rail).toBeVisible();
  await expect(rail.locator('button')).toHaveCount(7);
  for (const id of ['overview', 'garage', 'maintenance', 'obd', 'fuel', 'logbook']) {
    await expect(page.getByTestId('wide-nav-item-' + id)).toBeVisible();
  }
  await expect(page.getByTestId('wide-nav-item-settings')).toHaveCount(0);
  await expect(page.locator('header [data-testid="brand-selector-trigger"]')).toHaveCount(0);
  await expect(page.locator('header [aria-label="Выбрать двигатель"]')).toHaveCount(0);
  await expect(page.locator('header button').filter({ hasText: /^4WD$|^FWD$/ })).toHaveCount(0);

  await page.getByTestId('wide-more-trigger').click();
  await expect(page.getByTestId('more-screen-grid')).toBeVisible();
  await expect(page.getByTestId('more-nav-item-settings')).toBeVisible();
  await expect(page.getByTestId('more-nav-item-brands')).toBeVisible();
  await expect(page.getByTestId('more-nav-item-fuel')).toHaveCount(0);
  await expect(page.getByTestId('more-nav-item-logbook')).toHaveCount(0);
});

test('главная показывает шесть быстрых действий без повторных ссылок', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseToyota(page);

  await expect(page.getByText('Мой автомобиль', { exact: true })).toBeVisible();
  await expect(page.getByText('Пробег:', { exact: false })).toBeVisible();
  const quickActions = page.locator('section[aria-labelledby="quick-actions-title"]');
  await expect(quickActions.locator('button')).toHaveCount(6);
  for (const label of ['ТО', 'Предохранители', 'Лампы', 'Ошибки OBD', 'Топливо', 'Журнал']) {
    await expect(quickActions.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(page.getByText(/Каталог автомобилей и разделов/)).toHaveCount(0);
  await expect(quickActions.getByRole('button', { name: 'Гараж', exact: true })).toHaveCount(0);
  await expect(quickActions.getByText(/Обслуживание|Электрика|Автосвет|Диагностика|Расходы|Записи и расходы/)).toHaveCount(0);
});


test('активный пункт нижней навигации использует выбранный акцент палитры', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');
  await page.getByLabel('Тема интерфейса').selectOption('dark');
  await page.getByRole('button', { name: /Чёрный \/ жёлтый/ }).click();
  await page.getByRole('button', { name: 'Применить', exact: true }).click();
  await expect.poll(() => page.locator('html').getAttribute('data-palette')).toBe('black-yellow');

  await page.setViewportSize({ width: 390, height: 844 });
  const homeNav = page.getByTestId('phone-nav-item-overview');
  await homeNav.click();
  await expect.poll(() => homeNav.evaluate(element => getComputedStyle(element).color)).toBe(
    await page.evaluate(() => {
      const variable = document.documentElement.classList.contains('dark') ? '--palette-accent-content' : '--palette-accent-ink';
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }).then(value => {
      const probe = document.createElement('span');
      probe.style.color = value;
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }),
  );
  await expect.poll(() => homeNav.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
});


test('нижняя навигация сохраняет контраст во всех палитрах и скрывается в широком режиме', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');
  const palettes = [
    { name: 'Чёрный / жёлтый', id: 'black-yellow' },
    { name: 'Белый / красный', id: 'white-red' },
    { name: 'Чёрный / оранжевый', id: 'black-orange' },
    { name: 'Ночной синий', id: 'midnight-blue' },
    { name: 'Графит / зелёный', id: 'forest-green' },
  ];

  for (const palette of palettes) {
    await page.getByRole('button', { name: new RegExp(palette.name) }).click();
    await page.getByRole('button', { name: 'Применить', exact: true }).click();
    await expect.poll(() => page.locator('html').getAttribute('data-palette')).toBe(palette.id);
    await page.setViewportSize({ width: 390, height: 844 });
    const active = page.getByTestId('phone-nav-item-settings');
    await expect.poll(() => active.evaluate(element => getComputedStyle(element).color)).toBe(
      await page.evaluate(() => {
        const variable = document.documentElement.classList.contains('dark') ? '--palette-accent-content' : '--palette-accent-ink';
        const probe = document.createElement('span');
        probe.style.color = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      }),
    );
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByTestId('phone-bottom-navigation')).toBeHidden();
  }

  await page.getByLabel('Тема интерфейса').selectOption('dark');
  await page.setViewportSize({ width: 390, height: 844 });
  const active = page.getByTestId('phone-nav-item-settings');
  await expect.poll(() => active.evaluate(element => getComputedStyle(element).color)).toBe(
    await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--palette-accent-content').trim();
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }),
  );
});

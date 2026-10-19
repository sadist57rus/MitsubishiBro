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
  const menu = page.getByTestId('section-menu-trigger');
  await expect(menu).toBeVisible();
  await menu.click();
  const panel = page.getByTestId('section-menu-list');
  const item = page.getByTestId('nav-item-' + sectionId);
  await expect(item).toBeVisible({ timeout: 5_000 });
  // Click the section title, not nested brand-switch buttons inside the Brands row.
  await item.locator('span').first().click();
  await expect(panel).toBeHidden();
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

    test('dialogs and brand-specific copy: ' + suffix, async ({ page }) => {
      const consoleErrors = await prepare(page, viewport, theme);

      const sectionMenu = page.getByTestId('section-menu-trigger');
      await sectionMenu.focus();
      await sectionMenu.press('Enter');
      const settingsItem = page.getByTestId('nav-item-settings');
      await expect(settingsItem).toBeVisible();
      await settingsItem.focus();
      await settingsItem.press('Enter');
      await expect(page.getByRole('heading', { name: /Настройки/i })).toBeVisible();
      await sectionMenu.press('Enter');
      await expect(page.getByTestId('section-menu-list')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('section-menu-list')).toBeHidden();
      await expect(sectionMenu).toBeFocused();

      const apkTrigger = page.getByRole('button', { name: /Сборка APK на GitHub/i });
      await apkTrigger.click();
      const apkDialog = page.getByRole('dialog');
      await expect(apkDialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(apkDialog).toBeHidden();
      await expect(apkTrigger).toBeFocused();

      const brandTrigger = page.getByTestId('brand-selector-trigger');
      for (const brandId of ['nissan', 'honda']) {
        await brandTrigger.click();
        await expect(page.getByRole('region', { name: 'Выбор марки автомобиля' })).toBeVisible();
        await page.getByTestId('brand-option-' + brandId).click();
        await page.getByTestId('section-menu-trigger').click();
        const sectionMenuText = await page.getByTestId('section-menu-list').innerText();
        expect(sectionMenuText, brandId + ' section menu must be vehicle-neutral').not.toMatch(/Outlander/i);
        await page.getByTestId('nav-item-fuel').click();
        expect(await page.locator('body').innerText(), brandId + ' fuel section must not show Outlander-specific copy').not.toMatch(/Outlander/i);
      }
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });
  }
}


test('настройки применяют цветовую палитру и выбор марки читаем в ночной теме', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await chooseToyota(page);
  await openNavItem(page, 'settings');
  await page.getByLabel('Тема интерфейса').selectOption('dark');
  await expect.poll(() => page.locator('html').getAttribute('data-theme')).toBe('dark');

  const paletteButton = page.getByRole('button', { name: /Чёрный \/ жёлтый/ });
  await paletteButton.click();
  await expect.poll(() => page.locator('html').getAttribute('data-palette')).toBe('black-yellow');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-color-palette'))).toBe('black-yellow');
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--palette-accent').trim())).toBe('#facc15');

  const brandTrigger = page.getByRole('button', { name: /Выбрать марку автомобиля/i });
  await expect(brandTrigger).toBeVisible();
  await expect(brandTrigger).toHaveClass(/dark:bg-slate-800/);
  await expect(brandTrigger).toHaveClass(/dark:text-slate-100/);
  await expect(brandTrigger.locator('span').filter({ hasText: /Все бренды/ })).toHaveClass(/dark:text-slate-300/);
  await brandTrigger.click();
  const brandPanel = page.getByRole('region', { name: 'Выбор марки автомобиля' });
  await expect(brandPanel).toBeVisible();
  await expect(brandPanel.getByText(/Оригинальные логотипы/)).toHaveClass(/dark:text-red-400/);

});


test('мобильные меню полностью помещаются на экране, логотипы марок не обрезаются', async ({ page }) => {
  await prepare(page, { width: 360, height: 800 }, 'light');
  await page.getByRole('button', { name: /Открыть разделы приложения/i }).click();
  const panel = page.locator('#section-menu-panel');
  await expect(panel).toBeVisible();
  const panelBounds = await panel.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
  });
  expect(panelBounds.left).toBeGreaterThanOrEqual(0);
  expect(panelBounds.right).toBeLessThanOrEqual(360);
  expect(panelBounds.top).toBeGreaterThanOrEqual(0);
  expect(panelBounds.bottom).toBeLessThanOrEqual(800);
  await panel.getByText('Логотипы всех марок:').scrollIntoViewIfNeeded();
  const brandButtons = await panel.locator('button[title]').evaluateAll(elements => elements.map(el => {
    const rect = el.getBoundingClientRect();
    return { title: el.getAttribute('title'), left: rect.left, right: rect.right };
  }));
  expect(brandButtons.length).toBeGreaterThan(0);
  expect(brandButtons.filter(button => button.left < 0 || button.right > 360), 'brand logo buttons must stay inside the phone viewport: ' + JSON.stringify(brandButtons)).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Выбрать марку автомобиля/i }).click();
  const brandPanel = page.locator('#brand-dropdown-panel');
  await expect(brandPanel).toBeVisible();
  const brandPanelBounds = await brandPanel.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  });
  expect(brandPanelBounds.left).toBeGreaterThanOrEqual(0);
  expect(brandPanelBounds.right).toBeLessThanOrEqual(360);
  expect(brandPanelBounds.top).toBeGreaterThanOrEqual(0);
  expect(brandPanelBounds.bottom).toBeLessThanOrEqual(800);
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

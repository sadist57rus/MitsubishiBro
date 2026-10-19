import { expect, test, type Page } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const AxeBuilder = require('@axe-core/playwright').default as new (options: { page: Page }) => { withTags(tags: string[]): { analyze(): Promise<{ violations: Array<{ id: string; impact: string | null; nodes: Array<{ target: string[]; failureSummary?: string }> }> }> } };
import { JAPANESE_BRANDS } from '../src/data/japaneseBrandsData';
import { getFuelStorageKey, getLogbookStorageKey, LEGACY_FUEL_STORAGE_KEY, LEGACY_LOGBOOK_STORAGE_KEY } from '../src/lib/vehicleStorageKeys';
import { APP_STORAGE_SCHEMA_VERSION, BACKUP_SCHEMA_VERSION, migrateBackup } from '../src/lib/backupSchema';

type Viewport = { width: number; height: number };
type Theme = 'light' | 'dark';
type AuditScreen = 'home' | 'garage' | 'settings' | 'section';
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
  'home:1280x720': { smallText: 0, smallTargets: 0 },
  'garage:1280x720': { smallText: 0, smallTargets: 0 },
  'settings:1280x720': { smallText: 0, smallTargets: 0 },
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
    const brand = page.locator('main select').nth(0);
    await brand.selectOption({ value: 'toyota' });
    await page.locator('main select').nth(1).selectOption({ index: 1 });
    const year = page.locator('main input[type="number"]').first();
    await year.fill((await year.getAttribute('min')) || '2000');
    await page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-garage') || '')).toContain('toyota');
  }
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
}

async function chooseOutlander(page: Page) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('/');
  const orientationHeading = page.getByRole('heading', { name: /Выберите ориентацию экрана/i });
  if (await orientationHeading.isVisible().catch(() => false)) await page.getByRole('button', { name: /Телефон/i }).click();
  const setupHeading = page.getByRole('heading', { name: /Добавим вашу машину/i });
  if (await setupHeading.isVisible().catch(() => false)) {
    await page.locator('main select').nth(0).selectOption({ value: 'mitsubishi' });
    await page.locator('main select').nth(1).selectOption({ value: 'outlander-1' });
    const year = page.locator('main input[type="number"]').first();
    await year.fill((await year.getAttribute('min')) || '2003');
    await page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i }).click();
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
    const horizontalOverflow = [...document.querySelectorAll<HTMLElement>('body *')].filter(el => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return false;
      if (style.position === 'fixed' && (rect.right <= 0 || rect.left >= window.innerWidth)) return false;
      return (rect.left < -1 || rect.right > window.innerWidth + 1) && !el.closest('.overflow-x-auto, [data-horizontal-scroll]');
    }).map(el => ({
      tag: el.tagName,
      className: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
      left: Math.round(el.getBoundingClientRect().left),
      right: Math.round(el.getBoundingClientRect().right),
      width: Math.round(el.getBoundingClientRect().width),
    })).slice(0, 20);
    return { smallTargets, smallText, headerOverflow, horizontalOverflow };
  });
  const viewportKey = viewport.width + 'x' + viewport.height;
  const threshold = auditThresholds[screen + ':' + viewportKey] ?? { smallText: 0, smallTargets: 0 };
  console.log('[ui-audit] ' + label + ': text<12px=' + violations.smallText.length + ' (limit ' + threshold.smallText + '), interactive<44x44=' + violations.smallTargets.length + ' (limit ' + threshold.smallTargets + ')');
  expect(violations.smallTargets.length, label + ': interactive targets below 44x44: ' + JSON.stringify(violations.smallTargets)).toBeLessThanOrEqual(threshold.smallTargets);
  expect(violations.smallText.length, label + ': visible text below 12px: ' + JSON.stringify(violations.smallText)).toBeLessThanOrEqual(threshold.smallText);
  expect(violations.headerOverflow, label + ': header controls outside viewport: ' + JSON.stringify(violations.headerOverflow)).toEqual([]);
  expect(violations.horizontalOverflow, label + ': elements outside viewport: ' + JSON.stringify(violations.horizontalOverflow)).toEqual([]);
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

test('model-specific sections never reuse Outlander data for another active vehicle', async ({ page }) => {
  test.setTimeout(120_000);
  await prepare(page, { width: 360, height: 800 }, 'light');

  const selectBrand = async (brandId: string) => {
    await page.getByTestId('brand-selector-trigger').click();
    await expect(page.getByRole('region', { name: 'Выбор марки автомобиля' })).toBeVisible();
    await page.getByTestId('brand-option-' + brandId).click();
  };
  const allSections = sectionGroups.flatMap(group => group.sections);
  const technicalSections = ['specs', 'bulbs', 'parts', 'fuses', 'tuning', 'guides', 'issues', 'wheels', 'maintenance', 'obd', 'logbook'];

  for (const brandId of ['toyota', 'nissan', 'honda', 'mazda']) {
    await selectBrand(brandId);
    for (const sectionId of allSections) {
      await openNavItem(page, sectionId);
      const content = await page.locator('main').innerText();
      if (sectionId !== 'brands') expect(content, brandId + ' must not show Mitsubishi-specific copy in ' + sectionId).not.toMatch(/(?:Outlander|Mitsubishi|Мицубиси|4G6\d|MIVEC)/i);
      if (technicalSections.includes(sectionId)) {
        await expect(page.getByTestId('vehicle-data-empty-state'), brandId + ' must show an explicit empty state in ' + sectionId).toBeVisible();
      }
    }
  }

  // Exercise a Mitsubishi model other than Outlander without inventing vehicle specifications.
  await page.evaluate(() => {
    const raw = localStorage.getItem('car-brother-garage');
    if (!raw) throw new Error('Garage fixture is missing');
    const garage = JSON.parse(raw) as { vehicles: Array<{ id: string; brandId: string; modelId: string }>; activeVehicleId: string };
    const active = garage.vehicles.find(vehicle => vehicle.id === garage.activeVehicleId);
    if (!active) throw new Error('Active vehicle fixture is missing');
    active.brandId = 'mitsubishi';
    active.modelId = 'lancer-9';
    localStorage.setItem('car-brother-garage', JSON.stringify(garage));
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-vehicle') || '')).toContain('lancer-9');
  for (const sectionId of allSections) {
    await openNavItem(page, sectionId);
    const content = await page.locator('main').innerText();
    if (sectionId !== 'brands') {
      expect(content, 'Mitsubishi Lancer must not inherit Outlander/engine-specific copy in ' + sectionId).not.toMatch(/Outlander|4G6\d|MIVEC/i);
    }
    if (technicalSections.includes(sectionId)) {
      await expect(page.getByTestId('vehicle-data-empty-state'), 'Mitsubishi Lancer must show an explicit empty state in ' + sectionId).toBeVisible();
    }
  }
});

test('axe accessibility audit in dark theme: home, garage and settings', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await chooseToyota(page);
  await page.evaluate(() => { document.documentElement.classList.add('dark'); document.documentElement.dataset.theme = 'dark'; });
    const audit = async (screen: string) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const summary = results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) }));
    expect(results.violations, 'axe violations on dark-theme ' + screen + ': ' + JSON.stringify(summary)).toEqual([]);
  };
  await audit('home');
  await openNavItem(page, 'garage');
  await audit('garage');
  await page.reload();
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await openNavItem(page, 'settings');
  await audit('settings');
});


test('onboarding requires a chosen make and model and constrains the year', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto('/');
  const orientationHeading = page.getByRole('heading', { name: /Выберите ориентацию экрана/i });
  if (await orientationHeading.isVisible().catch(() => false)) await page.getByRole('button', { name: /Телефон/i }).click();
  await expect(page.getByRole('heading', { name: /Добавим вашу машину/i })).toBeVisible();
  const selects = page.locator('main select');
  const brand = selects.nth(0);
  const model = selects.nth(1);
  const year = page.locator('main input[type="number"]').first();
  const save = page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i });
  await expect(brand).toHaveValue('');
  await expect(model).toHaveValue('');
  await expect(model).toBeDisabled();
  await expect(year).toHaveValue('');
  await expect(year).toBeDisabled();
  await expect(save).toBeDisabled();
  await expect(selects.nth(2).locator('option').first()).toHaveText('Выберите…');
  await expect(selects.nth(3).locator('option').first()).toHaveText('Выберите…');
  await brand.selectOption({ value: 'toyota' });
  await model.selectOption({ index: 1 });
  const min = Number(await year.getAttribute('min'));
  const max = Number(await year.getAttribute('max'));
  expect(Number.isFinite(min)).toBe(true);
  expect(Number.isFinite(max)).toBe(true);
  expect(max).toBeGreaterThanOrEqual(min);
  await year.fill(String(min));
  await expect(save).toBeEnabled();
  await year.fill(String(min - 1));
  await expect(save).toBeDisabled();
});

test('populated OBD, parts, specs, bulbs and tire screens meet touch/text thresholds', async ({ page }) => {
  test.setTimeout(120_000);
  const targetViewports: Viewport[] = [{ width: 360, height: 800 }, { width: 800, height: 480 }];
  const sections = ['obd', 'parts', 'specs', 'bulbs', 'wheels'];
  for (const viewport of targetViewports) {
    for (const theme of themes) {
      await page.setViewportSize(viewport);
      await chooseOutlander(page);
      await page.evaluate(mode => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        document.documentElement.dataset.theme = mode;
      }, theme);
      for (const sectionId of sections) {
        await openNavItem(page, sectionId);
        await assertReadableAndTouchSafe(page, 'populated ' + sectionId + ' ' + viewport.width + 'x' + viewport.height + ' ' + theme, 'section', viewport);
      }
    }
  }
});

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
          if (sectionId !== 'brands') expect(await page.locator('main').innerText(), 'selected Toyota must not inherit Mitsubishi-specific copy in section ' + sectionId).not.toMatch(/(?:Outlander|Mitsubishi|Мицубиси|4G6\d|MIVEC)/i);
          if (['specs', 'bulbs', 'parts', 'fuses', 'tuning', 'guides', 'issues', 'wheels', 'maintenance', 'obd', 'logbook'].includes(sectionId)) {
            await expect(page.getByTestId('vehicle-data-empty-state')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Данные для этой модели ещё не проверены' })).toBeVisible();
          }
          await assertReadableAndTouchSafe(page, 'section ' + sectionId + ' ' + suffix, 'section', viewport);
          await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        }
        expect(consoleErrors, 'browser console/page errors').toEqual([]);
      });
    }

    test('brand selector menu and page overflow: ' + suffix, async ({ page }) => {
      await prepare(page, viewport, theme);
      await page.getByTestId('section-menu-trigger').click();
      const sectionPanel = page.locator('#section-menu-panel');
      await expect(sectionPanel).toBeVisible();
      if (viewport.width === 360) {
        const bounds = await sectionPanel.boundingBox();
        expect(bounds, 'section menu must have a visible bounding box').not.toBeNull();
        expect(bounds!.x, 'section menu left edge must stay inside viewport').toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width, 'section menu right edge must stay inside viewport').toBeLessThanOrEqual(viewport.width);
        expect(bounds!.y, 'section menu top edge must stay inside viewport').toBeGreaterThanOrEqual(0);
        expect(bounds!.y + bounds!.height, 'section menu bottom edge must stay inside viewport').toBeLessThanOrEqual(viewport.height);
        const buttons = await sectionPanel.locator('button, a[href]').evaluateAll(elements => elements.map(element => {
          const rect = element.getBoundingClientRect();
          return { text: (element.textContent || '').trim(), left: rect.left, right: rect.right };
        }));
        expect(buttons.filter(button => button.left < 0 || button.right > viewport.width), 'all section menu buttons must fit in viewport: ' + JSON.stringify(buttons)).toEqual([]);
      }
      await page.keyboard.press('Escape');
      await expect(sectionPanel).toBeHidden();
      await page.getByTestId('brand-selector-trigger').click();
      const brandMenu = page.getByRole('region', { name: 'Выбор марки автомобиля' });
      await expect(brandMenu).toBeVisible();
      await expect(brandMenu.getByTestId('brand-option-toyota')).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

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
        expect(sectionMenuText, brandId + ' section menu must be vehicle-neutral').not.toMatch(/Outlander|4G6\d|MIVEC/i);
        await page.getByTestId('nav-item-fuel').click();
        expect(await page.locator('body').innerText(), brandId + ' fuel section must not show Mitsubishi-specific copy').not.toMatch(/Outlander|Mitsubishi|Мицубиси|4G6\d|MIVEC/i);
      }
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });
  }
}


test('vehicle catalog has no duplicate models by name, body type and years', () => {
  for (const brand of JAPANESE_BRANDS) {
    const seen = new Map<string, string>();
    for (const model of brand.models) {
      const key = [model.name, model.bodyType, model.years]
        .map(value => value.trim().toLocaleLowerCase('ru-RU').replace(/\\s+/g, ' '))
        .join('|');
      const previousId = seen.get(key);
      expect(previousId, `${brand.id} has duplicate model entry for ${model.name} / ${model.bodyType} / ${model.years}`)
        .toBeUndefined();
      seen.set(key, model.id);
    }
  }
});


test('wide mode keeps controls large, text readable and keyboard focus visible', async ({ page }) => {
  await prepare(page, { width: 1280, height: 720 }, 'light');
  await page.evaluate(() => { document.documentElement.dataset.uiMode = 'wide'; });
  await openNavItem(page, 'settings');
  const metrics = await page.evaluate(() => {
    const visible = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const controls = [...document.querySelectorAll<HTMLElement>('main button, main a[href], main input, main select, main textarea, main [role="button"]')].filter(visible);
    const tooSmallControls = controls.filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width < 56 || rect.height < 56;
    }).map(element => ({ text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 60), width: Math.round(element.getBoundingClientRect().width), height: Math.round(element.getBoundingClientRect().height) }));
    const readableText = [...document.querySelectorAll<HTMLElement>('main p, main label, main button, main a[href], main input, main select, main textarea, main small, main [class*="text-xs"], main [class*="text-sm"]')].filter(visible);
    const smallText = readableText.filter(element => Number.parseFloat(getComputedStyle(element).fontSize) < 16)
      .map(element => ({ text: (element.innerText || element.getAttribute('aria-label') || (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value : '')).trim().slice(0, 60), size: getComputedStyle(element).fontSize }));
    return { tooSmallControls, smallText, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
  });
  expect(metrics.tooSmallControls, 'wide-mode controls below 56x56').toEqual([]);
  expect(metrics.smallText, 'wide-mode text below 16px in primary controls and labels').toEqual([]);
  expect(metrics.scrollWidth, 'wide mode must not create horizontal page scrolling').toBeLessThanOrEqual(metrics.clientWidth);

  const trigger = page.getByTestId('section-menu-trigger');
  let triggerFocused = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await page.keyboard.press('Tab');
    if (await trigger.evaluate(element => element === document.activeElement)) {
      triggerFocused = true;
      break;
    }
  }
  expect(triggerFocused, 'section menu trigger should be reachable by keyboard').toBe(true);
  const focusStyle = await trigger.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(':focus-visible'),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor
    };
  });
  expect(focusStyle.focusVisible, 'keyboard navigation should activate focus-visible styling').toBe(true);
  expect(focusStyle.outlineStyle).not.toBe('none');
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(2);
});


test('full backup can be exported, validated and restored without losing local data', async ({ page }) => {
  await prepare(page, { width: 1280, height: 720 }, 'light');
  await openNavItem(page, 'settings');
  const exportButton = page.getByRole('button', { name: 'Создать полную резервную копию' });
  const downloadPromise = page.waitForEvent('download');
  await exportButton.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^car-brother-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const path = await download.path();
  expect(path).toBeTruthy();
  const fs = await import('node:fs/promises');
  const content = await fs.readFile(path!, 'utf8');
  const backup = JSON.parse(content) as { app: string; schemaVersion: number; storageSchemaVersion: number; data: Record<string, string> };
  expect(backup.app).toBe('car-brother');
  expect(backup.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
  expect(backup.storageSchemaVersion).toBe(APP_STORAGE_SCHEMA_VERSION);
  expect(backup.data['car-brother-garage']).toBeTruthy();

  await page.evaluate(() => localStorage.setItem('backup-roundtrip-test', 'preserve-me'));
  const file = { name: 'roundtrip.json', mimeType: 'application/json', buffer: Buffer.from(content) };
  const fileInput = page.locator('input[type="file"][accept="application/json,.json"]');
  await openNavItem(page, 'settings');
  await fileInput.setInputFiles(file);
  await expect(page.getByText(/Файл проверен/)).toBeVisible();
  await page.getByLabel('Режим восстановления').selectOption('merge');
  await page.getByRole('button', { name: 'Подтвердить восстановление' }).click();
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('backup-roundtrip-test'))).toBe('preserve-me');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-garage'))).toBe(backup.data['car-brother-garage']);

  await openNavItem(page, 'settings');
  await fileInput.setInputFiles(file);
  await expect(page.getByText(/Файл проверен/)).toBeVisible();
  await page.getByLabel('Режим восстановления').selectOption('replace');
  await page.getByRole('button', { name: 'Подтвердить восстановление' }).click();
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('backup-roundtrip-test'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-garage'))).toBe(backup.data['car-brother-garage']);
});




test('legacy preferences are migrated and versioned per storage key', async ({ page }) => {
  await prepare(page, { width: 1280, height: 720 }, 'light');
  await page.evaluate(() => {
    localStorage.setItem('car-brother-preferences', JSON.stringify({ currency: 'USD', fuelUnit: 'mpg' }));
    localStorage.setItem('car-brother-storage-schema', '1');
    localStorage.removeItem('car-brother-preferences:schema-version');
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => {
    const raw = localStorage.getItem('car-brother-preferences');
    return raw ? JSON.parse(raw).autoTheme : null;
  })).toBe('system');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-preferences:schema-version'))).toBe(String(3));
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-preferences'))).toContain('"currency":"USD"');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-preferences'))).toContain('"fuelUnit":"mpg"');
});

test('legacy backup schema migrates without dropping data', async ({ page }) => {
  const legacyBackup = {
    app: 'car-brother',
    schemaVersion: 1,
    createdAt: '2026-01-01T12:00:00.000Z',
    data: {
      'legacy-migration-sentinel': 'keep-legacy-value',
      'car-brother-preferences': JSON.stringify({ currency: 'USD', fuelUnit: 'mpg' }),
    },
  };
  const migrated = migrateBackup(legacyBackup);
  expect(migrated).not.toBeNull();
  expect(migrated?.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
  expect(migrated?.storageSchemaVersion).toBe(APP_STORAGE_SCHEMA_VERSION);
  expect(migrated?.data['legacy-migration-sentinel']).toBe('keep-legacy-value');
  expect(migrated?.data['car-brother-storage-schema']).toBe(String(APP_STORAGE_SCHEMA_VERSION));

  await prepare(page, { width: 1280, height: 720 }, 'light');
  await openNavItem(page, 'settings');
  await page.locator('input[type="file"][accept="application/json,.json"]').setInputFiles({
    name: 'legacy-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(legacyBackup)),
  });
  await expect(page.getByText(/Файл проверен/)).toBeVisible();
  const reloadAfterRestore = page.waitForEvent('load');
  await page.getByRole('button', { name: 'Подтвердить восстановление' }).click();
  await reloadAfterRestore;
  await expect.poll(() => page.evaluate(() => localStorage.getItem('legacy-migration-sentinel'))).toBe('keep-legacy-value');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-storage-schema'))).toBe(String(APP_STORAGE_SCHEMA_VERSION));
  await page.reload();
  await expect.poll(() => page.evaluate(() => {
    const raw = localStorage.getItem('car-brother-preferences');
    return raw ? JSON.parse(raw).autoTheme : null;
  })).toBe('system');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-preferences:schema-version'))).toBe(String(APP_STORAGE_SCHEMA_VERSION));
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('car-brother-preferences') || '{}').currency)).toBe('USD');
});

test('backup migration rejects unknown schema versions and malformed storage entries', () => {
  const validLegacy = {
    app: 'car-brother',
    schemaVersion: 1,
    createdAt: '2026-01-01T12:00:00.000Z',
    data: { 'sentinel': 'value' },
  };
  expect(migrateBackup({ ...validLegacy, schemaVersion: 999 })).toBeNull();
  expect(migrateBackup({ ...validLegacy, data: { '   ': 'value' } })).toBeNull();
  expect(migrateBackup({ ...validLegacy, data: { sentinel: 123 } })).toBeNull();
});

test('invalid backup is rejected without modifying local data', async ({ page }) => {
  await prepare(page, { width: 1280, height: 720 }, 'light');
  await openNavItem(page, 'settings');
  await page.evaluate(() => localStorage.setItem('backup-validation-sentinel', 'keep-this-value'));

  const invalidBackup = {
    app: 'car-brother',
    schemaVersion: 1,
    createdAt: 'not-a-valid-date',
    data: { 'backup-validation-sentinel': 'overwritten' },
  };
  await page.locator('input[type="file"][accept="application/json,.json"]').setInputFiles({
    name: 'invalid-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(invalidBackup)),
  });

  await expect(page.getByRole('alert')).toContainText('Файл повреждён');
  await expect(page.getByRole('button', { name: 'Подтвердить восстановление' })).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('backup-validation-sentinel'))).toBe('keep-this-value');
});


test('failed backup restore rolls back all previously stored data', async ({ page }) => {
  await prepare(page, { width: 1280, height: 720 }, 'light');
  await openNavItem(page, 'settings');
  await page.evaluate(() => localStorage.setItem('restore-rollback-sentinel', 'original-value'));

  const backup = {
    app: 'car-brother',
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    data: {
      'restore-rollback-sentinel': 'overwritten-value',
      'restore-failure-trigger': 'boom',
    },
  };
  await page.locator('input[type="file"][accept="application/json,.json"]').setInputFiles({
    name: 'rollback-test.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await expect(page.getByText(/Файл проверен/)).toBeVisible();
  await page.getByLabel('Режим восстановления').selectOption('merge');

  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    let shouldFail = true;
    Storage.prototype.setItem = function (key: string, value: string) {
      if (shouldFail && key === 'restore-failure-trigger') {
        shouldFail = false;
        throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
      }
      originalSetItem.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Подтвердить восстановление' }).click();

  await expect(page.getByRole('alert')).toContainText('Предыдущие данные восстановлены');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('restore-rollback-sentinel'))).toBe('original-value');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('restore-failure-trigger'))).toBeNull();
});

test('fuel and logbook storage keys stay isolated per vehicle and preserve legacy keys', () => {
  const firstLogbook = getLogbookStorageKey('vehicle-one', true);
  const secondLogbook = getLogbookStorageKey('vehicle-two', false);
  const thirdLogbook = getLogbookStorageKey('vehicle-three', false);
  expect(firstLogbook).toBe(LEGACY_LOGBOOK_STORAGE_KEY);
  expect(new Set([firstLogbook, secondLogbook, thirdLogbook]).size).toBe(3);

  const firstOutlanderFuel = getFuelStorageKey('vehicle-one', true, true);
  const secondVehicleFuel = getFuelStorageKey('vehicle-two', false, false);
  const thirdVehicleFuel = getFuelStorageKey('vehicle-three', false, true);
  expect(firstOutlanderFuel).toBe(LEGACY_FUEL_STORAGE_KEY);
  expect(new Set([firstOutlanderFuel, secondVehicleFuel, thirdVehicleFuel]).size).toBe(3);
});

test('currency, fuel unit, theme and palette persist after reload', async ({ page }) => {
  await prepare(page, { width: 360, height: 800 }, 'light');
  await openNavItem(page, 'settings');

  await page.getByLabel('Валюта по умолчанию').selectOption('USD');
  await page.getByLabel('Расход топлива').selectOption('mpg');
  await page.getByLabel('Тема интерфейса').selectOption('dark');
  await page.getByRole('button', { name: /Чёрный \/ жёлтый/ }).click();

  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('car-brother-preferences') || '{}').currency)).toBe('USD');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('car-brother-preferences') || '{}').fuelUnit)).toBe('mpg');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-theme'))).toBe('dark');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-color-palette'))).toBe('black-yellow');

  await page.reload();
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
  await openNavItem(page, 'settings');
  await expect(page.getByLabel('Валюта по умолчанию')).toHaveValue('USD');
  await expect(page.getByLabel('Расход топлива')).toHaveValue('mpg');
  await expect(page.getByLabel('Тема интерфейса')).toHaveValue('dark');
  await expect(page.getByRole('button', { name: /Чёрный \/ жёлтый/ })).toHaveAttribute('aria-pressed', 'true');
});


test('maintenance intervals expose their verification level instead of implying OEM approval', async ({ page }) => {
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
    const selects = page.locator('main select');
    await selects.nth(0).selectOption({ value: 'mitsubishi' });
    await selects.nth(1).selectOption({ value: 'outlander-1' });
    const year = page.locator('main input[type="number"]').first();
    await year.fill((await year.getAttribute('min')) || '2003');
    await page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('car-brother-garage') || '')).toContain('outlander-1');
  }
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
  await openNavItem(page, 'maintenance');
  await expect(page.getByText(/Интервалы ниже — справочные/)).toBeVisible();
  await expect(page.getByText('Не подтверждено').first()).toBeVisible();
  await expect(page.getByText('Регламент подтверждён')).toHaveCount(0);
});


test('journal and fuel records survive switching between two active vehicles', async ({ page }) => {
  const firstVehicle = { id: 'test-car-one', brandId: 'mitsubishi', modelId: 'outlander-1', year: 2006, mileage: 120000, engine: '4G69', transmission: 'АКПП', drivetrain: '4WD', currency: 'RUB' };
  const secondVehicle = { ...firstVehicle, id: 'test-car-two', mileage: 90000 };
  const firstLog = [{ id: 'log-one', vehicleId: firstVehicle.id, currency: 'RUB', date: '2026-01-01', mileage: 120000, category: 'ТО', title: 'Запись первого автомобиля', costTotal: 1000 }];
  const secondLog = [{ id: 'log-two', vehicleId: secondVehicle.id, currency: 'RUB', date: '2026-02-01', mileage: 90000, category: 'ТО', title: 'Запись второго автомобиля', costTotal: 2000 }];
  const firstFuel = [{ id: 'fuel-one', vehicleId: firstVehicle.id, currency: 'RUB', date: '2026-01-02', odometer: 120100, distance: 400, liters: 40, pricePerLiter: 60, totalCost: 2400, consumption: 10, fuelType: 'АИ-95', station: 'АЗС первого авто' }];
  const secondFuel = [{ id: 'fuel-two', vehicleId: secondVehicle.id, currency: 'RUB', date: '2026-02-02', odometer: 90100, distance: 300, liters: 30, pricePerLiter: 61, totalCost: 1830, consumption: 10, fuelType: 'АИ-95', station: 'АЗС второго авто' }];
  await page.addInitScript(({ firstVehicle, secondVehicle, firstLog, secondLog, firstFuel, secondFuel }) => {
    localStorage.clear();
    sessionStorage.setItem('__car_brother_smoke_initialized', 'yes');
    localStorage.setItem('car-brother-profile-selected-v1', 'yes');
    localStorage.setItem('car-brother-garage', JSON.stringify({ vehicles: [firstVehicle, secondVehicle], activeVehicleId: firstVehicle.id }));
    localStorage.setItem('outlander1_garage_logbook_v1', JSON.stringify(firstLog));
    localStorage.setItem('car-brother-logbook-' + secondVehicle.id, JSON.stringify(secondLog));
    localStorage.setItem('outlander1_fuel_logs_v2', JSON.stringify(firstFuel));
    localStorage.setItem('car-brother-fuel-logs-' + secondVehicle.id, JSON.stringify(secondFuel));
  }, { firstVehicle, secondVehicle, firstLog, secondLog, firstFuel, secondFuel });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  const orientationHeading = page.getByRole('heading', { name: /Выберите ориентацию экрана/i });
  if (await orientationHeading.isVisible().catch(() => false)) await page.getByRole('button', { name: /Телефон/i }).click();
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });

  await openNavItem(page, 'logbook');
  await expect(page.getByText('Запись первого автомобиля')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('outlander1_garage_logbook_v1') || '[]').length)).toBe(1);

  await openNavItem(page, 'garage');
  await page.getByRole('button', { name: 'Сделать активной' }).nth(1).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('car-brother-garage') || '{"activeVehicleId":""}').activeVehicleId)).toBe(secondVehicle.id);
  await openNavItem(page, 'logbook');
  await expect(page.getByText('Запись второго автомобиля')).toBeVisible();
  await expect(page.getByText('Запись первого автомобиля')).toHaveCount(0);

  await openNavItem(page, 'fuel');
  await expect(page.getByText('АЗС второго авто')).toBeVisible();
  await expect(page.getByText('АЗС первого авто')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('car-brother-logbook-test-car-two') || '[]')[0]?.title)).toBe('Запись второго автомобиля');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('car-brother-fuel-logs-test-car-two') || '[]')[0]?.station)).toBe('АЗС второго авто');
});


test('axe accessibility audit covers core screens', async ({ page }) => {
  test.setTimeout(120_000);
  await prepare(page, { width: 1280, height: 720 }, 'light');
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js' });
  const audit = async (screen: string) => {
    const violations = await page.evaluate(async () => {
      const axeWindow = window as Window & { axe?: { run: (context: Document, options: { runOnly: { type: 'tag'; values: string[] }; rules: { 'color-contrast': { enabled: boolean } } }) => Promise<{ violations: Array<{ id: string; impact: string | null; help: string; nodes: Array<{ target: string[]; html: string; failureSummary?: string | null; any: Array<{ data?: unknown }> }> }> }> } };
      if (!axeWindow.axe) throw new Error('axe-core did not load');
      const report = await axeWindow.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, rules: { 'color-contrast': { enabled: false } } });
      return report.violations.map(item => ({ id: item.id, impact: item.impact, help: item.help, targets: item.nodes.slice(0, 5).map(node => ({ target: node.target, html: node.html.slice(0, 220), failureSummary: node.failureSummary, checks: node.any.map(check => check.data) })) }));
    });
    expect(violations, 'axe violations on ' + screen + ': ' + JSON.stringify(violations)).toEqual([]);
  };
  for (const section of ['overview', 'garage', 'fuel', 'settings', 'brands']) {
    if (section !== 'overview') await openNavItem(page, section);
    await audit(section);
  }
});

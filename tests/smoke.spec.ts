import { expect, test, type Page } from '@playwright/test';

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
      expect(content, brandId + ' must not show Outlander/4G6x data in ' + sectionId).not.toMatch(/Outlander|4G6x/i);
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
      expect(content, 'Mitsubishi Lancer must not inherit Outlander/4G6x data in ' + sectionId).not.toMatch(/Outlander|4G6x/i);
    }
    if (technicalSections.includes(sectionId)) {
      await expect(page.getByTestId('vehicle-data-empty-state'), 'Mitsubishi Lancer must show an explicit empty state in ' + sectionId).toBeVisible();
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
          expect(await page.locator('main').innerText(), 'selected Toyota must not inherit Outlander/4G6x copy in section ' + sectionId).not.toMatch(/Outlander|4G6x/i);
          if (['specs', 'bulbs', 'parts', 'fuses', 'tuning', 'guides', 'issues', 'wheels', 'maintenance', 'obd', 'logbook'].includes(sectionId)) {
            await expect(page.getByTestId('vehicle-data-empty-state')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Данные для этой модели ещё не проверены' })).toBeVisible();
          }
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

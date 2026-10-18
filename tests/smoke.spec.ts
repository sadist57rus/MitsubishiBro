import { expect, test, type Page } from '@playwright/test';

type Viewport = { width: number; height: number };
type Theme = 'light' | 'dark';

const viewports: Viewport[] = [
  { width: 360, height: 800 },
  { width: 800, height: 480 },
  { width: 1280, height: 720 },
];
const themes: Theme[] = ['light', 'dark'];

const sectionGroups: { name: string; sections: RegExp[] }[] = [
  { name: 'core-and-catalog', sections: [/Главная/i, /Гараж/i, /Настройки/i, /Авто Японии|Марки и модели/i] },
  { name: 'vehicle-data', sections: [/Мониторинг топлива|Топливо/i, /Размеры и ТТХ|Характеристики/i, /Лампы и автосвет|Лампы/i, /Запчасти/i] },
  { name: 'maintenance', sections: [/Предохранители/i, /Тюнинг/i, /Ремонт/i, /Болячки|Типичные неисправности/i] },
  { name: 'tools-and-records', sections: [/Диски и шины/i, /Регламент ТО|Техническое обслуживание/i, /Ошибки OBD/i, /Бортжурнал/i] },
];

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
    const toyotaValue = await brand.locator('option').evaluateAll(options => {
      const match = options.find(option => /toyota|тойота/i.test(option.textContent || ''));
      return match?.getAttribute('value') || '';
    });
    expect(toyotaValue, 'Toyota must exist in the shared catalog').not.toBe('');
    await brand.selectOption(toyotaValue);
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

async function assertReadableAndTouchSafe(page: Page, label: string) {
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
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.left < 0 || r.right > window.innerWidth);
    }).map(el => ({ text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 70), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) }));
    return { smallTargets, smallText, headerOverflow };
  });
  expect(violations.smallTargets, label + ': interactive targets smaller than 44x44: ' + JSON.stringify(violations.smallTargets)).toEqual([]);
  expect(violations.smallText, label + ': visible text smaller than 12px: ' + JSON.stringify(violations.smallText)).toEqual([]);
  expect(violations.headerOverflow, label + ': header controls outside viewport: ' + JSON.stringify(violations.headerOverflow)).toEqual([]);
}

async function openNavItem(page: Page, label: RegExp) {
  const menu = page.getByRole('button', { name: /Открыть разделы приложения/i });
  await expect(menu).toBeVisible();
  await menu.click();
  const panel = page.getByTestId('section-menu-list');
  const item = panel.getByRole('button', { name: label }).first();
  await expect(item).toBeVisible({ timeout: 5_000 });
  await item.getByText(label).first().click();
}

for (const viewport of viewports) {
  for (const theme of themes) {
    const suffix = viewport.width + 'x' + viewport.height + ', ' + theme;

    test('home, garage and settings accessibility: ' + suffix, async ({ page }) => {
      const consoleErrors = await prepare(page, viewport, theme);
      await assertReadableAndTouchSafe(page, 'home');
      await openNavItem(page, /Гараж/i);
      await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
      await assertReadableAndTouchSafe(page, 'garage');

      await page.getByRole('button', { name: /Добавить машину/i }).click();
      const brand = page.locator('form select').first();
      const toyotaValue = await brand.locator('option').evaluateAll(options => {
        const match = options.find(option => /toyota|тойота/i.test(option.textContent || ''));
        return match?.getAttribute('value') || '';
      });
      await brand.selectOption(toyotaValue);
      const modelValues = await page.locator('form select').nth(1).locator('option').evaluateAll(options => options.map(option => option.getAttribute('value')));
      expect(new Set(modelValues).size, 'model ids in the garage selector must be unique').toBe(modelValues.length);
      const modelLabels = await page.locator('form select').nth(1).locator('option').evaluateAll(options => options.map(option => (option.textContent || '').trim().toLocaleLowerCase('ru-RU')));
      expect(new Set(modelLabels).size, 'model names and years in the garage selector must be unique').toBe(modelLabels.length);
      await page.getByRole('button', { name: /Отмена/i }).click();

      await page.reload();
      await openNavItem(page, /Настройки/i);
      await expect(page.getByRole('heading', { name: /Настройки/i })).toBeVisible();
      await assertReadableAndTouchSafe(page, 'settings');
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });

    for (const group of sectionGroups) {
      test('section group ' + group.name + ': ' + suffix, async ({ page }) => {
        const consoleErrors = await prepare(page, viewport, theme);
        for (const section of group.sections) {
          await openNavItem(page, section);
          expect(await page.locator('body').innerText(), 'selected Toyota should not inherit Outlander copy in section ' + section).not.toMatch(/Outlander/i);
          await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        }
        expect(consoleErrors, 'browser console/page errors').toEqual([]);
      });
    }

    test('dialogs and brand-specific copy: ' + suffix, async ({ page }) => {
      const consoleErrors = await prepare(page, viewport, theme);

      const sectionMenu = page.getByRole('button', { name: /Открыть разделы приложения/i });
      await sectionMenu.focus();
      await sectionMenu.press('Enter');
      const settingsItem = page.getByTestId('section-menu-list').locator('[role="button"]').filter({ hasText: /^Настройки/ }).first();
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

      const brandTrigger = page.getByRole('button', { name: /Выбрать марку автомобиля/i });
      for (const brand of [
        { name: 'Nissan', label: /Ниссан.*Nissan|Nissan.*Ниссан/i },
        { name: 'Honda', label: /Хонда.*Honda|Honda.*Хонда/i },
      ]) {
        await brandTrigger.click();
        await expect(page.getByRole('region', { name: 'Выбор марки автомобиля' })).toBeVisible();
        await page.getByRole('button', { name: brand.label }).click();
        const sectionMenuButton = page.getByRole('button', { name: /Открыть разделы приложения/i });
        await sectionMenuButton.click();
        const sectionMenuText = await page.getByTestId('section-menu-list').innerText();
        expect(sectionMenuText, brand.name + ' section menu must be vehicle-neutral').not.toMatch(/Outlander/i);
        const fuelItem = page.getByTestId('section-menu-list').getByRole('button', { name: /Топливо/i }).first();
        await fuelItem.getByText(/Топливо/i).first().click();
        expect(await page.locator('body').innerText(), brand.name + ' fuel section must not show Outlander-specific copy').not.toMatch(/Outlander/i);
      }
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });
  }
}

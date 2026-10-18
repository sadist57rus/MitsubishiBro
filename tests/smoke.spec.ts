import { expect, test, type Page } from '@playwright/test';

async function chooseToyota(page: Page) {
  await page.goto('/');
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
  }
  await expect(page.getByText(/Car Brother/i).first()).toBeVisible({ timeout: 15_000 });
}

async function openNavItem(page: Page, label: RegExp) {
  let item = page.getByRole('button', { name: label }).first();
  if (!(await item.isVisible().catch(() => false))) {
    const menu = page.getByRole('button', { name: /Разделы|Меню/i }).first();
    if (await menu.isVisible().catch(() => false)) await menu.click();
    item = page.getByRole('button', { name: label }).first();
  }
  await expect(item).toBeVisible({ timeout: 5_000 });
  await item.click();
}

for (const viewport of [{ width: 360, height: 800 }, { width: 800, height: 480 }, { width: 1280, height: 720 }]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`stage 1 smoke: ${viewport.width}x${viewport.height}, ${theme}`, async ({ page }) => {
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

      const sections: RegExp[] = [
        /Домой|Главная/i, /Гараж/i, /Настройки/i, /Марки|Авто Японии/i,
        /Топливо|Fuel/i, /Характеристики/i, /Лампы|Автосвет/i, /Запчасти/i,
        /Предохранители/i, /Тюнинг/i, /Ремонт/i, /Неисправности/i,
        /Колёса|Диски/i, /ТО|Обслуживание/i, /OBD|Диагностика/i, /Журнал|Бортжурнал/i,
      ];
      for (const section of sections) {
        await openNavItem(page, section);
        expect(await page.locator('body').innerText(), `selected Toyota should not inherit Outlander copy in section ${section}`).not.toMatch(/Outlander/i);
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }

      await openNavItem(page, /Гараж/i);
      await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
      await page.getByRole('button', { name: /Добавить машину/i }).click();
      const brand = page.locator('form select').first();
      const toyotaValue = await brand.locator('option').evaluateAll(options => {
        const match = options.find(option => /toyota|тойота/i.test(option.textContent || ''));
        return match?.getAttribute('value') || '';
      });
      await brand.selectOption(toyotaValue);
      const modelValues = await page.locator('form select').nth(1).locator('option').evaluateAll(options => options.map(option => option.getAttribute('value')));
      expect(new Set(modelValues).size, 'model ids in the garage selector must be unique').toBe(modelValues.length);

      await page.getByRole('button', { name: /Отмена/i }).click();
      await page.reload();
      await openNavItem(page, /Гараж/i);
      await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
      const garage = await page.evaluate(() => localStorage.getItem('car-brother-garage') || '');
      expect(garage).toContain('toyota');

      await openNavItem(page, /Настройки/i);
      await expect(page.getByText(/Настройки/i).first()).toBeVisible();
      expect(consoleErrors, 'browser console/page errors').toEqual([]);
    });
  }
}

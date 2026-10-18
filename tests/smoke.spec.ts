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

      await openNavItem(page, /Топливо|Fuel/i);
      await expect(page.getByText(/Расходы на топливо/i)).toBeVisible();
      expect(await page.locator('body').innerText()).not.toMatch(/Outlander/i);

      await openNavItem(page, /Гараж/i);
      await expect(page.getByRole('heading', { name: 'Гараж' })).toBeVisible();
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

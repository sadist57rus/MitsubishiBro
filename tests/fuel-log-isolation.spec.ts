import { expect, test, type Page } from '@playwright/test';

async function startWithToyota(page: Page) {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__car_brother_smoke_initialized')) {
      localStorage.clear();
      sessionStorage.setItem('__car_brother_smoke_initialized', 'yes');
    }
  });
  await page.goto('/');
  const orientation = page.getByRole('heading', { name: /Выберите ориентацию экрана/i });
  if (await orientation.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /Телефон/i }).click();
  }
  const setup = page.getByRole('heading', { name: /Добавим вашу машину/i });
  if (await setup.isVisible().catch(() => false)) {
    await page.locator('select').first().selectOption({ value: 'toyota' });
    await page.getByRole('button', { name: /Сохранить автомобиль и открыть приложение/i }).click();
  }
  await expect(page.getByTestId('section-menu-trigger')).toBeVisible();
}

async function openSection(page: Page, id: string) {
  await page.getByTestId('section-menu-trigger').click();
  const item = page.getByTestId('nav-item-' + id);
  await expect(item).toBeVisible();
  await item.locator('span').first().click();
}

async function addFuelRecord(page: Page, station: string, odometer: string) {
  await page.getByRole('button', { name: /Записать заправку/i }).click();
  const form = page.locator('form').filter({ has: page.getByPlaceholder('Лукойл, Роснефть...') });
  await form.getByPlaceholder(/^246250$/).fill(odometer);
  await form.getByPlaceholder(/^450$/).fill('420');
  await form.getByPlaceholder(/^50$/).fill('45');
  await form.getByPlaceholder(/^62\.50$/).fill('60');
  await form.getByPlaceholder('Лукойл, Роснефть...').fill(station);
  await form.getByRole('button', { name: /^Сохранить$/i }).click();
  await expect(page.getByText(station, { exact: false })).toBeVisible();
}

test('журнал заправок изолирован по автомобилям и переживает переключение и перезагрузку', async ({ page }) => {
  test.setTimeout(90_000);
  await startWithToyota(page);
  await openSection(page, 'fuel');
  const toyotaStation = 'ТЕСТ-АЗС-ТОЙОТА';
  await addFuelRecord(page, toyotaStation, '246500');

  await openSection(page, 'garage');
  await page.getByRole('button', { name: /Добавить машину/i }).click();
  await page.locator('form select').first().selectOption({ value: 'nissan' });
  await page.getByRole('button', { name: /^Сохранить$/i }).click();

  await openSection(page, 'fuel');
  await expect(page.getByText(toyotaStation, { exact: false })).toHaveCount(0);
  const nissanStation = 'ТЕСТ-АЗС-НИССАН';
  await addFuelRecord(page, nissanStation, '198400');

  await openSection(page, 'garage');
  await page.locator('article').first().getByRole('button', { name: 'Сделать активной' }).click();
  await openSection(page, 'fuel');
  await expect(page.getByText(toyotaStation, { exact: false })).toBeVisible();
  await expect(page.getByText(nissanStation, { exact: false })).toHaveCount(0);

  await page.reload();
  await openSection(page, 'fuel');
  await expect(page.getByText(toyotaStation, { exact: false })).toBeVisible();
  await expect(page.getByText(nissanStation, { exact: false })).toHaveCount(0);

  await openSection(page, 'garage');
  await page.locator('article').nth(1).getByRole('button', { name: 'Сделать активной' }).click();
  await openSection(page, 'fuel');
  await expect(page.getByText(nissanStation, { exact: false })).toBeVisible();
  await expect(page.getByText(toyotaStation, { exact: false })).toHaveCount(0);
});

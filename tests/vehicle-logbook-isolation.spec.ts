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
  await item.click();
  if (id === 'logbook') {
    await expect(page.getByRole('heading', { name: /Бортжурнал владельца/i })).toBeVisible();
  } else if (id === 'garage') {
    await expect(page.getByRole('heading', { name: /Гараж/i })).toBeVisible();
  }
}

async function addLogbookEntry(page: Page, title: string) {
  await page.getByRole('button', { name: /Добавить запись/i }).click();
  await page.getByPlaceholder(/Например: Замена масла ДВС/i).fill(title);
  await page.getByRole('button', { name: /Сохранить запись/i }).click();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
}

test('бортжурнал сохраняет записи отдельно для каждого автомобиля при переключении и перезагрузке', async ({ page }) => {
  test.setTimeout(90_000);
  await startWithToyota(page);
  await openSection(page, 'logbook');
  const toyotaEntry = 'Проверка журнала Toyota — уникальная запись';
  await addLogbookEntry(page, toyotaEntry);

  await openSection(page, 'garage');
  await page.getByRole('button', { name: /Добавить машину/i }).click();
  await page.locator('form select').first().selectOption({ value: 'nissan' });
  await page.getByRole('button', { name: /^Сохранить$/i }).click();

  await openSection(page, 'logbook');
  await expect(page.getByText(toyotaEntry, { exact: true })).toHaveCount(0);
  const nissanEntry = 'Проверка журнала Nissan — отдельная запись';
  await addLogbookEntry(page, nissanEntry);

  await openSection(page, 'garage');
  await page.locator('article').first().getByRole('button', { name: 'Сделать активной' }).click();
  await openSection(page, 'logbook');
  await expect(page.getByText(toyotaEntry, { exact: true })).toBeVisible();
  await expect(page.getByText(nissanEntry, { exact: true })).toHaveCount(0);

  await page.reload();
  await openSection(page, 'logbook');
  await expect(page.getByText(toyotaEntry, { exact: true })).toBeVisible();
  await expect(page.getByText(nissanEntry, { exact: true })).toHaveCount(0);

  await openSection(page, 'garage');
  await page.locator('article').nth(1).getByRole('button', { name: 'Сделать активной' }).click();
  await openSection(page, 'logbook');
  await expect(page.getByText(nissanEntry, { exact: true })).toBeVisible();
  await expect(page.getByText(toyotaEntry, { exact: true })).toHaveCount(0);
});

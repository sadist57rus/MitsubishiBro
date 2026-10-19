import { expect, test, type Page } from '@playwright/test';

type LogRecord = {
  id: string;
  vehicleId?: string;
  currency?: string;
  date: string;
  mileage: number;
  category: string;
  title: string;
  costTotal: number;
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

async function seedLogbook(page: Page, records: LogRecord[]) {
  const storageKey = await page.evaluate((seed) => {
    const raw = localStorage.getItem('car-brother-garage');
    if (!raw) throw new Error('Garage state was not saved during onboarding');
    const garage = JSON.parse(raw) as { vehicles: { id: string }[]; activeVehicleId: string };
    const firstVehicleId = garage.vehicles[0]?.id;
    const key = garage.activeVehicleId === firstVehicleId
      ? 'outlander1_garage_logbook_v1'
      : 'car-brother-logbook-' + garage.activeVehicleId;
    localStorage.setItem(key, JSON.stringify(seed));
    return key;
  }, records);
  await page.reload();
  return storageKey;
}

async function openLogbook(page: Page) {
  await page.getByRole('button', { name: /Открыть разделы приложения/i }).click();
  const item = page.getByTestId('section-menu-list').getByRole('button', { name: /Бортжурнал/i }).first();
  await expect(item).toBeVisible({ timeout: 5_000 });
  await item.getByText(/Бортжурнал/i).first().click();
  await expect(page.getByRole('heading', { name: /Бортжурнал владельца/ })).toBeVisible();
}

const existingRecord: LogRecord = {
  id: 'existing-record',
  date: '2026-10-01',
  mileage: 100000,
  category: 'Плановое ТО',
  title: 'Существующая запись — оставить',
  costTotal: 1200,
};

const importedRecord: LogRecord = {
  id: 'foreign-record',
  vehicleId: 'vehicle-from-another-garage',
  date: '2026-10-02',
  mileage: 101000,
  category: 'Двигатель и ГРМ',
  title: 'Импортированная запись с чужой привязкой',
  costTotal: 3400,
};

test('импорт по умолчанию добавляет новые записи, пропускает совпадающие ID и сохраняет чужой vehicleId', async ({ page }) => {
  await chooseToyota(page);
  const storageKey = await seedLogbook(page, [existingRecord]);
  await openLogbook(page);

  const fileRecords = [
    { ...existingRecord, title: 'Не должна заменить существующую запись' },
    importedRecord,
  ];
  await page.locator('input[type="file"][accept=".json"]').setInputFiles({
    name: 'logbook-import.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(fileRecords)),
  });

  const dialog = page.getByRole('dialog', { name: /Импорт бортжурнала/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('2 записей', { exact: true })).toBeVisible();
  await expect(dialog.getByText('1 записей', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('radio', { name: /Добавить к существующим/i })).toBeChecked();
  await expect(dialog.getByText(/vehicle-from-another-garage/)).toBeVisible();
  await dialog.getByRole('button', { name: /Подтвердить импорт/i }).click();

  await expect(page.getByText(/добавлено записей — 1; пропущено записей с повторяющимися ID — 1/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Существующая запись — оставить' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Импортированная запись с чужой привязкой' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Не должна заменить существующую запись' })).toHaveCount(0);
  await expect.poll(() => page.evaluate(key => {
    const entries = JSON.parse(localStorage.getItem(key) || '[]') as LogRecord[];
    return entries.find(entry => entry.id === 'foreign-record')?.vehicleId || '';
  }, storageKey)).toBe('vehicle-from-another-garage');
});

test('режим «Заменить все записи» действительно заменяет текущий журнал после подтверждения', async ({ page }) => {
  await chooseToyota(page);
  await seedLogbook(page, [existingRecord]);
  await openLogbook(page);

  await page.locator('input[type="file"][accept=".json"]').setInputFiles({
    name: 'replacement.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([{ ...importedRecord, vehicleId: undefined }])),
  });

  const dialog = page.getByRole('dialog', { name: /Импорт бортжурнала/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('radio', { name: /Заменить все записи/i }).check();
  await dialog.getByRole('button', { name: /Подтвердить импорт/i }).click();

  await expect(page.getByText(/заменено записей — 1/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Импортированная запись с чужой привязкой' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Существующая запись — оставить' })).toHaveCount(0);
});

export const LEGACY_LOGBOOK_STORAGE_KEY = 'outlander1_garage_logbook_v1';
export const LEGACY_FUEL_STORAGE_KEY = 'outlander1_fuel_logs_v2';

export function getLogbookStorageKey(vehicleId: string, isFirstVehicle: boolean, isOutlanderOne: boolean): string {
  return isFirstVehicle && isOutlanderOne ? LEGACY_LOGBOOK_STORAGE_KEY : 'car-brother-logbook-' + vehicleId;
}

export function getFuelStorageKey(vehicleId: string, isFirstVehicle: boolean, isOutlanderOne: boolean): string {
  return isFirstVehicle && isOutlanderOne ? LEGACY_FUEL_STORAGE_KEY : 'car-brother-fuel-logs-' + vehicleId;
}

import { isRecord } from './storage';

export const BACKUP_SCHEMA_VERSION = 2;
export const APP_STORAGE_SCHEMA_VERSION = 3;

export type BackupPayload = {
  app: 'car-brother';
  schemaVersion: number;
  createdAt: string;
  storageSchemaVersion: number;
  data: Record<string, string>;
};

function hasValidData(value: Record<string, unknown>): value is Record<string, string> {
  return Object.entries(value).every(([key, item]) => key.trim().length > 0 && typeof item === 'string');
}

export function migrateBackup(value: unknown): BackupPayload | null {
  if (
    !isRecord(value) ||
    value.app !== 'car-brother' ||
    typeof value.schemaVersion !== 'number' ||
    typeof value.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    !isRecord(value.data) ||
    !hasValidData(value.data)
  ) return null;

  if (value.schemaVersion === 1) {
    return {
      app: 'car-brother',
      schemaVersion: BACKUP_SCHEMA_VERSION,
      createdAt: value.createdAt,
      storageSchemaVersion: APP_STORAGE_SCHEMA_VERSION,
      data: { ...value.data, 'car-brother-storage-schema': String(APP_STORAGE_SCHEMA_VERSION) },
    };
  }

  if (
    value.schemaVersion === BACKUP_SCHEMA_VERSION &&
    value.storageSchemaVersion === APP_STORAGE_SCHEMA_VERSION
  ) {
    return {
      app: 'car-brother',
      schemaVersion: BACKUP_SCHEMA_VERSION,
      createdAt: value.createdAt,
      storageSchemaVersion: APP_STORAGE_SCHEMA_VERSION,
      data: value.data,
    };
  }

  return null;
}

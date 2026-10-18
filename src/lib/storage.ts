export const STORAGE_SCHEMA_VERSION = 3;
const VERSION_KEY = 'car-brother-storage-schema';
type Guard<T> = (value: unknown) => value is T;
type Migration = (value: unknown) => unknown;
const migrations: Record<number, Migration> = { 1: value => value, 2: value => value };
function safeStorage(): Storage | null { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } }
export function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
export function migrateValue(value: unknown, fromVersion: number): unknown { let current=value; for(let version=fromVersion;version<STORAGE_SCHEMA_VERSION;version++){const migration=migrations[version];if(!migration)throw new Error('Missing storage migration from schema '+version);current=migration(current);}return current; }
export function readStored<T>(key:string,guard:Guard<T>,fallback:T):T { const storage=safeStorage();if(!storage)return fallback;try{const raw=storage.getItem(key);if(raw===null)return fallback;const parsed:unknown=JSON.parse(raw);const versionRaw=storage.getItem(VERSION_KEY);const version=versionRaw===null?1:Number(versionRaw);if(!Number.isInteger(version)||version<1||version>STORAGE_SCHEMA_VERSION)return fallback;const migrated=migrateValue(parsed,version);return guard(migrated)?migrated:fallback;}catch(error){console.warn('Could not read stored value:',key,error);return fallback;} }
export function writeStored<T>(key:string,value:T,guard:Guard<T>):boolean {const storage=safeStorage();if(!storage||!guard(value))return false;try{storage.setItem(key,JSON.stringify(value));storage.setItem(VERSION_KEY,String(STORAGE_SCHEMA_VERSION));return true;}catch(error){console.warn('Could not persist stored value:',key,error);return false;}}
export function parseValidatedJson<T>(text:string,guard:Guard<T>):T {const parsed:unknown=JSON.parse(text);if(!guard(parsed))throw new Error('JSON does not match the expected schema');return parsed;}
export function removeStored(key:string):void {try{safeStorage()?.removeItem(key);}catch(error){console.warn('Could not remove stored value:',key,error);}}
export function parseDecimalInput(value:string):number|null {const normalized=value.trim().replace(/\s/g,'').replace(',','.');if(!normalized||!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized))return null;const number=Number(normalized);return Number.isFinite(number)?number:null;}

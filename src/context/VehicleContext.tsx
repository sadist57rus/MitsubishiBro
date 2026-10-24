import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { JAPANESE_BRANDS } from '../data/vehicleCatalog';
import { readStored, writeStored } from '../lib/storage';
import type { EngineType, DrivetrainType } from '../types';

export interface GarageVehicle {
  id: string; brandId: string; modelId: string; year: number; color?: string; vin?: string;
  mileage: number; engine: string; transmission?: string; drivetrain: DrivetrainType; currency: string;
}
interface GarageState { vehicles: GarageVehicle[]; activeVehicleId: string; }
interface VehicleContextValue {
  vehicleId: string; activeVehicle: GarageVehicle; vehicles: GarageVehicle[];
  brandId: string; modelId: string; engine: EngineType; drivetrain: DrivetrainType;
  setBrandId: (brandId: string) => void; setModelId: (modelId: string) => void;
  setEngine: (engine: EngineType) => void; setDrivetrain: (drivetrain: DrivetrainType) => void;
  selectVehicle: (brandId: string, modelId: string) => void;
  addVehicle: (vehicle: Omit<GarageVehicle,'id'>) => void;
  updateVehicle: (vehicle: GarageVehicle) => void; removeVehicle: (id: string) => void; setActiveVehicle: (id: string) => void;
}
const GARAGE_KEY='car-brother-garage';
const OLD_KEY='car-brother-vehicle';
const DEFAULT_VEHICLE: GarageVehicle={id:'vehicle-default',brandId:'mitsubishi',modelId:'outlander-1',year:2006,mileage:0,engine:'4G69',transmission:'не указана',drivetrain:'4WD',currency:'RUB'};
type LegacyVehicle = Partial<Pick<GarageVehicle, 'brandId' | 'modelId' | 'engine' | 'transmission' | 'drivetrain'>>;
function validLegacyVehicle(value: unknown): value is LegacyVehicle {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return (item.brandId === undefined || typeof item.brandId === 'string') &&
    (item.modelId === undefined || typeof item.modelId === 'string') &&
    (item.engine === undefined || typeof item.engine === 'string') &&
    (item.transmission === undefined || typeof item.transmission === 'string') &&
    (item.drivetrain === undefined || ['4WD', 'FWD', 'ALL'].includes(String(item.drivetrain)));
}
const GarageContext=createContext<VehicleContextValue|null>(null);
function validVehicle(v: unknown): v is GarageVehicle {
  if(!v||typeof v!=='object')return false; const x=v as Record<string,unknown>;
  const brand=JAPANESE_BRANDS.find(b=>b.id===x.brandId);
  return typeof x.id==='string'&&typeof x.brandId==='string'&&!!brand&&typeof x.modelId==='string'&&brand.models.some(m=>m.id===x.modelId)&&Number.isInteger(x.year)&&typeof x.mileage==='number'&&Number.isFinite(x.mileage)&&x.mileage>=0&&typeof x.engine==='string'&&['4WD','FWD','ALL'].includes(String(x.drivetrain))&&typeof x.currency==='string';
}
function initialGarage(): GarageState {
  const saved=readStored<GarageState>(GARAGE_KEY,(v):v is GarageState=>!!v&&typeof v==='object'&&Array.isArray((v as GarageState).vehicles)&&(v as GarageState).vehicles.every(validVehicle)&&typeof (v as GarageState).activeVehicleId==='string',{vehicles:[],activeVehicleId:''});
  // Migrate the old hard-coded starter vehicle out of the garage so onboarding asks the owner to choose their own car.
  const savedVehicles = saved.vehicles.filter(v => !(v.id === 'vehicle-default' && v.brandId === 'mitsubishi' && v.modelId === 'outlander-1'));
  if(savedVehicles.length) return {vehicles:savedVehicles,activeVehicleId:savedVehicles.some(v=>v.id===saved.activeVehicleId)?saved.activeVehicleId:savedVehicles[0].id};
  const legacy = readStored<LegacyVehicle>(OLD_KEY, validLegacyVehicle, {});
  // Fresh installs start with an empty garage so the owner chooses their own vehicle.
  if (!Object.keys(legacy).length) return {vehicles:[],activeVehicleId:''};
  const brand=JAPANESE_BRANDS.find(b=>b.id===legacy.brandId)||JAPANESE_BRANDS.find(b=>b.id===DEFAULT_VEHICLE.brandId)!;
  const model=brand.models.find(m=>m.id===legacy.modelId)||brand.models[0];
  const first:GarageVehicle={...DEFAULT_VEHICLE,id:'vehicle-'+Date.now(),brandId:brand.id,modelId:model.id,engine:typeof legacy.engine==='string'?legacy.engine:DEFAULT_VEHICLE.engine,transmission:typeof legacy.transmission==='string'?legacy.transmission:'не указана',drivetrain:legacy.drivetrain==='FWD'||legacy.drivetrain==='ALL'?legacy.drivetrain:'4WD'};
  return {vehicles:[first],activeVehicleId:first.id};
}
export function VehicleProvider({children}:{children:ReactNode}) {
 const [garage,setGarage]=useState<GarageState>(initialGarage);
 useEffect(()=>{writeStored(GARAGE_KEY,garage,(v):v is GarageState=>!!v&&typeof v==='object'&&Array.isArray((v as GarageState).vehicles)&&(v as GarageState).vehicles.every(validVehicle)&&typeof (v as GarageState).activeVehicleId==='string');},[garage]);
 const activeVehicle=garage.vehicles.find(v=>v.id===garage.activeVehicleId)||garage.vehicles[0]||DEFAULT_VEHICLE;
 const value=useMemo<VehicleContextValue>(()=>({
  vehicleId:activeVehicle.id,activeVehicle,vehicles:garage.vehicles,brandId:activeVehicle.brandId,modelId:activeVehicle.modelId,
  engine:activeVehicle.engine as EngineType,drivetrain:activeVehicle.drivetrain,
  setBrandId:(brandId)=>{const brand=JAPANESE_BRANDS.find(b=>b.id===brandId);if(!brand)return;setGarage(g=>({...g,vehicles:g.vehicles.map(v=>v.id===g.activeVehicleId?{...v,brandId,modelId:brand.models[0].id,engine:brand.models[0].engines[0]?.code || v.engine}:v)}));},
  setModelId:(modelId)=>{const brand=JAPANESE_BRANDS.find(b=>b.models.some(m=>m.id===modelId));if(brand)setGarage(g=>({...g,vehicles:g.vehicles.map(v=>v.id===g.activeVehicleId?{...v,brandId:brand.id,modelId,engine:brand.models.find(m=>m.id===modelId)?.engines[0]?.code || v.engine}:v)}));},
  setEngine:(engine)=>setGarage(g=>({...g,vehicles:g.vehicles.map(v=>v.id===g.activeVehicleId?{...v,engine}:v)})),
  setDrivetrain:(drivetrain)=>setGarage(g=>({...g,vehicles:g.vehicles.map(v=>v.id===g.activeVehicleId?{...v,drivetrain}:v)})),
  selectVehicle:(brandId,modelId)=>{const brand=JAPANESE_BRANDS.find(b=>b.id===brandId);if(brand?.models.some(m=>m.id===modelId))setGarage(g=>({...g,vehicles:g.vehicles.map(v=>v.id===g.activeVehicleId?{...v,brandId,modelId,engine:brand.models.find(m=>m.id===modelId)?.engines[0]?.code || v.engine}:v)}));},
  addVehicle:(v)=>{const vehicle:GarageVehicle={...v,id:'vehicle-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)};setGarage(g=>({vehicles:[...g.vehicles,vehicle],activeVehicleId:vehicle.id}));},
  updateVehicle:(vehicle)=>setGarage(g=>({...g,vehicles:g.vehicles.map(v=>v.id===vehicle.id&&validVehicle(vehicle)?vehicle:v)})),
  removeVehicle:(id)=>setGarage(g=>{if(g.vehicles.length<=1)return g;const vehicles=g.vehicles.filter(v=>v.id!==id);return {vehicles,activeVehicleId:g.activeVehicleId===id?vehicles[0].id:g.activeVehicleId};}),
  setActiveVehicle:(id)=>setGarage(g=>g.vehicles.some(v=>v.id===id)?{...g,activeVehicleId:id}:g)
 }),[garage,activeVehicle]);
 return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}
export function useVehicle(){const value=useContext(GarageContext);if(!value)throw new Error('useVehicle must be used inside VehicleProvider');return value;}

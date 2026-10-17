import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {readStored,writeStored} from '../lib/storage';
export type FuelUnit='l100km'|'mpg';
export interface AppPreferences {currency:'RUB'|'USD'|'EUR'|'CNY';fuelUnit:FuelUnit;autoTheme:'system'|'time';}
const KEY='car-brother-preferences';
const DEFAULTS:AppPreferences={currency:'RUB',fuelUnit:'l100km',autoTheme:'system'};
const valid=(v:unknown):v is AppPreferences=>!!v&&typeof v==='object'&&['RUB','USD','EUR','CNY'].includes(String((v as AppPreferences).currency))&&['l100km','mpg'].includes(String((v as AppPreferences).fuelUnit))&&['system','time'].includes(String((v as AppPreferences).autoTheme));
const Context=createContext<{preferences:AppPreferences;updatePreferences:(next:Partial<AppPreferences>)=>void}|null>(null);
export function PreferencesProvider({children}:{children:ReactNode}){const [preferences,setPreferences]=useState(()=>readStored(KEY,valid,DEFAULTS));useEffect(()=>{writeStored(KEY,preferences,valid)},[preferences]);const value=useMemo(()=>({preferences,updatePreferences:(next:Partial<AppPreferences>)=>setPreferences(p=>({...p,...next}))}),[preferences]);return <Context.Provider value={value}>{children}</Context.Provider>}
export function usePreferences(){const value=useContext(Context);if(!value)throw new Error('usePreferences must be used inside PreferencesProvider');return value;}

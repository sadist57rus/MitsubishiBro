import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {readStored,writeStored} from '../lib/storage';
export type FuelUnit='l100km'|'mpg';
export type FontScale = 'small' | 'normal' | 'large' | 'extra-large';
export interface AppPreferences {currency:'RUB'|'USD'|'EUR'|'CNY';fuelUnit:FuelUnit;autoTheme:'system'|'time';fontScale:FontScale;}
const KEY='car-brother-preferences';
const DEFAULTS:AppPreferences={currency:'RUB',fuelUnit:'l100km',autoTheme:'system',fontScale:'normal'};
const valid=(v:unknown):v is AppPreferences=>!!v&&typeof v==='object'&&['RUB','USD','EUR','CNY'].includes(String((v as AppPreferences).currency))&&['l100km','mpg'].includes(String((v as AppPreferences).fuelUnit))&&['system','time'].includes(String((v as AppPreferences).autoTheme))&&((v as Partial<AppPreferences>).fontScale===undefined||['small','normal','large','extra-large'].includes(String((v as AppPreferences).fontScale)));
const Context=createContext<{preferences:AppPreferences;updatePreferences:(next:Partial<AppPreferences>)=>void}|null>(null);
export function PreferencesProvider({children}:{children:ReactNode}){const [preferences,setPreferences]=useState(()=>({...DEFAULTS,...readStored(KEY,valid,DEFAULTS)}));useEffect(()=>{writeStored(KEY,preferences,valid);const scales:Record<FontScale,string>={small:'0.875',normal:'1',large:'1.125','extra-large':'1.25'};document.documentElement.style.setProperty('--user-font-scale',scales[preferences.fontScale]||'1');},[preferences]);const value=useMemo(()=>({preferences,updatePreferences:(next:Partial<AppPreferences>)=>setPreferences(p=>({...p,...next}))}),[preferences]);return <Context.Provider value={value}>{children}</Context.Provider>}
export function usePreferences(){const value=useContext(Context);if(!value)throw new Error('usePreferences must be used inside PreferencesProvider');return value;}

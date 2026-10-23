import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system' | 'time';
export type ColorPalette = 'black-yellow' | 'white-red' | 'black-orange' | 'midnight-blue' | 'forest-green';
export const COLOR_PALETTES: { id: ColorPalette; name: string; description: string; colors: [string, string, string] }[] = [
  { id: 'black-yellow', name: 'Чёрный / жёлтый', description: 'Контрастный спорт', colors: ['#111111', '#facc15', '#ffffff'] },
  { id: 'white-red', name: 'Белый / красный', description: 'Фирменная классика Nippon-Drive', colors: ['#ffffff', '#dc2626', '#111827'] },
  { id: 'black-orange', name: 'Чёрный / оранжевый', description: 'Техно', colors: ['#111111', '#f97316', '#f8fafc'] },
  { id: 'midnight-blue', name: 'Ночной синий', description: 'Спокойный тёмный', colors: ['#0f172a', '#38bdf8', '#f8fafc'] },
  { id: 'forest-green', name: 'Графит / зелёный', description: 'Автомобильный', colors: ['#171717', '#22c55e', '#f5f5f4'] },
];

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'car-brother-theme';
const LEGACY_THEME_STORAGE_KEY = 'outlander1_theme_v2';
const PALETTE_STORAGE_KEY = 'car-brother-color-palette';
const validPalettes: ColorPalette[] = ['black-yellow', 'white-red', 'black-orange', 'midnight-blue', 'forest-green'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = (localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem(LEGACY_THEME_STORAGE_KEY)) as ThemeMode;
      if (saved && (saved === 'dark' || saved === 'light' || saved === 'system' || saved === 'time')) {
        localStorage.setItem(THEME_STORAGE_KEY, saved);
        localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
      }
      if (saved && (saved === 'dark' || saved === 'light' || saved === 'system' || saved === 'time')) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'light'; // Default to clean light daytime mode as requested
  });

  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem(PALETTE_STORAGE_KEY) as ColorPalette | null;
      return saved && validPalettes.includes(saved) ? saved : 'white-red';
    } catch { return 'white-red'; }
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    try { localStorage.setItem(PALETTE_STORAGE_KEY, palette); } catch { /* storage unavailable */ }

    const updateResolved = () => {
      let active: 'light' | 'dark' = 'light';

      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        active = prefersDark ? 'dark' : 'light';
      } else if (theme === 'time') {
        const hour = new Date().getHours();
        active = hour >= 20 || hour < 7 ? 'dark' : 'light';
      } else {
        active = theme;
      }

      setResolvedTheme(active);

      if (active === 'dark') {
        root.classList.add('dark');
        root.classList.add('dark-theme');
        root.classList.remove('light');
        root.classList.remove('light-theme');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.remove('dark-theme');
        root.classList.add('light');
        root.classList.add('light-theme');
        root.setAttribute('data-theme', 'light');
      }
    };

    updateResolved();
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* storage unavailable */ }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => updateResolved();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
    if (theme === 'time') {
      const timer = window.setInterval(updateResolved, 60_000);
      return () => window.clearInterval(timer);
    }
  }, [theme, palette]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setPalette = (newPalette: ColorPalette) => setPaletteState(newPalette);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

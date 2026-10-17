import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system' | 'time';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'car-brother-theme';
const LEGACY_THEME_STORAGE_KEY = 'outlander1_theme_v2';

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

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;

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
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
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

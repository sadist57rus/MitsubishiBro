import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </ThemeProvider>
);

// Register the local offline cache. The first visit needs a connection; later visits can use cached assets.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => {
      console.warn('Offline cache registration failed:', error);
    });
  });
}

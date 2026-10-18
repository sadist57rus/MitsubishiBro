import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Keep the package ID stable so existing debug installs can be upgraded.
  appId: 'app.carbrother.reference',
  appName: 'Car Brother',
  webDir: 'dist'
};

export default config;

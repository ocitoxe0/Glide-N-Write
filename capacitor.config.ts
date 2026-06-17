import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glideandwrite.app',
  appName: 'GlideAndWrite',
  webDir: 'dist',
  server: {
    url: 'http://192.168.3.19:3000',
    cleartext: true
  }
};

export default config;

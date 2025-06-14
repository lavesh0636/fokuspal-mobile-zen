import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e78b25a885404dbb8f534b72758b9812',
  appName: 'fokuspal-mobile-zen',
  webDir: 'dist',
  server: {
    url: "https://e78b25a8-8540-4dbb-8f53-4b72758b9812.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a1a",
      showSpinner: false
    }
  }
};

export default config;
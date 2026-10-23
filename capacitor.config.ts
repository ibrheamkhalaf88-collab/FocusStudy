import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.antigravity.focus',
  appName: 'FocusStudy',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#6366f1",
      sound: "beep.wav"
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false
    }
  }
};

export default config;
// Capacitor Bridge - Detect Capacitor environment and provide native APIs
// This script runs in the WebView and provides native features when available

(function() {
  'use strict';

  // Check if running in Capacitor
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor !== undefined;
  
  // Initialize Capacitor plugins if available
  let LocalNotifications = null;
  let Haptics = null;
  let StatusBar = null;
  let SplashScreen = null;
  let App = null;

  if (isCapacitor) {
    // Dynamic import of Capacitor plugins
    import('@capacitor/local-notifications').then(m => { LocalNotifications = m.LocalNotifications; });
    import('@capacitor/haptics').then(m => { Haptics = m.Haptics; });
    import('@capacitor/status-bar').then(m => { StatusBar = m.StatusBar; });
    import('@capacitor/splash-screen').then(m => { SplashScreen = m.SplashScreen; });
    import('@capacitor/app').then(m => { App = m.App; });
  }

  // Native notification using Capacitor or fallback to Web Notification API
  window.showNativeNotification = async function(title, body, options = {}) {
    if (isCapacitor && LocalNotifications) {
      try {
        await LocalNotifications.requestPermissions();
        await LocalNotifications.schedule({
          notifications: [{
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 100) },
            sound: options.sound || 'beep.wav',
            attachments: options.attachments || [],
            extra: options.extra || {}
          }]
        });
        return true;
      } catch (e) {
        console.warn('Capacitor notification failed, falling back:', e);
      }
    }
    
    // Fallback to Web Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, ...options });
      return true;
    }
    
    return false;
  };

  // Haptic feedback
  window.vibrate = async function(style = 'medium') {
    if (isCapacitor && Haptics) {
      try {
        const styles = {
          light: Haptics.ImpactStyle.Light,
          medium: Haptics.ImpactStyle.Medium,
          heavy: Haptics.ImpactStyle.Heavy
        };
        await Haptics.impact({ style: styles[style] || styles.medium });
        return true;
      } catch (e) {
        console.warn('Haptics failed:', e);
      }
    }
    
    // Fallback to Vibration API
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[style] || patterns.medium);
      return true;
    }
    
    return false;
  };

  // Status bar styling
  window.setStatusBarStyle = async function(style = 'dark') {
    if (isCapacitor && StatusBar) {
      try {
        await StatusBar.setStyle({ style: style === 'dark' ? 1 : 0 }); // 1 = dark, 0 = light
        await StatusBar.setBackgroundColor({ color: '#0f172a' });
        return true;
      } catch (e) {
        console.warn('StatusBar failed:', e);
      }
    }
    return false;
  };

  // Hide splash screen
  window.hideSplashScreen = async function() {
    if (isCapacitor && SplashScreen) {
      try {
        await SplashScreen.hide();
        return true;
      } catch (e) {
        console.warn('SplashScreen hide failed:', e);
      }
    }
    return false;
  };

  // App lifecycle events
  window.onAppRestored = function(callback) {
    if (isCapacitor && App) {
      App.addListener('restoreState', callback);
    }
  };

  // Export for global access
  window.CapacitorBridge = {
    isCapacitor,
    showNativeNotification: window.showNativeNotification,
    vibrate: window.vibrate,
    setStatusBarStyle: window.setStatusBarStyle,
    hideSplashScreen: window.hideSplashScreen,
    onAppRestored: window.onAppRestored
  };

  // Auto-hide splash screen on load
  if (isCapacitor) {
    document.addEventListener('DOMContentLoaded', () => {
      window.hideSplashScreen();
      window.setStatusBarStyle('dark');
    });
  }
})();
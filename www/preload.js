// Preload script for security boundary
// This provides a secure bridge between renderer and main process
const { contextBridge, ipcRenderer } = require('electron');

// Expose minimal, secure API to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info (read-only, no sensitive data)
  platform: process.platform,
  
  // Version info
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  
  // Request app restart (only IPC, no direct process control)
  requestRestart: () => {
    ipcRenderer.send('request-app-restart');
  }
});

// Log preload initialization (helpful for debugging)
console.log('Preload script initialized - security boundary active');

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: "فوكس - برنامج الدراسة والتركيز",
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');

  Menu.setApplicationMenu(null);

  mainWindow.on('close', async (event) => {
    // Call cleanup in renderer before closing
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        await mainWindow.webContents.executeJavaScript('window.cleanupAllTimers?.()');
      } catch (e) {
        console.log('Cleanup error:', e.message);
      }
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure cleanup on app quit
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.executeJavaScript('window.cleanupAllTimers?.()').catch(() => {});
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
let window = null

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 800px
    width: 800,
    minWidth: 800,
    // Set the initial height to 600px
    height: 600,
    minHeight: 600,
    frame: false,
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    backgroundColor: '#18191c',
    // Don't show the window until it's ready, this prevents any white flickering
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'src/js/preload.js')
    }
  })
  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // window.webContents.openDevTools()
  // Show window when page is ready
  window.once('ready-to-show', () => {
    window.show()
  })
})

ipc.on('update-notify-value', (e, arg) => {
  window.webContents.send('fishingSpot', arg)
})

ipc.on('db-data', (e, arg) => {
  window.webContents.send('logs-data', arg)
})

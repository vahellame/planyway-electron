const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
const { screen } = require('electron')

let window = null
let tray = null
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Когда пользователь пытается открыть второй экземпляр, мы должны сфокусироваться на нашем главном окне.
    if (window) {
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })
  // Создание окна и другие события приложения здесь...
}
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  window = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
  })
  window.setMenuBarVisibility(false)

  window.loadURL('https://planyway.com/app')

  window.on('closed', () => {
    window = null
  })

  window.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      window.hide()
    }
  })
}

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.png'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Reload',
      click: () => {
        window.reload()
      },
    },
    {
      label: 'Exit',
      click: () => {
        app.isQuiting = true
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (window.isVisible()) {
      window.hide()
    } else {
      window.show()
      window.focus()
    }
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (window === null) {
    createWindow()
  }
})

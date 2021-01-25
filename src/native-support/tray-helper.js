const { app, Menu, Tray } = require('electron')
const path = require('path')
const { isWindows } = require('./utils')
const { copyExportCommand } = require('./os-helper')

let tray = null
let mainWindow = null
let createWindow = null

function initializeTray(_window, _createWindow) {
    mainWindow = _window
    createWindow = _createWindow
    const icon = path.resolve(app.getAppPath(), 'src', 'assets', 'tray-icon.png')
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        { label: '主界面', click: showWindow},
        ...(isWindows() ? [] : [{
            label: 'Copy export command',
            click: copyExportCommand
        }]),
        { label: '退出', click: quitApp}
    ])
    tray.setToolTip('XiXi')
    // 托盘展示内容
    tray.setContextMenu(contextMenu)
    // 双击 托盘图标，弹出主界面
    tray.on('double-click', () => {
        if (isWindows()) {
            showWindow()
        }
    })
}

function setWindowInstance(_window) {
    mainWindow = _window
}

function showWindow() {
    if (mainWindow != null && !mainWindow.isDestroyed()) {
        mainWindow.show()
        if (app.dock != null) {
            app.dock.show()
        }
    } else {
        mainWindow = createWindow()
        if (app.dock != null) {
            app.dock.show()
        }
    }
}

function destroyTrayIcon() {
    if (tray != null) {
        tray.destroy()
    }
}

function quitApp() {
    if (mainWindow != null && !mainWindow.isDestroyed()) {
        mainWindow.close()
    }
    app.quit()
}

module.exports = {
    initializeTray,
    destroyTrayIcon,
    setWindowInstance
}
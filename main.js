const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const {
    BRG_MSG_START_CLASH,
    BRG_MSG_ADD_SUBSCRIBE,
    BRG_MSG_UPDATE_SUBSCRIBE,
    BRG_MSG_FETCH_PROFILES,
    BRG_MSG_SWITCHED_PROFILE,
    BRG_MSG_SWITCHED_PROXY,
    BRG_MSG_DELETE_SUBSCRIBE,
    BRG_MSG_OPEN_CONFIG_FOLDER,
    BRG_MSG_OPEN_LINK,
    BRG_MSG_GET_LOGIN_ITEM,
    BRG_MSG_SET_LOGIN_ITEM,
    BRG_MSG_GET_CLASHY_CONFIG,
    BRG_MSG_SET_SYSTEM_PROXY,
    BRG_MSG_CHECK_DELAY,
    BRG_MSG_SET_MINIMIZED
} = require('./src/native-support/message-constants')
const { IPCCalls } = require('./src/native-support/ipc-calls')
const { ClashBinary, utils } = require('./src/native-support')
const { openConfigFolder, openLink, getStartWithSystem, setStartWithSystem, setAsSystemProxy, restorePortSettings } = require('./src/native-support/os-helper')
const { initializeTray, destroyTrayIcon, setWindowInstance } = require('./src/native-support/tray-helper')
const path = require('path')
const { addSubscription, deleteSubscription, updateSubscription } = require('./src/native-support/subscription-updater')
const { fetchProfiles } = require('./src/native-support/profiles-manager')
const { setProfile, setProxy, getCurrentConfig, initialConfigsIfNeeded, setLaunchMinimized } = require('./src/native-support/configs-manager')
const { batchRequestDelay } = require('./src/native-support/check-delay')
const { autoUpdater } = require('electron-updater')
const { curry } = require('./src/utils/curry')

// Global reference for window object to prevent it from being GCed.
let win

function createWindow() {
    if (process.platform === 'linux') {
        Menu.setApplicationMenu(null)
    }

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'native-support', 'electron-preload.js'),
            webSecurity: false
        }
    })
    // 非全屏
    win.setFullScreenable(false)
    win.setResizable(false)
    win.removeMenu()
    win.on('restore', event => {
        if (app.dock != null) {
            app.dock.show()
        }
    })
    win.on('close', event => {
        if (app.dock != null) {
            app.dock.hide()
        }
        win.hide()
    })

    if (utils.isElectronDebug()) {
        win.loadURL('http://localhost:3000')
        win.webContents.openDevTools()
    } else {
        win.loadFile('index.html')
    }

    win.on('closed', () => {
        win = null
    })
    return win
}

// 创建一个单例模式的应用程序
// 整个程序的入口
const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) {
    app.quit()
} else {
    // 第二个实例启动时，会走 quit
    // 第一个实例可以监听到第二个的启动消息，然后把自己弹出来。用户体验角度来讲，就跟自己新开了一个一样。其实始终都是同一个 实例
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win != null && win.isDestroyed()) {
            win.show()
        }
        if (app != null && app.dock != null) {
            app.dock.show()
        }
      })
    
    // electron 初始化完成
    // 开始加载自己的app内容
    app.on('ready', () => {
        // 新版本检测。。。
        autoUpdater.checkForUpdatesAndNotify();
        // 加载配置文件
        initialConfigsIfNeeded().then(() => {
            const config = getCurrentConfig() || {}
            if (!config.launchMinimized) {
                createWindow()
            } else {
                if (app.dock != null) {
                    app.dock.hide()
                }
            }
            // 初始化 clash内核
            ClashBinary.spawnClash()
            // 设置主界面
            setMainMenu()
            // 初始化 托盘
            initializeTray(win, createWindow)
            // 设置系统代理
            setAsSystemProxy(config.systemProxy, false)
            // 2秒后重载端口设置
            setTimeout(restorePortSettings, 2000)
        }).catch(e => {
            console.error(e)
        })
    })
}

app.on('window-all-closed', () => {
})

// 点击托盘激活时
app.on('activate', () => {
    if (win === null) {
        // 没有主界面窗口的话，就新创建出来
        createWindow()
        setWindowInstance(win)
    }
})

// app即将推出
app.on('will-quit', () => {
    // 把系统代理关闭掉
    setAsSystemProxy(false, false)
    // 销毁右下角 托盘图标
    destroyTrayIcon()
    // 关闭 clash 内核
    ClashBinary.killClash()
})

// 进程间消息
ipcMain.on('IPC_MESSAGE_QUEUE', (event, args) => {
    dispatchIPCCalls(args)
})

function dispatchIPCCalls(event) {
    switch (event.__name) {
        case BRG_MSG_START_CLASH:
            // 启动clash
            ClashBinary.spawnClash()
            break
        case BRG_MSG_ADD_SUBSCRIBE:
            addSubscription(event.arg).then(() => {
                resolveIPCCall(event, event.__callbackId)
            }).catch(e => {
                console.error(e)
                deleteSubscription(event.arg)
                    .catch(e => console.log(e))
                    .finally(() => {
                        rejectIPCCall(event, event.__callbackId, e)
                    })
            })
            break
        case BRG_MSG_UPDATE_SUBSCRIBE:
            updateSubscription(event.arg).then(() => {
                resolveIPCCall(event, event.__callbackId)
            }).catch(e => {
                console.error(e)
                rejectIPCCall(event, event.__callbackId, e)
            })
            break
        case BRG_MSG_FETCH_PROFILES:
            fetchProfiles().then((result) => {
                resolveIPCCall(event, event.__callbackId, result)
            }).catch(e => {
                rejectIPCCall(event, event.__callbackId, e)
            })
            break
        case BRG_MSG_SWITCHED_PROFILE:
            // 切换配置文件选择
            setProfile(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_SWITCHED_PROXY:
            // 切换节点
            setProxy(event.selector, event.proxy)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_DELETE_SUBSCRIBE:
            deleteSubscription(event.arg)
                .then(() => {
                    if (event.arg === getCurrentConfig().currentProfile) {
                        setProxy('', '')
                    }
                    resolveIPCCall(event, event.__callbackId, {})
                })
                .catch(e => rejectIPCCall(event, event.__callbackId, e))
            break
        case BRG_MSG_OPEN_CONFIG_FOLDER:
            openConfigFolder()
            break
        case BRG_MSG_OPEN_LINK:
            // 跳转url链接
            openLink(event.arg)
            break
        case BRG_MSG_GET_LOGIN_ITEM:
            resolveIPCCall(event, event.__callbackId, getStartWithSystem())
            break
        case BRG_MSG_SET_LOGIN_ITEM:
            // 开机自动启动
            setStartWithSystem(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_GET_CLASHY_CONFIG:
            resolveIPCCall(event, event.__callbackId, getCurrentConfig())
            break
        case BRG_MSG_SET_SYSTEM_PROXY:
            // 设置为系统代理
            setAsSystemProxy(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_SET_MINIMIZED:
            // 设置 最小化启动(启动后自动最下化到托盘)
            setLaunchMinimized(event.arg)
            resolveIPCCall(event, event.__callbackId, null)
            break
        case BRG_MSG_CHECK_DELAY:
            batchRequestDelay(event.arg)
                .then(results => {
                    resolveIPCCall(event, event.__callbackId, results)
                })
                .catch(e => {
                    rejectIPCCall(event, event.__callbackId, e)
                })
            break
        default: {
            const call = IPCCalls[event.__name]
            const resolve = curry(resolveIPCCall)(event)(event.__callbackId)
            const reject = curry(rejectIPCCall)(event)(event.__callbackId)
            if (call) {
                call(event).then(resolve).catch(reject)
            }
            break
        }
    }
}

function resolveIPCCall(event, callbackId, result) {
    if (win == null) {
        return
    }
    win.webContents.send('IPC_MESSAGE_QUEUE', {
        __callbackId: callbackId,
        event,
        value: result
    })
}

function rejectIPCCall(event, callbackId, error) {
    if (win == null) {
        return
    }
    win.webContents.send('IPC_MESSAGE_QUEUE_REJECT', {
        __callbackId: callbackId,
        event,
        value: error
    })
}

function setMainMenu() {
    if (process.platform !== 'darwin') {
        return
    }
    const template = [
        {
            label: app.getName(),
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'copy' },
                { role: 'cut' },
                { role: 'paste' },
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
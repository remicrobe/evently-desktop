import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron'
import electronUpdater, { type AppUpdater } from 'electron-updater';
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import * as fs from 'fs';

const { autoUpdater } = electronUpdater;
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Structure des dossiers construits
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

// Désactivation de l'accélération GPU pour Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Définir le nom de l'application pour les notifications Windows 10+
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

const getPlatform = () => {
    const platform = process.platform;
    const arch = process.arch;
    if (platform === "win32") {
        return arch === "x64" ? "windows_64" : "windows_32";
    } else if (platform === "darwin") {
        return arch === "arm64" ? "osx_arm64" : "osx_64";
    } else if (platform === "linux") {
        return arch === "x64" ? "linux_64" : "linux_32";
    }
    return "unknown";
}

// Avec electron-updater, la configuration de mise à jour (provider GitHub) se fait via package.json.
// Il n'est donc plus nécessaire d'appeler setFeedURL.

async function createWindow() {
    win = new BrowserWindow({
        show: false,
        title: 'Evently',
        icon: path.join(__dirname, '../../public/logo.png'),
        autoHideMenuBar: true,
        minHeight: 600,
        minWidth: 600,
        webPreferences: {
            preload,
            // Pour plus de sécurité, envisage d'utiliser contextBridge.exposeInMainWorld
        },
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
        win.webContents.openDevTools()
    } else {
        win.removeMenu()
        win.loadFile(indexHtml)
    }

    // Envoi d'un message au Renderer lorsque la fenêtre est chargée
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Ouvrir les liens externes dans le navigateur par défaut
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(createWindow)

app.setAsDefaultProtocolClient('evently-desktop');

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', (ev, argv) => {
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }

    let deeplinkingUrl = argv.find((arg) => arg.startsWith('evently://'));
    let args = deeplinkingUrl?.split('evently://')[1]

    const params = new URLSearchParams(args?.split("?")[1]);

    const dataString = params.get("data");
    if (dataString) {
        const jsonData = JSON.parse(decodeURIComponent(dataString));
        win.webContents.send('auth', jsonData);
    }

    const inviteToken = params.get("inviteToken");
    if (inviteToken) {
        win.webContents.send('invite', inviteToken);
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
        console.log("CommandOrControl+R est désactivé");
    });
    globalShortcut.register("F5", () => {
        console.log("F5 est désactivé");
    });
});

app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
});

// Gestion du protocole pour l'authentification
app.removeAsDefaultProtocolClient('evently');
if (VITE_DEV_SERVER_URL) {
    app.setAsDefaultProtocolClient('evently', process.execPath, [path.resolve(process.argv[1])]);
} else {
    app.setAsDefaultProtocolClient('evently');
}

ipcMain.handle('storage-get', async (event, key) => {
    const filePath = path.join(app.getPath('userData'), 'user-config.json');
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            return jsonData[key] || null;
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier JSON:', error);
        return null;
    }
});

ipcMain.handle('storage-set', async (event, key, value) => {
    const filePath = path.join(app.getPath('userData'), 'user-config.json');
    try {
        let data = {};
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            data = JSON.parse(fileData);
        } else {
            const defaultData = {};
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
            data = defaultData;
        }
        data[key] = value;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans le fichier JSON:', error);
    }
});

ipcMain.handle('ready', async () => {
    win.show()
    win.maximize()
    win.removeMenu()

    console.log(await autoUpdater.checkForUpdates())
    if (!VITE_DEV_SERVER_URL) {
        // Electron-updater récupère la version depuis GitHub grâce à la configuration dans package.json
        await autoUpdater.checkForUpdates();
        console.log("Vérification des mises à jour depuis GitHub...");
    }
});

ipcMain.handle('storage-clear', async () => {
    const filePath = path.join(app.getPath('userData'), 'user-config.json');
    try {
        if (fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({}));
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier JSON:', error);
    }
});

ipcMain.handle('get-locale', async () => {
    return app.getSystemLocale()
});

// Ouvrir une nouvelle fenêtre
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    if (VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})

ipcMain.on('auth', async (event, oauthUrl) => {
    shell.openExternal(oauthUrl);
})

// Gestion des mises à jour via electron-updater, en récupérant la version depuis GitHub
// autoUpdater.on('update-available', () => {
//     if (win) {
//         win.webContents.send('update-available');
//     }
// });

autoUpdater.on('update-downloaded', () => {
    if (win) {
        win.webContents.send('update-available');
    }
});

ipcMain.on('install-update', () => {
    console.log('Demande d\'installation de la mise à jour reçue.');
    autoUpdater.quitAndInstall();
});

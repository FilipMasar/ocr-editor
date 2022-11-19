/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  createProject,
  addAltosToProject,
  addImagesToProject,
  getProjectAssetList,
  ProjectAssetList,
  openProject,
  removeAssetFromProject,
} from './project';
import { getRecentProjects } from './configData';
import { getPageAssets } from './editor';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let currentProjectPath: string | undefined;
let currentProjectAssets: ProjectAssetList | undefined;

ipcMain.on('project-channel', async (event, data) => {
  if (!mainWindow) {
    console.error('mainWindow is not defined');
    return;
  }

  try {
    switch (data.action) {
      case 'CREATE_PROJECT':
        currentProjectPath = await createProject(mainWindow);
        if (currentProjectPath) {
          event.reply('project-channel', {
            action: 'UPDATE_ASSET_LIST',
            payload: [],
          });
        }
        break;

      case 'OPEN_PROJECT':
        currentProjectPath = await openProject(mainWindow, data.payload);
        if (currentProjectPath) {
          currentProjectAssets = await getProjectAssetList(currentProjectPath);
          event.reply('project-channel', {
            action: 'UPDATE_ASSET_LIST',
            payload: currentProjectAssets,
          });
        }
        break;

      case 'ADD_IMAGES':
        await addImagesToProject(mainWindow, currentProjectPath);
        currentProjectAssets = await getProjectAssetList(currentProjectPath);
        event.reply('project-channel', {
          action: 'UPDATE_ASSET_LIST',
          payload: currentProjectAssets,
        });
        break;

      case 'ADD_ALTOS':
        await addAltosToProject(mainWindow, currentProjectPath);
        currentProjectAssets = await getProjectAssetList(currentProjectPath);
        event.reply('project-channel', {
          action: 'UPDATE_ASSET_LIST',
          payload: currentProjectAssets,
        });
        break;

      case 'REMOVE_ASSET':
        await removeAssetFromProject(
          currentProjectPath,
          data.payload.directory,
          data.payload.name
        );
        currentProjectAssets = await getProjectAssetList(currentProjectPath);
        event.reply('project-channel', {
          action: 'UPDATE_ASSET_LIST',
          payload: currentProjectAssets,
        });
        break;
      default:
        console.log('No function found');
    }
  } catch (error: any) {
    console.error(error);
    event.reply('project-channel', {
      action: 'ERROR',
      payload: error?.message || 'Something went wrong',
    });
  }
});

ipcMain.on('config-channel', async (event, data) => {
  switch (data.action) {
    case 'GET_RECENT_PROJECTS':
      event.reply('config-channel', {
        action: 'RECENT_PROJECTS',
        payload: getRecentProjects(),
      });
      break;
    default:
      console.log('No function found');
  }
});

ipcMain.on('editor-channel', async (event, data) => {
  if (currentProjectPath === undefined)
    throw new Error("Project path isn't defined");

  try {
    switch (data.action) {
      case 'GET_PAGE_ASSETS':
        event.reply('editor-channel', {
          action: 'PAGE_ASSETS',
          payload: await getPageAssets(currentProjectPath, data.payload),
        });
        break;
      default:
        console.log('No function found');
    }
  } catch (error: any) {
    console.error(error);
    event.reply('editor-channel', {
      action: 'ERROR',
      payload: error?.message || 'Something went wrong',
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

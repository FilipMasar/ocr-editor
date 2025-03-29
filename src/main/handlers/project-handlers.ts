/**
 * Type-safe IPC handlers for the project channel
 */
import { BrowserWindow, IpcMain, IpcMainEvent } from 'electron';
import { registerHandler } from '../utils/ipc-handler';
import { 
  ProjectAssetList 
} from '../../shared/ipc/project-channel';
import { projectService } from '../services';

/**
 * Register all project channel handlers
 * 
 * @param ipcMain The Electron IPC main instance
 * @param getMainWindow Function to get the current main window
 */
export function registerProjectHandlers(
  ipcMain: IpcMain,
  getMainWindow: () => BrowserWindow | null
): void {
  // CREATE_PROJECT handler
  registerHandler(
    ipcMain,
    'project-channel',
    'CREATE_PROJECT',
    async (_, event, window) => {
      console.log('xxxxxxxxxxxxxx CREATE_PROJECT');
      if (!window) {
        throw new Error('Main window is not defined');
      }

      const projectPath = await projectService.createProject(window);
      
      if (!projectPath) {
        throw new Error('Failed to create project');
      }
      
      return {
        action: 'UPDATE_ASSET_LIST',
        payload: [] as ProjectAssetList
      };
    },
    undefined,
    getMainWindow
  );

  // OPEN_PROJECT handler
  registerHandler(
    ipcMain,
    'project-channel',
    'OPEN_PROJECT',
    async (projectPath, event, window) => {
      console.log('xxxxxxxxxxxxxx OPEN_PROJECT', projectPath);
      if (!window) {
        throw new Error('Main window is not defined');
      }

      const openedProjectPath = await projectService.openProject(window, projectPath);
      
      if (!openedProjectPath) {
        throw new Error('Failed to open project');
      }
      
      const projectAssets = await projectService.getProjectAssetList();
      
      return {
        action: 'UPDATE_ASSET_LIST',
        payload: projectAssets
      };
    },
    undefined,
    getMainWindow
  );

  // ADD_IMAGES handler
  registerHandler(
    ipcMain,
    'project-channel',
    'ADD_IMAGES',
    async (_, event, window) => {
      console.log('xxxxxxxxxxxxxx ADD_IMAGES');
      if (!window) {
        throw new Error('Main window is not defined');
      }

      const projectAssets = await projectService.addImages(window);
      
      return {
        action: 'UPDATE_ASSET_LIST',
        payload: projectAssets
      };
    },
    undefined,
    getMainWindow
  );

  // ADD_ALTOS handler
  registerHandler(
    ipcMain,
    'project-channel',
    'ADD_ALTOS',
    async (_, event, window) => {
      console.log('xxxxxxxxxxxxxx ADD_ALTOS');
      if (!window) {
        throw new Error('Main window is not defined');
      }

      const projectAssets = await projectService.addAltos(window);
      
      return {
        action: 'UPDATE_ASSET_LIST',
        payload: projectAssets
      };
    },
    undefined,
    getMainWindow
  );

  // MARK_AS_DONE handler
  registerHandler(
    ipcMain,
    'project-channel',
    'MARK_AS_DONE',
    async (payload) => {
      console.log('xxxxxxxxxxxxxx MARK_AS_DONE', payload);
      if (!payload || !payload.fileName || payload.index === undefined) {
        throw new Error("Invalid payload");
      }

      const werValue = projectService.markAsDone(payload.index, payload.fileName);
      
      return {
        action: 'WER_UPDATED',
        payload: {
          index: payload.index,
          value: werValue
        }
      };
    }
  );

  // REMOVE_FROM_DONE handler
  registerHandler(
    ipcMain,
    'project-channel',
    'REMOVE_FROM_DONE',
    async (payload) => {
      console.log('xxxxxxxxxxxxxx REMOVE_FROM_DONE', payload);
      if (!payload || !payload.fileName || payload.index === undefined) {
        throw new Error("Invalid payload");
      }

      projectService.removeFromDone(payload.index);
      
      return {
        action: 'WER_UPDATED',
        payload: {
          index: payload.index,
          value: undefined
        }
      };
    }
  );

  // REMOVE_ASSET handler
  registerHandler(
    ipcMain,
    'project-channel',
    'REMOVE_ASSET',
    async (payload) => {
      console.log('xxxxxxxxxxxxxx REMOVE_ASSET', payload);
      if (!payload || !payload.directory || !payload.name) {
        throw new Error("Invalid payload");
      }

      const projectAssets = await projectService.removeAsset(
        payload.directory, 
        payload.name
      );
      
      return {
        action: 'UPDATE_ASSET_LIST',
        payload: projectAssets
      };
    }
  );
} 
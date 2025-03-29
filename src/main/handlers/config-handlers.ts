/**
 * Type-safe IPC handlers for the config channel
 */
import { IpcMain } from 'electron';
import { registerHandler } from '../utils/ipc-handler';
import { configService } from '../services';
import { Settings } from '../../renderer/types/app';

/**
 * Register all config channel handlers
 * 
 * @param ipcMain The Electron IPC main instance
 */
export function registerConfigHandlers(
  ipcMain: IpcMain
): void {
  // GET_RECENT_PROJECTS handler
  registerHandler(
    ipcMain,
    'config-channel',
    'GET_RECENT_PROJECTS',
    async () => {
      console.log('xxxxxxxxxxxxxx GET_RECENT_PROJECTS');
      const recentProjects = configService.getRecentProjects();
      
      return {
        action: 'RECENT_PROJECTS',
        payload: recentProjects
      };
    }
  );
  
  // REMOVE_RECENT_PROJECT handler
  registerHandler(
    ipcMain,
    'config-channel',
    'REMOVE_RECENT_PROJECT',
    async (projectPath) => {
      console.log('xxxxxxxxxxxxxx REMOVE_RECENT_PROJECT', projectPath);
      if (!projectPath) {
        throw new Error("Project path is required");
      }
      
      const updatedProjects = configService.removeRecentProject(projectPath);
      
      return {
        action: 'RECENT_PROJECTS',
        payload: updatedProjects
      };
    }
  );

  // GET_SETTINGS handler
  registerHandler(
    ipcMain,
    'config-channel',
    'GET_SETTINGS',
    async () => {
      console.log('xxxxxxxxxxxxxx GET_SETTINGS');
      const settings = configService.getSettings();
      
      return {
        action: 'SETTINGS',
        payload: settings
      };
    }
  );
  
  // SAVE_SETTINGS handler
  registerHandler(
    ipcMain,
    'config-channel',
    'SAVE_SETTINGS',
    async (settings: Settings) => {
      console.log('xxxxxxxxxxxxxx SAVE_SETTINGS', settings);
      if (!settings) {
        throw new Error("Settings object is required");
      }
      
      const updatedSettings = configService.saveSettings(settings);
      
      return {
        action: 'SETTINGS',
        payload: updatedSettings
      };
    }
  );
} 
/**
 * Type-safe IPC handlers for the editor channel
 */
import { BrowserWindow, IpcMain } from 'electron';
import { registerHandler } from '../utils/ipc-handler';
import { editorService, projectService } from '../services';

/**
 * Register all editor channel handlers
 * 
 * @param ipcMain The Electron IPC main instance
 * @param getMainWindow Function to get the current main window
 */
export function registerEditorHandlers(
  ipcMain: IpcMain,
  getMainWindow: () => BrowserWindow | null
): void {
  // GET_PAGE_ASSETS handler
  registerHandler(
    ipcMain,
    'editor-channel',
    'GET_PAGE_ASSETS',
    async (payload) => {
      console.log('xxxxxxxxxxxxxx GET_PAGE_ASSETS', payload);
      if (!payload || !payload.imageFileName || !payload.altoFileName) {
        throw new Error("Invalid payload: missing file names");
      }

      const pageAssets = await editorService.getPageAssets(
        payload.imageFileName,
        payload.altoFileName
      );
      
      return {
        action: 'PAGE_ASSETS',
        payload: pageAssets
      };
    }
  );

  // SAVE_ALTO handler
  registerHandler(
    ipcMain,
    'editor-channel',
    'SAVE_ALTO',
    async (payload, event) => {
      console.log('xxxxxxxxxxxxxx SAVE_ALTO', payload);
      if (!payload || !payload.fileName || payload.index === undefined) {
        throw new Error("Invalid payload: missing required data");
      }

      // Save the ALTO file and get the validation result
      const saveResult = await editorService.saveAlto(
        payload.fileName,
        payload.alto
      );
      
      // Return the save result
      const response = {
        action: 'ALTO_SAVED' as const,
        payload: saveResult
      };
      
      // Check if this page is marked as done and recalculate WER if needed
      const donePages = projectService.getDonePages();
      if (donePages.includes(payload.index)) {
        // Trigger WER calculation in a separate response
        const werValue = projectService.markAsDone(payload.index, payload.fileName);
        
        // Send a separate message on the project channel
        event.reply('project-channel', {
          action: 'WER_UPDATED',
          payload: {
            index: payload.index,
            value: werValue
          }
        });
      }
      
      return response;
    }
  );
} 
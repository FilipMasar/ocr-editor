/**
 * TypeScript declaration file for Electron preload APIs exposed to the renderer
 */
import { TypedIpc } from '../shared/ipc';

declare global {
  interface Window {
    electron: {
      /**
       * Type-safe interface for IPC communication with the main process
       */
      ipc: TypedIpc;
    };
  }
}

export {};

/**
 * Preload script for Electron
 * 
 * This script runs in the renderer process but has access to Node.js APIs.
 * It's used to expose a secure bridge for IPC communication between
 * the renderer and main processes.
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { 
  Channel, 
  RequestActions, 
  RequestPayload, 
  ResponseActions, 
  TypedIpc 
} from '../shared/ipc';

/**
 * Implementation of the TypedIpc interface for the renderer process
 */
const typedIpc: TypedIpc = {
  send<C extends Channel, A extends RequestActions<C>>(
    channel: C,
    action: A,
    payload?: RequestPayload<C, A>
  ): void {
    ipcRenderer.send(channel, { action, payload });
  },

  on<C extends Channel, A extends ResponseActions<C>>(
    channel: C,
    action: A,
    handler: (payload: any) => void
  ): () => void {
    const subscription = (_event: IpcRendererEvent, data: { action: string; payload?: any }) => {
      if (data.action === action) {
        handler(data.payload);
      }
    };
    
    ipcRenderer.on(channel, subscription);
    
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  onChannel<C extends Channel>(
    channel: C,
    handler: (action: ResponseActions<C>, payload: any) => void
  ): () => void {
    const subscription = (_event: IpcRendererEvent, data: { action: string; payload?: any }) => {
      handler(data.action as ResponseActions<C>, data.payload);
    };
    
    ipcRenderer.on(channel, subscription);
    
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  once<C extends Channel, A extends ResponseActions<C>>(
    channel: C,
    action: A,
    handler: (payload: any) => void
  ): void {
    const onceHandler = (_event: IpcRendererEvent, data: { action: string; payload?: any }) => {
      if (data.action === action) {
        handler(data.payload);
      }
    };
    
    ipcRenderer.once(channel, onceHandler);
  },

  onError(handler: (message: string) => void): () => void {
    const errorHandler = (_event: IpcRendererEvent, data: { action: string; payload?: any }) => {
      if (data.action === 'ERROR') {
        handler(data.payload as string);
      }
    };
    
    // Listen for errors on all channels
    ipcRenderer.on('project-channel', errorHandler);
    ipcRenderer.on('config-channel', errorHandler);
    ipcRenderer.on('editor-channel', errorHandler);
    
    return () => {
      ipcRenderer.removeListener('project-channel', errorHandler);
      ipcRenderer.removeListener('config-channel', errorHandler);
      ipcRenderer.removeListener('editor-channel', errorHandler);
    };
  }
};

// Expose the typed IPC interface to the renderer process
contextBridge.exposeInMainWorld('electron', {
  ipc: typedIpc
});

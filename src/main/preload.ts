// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'project-channel' | 'config-channel' | 'editor-channel';

// Define possible payload types for better type safety
export type ChannelPayload = 
  | string 
  | number 
  | boolean 
  | null 
  | Record<string, unknown> 
  | Array<unknown>
  | { fileName: string; alto: unknown; index: number } // For SAVE_ALTO
  | { imageFileName: string; altoFileName: string }    // For GET_PAGE_ASSETS
  | undefined;

export type ChannelData = {
  action: string;
  payload?: ChannelPayload;
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, data: ChannelData) {
      ipcRenderer.send(channel, data);
    },
    on(channel: Channels, func: (data: ChannelData) => void) {
      const subscription = (_event: IpcRendererEvent, data: ChannelData) =>
        func(data);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (data: ChannelData) => void) {
      ipcRenderer.once(channel, (_event, data) => func(data));
    },
  },
});

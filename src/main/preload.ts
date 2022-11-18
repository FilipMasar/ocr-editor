import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'project-channel';
export type ChannelData = {
  action: string;
  payload?: any;
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

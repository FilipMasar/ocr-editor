import { ChannelData, Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, data: ChannelData): void;
        on(
          channel: Channels,
          func: (data: ChannelData) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (data: ChannelData) => void): void;
      };
    };
  }
}

export {};

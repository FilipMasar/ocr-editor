/**
 * IPC Handler utilities for the main process
 * 
 * These utilities help create type-safe IPC handlers for different channels
 */
import { BrowserWindow, IpcMain, IpcMainEvent } from 'electron';
import { 
  Channel, 
  RequestActions, 
  RequestPayload, 
  ResponseActions, 
  ResponsePayload 
} from '../../shared/ipc';
import { loggingService } from '../services';

/**
 * Type for a handler function that processes a request and returns a response
 */
export type RequestHandler<
  C extends Channel, 
  A extends RequestActions<C>,
  R extends ResponseActions<C>
> = (
  payload: RequestPayload<C, A>,
  event: IpcMainEvent,
  window: BrowserWindow | null
) => Promise<{ action: R; payload?: ResponsePayload<C, R> }>;

/**
 * Error handler function signature
 */
export type ErrorHandler = (
  error: Error, 
  event: IpcMainEvent,
  channel: Channel,
  action: string
) => void;

/**
 * Register a handler for a specific action on a channel
 */
export function registerHandler<
  C extends Channel,
  A extends RequestActions<C>,
  R extends ResponseActions<C>
>(
  ipcMain: IpcMain,
  channel: C,
  actionType: A,
  handler: RequestHandler<C, A, R>,
  errorHandler?: ErrorHandler,
  mainWindow?: () => BrowserWindow | null
): void {
  ipcMain.on(
    channel,
    async (event, data: { action: string; payload?: any }) => {
      if (data.action !== actionType) return;

      try {
        // Log the request
        loggingService.debug(
          'IPC',
          `Request: ${channel}:${actionType}${data.payload ? ` | Payload: ${JSON.stringify(data.payload).slice(0, 200)}` : ''}`
        );
        
        const window = mainWindow ? mainWindow() : null;
        const response = await handler(data.payload, event, window);
        
        // Log the successful response
        loggingService.debug(
          'IPC',
          `Response: ${channel}:${response.action}${response.payload ? ` | Payload: ${JSON.stringify(response.payload).slice(0, 200)}` : ''}`
        );
        
        event.reply(channel, response);
      } catch (error) {
        // Log the error with detailed information
        loggingService.error(
          'IPC', 
          `Error in ${channel}:${actionType} handler`,
          error instanceof Error ? error : new Error(String(error))
        );
        
        if (errorHandler && error instanceof Error) {
          errorHandler(error, event, channel, actionType);
        } else {
          // Default error handling
          event.reply(channel, {
            action: 'ERROR',
            payload: error instanceof Error 
              ? error.message 
              : 'Unknown error occurred'
          });
        }
      }
    }
  );
}
 
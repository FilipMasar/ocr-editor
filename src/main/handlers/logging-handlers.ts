/**
 * Type-safe IPC handlers for the logging channel
 */
import { IpcMain } from 'electron';
import { registerHandler } from '../utils/ipc-handler';
import { loggingService } from '../services';
import { LogLevel as ServiceLogLevel } from '../services/LoggingService';
import { LogLevel as IpcLogLevel } from '../../shared/ipc/logging-channel';

/**
 * Map IPC log levels to service log levels
 */
function mapLogLevel(level: IpcLogLevel): ServiceLogLevel {
  switch (level) {
    case IpcLogLevel.ERROR:
      return ServiceLogLevel.ERROR;
    case IpcLogLevel.WARN:
      return ServiceLogLevel.WARN;
    case IpcLogLevel.INFO:
      return ServiceLogLevel.INFO;
    case IpcLogLevel.DEBUG:
      return ServiceLogLevel.DEBUG;
    default:
      return ServiceLogLevel.INFO;
  }
}

/**
 * Register all logging channel handlers
 * 
 * @param ipcMain The Electron IPC main instance
 */
export function registerLoggingHandlers(
  ipcMain: IpcMain
): void {
  // LOG handler
  registerHandler(
    ipcMain,
    'logging-channel',
    'LOG',
    async (payload) => {
      if (!payload) {
        throw new Error("Log payload is required");
      }
      
      const { level, source, message, details } = payload;
      
      // Map the log level
      const serviceLevel = mapLogLevel(level);
      
      // Log the message using the appropriate method
      switch (serviceLevel) {
        case ServiceLogLevel.ERROR:
          if (details instanceof Error) {
            loggingService.error(source, message, details);
          } else {
            loggingService.error(source, message);
          }
          break;
        case ServiceLogLevel.WARN:
          loggingService.warn(source, message);
          break;
        case ServiceLogLevel.INFO:
          loggingService.info(source, message);
          break;
        case ServiceLogLevel.DEBUG:
          loggingService.debug(source, message);
          break;
      }
      
      // Return acknowledgment
      return {
        action: 'LOG_ACKNOWLEDGED'
      };
    }
  );
} 
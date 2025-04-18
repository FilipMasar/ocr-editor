/**
 * Logging utility for the renderer process
 * 
 * This utility provides a consistent interface for logging in the renderer process.
 * It sends logs to the main process via IPC for central log management.
 */
import { LogLevel, LogMessage } from '../../shared/ipc/logging-channel';

/**
 * Logger class for the renderer process
 */
class Logger {
  /**
   * Log an error message
   * 
   * @param source The source of the error
   * @param message The error message
   * @param error Optional Error object
   */
  error(source: string, message: string, error?: Error): void {
    this.log(LogLevel.ERROR, source, message, error);
    
    // Also log to console for immediate visibility
    console.error(`[${source}] ${message}`, error);
  }
  
  /**
   * Log a warning message
   * 
   * @param source The source of the warning
   * @param message The warning message
   */
  warn(source: string, message: string): void {
    this.log(LogLevel.WARN, source, message);
    
    // Also log to console for immediate visibility
    console.warn(`[${source}] ${message}`);
  }
  
  /**
   * Log an info message
   * 
   * @param source The source of the info
   * @param message The info message
   */
  info(source: string, message: string): void {
    this.log(LogLevel.INFO, source, message);
    
    // Also log to console for immediate visibility in development
    if (process.env.NODE_ENV === 'development') {
      console.info(`[${source}] ${message}`);
    }
  }
  
  /**
   * Log a debug message
   * 
   * @param source The source of the debug message
   * @param message The debug message
   */
  debug(source: string, message: string): void {
    this.log(LogLevel.DEBUG, source, message);
    
    // Also log to console for immediate visibility in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${source}] ${message}`);
    }
  }
  
  /**
   * Send a log message to the main process
   * 
   * @param level The log level
   * @param source The source of the message
   * @param message The message content
   * @param details Optional details (like Error object)
   */
  private log(level: LogLevel, source: string, message: string, details?: unknown): void {
    // Create the log message
    const logMessage: LogMessage = {
      level,
      source,
      message,
      timestamp: new Date().toISOString(),
      details
    };
    
    // Send to main process
    window.electron.ipc.send('logging-channel', 'LOG', logMessage);
  }
}

// Export a singleton instance
export const logger = new Logger(); 
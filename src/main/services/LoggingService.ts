/**
 * Service module for centralized logging
 * 
 * This service provides a consistent interface for logging across the application,
 * with support for different log levels and destinations.
 */
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Log levels available in the application
 */
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

/**
 * Configuration for the logging service
 */
interface LoggingConfig {
  logToFile: boolean;
  logToConsole: boolean;
  maxLogFileSize: number; // in bytes
  maxLogFiles: number;
  minLevel: LogLevel;
}

/**
 * Default configuration
 */
const defaultConfig: LoggingConfig = {
  logToFile: true,
  logToConsole: true,
  maxLogFileSize: 1024 * 1024 * 5, // 5MB
  maxLogFiles: 5,
  minLevel: LogLevel.INFO
};

/**
 * Service for centralized logging
 */
class LoggingService {
  private config: LoggingConfig;
  private logDir: string;
  private currentLogFile: string;
  
  constructor(config: Partial<LoggingConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    
    // Set up log directory in user's app data directory
    this.logDir = path.join(app.getPath('userData'), 'logs');
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Set up log file with timestamp to ensure uniqueness
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    this.currentLogFile = path.join(this.logDir, `app-${timestamp}.log`);
    
    // Initialize log file
    this.logToFile(`=== Log started at ${new Date().toISOString()} ===\n`);
    
    // Log app startup
    this.info('Application', `App started (${app.getName()} ${app.getVersion()})`);
    this.info('System', `OS: ${process.platform} ${process.arch}, Electron: ${process.versions.electron}`);
  }
  
  /**
   * Log an error message
   * 
   * @param source The source of the error (module name, etc.)
   * @param message The error message
   * @param error Optional Error object with stack trace
   */
  error(source: string, message: string, error?: Error): void {
    this.log(LogLevel.ERROR, source, message);
    if (error) {
      this.log(LogLevel.ERROR, source, `Stack trace: ${error.stack}`);
    }
  }
  
  /**
   * Log a warning message
   * 
   * @param source The source of the warning
   * @param message The warning message
   */
  warn(source: string, message: string): void {
    this.log(LogLevel.WARN, source, message);
  }
  
  /**
   * Log an info message
   * 
   * @param source The source of the info
   * @param message The info message
   */
  info(source: string, message: string): void {
    this.log(LogLevel.INFO, source, message);
  }
  
  /**
   * Log a debug message
   * 
   * @param source The source of the debug message
   * @param message The debug message
   */
  debug(source: string, message: string): void {
    this.log(LogLevel.DEBUG, source, message);
  }
  
  /**
   * Log a message with the specified level
   * 
   * @param level The log level
   * @param source The source of the message
   * @param message The message content
   */
  private log(level: LogLevel, source: string, message: string): void {
    // Skip if log level is below minimum
    if (!this.shouldLog(level)) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] [${source}] ${message}`;
    
    // Log to console
    if (this.config.logToConsole) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
      }
    }
    
    // Log to file
    if (this.config.logToFile) {
      this.logToFile(`${formattedMessage}\n`);
    }
  }
  
  /**
   * Determine if a given log level should be logged
   * 
   * @param level The log level to check
   * @returns True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const levelIndex = levels.indexOf(level);
    
    return levelIndex <= minLevelIndex;
  }
  
  /**
   * Write a message to the log file
   * 
   * @param message The message to write
   */
  private logToFile(message: string): void {
    try {
      // Append to log file
      fs.appendFileSync(this.currentLogFile, message);
      
      // Check file size and rotate if necessary
      this.checkRotateLogs();
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  /**
   * Check if logs should be rotated and perform rotation if needed
   */
  private checkRotateLogs(): void {
    try {
      // Check if current log file is too large
      const stats = fs.statSync(this.currentLogFile);
      if (stats.size < this.config.maxLogFileSize) {
        return;
      }
      
      // List existing log files
      const logFiles = fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('app-') && file.endsWith('.log'))
        .map(file => path.join(this.logDir, file))
        .sort((a, b) => {
          const statA = fs.statSync(a);
          const statB = fs.statSync(b);
          return statB.mtime.getTime() - statA.mtime.getTime();
        });
      
      // Create new log file
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      this.currentLogFile = path.join(this.logDir, `app-${timestamp}.log`);
      this.logToFile(`=== Log continued at ${new Date().toISOString()} ===\n`);
      
      // Remove oldest files if we have too many
      if (logFiles.length >= this.config.maxLogFiles) {
        const filesToRemove = logFiles.slice(this.config.maxLogFiles - 1);
        filesToRemove.forEach(file => {
          try {
            fs.unlinkSync(file);
          } catch (error) {
            console.error(`Failed to delete old log file ${file}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to rotate logs:', error);
    }
  }
  
  /**
   * Update logging configuration
   * 
   * @param config New configuration options (partial)
   */
  updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    this.info('LoggingService', 'Logging configuration updated');
  }
}

// Export a singleton instance
export const loggingService = new LoggingService(); 
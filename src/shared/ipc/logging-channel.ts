import { ChannelDefinition, IpcMessage } from './channels';

/**
 * Log levels for the logging channel
 */
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

/**
 * Log message structure
 */
export interface LogMessage {
  level: LogLevel;
  source: string;
  message: string;
  timestamp: string;
  details?: unknown;
}

/**
 * Logging channel request messages
 */
type LogRequest = IpcMessage<'LOG', LogMessage>;

/**
 * Logging channel response messages
 * (Currently there are no responses, but this could be extended)
 */
type LogAcknowledgedResponse = IpcMessage<'LOG_ACKNOWLEDGED'>;

/**
 * Combined logging channel definition
 */
export type LoggingChannelDefinition = ChannelDefinition<
  [LogRequest],
  [LogAcknowledgedResponse]
>; 
/**
 * Unified IPC module that exports all channel definitions and types
 */
import { Channel, RequestActions, RequestPayload, ResponseActions, ResponsePayload } from './channels';

// Re-export all type definitions
export * from './channels';
export * from './project-channel';
export * from './editor-channel';
export * from './config-channel';

/**
 * Type-safe IPC interface
 */
export interface TypedIpc {
  /**
   * Send a request message to the main process
   * @param channel The IPC channel to use
   * @param action The action to perform
   * @param payload The payload data (if any)
   */
  send<C extends Channel, A extends RequestActions<C>>(
    channel: C,
    action: A,
    payload?: RequestPayload<C, A>
  ): void;

  /**
   * Register a handler for response messages from the main process
   * @param channel The IPC channel to listen on
   * @param action The action to handle
   * @param handler The handler function
   */
  on<C extends Channel, A extends ResponseActions<C>>(
    channel: C,
    action: A,
    handler: (payload: ResponsePayload<C, A>) => void
  ): () => void;

  /**
   * Register a handler for all messages on a channel
   * @param channel The IPC channel to listen on
   * @param handler The handler function
   */
  onChannel<C extends Channel>(
    channel: C,
    handler: (action: ResponseActions<C>, payload: any) => void
  ): () => void;

  /**
   * Register a one-time handler for a response message
   * @param channel The IPC channel to listen on
   * @param action The action to handle
   * @param handler The handler function
   */
  once<C extends Channel, A extends ResponseActions<C>>(
    channel: C,
    action: A,
    handler: (payload: ResponsePayload<C, A>) => void
  ): void;

  /**
   * Register a handler for error messages
   * @param handler The error handler function
   */
  onError(handler: (message: string) => void): () => void;
} 
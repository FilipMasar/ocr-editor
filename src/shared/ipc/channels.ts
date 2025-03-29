/**
 * This file contains the base types for the type-safe IPC system
 */

/**
 * Base message interface for IPC
 */
export interface IpcMessage<A extends string, P = void> {
  action: A;
  payload?: P;
}

/**
 * Channel definition interface
 * 
 * This provides type-safe mapping between requests and responses
 * for a specific channel
 */
export interface ChannelDefinition<
  Req extends Array<IpcMessage<any, any>>,
  Res extends Array<IpcMessage<any, any>>
> {
  _req: Req;
  _res: Res;
}

/**
 * Generic error response
 */
export type ErrorResponse = IpcMessage<'ERROR', string>

/**
 * All available channel names
 */
export type Channel = keyof ChannelDefinitions;

/**
 * Request actions for a given channel
 */
export type RequestActions<C extends Channel> = 
  ChannelDefinitions[C]['_req'][number]['action'];

/**
 * Response actions for a given channel
 */
export type ResponseActions<C extends Channel> = 
  | ChannelDefinitions[C]['_res'][number]['action']
  | ErrorResponse['action'];

/**
 * Request payload for a given channel and action
 */
export type RequestPayload<
  C extends Channel,
  A extends RequestActions<C>
> = Extract<ChannelDefinitions[C]['_req'][number], { action: A }>['payload'];

/**
 * Response payload for a given channel and action
 */
export type ResponsePayload<
  C extends Channel,
  A extends ResponseActions<C>
> = A extends ErrorResponse['action']
  ? ErrorResponse['payload']
  : Extract<ChannelDefinitions[C]['_res'][number], { action: A }>['payload'];

/**
 * Combined channel definitions
 */
export interface ChannelDefinitions {
  'project-channel': import('./project-channel').ProjectChannelDefinition;
  'config-channel': import('./config-channel').ConfigChannelDefinition;
  'editor-channel': import('./editor-channel').EditorChannelDefinition;
  'logging-channel': import('./logging-channel').LoggingChannelDefinition;
} 
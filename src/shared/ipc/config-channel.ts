import { ChannelDefinition, IpcMessage } from './channels';
import { Settings } from '../../renderer/types/app';

/**
 * Project information stored in configuration
 */
export interface RecentProject {
  path: string;
  name: string;
  lastOpened: string;
}

/**
 * Config channel request messages
 */
type GetRecentProjectsRequest = IpcMessage<'GET_RECENT_PROJECTS'>;
type RemoveRecentProjectRequest = IpcMessage<'REMOVE_RECENT_PROJECT', string>;
type GetSettingsRequest = IpcMessage<'GET_SETTINGS'>;
type SaveSettingsRequest = IpcMessage<'SAVE_SETTINGS', Settings>;

/**
 * Config channel response messages
 */
type RecentProjectsResponse = IpcMessage<'RECENT_PROJECTS', RecentProject[]>;
type SettingsResponse = IpcMessage<'SETTINGS', Settings>;

/**
 * Combined config channel definition
 */
export type ConfigChannelDefinition = ChannelDefinition<
  [
    GetRecentProjectsRequest, 
    RemoveRecentProjectRequest,
    GetSettingsRequest,
    SaveSettingsRequest
  ],
  [
    RecentProjectsResponse,
    SettingsResponse
  ]
>; 
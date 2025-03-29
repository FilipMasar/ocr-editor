import { ChannelDefinition, IpcMessage } from './channels';

/**
 * Project asset representation
 */
export interface ProjectAsset {
  image: string;
  alto: string;
  done: boolean;
  wer?: number;
}

export type ProjectAssetList = ProjectAsset[];

/**
 * Project channel request messages
 */
type CreateProjectRequest = IpcMessage<'CREATE_PROJECT'>;
type OpenProjectRequest = IpcMessage<'OPEN_PROJECT', string | undefined>;
type AddImagesRequest = IpcMessage<'ADD_IMAGES'>;
type AddAltosRequest = IpcMessage<'ADD_ALTOS'>;
type RemoveAssetRequest = IpcMessage<
  'REMOVE_ASSET',
  { directory: 'images' | 'altos'; name: string }
>;
type MarkAsDoneRequest = IpcMessage<
  'MARK_AS_DONE',
  { fileName: string; index: number }
>;
type RemoveFromDoneRequest = IpcMessage<
  'REMOVE_FROM_DONE',
  { fileName: string; index: number }
>;

/**
 * Project channel response messages
 */
type UpdateAssetListResponse = IpcMessage<'UPDATE_ASSET_LIST', ProjectAssetList>;
type WerUpdatedResponse = IpcMessage<
  'WER_UPDATED',
  { index: number; value: number | undefined }
>;

/**
 * Combined project channel definition
 */
export type ProjectChannelDefinition = ChannelDefinition<
  [
    CreateProjectRequest,
    OpenProjectRequest,
    AddImagesRequest,
    AddAltosRequest,
    RemoveAssetRequest,
    MarkAsDoneRequest,
    RemoveFromDoneRequest
  ],
  [
    UpdateAssetListResponse,
    WerUpdatedResponse
  ]
>; 
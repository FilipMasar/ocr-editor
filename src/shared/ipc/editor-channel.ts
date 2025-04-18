import { AltoJson } from '../../renderer/types/alto';
import { ChannelDefinition, IpcMessage } from './channels';

/**
 * Validation status for ALTO files 
 */
export interface ValidationStatus {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Page assets structure from main process
 */
export interface PageAssets {
  imageUri: string;
  altoJson: unknown;
  altoVersion?: string;
  validationStatus?: ValidationStatus;
}

/**
 * Editor channel request messages
 */
type GetPageAssetsRequest = IpcMessage<
  'GET_PAGE_ASSETS',
  { imageFileName: string; altoFileName: string }
>;

type SaveAltoRequest = IpcMessage<
  'SAVE_ALTO',
  { fileName: string; alto: AltoJson; index: number }
>;

/**
 * Editor channel response messages
 */
type PageAssetsResponse = IpcMessage<'PAGE_ASSETS', PageAssets>;

type AltoSavedResponse = IpcMessage<
  'ALTO_SAVED',
  { validation?: ValidationStatus }
>;

/**
 * Combined editor channel definition
 */
export type EditorChannelDefinition = ChannelDefinition<
  [GetPageAssetsRequest, SaveAltoRequest],
  [PageAssetsResponse, AltoSavedResponse]
>; 
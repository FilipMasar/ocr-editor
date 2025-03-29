/**
 * Main index file for all context providers and hooks
 */

// Project contexts
export { ProjectProvider, useProject } from './project';

// Editor contexts
export { 
  EditorProvider, 
  useEditor, 
  AltoEditorProvider, 
  useAltoEditor,
  TextEditorProvider,
  useTextEditor
} from './editor';

// App contexts
export { SettingsProvider, useSettings, AltoProvider, useAlto } from './app';

// Note: The old AltoContext has been refactored and moved to the app directory 
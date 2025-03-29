/**
 * Index file for app-related contexts
 */
import AltoProvider, { useAlto } from './AltoContext';

export { 
  AltoProvider,
  useAlto
};

export default {
  AltoProvider
};

export { default as SettingsProvider } from './SettingsContext';
export { useSettings } from './SettingsContext'; 
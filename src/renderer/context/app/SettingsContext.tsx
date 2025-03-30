import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Settings } from '../../types/app';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { logger } from '../../utils/logger';

/**
 * Context value interface for the settings provider
 */
interface SettingsProviderValue {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  syncSettings: () => void;
  resetSettings: () => void;
  saving: boolean;
  error: string | null;
}

/**
 * Default settings for the application
 */
const defaultSettings: Settings = {
  imageOpacity: 100,
  borderWidth: 1,
  show: {
    page: true,
    margins: true,
    printSpace: true,
    illustrations: true,
    graphicalElements: true,
    composedBlocks: true,
    textBlocks: true,
    textLines: true,
    strings: false,
    textFit: false,
    textAbove: false,
    textNext: false,
    hyphens: true,
  },
};

// Context
const SettingsContext = createContext({} as SettingsProviderValue);

/**
 * Hook to access the settings context
 */
export const useSettings = () => useContext(SettingsContext);

/**
 * Provider component for the settings context
 * Uses type-safe IPC to sync settings with main process
 * Falls back to localStorage when offline/disconnected
 */
const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  // Use localStorage as a fallback and for initial state
  const [localSettings, setLocalSettings] = useLocalStorage<Settings>('app-settings', defaultSettings);
  const [settings, setSettingsState] = useState<Settings>(localSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Sync settings with the main process with retry logic
  useEffect(() => {
    const syncSettings = () => {
      logger.info('SettingsContext', 'Getting settings from main process');
      window.electron.ipc.send('config-channel', 'GET_SETTINGS');
    };

    syncSettings();

    // Set up retry if needed
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds
    
    if (retryCount > 0 && retryCount <= MAX_RETRIES) {
      logger.warn('SettingsContext', `Retrying settings sync (attempt ${retryCount}/${MAX_RETRIES})`);
      const timer = setTimeout(syncSettings, RETRY_DELAY);
      return () => clearTimeout(timer);
    }
    
    // If we've exceeded max retries, log and use local settings
    if (retryCount > MAX_RETRIES) {
      logger.error('SettingsContext', `Failed to sync settings after ${MAX_RETRIES} attempts, using local settings`);
      setError(`Failed to sync settings after ${MAX_RETRIES} attempts. Using local settings.`);
      setSaving(false);
    }
  }, [retryCount]);

  // Update settings and sync with main process
  const setSettings = useCallback((newSettings: Settings | ((prev: Settings) => Settings)) => {
    setSettingsState(prevSettings => {
      try {
        const updatedSettings = newSettings instanceof Function ? newSettings(prevSettings) : newSettings;
        
        // Validate settings
        if (!updatedSettings || !updatedSettings.show) {
          throw new Error('Invalid settings structure');
        }
        
        // Save to localStorage as backup
        setLocalSettings(updatedSettings);
        
        // Send to main process
        setSaving(true);
        setError(null);
        
        logger.info('SettingsContext', 'Saving settings to main process');
        window.electron.ipc.send(
          'config-channel', 
          'SAVE_SETTINGS', 
          updatedSettings
        );
        
        return updatedSettings;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error('SettingsContext', `Error updating settings: ${errorMessage}`);
        setError(`Failed to update settings: ${errorMessage}`);
        setSaving(false);
        return prevSettings;
      }
    });
  }, [setLocalSettings]);

  // Force sync settings from main process
  const syncSettings = useCallback(() => {
    logger.info('SettingsContext', 'Force syncing settings from main process');
    setRetryCount(0); // Reset retry count
    setError(null);
    window.electron.ipc.send('config-channel', 'GET_SETTINGS');
  }, []);

  // Reset to default settings
  const resetSettings = useCallback(() => {
    logger.info('SettingsContext', 'Resetting to default settings');
    setSettings(defaultSettings);
  }, [setSettings]);

  // Set up IPC listeners
  useEffect(() => {
    // Listen for settings response
    const unsubscribeSettings = window.electron.ipc.on(
      'config-channel',
      'SETTINGS',
      (payload) => {
        if (payload) {
          logger.debug('SettingsContext', 'Received settings from main process');
          setSettingsState(payload);
          setLocalSettings(payload);
          setRetryCount(0); // Reset retry count on success
        } else {
          logger.warn('SettingsContext', 'Received empty settings payload');
        }
        setSaving(false);
      }
    );

    // Handle errors
    const unsubscribeError = window.electron.ipc.onError((message) => {
      logger.error('SettingsContext', `IPC error: ${message}`);
      setError(message);
      setSaving(false);
      
      // Try to recover with retry logic
      setRetryCount(prev => prev + 1);
    });

    // Clean up listeners
    return () => {
      unsubscribeSettings();
      unsubscribeError();
    };
  }, [setLocalSettings]);

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        setSettings, 
        syncSettings,
        resetSettings,
        saving,
        error
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider; 
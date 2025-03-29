import { useCallback } from 'react';
import { useSettings } from '../context';

/**
 * Custom hook for application settings
 * This hook provides methods to update specific settings
 */
export const useAppSettings = () => {
  const { settings, setSettings } = useSettings();
  
  /**
   * Set the image opacity value
   * @param value Opacity value (0-100)
   */
  const setImageOpacity = useCallback((value: number) => {
    setSettings(prev => ({
      ...prev,
      imageOpacity: Math.max(0, Math.min(100, value))
    }));
  }, [setSettings]);
  
  /**
   * Toggle a specific visibility setting
   * @param key The setting key to toggle
   */
  const toggleVisibility = useCallback((key: keyof typeof settings.show) => {
    setSettings(prev => ({
      ...prev,
      show: {
        ...prev.show,
        [key]: !prev.show[key]
      }
    }));
  }, [setSettings, settings.show]);
  
  /**
   * Set a specific visibility setting
   * @param key The setting key to set
   * @param value The new value
   */
  const setVisibility = useCallback((key: keyof typeof settings.show, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      show: {
        ...prev.show,
        [key]: value
      }
    }));
  }, [setSettings]);
  
  return {
    settings,
    setImageOpacity,
    toggleVisibility,
    setVisibility
  };
}; 
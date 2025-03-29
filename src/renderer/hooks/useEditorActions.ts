import { useCallback } from 'react';
import { useEditor } from '../context';

/**
 * Custom hook for editor-related actions
 * This hook provides a set of functions for common editor operations
 */
export const useEditorActions = () => {
  const { 
    requestPageAssets,
    saveAlto,
    setZoom,
    zoom
  } = useEditor();
  
  /**
   * Request page assets for editing
   * @param imageFileName The image file name
   * @param altoFileName The ALTO file name
   */
  const handleRequestPageAssets = useCallback((imageFileName: string, altoFileName: string) => {
    requestPageAssets(imageFileName, altoFileName);
  }, [requestPageAssets]);
  
  /**
   * Save the current ALTO file
   * @param fileName The file name to save
   * @param index The index of the page
   */
  const handleSaveAlto = useCallback((fileName: string, index: number) => {
    saveAlto(fileName, index);
  }, [saveAlto]);
  
  /**
   * Increase the zoom level
   */
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  }, [setZoom]);
  
  /**
   * Decrease the zoom level
   */
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, [setZoom]);
  
  /**
   * Reset the zoom level to 1
   */
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, [setZoom]);
  
  return {
    requestPageAssets: handleRequestPageAssets,
    saveAlto: handleSaveAlto,
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    resetZoom: handleResetZoom,
    currentZoom: zoom
  };
}; 
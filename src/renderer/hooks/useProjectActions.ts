import { useCallback } from 'react';
import { useProject } from '../context';

/**
 * Custom hook for project-related actions
 * This hook provides a set of functions for common project operations
 */
export const useProjectActions = () => {
  const { 
    createProject, 
    openProject, 
    addImages, 
    addAltos, 
    removeAsset, 
    updatePageDone 
  } = useProject();
  
  /**
   * Create a new project
   */
  const handleCreateProject = useCallback(() => {
    createProject();
  }, [createProject]);
  
  /**
   * Open an existing project
   * @param projectPath Optional path to a specific project
   */
  const handleOpenProject = useCallback((projectPath?: string) => {
    openProject(projectPath);
  }, [openProject]);
  
  /**
   * Add images to the current project
   */
  const handleAddImages = useCallback(() => {
    addImages();
  }, [addImages]);
  
  /**
   * Add ALTO files to the current project
   */
  const handleAddAltos = useCallback(() => {
    addAltos();
  }, [addAltos]);
  
  /**
   * Remove an asset from the current project
   * @param directory The directory type ('images' or 'altos')
   * @param name The file name to remove
   */
  const handleRemoveAsset = useCallback((directory: 'images' | 'altos', name: string) => {
    removeAsset(directory, name);
  }, [removeAsset]);
  
  /**
   * Mark a page as done or not done
   * @param done Whether the page is done
   * @param index The index of the page
   */
  const handleUpdatePageDone = useCallback((done: boolean, index: number) => {
    updatePageDone(done, index);
  }, [updatePageDone]);
  
  return {
    createProject: handleCreateProject,
    openProject: handleOpenProject,
    addImages: handleAddImages,
    addAltos: handleAddAltos,
    removeAsset: handleRemoveAsset,
    updatePageDone: handleUpdatePageDone,
  };
}; 
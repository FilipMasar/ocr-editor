/**
 * Service module for handling editor-related operations
 * 
 * This service centralizes all editor operations and provides a clean interface
 * for the handlers. It encapsulates the business logic and data access.
 */
import { 
  PageAssets, 
  ValidationStatus 
} from '../../shared/ipc/editor-channel';
import { AltoJson } from '../../renderer/types/alto';

// Import existing functions
import { 
  getPageAssets as getPageAssetsUtil, 
  saveAlto as saveAltoUtil 
} from '../utils/editor';

import { projectService } from './ProjectService';

/**
 * Service for managing editor operations
 */
class EditorService {
  /**
   * Gets assets for a page (image and ALTO file)
   * 
   * @param imageFileName The image file name
   * @param altoFileName The ALTO file name
   * @returns The page assets including image URI and ALTO content
   * @throws Error if no project is open
   */
  async getPageAssets(
    imageFileName: string, 
    altoFileName: string
  ): Promise<PageAssets> {
    const currentProjectPath = projectService.getCurrentProjectPath();
    
    if (!currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    if (!imageFileName || !altoFileName) {
      throw new Error("Invalid file names: both image and ALTO file names are required");
    }
    
    const pageAssets = await getPageAssetsUtil(
      currentProjectPath, 
      { imageFileName, altoFileName }
    );
    
    // Convert validation format if needed
    const validation = pageAssets.validationStatus 
      ? this.convertValidationFormat(pageAssets.validationStatus) 
      : undefined;
    
    return {
      imageUri: pageAssets.imageUri,
      altoJson: pageAssets.altoJson,
      altoVersion: pageAssets.altoVersion,
      validationStatus: validation
    };
  }
  
  /**
   * Saves an ALTO file
   * 
   * @param fileName The ALTO file name to save
   * @param alto The ALTO JSON content
   * @returns Validation results from saving
   * @throws Error if no project is open
   */
  async saveAlto(
    fileName: string, 
    alto: AltoJson
  ): Promise<{ validation?: ValidationStatus }> {
    const currentProjectPath = projectService.getCurrentProjectPath();
    
    if (!currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    if (!fileName) {
      throw new Error("Invalid file name: ALTO file name is required");
    }
    
    const saveResult = await saveAltoUtil(
      currentProjectPath,
      fileName,
      alto
    );
    
    // Convert validation format if needed
    const validation = saveResult?.validation 
      ? this.convertValidationFormat(saveResult.validation) 
      : undefined;
    
    return { validation };
  }
  
  /**
   * Converts old validation format to new ValidationStatus format
   * 
   * @param oldValidation The old validation format
   * @returns The new ValidationStatus format
   */
  private convertValidationFormat(oldValidation: { valid: boolean; errors?: string }): ValidationStatus {
    const errors = oldValidation.errors 
      ? oldValidation.errors.split('\n').filter(Boolean) 
      : [];
      
    return {
      isValid: oldValidation.valid,
      errors: errors.length > 0 ? errors : undefined,
      warnings: undefined
    };
  }
}

// Export a singleton instance
export const editorService = new EditorService(); 
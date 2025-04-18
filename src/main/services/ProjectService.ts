/**
 * Service module for handling project-related operations
 * 
 * This service centralizes all project operations and provides a clean interface
 * for the handlers. It encapsulates the business logic and data access.
 */
import { BrowserWindow } from 'electron';
import { 
  ProjectAssetList 
} from '../../shared/ipc/project-channel';

// Import existing functions
import {
  createProject as createProjectUtil,
  addAltosToProject as addAltosToProjectUtil,
  addImagesToProject as addImagesToProjectUtil,
  getProjectAssetList as getProjectAssetListUtil,
  openProject as openProjectUtil,
  removeAssetFromProject as removeAssetFromProjectUtil,
} from '../utils/project';

import {
  getDonePages as getDonePagesUtil,
  markAsDone as markAsDoneUtil,
  removeFromDone as removeFromDoneUtil,
  removeWerValues as removeWerValuesUtil,
  resetDoneProgress as resetDoneProgressUtil,
} from '../utils/configData';

import calculateWer from '../utils/wer';

/**
 * Service for managing project operations
 */
class ProjectService {
  private currentProjectPath: string | undefined;
  private currentProjectAssets: ProjectAssetList | undefined;

  /**
   * Creates a new project
   * 
   * @param window The main browser window
   * @returns The path to the created project, or undefined if creation failed
   */
  async createProject(window: BrowserWindow): Promise<string | undefined> {
    this.currentProjectPath = await createProjectUtil(window);
    
    if (this.currentProjectPath) {
      this.currentProjectAssets = [];
      return this.currentProjectPath;
    }
    
    return undefined;
  }

  /**
   * Opens an existing project
   * 
   * @param window The main browser window
   * @param projectPath Optional path to a specific project to open
   * @returns The path to the opened project, or undefined if opening failed
   */
  async openProject(window: BrowserWindow, projectPath?: string): Promise<string | undefined> {
    this.currentProjectPath = await openProjectUtil(window, projectPath);
    
    if (this.currentProjectPath) {
      this.currentProjectAssets = await this.getProjectAssetList();
      return this.currentProjectPath;
    }
    
    return undefined;
  }

  /**
   * Gets the current project path
   * @returns The current project path or undefined if no project is open
   */
  getCurrentProjectPath(): string | undefined {
    return this.currentProjectPath;
  }

  /**
   * Sets the current project path
   * @param path The project path to set
   */
  setCurrentProjectPath(path: string | undefined): void {
    this.currentProjectPath = path;
  }

  /**
   * Gets the list of assets in the project
   * @returns The list of project assets
   * @throws Error if no project is open
   */
  async getProjectAssetList(): Promise<ProjectAssetList> {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    this.currentProjectAssets = await getProjectAssetListUtil(this.currentProjectPath);
    return this.currentProjectAssets;
  }

  /**
   * Adds images to the project
   * 
   * @param window The main browser window
   * @returns The updated list of project assets
   * @throws Error if no project is open
   */
  async addImages(window: BrowserWindow): Promise<ProjectAssetList> {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    await addImagesToProjectUtil(window, this.currentProjectPath);
    resetDoneProgressUtil(this.currentProjectPath);
    removeWerValuesUtil(this.currentProjectPath);
    
    return this.getProjectAssetList();
  }

  /**
   * Adds ALTO files to the project
   * 
   * @param window The main browser window
   * @returns The updated list of project assets
   * @throws Error if no project is open
   */
  async addAltos(window: BrowserWindow): Promise<ProjectAssetList> {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    await addAltosToProjectUtil(window, this.currentProjectPath);
    
    return this.getProjectAssetList();
  }

  /**
   * Removes an asset from the project
   * 
   * @param directory The directory type ('images' or 'altos')
   * @param name The file name to remove
   * @returns The updated list of project assets
   * @throws Error if no project is open
   */
  async removeAsset(directory: 'images' | 'altos', name: string): Promise<ProjectAssetList> {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    await removeAssetFromProjectUtil(this.currentProjectPath, directory, name);
    
    return this.getProjectAssetList();
  }

  /**
   * Marks a page as done and calculates WER
   * 
   * @param index The index of the page
   * @param fileName The ALTO file name
   * @returns The calculated WER value
   * @throws Error if no project is open
   */
  markAsDone(index: number, fileName: string): number | undefined {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    markAsDoneUtil(this.currentProjectPath, index);
    
    return calculateWer(this.currentProjectPath, fileName, index);
  }

  /**
   * Removes a page from the done list
   * 
   * @param index The index of the page
   * @throws Error if no project is open
   */
  removeFromDone(index: number): void {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    removeFromDoneUtil(this.currentProjectPath, index);
  }

  /**
   * Gets the list of done pages
   * 
   * @returns Array of page indices that are marked as done
   * @throws Error if no project is open
   */
  getDonePages(): number[] {
    if (!this.currentProjectPath) {
      throw new Error("Project path isn't defined");
    }
    
    return getDonePagesUtil(this.currentProjectPath);
  }
}

// Export a singleton instance
export const projectService = new ProjectService(); 
/**
 * Service module for handling configuration-related operations
 * 
 * This service centralizes all configuration operations and provides a clean interface
 * for the handlers. It encapsulates the business logic and data access.
 */
import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { RecentProject } from '../../shared/ipc/config-channel';
import { Settings } from '../../renderer/types/app';

// Import existing functions
import {
  getRecentProjects as getRecentProjectsUtil,
  removeFromRecentProjects as removeFromRecentProjectsUtil
} from '../utils/configData';

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
    hyphens: false,
    spaces: false,
  },
};

/**
 * Service for managing configuration operations
 */
export class ConfigService {
  private settingsFilePath: string;

  constructor() {
    // Set up settings file path in user's app data directory
    this.settingsFilePath = path.join(
      app.getPath('userData'),
      'settings.json'
    );
  }

  /**
   * Gets the list of recent projects
   * 
   * @returns Array of recent projects
   */
  getRecentProjects(): RecentProject[] {
    // The original implementation returns string[] but our interface expects RecentProject[]
    // Here we convert the format
    const recentProjectPaths = getRecentProjectsUtil();
    
    return recentProjectPaths.map(path => {
      // Extract the project name from the path
      const name = path.split('/').pop() || path;
      
      // Create a RecentProject object
      return {
        path,
        name,
        lastOpened: new Date().toISOString() // We don't have this data, so use current time
      };
    });
  }
  
  /**
   * Removes a project from the recent projects list
   * 
   * @param projectPath The path of the project to remove
   * @returns Updated list of recent projects
   */
  removeRecentProject(projectPath: string): RecentProject[] {
    if (!projectPath) {
      throw new Error("Project path is required");
    }
    
    removeFromRecentProjectsUtil(projectPath);
    
    return this.getRecentProjects();
  }

  /**
   * Gets the application settings
   * 
   * @returns Application settings
   */
  getSettings(): Settings {
    try {
      if (fs.existsSync(this.settingsFilePath)) {
        const data = fs.readFileSync(this.settingsFilePath, 'utf8');
        return JSON.parse(data) as Settings;
      }
    } catch (error) {
      console.error('Error reading settings file:', error);
    }
    
    return defaultSettings;
  }

  /**
   * Saves the application settings
   * 
   * @param settings Settings to save
   * @returns Updated settings
   */
  saveSettings(settings: Settings): Settings {
    try {
      fs.writeFileSync(
        this.settingsFilePath,
        JSON.stringify(settings, null, 2),
        'utf8'
      );
      return settings;
    } catch (error) {
      console.error('Error saving settings file:', error);
      return this.getSettings();
    }
  }
}

// Export a singleton instance
export const configService = new ConfigService(); 
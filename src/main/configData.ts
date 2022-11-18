import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const dataPath = app.getPath('userData');
const filePath = path.join(dataPath, 'config.json');

const getConfig = () => {
  const defaultData = {};
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    return defaultData;
  }
};

const writeConfigData = (key: string, value: any) => {
  const config = getConfig();
  config[key] = value;
  fs.writeFileSync(filePath, JSON.stringify(config));
};

const readConfigData = (key: string) => {
  const config = getConfig();
  return config[key];
};

export const getRecentProjects = () => {
  const recentProjects = readConfigData('recentProjects') || [];
  return recentProjects;
};

export const addToRecentProjects = (projectPath: string) => {
  const recentProjects = readConfigData('recentProjects') || [];

  if (recentProjects.includes(projectPath)) {
    // Remove the project from the list
    recentProjects.splice(recentProjects.indexOf(projectPath), 1);
  }
  // Add the project to the top of the list
  recentProjects.unshift(projectPath);

  writeConfigData('recentProjects', recentProjects);
};

export const removeFromRecentProjects = (projectPath: string) => {
  const recentProjects = readConfigData('recentProjects') || [];

  if (recentProjects.includes(projectPath)) {
    // Remove the project from the list
    recentProjects.splice(recentProjects.indexOf(projectPath), 1);
  }

  writeConfigData('recentProjects', recentProjects);
};

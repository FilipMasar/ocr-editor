import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const dataPath = app.getPath('userData');
const filePath = path.join(dataPath, 'config.json');

// Define config value types for better type safety
type ConfigValue = 
  | string 
  | number 
  | boolean 
  | null 
  | string[]
  | number[]
  | { [key: string]: ConfigValue }
  | Record<string, number>;

interface Config {
  [key: string]: ConfigValue;
}

const getConfig = (): Config => {
  const defaultData: Config = {};
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    return defaultData;
  }
};

const writeConfigData = (key: string, value: ConfigValue): void => {
  const config = getConfig();
  config[key] = value;
  fs.writeFileSync(filePath, JSON.stringify(config));
};

const readConfigData = (key: string): ConfigValue | undefined => {
  const config = getConfig();
  return config[key];
};

export const getRecentProjects = (): string[] => {
  const recentProjects = readConfigData('recentProjects') as string[] || [];
  return recentProjects;
};

export const addToRecentProjects = (projectPath: string): void => {
  const recentProjects = readConfigData('recentProjects') as string[] || [];

  if (recentProjects.includes(projectPath)) {
    // Remove the project from the list
    recentProjects.splice(recentProjects.indexOf(projectPath), 1);
  }
  // Add the project to the top of the list
  recentProjects.unshift(projectPath);

  writeConfigData('recentProjects', recentProjects);
};

export const removeFromRecentProjects = (projectPath: string): void => {
  const recentProjects = readConfigData('recentProjects') as string[] || [];

  if (recentProjects.includes(projectPath)) {
    // Remove the project from the list
    recentProjects.splice(recentProjects.indexOf(projectPath), 1);
  }

  writeConfigData('recentProjects', recentProjects);
};

export const getDonePages = (projectPath: string): number[] => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project && project.done) {
    return project.done;
  }
  return [];
};

export const markAsDone = (projectPath: string, index: number): void => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project) {
    const done = project.done || [];
    if (done.includes(index)) return;
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { ...project, done: [...done, index] },
    });
  } else {
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { done: [index] },
    });
  }
};

export const removeFromDone = (projectPath: string, index: number): void => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project && project.done && project.done.includes(index)) {
    const done = project.done.filter((i: number) => i !== index);
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { ...project, done },
    });
  }
};

export const resetDoneProgress = (projectPath: string): void => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project && project.done) {
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { ...project, done: [] },
    });
  }
};

export const getWerValues = (projectPath: string): Record<string, number> => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project && project.wer) {
    return project.wer;
  }
  return {};
};

export const updateWer = (projectPath: string, index: number, wer: number): void => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project) {
    const werValues = project.wer || {};
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { ...project, wer: { ...werValues, [index]: wer } },
    });
  } else {
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { wer: { [index]: wer } },
    });
  }
};

export const removeWerValues = (projectPath: string): void => {
  const projects = readConfigData('projects') as Record<string, { done?: number[], wer?: Record<string, number> }> || {};
  const project = projects[projectPath];

  if (project && project.wer) {
    writeConfigData('projects', {
      ...projects,
      [projectPath]: { ...project, wer: {} },
    });
  }
};

import { BrowserWindow, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import { addToRecentProjects, getDonePages } from './configData';

type Page = {
  image: string;
  alto: string;
  done: boolean;
};

export type ProjectAssetList = Page[];

export const createProject = async (
  mainWindow: BrowserWindow
): Promise<string | undefined> => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: 'Pick a directory for your project',
    buttonLabel: 'Create',
    nameFieldLabel: 'Project Name',
    showsTagField: false,
    properties: ['createDirectory'],
  });

  if (canceled || filePath === undefined) return undefined;

  const imagesDir = path.join(filePath, 'images');
  const altosDir = path.join(filePath, 'altos');
  const originalAltosDir = path.join(filePath, 'original-altos');
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(altosDir, { recursive: true });
  fs.mkdirSync(originalAltosDir, { recursive: true });

  addToRecentProjects(filePath);

  return filePath;
};

export const openProject = async (
  mainWindow: BrowserWindow,
  openPath: string | undefined
): Promise<string | undefined> => {
  let projectPath = openPath;

  if (projectPath === undefined) {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
      title: 'Pick a directory with your project',
      buttonLabel: 'Open',
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length === 0) return undefined;

    [projectPath] = filePaths;
  }

  // validate project directory
  const imagesDir = path.join(projectPath, 'images');
  const altosDir = path.join(projectPath, 'altos');
  const originalAltosDir = path.join(projectPath, 'original-altos');

  if (
    !fs.existsSync(imagesDir) ||
    !fs.existsSync(altosDir) ||
    !fs.existsSync(originalAltosDir)
  ) {
    throw new Error('Directory is not a valid project directory!');
  }

  addToRecentProjects(projectPath);

  return projectPath;
};

export const addImagesToProject = async (
  mainWindow: BrowserWindow,
  projectPath: string
) => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Pick images to add to your project',
    buttonLabel: 'Add',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
  });

  if (canceled) return;

  filePaths.forEach((filePath) => {
    const newPath = path.join(projectPath, 'images', path.basename(filePath));
    fs.copyFileSync(filePath, newPath);
  });
};

export const addAltosToProject = async (
  mainWindow: BrowserWindow,
  projectPath: string
) => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Pick alto files to add to your project',
    buttonLabel: 'Add',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Alto xml files', extensions: ['xml'] }],
  });

  if (canceled) return;

  filePaths.forEach((filePath) => {
    const newPath = path.join(projectPath, 'altos', path.basename(filePath));
    const newPath2 = path.join(
      projectPath,
      'original-altos',
      path.basename(filePath)
    );
    fs.copyFileSync(filePath, newPath);
    fs.copyFileSync(filePath, newPath2);
  });
};

export const removeAssetFromProject = async (
  projectPath: string,
  directory: 'images' | 'altos',
  name: string
) => {
  const filePath = path.join(projectPath, directory, name);
  fs.unlinkSync(filePath);

  if (directory === 'altos') {
    // remove original alto file as well
    const originalAltoPath = path.join(projectPath, 'original-altos', name);
    fs.unlinkSync(originalAltoPath);
  }
};

export const getProjectAssetList = async (
  projectPath: string | undefined
): Promise<ProjectAssetList> => {
  if (projectPath === undefined) throw new Error("Project path isn't defined");

  const images = fs.readdirSync(path.join(projectPath, 'images'));
  const altos = fs.readdirSync(path.join(projectPath, 'altos'));

  const donePages = getDonePages(projectPath);

  const assetList: ProjectAssetList = [];
  for (let i = 0; i < Math.max(images.length, altos.length); i += 1) {
    assetList.push({
      image: images[i] || '',
      alto: altos[i] || '',
      done: donePages.includes(i),
    });
  }

  return assetList;
};

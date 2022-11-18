import { BrowserWindow, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

// TODO
type PageData = {
  image: string;
  alto: any; // json
};

type PageFileNames = {
  image: string;
  alto: string;
};

export type ProjectAssetList = PageFileNames[];

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

  if (canceled || filePath === undefined) {
    console.log('User canceled');
    return undefined;
  }

  const imagesDir = path.join(filePath, 'images');
  const altosDir = path.join(filePath, 'altos');
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(altosDir, { recursive: true });

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

    if (canceled || filePaths.length === 0) {
      console.log('User canceled');
      return undefined;
    }

    [projectPath] = filePaths;
  }

  // validate project directory
  const imagesDir = path.join(projectPath, 'images');
  const altosDir = path.join(projectPath, 'altos');
  if (!fs.existsSync(imagesDir) || !fs.existsSync(altosDir)) {
    console.error('Invalid project directory');
    return undefined;
  }

  return projectPath;
};

export const addImagesToProject = async (
  mainWindow: BrowserWindow,
  projectPath: string | undefined
) => {
  if (projectPath === undefined) {
    console.error('projectPath is not defined');
    return;
  }

  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Pick images to add to your project',
    buttonLabel: 'Add',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
  });

  if (canceled) {
    console.log('User canceled');
    return;
  }

  filePaths.forEach((filePath) => {
    const newPath = path.join(projectPath, 'images', path.basename(filePath));
    fs.copyFileSync(filePath, newPath);
  });
};

export const addAltosToProject = async (
  mainWindow: BrowserWindow,
  projectPath: string | undefined
) => {
  if (projectPath === undefined) {
    console.error('projectPath is not defined');
    return;
  }

  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'Pick alto files to add to your project',
    buttonLabel: 'Add',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Alto xml files', extensions: ['xml'] }],
  });

  if (canceled) {
    console.log('User canceled');
    return;
  }

  filePaths.forEach((filePath) => {
    const newPath = path.join(projectPath, 'altos', path.basename(filePath));
    fs.copyFileSync(filePath, newPath);
  });
};

export const removeAssetFromProject = async (
  projectPath: string | undefined,
  directory: 'images' | 'altos',
  name: string
) => {
  if (projectPath === undefined) {
    console.error('projectPath is not defined');
    return;
  }

  const filePath = path.join(projectPath, directory, name);
  fs.unlinkSync(filePath);
};

export const getProjectAssetList = async (
  projectPath: string | undefined
): Promise<ProjectAssetList> => {
  if (projectPath === undefined) {
    console.error('projectPath is not defined');
    return [];
  }

  const images = fs.readdirSync(path.join(projectPath, 'images'));
  const altos = fs.readdirSync(path.join(projectPath, 'altos'));

  const assetList: ProjectAssetList = [];
  for (let i = 0; i < Math.max(images.length, altos.length); i += 1) {
    assetList.push({
      image: images[i] || '',
      alto: altos[i] || '',
    });
  }

  return assetList;
};

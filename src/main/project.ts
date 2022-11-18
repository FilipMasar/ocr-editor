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
  const res = await dialog.showSaveDialog(mainWindow, {
    title: 'Pick a directory for your project',
    buttonLabel: 'Create',
    nameFieldLabel: 'Project Name',
    showsTagField: false,
    properties: ['createDirectory'],
  });
  const { filePath, canceled } = res;
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

export const addImagesToProject = async (
  mainWindow: BrowserWindow,
  projectPath: string | undefined
) => {
  if (projectPath === undefined) {
    console.error('projectPath is not defined');
    return;
  }

  const res = await dialog.showOpenDialog(mainWindow, {
    title: 'Pick images to add to your project',
    buttonLabel: 'Add',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
  });
  const { filePaths, canceled } = res;
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

  const res = await dialog.showOpenDialog(mainWindow, {
    title: 'Pick alto files to add to your project',
    buttonLabel: 'Add',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Alto xml files', extensions: ['xml'] }],
  });
  const { filePaths, canceled } = res;
  if (canceled) {
    console.log('User canceled');
    return;
  }

  filePaths.forEach((filePath) => {
    const newPath = path.join(projectPath, 'altos', path.basename(filePath));
    fs.copyFileSync(filePath, newPath);
  });
};

export const getProjectAssetList = async (
  projectPath: string | undefined
): Promise<ProjectAssetList> => {
  if (projectPath === undefined) {
    console.error('projectPath is not defined');
    return [];
  }

  const images = fs
    .readdirSync(path.join(projectPath, 'images'))
    .map((file) => {
      console.log(file);
      return file;
    });

  const altos = fs.readdirSync(path.join(projectPath, 'altos')).map((file) => {
    console.log(file);
    return file;
  });

  const assetList: ProjectAssetList = [];
  for (let i = 0; i < Math.max(images.length, altos.length); i += 1) {
    assetList.push({
      image: images[i] || '',
      alto: altos[i] || '',
    });
  }

  return assetList;
};

import { ProjectAssetList as BaseProjectAssetList } from '../../shared/ipc/project-channel';

export type ProjectAssetList = BaseProjectAssetList;

export type ProjectContextValues = {
  projectAssets: ProjectAssetList | undefined;
  errorMessage: string | undefined;
  resetErrorMessage: () => void;
  createProject: () => void;
  openProject: (projectPath?: string) => void;
  closeProject: () => void;
  addImages: () => void;
  addAltos: () => void;
  removeAsset: (directory: 'images' | 'altos', name: string) => void;
  updatePageDone: (done: boolean, index: number) => void;
};

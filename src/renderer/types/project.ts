export type ProjectAsset = {
  image: string;
  alto: string;
};

export type ProjectAssets = ProjectAsset[];

export type ProjectContextValues = {
  projectAssets: ProjectAssets | undefined;
  createProject: () => void;
  addImages: () => void;
  addAltos: () => void;
};

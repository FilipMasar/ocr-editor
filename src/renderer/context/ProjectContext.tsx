/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProjectAssets, ProjectContextValues } from 'renderer/types/project';

// Context
const ProjectContext = createContext({} as ProjectContextValues);

// useContext
export const useProject = (): ProjectContextValues =>
  useContext(ProjectContext);

// Provider
const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectAssets, setProjectAssets] = useState<ProjectAssets>();

  const createProject = () => {
    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: 'CREATE_PROJECT',
    });
  };

  const openProject = () => {
    console.log('open project');
  };

  const addImages = () => {
    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: 'ADD_IMAGES',
    });
  };

  const addAltos = () => {
    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: 'ADD_ALTOS',
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('project-channel', (data) => {
      console.log(data);
      if (data.action === 'UPDATE_ASSET_LIST') {
        console.log(data.payload);
        setProjectAssets(data.payload);
      }
    });
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projectAssets,
        createProject,
        addImages,
        addAltos,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

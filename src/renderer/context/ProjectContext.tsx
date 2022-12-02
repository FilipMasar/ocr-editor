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
export const useProject = () => useContext(ProjectContext);

// Provider
const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectAssets, setProjectAssets] = useState<ProjectAssets>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const createProject = () => {
    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: 'CREATE_PROJECT',
    });
  };

  const openProject = (projectPath?: string) => {
    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: 'OPEN_PROJECT',
      payload: projectPath,
    });
  };

  const closeProject = () => {
    setProjectAssets(undefined);
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

  const removeAsset = (directory: 'images' | 'altos', name: string) => {
    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: 'REMOVE_ASSET',
      payload: { directory, name },
    });
  };

  const resetErrorMessage = () => {
    setErrorMessage(undefined);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('project-channel', (data) => {
      console.log('project-channel', data);
      switch (data.action) {
        case 'UPDATE_ASSET_LIST':
          setProjectAssets(data.payload);
          break;
        case 'ERROR':
          setErrorMessage(String(data.payload));
          break;
        default:
          console.log('Unhandled action:', data.action);
      }
    });
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projectAssets,
        errorMessage,
        resetErrorMessage,
        createProject,
        openProject,
        closeProject,
        addImages,
        addAltos,
        removeAsset,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

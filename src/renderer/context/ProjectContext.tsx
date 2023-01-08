/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ProjectAssetList } from 'main/project';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProjectContextValues } from 'renderer/types/project';

// Context
const ProjectContext = createContext({} as ProjectContextValues);

// useContext
export const useProject = () => useContext(ProjectContext);

// Provider
const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectAssets, setProjectAssets] = useState<ProjectAssetList>();
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

  const updatePageDone = (done: boolean, index: number) => {
    setProjectAssets((prev) => {
      const newState = prev?.map((page, i) => {
        if (i === index) {
          return {
            ...page,
            done,
            wer: done ? page.wer : undefined,
          };
        }
        return page;
      });
      return newState;
    });

    window.electron.ipcRenderer.sendMessage('project-channel', {
      action: done ? 'MARK_AS_DONE' : 'REMOVE_FROM_DONE',
      payload: {
        fileName: projectAssets?.[index].alto,
        index,
      },
    });
  };

  const updateWer = useCallback((index: number, wer: number | undefined) => {
    console.log('updateWer', index, wer);
    setProjectAssets((prev) => {
      const newState = prev?.map((page, i) => {
        if (i === index) {
          return { ...page, wer };
        }
        return page;
      });
      return newState;
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('project-channel', (data) => {
      console.log('project-channel', data);
      switch (data.action) {
        case 'UPDATE_ASSET_LIST':
          setProjectAssets(data.payload);
          break;
        case 'WER_UPDATED':
          updateWer(data.payload.index, data.payload.value);
          break;
        case 'ERROR':
          setErrorMessage(String(data.payload));
          break;
        default:
          console.log('Unhandled action:', data.action);
      }
    });
  }, [updateWer]);

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
        updatePageDone,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

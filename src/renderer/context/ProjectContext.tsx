import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProjectAssetList, ProjectContextValues } from '../types/project';

/**
 * Context for managing project-related state and operations
 */
const ProjectContext = createContext({} as ProjectContextValues);

/**
 * Hook to access the project context
 */
export const useProject = () => useContext(ProjectContext);

/**
 * Provider component for the project context
 */
export const ProjectProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectAssets, setProjectAssets] = useState<ProjectAssetList>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const createProject = () => {
    window.electron.ipc.send('project-channel', 'CREATE_PROJECT');
  };

  const openProject = (projectPath?: string) => {
    window.electron.ipc.send('project-channel', 'OPEN_PROJECT', projectPath);
  };

  const closeProject = () => {
    setProjectAssets(undefined);
  };

  const addImages = () => {
    window.electron.ipc.send('project-channel', 'ADD_IMAGES');
  };

  const addAltos = () => {
    window.electron.ipc.send('project-channel', 'ADD_ALTOS');
  };

  const removeAsset = (directory: 'images' | 'altos', name: string) => {
    window.electron.ipc.send('project-channel', 'REMOVE_ASSET', { directory, name });
  };

  const resetErrorMessage = () => {
    setErrorMessage(undefined);
  };

  const updatePageDone = (done: boolean, index: number) => {
    setProjectAssets((prev?: ProjectAssetList) => {
      if (!prev) return prev;
      
      const newState = prev.map((page, i) => {
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

    const action = done ? 'MARK_AS_DONE' : 'REMOVE_FROM_DONE';
    if (projectAssets?.[index]?.alto) {
      window.electron.ipc.send('project-channel', action, {
        fileName: projectAssets[index].alto,
        index,
      });
    }
  };

  const updateWer = useCallback((index: number, wer: number | undefined) => {
    console.log('updateWer', index, wer);
    setProjectAssets((prev?: ProjectAssetList) => {
      if (!prev) return prev;
      
      const newState = prev.map((page, i) => {
        if (i === index) {
          return { ...page, wer };
        }
        return page;
      });
      return newState;
    });
  }, []);

  useEffect(() => {
    // Setup IPC listeners with type safety
    const unsubscribeAssetList = window.electron.ipc.on(
      'project-channel', 
      'UPDATE_ASSET_LIST', 
      (payload) => {
        setProjectAssets(payload);
      }
    );

    const unsubscribeWerUpdated = window.electron.ipc.on(
      'project-channel', 
      'WER_UPDATED', 
      (payload) => {
        updateWer(payload.index, payload.value);
      }
    );

    // Setup error handler
    const unsubscribeError = window.electron.ipc.onError((message) => {
      setErrorMessage(message);
    });

    // Clean up listeners when component unmounts
    return () => {
      unsubscribeAssetList();
      unsubscribeWerUpdated();
      unsubscribeError();
    };
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

import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AltoJson } from '../../types/alto';
import { useAlto } from '../app/AltoContext';

/**
 * Editor context for managing editor state and operations
 */
interface EditorProviderValue {
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  imageSrc: string | undefined;
  setImageSrc: Dispatch<SetStateAction<string | undefined>>;
  requestPageAssets: (imageFileName: string, altoFileName: string) => void;
  saveAlto: (fileName: string, index: number) => void;
  saving: boolean;
  setUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  unsavedChanges: boolean;
  loading: boolean;
}

// Context
const EditorContext = createContext({} as EditorProviderValue);

/**
 * Hook to access the editor context
 */
export const useEditor = () => useContext(EditorContext);

/**
 * Provider component for the editor context
 */
const EditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alto, setAlto, setAltoVersion, setValidationStatus } = useAlto();

  const requestPageAssets = useCallback(
    (imageFileName: string, altoFileName: string) => {
      if (imageFileName && altoFileName) {
        setLoading(true);
        window.electron.ipc.send(
          'editor-channel',
          'GET_PAGE_ASSETS',
          { imageFileName, altoFileName }
        );
      }
    },
    []
  );

  const saveAlto = useCallback(
    (fileName: string, index: number) => {
      setSaving(true);
      window.electron.ipc.send(
        'editor-channel',
        'SAVE_ALTO',
        { fileName, alto, index }
      );
    },
    [alto]
  );

  useEffect(() => {
    // Register handlers with typed payloads
    const unsubscribePageAssets = window.electron.ipc.on(
      'editor-channel',
      'PAGE_ASSETS',
      (payload) => {
        setImageSrc(payload.imageUri);
        setAlto(payload.altoJson as AltoJson);
        
        // Set ALTO version and validation status if available
        if (payload.altoVersion) {
          setAltoVersion(payload.altoVersion);
        }
        
        if (payload.validationStatus) {
          setValidationStatus(payload.validationStatus);
        }
        
        setUnsavedChanges(false);
        setTimeout(() => setLoading(false), 1000);
      }
    );
    
    const unsubscribeAltoSaved = window.electron.ipc.on(
      'editor-channel',
      'ALTO_SAVED',
      (payload) => {
        // Update validation status if returned from save operation
        if (payload?.validation) {
          setValidationStatus(payload.validation);
        }
        
        setTimeout(() => {
          setSaving(false);
          setUnsavedChanges(false);
        }, 1000); // to make sure that user sees the loader
      }
    );
    
    // Register error handler
    const unsubscribeError = window.electron.ipc.onError((message) => {
      console.error('Editor IPC error:', message);
      setLoading(false);
      setSaving(false);
    });
    
    // Clean up the event listeners
    return () => {
      unsubscribePageAssets();
      unsubscribeAltoSaved();
      unsubscribeError();
    };
  }, [
    setAlto, 
    setAltoVersion, 
    setValidationStatus, 
    setImageSrc, 
    setUnsavedChanges, 
    setLoading,
    setSaving,
    alto
  ]);

  return (
    <EditorContext.Provider
      value={{
        zoom,
        setZoom,
        imageSrc,
        setImageSrc,
        requestPageAssets,
        saveAlto,
        saving,
        setUnsavedChanges,
        unsavedChanges,
        loading,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider; 
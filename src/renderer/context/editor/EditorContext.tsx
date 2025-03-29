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
  unsavedChanges: boolean;
  setIsFreshPage: Dispatch<SetStateAction<boolean>>;
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
  const [isFreshPage, setIsFreshPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialAlto, setInitialAlto] = useState<AltoJson | null>(null);
  const { alto, setAlto, setAltoVersion, setValidationStatus } = useAlto();

  useEffect(() => {
    if (alto && initialAlto) {
      if (isFreshPage) {
        setIsFreshPage(false);
      } else {
        // Only set unsavedChanges true if alto is different from initialAlto
        const currentJSON = JSON.stringify(alto);
        const initialJSON = JSON.stringify(initialAlto);
        if (currentJSON !== initialJSON) {
          setUnsavedChanges(true);
        }
      }
    }
  }, [alto, initialAlto, isFreshPage, setUnsavedChanges, setIsFreshPage]);

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
        setAlto(payload.altoJson);
        setInitialAlto(JSON.parse(JSON.stringify(payload.altoJson))); // Make a deep copy
        
        // Set ALTO version and validation status if available
        if (payload.altoVersion) {
          setAltoVersion(payload.altoVersion);
        }
        
        if (payload.validationStatus) {
          setValidationStatus(payload.validationStatus);
        }
        
        setIsFreshPage(true);
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
        
        // Update initialAlto to current alto state
        setInitialAlto(JSON.parse(JSON.stringify(alto)));
        
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
    setIsFreshPage, 
    setUnsavedChanges, 
    setLoading,
    setSaving,
    setInitialAlto,
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
        unsavedChanges,
        setIsFreshPage,
        loading,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider; 
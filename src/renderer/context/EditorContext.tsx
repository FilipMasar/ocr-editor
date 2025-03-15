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
import { AltoJson } from '../types/alto';
import { useAlto } from './AltoContext';

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

// useContext
export const useEditor = () => useContext(EditorContext);

// Provider
const EditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isFreshPage, setIsFreshPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { alto, setAlto, setAltoVersion, setValidationStatus } = useAlto();

  useEffect(() => {
    if (setAlto !== undefined) {
      if (isFreshPage) {
        setIsFreshPage(false);
      } else {
        setUnsavedChanges(true);
      }
    }
  }, [setAlto, isFreshPage, setUnsavedChanges, setIsFreshPage]);

  const requestPageAssets = useCallback(
    (imageFileName: string, altoFileName: string) => {
      if (imageFileName && altoFileName) {
        setLoading(true);
        window.electron.ipcRenderer.sendMessage('editor-channel', {
          action: 'GET_PAGE_ASSETS',
          payload: { imageFileName, altoFileName },
        });
      }
    },
    []
  );

  const saveAlto = useCallback(
    (fileName: string, index: number) => {
      setSaving(true);
      window.electron.ipcRenderer.sendMessage('editor-channel', {
        action: 'SAVE_ALTO',
        payload: { fileName, alto, index },
      });
    },
    [alto]
  );

  useEffect(() => {
    // Store the unsubscribe function
    const unsubscribe = window.electron.ipcRenderer.on('editor-channel', (data) => {
      console.log('editor-channel', data);
      switch (data.action) {
        case 'PAGE_ASSETS':
          setImageSrc(data.payload.imageUri);
          setAlto(data.payload.altoJson);
          
          // Set ALTO version and validation status if available
          if (data.payload.altoVersion) {
            setAltoVersion(data.payload.altoVersion);
          }
          
          if (data.payload.validationStatus) {
            setValidationStatus(data.payload.validationStatus);
          }
          
          setIsFreshPage(true);
          setUnsavedChanges(false);
          setTimeout(() => setLoading(false), 1000);
          break;
        case 'ALTO_SAVED':
          // Update validation status if returned from save operation
          if (data.payload && data.payload.validation) {
            setValidationStatus(data.payload.validation);
          }
          
          setTimeout(() => {
            setSaving(false);
            setUnsavedChanges(false);
          }, 1000); // to make sure that user sees the loader
          break;
        case 'ERROR':
          console.log(String(data.payload));
          break;
        default:
          console.log('Unhandled action:', data.action);
      }
    });
    
    // Clean up the event listener using the returned unsubscribe function
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [
    setAlto, 
    setAltoVersion, 
    setValidationStatus, 
    setImageSrc, 
    setIsFreshPage, 
    setUnsavedChanges, 
    setLoading,
    setSaving
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

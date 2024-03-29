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
  const [imageSrc, setImageSrc] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isFreshPage, setIsFreshPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const { alto, setAlto } = useAlto();

  useEffect(() => {
    if (alto !== undefined) {
      if (isFreshPage) {
        setIsFreshPage(false);
      } else {
        setUnsavedChanges(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alto]);

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
    window.electron.ipcRenderer.on('editor-channel', (data) => {
      console.log('editor-channel', data);
      switch (data.action) {
        case 'PAGE_ASSETS':
          setImageSrc(data.payload.imageUri);
          setAlto(data.payload.altoJson);
          setIsFreshPage(true);
          setUnsavedChanges(false);
          setTimeout(() => setLoading(false), 1000);
          break;
        case 'ALTO_SAVED':
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
  }, [setAlto]);

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

import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Settings } from '../types/app';

interface EditorProviderValue {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  imageSrc: string | undefined;
  setImageSrc: Dispatch<SetStateAction<string | undefined>>;
}

const defaultSettings: Settings = {
  zoom: 1,
  imageOpacity: 1,
  show: {
    printSpace: true,
    illustrations: true,
    graphicalElements: true,
    textBlocks: true,
    textLines: true,
    strings: false,
    textFit: false,
    textAbove: false,
  },
};

// Context
const EditorContext = createContext({} as EditorProviderValue);

// useContext
export const useEditor = () => useContext(EditorContext);

// Provider
const EditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [imageSrc, setImageSrc] = useState<string>();

  return (
    <EditorContext.Provider
      value={{
        settings,
        setSettings,
        imageSrc,
        setImageSrc,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;

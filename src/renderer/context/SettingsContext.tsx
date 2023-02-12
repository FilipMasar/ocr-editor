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

interface SettingsProviderValue {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

const defaultSettings: Settings = {
  imageOpacity: 100,
  show: {
    printSpace: true,
    illustrations: true,
    graphicalElements: true,
    textBlocks: true,
    textLines: true,
    strings: false,
    textFit: false,
    textAbove: false,
    textNext: false,
    hyphens: false,
  },
};

// Context
const SettingsContext = createContext({} as SettingsProviderValue);

// useContext
export const useSettings = () => useContext(SettingsContext);

// Provider
const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;

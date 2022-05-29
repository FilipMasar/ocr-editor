import { createContext, Dispatch, SetStateAction } from "react"
import { Settings } from "../types/app"

export const defaultSettings: Settings = {
	zoom: 1,
	imageOpacity: 1,
}

const AppContext = createContext<{
  settings: Settings, 
  setSettings: Dispatch<SetStateAction<Settings>>
}>({ settings: defaultSettings, setSettings: () => null })

export default AppContext
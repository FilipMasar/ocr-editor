import { createContext, Dispatch, SetStateAction } from "react"
import { Settings } from "../types/app"

export const defaultSettings: Settings = {
	zoom: 1,
	imageOpacity: 1,
	show: {
		printSpace: true,
		illustrations: true,
		graphicalElements: true,
		textBlocks: true,
		textLines: true,
		strings: true,
		text: true,
	}
}

const AppContext = createContext<{
  settings: Settings, 
  setSettings: Dispatch<SetStateAction<Settings>>
}>({ settings: defaultSettings, setSettings: () => null })

export default AppContext
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from "react"
import { Settings } from "../types/app"

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
		text: false,
	}
}

const PanelContext = createContext<{
  settings: Settings, 
  setSettings: Dispatch<SetStateAction<Settings>>
}>({ settings: defaultSettings, setSettings: () => null })

const PanelProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [settings, setSettings] = useState<Settings>(defaultSettings)

	return (
		<PanelContext.Provider value={{settings, setSettings}}>
			{children}
		</PanelContext.Provider>
	)
}

const usePanelContext = () => useContext(PanelContext)

export { PanelContext, PanelProvider, usePanelContext }
export default PanelProvider

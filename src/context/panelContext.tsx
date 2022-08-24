import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from "react"
import { Settings } from "../types/app"


interface PanelProviderValue {
  settings: Settings, 
  setSettings: Dispatch<SetStateAction<Settings>>
  imageFile: File | undefined
  setImageFile: Dispatch<SetStateAction<File | undefined>>
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
		text: false,
	}
}

const defaultPanelValue: PanelProviderValue = {
	settings: defaultSettings, 
	setSettings: () => null,
	imageFile: undefined,
	setImageFile: () => null
}

const PanelContext = createContext<PanelProviderValue>(defaultPanelValue)
const usePanelContext = () => useContext(PanelContext)

const PanelProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [settings, setSettings] = useState<Settings>(defaultSettings)
	const [imageFile, setImageFile] = useState<File>()

	return (
		<PanelContext.Provider 
			value={{
				settings, 
				setSettings,
				imageFile,
				setImageFile
			}}
		>
			{children}
		</PanelContext.Provider>
	)
}

export { PanelContext, PanelProvider, usePanelContext }
export default PanelProvider

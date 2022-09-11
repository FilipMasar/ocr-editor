import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from "react"
import { Settings } from "../types/app"


interface PanelProviderValue {
  settings: Settings, 
  setSettings: Dispatch<SetStateAction<Settings>>
  imageSrc: string | undefined
  setImageSrc: Dispatch<SetStateAction<string | undefined>>
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
	}
}

const defaultPanelValue: PanelProviderValue = {
	settings: defaultSettings, 
	setSettings: () => null,
	imageSrc: undefined,
	setImageSrc: () => null
}

const PanelContext = createContext<PanelProviderValue>(defaultPanelValue)
const usePanelContext = () => useContext(PanelContext)

const PanelProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [settings, setSettings] = useState<Settings>(defaultSettings)
	const [imageSrc, setImageSrc] = useState<string>()

	return (
		<PanelContext.Provider 
			value={{
				settings, 
				setSettings,
				imageSrc,
				setImageSrc
			}}
		>
			{children}
		</PanelContext.Provider>
	)
}

export { PanelContext, PanelProvider, usePanelContext }
export default PanelProvider

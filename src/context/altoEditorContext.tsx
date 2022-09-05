import { createContext, FC, PropsWithChildren, useContext, useState } from "react"


interface AltoEditorProviderValue {
  alto: any
  update?: any
  openAltoEditor: (altoElement: any, onUpdate: any) => void
  closeAltoEditor: () => void
}

const defaultAltoEditorValue: AltoEditorProviderValue = {
	alto: undefined,
	update: undefined,
	openAltoEditor: () => null, 
	closeAltoEditor: () => null,
}

const AltoEditorContext = createContext<AltoEditorProviderValue>(defaultAltoEditorValue)
const useAltoEditorContext = () => useContext(AltoEditorContext)

const AltoEditorProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [alto, setAlto] = useState<any>()
	const [update, setUpdate] = useState<any>()

	const openAltoEditor = (altoElement: any, onUpdate: any) => {
		setAlto(altoElement)
		setUpdate(onUpdate)
	}

	const closeAltoEditor = () => {
		setAlto(undefined)
		setUpdate(undefined)
	}

	return (
		<AltoEditorContext.Provider 
			value={{
				alto, 
				update,
				openAltoEditor,
				closeAltoEditor
			}}
		>
			{children}
		</AltoEditorContext.Provider>
	)
}

export { AltoEditorContext, AltoEditorProvider, useAltoEditorContext }
export default AltoEditorProvider

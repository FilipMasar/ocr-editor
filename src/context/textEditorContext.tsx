import { createContext, FC, PropsWithChildren, useContext, useState } from "react"

type ElementToEdit = "ALL" | "TEXTBLOCK" | "TEXTLINE"

interface TextEditorProviderValue {
	type: ElementToEdit
  element: any
  openTextEditor: (type: ElementToEdit, element: any) => void
  closeTextEditor: () => void
}

const defaultTextEditorValue: TextEditorProviderValue = {
	type: "ALL",
	element: undefined,
	openTextEditor: () => null,
	closeTextEditor: () => null,
}

const TextEditorContext = createContext<TextEditorProviderValue>(defaultTextEditorValue)
const useTextEditorContext = () => useContext(TextEditorContext)

const TextEditorProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [elementType, setElementType] = useState<ElementToEdit>("ALL")
	const [altoElement, setAltoElement] = useState<any>()

	const openTextEditor = (type: ElementToEdit, element: any) => {
		setElementType(type)
		setAltoElement(element)
	}

	const closeTextEditor = () => {
		setElementType("ALL")
		setAltoElement(undefined)
	}

	return (
		<TextEditorContext.Provider 
			value={{
				type: elementType,
				element: altoElement,
				openTextEditor,
				closeTextEditor
			}}
		>
			{children}
		</TextEditorContext.Provider>
	)
}

export { TextEditorContext, TextEditorProvider, useTextEditorContext }
export default TextEditorProvider

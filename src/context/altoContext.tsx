import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { TextStyle } from "../types/app"


interface AltoProviderValue {
  alto: any
  setAlto: Dispatch<any>
  styles: Record<string, TextStyle>
  setStyles: Dispatch<SetStateAction<Record<string, TextStyle>>>
  printSpace: any
  illustrations: any
  graphicalElements: any
  updateTextBlock: (textBlock: any, index: number) => void
  updateString: (textBlockIndex: number, textLineIndex: number, textStringIndex: number, value: string) => void
}

const defaultAltoProviderValue: AltoProviderValue = {
	alto: undefined,
	setAlto: () => null,
	styles: {},
	setStyles: () => null,
	printSpace: undefined,
	illustrations: [],
	graphicalElements: [],
	updateTextBlock: () => null,
	updateString: () => null,
}

const AltoContext = createContext<AltoProviderValue>(defaultAltoProviderValue)
const useAltoContext = () => useContext(AltoContext)

const AltoProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [alto, setAlto] = useState<any>()
	const [styles, setStyles] = useState<Record<string, TextStyle>>({})
	const [printSpace, setPrintSpace] = useState<any>()
	const [illustrations, setIllustrations] = useState<any[]>([])
	const [graphicalElements, setGraphicalElements] = useState<any[]>([])
  
	/*
  * Parse styles from Alto file
  */
	useEffect(() => {
		const stylesObj = alto?.alto?.Styles
		if (stylesObj?.TextStyle) {
			if (Array.isArray(stylesObj.TextStyle)) {
				for (const style of stylesObj.TextStyle) {
					setStyles(old => ({ 
						...old, 
						[style["@_ID"]]: {
							fontSize: style["@_FONTSIZE"],
							fontFamily: style["@_FONTFAMILY"],
						} 
					}))
				}
			} else {
				setStyles({
					[stylesObj.TextStyle["@_ID"]]: {
						fontSize: stylesObj.TextStyle["@_FONTSIZE"],
						fontFamily: stylesObj.TextStyle["@_FONTFAMILY"],
					}
				})
			}
		} else {
			setStyles({})
		}
	}, [alto])

	/*
  * Parse PrintSpace from Alto file
  */
	useEffect(() => {
		if (alto?.alto?.Layout?.Page?.PrintSpace) {
			setPrintSpace(alto.alto.Layout.Page.PrintSpace)
		} else {
			setPrintSpace(undefined)
		}
	}, [alto])

	/*
  * Parse Illustration and GraphicalElement from Alto file
  */
	useEffect(() => {
		if (printSpace?.Illustration) {
			if (Array.isArray(printSpace.Illustration)) {
				setIllustrations(printSpace.Illustration)
			} else {
				setIllustrations([printSpace.Illustration])
			}
		} else {
			setIllustrations([])
		}

		setGraphicalElements([])
		if (printSpace?.GraphicalElement) {
			if (Array.isArray(printSpace.GraphicalElement)) {
				setGraphicalElements(printSpace.GraphicalElement)
			} else {
				setGraphicalElements([printSpace.GraphicalElement])
			}
		} else {
			setGraphicalElements([])
		}
	}, [printSpace])

	const updateTextBlock = useCallback((textBlock: any, index: number) => {
		setAlto((old: any) => {
			if (index === -1) {
				return {
					...old,
					alto: {
						...old.alto,
						Layout: {
							...old.alto.Layout,
							Page: {
								...old.alto.Layout.Page,
								PrintSpace: {
									...old.alto.Layout.Page.PrintSpace,
									TextBlock: textBlock
								}
							}
						}
					}
				}
			} else {
				const tmp = old.alto.Layout.Page.PrintSpace.TextBlock
				tmp[index] = textBlock
				return {
					...old,
					alto: {
						...old.alto,
						Layout: {
							...old.alto.Layout,
							Page: {
								...old.alto.Layout.Page,
								PrintSpace: {
									...old.alto.Layout.Page.PrintSpace,
									TextBlock: tmp
								}
							}
						}
					}
				}
			}
		})
	}, [])

	const updateString = useCallback((textBlockIndex: number, textLineIndex: number, textStringIndex: number, value: string) => {
		if (printSpace) {
			const textBlock = textBlockIndex === -1 ? printSpace.TextBlock : printSpace.TextBlock[textBlockIndex]
			if (textLineIndex === -1) {
				if (textStringIndex === -1) {
					textBlock.TextLine.String["@_CONTENT"] = value
				} else {
					textBlock.TextLine.String[textStringIndex]["@_CONTENT"] = value
				}
			} else {
				if (textStringIndex === -1) {
					textBlock.TextLine[textLineIndex].String["@_CONTENT"] = value
				} else {
					textBlock.TextLine[textLineIndex].String[textStringIndex]["@_CONTENT"] = value
				}
			}
			updateTextBlock(textBlock, textBlockIndex)
		}
	}, [printSpace])


	return (
		<AltoContext.Provider 
			value={{
				alto, 
				setAlto,
				styles,
				setStyles,
				printSpace,
				illustrations,
				graphicalElements,
				updateTextBlock,
				updateString
			}}
		>
			{children}
		</AltoContext.Provider>
	)
}

export { AltoContext, AltoProvider, useAltoContext }
export default AltoProvider

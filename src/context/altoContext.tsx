import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { PageDimensions, TextStyle } from "../types/app"
import { addMetadata, toNumber } from "../utils/alto"


interface AltoProviderValue {
  alto: any
  setAlto: Dispatch<any>
  styles: Record<string, TextStyle>
  setStyles: Dispatch<SetStateAction<Record<string, TextStyle>>>
	pageDimensions: PageDimensions
  printSpace: any
  illustrations: any
  graphicalElements: any
	textBlocks: any
	updateGraphicalElement: (graphicalElement: any, index: number) => void
	updateIllustration: (illustration: any, index: number) => void
  updateTextBlock: (textBlock: any, index: number) => void
  updateString: (textBlockIndex: number, textLineIndex: number, textStringIndex: number, value: string) => void
}

const defaultAltoProviderValue: AltoProviderValue = {
	alto: undefined,
	setAlto: () => null,
	styles: {},
	setStyles: () => null,
	pageDimensions: { width: 0, height: 0 },
	printSpace: undefined,
	illustrations: [],
	graphicalElements: [],
	textBlocks: [],
	updateGraphicalElement: () => null,
	updateIllustration: () => null,
	updateTextBlock: () => null,
	updateString: () => null,
}

const AltoContext = createContext<AltoProviderValue>(defaultAltoProviderValue)
const useAltoContext = () => useContext(AltoContext)

const AltoProvider: FC<PropsWithChildren<any>> = ({ children }) => {
	const [alto, setAlto] = useState<any>()
	const [pageDimensions, setPageDimensions] = useState<PageDimensions>({ width: 0, height: 0 })
	const [styles, setStyles] = useState<Record<string, TextStyle>>({})
	const [printSpace, setPrintSpace] = useState<any>()
	const [illustrations, setIllustrations] = useState<any[]>([])
	const [graphicalElements, setGraphicalElements] = useState<any[]>([])
	const [textBlocks, setTextBlocks] = useState<any[]>([])
  
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
							fontSize: toNumber(style["@_FONTSIZE"]),
							fontFamily: style["@_FONTFAMILY"],
						} 
					}))
				}
			} else {
				setStyles({
					[stylesObj.TextStyle["@_ID"]]: {
						fontSize: toNumber(stylesObj.TextStyle["@_FONTSIZE"]),
						fontFamily: stylesObj.TextStyle["@_FONTFAMILY"],
					}
				})
			}
		} else {
			setStyles({})
		}
	}, [alto])

	/*
  * Get page dimensions for image
  */
	useEffect(() => {
		const page = alto?.alto?.Layout?.Page
		if (page) {
			if (page["@_WIDTH"] && page["@_HEIGHT"]) {
				setPageDimensions({
					width: toNumber(page["@_WIDTH"]),
					height: toNumber(page["@_HEIGHT"]),
				})
			} else if (page.PrintSpace) {
				setPageDimensions({
					width: toNumber(page.PrintSpace["@_WIDTH"]),
					height: toNumber(page.PrintSpace["@_HEIGHT"]),
				})
			}
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
  * Parse Illustration, GraphicalElement, TextBlock from Alto file
  */
	useEffect(() => {
		if (printSpace?.Illustration) {
			setIllustrations(addMetadata(printSpace.Illustration))
		} else {
			setIllustrations([])
		}

		if (printSpace?.GraphicalElement) {
			setGraphicalElements(addMetadata(printSpace.GraphicalElement))
		} else {
			setGraphicalElements([])
		}

		if (printSpace?.TextBlock) {
			setTextBlocks(addMetadata(printSpace.TextBlock, printSpace["@_STYLEREFS"]))
		} else {
			setTextBlocks([])
		}
	}, [printSpace])

	const updateGraphicalElement = useCallback((graphicalElement: any, index: number) => {
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
									GraphicalElement: graphicalElement
								}
							}
						}
					}
				}
			} else {
				const tmp = old.alto.Layout.Page.PrintSpace.GraphicalElement
				tmp[index] = graphicalElement
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
									GraphicalElement: tmp
								}
							}
						}
					}
				}
			}
		})
	}, [])

	const updateIllustration = useCallback((Illustration: any, index: number) => {
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
									Illustration: Illustration
								}
							}
						}
					}
				}
			} else {
				const tmp = old.alto.Layout.Page.PrintSpace.Illustration
				tmp[index] = Illustration
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
									Illustration: tmp
								}
							}
						}
					}
				}
			}
		})
	}, [])

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
				pageDimensions,
				printSpace,
				illustrations,
				graphicalElements,
				textBlocks,
				updateGraphicalElement,
				updateIllustration,
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

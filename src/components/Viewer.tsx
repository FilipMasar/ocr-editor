import { FC, useContext, useEffect, useState } from "react"
import AppContext from "../context/appContext"
import GraphicalElement from "./elements/GraphicalElement"
import Illustration from "./elements/Illustration"
import PrintSpace from "./elements/PrintSpace"
import String from "./elements/String"
import TextBlock from "./elements/TextBlock"
import TextLine from "./elements/TextLine"

interface ViewerProps {
  imageFile: File | undefined;
  printSpace: any;
	updateString: (textBlockIndex: number, textLineIndex: number, textStringIndex: number, value: string) => void;
}

const Viewer:FC<ViewerProps> = ({imageFile, printSpace, updateString}) => {
	const [textBlocks, setTextBlocks] = useState<any[]>([])
	const [textLines, setTextLines] = useState<any[]>([])
	const [strings, setStrings] = useState<any[]>([])
	const [illustrations, setIllustrations] = useState<any[]>([])
	const [graphicalElements, setGraphicalElements] = useState<any[]>([])
	const { settings } = useContext(AppContext)
	const { zoom, imageOpacity, show } = settings

	const addStyles = (obj: any, parentStyleRefs: string) => {
		if (obj["@_STYLEREFS"] !== undefined) return obj

		return {
			...obj,
			["@_STYLEREFS"]: parentStyleRefs
		}
	}

	useEffect(() => {
		setTextBlocks([])
		if (printSpace?.TextBlock) {
			const parentStyleRefs = printSpace["@_STYLEREFS"]

			if (Array.isArray(printSpace.TextBlock)) {
				setTextBlocks(printSpace.TextBlock.map((x :any, index: number) => ({
					...addStyles(x, parentStyleRefs),
					textBlockindex: index,
				})))
			} else {
				setTextBlocks([{...addStyles(printSpace.TextBlock, parentStyleRefs), textBlockindex: -1}])
			}
		}

		setIllustrations([])
		if (printSpace?.Illustration) {
			if (Array.isArray(printSpace.Illustration)) {
				setIllustrations(printSpace.Illustration)
			} else {
				setIllustrations([printSpace.Illustration])
			}
		}

		setGraphicalElements([])
		if (printSpace?.GraphicalElement) {
			if (Array.isArray(printSpace.GraphicalElement)) {
				setGraphicalElements(printSpace.GraphicalElement)
			} else {
				setGraphicalElements([printSpace.GraphicalElement])
			}
		}
	}, [printSpace])
  
	useEffect(() => {
		setTextLines([])
		for (const textBlock of textBlocks) {
			if (textBlock?.TextLine) {
				const parentStyleRefs = textBlock["@_STYLEREFS"]

				if (Array.isArray(textBlock.TextLine)) {
					setTextLines(old => [...old, ...textBlock.TextLine.map((x: any, index: number) => ({
						...addStyles(x, parentStyleRefs),
						textBlockindex: textBlock.textBlockindex,
						textLineindex: index
					}))])
				} else {
					setTextLines(old => [...old, {
						...addStyles(textBlock.TextLine, parentStyleRefs),
						textBlockindex: textBlock.textBlockindex,
						textLineindex: -1
					}])
				}
			}
		}
	}, [textBlocks])

	useEffect(() => {
		setStrings([])
		for (const textLine of textLines) {
			if (textLine?.String) {
				const parentStyleRefs = textLine["@_STYLEREFS"]

				if (Array.isArray(textLine.String)) {
					const tmp = textLine.String.map((s: any) => {
						return {
							...s,
							lineVPos: textLine["@_VPOS"],
						}
					})
					setStrings(old => [...old, ...tmp.map((x: any, index: number) => ({
						...addStyles(x, parentStyleRefs),
						textBlockindex: textLine.textBlockindex,
						textLineindex: textLine.textLineindex,
						textStringindex: index
					}))])
				} else {
					const tmp = {...textLine.String, lineVPos: textLine["@_VPOS"]}
					setStrings(old => [...old, {
						...addStyles(tmp, parentStyleRefs),
						textBlockindex: textLine.textBlockindex,
						textLineindex: textLine.textLineindex,
						textStringindex: -1
					}])
				}
			}
		}
	}, [textLines])

	if (printSpace === undefined) {
		return <h1>No or wrong xml</h1>
	}

	return (
		<div style={{position: "relative", margin: 20}}>
			{imageFile && <img 
				src={URL.createObjectURL(imageFile)}
				alt={imageFile.name}
				style={{width: printSpace["@_WIDTH"] * zoom, height: printSpace["@_HEIGHT"] * zoom, opacity: imageOpacity}}
			/>}
      
			{show.printSpace && (
				<PrintSpace 
					top={printSpace["@_VPOS"] * zoom}
					left={printSpace["@_HPOS"] * zoom}
					width={printSpace["@_WIDTH"] * zoom}
					height={printSpace["@_HEIGHT"] * zoom}
				/>
			)}
      
			{show.textBlocks && textBlocks.map((textBlock: any, index: number) => 
				<TextBlock 
					key={index}
					top={textBlock["@_VPOS"] * zoom}
					left={textBlock["@_HPOS"] * zoom}
					width={textBlock["@_WIDTH"] * zoom}
					height={textBlock["@_HEIGHT"] * zoom} 
				/>
			)}

			{show.illustrations && illustrations.map((illustration: any, index: number) =>
				<Illustration 
					key={index}
					top={illustration["@_VPOS"] * zoom}
					left={illustration["@_HPOS"] * zoom}
					width={illustration["@_WIDTH"] * zoom}
					height={illustration["@_HEIGHT"] * zoom}
				/>
			)}

			{show.graphicalElements && graphicalElements.map((graphicalElement: any, index: number) =>
				<GraphicalElement 
					key={index}
					top={graphicalElement["@_VPOS"] * zoom}
					left={graphicalElement["@_HPOS"] * zoom}
					width={graphicalElement["@_WIDTH"] * zoom}
					height={graphicalElement["@_HEIGHT"] * zoom}
				/>
			)}

			{show.textLines && textLines.map((textLine: any, index: number) =>
				<TextLine 
					key={index}
					top={textLine["@_VPOS"] * zoom}
					left={textLine["@_HPOS"] * zoom}
					width={textLine["@_WIDTH"] * zoom}
					height={textLine["@_HEIGHT"] * zoom}
				/>
			)}

			{strings.map((string: any, index: number) =>
				<String 
					key={index}
					top={string["@_VPOS"] * zoom}
					left={string["@_HPOS"] * zoom}
					width={string["@_WIDTH"] * zoom}
					height={string["@_HEIGHT"] * zoom}
					text={string["@_CONTENT"]}
					lineVPos={string.lineVPos * zoom}
					styleRefs={string["@_STYLEREFS"]}
					updateString={(value: string) => updateString(string.textBlockindex, string.textLineindex, string.textStringindex, value)}
				/>
			)}
		</div>
	)
}

export default Viewer
import { FC, useEffect, useState } from "react"
import { useAltoContext } from "../context/altoContext"
import { usePanelContext } from "../context/panelContext"
import GraphicalElement from "./elements/GraphicalElement"
import Illustration from "./elements/Illustration"
import PrintSpace from "./elements/PrintSpace"
import String from "./elements/String"
import TextBlock from "./elements/TextBlock"
import TextLine from "./elements/TextLine"

const Viewer:FC = () => {
	const [textBlocks, setTextBlocks] = useState<any[]>([])
	const [textLines, setTextLines] = useState<any[]>([])
	const [strings, setStrings] = useState<any[]>([])
	const { printSpace, illustrations, graphicalElements } = useAltoContext()
	const { settings, imageFile } = usePanelContext()
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
		<div className="relative m-4" style={{transform: `scale(${zoom})`, transformOrigin: "0% 0% 0px"}}>
			{imageFile && <img 
				src={URL.createObjectURL(imageFile)}
				alt={imageFile.name}
				width={printSpace["@_WIDTH"]}
				height={printSpace["@_HEIGHT"]}
				style={{ opacity: imageOpacity, maxWidth: "none" }}
			/>}
      
			{show.printSpace && (
				<PrintSpace 
					top={printSpace["@_VPOS"]}
					left={printSpace["@_HPOS"]}
					width={printSpace["@_WIDTH"]}
					height={printSpace["@_HEIGHT"]}
				/>
			)}
      
			{show.textBlocks && textBlocks.map((textBlock: any, index: number) => 
				<TextBlock 
					key={index}
					top={textBlock["@_VPOS"]}
					left={textBlock["@_HPOS"]}
					width={textBlock["@_WIDTH"]}
					height={textBlock["@_HEIGHT"]} 
				/>
			)}

			{show.illustrations && illustrations.map((illustration: any, index: number) =>
				<Illustration 
					key={index}
					top={illustration["@_VPOS"]}
					left={illustration["@_HPOS"]}
					width={illustration["@_WIDTH"]}
					height={illustration["@_HEIGHT"]}
				/>
			)}

			{show.graphicalElements && graphicalElements.map((graphicalElement: any, index: number) =>
				<GraphicalElement 
					key={index}
					top={graphicalElement["@_VPOS"]}
					left={graphicalElement["@_HPOS"]}
					width={graphicalElement["@_WIDTH"]}
					height={graphicalElement["@_HEIGHT"]}
				/>
			)}

			{show.textLines && textLines.map((textLine: any, index: number) =>
				<TextLine 
					xml={textLine}
					key={index}
					top={textLine["@_VPOS"]}
					left={textLine["@_HPOS"]}
					width={textLine["@_WIDTH"]}
					height={textLine["@_HEIGHT"]}
				/>
			)}

			{strings.map((string: any, index: number) =>
				<String 
					key={index}
					top={string["@_VPOS"]}
					left={string["@_HPOS"]}
					width={string["@_WIDTH"]}
					height={string["@_HEIGHT"]}
					text={string["@_CONTENT"]}
					lineVPos={string.lineVPos}
					styleRefs={string["@_STYLEREFS"]}
				/>
			)}
		</div>
	)
}

export default Viewer
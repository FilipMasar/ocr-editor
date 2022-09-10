import { FC, useEffect, useState } from "react"
import { useAltoContext } from "../context/altoContext"
import { usePanelContext } from "../context/panelContext"
import { addMetadata, toNumber } from "../utils/alto"
import GraphicalElement from "./elements/GraphicalElement"
import Illustration from "./elements/Illustration"
import PrintSpace from "./elements/PrintSpace"
import String from "./elements/String"
import TextBlock from "./elements/TextBlock"
import TextLine from "./elements/TextLine"

const Viewer:FC = () => {
	const [textLines, setTextLines] = useState<any[]>([])
	const [strings, setStrings] = useState<any[]>([])
	const { pageDimensions, printSpace, illustrations, graphicalElements, textBlocks } = useAltoContext()
	const { settings, imageFile } = usePanelContext()
	const { zoom, imageOpacity, show } = settings
  
	useEffect(() => {
		setTextLines([])
		for (const textBlock of textBlocks) {
			if (textBlock.element?.TextLine && textBlock.metadata) {
				const parentStyleRefs = textBlock.metadata["@_STYLEREFS"]
				const otherMetadata = {
					textBlockIndex: textBlock.metadata.index
				}

				setTextLines(old => [...old, ...addMetadata(textBlock.element.TextLine, parentStyleRefs, otherMetadata)])
			}
		}
	}, [textBlocks])

	useEffect(() => {
		setStrings([])
		for (const textLine of textLines) {
			if (textLine.element?.String && textLine.metadata) {
				const parentStyleRefs = textLine.metadata["@_STYLEREFS"]
				const otherMetadata = {
					textBlockIndex: textLine.metadata.textBlockIndex,
					textLineIndex: textLine.metadata.index,
					lineVPos: toNumber(textLine.element["@_VPOS"])
				}

				setStrings(old => [...old, ...addMetadata(textLine.element.String, parentStyleRefs, otherMetadata)])
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
				width={pageDimensions.width}
				height={pageDimensions.height}
				style={{ opacity: imageOpacity, maxWidth: "none" }}
			/>}
      
			{show.printSpace && (
				<PrintSpace 
					top={toNumber(printSpace["@_VPOS"])}
					left={toNumber(printSpace["@_HPOS"])}
					width={toNumber(printSpace["@_WIDTH"])}
					height={toNumber(printSpace["@_HEIGHT"])}
				/>
			)}

			{show.illustrations && illustrations.map((illustration: any, index: number) =>
				<Illustration 
					key={index}
					element={illustration.element}
					metadata={illustration.metadata}
				/>
			)}

			{show.graphicalElements && graphicalElements.map((graphicalElement: any, index: number) =>
				<GraphicalElement 
					key={index}
					element={graphicalElement.element}
					metadata={graphicalElement.metadata}
				/>
			)}

			{show.textBlocks && textBlocks.map((textBlock: any, index: number) => 
				<TextBlock 
					key={index}
					element={textBlock.element}
					metadata={textBlock.metadata}
				/>
			)}

			{show.textLines && textLines.map((textLine: any, index: number) =>
				<TextLine 
					key={index}
					element={textLine.element}
					metadata={textLine.metadata}
				/>
			)}

			{strings.map((string: any, index: number) =>
				<String 
					key={index}
					element={string.element}
					metadata={string.metadata}
				/>
			)}
		</div>
	)
}

export default Viewer
import { FC, useEffect, useState } from "react"
import GraphicalElement from "./GraphicalElement"
import Illustration from "./Illustration"
import PrintSpace from "./PrintSpace"
import String from "./String"
import TextBlock from "./TextBlock"
import TextLine from "./TextLine"

interface ViewerProps {
  imageFile: File | undefined;
  printSpace: any;
}

const Viewer:FC<ViewerProps> = ({imageFile, printSpace}) => {
	const [textBlocks, setTextBlocks] = useState<any[]>([])
	const [textLines, setTextLines] = useState<any[]>([])
	const [strings, setStrings] = useState<any[]>([])
	const [illustrations, setIllustrations] = useState<any[]>([])
	const [graphicalElements, setGraphicalElements] = useState<any[]>([])

	useEffect(() => {
		setTextBlocks([])
		if (printSpace?.TextBlock) {
			if (Array.isArray(printSpace.TextBlock)) {
				setTextBlocks(printSpace.TextBlock)
			} else {
				setTextBlocks([printSpace.TextBlock])
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
				if (Array.isArray(textBlock.TextLine)) {
					setTextLines(old => old.concat(textBlock.TextLine))
				} else {
					setTextLines(old => [...old, textBlock.TextLine])
				}
			}
		}
	}, [textBlocks])

	useEffect(() => {
		setStrings([])
		for (const textLine of textLines) {
			if (textLine?.String) {
				if (Array.isArray(textLine.String)) {
					const tmp = textLine.String.map((s: any) => {
						return {
							...s,
							lineVPos: textLine["@_VPOS"],
						}
					})
					setStrings(old => old.concat(tmp))
				} else {
					setStrings(old => [...old, {...textLine.String, lineVPos: textLine["@_VPOS"]}])
				}
			}
		}
	}, [textLines])

	if (printSpace === undefined) {
		return <h1>No or wrong xml</h1>
	}

	return (
		<div style={{position: "relative", margin: 20}}>
			{imageFile && <img src={URL.createObjectURL(imageFile)}  alt={imageFile.name} />}
      
			<PrintSpace 
				top={printSpace["@_VPOS"]}
				left={printSpace["@_HPOS"]}
				width={printSpace["@_WIDTH"]}
				height={printSpace["@_HEIGHT"]}
			/>
      
			{textBlocks.map((textBlock: any, index: number) => 
				<TextBlock 
					key={index}
					top={textBlock["@_VPOS"]}
					left={textBlock["@_HPOS"]}
					width={textBlock["@_WIDTH"]}
					height={textBlock["@_HEIGHT"]} 
				/>
			)}

			{illustrations.map((illustration: any, index: number) =>
				<Illustration 
					key={index}
					top={illustration["@_VPOS"]}
					left={illustration["@_HPOS"]}
					width={illustration["@_WIDTH"]}
					height={illustration["@_HEIGHT"]}
				/>
			)}

			{graphicalElements.map((graphicalElement: any, index: number) =>
				<GraphicalElement 
					key={index}
					top={graphicalElement["@_VPOS"]}
					left={graphicalElement["@_HPOS"]}
					width={graphicalElement["@_WIDTH"]}
					height={graphicalElement["@_HEIGHT"]}
				/>
			)}

			{textLines.map((textLine: any, index: number) =>
				<TextLine 
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
				/>
			)}
		</div>
	)
}

export default Viewer
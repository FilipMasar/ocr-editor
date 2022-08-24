import { FC, useEffect, useState } from "react"
import { getStringsFromLine } from "../../utils/alto"
import EditableLine from "./EditableLine"

interface TextBlockProps {
  textBlock: any
  updateString: (textBlockIndex: number, textLineIndex: number, textStringIndex: number, value: string) => void;
}

const TextBlock:FC<TextBlockProps> = ({ textBlock, updateString }) => {
	const [textLines, setTextLines] = useState<any[]>([])
  
	useEffect(() => {
		setTextLines([])
		if (textBlock?.TextLine) {
			if (Array.isArray(textBlock.TextLine)) {
				setTextLines(old => [...old, ...textBlock.TextLine.map((x: any, index: number) => ({
					...x,
					strings: getStringsFromLine(x),
					textBlockindex: textBlock.textBlockindex,
					textLineindex: index
				}))])
			} else {
				setTextLines(old => [...old, {
					...textBlock.TextLine,
					strings: getStringsFromLine(textBlock.TextLine),
					textBlockindex: textBlock.textBlockindex,
					textLineindex: -1
				}])
			}
		}
	}, [textBlock])
  
	return (
		<div className="border m-2 p-2">
			{textLines.map((textLine: any) => (
				<EditableLine 
					key={`${textLine.textBlockindex}${textLine.textLineindex}`} 
					textLine={textLine}
					updateString={updateString} 
				/>
			))}
		</div>
	)
}

export default TextBlock
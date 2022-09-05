import { FC, useEffect, useState } from "react"
import { getStringsFromLine } from "../../utils/alto"

interface TextLineProps {
  element: any;
  metadata: any;
}

const TextLine:FC<TextLineProps> = ({ element, metadata }) => {
	const [text, setText] = useState<string>()

	useEffect(() => {
		const strings = getStringsFromLine(element)
		Array.isArray(strings) ? setText(strings.join(" ")) : setText(strings)
	}, [element])

	return (
		<>
			<div
				style={{ 
					position: "absolute",
					top: element["@_VPOS"],
					left: element["@_HPOS"],
					width: element["@_WIDTH"],
					height: element["@_HEIGHT"] 
				}}
				className="border border-orange-500 hover:bg-red-500 hover:opacity-30"
				title={text}
				onClick={() => console.log(metadata)}
			/>
		</>
	)
}

export default TextLine
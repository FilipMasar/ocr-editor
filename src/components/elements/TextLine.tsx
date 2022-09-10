import { FC, useEffect, useState } from "react"
import { getStringsFromLine, toNumber } from "../../utils/alto"

interface TextLineProps {
  element: any;
  metadata: any;
}

const TextLine:FC<TextLineProps> = ({ element, metadata }) => {
	const [text, setText] = useState<string>()

	const top = toNumber(element["@_VPOS"])
	const left = toNumber(element["@_HPOS"])
	const width = toNumber(element["@_WIDTH"])
	const height = toNumber(element["@_HEIGHT"])

	useEffect(() => {
		const strings = getStringsFromLine(element)
		Array.isArray(strings) ? setText(strings.join(" ")) : setText(strings)
	}, [element])

	return (
		<>
			<div
				style={{ position: "absolute", top, left, width, height }}
				className="border border-orange-500 hover:bg-red-500 hover:opacity-30"
				title={text}
				onClick={() => console.log(metadata)}
			/>
		</>
	)
}

export default TextLine
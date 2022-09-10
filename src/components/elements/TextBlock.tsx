import { FC } from "react"
import { toNumber } from "../../utils/alto"

interface TextBlockProps {
  element: any
	metadata: any
}

const TextBlock:FC<TextBlockProps> = ({ element, metadata }) => {
	const top = toNumber(element["@_VPOS"])
	const left = toNumber(element["@_HPOS"])
	const width = toNumber(element["@_WIDTH"])
	const height = toNumber(element["@_HEIGHT"])  

	return (
		<div
			style={{ position: "absolute", top, left, width, height }}
			className="border border-red-500 hover:bg-red-500 hover:opacity-10"
			onClick={() => console.log(metadata)}
		/>
	)
}

export default TextBlock
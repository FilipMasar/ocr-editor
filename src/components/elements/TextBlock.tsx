import { FC } from "react"

interface TextBlockProps {
  element: any
	metadata: any
}

const TextBlock:FC<TextBlockProps> = ({ element, metadata }) => {
	return (
		<div
			style={{ 
				position: "absolute",
				top: element["@_VPOS"],
				left: element["@_HPOS"],
				width: element["@_WIDTH"],
				height: element["@_HEIGHT"] 
			}}
			className="border border-red-500 hover:bg-red-500 hover:opacity-10"
			onClick={() => console.log(metadata)}
		/>
	)
}

export default TextBlock
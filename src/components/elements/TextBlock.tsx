import { FC } from "react"

interface TextBlockProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TextBlock:FC<TextBlockProps> = ({ top, left, width, height }) => {
	return (
		<div
			style={{ position: "absolute", top, left, width, height }}
			className="border border-red-500 hover:bg-red-500 hover:opacity-10"
		/>
	)
}

export default TextBlock
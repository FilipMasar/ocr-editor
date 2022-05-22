import { FC } from "react"

interface TextBlockProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TextBlock:FC<TextBlockProps> = ({ top, left, width, height }) => {
	return (
		<div style={{ position: "absolute", top, left, width, height, border: "1px red solid" }}/>
	)
}

export default TextBlock
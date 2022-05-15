import { FC } from "react"

interface TextLineProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TextLine:FC<TextLineProps> = ({ top, left, width, height }) => {
	return (
		<div style={{ position: "absolute", top, left, width, height, border: "1px orange solid" }}/>
	)
}

export default TextLine
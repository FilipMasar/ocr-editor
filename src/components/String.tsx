import { FC } from "react"

interface StringProps {
  top: number;
  left: number;
  width: number;
  height: number;
  text: string;
  lineVPos: number;
}

const String:FC<StringProps> = ({ top, left, width, height, text, lineVPos }) => {
	return (
		<>
			<div style={{ position: "absolute", top, left, width, height, border: "1px green solid" }} />
			<span style={{ position: "absolute", top: lineVPos, left, fontFamily: "Times New Roman", fontSize: 50, fontWeight: 200, lineHeight: "44px" }}>{text}</span>
		</>
	)
}

export default String
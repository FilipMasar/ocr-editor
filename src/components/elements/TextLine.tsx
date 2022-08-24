import { FC, useEffect, useState } from "react"
import { getStringsFromLine } from "../../utils/alto"

interface TextLineProps {
  xml: any;
  top: number;
  left: number;
  width: number;
  height: number;
}

const TextLine:FC<TextLineProps> = ({ xml, top, left, width, height }) => {
	const [text, setText] = useState<string>()

	useEffect(() => {
		const strings = getStringsFromLine(xml)
		Array.isArray(strings) ? setText(strings.join(" ")) : setText(strings)
	}, [xml])

	return (
		<>
			<div
				style={{ position: "absolute", top, left, width, height }}
				className="border border-orange-500 hover:bg-red-500 hover:opacity-30"
				title={text}
			/>
		</>
	)
}

export default TextLine
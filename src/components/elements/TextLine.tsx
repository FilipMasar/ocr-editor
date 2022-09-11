import { FC, useEffect, useRef, useState } from "react"
import { useAltoContext } from "../../context/altoContext"
import { useAltoEditorContext } from "../../context/altoEditorContext"
import { useTextEditorContext } from "../../context/textEditorContext"
import { getStringsFromLine, toNumber } from "../../utils/alto"

interface TextLineProps {
  element: any;
  metadata: any;
}

const TextLine:FC<TextLineProps> = ({ element, metadata }) => {
	const ref = useRef<HTMLDivElement>(null)
	const [text, setText] = useState<string>()
	const { updateTextLine } = useAltoContext()
	const { openAltoEditor } = useAltoEditorContext()
	const { openTextEditor } = useTextEditorContext()

	const top = toNumber(element["@_VPOS"])
	const left = toNumber(element["@_HPOS"])
	const width = toNumber(element["@_WIDTH"])
	const height = toNumber(element["@_HEIGHT"])

	useEffect(() => {
		const strings = getStringsFromLine(element)
		Array.isArray(strings) ? setText(strings.join(" ")) : setText(strings)
	}, [element])

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (event.altKey) {
				openAltoEditor(
					element, 
					() => (updated: any) => updateTextLine(updated, metadata.textBlockIndex, metadata.index)
				)
			} else {
				openTextEditor("TEXTLINE", { element, metadata })
			}
		}

		const div = ref.current
		if (div === null) return

		div.addEventListener("click", handleClick)

		return () => {
			div.removeEventListener("click", handleClick)
		}
	}, [])

	return (
		<div
			ref={ref}
			style={{ position: "absolute", top, left, width, height }}
			className="border border-orange-500 hover:bg-red-500 hover:opacity-30"
			title={text}
		/>
	)
}

export default TextLine
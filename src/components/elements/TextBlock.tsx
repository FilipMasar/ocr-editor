import { FC, useEffect, useRef } from "react"
import { useAltoContext } from "../../context/altoContext"
import { useAltoEditorContext } from "../../context/altoEditorContext"
import { useTextEditorContext } from "../../context/textEditorContext"
import { toNumber } from "../../utils/alto"

interface TextBlockProps {
  element: any
	metadata: any
}

const TextBlock:FC<TextBlockProps> = ({ element, metadata }) => {
	const ref = useRef<HTMLDivElement>(null)
	const { updateTextBlock } = useAltoContext()
	const { openAltoEditor } = useAltoEditorContext()
	const { openTextEditor } = useTextEditorContext()

	const top = toNumber(element["@_VPOS"])
	const left = toNumber(element["@_HPOS"])
	const width = toNumber(element["@_WIDTH"])
	const height = toNumber(element["@_HEIGHT"])

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (event.altKey) {
				openAltoEditor(
					element, 
					() => (updated: any) => updateTextBlock(updated, metadata.index)
				)
			} else {
				openTextEditor("TEXTBLOCK", { element, metadata })
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
			className="border border-red-500 hover:bg-red-500 hover:opacity-10"
		/>
	)
}

export default TextBlock
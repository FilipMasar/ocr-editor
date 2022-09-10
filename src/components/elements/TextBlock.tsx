import { FC } from "react"
import { useAltoContext } from "../../context/altoContext"
import { useAltoEditorContext } from "../../context/altoEditorContext"
import { toNumber } from "../../utils/alto"

interface TextBlockProps {
  element: any
	metadata: any
}

const TextBlock:FC<TextBlockProps> = ({ element, metadata }) => {
	const { updateTextBlock } = useAltoContext()
	const { openAltoEditor } = useAltoEditorContext()
	
	const top = toNumber(element["@_VPOS"])
	const left = toNumber(element["@_HPOS"])
	const width = toNumber(element["@_WIDTH"])
	const height = toNumber(element["@_HEIGHT"])

	const handleClick = () => {
		openAltoEditor(
			element, 
			() => (updated: any) => updateTextBlock(updated, metadata.index)
		)
	}

	return (
		<div
			style={{ position: "absolute", top, left, width, height }}
			className="border border-red-500 hover:bg-red-500 hover:opacity-10"
			onClick={handleClick}
		/>
	)
}

export default TextBlock
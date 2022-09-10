import { FC } from "react"
import { useAltoContext } from "../../context/altoContext"
import { useAltoEditorContext } from "../../context/altoEditorContext"
import { toNumber } from "../../utils/alto"

interface GraphicalElementProps {
	element: any;
	metadata: any;
}

const GraphicalElement:FC<GraphicalElementProps> = ({ element, metadata }) => {
	const { updateGraphicalElement } = useAltoContext()
	const { openAltoEditor } = useAltoEditorContext()

	const top = toNumber(element["@_VPOS"])
	const left = toNumber(element["@_HPOS"])
	const width = toNumber(element["@_WIDTH"])
	const height = toNumber(element["@_HEIGHT"])

	const handleClick = () => {
		openAltoEditor(
			element, 
			() => (updated: any) => updateGraphicalElement(updated, metadata.index)
		)
	}

	return (
		<div 
			style={{ position: "absolute", top, left, width, height }}
			className="border border-purple-500 hover:bg-purple-500 hover:opacity-30"
			onClick={handleClick}
		/>
	)
}

export default GraphicalElement
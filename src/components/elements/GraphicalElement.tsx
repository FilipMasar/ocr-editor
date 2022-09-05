import { FC } from "react"
import { useAltoContext } from "../../context/altoContext"
import { useAltoEditorContext } from "../../context/altoEditorContext"

interface GraphicalElementProps {
	element: any;
	metadata: any;
}

const GraphicalElement:FC<GraphicalElementProps> = ({ element, metadata }) => {
	const { updateGraphicalElement } = useAltoContext()
	const { openAltoEditor } = useAltoEditorContext()

	const handleClick = () => {
		openAltoEditor(
			element, 
			() => (updated: any) => updateGraphicalElement(updated, metadata.index)
		)
	}

	return (
		<div 
			style={{ 
				position: "absolute",
				top: element["@_VPOS"],
				left: element["@_HPOS"],
				width: element["@_WIDTH"],
				height: element["@_HEIGHT"] 
			}}
			className="border border-purple-500 hover:bg-purple-500 hover:opacity-30"
			onClick={handleClick}
		/>
	)
}

export default GraphicalElement
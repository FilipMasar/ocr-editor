import { FC } from "react"
import { useAltoEditorContext } from "../../context/altoEditorContext"

interface GraphicalElementProps {
	element: any;
	metadata: any;
}

const GraphicalElement:FC<GraphicalElementProps> = ({ element, metadata }) => {
	const { openAltoEditor } = useAltoEditorContext()
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
			onClick={() => openAltoEditor(element, () => (a: any) => console.log(a, metadata))}
		/>
	)
}

export default GraphicalElement
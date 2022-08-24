import { FC } from "react"

interface GraphicalElementProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const GraphicalElement:FC<GraphicalElementProps> = ({ top, left, width, height }) => {
	return (
		<div 
			style={{ position: "absolute", top, left, width, height }}
			className="border border-purple-500 hover:bg-purple-500 hover:opacity-30"
		/>
	)
}

export default GraphicalElement
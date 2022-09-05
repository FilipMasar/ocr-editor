import { FC } from "react"

interface IllustrationProps {
  element: any;
	metadata: any;
}

const Illustration:FC<IllustrationProps> = ({ element, metadata }) => {
	return (
		<div 
			style={{ 
				position: "absolute",
				top: element["@_VPOS"],
				left: element["@_HPOS"],
				width: element["@_WIDTH"],
				height: element["@_HEIGHT"] 
			}}
			className="border border-pink-500 hover:bg-pink-500 hover:opacity-10"
			onClick={() => console.log(metadata)}
		/>
	)
}

export default Illustration
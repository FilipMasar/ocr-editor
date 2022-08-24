import { FC } from "react"

interface IllustrationProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Illustration:FC<IllustrationProps> = ({ top, left, width, height }) => {
	return (
		<div 
			style={{ position: "absolute", top, left, width, height }}
			className="border border-pink-500 hover:bg-pink-500 hover:opacity-10"
		/>
	)
}

export default Illustration
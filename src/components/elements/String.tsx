import { FC, useEffect, useState } from "react"
import { useAltoContext } from "../../context/altoContext"
import { usePanelContext } from "../../context/panelContext"
import { TextStyle } from "../../types/app"

const defaultStyle: TextStyle = {
	fontSize: 16,
	fontFamily: "Times New Roman",
}

interface StringProps {
  top: number;
  left: number;
  width: number;
  height: number;
  text: string;
	lineVPos: number;
  styleRefs: string;
}

const String:FC<StringProps> = ({ top, left, width, height, text, lineVPos, styleRefs }) => {
	const { styles } = useAltoContext()
	const { settings } = usePanelContext()
	const { show } = settings
	const [textStyle, setTextStyle] = useState<TextStyle>(defaultStyle)

	useEffect(() => {
		const styleRefsArray = styleRefs.split(" ")
    
		for (const id of styleRefsArray) {
			if (styles[id]) {
				setTextStyle(styles[id])
			}
		}
	}, [styles])

	return (
		<>
			{show.strings && (
				<div 
					style={{ position: "absolute", top, left, width, height }} 
					className={`border border-green-500 hover:bg-green-500 hover:opacity-30 ${textStyle.color}`}
				/>
			)}
			{show.textFit && 
				<div 
					className="flex items-start justify-between"
					style={{ 
						position: "absolute", 
						top, 
						left,
						fontFamily: textStyle.fontFamily,
						fontSize: `calc(${textStyle.fontSize}pt / 0.2645833333)`,
						lineHeight: `${height}px`,
						height,
						width,
					}}
				>
					{text.split("").map((char: string, index: number) => (
						<span key={index}>{char}</span>
					))}
				</div>
			}
			{show.textAbove && 
				<div 
					className="flex items-start justify-around"
					style={{ 
						position: "absolute", 
						top: lineVPos - 20, 
						left,
						width,
					}}
				>
					{text.split("").map((char: string, index: number) => (
						<span key={index}>{char}</span>
					))}
				</div>
			}
		</>
	)
}

export default String

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
	updateString: (value: string) => void;
}

const String:FC<StringProps> = ({ top, left, width, height, text, lineVPos, styleRefs, updateString }) => {
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
					className="border border-green-500 hover:bg-green-500 hover:opacity-30"
				/>
			)}
			{show.text && 
				<div 
					contentEditable="true"
					suppressContentEditableWarning={true}
					onInput={(e) => updateString(e.currentTarget.textContent as string)}
					style={{ 
						position: "absolute", 
						top: lineVPos, 
						left,
						fontFamily: textStyle.fontFamily,
						fontSize: textStyle.fontSize
					}}
				>
					{text}
				</div>
			}
		</>
	)
}

export default String

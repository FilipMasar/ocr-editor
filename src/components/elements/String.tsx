import { FC, useContext, useEffect, useState } from "react"
import AppContext from "../../context/appContext"
import StyleContext, { defaultStyle, TextStyle } from "../../context/styleContext"

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
	const { styles } = useContext(StyleContext)
	const { settings } = useContext(AppContext)
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
			{show.strings && <div style={{ position: "absolute", top, left, width, height, border: "1px green solid" }} />}
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

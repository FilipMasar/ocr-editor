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
}

const String:FC<StringProps> = ({ top, left, width, height, text, lineVPos, styleRefs }) => {
	const { styles } = useContext(StyleContext)
	const { settings } = useContext(AppContext)
	const { zoom } = settings
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
			<div style={{ position: "absolute", top, left, width, height, border: "1px green solid" }} />
			<div 
				contentEditable="true"
				suppressContentEditableWarning={true}
				onInput={(e) => console.log(e.currentTarget.textContent)}
				style={{ 
					position: "absolute", 
					top: lineVPos, 
					left,
					fontFamily: textStyle.fontFamily,
					fontSize: textStyle.fontSize * zoom 
				}}
			>
				{text}
			</div>
		</>
	)
}

export default String
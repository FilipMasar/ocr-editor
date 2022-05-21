import { ChangeEvent, useState } from "react"
import { XMLParser } from "fast-xml-parser"
import "./App.css"
import Viewer from "./components/Viewer"
import Editor from "./components/Editor"
import AppContext from "./context/appContext"
import StyleContext, { TextStyle } from "./context/styleContext"

function App() {
	const [xmlData, setXmlData] = useState<any>()
	const [imageFile, setImageFile] = useState<File>()
	const [zoom, setZoom] = useState<number>(1)
	const [styles, setStyles] = useState<Record<string, TextStyle>>({})

	function parseStyles(stylesObj: any) {
		setStyles({})
		if (stylesObj?.TextStyle) {
			if (Array.isArray(stylesObj.TextStyle)) {
				for (const style of stylesObj.TextStyle) {
					setStyles(old => ({ 
						...old, 
						[style["@_ID"]]: {
							fontSize: style["@_FONTSIZE"],
							fontFamily: style["@_FONTFAMILY"],
						} 
					}))
				}
			} else {
				setStyles({
					[stylesObj.TextStyle["@_ID"]]: {
						fontSize: stylesObj.TextStyle["@_FONTSIZE"],
						fontFamily: stylesObj.TextStyle["@_FONTFAMILY"],
					}
				})
			}
		}
	}

	function parseXml(xml: string) {
		const options = {
			parseAttributeValue: true,
			ignoreAttributes: false,
			attributeNamePrefix : "@_",
			allowBooleanAttributes: true
		}
		const parser = new XMLParser(options)
		const obj = parser.parse(xml)
		setXmlData(obj)
		parseStyles(obj?.alto?.Styles)
	}

	function handleAltoChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target?.files?.length === 1) {
			const reader = new FileReader()
			reader.onload = async (e) => {
				parseXml(String(e.target?.result))
			}
			reader.readAsText(event.target.files[0])
		}
	}

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target?.files?.length === 1) {
			setImageFile(event.target.files[0])
		}
	}

	return (
		<AppContext.Provider value={{zoom, setZoom} }>
			<StyleContext.Provider value={{ styles }}>
				<div style={{ display: "flex" }}>
					<div style={{ width: "70%", backgroundColor: "blue", height: "100vh", overflow: "scroll"}}>
						<Viewer imageFile={imageFile} printSpace={xmlData?.alto?.Layout?.Page?.PrintSpace} />
					</div>
					<div style={{ width: "30%", backgroundColor: "red", height: "100vh", overflow: "scroll"}}>
						<Editor handleAltoChange={handleAltoChange} handleImageChange={handleImageChange} />
					</div>
				</div>
			</StyleContext.Provider>
		</AppContext.Provider>
	)
}

export default App

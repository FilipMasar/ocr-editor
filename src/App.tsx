import { ChangeEvent, useState } from "react"
import { XMLBuilder, XmlBuilderOptions, XMLParser } from "fast-xml-parser"
import FileSaver from "file-saver"
import "./App.css"
import Viewer from "./components/Viewer"
import Panel from "./components/Panel"
import AppContext, { defaultSettings } from "./context/appContext"
import StyleContext, { TextStyle } from "./context/styleContext"
import { Settings } from "./types/app"
import AltoEditor from "./components/AltoEditor"

function App() {
	const [xmlData, setXmlData] = useState<any>()
	const [imageFile, setImageFile] = useState<File>()
	const [settings, setSettings] = useState<Settings>(defaultSettings)
	const [styles, setStyles] = useState<Record<string, TextStyle>>({})
	const [showAltoEditor, setShowAltoEditor] = useState(false)
	const [showTextEditor, setShowTextEditor] = useState(false)

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

	function updateTextBlock(textBlock: any, index: number) {
		setXmlData((old: any) => {
			if (index === -1) {
				old.alto.Layout.Page.PrintSpace.TextBlock = textBlock
			} else {
				old.alto.Layout.Page.PrintSpace.TextBlock[index] = textBlock
			}
			return old
		})
	}

	function updateString(textBlockIndex: number, textLineIndex: number, textStringIndex: number, value: string) {
		const printSpace = xmlData?.alto?.Layout?.Page?.PrintSpace
		if (printSpace) {
			const textBlock = textBlockIndex === -1 ? printSpace.TextBlock : printSpace.TextBlock[textBlockIndex]
			if (textLineIndex === -1) {
				if (textStringIndex === -1) {
					textBlock.TextLine.String["@_CONTENT"] = value
				} else {
					textBlock.TextLine.String[textStringIndex]["@_CONTENT"] = value
				}
			} else {
				if (textStringIndex === -1) {
					textBlock.TextLine[textLineIndex].String["@_CONTENT"] = value
				} else {
					textBlock.TextLine[textLineIndex].String[textStringIndex]["@_CONTENT"] = value
				}
			}
			updateTextBlock(textBlock, textBlockIndex)
		}
	}

	function exportNewXML() {
		const options: Partial<XmlBuilderOptions> = {
			ignoreAttributes: false,
			attributeNamePrefix : "@_",
			format: true
		}
		const builder = new XMLBuilder(options)
		const xmlContent = builder.build(xmlData)
		const file = new File([xmlContent], "updated.xml")
		FileSaver.saveAs(file)
	}

	return (
		<AppContext.Provider value={{settings, setSettings}}>
			<StyleContext.Provider value={{ styles, setStyles }}>
				<div className="relative flex">
					<div className="w-2/3 h-screen bg-white overflow-scroll">
						<Viewer imageFile={imageFile} printSpace={xmlData?.alto?.Layout?.Page?.PrintSpace} updateString={updateString} />
					</div>
					<div className="w-1/3 h-screen bg-indigo-100 overflow-scroll">
						<Panel 
							handleAltoChange={handleAltoChange}
							handleImageChange={handleImageChange}
							onExport={exportNewXML}
							onOpenAltoEditor={() => setShowAltoEditor(true)}
							onOpenTextEditor={() => setShowTextEditor(true)} 
						/>
					</div>

					{showTextEditor && (
						<div className="absolute bottom-0 left-0 right-0 flex items-center">
							<div className="bg-white border p-4 inline-block">
							TODO
							</div>
						</div>
					)}

					{showAltoEditor && <AltoEditor xmlData={xmlData} setXmlData={setXmlData} setShowAltoEditor={setShowAltoEditor} /> }

				</div>
			</StyleContext.Provider>
		</AppContext.Provider>
	)
}

export default App

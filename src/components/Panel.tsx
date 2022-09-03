import FileSaver from "file-saver"
import { ChangeEvent, FC, MouseEvent } from "react"
import { Upload } from "react-feather"
import { useAltoContext } from "../context/altoContext"
import { usePanelContext } from "../context/panelContext"
import { jsonToXml, xmlToJson } from "../utils/xmlConvertor"

interface PanelProps {
	onOpenAltoEditor: () => void;
	onOpenTextEditor: () => void;
}

const Panel:FC<PanelProps> = ({ onOpenAltoEditor, onOpenTextEditor }) => {
	const { alto, setAlto, styles, setStyles } = useAltoContext()
	const { settings, setSettings, setImageFile } = usePanelContext()
	const { zoom, imageOpacity } = settings

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target?.files?.length === 1) {
			setImageFile(event.target.files[0])
		}
	}

	function handleAltoChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target?.files?.length === 1) {
			const reader = new FileReader()
			reader.onload = async (e) => {
				const obj = xmlToJson(String(e.target?.result))
				setAlto(obj)
			}
			reader.readAsText(event.target.files[0])
		}
	}

	const onExport = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		
		const xmlContent = jsonToXml(alto)
		const file = new File([xmlContent], "updated.xml")
		FileSaver.saveAs(file)
	}

	const updateZoom = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setSettings(old => ({...old, zoom: parseFloat(e.target.value)}))
	}

	const updateOpacity = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setSettings(old => ({...old, imageOpacity: parseFloat(e.target.value)}))
	}

	return (
		<div className="p-4">

			<label htmlFor="altoFileInput">Pick ALTO xml File</label>
			<input 
				id='altoFileInput'
				type="file"
				accept=".xml"
				onChange={handleAltoChange}
				className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none" 
			/>

			<label htmlFor="scanFileInput">Pick jpeg scan</label>
			<input 
				id='scanFileInput'
				type="file"
				accept=".jpg"
				onChange={handleImageChange}
				className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none" 
			/>

			<hr className="w-full h-0.5 bg-black my-2" />

			<div className="flex gap-2 mb-2">
				<button
					className="w-full btn-primary"
					onClick={onOpenAltoEditor}
				>
					Open Alto Editor
				</button>
				<button
					className="w-full btn-primary"
					onClick={onOpenTextEditor}
				>
					Open Text Editor
				</button>
			</div>

			<label htmlFor="zoomInput">Zoom: {zoom}</label>
			<input
				id="zoomInput"
				className="w-full"
				type="range"
				min={0.1}
				max={2}
				step={0.1}
				value={zoom}
				onChange={updateZoom} 
			/>

			<label htmlFor="opacityInput">Image opacity: {imageOpacity}</label>
			<input
				id="opacityInput"
				className="w-full"
				type="range"
				min={0}
				max={1}
				step={0.1}
				value={imageOpacity}
				onChange={updateOpacity} 
			/>

			<hr className="w-full h-0.5 bg-black my-2"/>

			<p>Font settings:</p>
			{Object.keys(styles).map(key => (
				<div key={key}>
					<p>{key}</p>
					<input 
						type="number" 
						value={styles[key].fontSize} 
						onChange={(e) => setStyles(old => ({...old, [key]: {...old[key], fontSize: parseInt(e.target.value)}}))}
					/>
					<p>Font family: {styles[key].fontFamily}</p>
				</div>
			))}

			<hr className="w-full h-0.5 bg-black my-2"/>

			<p>Display Elements:</p>

			<div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.printSpace}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, printSpace: e.target.checked}}))}
					/>
					<label>Print space</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.illustrations}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, illustrations: e.target.checked}}))}
					/>
					<label>Illustrations</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.graphicalElements}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, graphicalElements: e.target.checked}}))}
					/>
					<label>Graphical elements</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textBlocks}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textBlocks: e.target.checked}}))}
					/>
					<label>Text blocks</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textLines}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textLines: e.target.checked}}))}
					/>
					<label>Text lines</label>
				</div>
				<div className="flex items-center gap-2">
					<input 
						type="checkbox" 
						checked={settings.show.strings} 
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, strings: e.target.checked}}))}
					/>
					<label>Strings</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textFit}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textFit: e.target.checked}}))}
					/>
					<label>Text fit</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textAbove}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textAbove: e.target.checked}}))}
					/>
					<label>Text above</label>
				</div>
			</div>

			<hr className="w-full h-0.5 bg-black my-2"/>
			
			<button 
				className="w-full flex gap-2 justify-center items-center btn-primary"
				onClick={onExport}
			>
				<Upload size={20} />
				<span>Export Updated XML</span>
			</button>
		</div>
	)
}

export default Panel
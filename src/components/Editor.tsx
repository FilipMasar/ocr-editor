import { ChangeEvent, FC, useContext } from "react"
import AppContext from "../context/appContext"
import StyleContext from "../context/styleContext"

interface EditorProps {
  handleAltoChange: any;
  handleImageChange: any;
	onExport: () => void;
}

const Editor:FC<EditorProps> = ({handleAltoChange, handleImageChange, onExport}) => {
	const {settings, setSettings} = useContext(AppContext)
	const {styles, setStyles} = useContext(StyleContext)
	const {zoom, imageOpacity} = settings

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

			<label className="text-sm text-gray-900" htmlFor="altoFileInput">Pick ALTO xml File</label>
			<input 
				id='altoFileInput'
				type="file"
				accept=".xml"
				onChange={handleAltoChange}
				className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none" 
			/>

			<label className="text-sm text-gray-900" htmlFor="scanFileInput">Pick jpeg scan</label>
			<input 
				id='scanFileInput'
				type="file"
				accept=".jpg"
				onChange={handleImageChange}
				className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none" 
			/>

			<hr className="w-full h-0.5 bg-black my-2" />

			<label className="text-sm text-gray-900" htmlFor="zoomInput">Zoom</label>
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

			<label className="text-sm text-gray-900" htmlFor="opacityInput">Image opacity</label>
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
			<hr />
			<p>Show:</p>
			<div>
				<input
					type="checkbox"
					checked={settings.show.printSpace}
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, printSpace: e.target.checked}}))}
				/>
				<label>Print space</label>
				<input
					type="checkbox"
					checked={settings.show.illustrations}
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, illustrations: e.target.checked}}))}
				/>
				<label>Illustrations</label>
				<input
					type="checkbox"
					checked={settings.show.graphicalElements}
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, graphicalElements: e.target.checked}}))}
				/>
				<label>Graphical elements</label>
				<input
					type="checkbox"
					checked={settings.show.textBlocks}
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, textBlocks: e.target.checked}}))}
				/>
				<label>Text blocks</label>
				<input
					type="checkbox"
					checked={settings.show.textLines}
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, textLines: e.target.checked}}))}
				/>
				<label>Text lines</label>
				<input 
					type="checkbox" 
					checked={settings.show.strings} 
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, strings: e.target.checked}}))}
				/>
				<label>Strings</label>
				<input
					type="checkbox"
					checked={settings.show.text}
					onChange={(e) => setSettings(old => ({...old, show: {...old.show, text: e.target.checked}}))}
				/>
				<label>Text</label>
			</div>
			<hr />
			<button onClick={onExport}>Export Updated XML</button>
		</div>
	)
}

export default Editor
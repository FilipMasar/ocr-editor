import { FC, useContext } from "react"
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

	return (
		<>
			<p>Pick alto xml file: </p>
			<input type="file" onChange={handleAltoChange} accept=".xml"/>
			<p>Pick jpeg scan: </p>
			<input type="file" onChange={handleImageChange} accept=".jpg"/>
			<p>Zoom: {zoom}</p>
			<button onClick={() => setSettings(old => ({...old, zoom: Math.round((old.zoom - 0.1) * 100) / 100}))}>-</button>
			<button onClick={() => setSettings(old => ({...old, zoom: Math.round((old.zoom + 0.1) * 100) / 100}))}>+</button>
			<p>Image opacity: {imageOpacity}</p>
			<button onClick={() => setSettings(old => ({...old, imageOpacity: Math.round((old.imageOpacity - 0.1) * 100) / 100}))}>-</button>
			<button onClick={() => setSettings(old => ({...old, imageOpacity: Math.round((old.imageOpacity + 0.1) * 100) / 100}))}>+</button>
			<hr />
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
		</>
	)
}

export default Editor
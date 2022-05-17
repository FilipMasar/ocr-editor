import { FC, useContext } from "react"
import AppContext from "../context/appContext"

interface EditorProps {
  handleAltoChange: any;
  handleImageChange: any;
}

const Editor:FC<EditorProps> = ({handleAltoChange, handleImageChange}) => {
	const {zoom, setZoom} = useContext(AppContext)
	return (
		<div>
			<p>Pick alto xml file: </p>
			<input type="file" onChange={handleAltoChange} accept=".xml"/>
			<p>Pick jpeg scan: </p>
			<input type="file" onChange={handleImageChange} accept=".jpg"/>
			<p>Zoom: {zoom}</p>
			<button onClick={() => setZoom(old => Math.round((old - 0.1) * 100) / 100)}>-</button>
			<button onClick={() => setZoom(old => Math.round((old + 0.1) * 100) / 100)}>+</button>
		</div>
	)
}

export default Editor
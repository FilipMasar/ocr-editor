import { FC } from "react"

interface EditorProps {
  handleAltoChange: any;
  handleImageChange: any;
}

const Editor:FC<EditorProps> = ({handleAltoChange, handleImageChange}) => {
	return (
		<div>
			<p>Pick alto xml file: </p>
			<input type="file" onChange={handleAltoChange} accept=".xml"/>
			<p>Pick jpeg scan: </p>
			<input type="file" onChange={handleImageChange} accept=".jpg"/>
		</div>
	)
}

export default Editor
import { useState } from "react"
import "./App.css"
import Viewer from "./components/Viewer"
import Panel from "./components/Panel"
import { PanelProvider } from "./context/panelContext"
import AltoEditor from "./components/AltoEditor"
import TextEditor from "./components/TextEditor/TextEditor"
import AltoProvider from "./context/altoContext"

function App() {
	const [showAltoEditor, setShowAltoEditor] = useState(false)
	const [showTextEditor, setShowTextEditor] = useState(false)

	return (
		<PanelProvider>
			<AltoProvider>
				<div className="relative flex">
					<div className="w-2/3 h-screen bg-white overflow-scroll">
						<Viewer />
					</div>
					<div className="w-1/3 h-screen bg-indigo-100 overflow-scroll">
						<Panel 
							onOpenAltoEditor={() => setShowAltoEditor(true)}
							onOpenTextEditor={() => setShowTextEditor(true)} 
						/>
					</div>

					{showTextEditor && <TextEditor setShowTextEditor={setShowTextEditor} />}

					{showAltoEditor && <AltoEditor setShowAltoEditor={setShowAltoEditor} />}

				</div>
			</AltoProvider>
		</PanelProvider>
	)
}

export default App

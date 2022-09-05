import { useState } from "react"
import Viewer from "./components/Viewer"
import Panel from "./components/Panel"
import { PanelProvider } from "./context/panelContext"
import AltoEditor from "./components/AltoEditor"
import TextEditor from "./components/TextEditor/TextEditor"
import AltoProvider from "./context/altoContext"
import AltoEditorProvider from "./context/altoEditorContext"

function App() {
	const [showTextEditor, setShowTextEditor] = useState(false)

	return (
		<PanelProvider>
			<AltoProvider>
				<AltoEditorProvider>
					<div className="relative flex">
						<div className="w-2/3 h-screen bg-white overflow-scroll">
							<Viewer />
						</div>
						<div className="w-1/3 h-screen bg-indigo-100 overflow-scroll">
							<Panel onOpenTextEditor={() => setShowTextEditor(true)} />
						</div>

						{showTextEditor && <TextEditor setShowTextEditor={setShowTextEditor} />}

						<AltoEditor />
						
					</div>
				</AltoEditorProvider>
			</AltoProvider>
		</PanelProvider>
	)
}

export default App

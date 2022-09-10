import { FC } from "react"
import Viewer from "./components/Viewer"
import Panel from "./components/Panel"
import { PanelProvider } from "./context/panelContext"
import AltoEditor from "./components/AltoEditor"
import TextEditor from "./components/TextEditor/TextEditor"
import AltoProvider from "./context/altoContext"
import AltoEditorProvider from "./context/altoEditorContext"
import TextEditorProvider from "./context/textEditorContext"

const App:FC = () => (
	<PanelProvider>
		<AltoProvider>
			<AltoEditorProvider>
				<TextEditorProvider>
					<div className="relative flex">
						<div className="w-2/3 h-screen bg-white overflow-scroll">
							<Viewer />
						</div>
						<div className="w-1/3 h-screen bg-indigo-100 overflow-scroll">
							<Panel />
						</div>
						<TextEditor />
						<AltoEditor />
					</div>
				</TextEditorProvider>
			</AltoEditorProvider>
		</AltoProvider>
	</PanelProvider>
)

export default App

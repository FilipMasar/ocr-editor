import { FC, useState } from "react"
import Viewer from "./components/Viewer"
import Panel from "./components/Panel"
import { PanelProvider } from "./context/panelContext"
import AltoEditor from "./components/AltoEditor"
import TextEditor from "./components/TextEditor/TextEditor"
import AltoProvider from "./context/altoContext"
import AltoEditorProvider from "./context/altoEditorContext"
import TextEditorProvider from "./context/textEditorContext"
import { AlignJustify } from "react-feather"

const App:FC = () => {
	const [panelOpened, setPanelOpened] = useState(true)

	return (
		<PanelProvider>
			<AltoProvider>
				<AltoEditorProvider>
					<TextEditorProvider>
						<div className="relative flex">
							<div className="z-10 btn-primary absolute top-0 right-0 p-2 m-2" onClick={() => setPanelOpened(old => !old)}>
								<AlignJustify />
							</div>
							<div className={`${panelOpened ? "w-2/3" : "w-screen"} h-screen bg-white overflow-scroll`}>
								<Viewer />
							</div>
							{panelOpened && (
								<div className="w-1/3 h-screen bg-indigo-100 overflow-scroll">
									<Panel />
								</div>
							)}
							<TextEditor />
							<AltoEditor />
						</div>
					</TextEditorProvider>
				</AltoEditorProvider>
			</AltoProvider>
		</PanelProvider>
	)
}


export default App

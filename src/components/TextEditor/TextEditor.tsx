import { FC, useCallback, useEffect } from "react"
import { X } from "react-feather"
import { useTextEditorContext } from "../../context/textEditorContext"
import { getStringsFromLine } from "../../utils/alto"
import EditableBlock from "./EditableBlock"
import EditableLine from "./EditableLine"


const TextEditor:FC  = () => {
	const { type, element, closeTextEditor } = useTextEditorContext()

	const escFunction = useCallback((event: KeyboardEvent) => {
		if (event.key === "Escape") closeTextEditor()
	}, [])

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false)

		return () => {
			document.removeEventListener("keydown", escFunction, false)
		}
	}, [])
	
	if (element === undefined) return null
  
	return (
		<>
			<div className="z-20 absolute bottom-0 left-0 right-0 flex items-end justify-center p-4">
				<div className="relative bg-gray-300 opacity-100 border p-4 inline-block max-h-[50vh] max-w-full overflow-auto">
					<div className=" z-50 absolute p-2 right-2 top-2 cursor-pointer" onClick={closeTextEditor}>
						<X />
					</div>

					<h2 className="text-xl mr-12 font-semibold">Text Editor</h2>
				
					{type === "ALL" && element.map((textBlock: any) => (
						<EditableBlock 
							key={textBlock.metadata.index}
							textBlock={textBlock}
						/>
					))}
				
					{type === "TEXTBLOCK" && <EditableBlock textBlock={element} />}

					{type === "TEXTLINE" && <EditableLine textLine={element} text={getStringsFromLine(element.element)} />}
				</div>
			</div>
			<div 
				onClick={closeTextEditor}
				className="z-10 absolute top-0 left-0 right-0 h-screen w-screen bg-black opacity-25"
			/>
		</>
	)
}

export default TextEditor
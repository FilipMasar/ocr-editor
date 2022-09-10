import { FC } from "react"
import { X } from "react-feather"
import { useTextEditorContext } from "../../context/textEditorContext"
import EditableBlock from "./EditableBlock"


const TextEditor:FC  = () => {
	const { type, element, closeTextEditor } = useTextEditorContext()

	if (element === undefined) return null
  
	return (
		<div className="absolute bottom-0 left-0 right-0 flex items-end justify-center p-4">
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
				
				{/* TODO */}
				{/* {type === "TEXTBLOCK" && <EditableBlock textBlock={element} />} */}
			</div>
		</div>
	)
}

export default TextEditor
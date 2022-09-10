import { Dispatch, FC, SetStateAction } from "react"
import { X } from "react-feather"
import { useAltoContext } from "../../context/altoContext"
import EditableBlock from "./EditableBlock"

interface TextEditorProps {
  setShowTextEditor: Dispatch<SetStateAction<boolean>>
}

const TextEditor:FC<TextEditorProps> = ({ setShowTextEditor }) => {
	const { textBlocks } = useAltoContext()
  
	return (
		<div className="absolute bottom-0 left-0 right-0 flex items-end justify-center p-4">
			<div className="relative bg-gray-300 opacity-100 border p-4 inline-block max-h-[50vh] max-w-full overflow-auto">
				<div className=" z-50 absolute p-2 right-2 top-2 cursor-pointer" onClick={() => setShowTextEditor(false)}>
					<X />
				</div>

				<h2 className="text-xl mr-12 font-semibold">Text Editor</h2>
				
				{textBlocks.map((textBlock: any) => (
					<EditableBlock 
						key={textBlock.metadata.index}
						textBlock={textBlock}
					/>
				))}
			</div>
		</div>
	)
}

export default TextEditor
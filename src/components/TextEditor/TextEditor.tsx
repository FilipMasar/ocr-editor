import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { X } from "react-feather"
import { useAltoContext } from "../../context/altoContext"
import TextBlock from "./TextBlock"

interface TextEditorProps {
  setShowTextEditor: Dispatch<SetStateAction<boolean>>
}

const TextEditor:FC<TextEditorProps> = ({ setShowTextEditor }) => {
	const { printSpace, updateString } = useAltoContext()
	const [textBlocks, setTextBlocks] = useState<any[]>([])

	useEffect(() => {
		setTextBlocks([])
		if (printSpace?.TextBlock) {
			if (Array.isArray(printSpace.TextBlock)) {
				setTextBlocks(printSpace.TextBlock.map((x: any, index: number) => ({
					...x,
					textBlockindex: index,
				})))
			} else {
				setTextBlocks([{...printSpace.TextBlock, textBlockindex: -1}])
			}
		}
	}, [printSpace])
  
	return (
		<div className="absolute bottom-0 left-0 right-0 flex items-end justify-center p-4">
			<div className="relative bg-gray-300 opacity-100 border p-4 inline-block max-h-[50vh] max-w-full overflow-auto">
				<div className=" z-50 absolute p-2 right-2 top-2 cursor-pointer" onClick={() => setShowTextEditor(false)}>
					<X />
				</div>
				<h2 className="text-xl mr-12 font-semibold">Text Editor</h2>
				{textBlocks.map((textBlock: any) => <TextBlock key={textBlock.textBlockindex} textBlock={textBlock} updateString={updateString} />)}
			</div>
		</div>
	)
}

export default TextEditor
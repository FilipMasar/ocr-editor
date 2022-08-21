import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react"
import ReactJson from "react-json-view"
import { X } from "react-feather"

interface AltoEditorProps {
  xmlData: any;
  setXmlData: Dispatch<any>
  setShowAltoEditor: Dispatch<SetStateAction<boolean>>
}

const AltoEditor:FC<AltoEditorProps> = ({ xmlData, setXmlData, setShowAltoEditor }) => {
	
	const escFunction = useCallback((event: KeyboardEvent) => {
		if (event.key === "Escape") {
			setShowAltoEditor(false)
		}
	}, [])

	useEffect(() => {
		document.addEventListener("keydown", escFunction, false)

		return () => {
			document.removeEventListener("keydown", escFunction, false)
		}
	}, [])
  
	return (
		<>
			<div className="z-20 absolute top-0 left-0 right-0 flex items-center justify-center h-screen w-screen">
				<div className="relative bg-gray-300 opacity-100 border p-4 inline-block w-2/3 h-2/3 overflow-auto">
					<div className=" z-50 absolute p-2 right-2 top-2 cursor-pointer" onClick={() => setShowAltoEditor(false)}>
						<X />
					</div>
					<ReactJson 
						src={xmlData}
						name={null}
						displayDataTypes={false}
						collapsed={3}
						onEdit={(edit) => setXmlData(edit.updated_src)} 
						onDelete={(edit) => setXmlData(edit.updated_src)} />
				</div>
			</div>
			<div className="z-10 absolute top-0 left-0 right-0 h-screen w-screen bg-black opacity-25" />
		</>
	)
}

export default AltoEditor
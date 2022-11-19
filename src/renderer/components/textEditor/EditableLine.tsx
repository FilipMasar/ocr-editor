import { FC, useCallback, useEffect, useRef, useState } from "react"
import { useAltoContext } from "../../context/altoContext"

interface EditableLineProps {
	text: string | string[]
  textLine: any
}

const EditableLine:FC<EditableLineProps> = ({ text, textLine }) => {
	const ref = useRef<HTMLDivElement>(null)
	const { updateString } = useAltoContext()
	const [error, setError] = useState<string>()

	const onUpdate = (newText: string | null | undefined) => {
		if (!newText) {
			setError("line cannot be empty")
			return
		}

		setError(undefined)

		if (Array.isArray(text)) {
			if (newText.split(" ").length === text.length) {
				// update
				newText.split(" ").forEach((value: string, index: number) => {
					updateString(textLine.metadata.textBlockIndex, textLine.metadata.index, index, value)
				})
			} else {
				setError("number of words is different. Firstly, add or delete node in alto editor")
			}
		} else {
			if (newText.split(" ").length === 1) {
				// update
				updateString(textLine.metadata.textBlockIndex, textLine.metadata.index, -1, newText)
			} else {
				setError("number of words is different. Firstly, add or delete node in alto editor")
			}
		}
	}

	const enterFunction = useCallback((event: KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault()
			onUpdate(ref.current?.textContent)
		}
	}, [])

	useEffect(() => {
		document.addEventListener("keydown", enterFunction, false)

		return () => {
			document.removeEventListener("keydown", enterFunction, false)
		}
	}, [])
  
	return (
		<>
			<div 
				ref={ref}
				contentEditable="true"
				suppressContentEditableWarning={true}
				onBlur={(e) => onUpdate(e.currentTarget.textContent)}
				className={error ? "border-2 border-red-500" : ""}
			>
				{Array.isArray(text) ? text.join(" ") : text}
			</div>
			{error && <label className="text-xs text-red-500">{error}</label>}
		</>
	)
}

export default EditableLine
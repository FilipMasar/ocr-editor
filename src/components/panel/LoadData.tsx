import { ChangeEvent, FC, MouseEvent, useState } from "react"
import { useAltoContext } from "../../context/altoContext"
import { usePanelContext } from "../../context/panelContext"
import { xmlToJson } from "../../utils/xmlConvertor"

const LoadData:FC = () => {
	const { setAlto} = useAltoContext()
	const { setImageSrc } = usePanelContext()
	const [error, setError] = useState<string>()

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target?.files?.length === 1) {
			const reader = new FileReader()
			reader.onload = async (e) => {
				setImageSrc(String(e.target?.result))
			}
			reader.readAsDataURL(event.target.files[0])
		}
	}

	function handleAltoChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target?.files?.length === 1) {
			const reader = new FileReader()
			reader.onload = async (e) => {
				const obj = xmlToJson(String(e.target?.result))
				setAlto(obj)
			}
			reader.readAsText(event.target.files[0])
		}
	}

	const loadFromLocalStorage = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		const a = localStorage.getItem("ocr-editor-alto")
		const i = localStorage.getItem("ocr-editor-image")

		if (!a || !i) {
			setError("No previously saved work found")
		} else {
			setAlto(JSON.parse(a))
			setImageSrc(i)
		}
	}

	return (
		<div className="p-4 mt-12">
			<button
				className="w-full btn-primary"
				onClick={loadFromLocalStorage}
			>
				Continue from previously closed work
			</button>
			{error && <label className="text-xs text-red-500">{error}</label>}

			<div className="text-center">or</div>

			<label htmlFor="altoFileInput">Pick ALTO xml File</label>
			<input 
				id='altoFileInput'
				type="file"
				accept=".xml"
				onChange={handleAltoChange}
				className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none" 
			/>

			<label htmlFor="scanFileInput">Pick jpeg scan</label>
			<input 
				id='scanFileInput'
				type="file"
				accept=".jpg"
				onChange={handleImageChange}
				className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none" 
			/>
		</div>
	)
}

export default LoadData
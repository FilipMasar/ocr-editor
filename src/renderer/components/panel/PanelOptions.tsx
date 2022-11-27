import FileSaver from "file-saver"
import { ChangeEvent, FC, MouseEvent, useCallback, useEffect } from "react"
import { Trash, Upload } from "react-feather"
import { useAltoContext } from "../../context/altoContext"
import { useAltoEditorContext } from "../../context/altoEditorContext"
import { usePanelContext } from "../../context/panelContext"
import { useTextEditorContext } from "../../context/AltoTextEditorContext"
import { jsonToXml } from "../../utils/xmlConvertor"

const fontColors = ["bg-blue-900 opacity-50", "bg-red-900 opacity-50", "bg-green-900 opacity-50", "bg-yellow-900 opacity-50"]

const PanelOptions:FC = () => {
	const { alto, setAlto, styles, setStyles, textBlocks } = useAltoContext()
	const { settings, setSettings, imageSrc, setImageSrc } = usePanelContext()
	const { zoom, imageOpacity } = settings
	const { openAltoEditor } = useAltoEditorContext()
	const { openTextEditor } = useTextEditorContext()

	const onExport = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (alto) {
			const xmlContent = jsonToXml(alto)
			const file = new File([xmlContent], "updated.xml")
			FileSaver.saveAs(file)
		}
	}

	const onStartOver = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (window.confirm("Are you sure you want to start over? All changes will be lost.")) {
			setAlto(undefined)
			setImageSrc(undefined)
		}
	}

	const updateZoom = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setSettings(old => ({...old, zoom: parseFloat(e.target.value)}))
	}

	const updateOpacity = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setSettings(old => ({...old, imageOpacity: parseFloat(e.target.value)}))
	}

	const saveToLocalStorage = useCallback(() => {
		if (alto && imageSrc) {
			localStorage.setItem("ocr-editor-alto", JSON.stringify(alto))
			localStorage.setItem("ocr-editor-image", imageSrc)
		}
	}, [alto, imageSrc])

	useEffect(() => {
		window.addEventListener("visibilitychange", saveToLocalStorage)

		return () => {
			window.removeEventListener("visibilitychange", saveToLocalStorage)
		}
	}, [saveToLocalStorage])

	return (
		<div className="p-4">
			<div className="flex gap-2 mb-2">
				<button
					className="w-full btn-primary"
					onClick={() => openAltoEditor(alto, () => setAlto)}
				>
					Open Alto Editor
				</button>
				<button
					className="w-full btn-primary"
					onClick={() => openTextEditor("ALL", textBlocks)}
				>
					Open Text Editor
				</button>
			</div>

			<label htmlFor="zoomInput">Zoom: {zoom}</label>
			<input
				id="zoomInput"
				className="w-full"
				type="range"
				min={0.1}
				max={2}
				step={0.1}
				value={zoom}
				onChange={updateZoom}
			/>

			<label htmlFor="opacityInput">Image opacity: {imageOpacity}</label>
			<input
				id="opacityInput"
				className="w-full"
				type="range"
				min={0}
				max={1}
				step={0.1}
				value={imageOpacity}
				onChange={updateOpacity}
			/>

			<hr className="w-full h-0.5 bg-black my-2"/>

			<p>Font settings:</p>
			{Object.keys(styles).map(key => (
				<div key={key} className="mt-2">
					<div className="flex gap-4">
						<label>{key}</label>
						<div className="flex gap-2">
							{fontColors.map(color => (
								<div
									key={color}
									className={`w-4 h-4 rounded-full ${color} cursor-pointer ${styles[key].color === color && "border-4 border-black"}`}
									onClick={() => {
										setStyles(old => ({...old, [key]: { ...old[key], color: old[key].color === color ? undefined : color }}))
										setSettings(old => ({...old, show: {...old.show, strings: true}}))
									}}
								/>
							))}
						</div>
					</div>
					<div className="flex gap-4 ml-2">
						<label>- FONTSIZE: </label>
						<input
							type="number"
							className="w-20 pl-2"
							value={styles[key].fontSize}
							onChange={(e) => setStyles(old => ({...old, [key]: {...old[key], fontSize: parseInt(e.target.value)}}))}
						/>
					</div>
					<div className="flex gap-4 ml-2 mt-2">
						<label>- FONTFAMILY: </label>
						<input
							type="text"
							className="w-40"
							value={styles[key].fontFamily}
							onChange={(e) => setStyles(old => ({...old, [key]: {...old[key], fontFamily: e.target.value}}))}
						/>
					</div>
				</div>
			))}

			<hr className="w-full h-0.5 bg-black my-2"/>

			<p>Display Elements:</p>

			<div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.printSpace}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, printSpace: e.target.checked}}))}
					/>
					<label>Print space</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.illustrations}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, illustrations: e.target.checked}}))}
					/>
					<label>Illustrations</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.graphicalElements}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, graphicalElements: e.target.checked}}))}
					/>
					<label>Graphical elements</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textBlocks}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textBlocks: e.target.checked}}))}
					/>
					<label>Text blocks</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textLines}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textLines: e.target.checked}}))}
					/>
					<label>Text lines</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.strings}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, strings: e.target.checked}}))}
					/>
					<label>Strings</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textFit}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textFit: e.target.checked}}))}
					/>
					<label>Text fit</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={settings.show.textAbove}
						onChange={(e) => setSettings(old => ({...old, show: {...old.show, textAbove: e.target.checked}}))}
					/>
					<label>Text above</label>
				</div>
			</div>

			<hr className="w-full h-0.5 bg-black my-2"/>

			<button
				className="w-full flex gap-2 justify-center items-center btn-primary mb-2"
				onClick={onExport}
				disabled={alto === undefined}
			>
				<Upload size={20} />
				<span>Export Updated XML</span>
			</button>

			<button
				className="mx-auto flex gap-2 justify-center items-center btn-red"
				onClick={onStartOver}
			>
				<Trash size={20} />
				<span>Start Over</span>
			</button>
		</div>
	)
}

export default PanelOptions

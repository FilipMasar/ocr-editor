import { FC} from "react"
import { useAltoContext } from "../../context/altoContext"
import { usePanelContext } from "../../context/panelContext"
import LoadData from "./LoadData"
import PanelOptions from "./PanelOptions"

const Panel:FC = () => {
	const { alto } = useAltoContext()
	const { imageSrc } = usePanelContext()

	if(alto === undefined || imageSrc === undefined) return <LoadData />

	return <PanelOptions />
}

export default Panel
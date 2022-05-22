import { FC } from "react"

interface PrintSpaceProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PrintSpace:FC<PrintSpaceProps> = ({ top, left, width, height }) => {
	return (
		<div style={{ position: "absolute", top, left, width, height, border: "1px black solid" }}/>
	)
}

export default PrintSpace
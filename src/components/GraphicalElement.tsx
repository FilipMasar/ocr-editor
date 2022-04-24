import { FC } from "react";

interface GraphicalElementProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const GraphicalElement:FC<GraphicalElementProps> = ({ top, left, width, height }) => {
  return (
    <div style={{ position: "absolute", top, left, width, height, border: "1px purple solid" }}/>
  )
}

export default GraphicalElement;
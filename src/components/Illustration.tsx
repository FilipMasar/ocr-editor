import { FC } from "react";

interface IllustrationProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Illustration:FC<IllustrationProps> = ({ top, left, width, height }) => {
  return (
    <div style={{ position: "absolute", top, left, width, height, border: "1px pink solid" }}/>
  )
}

export default Illustration;
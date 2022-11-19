import { FC } from 'react';
import { useAlto } from '../../context/AltoContext';
// import { useAltoEditorContext } from '../../context/altoEditorContext';
import { toNumber } from '../../utils/alto';

interface GraphicalElementProps {
  element: any;
  metadata: any;
}

const GraphicalElement: FC<GraphicalElementProps> = ({ element, metadata }) => {
  // const { updateGraphicalElement } = useAlto();
  // const { openAltoEditor } = useAltoEditorContext();

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);

  // const handleClick = () => {
  //   openAltoEditor(
  //     element,
  //     () => (updated: any) => updateGraphicalElement(updated, metadata.index)
  //   );
  // };

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid blue',
      }}
      // className="border border-purple-500 hover:bg-purple-500 hover:opacity-30"
    />
  );
};

export default GraphicalElement;

import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useAlto } from '../../context/app/AltoContext';
import { toNumber } from '../../utils/alto';
import { AltoGraphicalElementJson } from '../../types/alto';

interface GraphicalElementMetadata {
  index: number;
  source?: string;
  isEditable?: boolean;
  [key: string]: any; // Maintain compatibility with other properties
}

interface GraphicalElementProps {
  element: AltoGraphicalElementJson;
  metadata: GraphicalElementMetadata;
}

const GraphicalElement: FC<GraphicalElementProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const { updateGraphicalElement } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);

  const handleClick = () => {
    openAltoEditor(
      element,
      () => (updated: AltoGraphicalElementJson) => updateGraphicalElement(updated, metadata.index)
    );
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid blue',
        backgroundColor: hovered ? 'blue' : 'transparent',
        opacity: hovered ? 0.5 : 1,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};

export default GraphicalElement;

import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
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
  const { updateGraphicalElement, measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

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

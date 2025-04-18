import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor, useAlto, useSettings } from '../../context';
import { convertToPixels } from '../../utils/alto';
import { AltoGraphicalElementJson } from '../../types/alto';
import { elementColors } from './colors';

interface GraphicalElementProps {
  element: AltoGraphicalElementJson;
}

const GraphicalElement: FC<GraphicalElementProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { settings } = useSettings();
  
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: `${settings.borderWidth}px solid ${elementColors.graphicalElements.borderColor}`,
        backgroundColor: hovered ? elementColors.graphicalElements.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default GraphicalElement;

import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { AltoGraphicalElementJson } from '../../types/alto';
import { elementColors } from './colors';
import { useSettings } from '../../context/app/SettingsContext';

interface GraphicalElementProps {
  element: AltoGraphicalElementJson;
}

const GraphicalElement: FC<GraphicalElementProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { updateGraphicalElement, measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { settings } = useSettings();
  
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  const handleClick = () => {
    openAltoEditor(
      element,
      () => (updated: AltoGraphicalElementJson) => updateGraphicalElement(updated, 0)
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
        border: `${settings.borderWidth}px solid ${elementColors.graphicalElement.borderColor}`,
        backgroundColor: hovered ? elementColors.graphicalElement.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};

export default GraphicalElement;

import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { AltoMarginJson } from '../../types/alto';
import { useHover } from '@mantine/hooks';
import { elementColors } from './colors';
import { useSettings } from '../../context/app/SettingsContext';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';

interface MarginProps {
  element: AltoMarginJson;
}

const Margin: FC<MarginProps> = ({ element }) => {
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
        border: `${settings.borderWidth}px solid ${elementColors.margins.borderColor}`,
        backgroundColor: hovered ? elementColors.margins.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default Margin;

import { FC } from 'react';
import { AltoSpaceJson } from '../../types/alto';
import { useAlto, useAltoEditor, useSettings } from '../../context';
import { convertToPixels } from '../../utils/alto';
import { useHover } from '@mantine/hooks';
import { elementColors } from './colors';

interface SpaceProps {
  element: AltoSpaceJson;
}

const Space: FC<SpaceProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  const { settings } = useSettings();
  const { openAltoEditor } = useAltoEditor();

  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        border: `${settings.borderWidth}px solid ${elementColors.spaces.borderColor}`,
        backgroundColor: hovered ? elementColors.spaces.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default Space; 
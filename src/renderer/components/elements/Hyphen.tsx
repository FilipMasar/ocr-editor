import { FC } from 'react';
import { AltoHyphenJson } from '../../types/alto';
import { useAlto, useAltoEditor, useSettings } from '../../context';
import { convertToPixels } from '../../utils/alto';
import { useHover } from '@mantine/hooks';
import { elementColors } from './colors';

interface HyphenProps {
  element: AltoHyphenJson;
}

const Hyphen: FC<HyphenProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { settings } = useSettings();

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
        border: `${settings.borderWidth}px solid ${elementColors.hyphens.borderColor}`,
        backgroundColor: hovered ? elementColors.hyphens.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default Hyphen; 
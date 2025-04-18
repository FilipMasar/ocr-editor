import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAlto, useAltoEditor, useSettings } from '../../context';
import { convertToPixels } from '../../utils/alto';
import { AltoComposedBlockJson } from '../../types/alto';
import { elementColors } from './colors';

interface ComposedBlockProps {
  element: AltoComposedBlockJson;
}

const ComposedBlock: FC<ComposedBlockProps> = ({ element }) => {
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
        border: `${settings.borderWidth}px solid ${elementColors.composedBlocks.borderColor}`,
        backgroundColor: hovered ? elementColors.composedBlocks.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default ComposedBlock; 
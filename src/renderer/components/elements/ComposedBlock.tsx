import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { AltoComposedBlockJson } from '../../types/alto';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { elementColors } from './colors';

interface ComposedBlockProps {
  element: AltoComposedBlockJson;
}

const ComposedBlock: FC<ComposedBlockProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit, updateComposedBlock } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);
  
  const handleClick = () => {
    openAltoEditor(
      element,
      () => (updated: AltoComposedBlockJson) => updateComposedBlock(updated, 0)
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
        border: `1px solid ${elementColors.composedBlock.borderColor}`,
        backgroundColor: hovered ? elementColors.composedBlock.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};

export default ComposedBlock; 
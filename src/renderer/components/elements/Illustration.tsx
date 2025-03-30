import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { AltoIllustrationJson } from '../../types/alto';

interface IllustrationProps {
  element: AltoIllustrationJson;
}

const Illustration: FC<IllustrationProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { updateIllustration, measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  const handleClick = () => {
    openAltoEditor(
      element,
      () => (updated: AltoIllustrationJson) => updateIllustration(updated, 0)
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
        border: '1px solid pink',
        backgroundColor: hovered ? 'pink' : 'transparent',
        opacity: hovered ? 0.5 : 1,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};

export default Illustration;

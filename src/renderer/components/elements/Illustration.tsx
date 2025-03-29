import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useAlto } from '../../context/app/AltoContext';
import { toNumber } from '../../utils/alto';
import { AltoIllustrationJson } from '../../types/alto';

interface IllustrationMetadata {
  index: number;
  source?: string;
  isEditable?: boolean;
  [key: string]: any; // Maintain compatibility with other properties
}

interface IllustrationProps {
  element: AltoIllustrationJson;
  metadata: IllustrationMetadata;
}

const Illustration: FC<IllustrationProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const { updateIllustration } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);

  const handleClick = () => {
    openAltoEditor(
      element,
      () => (updated: AltoIllustrationJson) => updateIllustration(updated, metadata.index)
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

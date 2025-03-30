import { useHover } from '@mantine/hooks';
import { FC, useEffect } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useTextEditor } from '../../context/editor/AltoTextEditorContext';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoTextBlockJson } from '../../types/alto';

interface TextBlockProps {
  element: AltoTextBlockJson;
}

const TextBlock: FC<TextBlockProps> = ({ element }) => {
  const { ref, hovered } = useHover();

  const { updateTextBlock, measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { openTextEditor } = useTextEditor();

  // Convert coordinates using the current measurement unit
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.altKey) {
        openAltoEditor(
          element,
          () => (updated: AltoTextBlockJson) => updateTextBlock(updated, 0)
        );
      } else {
        openTextEditor('TEXTBLOCK', { element });
      }
    };

    const div = ref.current;

    if (div) {
      div.addEventListener('click', handleClick);

      return () => {
        div.removeEventListener('click', handleClick);
      };
    }
    return undefined;
  }, [
    element,
    openAltoEditor,
    openTextEditor,
    ref,
    updateTextBlock,
  ]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid red',
        backgroundColor: hovered ? 'red' : 'transparent',
        opacity: hovered ? 0.5 : 1,
        cursor: 'pointer',
      }}
    />
  );
};

export default withErrorBoundary(TextBlock, 'TextBlock');

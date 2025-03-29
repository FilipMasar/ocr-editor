import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useTextEditor } from '../../context/editor/AltoTextEditorContext';
import { useSettings } from '../../context/app/SettingsContext';
import { useAlto } from '../../context/app/AltoContext';
import { getStringsFromLine, convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoTextLineJson } from '../../types/alto';

interface TextLineMetadata {
  index: number;
  textBlockIndex: number;
  source?: string;
  isEditable?: boolean;
  [key: string]: any; // Maintain compatibility with other properties
}

interface TextLineProps {
  element: AltoTextLineJson;
  metadata: TextLineMetadata;
}

const TextLine: FC<TextLineProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const [text, setText] = useState<string>();
  const { updateTextLine, measurementUnit } = useAlto();
  const { settings } = useSettings();
  const { openAltoEditor } = useAltoEditor();
  const { openTextEditor } = useTextEditor();

  // Convert coordinates using the current measurement unit
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  useEffect(() => {
    const strings = getStringsFromLine(element);
    if (Array.isArray(strings)) {
      setText(strings.join(' '));
    } else {
      setText(strings);
    }
  }, [element]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.altKey) {
        openAltoEditor(
          element,
          () => (updated: AltoTextLineJson) =>
            updateTextLine(updated, metadata.textBlockIndex, metadata.index)
        );
      } else {
        openTextEditor('TEXTLINE', { element, metadata });
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
  }, [element, metadata, openAltoEditor, openTextEditor, ref, updateTextLine]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid orange',
        backgroundColor: hovered ? 'orange' : 'transparent',
        opacity: hovered ? 0.5 : 1,
        cursor: 'pointer',
      }}
      title={text}
    >
      {element.HYP && settings.show.hyphens && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 10,
            height,
            backgroundColor: 'rgba(0,255,0,0.7)',
          }}
        />
      )}
    </div>
  );
};

export default withErrorBoundary(TextLine, 'TextLine');

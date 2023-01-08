import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useAltoEditor } from 'renderer/context/AltoEditorContext';
import { useTextEditor } from 'renderer/context/AltoTextEditorContext';
import { useAlto } from '../../context/AltoContext';
import { getStringsFromLine, toNumber } from '../../utils/alto';

interface TextLineProps {
  element: any;
  metadata: any;
}

const TextLine: FC<TextLineProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const [text, setText] = useState<string>();
  const { updateTextLine } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { openTextEditor } = useTextEditor();

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);

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
          () => (updated: any) =>
            updateTextLine(updated, metadata.textBlockIndex, metadata.index)
        );
      } else {
        openTextEditor('TEXTLINE', { element, metadata });
      }
    };

    const div = ref.current;

    div.addEventListener('click', handleClick);

    return () => {
      div.removeEventListener('click', handleClick);
    };
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
      {element.HYP && (
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

export default TextLine;

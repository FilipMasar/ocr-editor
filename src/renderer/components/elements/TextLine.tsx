import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useAlto, useAltoEditor, useSettings } from '../../context';
import { getStringsFromLine, convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoTextLineJson } from '../../types/alto';
import { elementColors } from './colors';

interface TextLineProps {
  element: AltoTextLineJson;
}

const TextLine: FC<TextLineProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const [text, setText] = useState<string>();
  const { openAltoEditor } = useAltoEditor();
  const { measurementUnit } = useAlto();
  const { settings } = useSettings();

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


  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: `${settings.borderWidth}px solid ${elementColors.textLines.borderColor}`,
        backgroundColor: hovered ? elementColors.textLines.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      title={text}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default withErrorBoundary(TextLine, 'TextLine');

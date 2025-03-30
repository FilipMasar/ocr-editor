import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useSettings } from '../../context/app/SettingsContext';
import { useAlto } from '../../context/app/AltoContext';
import { getStringsFromLine, convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoTextLineJson } from '../../types/alto';


interface TextLineProps {
  element: AltoTextLineJson;
}

const TextLine: FC<TextLineProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const [text, setText] = useState<string>();
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

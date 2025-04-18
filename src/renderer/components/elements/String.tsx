import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAlto, useAltoEditor, useSettings } from '../../context';
import { TextStyle } from '../../types/app';
import { convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoStringJson } from '../../types/alto';
import { elementColors } from './colors';

const defaultStyle: TextStyle = {
  fontSize: 16,
  fontFamily: 'Times New Roman',
};

interface StringProps {
  element: AltoStringJson;
}

const String: FC<StringProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { settings } = useSettings();
  const { show } = settings;

  // Convert coordinates using the current measurement unit
  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);
  const text = element['@_CONTENT'];


  return (
    <>
      {/* Strings elements */}
      {show.strings && (
        <div
          ref={ref}
          style={{
            position: 'absolute',
            top,
            left,
            width,
            height,
            border: `${settings.borderWidth}px solid ${elementColors.strings.borderColor}`,
            backgroundColor: hovered ? elementColors.strings.backgroundColor : 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => openAltoEditor(element)}
        />
      )}

      {/* Text Fit */}
      {show.textFit && text && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'absolute',
            top,
            left,
            width,
            height,
            fontFamily: defaultStyle.fontFamily,
            fontSize: `calc(${defaultStyle.fontSize}pt / 0.2645833333)`,
            lineHeight: `${height}px`,
            color: 'black',
          }}
        >
          {text.split('').map((char: string, index: number) => (
            <span key={index}>{char}</span>
          ))}
        </div>
      )}

      {/* Text Above */}
      {show.textAbove && text && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            position: 'absolute',
            top: top - 20,
            left,
            width,
          }}
        >
          {text.split('').map((char: string, index: number) => (
            <span key={index} style={{ color: 'black' }}>
              {char}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default withErrorBoundary(String, 'String');

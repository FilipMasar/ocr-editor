import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useSettings } from '../../context/app/SettingsContext';
import { useAlto } from '../../context/app/AltoContext';
import { TextStyle } from '../../types/app';
import { toNumber } from '../../utils/alto';
import { AltoStringJson } from '../../types/alto';

const defaultStyle: TextStyle = {
  fontSize: 16,
  fontFamily: 'Times New Roman',
};

interface StringMetadata {
  index: number;
  '@_STYLEREFS'?: string;
  lineVPos?: number;
  [key: string]: any; // Keeping this for compatibility with other properties
}

interface StringProps {
  element: AltoStringJson;
  metadata: StringMetadata;
}

const String: FC<StringProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const { styles } = useAlto();
  const { settings } = useSettings();
  const { show } = settings;
  const [textStyle, setTextStyle] = useState<TextStyle>(defaultStyle);

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);
  const text = element['@_CONTENT'];

  useEffect(() => {
    if (!metadata['@_STYLEREFS']) {
      return;
    }
    
    const styleRefsArray = metadata['@_STYLEREFS'].split(' ');

    for (const id of styleRefsArray) {
      if (styles[id]) {
        setTextStyle(styles[id]);
      }
    }
  }, [metadata, styles]);

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
            border: '1px solid green',
            backgroundColor: hovered ? 'green' : 'transparent',
            opacity: hovered ? 0.5 : 1,
          }}
          // TODO className={`border border-green-500 hover:bg-green-500 hover:opacity-30 ${textStyle.color}`}
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
            fontFamily: textStyle.fontFamily,
            fontSize: `calc(${textStyle.fontSize}pt / 0.2645833333)`,
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
      {show.textAbove && text && metadata.lineVPos !== undefined && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            position: 'absolute',
            top: metadata.lineVPos - 20,
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

export default String;

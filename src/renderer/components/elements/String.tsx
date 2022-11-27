/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
import { useHover } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import { useAlto } from '../../context/AltoContext';
import { useEditor } from '../../context/EditorContext';
import { TextStyle } from '../../types/app';
import { toNumber } from '../../utils/alto';

const defaultStyle: TextStyle = {
  fontSize: 16,
  fontFamily: 'Times New Roman',
};

interface StringProps {
  element: any;
  metadata: any;
}

const String: FC<StringProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const { styles } = useAlto();
  const { settings } = useEditor();
  const { show } = settings;
  const [textStyle, setTextStyle] = useState<TextStyle>(defaultStyle);

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);
  const text = element['@_CONTENT'];

  useEffect(() => {
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
          style={{
            position: 'absolute',
            top,
            left,
            width,
            height,
            border: '1px solid green',
            backgroundColor: hovered ? 'green' : 'transparent',
            opacity: hovered ? 0.5 : 1,
            cursor: 'pointer',
          }}
          // TODO className={`border border-green-500 hover:bg-green-500 hover:opacity-30 ${textStyle.color}`}
        />
      )}

      {/* Text Fit */}
      {show.textFit && (
        <div
          className="flex items-start justify-between"
          style={{
            position: 'absolute',
            top,
            left,
            width,
            height,
            fontFamily: textStyle.fontFamily,
            fontSize: `calc(${textStyle.fontSize}pt / 0.2645833333)`,
            lineHeight: `${height}px`,
          }}
        >
          {text.split('').map((char: string, index: number) => (
            <span key={index}>{char}</span>
          ))}
        </div>
      )}

      {/* Text Above */}
      {show.textAbove && (
        <div
          className="flex items-start justify-around"
          style={{
            position: 'absolute',
            top: metadata.lineVPos - 20,
            left,
            width,
          }}
        >
          {text.split('').map((char: string, index: number) => (
            <span key={index}>{char}</span>
          ))}
        </div>
      )}
    </>
  );
};

export default String;

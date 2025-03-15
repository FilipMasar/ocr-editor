import { FC, useEffect, useState } from 'react';
import { addMetadata, getStringsFromLine } from '../../utils/alto';
import EditableLine from './EditableLine';
import { AltoTextBlockJson, AltoTextLineJson } from '../../types/alto';

interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    '@_STYLEREFS'?: string;
    [key: string]: any;
  };
}

interface TextLineElement extends AltoElement<AltoTextLineJson> {
  metadata: {
    index: number;
    '@_STYLEREFS'?: string;
    textBlockIndex?: number;
    [key: string]: any;
  };
}

interface TextBlockProps {
  textBlock: AltoElement<AltoTextBlockJson>;
  showTextNext?: boolean;
}

const EditableBlock: FC<TextBlockProps> = ({ textBlock, showTextNext }) => {
  const [textLines, setTextLines] = useState<TextLineElement[]>([]);

  useEffect(() => {
    setTextLines([]);
    if (textBlock.element?.TextLine) {
      const parentStyleRefs = textBlock.metadata['@_STYLEREFS'];
      const otherMetadata = {
        textBlockIndex: textBlock.metadata.index,
      };

      setTextLines(
        addMetadata(textBlock.element.TextLine, parentStyleRefs, otherMetadata) as TextLineElement[]
      );
    }
  }, [textBlock]);

  return (
    <div
      style={{
        margin: 8,
        padding: 8,
        border: showTextNext ? '' : '1px solid black',
      }}
    >
      {textLines.map((textLine: TextLineElement) => (
        <EditableLine
          key={`${textLine.metadata.textBlockIndex}-${textLine.metadata.index}`}
          text={getStringsFromLine(textLine.element)}
          textLine={textLine}
          showTextNext={showTextNext}
        />
      ))}
    </div>
  );
};

export default EditableBlock;

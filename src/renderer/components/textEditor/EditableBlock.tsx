import { FC, useEffect, useState } from 'react';
import { addMetadata, getStringsFromLine } from '../../utils/alto';
import EditableLine from './EditableLine';

interface TextBlockProps {
  textBlock: any;
  showTextNext?: boolean;
}

const EditableBlock: FC<TextBlockProps> = ({ textBlock, showTextNext }) => {
  const [textLines, setTextLines] = useState<any[]>([]);

  useEffect(() => {
    setTextLines([]);
    if (textBlock.element?.TextLine) {
      const parentStyleRefs = textBlock.metadata['@_STYLEREFS'];
      const otherMetadata = {
        textBlockIndex: textBlock.metadata.index,
      };

      setTextLines(
        addMetadata(textBlock.element.TextLine, parentStyleRefs, otherMetadata)
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
      {textLines.map((textLine: any) => (
        <EditableLine
          key={`${textLine.metadata.textBlockindex}${textLine.metadata.index}`}
          text={getStringsFromLine(textLine.element)}
          textLine={textLine}
          showTextNext={showTextNext}
        />
      ))}
    </div>
  );
};

export default EditableBlock;

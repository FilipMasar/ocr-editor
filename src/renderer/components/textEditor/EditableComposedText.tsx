import { FC, useEffect, useState } from 'react';
import { Badge, Stack, Title } from '@mantine/core';
import { addMetadata, getStringsFromLine } from '../../utils/alto';
import EditableLine from './EditableLine';
import { useAlto } from '../../context/app/AltoContext';
import { AltoComposedBlockJson, AltoTextBlockJson, AltoTextLineJson } from '../../types/alto';

interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    source?: string;
    isEditable?: boolean;
    textBlockIndex?: number;
    nestedTextBlockIndex?: number;
    composedBlockIndex?: number;
    [key: string]: any;
  };
}

interface EditableComposedTextProps {
  composedBlock: AltoElement<AltoComposedBlockJson>;
  showTextNext?: boolean;
}

const EditableComposedText: FC<EditableComposedTextProps> = ({ 
  composedBlock, 
  showTextNext 
}) => {
  const [nestedBlocks, setNestedBlocks] = useState<AltoTextBlockJson[]>([]);
  const [textLines, setTextLines] = useState<AltoElement<AltoTextLineJson>[]>([]);
  const { updateComposedBlockTextLine, updateComposedBlockString } = useAlto();


  // Process all text lines from the nested blocks
  useEffect(() => {
    setTextLines([]);

    nestedBlocks.forEach((block, blockIndex) => {
      if (block.TextLine) {
        const parentStyleRefs = block['@_STYLEREFS'] || composedBlock.metadata['@_STYLEREFS'];
        const otherMetadata = {
          composedBlockIndex: composedBlock.metadata.index,
          nestedTextBlockIndex: blockIndex,
          source: 'composedBlock',
          isEditable: true, // Enable text editing
        };

        setTextLines((old) => [
          ...old,
          ...addMetadata(block.TextLine, parentStyleRefs, otherMetadata)
        ]);
      }
    });
  }, [nestedBlocks, composedBlock]);

  // If there's no text, don't render anything
  if (textLines.length === 0) {
    return null;
  }

  const type = composedBlock.element['@_TYPE'] || 'Unknown';
  const id = composedBlock.element['@_ID'] || '';

  const handleUpdateTextLine = (updatedLine: AltoTextLineJson, lineIndex: number): void => {
    const textLine = textLines[lineIndex];
    if (!textLine) return;
    
    updateComposedBlockTextLine(
      updatedLine,
      composedBlock.metadata.index,
      textLine.metadata.nestedTextBlockIndex || 0,
      lineIndex
    );
  };

  const handleUpdateString = (
    lineIndex: number,
    stringIndex: number,
    value: string
  ): void => {
    const textLine = textLines[lineIndex];
    if (!textLine) return;
    
    updateComposedBlockString(
      composedBlock.metadata.index,
      textLine.metadata.nestedTextBlockIndex || 0,
      lineIndex,
      stringIndex,
      value
    );
  };

  return (
    <Stack
      spacing={8}
      style={{
        margin: 8,
        padding: 8,
        borderLeft: showTextNext ? '2px solid purple' : '1px solid black',
        paddingLeft: 12,
      }}
    >
      {!showTextNext && (
        <Title order={5} style={{ marginBottom: 5 }}>
          {type} {id && `(${id})`}
          <Badge size="xs" color="purple" ml={8}>Composed Block</Badge>
        </Title>
      )}
      
      {textLines.map((textLine, index: number) => (
        <EditableLine
          key={`composed-${composedBlock.metadata.index}-line-${index}`}
          text={getStringsFromLine(textLine.element)}
          textLine={textLine}
          showTextNext={showTextNext}
          onUpdateTextLine={(updatedLine) => handleUpdateTextLine(updatedLine, index)}
          onUpdateString={(stringIndex, value) => handleUpdateString(index, stringIndex, value)}
        />
      ))}
    </Stack>
  );
};

export default EditableComposedText; 
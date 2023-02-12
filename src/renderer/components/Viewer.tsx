/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
import { Title } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { useSettings } from 'renderer/context/SettingsContext';
import { useAlto } from '../context/AltoContext';
import { useEditor } from '../context/EditorContext';
import { addMetadata, toNumber } from '../utils/alto';
import GraphicalElement from './elements/GraphicalElement';
import Illustration from './elements/Illustration';
import PrintSpace from './elements/PrintSpace';
import String from './elements/String';
import TextBlock from './elements/TextBlock';
import TextLine from './elements/TextLine';
import EditableBlock from './textEditor/EditableBlock';

const Viewer: FC = () => {
  const [textLines, setTextLines] = useState<any[]>([]);
  const [strings, setStrings] = useState<any[]>([]);
  const {
    pageDimensions,
    printSpace,
    illustrations,
    graphicalElements,
    textBlocks,
  } = useAlto();
  const { settings } = useSettings();
  const { imageSrc } = useEditor();
  const { imageOpacity, show } = settings;

  useEffect(() => {
    setTextLines([]);
    for (const textBlock of textBlocks) {
      if (textBlock.element?.TextLine && textBlock.metadata) {
        const parentStyleRefs = textBlock.metadata['@_STYLEREFS'];
        const otherMetadata = {
          textBlockIndex: textBlock.metadata.index,
        };

        setTextLines((old) => [
          ...old,
          ...addMetadata(
            textBlock.element.TextLine,
            parentStyleRefs,
            otherMetadata
          ),
        ]);
      }
    }
  }, [textBlocks]);

  useEffect(() => {
    setStrings([]);
    for (const textLine of textLines) {
      if (textLine.element?.String && textLine.metadata) {
        const parentStyleRefs = textLine.metadata['@_STYLEREFS'];
        const otherMetadata = {
          textBlockIndex: textLine.metadata.textBlockIndex,
          textLineIndex: textLine.metadata.index,
          lineVPos: toNumber(textLine.element['@_VPOS']),
        };

        setStrings((old) => [
          ...old,
          ...addMetadata(
            textLine.element.String,
            parentStyleRefs,
            otherMetadata
          ),
        ]);
      }
    }
  }, [textLines]);

  if (!pageDimensions.height || !pageDimensions.width) {
    return <Title>No or wrong xml</Title>;
  }

  return (
    <>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="page scan"
          width={pageDimensions.width}
          height={pageDimensions.height}
          style={{ opacity: imageOpacity / 100, maxWidth: 'none' }}
        />
      )}

      {show.printSpace && (
        <PrintSpace
          top={toNumber(printSpace['@_VPOS'])}
          left={toNumber(printSpace['@_HPOS'])}
          width={toNumber(printSpace['@_WIDTH'])}
          height={toNumber(printSpace['@_HEIGHT'])}
        />
      )}

      {show.illustrations &&
        illustrations.map((illustration: any, index: number) => (
          <Illustration
            key={index}
            element={illustration.element}
            metadata={illustration.metadata}
          />
        ))}

      {show.graphicalElements &&
        graphicalElements.map((graphicalElement: any, index: number) => (
          <GraphicalElement
            key={index}
            element={graphicalElement.element}
            metadata={graphicalElement.metadata}
          />
        ))}

      {show.textBlocks &&
        textBlocks.map((textBlock: any, index: number) => (
          <TextBlock
            key={index}
            element={textBlock.element}
            metadata={textBlock.metadata}
          />
        ))}

      {show.textLines &&
        textLines.map((textLine: any, index: number) => (
          <TextLine
            key={index}
            element={textLine.element}
            metadata={textLine.metadata}
          />
        ))}

      {strings.map((string: any, index: number) => (
        <String
          key={index}
          element={string.element}
          metadata={string.metadata}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          top: toNumber(printSpace['@_VPOS']),
          left:
            toNumber(printSpace['@_HPOS']) + toNumber(printSpace['@_WIDTH']),
          width: toNumber(printSpace['@_WIDTH']),
          height: toNumber(printSpace['@_HEIGHT']),
        }}
      >
        {settings.show.textNext &&
          textBlocks.map((textBlock: any) => (
            <EditableBlock
              key={textBlock.metadata.index}
              textBlock={textBlock}
              showTextNext
            />
          ))}
      </div>
    </>
  );
};

export default Viewer;

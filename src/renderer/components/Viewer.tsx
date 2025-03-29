import { Title } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { useSettings } from '../context/app/SettingsContext';
import { useAlto } from '../context/app/AltoContext';
import { useEditor } from '../context/editor/EditorContext';
import { addMetadata, convertToPixels } from '../utils/alto';
import { getTextBlocksFromComposedBlock } from '../utils/composedBlockUtils';
import GraphicalElement from './elements/GraphicalElement';
import Illustration from './elements/Illustration';
import PrintSpace from './elements/PrintSpace';
import String from './elements/String';
import TextBlock from './elements/TextBlock';
import TextLine from './elements/TextLine';
import ComposedBlock from './elements/ComposedBlock';
import EditableBlock from './textEditor/EditableBlock';
import EditableComposedText from './textEditor/EditableComposedText';
import { AltoTextLineJson, AltoStringJson } from '../types/alto';

// Define this interface to match what TextLine component expects
interface TextLineMetadata {
  index: number;
  textBlockIndex: number;
  source?: string;
  isEditable?: boolean;
  [key: string]: any; // Keep compatibility with other properties
}

// Define a more generic metadata interface for other elements
interface BaseMetadata {
  index: number;
  source?: string;
  textBlockIndex?: number;
  nestedTextBlockIndex?: number;
  composedBlockIndex?: number;
  '@_STYLEREFS'?: string;
  [key: string]: any;  // Keep this for backward compatibility
}

// Generic element interface
interface AltoElement<T, M = BaseMetadata> {
  element: T;
  metadata: M;
}

const Viewer: FC = () => {
  const [textLines, setTextLines] = useState<AltoElement<AltoTextLineJson, TextLineMetadata>[]>([]);
  const [strings, setStrings] = useState<AltoElement<AltoStringJson>[]>([]);
  const {
    pageDimensions,
    printSpace,
    illustrations,
    graphicalElements,
    textBlocks,
    composedBlocks,
    alto,
    measurementUnit,
  } = useAlto();
  const { settings } = useSettings();
  const { imageSrc } = useEditor();
  const { imageOpacity, show } = settings;

  console.log(alto);

  useEffect(() => {
    setTextLines([]);
    let uniqueIdCounter = 0; // Add a counter for generating unique IDs
    
    for (const textBlock of textBlocks) {
      if (textBlock.element?.TextLine && textBlock.metadata) {
        const parentStyleRefs = textBlock.metadata['@_STYLEREFS'];
        const otherMetadata = {
          textBlockIndex: textBlock.metadata.index,
          source: 'textBlock',
          uniqueId: uniqueIdCounter++, // Assign a unique ID
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
    
    if (show.composedBlocks && composedBlocks.length > 0) {
      for (const composedBlock of composedBlocks) {
        const nestedTextBlocks = getTextBlocksFromComposedBlock(composedBlock.element);
        
        for (let i = 0; i < nestedTextBlocks.length; i++) {
          const nestedBlock = nestedTextBlocks[i];
          if (nestedBlock.TextLine) {
            const parentStyleRefs = nestedBlock['@_STYLEREFS'] || composedBlock.metadata['@_STYLEREFS'];
            const otherMetadata = {
              composedBlockIndex: composedBlock.metadata.index,
              nestedTextBlockIndex: i,
              source: 'composedBlock',
              textBlockIndex: i, // Ensure textBlockIndex is provided
              uniqueId: uniqueIdCounter++, // Assign a unique ID
            };
            
            setTextLines((old) => [
              ...old,
              ...addMetadata(
                nestedBlock.TextLine,
                parentStyleRefs,
                otherMetadata
              ),
            ]);
          }
        }
      }
    }
  }, [textBlocks, composedBlocks, show.composedBlocks]);

  useEffect(() => {
    setStrings([]);
    let uniqueIdCounter = 0; // Add a counter for generating unique IDs
    
    for (const textLine of textLines) {
      if (textLine.element?.String && textLine.metadata) {
        const parentStyleRefs = textLine.metadata['@_STYLEREFS'];
        const otherMetadata = {
          ...textLine.metadata,
          textLineIndex: textLine.metadata.index,
          lineVPos: convertToPixels(textLine.element['@_VPOS'], measurementUnit),
          uniqueId: uniqueIdCounter++, // Add a unique ID to each string's metadata
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
  }, [textLines, measurementUnit]);

  // Check for valid page dimensions - provide a better error message
  if (pageDimensions.height === null) {
    return (
      <Title order={2} style={{ textAlign: 'center', marginTop: '2rem' }}>
        Loading page dimensions...
      </Title>
    );
  }
  
  if (!pageDimensions.height || !pageDimensions.width) {
    console.error("Invalid page dimensions:", pageDimensions);
    console.error("Current ALTO structure:", alto);
    
    return (
      <Title order={2} style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>
        Error: Missing page dimensions
        <div style={{ fontSize: '1rem', marginTop: '1rem' }}>
          Please check that your ALTO file has WIDTH and HEIGHT attributes either:
          <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            <li>In the &lt;Page&gt; element, or</li>
            <li>In the &lt;PrintSpace&gt; element</li>
          </ul>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
            Try opening the ALTO file in a text editor and ensure it includes:<br/>
            <code>&lt;Page WIDTH="1234" HEIGHT="5678"&gt;</code> or<br/>
            <code>&lt;PrintSpace WIDTH="1234" HEIGHT="5678"&gt;</code>
          </div>
        </div>
      </Title>
    );
  }

  const renderEditableBlocks = () => {
    const blocks = [];
    
    for (const textBlock of textBlocks) {
      blocks.push(
        <EditableBlock
          key={`textblock-${textBlock.metadata.index}`}
          textBlock={textBlock}
          showTextNext
        />
      );
    }
    
    if (show.composedBlocks && composedBlocks.length > 0) {
      for (const composedBlock of composedBlocks) {
        blocks.push(
          <EditableComposedText
            key={`composedblock-${composedBlock.metadata.index}`}
            composedBlock={composedBlock}
            showTextNext
          />
        );
      }
    }
    
    return blocks;
  };

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

      {show.printSpace && printSpace && (
        <PrintSpace
          top={convertToPixels(printSpace['@_VPOS'], measurementUnit)}
          left={convertToPixels(printSpace['@_HPOS'], measurementUnit)}
          width={convertToPixels(printSpace['@_WIDTH'], measurementUnit)}
          height={convertToPixels(printSpace['@_HEIGHT'], measurementUnit)}
        />
      )}

      {show.illustrations &&
        illustrations.map((illustration) => (
          <Illustration
            key={`illustration-${illustration.metadata.index}`}
            element={illustration.element}
            metadata={illustration.metadata}
          />
        ))}

      {show.graphicalElements &&
        graphicalElements.map((graphicalElement) => (
          <GraphicalElement
            key={`graphical-element-${graphicalElement.metadata.index}`}
            element={graphicalElement.element}
            metadata={graphicalElement.metadata}
          />
        ))}

      {show.composedBlocks &&
        composedBlocks.map((composedBlock) => (
          <ComposedBlock
            key={`composed-block-${composedBlock.metadata.index}`}
            element={composedBlock.element}
            metadata={composedBlock.metadata}
          />
        ))}

      {show.textBlocks &&
        textBlocks.map((textBlock) => (
          <TextBlock
            key={`text-block-${textBlock.metadata.index}`}
            element={textBlock.element}
            metadata={textBlock.metadata}
          />
        ))}

      {show.textLines &&
        textLines.map((textLine) => {
          // Create a stable composite key using available identifiers
          const lineId = textLine.element['@_ID'] || textLine.metadata.index || 'unknown';
          const blockId = textLine.metadata.textBlockIndex ?? 'unknown';
          // Include source to differentiate between textBlock and composedBlock
          const source = textLine.metadata.source || 'unknown';
          // Include composed block index if from a composed block
          const composedId = textLine.metadata.composedBlockIndex !== undefined 
            ? `-cb${textLine.metadata.composedBlockIndex}` 
            : '';
          
          // Create a stable composite key
          const stableKey = `textline-${source}${composedId}-b${blockId}-l${lineId}`;
          
          return (
            <TextLine
              key={stableKey}
              element={textLine.element}
              metadata={textLine.metadata}
            />
          );
        })}

      {strings.map((string) => {
        // Create a stable composite key using available identifiers
        const blockId = string.metadata.textBlockIndex ?? 'unknown';
        const lineId = string.metadata.textLineIndex ?? 'unknown';
        const stringId = string.element['@_ID'] || string.metadata.index || 'unknown';
        // Include source to differentiate between textBlock and composedBlock
        const source = string.metadata.source || 'unknown';
        // Include composed block index if from a composed block
        const composedId = string.metadata.composedBlockIndex !== undefined 
          ? `-cb${string.metadata.composedBlockIndex}` 
          : '';
        
        // Create a stable composite key
        const stableKey = `string-${source}${composedId}-b${blockId}-l${lineId}-s${stringId}`;
        
        return (
          <String
            key={stableKey}
            element={string.element}
            metadata={string.metadata}
          />
        );
      })}

      {printSpace && (
        <div
          style={{
            position: 'absolute',
            top: convertToPixels(printSpace['@_VPOS'], measurementUnit),
            left:
              convertToPixels(printSpace['@_HPOS'], measurementUnit) + convertToPixels(printSpace['@_WIDTH'], measurementUnit),
            width: convertToPixels(printSpace['@_WIDTH'], measurementUnit),
            height: convertToPixels(printSpace['@_HEIGHT'], measurementUnit),
          }}
        >
          {settings.show.textNext && renderEditableBlocks()}
        </div>
      )}
    </>
  );
};

export default Viewer;

import { Title } from '@mantine/core';
import { FC } from 'react';
import { useSettings } from '../context/app/SettingsContext';
import { useAlto } from '../context/app/AltoContext';
import { useEditor } from '../context/editor/EditorContext';
import GraphicalElement from './elements/GraphicalElement';
import Illustration from './elements/Illustration';
import PrintSpace from './elements/PrintSpace';
import String from './elements/String';
import TextBlock from './elements/TextBlock';
import TextLine from './elements/TextLine';
import ComposedBlock from './elements/ComposedBlock';
import Page from './elements/Page';
import Margin from './elements/Margin';
import Hyphen from './elements/Hyphen';
import Space from './elements/Space';

const Viewer: FC = () => {
  const {
    pageDimensions,
    page,
    margins,
    printSpace,
    illustrations,
    graphicalElements,
    textBlocks,
    composedBlocks,
    textLines,
    textStrings,
    alto,
    hyphens,
    spaces,
  } = useAlto();
  const { settings } = useSettings();
  const { imageSrc } = useEditor();
  const { imageOpacity, show } = settings;

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

      {show.page && page && (
        <Page
          element={page}
        />
      )}

      {show.margins && 
        margins.map((margin) => (
          <Margin
            key={margin['@_CUSTOM_ID']}
            element={margin}
          />
        ))}

      {show.printSpace && printSpace && (
        <PrintSpace
          element={printSpace}
        />
      )}

      {show.composedBlocks &&
        composedBlocks.map((composedBlock) => (
          <ComposedBlock
            key={composedBlock['@_CUSTOM_ID']}
            element={composedBlock}
          />
        ))}

      {show.illustrations &&
        illustrations.map((illustration) => (
          <Illustration
            key={illustration['@_CUSTOM_ID']}
            element={illustration}
          />
        ))}

      {show.graphicalElements &&
        graphicalElements.map((graphicalElement) => (
          <GraphicalElement
            key={graphicalElement['@_CUSTOM_ID']}
            element={graphicalElement}
          />
        ))}

      {show.textBlocks &&
        textBlocks.map((textBlock) => (
          <TextBlock
            key={textBlock['@_CUSTOM_ID']}
            element={textBlock}
          />
        ))}

      {show.textLines &&
        textLines.map((textLine) => (
          <TextLine
            key={textLine['@_CUSTOM_ID']}
            element={textLine}
          />
        ))}

      {show.strings &&
        textStrings.map((string) => (
          <String
            key={string['@_CUSTOM_ID']}
            element={string}
          />
        ))}

      {show.hyphens &&
        hyphens.map((hyphen) => (
          <Hyphen
            key={hyphen['@_CUSTOM_ID']}
            element={hyphen}
          />
        ))}

      {show.spaces &&
        spaces.map((space) => (
          <Space
            key={space['@_CUSTOM_ID']}
            element={space}
          />
        ))}
    </>
  );
};

export default Viewer;

import { FC } from 'react';
import { AltoComposedBlockJson } from '../../types/alto';
import { getTextBlocksFromComposedBlock, getIllustrationsFromComposedBlock, getGraphicalElementsFromComposedBlock, getTextFromComposedBlock } from '../../utils/composedBlockUtils';
import { ensureArray } from '../../utils/alto';

interface ComposedBlockDetailsProps {
  composedBlock: AltoComposedBlockJson;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

const ComposedBlockDetails: FC<ComposedBlockDetailsProps> = ({ 
  composedBlock, 
  position = 'top-right' 
}) => {
  // Get counts of nested elements
  const textBlockCount = getTextBlocksFromComposedBlock(composedBlock).length;
  const illustrationCount = getIllustrationsFromComposedBlock(composedBlock).length;
  const graphicalElementCount = getGraphicalElementsFromComposedBlock(composedBlock).length;
  const nestedComposedBlockCount = ensureArray(composedBlock.ComposedBlock || []).length;
  
  // Get type and ID information
  const type = composedBlock['@_TYPE'] || 'Unknown';
  const id = composedBlock['@_ID'] || '';
  
  // Get snippet of text content (limited to 60 chars)
  const textContent = getTextFromComposedBlock(composedBlock);
  const textSnippet = textContent.length > 60 
    ? `${textContent.substring(0, 57)}...` 
    : textContent;
  
  // Determine position styling
  let positionStyle = {};
  switch (position) {
    case 'top-right':
      positionStyle = { top: 0, right: 0 };
      break;
    case 'bottom-right':
      positionStyle = { bottom: 0, right: 0 };
      break;
    case 'top-left':
      positionStyle = { top: 0, left: 0 };
      break;
    case 'bottom-left':
      positionStyle = { bottom: 0, left: 0 };
      break;
  }
  
  return (
    <div 
      style={{
        position: 'absolute',
        ...positionStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid purple',
        borderRadius: '4px',
        padding: '5px 8px',
        fontSize: '11px',
        maxWidth: '200px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        zIndex: 10,
      }}
    >
      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '3px', marginBottom: '3px' }}>
        {type} {id && `(${id})`}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {textBlockCount > 0 && (
          <div>Text Blocks: {textBlockCount}</div>
        )}
        {illustrationCount > 0 && (
          <div>Illustrations: {illustrationCount}</div>
        )}
        {graphicalElementCount > 0 && (
          <div>Graphical Elements: {graphicalElementCount}</div>
        )}
        {nestedComposedBlockCount > 0 && (
          <div>Nested Composed Blocks: {nestedComposedBlockCount}</div>
        )}
        
        {textSnippet && (
          <div style={{ marginTop: '3px', fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
            "{textSnippet}"
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposedBlockDetails; 
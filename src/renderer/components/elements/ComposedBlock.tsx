import { useHover } from '@mantine/hooks';
import { FC, useCallback, useState, useEffect } from 'react';
import { useAltoEditor } from '../../context/AltoEditorContext';
import { useAlto } from '../../context/AltoContext';
import { toNumber } from '../../utils/alto';
import ComposedBlockDetails from './ComposedBlockDetails';
import ComposedBlockViewer from './ComposedBlockViewer';
import { 
  AltoComposedBlockJson, 
  AltoTextBlockJson, 
  AltoIllustrationJson, 
  AltoGraphicalElementJson 
} from '../../types/alto';

interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    [key: string]: any;
  };
}

interface ComposedBlockProps {
  element: AltoComposedBlockJson;
  metadata: {
    index: number;
    [key: string]: any;
  };
}

const ComposedBlock: FC<ComposedBlockProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const { updateComposedBlock } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const [viewerOpen, setViewerOpen] = useState(false);

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);
  const type = element['@_TYPE'] || 'Unknown';

  const handleClick = useCallback((event: MouseEvent) => {
    if (event.altKey) {
      openAltoEditor(
        element,
        () => (updated: AltoComposedBlockJson) => updateComposedBlock(updated, metadata.index)
      );
    } else {
      setViewerOpen(true);
    }
  }, [element, metadata.index, openAltoEditor, updateComposedBlock]);

  const handleEditElement = useCallback((
    elementToEdit: AltoTextBlockJson | AltoIllustrationJson | AltoGraphicalElementJson | AltoComposedBlockJson, 
    elementType: string, 
    index: number
  ) => {
    openAltoEditor(
      elementToEdit,
      () => (updated: any) => {
        // For this example, we'll just update the entire ComposedBlock
        // In a production app, you'd update the specific nested element
        const updatedComposedBlock = { ...element };
        
        // Update the specific element based on its type and index
        switch (elementType) {
          case 'TextBlock':
            if (Array.isArray(updatedComposedBlock.TextBlock)) {
              updatedComposedBlock.TextBlock[index] = updated as AltoTextBlockJson;
            } else if (index === 0) {
              updatedComposedBlock.TextBlock = updated as AltoTextBlockJson;
            }
            break;
          case 'Illustration':
            if (Array.isArray(updatedComposedBlock.Illustration)) {
              updatedComposedBlock.Illustration[index] = updated as AltoIllustrationJson;
            } else if (index === 0) {
              updatedComposedBlock.Illustration = updated as AltoIllustrationJson;
            }
            break;
          case 'GraphicalElement':
            if (Array.isArray(updatedComposedBlock.GraphicalElement)) {
              updatedComposedBlock.GraphicalElement[index] = updated as AltoGraphicalElementJson;
            } else if (index === 0) {
              updatedComposedBlock.GraphicalElement = updated as AltoGraphicalElementJson;
            }
            break;
          case 'ComposedBlock':
            if (Array.isArray(updatedComposedBlock.ComposedBlock)) {
              updatedComposedBlock.ComposedBlock[index] = updated as AltoComposedBlockJson;
            } else if (index === 0) {
              updatedComposedBlock.ComposedBlock = updated as AltoComposedBlockJson;
            }
            break;
        }
        
        // Update the entire ComposedBlock with our changes
        return updateComposedBlock(updatedComposedBlock, metadata.index);
      }
    );
  }, [element, metadata.index, openAltoEditor, updateComposedBlock]);

  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    
    div.addEventListener('click', handleClick);
    
    return () => {
      div.removeEventListener('click', handleClick);
    };
  }, [handleClick, ref]);

  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top,
          left,
          width,
          height,
          border: '2px dashed purple',
          backgroundColor: hovered ? 'rgba(128, 0, 128, 0.2)' : 'transparent',
          opacity: hovered ? 0.7 : 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={`ComposedBlock: ${type} (${width}x${height}) - Click to view details, Alt+Click to edit raw`}
      >
        {hovered && (
          <>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'purple',
                pointerEvents: 'none',
              }}
            >
              {type}
            </div>
            <ComposedBlockDetails 
              composedBlock={element} 
              position="bottom-right"
            />
          </>
        )}
      </div>
      
      <ComposedBlockViewer
        composedBlock={element}
        opened={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onEditElement={handleEditElement}
      />
    </>
  );
};

export default ComposedBlock; 
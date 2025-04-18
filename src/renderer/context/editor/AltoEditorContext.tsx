import { Modal } from '@mantine/core';
import ReactJson from '@microlink/react-json-view';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { 
  AltoTextBlockJson, 
  AltoTextLineJson, 
  AltoStringJson,
  AltoGraphicalElementJson,
  AltoIllustrationJson,
  AltoComposedBlockJson,
  AltoJson 
} from '../../types/alto';
import { updateElementInAlto } from '../../utils/alto';
import { useAlto } from '../app/AltoContext';
/**
 * Union type of all possible ALTO elements that can be edited
 */
type AltoElement = 
  | AltoJson 
  | AltoTextBlockJson 
  | AltoTextLineJson 
  | AltoStringJson 
  | AltoGraphicalElementJson 
  | AltoIllustrationJson 
  | AltoComposedBlockJson;

/**
 * Alto Editor context value interface
 */
interface AltoEditorProviderValue {
  openAltoEditor: (altoElement: AltoElement) => void;
}

// Context
const AltoEditorContext = createContext({} as AltoEditorProviderValue);

/**
 * Hook to access the ALTO editor context
 */
export const useAltoEditor = () => useContext(AltoEditorContext);

/**
 * Provider component for the ALTO editor context
 */
const AltoEditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [altoNode, setAltoNode] = useState<AltoElement | undefined>();
  const [customId, setCustomId] = useState<string>();
  const { alto, setAlto } = useAlto();

  /**
   * Open the ALTO editor with the specified element and update callback
   */
  const openAltoEditor = (altoElement: AltoElement) => {
    setAltoNode(altoElement);
    setCustomId(altoElement["@_CUSTOM_ID"]);
  };

  const onClose = () => {
    setAltoNode(undefined);
    setCustomId(undefined);
  };

  const onUpdate = useCallback((element: any) => {
    const updatedAlto = updateElementInAlto(alto, element, customId);
    setAlto(updatedAlto);
  }, [alto, customId]);

  return (
    <AltoEditorContext.Provider value={{ openAltoEditor }}>
      {children}
      <Modal
        opened={altoNode !== undefined}
        onClose={onClose}
        title="Edit alto element"
        size="xl"
        overflow="inside"
      >
        {altoNode && (
          <ReactJson
            src={altoNode}
            name={null}
            displayDataTypes={false}
            collapsed={3}
            onAdd={(edit) => onUpdate(edit.updated_src)}
            onEdit={(edit) => onUpdate(edit.updated_src)}
            onDelete={(edit) => onUpdate(edit.updated_src)}
            theme="shapeshifter"
            style={{ padding: 16 }}
          />
        )}
      </Modal>
    </AltoEditorContext.Provider>
  );
};

export default AltoEditorProvider; 
import { Modal } from '@mantine/core';
import ReactJson from '@microlink/react-json-view';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
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

// Type for update callback function
type UpdateCallback = (updatedElement: AltoElement) => void;
type UpdateFactory = () => UpdateCallback;

/**
 * Alto Editor context value interface
 */
interface AltoEditorProviderValue {
  openAltoEditor: (altoElement: AltoElement, onUpdate: UpdateFactory) => void;
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
  const [alto, setAlto] = useState<AltoElement | undefined>();
  const [update, setUpdate] = useState<UpdateCallback | undefined>();

  /**
   * Open the ALTO editor with the specified element and update callback
   */
  const openAltoEditor = (altoElement: AltoElement, onUpdate: UpdateFactory) => {
    setAlto(altoElement);
    setUpdate(() => onUpdate());
  };

  const onClose = () => {
    setAlto(undefined);
    setUpdate(undefined);
  };

  return (
    <AltoEditorContext.Provider
      value={{
        openAltoEditor,
      }}
    >
      {children}
      <Modal
        opened={alto !== undefined}
        onClose={onClose}
        title="Edit alto element"
        size="xl"
        overflow="inside"
      >
        {alto && update && (
          <ReactJson
            src={alto}
            name={null}
            displayDataTypes={false}
            collapsed={3}
            onAdd={(edit) => update(edit.updated_src as AltoElement)}
            onEdit={(edit) => update(edit.updated_src as AltoElement)}
            onDelete={(edit) => update(edit.updated_src as AltoElement)}
            theme="shapeshifter"
            style={{ padding: 16 }}
          />
        )}
      </Modal>
    </AltoEditorContext.Provider>
  );
};

export default AltoEditorProvider; 
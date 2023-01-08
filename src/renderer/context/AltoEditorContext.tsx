import { Modal } from '@mantine/core';
import ReactJson from '@microlink/react-json-view';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

interface AltoEditorProviderValue {
  openAltoEditor: (altoElement: any, onUpdate: any) => void;
}

// Context
const AltoEditorContext = createContext({} as AltoEditorProviderValue);

// useContext
export const useAltoEditor = () => useContext(AltoEditorContext);

// Provider
const AltoEditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alto, setAlto] = useState<any>();
  const [update, setUpdate] = useState<any>();

  const openAltoEditor = (altoElement: any, onUpdate: any) => {
    setAlto(altoElement);
    setUpdate(onUpdate);
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
        <ReactJson
          src={alto}
          name={null}
          displayDataTypes={false}
          collapsed={3}
          onAdd={(edit) => update(edit.updated_src)}
          onEdit={(edit) => update(edit.updated_src)}
          onDelete={(edit) => update(edit.updated_src)}
          theme="shapeshifter"
          style={{ padding: 16 }}
        />
      </Modal>
    </AltoEditorContext.Provider>
  );
};

export default AltoEditorProvider;

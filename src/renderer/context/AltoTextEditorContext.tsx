import { Modal } from '@mantine/core';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import EditableBlock from 'renderer/components/textEditor/EditableBlock';
import EditableLine from 'renderer/components/textEditor/EditableLine';
import { getStringsFromLine } from 'renderer/utils/alto';

type ElementToEdit = 'ALL' | 'TEXTBLOCK' | 'TEXTLINE';

interface TextEditorProviderValue {
  openTextEditor: (type: ElementToEdit, element: any) => void;
}

// Context
const AltoTextEditorContext = createContext({} as TextEditorProviderValue);

// useContext
export const useTextEditor = () => useContext(AltoTextEditorContext);

// Provider
const TextEditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [elementType, setElementType] = useState<ElementToEdit>('ALL');
  const [altoElement, setAltoElement] = useState<any>();

  const openTextEditor = (type: ElementToEdit, element: any) => {
    setElementType(type);
    setAltoElement(element);
  };

  const onClose = () => {
    setElementType('ALL');
    setAltoElement(undefined);
  };

  return (
    <AltoTextEditorContext.Provider
      value={{
        openTextEditor,
      }}
    >
      {children}
      <Modal
        opened={altoElement !== undefined}
        onClose={onClose}
        title="Text editor"
        size="xl"
        overflow="inside"
      >
        {elementType === 'ALL' &&
          altoElement !== undefined &&
          altoElement.map((textBlock: any) => (
            <EditableBlock
              key={textBlock.metadata.index}
              textBlock={textBlock}
            />
          ))}

        {elementType === 'TEXTBLOCK' && (
          <EditableBlock textBlock={altoElement} />
        )}

        {elementType === 'TEXTLINE' && (
          <EditableLine
            textLine={altoElement}
            text={getStringsFromLine(altoElement.element)}
          />
        )}
      </Modal>
    </AltoTextEditorContext.Provider>
  );
};

export default TextEditorProvider;

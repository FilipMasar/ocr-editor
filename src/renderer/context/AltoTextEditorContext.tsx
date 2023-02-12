import { Checkbox, Modal } from '@mantine/core';
import {
  ChangeEvent,
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import EditableBlock from 'renderer/components/textEditor/EditableBlock';
import EditableLine from 'renderer/components/textEditor/EditableLine';
import { getStringsFromLine } from 'renderer/utils/alto';
import { useSettings } from './SettingsContext';

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
  const { settings, setSettings } = useSettings();

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
        <Checkbox
          label="Show and edit hyphens"
          checked={settings.show.hyphens}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            setSettings((old) => ({
              ...old,
              show: { ...old.show, hyphens: e.target.checked },
            }));
          }}
        />

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

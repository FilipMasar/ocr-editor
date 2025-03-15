import { Checkbox, Modal } from '@mantine/core';
import {
  ChangeEvent,
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import EditableBlock from '../components/textEditor/EditableBlock';
import EditableLine from '../components/textEditor/EditableLine';
import { getStringsFromLine } from '../utils/alto';
import { useSettings } from './SettingsContext';
import { AltoTextBlockJson, AltoTextLineJson } from '../types/alto';

type ElementToEdit = 'ALL' | 'TEXTBLOCK' | 'TEXTLINE';

// Define the element types that can be passed to the editor
interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    [key: string]: any;
  };
}

type TextBlockElement = AltoElement<AltoTextBlockJson>;
type TextLineElement = AltoElement<AltoTextLineJson>;

// Union type of possible elements to edit
type EditableElement = TextBlockElement[] | TextBlockElement | TextLineElement;

interface TextEditorProviderValue {
  openTextEditor: (type: ElementToEdit, element: EditableElement) => void;
}

// Context
const AltoTextEditorContext = createContext({} as TextEditorProviderValue);

// useContext
export const useTextEditor = () => useContext(AltoTextEditorContext);

// Provider
const TextEditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [elementType, setElementType] = useState<ElementToEdit>('ALL');
  const [altoElement, setAltoElement] = useState<EditableElement | undefined>();
  const { settings, setSettings } = useSettings();

  const openTextEditor = (type: ElementToEdit, element: EditableElement) => {
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
          Array.isArray(altoElement) &&
          altoElement.map((textBlock: TextBlockElement) => (
            <EditableBlock
              key={textBlock.metadata.index}
              textBlock={textBlock}
            />
          ))}

        {elementType === 'TEXTBLOCK' && altoElement && !Array.isArray(altoElement) && (
          <EditableBlock textBlock={altoElement as TextBlockElement} />
        )}

        {elementType === 'TEXTLINE' && altoElement && !Array.isArray(altoElement) && (
          <EditableLine
            textLine={altoElement as TextLineElement}
            text={getStringsFromLine((altoElement as TextLineElement).element)}
          />
        )}
      </Modal>
    </AltoTextEditorContext.Provider>
  );
};

export default TextEditorProvider;

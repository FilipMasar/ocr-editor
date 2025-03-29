import { Checkbox, Modal } from '@mantine/core';
import {
  ChangeEvent,
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import EditableBlock from '../../components/textEditor/EditableBlock';
import EditableLine from '../../components/textEditor/EditableLine';
import { getStringsFromLine } from '../../utils/alto';
import { useSettings } from '../app/SettingsContext';
import { AltoTextBlockJson, AltoTextLineJson } from '../../types/alto';

/**
 * Types of elements that can be edited in the text editor
 */
type ElementToEdit = 'ALL' | 'TEXTBLOCK' | 'TEXTLINE';

/**
 * Interface for an element that can be edited in the text editor
 */
interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    [key: string]: any;
  };
}

// Element types for the text editor
type TextBlockElement = AltoElement<AltoTextBlockJson>;
type TextLineElement = AltoElement<AltoTextLineJson>;

// Union type of possible elements to edit
type EditableElement = TextBlockElement[] | TextBlockElement | TextLineElement;

/**
 * Text editor context value interface
 */
interface TextEditorProviderValue {
  openTextEditor: (type: ElementToEdit, element: EditableElement) => void;
}

// Context
const AltoTextEditorContext = createContext({} as TextEditorProviderValue);

/**
 * Hook to access the text editor context
 */
export const useTextEditor = () => useContext(AltoTextEditorContext);

/**
 * Provider component for the text editor context
 */
const TextEditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [elementType, setElementType] = useState<ElementToEdit>('ALL');
  const [altoElement, setAltoElement] = useState<EditableElement | undefined>();
  const { settings, setSettings } = useSettings();

  /**
   * Open the text editor with the specified element type and element
   */
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
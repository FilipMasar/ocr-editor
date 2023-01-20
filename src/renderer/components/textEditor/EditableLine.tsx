import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dialog, Notification } from '@mantine/core';
import { toNumber } from 'renderer/utils/alto';
import { Minus, Plus, X } from 'react-feather';
import { useEditor } from 'renderer/context/EditorContext';
import { useAlto } from '../../context/AltoContext';

interface EditableLineProps {
  text: string | string[];
  textLine: any;
  showTextNext?: boolean;
}

const EditableLine: FC<EditableLineProps> = ({
  text,
  textLine,
  showTextNext,
}) => {
  const [textLineElement, setTextLineElement] = useState(textLine.element);
  const ref = useRef<HTMLDivElement>(null);
  const { updateString, updateTextLine } = useAlto();
  const [error, setError] = useState<string>();
  const { settings } = useEditor();

  const onUpdate = useCallback(
    (newText: string | null | undefined) => {
      if (!newText) {
        setError('line cannot be empty');
        return;
      }

      setError(undefined);

      if (Array.isArray(text)) {
        if (newText.split(' ').length === text.length) {
          // update
          newText.split(' ').forEach((value: string, index: number) => {
            updateString(
              textLine.metadata.textBlockIndex,
              textLine.metadata.index,
              index,
              value
            );
          });
        } else {
          setError(
            'number of words is different. Firstly, add or delete node in alto editor'
          );
        }
      } else if (newText.split(' ').length === 1) {
        // update
        updateString(
          textLine.metadata.textBlockIndex,
          textLine.metadata.index,
          -1,
          newText
        );
      } else {
        setError(
          'number of words is different. Firstly, add or delete node in alto editor'
        );
      }
    },
    [text, textLine.metadata, updateString]
  );

  const onHyphenButtonClicked = useCallback(() => {
    const { HYP, ...rest } = textLineElement;

    if (HYP) {
      updateTextLine(
        rest,
        textLine.metadata.textBlockIndex,
        textLine.metadata.index
      );

      setTextLineElement(rest);
    } else {
      updateTextLine(
        { ...rest, HYP: { '@_CONTENT': '172' } },
        textLine.metadata.textBlockIndex,
        textLine.metadata.index
      );

      setTextLineElement((old: any) => ({
        ...old,
        HYP: {
          '@_CONTENT': '172',
        },
      }));
    }
  }, [textLine, textLineElement, updateTextLine]);

  const enterFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onUpdate(ref.current?.textContent);
      }
    },
    [onUpdate]
  );

  useEffect(() => {
    document.addEventListener('keydown', enterFunction, false);

    return () => {
      document.removeEventListener('keydown', enterFunction, false);
    };
  }, [enterFunction]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <div
            ref={ref}
            contentEditable="true"
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(e.currentTarget.textContent)}
            style={
              showTextNext
                ? {
                    position: 'absolute',
                    top: toNumber(textLineElement['@_VPOS']),
                    left: toNumber(textLineElement['@_HPOS']),
                    width: toNumber(textLineElement['@_WIDTH']),
                    height: toNumber(textLineElement['@_HEIGHT']),
                    fontSize: toNumber(textLineElement['@_HEIGHT']) * 0.8,
                    backgroundColor: error && 'rgba(255, 0, 0, 0.5)',
                  }
                : {
                    border: error && '1px solid red',
                  }
            }
          >
            {Array.isArray(text) ? text.join(' ') : text}
          </div>
          {!showTextNext && textLineElement.HYP && settings.show.hyphens && (
            <span style={{ backgroundColor: 'rgba(0,255,0,0.7)' }}>-</span>
          )}
        </div>
        {!showTextNext && settings.show.hyphens && (
          <Button
            size="xs"
            leftIcon={
              textLineElement.HYP ? <Minus size={16} /> : <Plus size={16} />
            }
            variant="white"
            color={textLineElement.HYP ? 'red' : 'green'}
            onClick={onHyphenButtonClicked}
          >
            HYP
          </Button>
        )}
      </div>

      <Dialog opened={error !== undefined} p={0}>
        <Notification icon={<X size={18} />} color="red">
          {error}
        </Notification>
      </Dialog>
    </>
  );
};

export default EditableLine;

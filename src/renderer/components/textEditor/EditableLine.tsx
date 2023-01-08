import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, Notification } from '@mantine/core';
import { toNumber } from 'renderer/utils/alto';
import { X } from 'react-feather';
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
  const ref = useRef<HTMLDivElement>(null);
  const { updateString } = useAlto();
  const [error, setError] = useState<string>();

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
      <div
        ref={ref}
        contentEditable="true"
        suppressContentEditableWarning
        onBlur={(e) => onUpdate(e.currentTarget.textContent)}
        style={
          showTextNext
            ? {
                position: 'absolute',
                top: toNumber(textLine.element['@_VPOS']),
                left: toNumber(textLine.element['@_HPOS']),
                width: toNumber(textLine.element['@_WIDTH']),
                height: toNumber(textLine.element['@_HEIGHT']),
                fontSize: toNumber(textLine.element['@_HEIGHT']) * 0.8,
                backgroundColor: error && 'rgba(255, 0, 0, 0.5)',
              }
            : {
                border: error && '1px solid red',
              }
        }
      >
        {Array.isArray(text) ? text.join(' ') : text}
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

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Text } from '@mantine/core';
import { useAlto } from '../../context/AltoContext';

interface EditableLineProps {
  text: string | string[];
  textLine: any;
}

const EditableLine: FC<EditableLineProps> = ({ text, textLine }) => {
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
        style={error ? { border: '1px solid red' } : {}}
      >
        {Array.isArray(text) ? text.join(' ') : text}
      </div>
      {error && (
        <Text color="red" size="xs">
          {error}
        </Text>
      )}
    </>
  );
};

export default EditableLine;

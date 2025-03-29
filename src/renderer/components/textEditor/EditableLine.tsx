import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dialog, Notification } from '@mantine/core';
import { convertToPixels } from '../../utils/alto';
import { Minus, Plus, X } from 'react-feather';
import { useSettings } from '../../context/app/SettingsContext';
import { useAlto } from '../../context/app/AltoContext';
import { AltoTextLineJson, AltoHyphen } from '../../types/alto';

interface AltoElement<T> {
  element: T;
  metadata: {
    index: number;
    source?: string;
    isEditable?: boolean;
    textBlockIndex?: number;
    nestedTextBlockIndex?: number;
    composedBlockIndex?: number;
    [key: string]: any;
  };
}

interface EditableLineProps {
  text: string | string[];
  textLine: AltoElement<AltoTextLineJson>;
  showTextNext?: boolean;
  onUpdateTextLine?: (textLine: AltoTextLineJson) => void;
  onUpdateString?: (stringIndex: number, value: string) => void;
}

const EditableLine: FC<EditableLineProps> = ({
  text,
  textLine,
  showTextNext,
  onUpdateTextLine,
  onUpdateString,
}) => {
  const [textLineElement, setTextLineElement] = useState<AltoTextLineJson>(textLine.element);
  const ref = useRef<HTMLDivElement>(null);
  const { updateString, updateTextLine, measurementUnit } = useAlto();
  const [error, setError] = useState<string | undefined>();
  const { settings } = useSettings();

  const onUpdate = useCallback(
    (newText: string | null | undefined) => {
      if (!newText) {
        setError('line cannot be empty');
        return;
      }

      setError(undefined);
      const source = textLine.metadata.source || 'textBlock';
      
      // Handle text from ComposedBlocks differently
      if (source === 'composedBlock' && textLine.metadata.isEditable) {
        if (onUpdateString) {
          if (Array.isArray(text)) {
            const textLength = text.length || 0;
            if (newText.split(' ').length === textLength) {
              // update each word
              newText.split(' ').forEach((value: string, index: number) => {
                onUpdateString(index, value);
              });
            } else {
              setError(
                'number of words is different. Firstly, add or delete node in alto editor'
              );
            }
          } else if (newText.split(' ').length === 1) {
            // update single string
            onUpdateString(-1, newText);
          } else {
            setError(
              'number of words is different. Firstly, add or delete node in alto editor'
            );
          }
        } else {
          setError('Cannot update text in this ComposedBlock');
        }
        return;
      }

      if (Array.isArray(text)) {
        const textLength = text.length || 0;
        if (newText.split(' ').length === textLength) {
          // update
          newText.split(' ').forEach((value: string, index: number) => {
            updateString(
              textLine.metadata.textBlockIndex || -1,
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
          textLine.metadata.textBlockIndex || -1,
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
    [text, textLine.metadata, updateString, onUpdateString]
  );

  const onHyphenButtonClicked = useCallback(() => {
    const { HYP, ...rest } = textLineElement;

    if (HYP) {
      if (onUpdateTextLine) {
        onUpdateTextLine(rest);
      } else {
        updateTextLine(
          rest,
          textLine.metadata.textBlockIndex || -1,
          textLine.metadata.index
        );
      }

      setTextLineElement(rest);
    } else {
      const hyphen: AltoHyphen = { '@_CONTENT': '172' };
      const updatedLine = { 
        ...rest, 
        HYP: hyphen 
      };
      
      if (onUpdateTextLine) {
        onUpdateTextLine(updatedLine);
      } else {
        updateTextLine(
          updatedLine,
          textLine.metadata.textBlockIndex || -1,
          textLine.metadata.index
        );
      }

      setTextLineElement((old) => ({
        ...old,
        HYP: hyphen,
      }));
    }
  }, [textLine, textLineElement, updateTextLine, onUpdateTextLine]);

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
            contentEditable={textLine.metadata.source !== 'composedBlock'}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(e.currentTarget.textContent)}
            style={
              showTextNext
                ? {
                    position: 'absolute',
                    top: convertToPixels(textLineElement['@_VPOS'], measurementUnit),
                    left: convertToPixels(textLineElement['@_HPOS'], measurementUnit),
                    width: convertToPixels(textLineElement['@_WIDTH'], measurementUnit),
                    height: convertToPixels(textLineElement['@_HEIGHT'], measurementUnit),
                    fontSize: convertToPixels(textLineElement['@_HEIGHT'], measurementUnit) * 0.8,
                    backgroundColor: textLine.metadata.source === 'composedBlock' 
                      ? 'rgba(128, 0, 128, 0.1)' // Light purple for composed block text
                      : (error && 'rgba(255, 0, 0, 0.5)'),
                    textAlign: 'justify',
                    textAlignLast: 'justify',
                  }
                : {
                    border: textLine.metadata.source === 'composedBlock'
                      ? '1px dashed purple'
                      : (error && '1px solid red'),
                    padding: '4px',
                    backgroundColor: textLine.metadata.source === 'composedBlock'
                      ? 'rgba(128, 0, 128, 0.05)'
                      : 'transparent',
                  }
            }
          >
            {Array.isArray(text) ? text.join(' ') : text}
            {textLine.metadata.source === 'composedBlock' && (
              <small style={{ fontSize: '0.7em', color: 'purple', marginLeft: '5px' }}>
                (from ComposedBlock)
              </small>
            )}
          </div>
          {textLineElement.HYP && settings.show.hyphens && (
            <span
              style={{
                backgroundColor: 'rgba(0,255,0,0.7)',
                ...(showTextNext && {
                  position: 'absolute',
                  top: convertToPixels(textLineElement['@_VPOS'], measurementUnit),
                  left:
                    convertToPixels(textLineElement['@_HPOS'], measurementUnit) +
                    convertToPixels(textLineElement['@_WIDTH'], measurementUnit),
                  width: convertToPixels(textLineElement['@_HEIGHT'], measurementUnit) * 0.3,
                  height: convertToPixels(textLineElement['@_HEIGHT'], measurementUnit),
                  fontSize: convertToPixels(textLineElement['@_HEIGHT'], measurementUnit) * 0.8,
                }),
              }}
            >
              -
            </span>
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

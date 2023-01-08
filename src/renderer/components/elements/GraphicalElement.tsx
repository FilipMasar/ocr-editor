/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAltoEditor } from 'renderer/context/AltoEditorContext';
import { useAlto } from '../../context/AltoContext';
import { toNumber } from '../../utils/alto';

interface GraphicalElementProps {
  element: any;
  metadata: any;
}

const GraphicalElement: FC<GraphicalElementProps> = ({ element, metadata }) => {
  const { ref, hovered } = useHover();
  const { updateGraphicalElement } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const top = toNumber(element['@_VPOS']);
  const left = toNumber(element['@_HPOS']);
  const width = toNumber(element['@_WIDTH']);
  const height = toNumber(element['@_HEIGHT']);

  const handleClick = () => {
    openAltoEditor(
      element,
      () => (updated: any) => updateGraphicalElement(updated, metadata.index)
    );
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid blue',
        backgroundColor: hovered ? 'blue' : 'transparent',
        opacity: hovered ? 0.5 : 1,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};

export default GraphicalElement;

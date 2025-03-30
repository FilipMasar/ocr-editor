import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { AltoMarginJson } from '../../types/alto';
import { useHover } from '@mantine/hooks';
import { elementColors } from './colors';

interface MarginProps {
  element: AltoMarginJson;
}

const Margin: FC<MarginProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();

  const top = convertToPixels(element['@_VPOS'], measurementUnit);
  const left = convertToPixels(element['@_HPOS'], measurementUnit);
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: `1px solid ${elementColors.margin.borderColor}`,
        backgroundColor: hovered ? elementColors.margin.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
    />
  );
};

export default Margin;

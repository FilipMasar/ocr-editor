import { useHover } from '@mantine/hooks';
import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import { AltoTextBlockJson } from '../../types/alto';
import { elementColors } from './colors';
import { useSettings } from '../../context/app/SettingsContext';

interface TextBlockProps {
  element: AltoTextBlockJson;
}

const TextBlock: FC<TextBlockProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  const { settings } = useSettings();

  // Convert coordinates using the current measurement unit
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
        border: `${settings.borderWidth}px solid ${elementColors.textBlock.borderColor}`,
        backgroundColor: hovered ? elementColors.textBlock.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
    />
  );
};

export default withErrorBoundary(TextBlock, 'TextBlock');

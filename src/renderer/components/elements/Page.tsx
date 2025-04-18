import { FC } from 'react';
import { useAlto, useAltoEditor, useSettings } from '../../context';
import { convertToPixels } from '../../utils/alto';
import { AltoPageJson } from '../../types/alto';
import { useHover } from '@mantine/hooks';
import { elementColors } from './colors';

interface PageProps {
  element: AltoPageJson;
}

const Page: FC<PageProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { settings } = useSettings();
  
  const width = convertToPixels(element['@_WIDTH'], measurementUnit);
  const height = convertToPixels(element['@_HEIGHT'], measurementUnit);

  if (!width || !height) {
    console.warn('Page element has no width or height');
    return null;
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        border: `${settings.borderWidth}px solid ${elementColors.page.borderColor}`,
        backgroundColor: hovered ? elementColors.page.backgroundColor : 'transparent',
        cursor: 'pointer',
      }}
      onClick={() => openAltoEditor(element)}
    />
  );
};

export default Page;

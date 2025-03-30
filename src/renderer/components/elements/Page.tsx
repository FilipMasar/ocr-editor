import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { AltoPageJson } from '../../types/alto';
import { useHover } from '@mantine/hooks';

interface PageProps {
  element: AltoPageJson;
}

const Page: FC<PageProps> = ({ element }) => {
  const { ref, hovered } = useHover();
  const { measurementUnit } = useAlto();
  
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
        border: '1px solid black',
        backgroundColor: hovered ? 'black' : 'transparent',
        opacity: hovered ? 0.5 : 1,
        cursor: 'pointer',
      }}
    />
  );
};

export default Page;

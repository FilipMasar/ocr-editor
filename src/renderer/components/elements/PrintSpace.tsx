import { FC } from 'react';
import { useAlto } from '../../context/app/AltoContext';
import { convertToPixels } from '../../utils/alto';
import { withErrorBoundary } from '../../utils/withErrorBoundary';

interface PrintSpaceProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PrintSpace: FC<PrintSpaceProps> = ({ top, left, width, height }) => {
  // PrintSpace coordinates are already converted in Viewer.tsx
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: '1px solid blue',
      }}
    />
  );
};

export default withErrorBoundary(PrintSpace, 'PrintSpace');

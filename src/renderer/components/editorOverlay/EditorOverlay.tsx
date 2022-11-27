import { FC } from 'react';
import Options from './Options';
import Paging from './Paging';
import Zoom from './Zoom';

interface Props {
  alignCenter: () => void;
  pageNumber: number;
}

const EditorOverlay: FC<Props> = ({ alignCenter, pageNumber }) => {
  return (
    <>
      <Options />
      <Paging pageNumber={pageNumber} />
      <Zoom alignCenter={alignCenter} />
    </>
  );
};

export default EditorOverlay;

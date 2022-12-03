import { FC } from 'react';
import Options from './Options';
import Paging from './Paging';
import Status from './Status';
import Zoom from './Zoom';

interface Props {
  alignCenter: () => void;
  pageNumber: number;
  onSave: () => void;
}

const EditorOverlay: FC<Props> = ({ alignCenter, pageNumber, onSave }) => {
  return (
    <>
      <Options />
      <Paging pageNumber={pageNumber} />
      <Zoom alignCenter={alignCenter} />
      <Status onSave={onSave} />
    </>
  );
};

export default EditorOverlay;

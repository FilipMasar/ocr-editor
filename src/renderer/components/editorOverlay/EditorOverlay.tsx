import { FC } from 'react';
import Options from './Options';
import Paging from './Paging';
import Status from './Status';
import Zoom from './Zoom';
import { useEditor } from '../../context/editor/EditorContext';
import { useProject } from '../../context/project/ProjectContext';

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
      <Status onSave={onSave} pageNumber={pageNumber} />
    </>
  );
};

export default EditorOverlay;

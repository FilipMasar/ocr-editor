import { ChangeEvent, FC, MouseEvent } from 'react';
import {
  Group,
  Checkbox,
  ActionIcon,
  Loader,
  Paper,
  Tooltip,
} from '@mantine/core';
import { Save } from 'react-feather';
import { useEditor } from '../../context/editor/EditorContext';
import { useProject } from '../../context/project/ProjectContext';

interface Props {
  onSave: () => void;
  pageNumber: number;
}

const Status: FC<Props> = ({ onSave, pageNumber }) => {
  const { saving, unsavedChanges } = useEditor();
  const { projectAssets, updatePageDone } = useProject();

  return (
    <div
      style={{
        position: 'fixed',
        top: 8,
        right: 8,
        zIndex: 100,
      }}
    >
      <Paper withBorder px="sm" py={4}>
        <Group align="center">
          <Tooltip label="Save progress" withArrow>
            <ActionIcon
              size={20}
              color={unsavedChanges ? 'red' : 'gray'}
              variant="subtle"
              disabled={saving}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onSave();
              }}
            >
              {saving ? <Loader /> : <Save />}
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Mark as done" withArrow>
            <Checkbox
              styles={{ root: { display: 'flex' } }}
              checked={
                projectAssets &&
                projectAssets[pageNumber] &&
                projectAssets[pageNumber].done
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.stopPropagation();
                updatePageDone(e.currentTarget.checked, pageNumber);
              }}
              onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
            />
          </Tooltip>
        </Group>
      </Paper>
    </div>
  );
};

export default Status;

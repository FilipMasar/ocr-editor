import { ActionIcon, Group, Loader, Paper } from '@mantine/core';
import { FC, MouseEvent } from 'react';
import { Save } from 'react-feather';
import { useEditor } from 'renderer/context/EditorContext';

interface Props {
  onSave: () => void;
}

const Status: FC<Props> = ({ onSave }) => {
  const { saving, unsavedChanges } = useEditor();

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
        <Group>
          <ActionIcon
            size={18}
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
        </Group>
      </Paper>
    </div>
  );
};

export default Status;

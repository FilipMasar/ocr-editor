import { ActionIcon, Group, Paper, Text } from '@mantine/core';
import { FC, MouseEvent } from 'react';
import { AlignCenter, Minus, Plus } from 'react-feather';
import { useEditor } from 'renderer/context/EditorContext';

interface Props {
  alignCenter: () => void;
}

const Zoom: FC<Props> = ({ alignCenter }) => {
  const { zoom, setZoom } = useEditor();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 100,
      }}
    >
      <Paper withBorder px="sm" py={4}>
        <Group>
          <ActionIcon
            size={18}
            variant="subtle"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              alignCenter();
            }}
          >
            <AlignCenter />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            disabled={zoom <= 0.1}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setZoom((old) => Math.round((old - 0.1) * 10) / 10);
            }}
          >
            <Minus />
          </ActionIcon>
          <Text size="xs" w={32} align="center">
            {Math.round(zoom * 100)}%
          </Text>
          <ActionIcon
            variant="subtle"
            disabled={zoom >= 2}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setZoom((old) => Math.round((old + 0.1) * 10) / 10);
            }}
          >
            <Plus />
          </ActionIcon>
        </Group>
      </Paper>
    </div>
  );
};

export default Zoom;

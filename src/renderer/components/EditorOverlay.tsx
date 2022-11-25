import { ActionIcon, Group, Paper, Text } from '@mantine/core';
import { FC, MouseEvent } from 'react';
import { AlignCenter, ArrowLeft, ArrowRight, Minus, Plus } from 'react-feather';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useEditor } from 'renderer/context/EditorContext';
import { useProject } from 'renderer/context/ProjectContext';

interface Props {
  alignCenter: () => void;
  pageNumber: number;
}

const EditorOverlay: FC<Props> = ({ alignCenter, pageNumber }) => {
  const { settings, setSettings } = useEditor();
  const { projectAssets } = useProject();
  const navigate = useNavigate();

  const nextPage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (projectAssets === undefined || projectAssets.length <= pageNumber + 1)
      return;

    const { alto, image } = projectAssets[pageNumber + 1];

    navigate({
      pathname: '/editor',
      search: `?${createSearchParams({
        index: (pageNumber + 1).toString(),
        image,
        alto,
      })}`,
    });
  };

  const prevPage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (projectAssets === undefined || pageNumber === 0) return;

    const { alto, image } = projectAssets[pageNumber - 1];

    navigate({
      pathname: '/editor',
      search: `?${createSearchParams({
        index: (pageNumber - 1).toString(),
        image,
        alto,
      })}`,
    });
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 8,
          left: 8,
          zIndex: 100,
        }}
      >
        <Paper withBorder px="sm" py={4}>
          <Group>
            <Text size="sm">
              <Link to="/project">List of pages</Link>
            </Text>
            <ActionIcon
              size={18}
              variant="subtle"
              disabled={pageNumber === 0}
              onClick={prevPage}
            >
              <ArrowLeft />
            </ActionIcon>
            <Text size="xs">{pageNumber}</Text>
            <ActionIcon
              size={18}
              variant="subtle"
              disabled={
                !projectAssets || pageNumber === projectAssets.length - 1
              }
              onClick={nextPage}
            >
              <ArrowRight />
            </ActionIcon>
          </Group>
        </Paper>
      </div>
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
              disabled={settings.zoom <= 0.1}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                alignCenter();
              }}
            >
              <AlignCenter />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              disabled={settings.zoom <= 0.1}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setSettings((old) => ({
                  ...old,
                  zoom: Math.round((old.zoom - 0.1) * 10) / 10,
                }));
              }}
            >
              <Minus />
            </ActionIcon>
            <Text size="xs" w={32} align="center">
              {Math.round(settings.zoom * 100)}%
            </Text>
            <ActionIcon
              variant="subtle"
              disabled={settings.zoom >= 2}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setSettings((old) => ({
                  ...old,
                  zoom: Math.round((old.zoom + 0.1) * 10) / 10,
                }));
              }}
            >
              <Plus />
            </ActionIcon>
          </Group>
        </Paper>
      </div>
    </>
  );
};

export default EditorOverlay;

import { ActionIcon, Button, Group, Paper, Text } from '@mantine/core';
import { FC, MouseEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useEditor, useProject } from '../../context';

interface Props {
  pageNumber: number;
}

const Paging: FC<Props> = ({ pageNumber }) => {
  const { projectAssets } = useProject();
  const { unsavedChanges } = useEditor();
  const navigate = useNavigate();

  const toProject = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (unsavedChanges) {
      if(!window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) return;
    }

    navigate('/project', { state: { scrollToPage: pageNumber } });
  };

  const nextPage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (projectAssets === undefined || projectAssets.length <= pageNumber + 1)
      return;

    const { alto, image } = projectAssets[pageNumber + 1];

    if (unsavedChanges) {
      if(!window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) return;
    }

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

    if (unsavedChanges) {
      if(!window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) return;
    }

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
    <div
      style={{
        position: 'fixed',
        top: 8,
        left: 8,
        zIndex: 100,
      }}
    >
      <Paper withBorder px="sm" py={4}>
        <Group>
          <Button
            variant="subtle"
            onClick={toProject}
            size="xs"
            leftIcon={<ArrowLeft size={20} />}
          >
            List of pages
          </Button>
          <ActionIcon
            size={18}
            variant="subtle"
            disabled={pageNumber === 0}
            onClick={prevPage}
          >
            <ArrowLeft />
          </ActionIcon>
          <Text size="xs">{pageNumber + 1}</Text>
          <ActionIcon
            size={18}
            variant="subtle"
            disabled={!projectAssets || pageNumber === projectAssets.length - 1}
            onClick={nextPage}
          >
            <ArrowRight />
          </ActionIcon>
        </Group>
      </Paper>
    </div>
  );
};

export default Paging;

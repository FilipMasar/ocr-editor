import { ActionIcon, Group, Paper, Text } from '@mantine/core';
import { FC, MouseEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';

interface Props {
  pageNumber: number;
}

const Paging: FC<Props> = ({ pageNumber }) => {
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

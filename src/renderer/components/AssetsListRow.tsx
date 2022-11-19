import { ActionIcon, Text, Group } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { FC, MouseEvent } from 'react';
import { Trash } from 'react-feather';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';

interface Props {
  image: string;
  alto: string;
  index: number;
}

const AssetsListRow: FC<Props> = ({ image, alto, index }) => {
  const { removeAsset } = useProject();
  const navigate = useNavigate();
  const hoverImage = useHover();
  const hoverAlto = useHover();

  const openEditor = () => {
    if (image === '' || alto === '') {
      alert('Image or ALTO file is missing for this page');
      return;
    }
    navigate({
      pathname: '/editor',
      search: `?${createSearchParams({
        index: index.toString(),
        image,
        alto,
      })}`,
    });
  };

  return (
    <tr style={{ cursor: 'pointer' }} onClick={openEditor}>
      <td>
        <Group ref={hoverImage.ref} spacing={4} sx={{ display: 'inline-flex' }}>
          <Text>{image}</Text>
          {/* <ActionIcon
            ml="xs"
            variant="subtle"
            size={18}
            color="blue.5"
            sx={{ visibility: hovered ? 'visible' : 'hidden' }}
          >
            <Edit />
          </ActionIcon> */}
          <ActionIcon
            variant="subtle"
            size={18}
            color="red.7"
            ml="xs"
            sx={{ visibility: hoverImage.hovered ? 'visible' : 'hidden' }}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              removeAsset('images', image);
            }}
          >
            <Trash />
          </ActionIcon>
        </Group>
      </td>
      <td>
        <Group ref={hoverAlto.ref} spacing={4} sx={{ display: 'inline-flex' }}>
          <Text>{alto}</Text>
          <ActionIcon
            variant="subtle"
            size={18}
            color="red.7"
            ml="xs"
            sx={{ visibility: hoverAlto.hovered ? 'visible' : 'hidden' }}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              removeAsset('altos', alto);
            }}
          >
            <Trash />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  );
};

export default AssetsListRow;

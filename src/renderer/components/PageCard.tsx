/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  ActionIcon,
  Text,
  Group,
  Checkbox,
  DefaultMantineColor,
  Stack,
  Button,
  Card,
  Divider,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { ChangeEvent, FC, MouseEvent } from 'react';
import { Image, Trash } from 'react-feather';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';

interface Props {
  image: string;
  imageSrc: string;
  alto: string;
  done: boolean;
  wer: number | undefined;
  index: number;
}

const getColorForWer = (wer: number): DefaultMantineColor => {
  if (wer < 0.05) return 'green';
  if (wer < 0.15) return 'yellow';
  return 'red';
};

const PageCard: FC<Props> = ({ image, imageSrc, alto, done, wer, index }) => {
  const { removeAsset, updatePageDone } = useProject();
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
    <Card
      shadow="sm"
      p={0}
      m="sm"
      radius="md"
      withBorder
      style={{ display: 'flex' }}
    >
      {imageSrc === '' ? (
        <div
          style={{
            width: 220,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image strokeWidth={1} />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt="page scan"
          width={220}
          style={{ cursor: 'pointer' }}
          onClick={openEditor}
        />
      )}

      <Stack justify="space-between" p="md">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <Group ref={hoverImage.ref} sx={{ display: 'inline-flex' }}>
            <div>
              <Text size="sm" weight="bold">
                Image file name:
              </Text>
              {image === '' ? (
                <Text size="xs" color="red">
                  Missing image file
                </Text>
              ) : (
                <Text size="xs">{image}</Text>
              )}
            </div>
            {image !== '' && (
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
            )}
          </Group>

          <Group ref={hoverAlto.ref} sx={{ display: 'inline-flex' }}>
            <div>
              <Text size="sm" weight="bold">
                ALTO file name:
              </Text>
              {alto === '' ? (
                <Text size="xs" color="red">
                  Missing ALTO file
                </Text>
              ) : (
                <Text size="xs">{alto}</Text>
              )}
            </div>
            {alto !== '' && (
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
            )}
          </Group>

          <Divider my="xs" />

          <Checkbox
            label="Reviewed"
            checked={done}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              updatePageDone(e.currentTarget.checked, index);
            }}
            onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
          />

          <Text size="sm">
            Word error rate:{' '}
            {wer === undefined ? (
              '-'
            ) : (
              <span style={{ color: getColorForWer(wer) }}>
                {Math.round(wer * 100) / 100}
              </span>
            )}
          </Text>
        </div>

        <Button onClick={openEditor}>Open in editor</Button>
      </Stack>
    </Card>
  );
};

export default PageCard;

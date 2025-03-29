import {
  ActionIcon,
  Anchor,
  Group,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { FC, useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context';
import { FilePlus, Folder, X } from 'react-feather';
import { RecentProject } from '../../shared/ipc/config-channel';
import './StartingPage.css';

const StartingPage: FC = () => {
  const { projectAssets, createProject, openProject } = useProject();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const theme = useMantineTheme();

  const removeRecentProject = (projectPath: string) => {
    window.electron.ipc.send(
      'config-channel', 
      'REMOVE_RECENT_PROJECT', 
      projectPath
    );
  };

  useEffect(() => {
    // Request recent projects when the component mounts
    window.electron.ipc.send('config-channel', 'GET_RECENT_PROJECTS');

    // Register typed handler for RECENT_PROJECTS response
    const unsubscribe = window.electron.ipc.on(
      'config-channel',
      'RECENT_PROJECTS',
      (payload) => {
        setRecentProjects(payload);
      }
    );

    // Clean up listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (projectAssets !== undefined) {
      navigate('/project');
    }
  }, [navigate, projectAssets]);

  return (
    <div style={{ padding: 40 }}>
      <Title>ALTO Editor</Title>

      <Stack spacing="xs" mt="xl">
        <Title order={3}>Start</Title>
        <Group spacing="xs">
          <FilePlus color={theme.colors.blue[5]} strokeWidth={1} />
          <Anchor component="button" type="button" onClick={createProject}>
            Create new project
          </Anchor>
        </Group>

        <Group spacing="xs">
          <Folder color={theme.colors.blue[5]} strokeWidth={1} />
          <Anchor
            component="button"
            type="button"
            onClick={() => openProject()}
          >
            Open project
          </Anchor>
        </Group>
      </Stack>

      {recentProjects.length !== 0 && (
        <Stack spacing="xs" mt="xl" align="start">
          <Title order={3}>Recent</Title>
          {recentProjects.map((project) => (
            <Group
              key={project.path}
              spacing={4}
              className="recent-project-container"
            >
              <Anchor
                component="button"
                type="button"
                onClick={() => openProject(project.path)}
              >
                {project.name}
              </Anchor>
              <ActionIcon
                variant="subtle"
                size={18}
                ml="xs"
                className="recent-project-delete"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  removeRecentProject(project.path);
                }}
              >
                <X />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </div>
  );
};

export default StartingPage;

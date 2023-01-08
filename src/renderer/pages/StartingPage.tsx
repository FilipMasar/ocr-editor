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
import { useProject } from 'renderer/context/ProjectContext';
import { FilePlus, Folder, X } from 'react-feather';
import './StartingPage.css';

const StartingPage: FC = () => {
  const { projectAssets, createProject, openProject } = useProject();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<string[]>([]);
  const theme = useMantineTheme();

  const removeRecentProject = (project: string) => {
    window.electron.ipcRenderer.sendMessage('config-channel', {
      action: 'REMOVE_RECENT_PROJECT',
      payload: project,
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('config-channel', {
      action: 'GET_RECENT_PROJECTS',
    });

    window.electron.ipcRenderer.on('config-channel', (data) => {
      console.log('config-channel', data);
      if (data.action === 'RECENT_PROJECTS') {
        setRecentProjects(data.payload);
      }
    });
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
              key={project}
              spacing={4}
              className="recent-project-container"
            >
              <Anchor
                component="button"
                type="button"
                onClick={() => openProject(project)}
              >
                {project}
              </Anchor>
              <ActionIcon
                variant="subtle"
                size={18}
                ml="xs"
                className="recent-project-delete"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  removeRecentProject(project);
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

import { Anchor, Group, Stack, Title, useMantineTheme } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';
import { FilePlus, Folder } from 'react-feather';

const StartingPage: FC = () => {
  const { projectAssets, createProject, openProject } = useProject();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<string[]>([]);
  const theme = useMantineTheme();

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
      navigate('/project/list');
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
            <Anchor
              key={project}
              component="button"
              type="button"
              onClick={() => openProject(project)}
            >
              {project}
            </Anchor>
          ))}
        </Stack>
      )}
    </div>
  );
};

export default StartingPage;

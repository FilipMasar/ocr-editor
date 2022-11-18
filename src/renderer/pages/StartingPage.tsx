import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';

const StartingPage: FC = () => {
  const { projectAssets, createProject, openProject } = useProject();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<string[]>([]);

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
    <div className="h-screen flex flex-col items-center justify-center">
      <button className="btn-primary" type="button" onClick={createProject}>
        Create new project
      </button>
      <button
        className="btn-primary mt-4"
        type="button"
        onClick={() => openProject()}
      >
        Open project
      </button>

      {recentProjects.length !== 0 && (
        <div className="h-48 overflow-y-scroll">
          <h2 className="mt-4">Recent projects:</h2>
          <ul>
            {recentProjects.map((project) => (
              <li key={project}>
                <button type="button" onClick={() => openProject(project)}>
                  {project}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StartingPage;

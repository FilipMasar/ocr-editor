import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';

const StartingPage: FC = () => {
  const { createProject, projectAssets } = useProject();
  const navigate = useNavigate();

  const openProject = () => {
    console.log('open project');
  };

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
      <button className="btn-primary" type="button" onClick={openProject}>
        Open project
      </button>
      <h2>Recent projects:</h2>
      <p>...</p>
      <Link to="/project">/project</Link>
      <Link to="/project/list">/project/list</Link>
      <Link to="/list">/list</Link>
    </div>
  );
};

export default StartingPage;

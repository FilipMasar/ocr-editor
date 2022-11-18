import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from 'renderer/context/ProjectContext';

const ProjectAssetsList: FC = () => {
  const { projectAssets, addImages, addAltos } = useProject();

  return (
    <div>
      <h1>List</h1>
      <p>{JSON.stringify(projectAssets)}</p>
      <button type="button" onClick={addImages}>
        Add images
      </button>
      <button type="button" onClick={addAltos}>
        Add altos
      </button>
      <Link to="/">home</Link>
    </div>
  );
};

export default ProjectAssetsList;

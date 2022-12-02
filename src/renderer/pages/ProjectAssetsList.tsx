import { Table, Title, Text, Button } from '@mantine/core';
import { FC } from 'react';
import { ArrowLeft, PlusCircle } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import AssetsListRow from 'renderer/components/AssetsListRow';
import { useProject } from 'renderer/context/ProjectContext';

const ProjectAssetsList: FC = () => {
  const { projectAssets, closeProject, addImages, addAltos } = useProject();
  const navigate = useNavigate();

  const goBack = () => {
    closeProject();
    navigate('/');
  };

  if (projectAssets === undefined) return <div>Something went wrong</div>;

  return (
    <div style={{ padding: 20 }}>
      <Button
        onClick={goBack}
        leftIcon={<ArrowLeft size={20} />}
        variant="subtle"
      >
        Go back
      </Button>

      <Title order={2} mt="lg">
        List of project assets
      </Title>
      <Table mt="xl" maw={600} withColumnBorders highlightOnHover>
        <thead>
          <tr>
            <th>
              <Text size="lg">Image</Text>
            </th>
            <th>
              <Text size="lg">ALTO</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {projectAssets.map(({ image, alto }, index) => (
            <AssetsListRow
              key={image + alto}
              image={image}
              alto={alto}
              index={index}
            />
          ))}
          <tr>
            <td>
              <Button
                variant="subtle"
                leftIcon={<PlusCircle />}
                onClick={addImages}
              >
                Add images
              </Button>
            </td>
            <td>
              <Button
                variant="subtle"
                leftIcon={<PlusCircle />}
                onClick={addAltos}
              >
                Add altos
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ProjectAssetsList;

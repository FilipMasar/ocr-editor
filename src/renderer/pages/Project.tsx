import { Table, Title, Text, Button, RingProgress } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { ArrowLeft, PlusCircle } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import AssetsListRow from 'renderer/components/AssetsListRow';
import { useProject } from 'renderer/context/ProjectContext';

const Project: FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const { projectAssets, closeProject, addImages, addAltos } = useProject();
  const navigate = useNavigate();

  const goBack = () => {
    closeProject();
    navigate('/');
  };

  useEffect(() => {
    if (projectAssets === undefined) return;

    const prog = projectAssets.reduce((accumulator, object) => {
      return accumulator + Number(object.done);
    }, 0);

    setProgress(prog);
  }, [projectAssets]);

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

      <RingProgress
        sx={{ position: 'absolute', top: 0, right: 0 }}
        sections={[
          { value: (progress * 100) / projectAssets.length, color: 'blue' },
        ]}
        label={
          <Text color="blue" weight={700} align="center" size="md">
            {Math.round((progress * 100) / projectAssets.length)}% done
          </Text>
        }
      />

      <Table mt="xl" maw={600} withColumnBorders highlightOnHover>
        <thead>
          <tr>
            <th>
              <Text size="lg">Image</Text>
            </th>
            <th>
              <Text size="lg">ALTO</Text>
            </th>
            <th>
              <Text size="lg">Done</Text>
            </th>
            <th>
              <Text size="lg">WER</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {projectAssets.map(({ image, alto, done, wer }, index) => (
            <AssetsListRow
              key={image + alto}
              image={image}
              alto={alto}
              done={done}
              wer={wer}
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
            <td />
            <td />
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Project;

import { Title, Text, Button, RingProgress, Flex } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { ArrowLeft, PlusCircle } from 'react-feather';
import { useNavigate, useLocation } from 'react-router-dom';
import PageCard from '../components/PageCard';
import { useProject } from '../context';

// Extended type to include imageSrc property that's added during processing
interface ExtendedProjectAsset {
  image: string;
  imageSrc: string;
  alto: string;
  done: boolean;
  wer?: number;
}

const Project: FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState<number | null>(null);
  const { projectAssets, closeProject, addImages, addAltos } = useProject();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Effect to scroll to the highlighted card
  useEffect(() => {
    if (location.state && typeof location.state.scrollToPage === 'number') {
      const pageIndex = location.state.scrollToPage;
      const cardId = `page-card-${pageIndex}`;
      const cardElement = document.getElementById(cardId);
      if (cardElement) {
        // Use setTimeout to ensure the element is rendered before scrolling
        setTimeout(() => {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedCardIndex(pageIndex);
          // Clear the location state after scrolling and highlighting
          window.history.replaceState({}, document.title)
        }, 0);
      }
    }
  }, [location.state]);

  // Effect to remove highlight on click
  useEffect(() => {
    if (highlightedCardIndex === null) return;

    const removeHighlight = () => {
      console.log('removing highlight');
      setHighlightedCardIndex(null);
    };

    // Add listener
    document.addEventListener('click', removeHighlight);

    // Cleanup listener
    return () => {
      document.removeEventListener('click', removeHighlight);
    };
  }, [highlightedCardIndex]);

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
        List of pages
      </Title>

      {progress !== 0 && (
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
      )}

      <Button
        variant="subtle"
        size="lg"
        leftIcon={<PlusCircle />}
        onClick={addImages}
      >
        Add images
      </Button>
      <Button
        variant="subtle"
        size="lg"
        leftIcon={<PlusCircle />}
        onClick={addAltos}
      >
        Add altos
      </Button>

      <Flex wrap="wrap">
        {(projectAssets as ExtendedProjectAsset[]).map(({ image, imageSrc, alto, done, wer }, index) => (
          <PageCard
            key={image + alto}
            id={`page-card-${index}`}
            isHighlighted={index === highlightedCardIndex}
            image={image}
            imageSrc={imageSrc || ''}
            alto={alto}
            done={done}
            wer={wer}
            index={index}
          />
        ))}
      </Flex>
    </div>
  );
};

export default Project;

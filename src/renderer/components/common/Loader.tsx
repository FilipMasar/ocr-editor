import { FC } from 'react';
import { Loader as MantineLoader, Center, Text, Stack, MantineColor } from '@mantine/core';

interface LoaderProps {
  /**
   * Optional text to display below the loader
   */
  text?: string;
  
  /**
   * Size of the loader
   */
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Color of the loader
   */
  color?: MantineColor;
  
  /**
   * Whether to take the full height of the container
   */
  fullHeight?: boolean;
}

/**
 * A reusable loader component
 */
const Loader: FC<LoaderProps> = ({ 
  text,
  size = 'md',
  color = 'blue',
  fullHeight = false
}) => {
  return (
    <Center style={{ height: fullHeight ? '100vh' : '100%' }}>
      <Stack align="center" spacing="xs">
        <MantineLoader size={size} color={color} />
        {text && <Text size="sm" color="dimmed">{text}</Text>}
      </Stack>
    </Center>
  );
};

export default Loader; 
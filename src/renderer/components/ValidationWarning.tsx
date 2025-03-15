import { FC } from 'react';
import { Alert, Badge, Text, Group, Collapse } from '@mantine/core';
import { AlertTriangle, Info } from 'react-feather';
import { useAlto } from '../context/AltoContext';
import { useDisclosure } from '@mantine/hooks';

const ValidationWarning: FC = () => {
  const { validationStatus, altoVersion } = useAlto();
  const [opened, { toggle }] = useDisclosure(false);
  
  // If no validation status or it's valid, don't show anything
  if (!validationStatus || validationStatus.valid) {
    return null;
  }

  // Make sure errors exist before displaying
  const errorMessage = validationStatus.errors || 'Validation failed but no specific errors were returned.';

  return (
    <Alert 
      icon={<AlertTriangle size={16} />} 
      title={
        <Group position="apart">
          <Text>ALTO Validation Warning</Text>
          <Badge 
            color="blue" 
            variant="outline" 
            style={{ cursor: 'help' }}
          >
            ALTO {altoVersion || 'Unknown'}
          </Badge>
        </Group>
      }
      color="yellow" 
      withCloseButton 
      onClick={toggle}
      mb="sm"
      style={{ cursor: 'pointer' }}
    >
      <Group spacing="xs" mb={4} style={{ fontSize: '12px' }}>
        <Info size={12} />
        <Text size="xs">Click to {opened ? 'hide' : 'view'} details</Text>
      </Group>
      
      <Collapse in={opened}>
        <Text size="sm" mt="xs">
          {errorMessage}
        </Text>
      </Collapse>
    </Alert>
  );
};

export default ValidationWarning; 
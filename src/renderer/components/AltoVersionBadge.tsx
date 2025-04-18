import { FC } from 'react';
import { Badge, Tooltip, Text } from '@mantine/core';
import { useAlto } from '../context/app/AltoContext';

interface AltoVersionBadgeProps {
  showTooltip?: boolean;
}

const AltoVersionBadge: FC<AltoVersionBadgeProps> = ({ showTooltip = true }) => {
  const { altoVersion } = useAlto();
  console.log(altoVersion);
  
  if (!altoVersion) {
    return null;
  }
  
  // Determine version color
  let color = 'gray';
  let versionInfo = 'Unknown ALTO version';
  
  if (altoVersion.startsWith('4.')) {
    color = 'green';
    versionInfo = 'ALTO v4: Latest version with advanced metadata features';
  } else if (altoVersion.startsWith('3.')) {
    color = 'blue';
    versionInfo = 'ALTO v3: Supports ComposedBlocks and enhanced metadata';
  } else if (altoVersion.startsWith('2.')) {
    color = 'orange';
    versionInfo = 'ALTO v2: Basic OCR structure without ComposedBlocks';
  } else if (altoVersion.startsWith('1.')) {
    color = 'red';
    versionInfo = 'ALTO v1: Legacy format with limited features';
  }
  
  const badge = (
    <Badge color={color} size="sm">
      ALTO {altoVersion}
    </Badge>
  );
  
  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip
      label={
        <Text size="xs">{versionInfo}</Text>
      }
      withArrow
      position="bottom"
    >
      {badge}
    </Tooltip>
  );
};

export default AltoVersionBadge; 
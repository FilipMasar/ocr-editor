import { FC } from 'react';
import { Badge } from '../common';
import { useAlto } from '../../context/app/AltoContext';

interface AltoVersionBadgeProps {
  showTooltip?: boolean;
}

/**
 * Displays a badge with the ALTO version and its information
 */
const AltoVersionBadge: FC<AltoVersionBadgeProps> = ({ showTooltip = true }) => {
  const { altoVersion } = useAlto();
  
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
  
  return (
    <Badge 
      color={color} 
      size="sm"
      tooltip={showTooltip ? versionInfo : undefined}
      tooltipPosition="bottom"
    >
      ALTO {altoVersion}
    </Badge>
  );
};

export default AltoVersionBadge; 
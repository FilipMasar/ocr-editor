import { FC, ReactNode } from 'react';
import { Badge as MantineBadge, BadgeProps as MantineBadgeProps, Tooltip, Text } from '@mantine/core';

interface BadgeProps extends Omit<MantineBadgeProps, 'children'> {
  /**
   * Badge content
   */
  children: ReactNode;
  
  /**
   * Optional tooltip text
   */
  tooltip?: string;
  
  /**
   * Tooltip position
   */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A reusable badge component with optional tooltip
 */
const Badge: FC<BadgeProps> = ({ 
  children, 
  tooltip, 
  tooltipPosition = 'bottom', 
  ...props 
}) => {
  const badge = (
    <MantineBadge {...props}>
      {children}
    </MantineBadge>
  );
  
  if (!tooltip) {
    return badge;
  }
  
  return (
    <Tooltip
      label={<Text size="xs">{tooltip}</Text>}
      withArrow
      position={tooltipPosition}
    >
      {badge}
    </Tooltip>
  );
};

export default Badge; 
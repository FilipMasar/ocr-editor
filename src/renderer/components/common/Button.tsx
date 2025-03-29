import { FC, ReactNode } from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps, Tooltip } from '@mantine/core';

interface ButtonProps extends Omit<MantineButtonProps, 'children'> {
  /**
   * Button content
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
  
  /**
   * Whether the button should be compact (reduces padding)
   */
  compact?: boolean;
}

/**
 * A reusable button component with optional tooltip
 */
const Button: FC<ButtonProps> = ({ 
  children, 
  tooltip, 
  tooltipPosition = 'top',
  compact = false,
  ...props 
}) => {
  const button = (
    <MantineButton
      {...props}
      size={compact ? 'xs' : props.size}
      sx={{
        ...(props.sx || {}),
        ...(compact ? { padding: '2px 8px' } : {})
      }}
    >
      {children}
    </MantineButton>
  );
  
  if (!tooltip) {
    return button;
  }
  
  return (
    <Tooltip
      label={tooltip}
      withArrow
      position={tooltipPosition}
    >
      {button}
    </Tooltip>
  );
};

export default Button; 
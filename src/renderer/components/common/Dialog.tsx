import { FC, ReactNode } from 'react';
import { Dialog as MantineDialog, DialogProps as MantineDialogProps } from '@mantine/core';

interface DialogProps extends Omit<MantineDialogProps, 'children'> {
  /**
   * Dialog content
   */
  children: ReactNode;
  
  /**
   * Whether the dialog is open
   */
  opened: boolean;
  
  /**
   * Callback when the dialog is closed
   */
  onClose: () => void;
  
  /**
   * Optional title for the dialog
   */
  title?: string;
}

/**
 * A reusable dialog component with consistent styling
 */
const Dialog: FC<DialogProps> = ({ 
  children, 
  opened, 
  onClose, 
  title,
  ...props 
}) => {
  return (
    <MantineDialog
      opened={opened}
      withCloseButton
      onClose={onClose}
      position={{ top: 20, right: 20 }}
      shadow="sm"
      style={{ 
        width: 'auto', 
        maxWidth: '90%',
        ...props.style
      }}
      {...props}
    >
      {children}
    </MantineDialog>
  );
};

export default Dialog; 
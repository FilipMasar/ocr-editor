import { FC } from 'react';
import { Notification } from './common';
import { Dialog } from '@mantine/core';

interface ErrorDialogProps {
  /**
   * The error message to display
   */
  message?: string;
  
  /**
   * Whether the dialog is open
   */
  opened: boolean;
  
  /**
   * Callback when the dialog is closed
   */
  onClose: () => void;
}

/**
 * Error dialog component for displaying error messages
 */
export const ErrorDialog: FC<ErrorDialogProps> = ({ message, opened, onClose }) => {
  return (
    <Dialog
      opened={opened}
      p={0}
      shadow='0'
      withBorder={false}
      position={{ top: 20, right: 20 }}
    >
      <Notification
        type="error"
        title="Error"
        px="md"
        onClose={onClose}
      >
        {message || 'An unknown error occurred.'}
      </Notification>
    </Dialog>
  );
};

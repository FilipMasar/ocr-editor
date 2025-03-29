import { FC } from 'react';
import { Dialog, Notification } from '../common';

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
const ErrorDialog: FC<ErrorDialogProps> = ({ message, opened, onClose }) => {
  return (
    <Dialog opened={opened} onClose={onClose}>
      <Notification
        type="error"
        title="Error"
        disableClose
      >
        {message || 'An unknown error occurred.'}
      </Notification>
    </Dialog>
  );
};

export default ErrorDialog; 
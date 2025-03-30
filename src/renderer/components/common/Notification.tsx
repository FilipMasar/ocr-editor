import { FC, ReactNode } from 'react';
import { Notification as MantineNotification, NotificationProps } from '@mantine/core';
import { X, Info, Check, AlertTriangle } from 'react-feather';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface CustomNotificationProps extends Omit<NotificationProps, 'children' | 'icon'> {
  /**
   * Notification content
   */
  children: ReactNode;
  
  /**
   * The type of notification to display
   */
  type?: NotificationType;
  
  /**
   * Optional custom icon
   */
  customIcon?: ReactNode;
  
  /**
   * Whether to disable the close button
   */
  disableClose?: boolean;
}

/**
 * A reusable notification component with different types
 */
const Notification: FC<CustomNotificationProps> = ({ 
  children, 
  type = 'info',
  customIcon,
  disableClose = false,
  ...props 
}) => {
  // Determine the icon and color based on type
  let icon = customIcon;
  let color = props.color || 'blue';
  
  if (!customIcon) {
    switch (type) {
      case 'success':
        icon = <Check size={18} />;
        color = 'green';
        break;
      case 'error':
        icon = <X size={18} />;
        color = 'red';
        break;
      case 'warning':
        icon = <AlertTriangle size={18} />;
        color = 'yellow';
        break;
      case 'info':
      default:
        icon = <Info size={18} />;
        color = 'blue';
        break;
    }
  }
  
  return (
    <MantineNotification
      icon={icon}
      color={color}
      disallowClose={disableClose}
      {...props}
    >
      {children}
    </MantineNotification>
  );
};

export default Notification; 
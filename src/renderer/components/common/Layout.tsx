import { FC, ReactNode } from 'react';
import { Box, Container, ContainerProps, MantineNumberSize } from '@mantine/core';

interface LayoutProps extends Omit<ContainerProps, 'children'> {
  /**
   * Content to render inside the layout
   */
  children: ReactNode;
  
  /**
   * Optional header component
   */
  header?: ReactNode;
  
  /**
   * Optional footer component
   */
  footer?: ReactNode;
  
  /**
   * Whether to add padding to the content area
   */
  withPadding?: boolean;
  
  /**
   * Maximum width for the container
   */
  maxWidth?: MantineNumberSize;
}

/**
 * A reusable layout component for consistent page layouts
 */
const Layout: FC<LayoutProps> = ({ 
  children, 
  header, 
  footer,
  withPadding = true,
  maxWidth = 'xl',
  ...props 
}) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.colors.gray[0],
      })}
    >
      {header && (
        <Box
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.colors.gray[3]}`,
            backgroundColor: theme.white,
          })}
        >
          {header}
        </Box>
      )}
      
      <Container
        sx={{
          flex: '1 1 auto',
          padding: withPadding ? undefined : 0,
          display: 'flex',
          flexDirection: 'column',
        }}
        size={maxWidth}
        {...props}
      >
        {children}
      </Container>
      
      {footer && (
        <Box
          sx={(theme) => ({
            borderTop: `1px solid ${theme.colors.gray[3]}`,
            backgroundColor: theme.white,
          })}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
};

export default Layout; 
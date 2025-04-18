import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Title, Text, Button, Paper, Group, Alert } from '@mantine/core';
import { AlertTriangle } from 'react-feather';
import { logger } from '../../utils/logger';

interface ErrorBoundaryProps {
  /**
   * The component(s) to render inside the error boundary
   */
  children: ReactNode;

  /**
   * Optional component name for better error identification
   */
  componentName?: string;

  /**
   * Optional fallback component to render instead of the default
   */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  /**
   * Whether an error has been caught
   */
  hasError: boolean;

  /**
   * The error that was caught
   */
  error: Error | null;

  /**
   * The error info that was caught
   */
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component to catch and handle errors in React components
 * 
 * This component catches errors during rendering and displays a fallback UI
 * while also logging the error to the central logging system.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logging system
    const componentName = this.props.componentName || 'UnknownComponent';
    logger.error(
      `ErrorBoundary:${componentName}`,
      `Uncaught error: ${error.message}`,
      error
    );
    
    // Update state with error info
    this.setState({
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      // If a custom fallback is provided, render it
      if (fallback) {
        return fallback;
      }

      // Otherwise render the default error UI
      return (
        <Paper p="lg" shadow="sm" radius="md" withBorder>
          <Alert 
            icon={<AlertTriangle size={24} />} 
            title="Something went wrong" 
            color="red" 
            mb="md"
          >
            {componentName && (
              <Text size="sm" color="dimmed" mb="xs">
                Error in component: {componentName}
              </Text>
            )}
            <Text fw={500}>{error?.message || 'An unknown error occurred'}</Text>
          </Alert>

          {process.env.NODE_ENV === 'development' && errorInfo && (
            <Paper p="md" withBorder mt="md">
              <Title order={5} mb="xs">Component Stack</Title>
              <Text size="xs" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {errorInfo.componentStack}
              </Text>
            </Paper>
          )}

          <Group position="center" mt="lg">
            <Button color="blue" onClick={this.handleReset}>
              Try Again
            </Button>
          </Group>
        </Paper>
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary; 
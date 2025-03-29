import React from 'react';
import { ErrorBoundary } from '../components/common';

/**
 * Higher-order component that wraps a component with an error boundary
 * 
 * @param Component The component to wrap
 * @param componentName Optional name for the component (for error reporting)
 * @returns The wrapped component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary componentName={displayName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  // Set a display name for the wrapped component
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
} 
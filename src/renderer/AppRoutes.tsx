import { lazy, Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AltoProvider,
  AltoEditorProvider,
  EditorProvider,
  useProject
} from './context';
import { ErrorDialog } from './components/ErrorDialog';
import { ErrorBoundary } from './components/common';
import { Loader } from '@mantine/core';

// Lazy-loaded pages
const StartingPage = lazy(() => import('./pages/StartingPage'));
const Project = lazy(() => import('./pages/Project'));
const Editor = lazy(() => import('./pages/Editor'));

/**
 * Application routes configuration
 */
export default function AppRoutes() {
  const { errorMessage, resetErrorMessage } = useProject();

  return (
    <>
      <ErrorBoundary componentName="AppRoutes">
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={
                <ErrorBoundary componentName="StartingPage">
                  <StartingPage />
                </ErrorBoundary>
              } />
              <Route
                path="/project"
                element={
                  <ErrorBoundary componentName="Project">
                    <Project />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/editor"
                element={
                  <ErrorBoundary componentName="Editor">
                    <AltoProvider>
                      <EditorProvider>
                        <AltoEditorProvider>
                          <Editor />
                        </AltoEditorProvider>
                      </EditorProvider>
                    </AltoProvider>
                  </ErrorBoundary>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>

      <ErrorDialog 
        message={errorMessage} 
        opened={!!errorMessage} 
        onClose={resetErrorMessage} 
      />
    </>
  );
}

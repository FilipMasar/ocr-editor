import { lazy, Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AltoProvider,
  AltoEditorProvider,
  EditorProvider,
  TextEditorProvider,
  useProject
} from './context';
import { ErrorDialog } from './components/ErrorDialog';
import { ErrorBoundary, Loader } from './components/common';

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
          <Suspense fallback={<Loader text="Loading..." fullHeight />}>
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
                      <AltoEditorProvider>
                        <EditorProvider>
                          <TextEditorProvider>
                            <Editor />
                          </TextEditorProvider>
                        </EditorProvider>
                      </AltoEditorProvider>
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

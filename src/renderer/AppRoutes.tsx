import { Dialog, Notification } from '@mantine/core';
import { X } from 'react-feather';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AltoProvider from './context/AltoContext';
import EditorProvider from './context/EditorContext';
import { useProject } from './context/ProjectContext';
import Editor from './pages/Editor';
import ProjectAssetsList from './pages/ProjectAssetsList';
import StartingPage from './pages/StartingPage';

export default function AppRoutes() {
  const { errorMessage, resetErrorMessage } = useProject();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/project" element={<ProjectAssetsList />} />
          <Route
            path="/editor"
            element={
              <AltoProvider>
                <EditorProvider>
                  <Editor />
                </EditorProvider>
              </AltoProvider>
            }
          />
        </Routes>
      </Router>
      <Dialog opened={errorMessage !== undefined} p={0}>
        <Notification
          icon={<X size={18} />}
          color="red"
          onClose={resetErrorMessage}
        >
          {errorMessage}
        </Notification>
      </Dialog>
    </>
  );
}

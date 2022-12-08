import { Dialog, Notification } from '@mantine/core';
import { X } from 'react-feather';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AltoProvider from './context/AltoContext';
import AltoEditorProvider from './context/AltoEditorContext';
import EditorProvider from './context/EditorContext';
import { useProject } from './context/ProjectContext';
import TextEditorProvider from './context/AltoTextEditorContext';
import Editor from './pages/Editor';
import Project from './pages/Project';
import StartingPage from './pages/StartingPage';

export default function AppRoutes() {
  const { errorMessage, resetErrorMessage } = useProject();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/project" element={<Project />} />
          <Route
            path="/editor"
            element={
              <AltoProvider>
                <EditorProvider>
                  <AltoEditorProvider>
                    <TextEditorProvider>
                      <Editor />
                    </TextEditorProvider>
                  </AltoEditorProvider>
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

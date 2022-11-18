import { Dialog, Notification } from '@mantine/core';
import { X } from 'react-feather';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useProject } from './context/ProjectContext';
import Project from './pages/Project';
import ProjectAssetsList from './pages/ProjectAssetsList';
import StartingPage from './pages/StartingPage';

export default function AppRoutes() {
  const { errorMessage, resetErrorMessage } = useProject();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/project">
            <Route index element={<Project />} />
            <Route path="list" element={<ProjectAssetsList />} />
          </Route>
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

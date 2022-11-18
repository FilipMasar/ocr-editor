import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectProvider from './context/ProjectContext';
import Project from './pages/Project';
import ProjectAssetsList from './pages/ProjectAssetsList';
import StartingPage from './pages/StartingPage';

export default function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/project">
            <Route index element={<Project />} />
            <Route path="list" element={<ProjectAssetsList />} />
          </Route>
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

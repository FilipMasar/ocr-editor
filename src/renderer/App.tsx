import { MantineProvider } from '@mantine/core';
import AppRoutes from './AppRoutes';
import ProjectProvider from './context/ProjectContext';

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <ProjectProvider>
        <AppRoutes />
      </ProjectProvider>
    </MantineProvider>
  );
}

import { MantineProvider } from '@mantine/core';
import AppRoutes from './AppRoutes';
import ProjectProvider from './context/ProjectContext';
import SettingsProvider from './context/SettingsContext';

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'light' }}
    >
      <ProjectProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </ProjectProvider>
    </MantineProvider>
  );
}

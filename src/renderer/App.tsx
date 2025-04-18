import { MantineProvider } from '@mantine/core';
import AppRoutes from './AppRoutes';
import { ProjectProvider, SettingsProvider } from './context';
import { theme } from './theme';

/**
 * Main application component
 */
export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={theme}
    >
      <ProjectProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </ProjectProvider>
    </MantineProvider>
  );
}

# OCR Editor - Frontend Architecture

This document outlines the architecture and organization of the OCR Editor's frontend code.

## Directory Structure

The frontend code follows a modular organization:

```
src/renderer/
├── components/          # UI components
│   ├── common/          # Reusable components used across the application
│   ├── editor/          # Components specific to the editor functionality
│   ├── project/         # Components related to project management
│   └── overlay/         # Modal, dialog, and notification components
├── context/             # React contexts for state management
│   ├── app/             # Application-wide contexts (settings, theme)
│   ├── editor/          # Editor-specific contexts
│   └── project/         # Project-related contexts
├── hooks/               # Custom React hooks
├── pages/               # Top-level page components
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Component Organization

Components are organized based on their domain and reusability:

- **Common Components**: Reusable UI elements like Button, Badge, Input that can be used across the application. These components should be as generic as possible.

- **Domain Components**: Components specific to a domain (editor, project) that implement business logic for that domain.

- **Page Components**: Top-level components that represent entire pages in the application.

## State Management

State is managed using React Context API, organized by domain:

- **Project Context**: Manages the state related to projects (assets, metadata, etc.)

- **Editor Context**: Manages the state related to the editor (current page, selections, etc.)

- **App Context**: Manages application-wide settings and configuration

## Custom Hooks

Custom hooks are used to encapsulate complex logic and provide a clean interface for components:

- **useProjectActions**: Provides methods for common project operations
- **useEditorActions**: Provides methods for common editor operations

## IPC Communication

Communication with the main Electron process is handled through a type-safe IPC system:

```typescript
window.electron.ipc.send('channel-name', 'EVENT_NAME', payload);
window.electron.ipc.on('channel-name', 'EVENT_NAME', handler);
```

## Styling

Styling is handled using Mantine UI library with some custom components and theme extensions. 
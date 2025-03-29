# OCR Editor

An Electron application for editing and managing OCR (Optical Character Recognition) results using ALTO XML format.

## Features

- Create and manage OCR projects
- Import images and ALTO XML files
- Edit and correct OCR results
- Calculate Word Error Rate (WER) for quality assessment
- Type-safe IPC communication between main and renderer processes

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ocr-editor.git
cd ocr-editor

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## Architecture

The application follows a layered architecture with clear separation of concerns:

### Layers

1. **UI Layer** (React components in `src/renderer`)
   - Pages and components for user interaction
   - Context providers for state management

2. **IPC Bridge** (in `src/preload`)
   - Type-safe communication bridge between renderer and main process
   - Handles message passing and event subscription

3. **Handler Layer** (in `src/main/handlers`)
   - Processes IPC messages from the renderer
   - Delegates to appropriate services
   - Returns typed responses

4. **Service Layer** (in `src/main/services`)
   - Contains the core business logic
   - Manages application state
   - Provides reusable operations

5. **Utility Layer** (in `src/main/utils`)
   - Helper functions and tools
   - IPC registration utilities
   - File system operations

### IPC Communication

The application uses a type-safe IPC system for communication between the renderer and main processes:

1. **Message Definition** (in `src/shared/ipc`)
   - Channel definitions with typed requests and responses
   - Payload type definitions
   - Utility types for type inference

2. **Renderer-side Usage**
   - Send messages: `window.electron.ipc.send('channel-name', 'ACTION_NAME', payload)`
   - Listen for responses: `window.electron.ipc.on('channel-name', 'RESPONSE_ACTION', handler)`
   - Error handling: `window.electron.ipc.onError(errorHandler)`

3. **Main-process Handlers**
   - Register handlers with `registerHandler(ipcMain, 'channel-name', 'ACTION_NAME', handler)`
   - Process requests and return typed responses
   - Consistent error handling

4. **Services**
   - Encapsulate business logic for different domains
   - Maintain state between operations
   - Provide clean interfaces for handlers

## Project Structure

```
src/
├── main/                 # Main process code
│   ├── handlers/         # IPC message handlers
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── index.ts          # Main process entry point
├── preload/              # Preload script for IPC bridge
├── renderer/             # Renderer process (React)
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Application pages
│   └── App.tsx           # Root component
└── shared/               # Shared code between processes
    ├── ipc/              # IPC types and definitions
    └── types/            # Common type definitions
```

## License

MIT
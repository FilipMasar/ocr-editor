# Custom Hooks

This directory contains custom React hooks used throughout the application. These hooks encapsulate common logic and provide a clean API for components.

## Available Hooks

### `useProjectActions`

Provides methods for common project operations.

```tsx
import { useProjectActions } from '../hooks';

function MyComponent() {
  const { 
    createProject, 
    openProject, 
    addImages, 
    addAltos, 
    removeAsset, 
    updatePageDone 
  } = useProjectActions();
  
  // Use these methods in your component
  const handleAddImages = () => {
    addImages();
  };
}
```

### `useEditorActions`

Provides methods for common editor operations.

```tsx
import { useEditorActions } from '../hooks';

function MyComponent() {
  const { 
    requestPageAssets, 
    saveAlto, 
    zoomIn, 
    zoomOut, 
    resetZoom, 
    currentZoom 
  } = useEditorActions();
  
  // Use these methods in your component
  const handleZoomIn = () => {
    zoomIn();
  };
}
```

### `useAppSettings`

Provides methods to update application settings.

```tsx
import { useAppSettings } from '../hooks';

function MyComponent() {
  const { 
    settings, 
    setImageOpacity, 
    toggleVisibility, 
    setVisibility 
  } = useAppSettings();
  
  // Use these methods in your component
  const handleOpacityChange = (value: number) => {
    setImageOpacity(value);
  };
}
```

### `useLocalStorage`

A hook for working with localStorage.

```tsx
import { useLocalStorage } from '../hooks';

function MyComponent() {
  const [value, setValue] = useLocalStorage('my-key', 'default value');
  
  // Use these methods in your component
  const handleChange = (newValue: string) => {
    setValue(newValue);
  };
}
```

### `useTheme`

Provides theme-related utilities.

```tsx
import { useTheme } from '../hooks';

function MyComponent() {
  const { getColorValue, getStatusColor, getBreakpoint } = useTheme();
  
  // Use these methods in your component
  const successColor = getStatusColor('success');
  const primaryColor = getColorValue('brand', 6);
  const mdBreakpoint = getBreakpoint('md');
}
```

## Best Practices

1. **Prefer hooks over direct context usage**: Instead of accessing contexts directly in your components, use these hooks to get the functionality you need.

2. **Avoid duplicate logic**: If you find yourself writing the same logic in multiple components, consider creating a custom hook.

3. **Keep hooks focused**: Each hook should be focused on a specific responsibility.

4. **Encapsulate API calls**: Use hooks to encapsulate API calls and provide loading/error states.

5. **Add JSDoc comments**: Document your hooks with JSDoc comments to make them easier to use.

6. **Memoize callbacks**: Use useCallback to memoize functions that get passed to child components. 
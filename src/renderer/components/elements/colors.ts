/**
 * This file contains the color configuration for all ALTO elements.
 * Centralizing colors makes it easier to maintain a consistent color scheme
 * and customize colors for different elements in one place.
 */

export interface ElementColorConfig {
  // Border color (solid)
  borderColor: string;
  // Background color (with opacity)
  backgroundColor: string;
}

export const elementColors: Record<string, ElementColorConfig> = {
  strings: {
    borderColor: 'blue',
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  textLines: {
    borderColor: 'orange',
    backgroundColor: 'rgba(255, 165, 0, 0.5)',
  },
  textBlocks: {
    borderColor: 'purple',
    backgroundColor: 'rgba(128, 0, 128, 0.5)',
  },
  graphicalElements: {
    borderColor: 'olive',
    backgroundColor: 'rgba(128, 128, 0, 0.5)',
  },
  illustrations: {
    borderColor: 'fuchsia',
    backgroundColor: 'rgba(255, 0, 255, 0.5)',
  },
  composedBlocks: {
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  printSpace: {
    borderColor: 'maroon', 
    backgroundColor: 'rgba(128, 0, 0, 0.5)',
  },
  margins: {
    borderColor: 'teal',
    backgroundColor: 'rgba(0, 128, 128, 0.5)',
  },
  page: {
    borderColor: 'black',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  hyphens: {
    borderColor: 'lime',
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
  },
};

import { MantineThemeOverride } from '@mantine/core';

/**
 * Application theme configuration
 * Customizes the default Mantine theme
 */
export const theme: MantineThemeOverride = {
  // Set default color scheme
  colorScheme: 'light',
  
  // Customize colors
  colors: {
    // Custom primary color
    brand: [
      '#E6F7FF', // 0
      '#BAE7FF', // 1
      '#91D5FF', // 2
      '#69C0FF', // 3
      '#40A9FF', // 4
      '#1890FF', // 5 - Primary
      '#096DD9', // 6
      '#0050B3', // 7
      '#003A8C', // 8
      '#002766', // 9
    ],
  },
  
  // Set primary color
  primaryColor: 'brand',
  
  // Customize radius for components
  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  // Customize shadows
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  
  // Customize spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Customize font sizes
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  
  // Default props for components
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
  },
}; 
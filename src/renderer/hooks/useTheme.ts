import { useCallback } from 'react';
import { useMantineTheme, MantineColor, DefaultMantineColor } from '@mantine/core';

/**
 * Custom hook for theme-related utilities
 */
export const useTheme = () => {
  const theme = useMantineTheme();
  
  /**
   * Get the color value for a specific color and shade
   * @param color The color name (e.g., 'blue', 'red', etc.)
   * @param shade The shade index (0-9)
   * @returns The color value
   */
  const getColorValue = useCallback((
    color: MantineColor | DefaultMantineColor, 
    shade = 6
  ): string => {
    if (shade < 0 || shade > 9) {
      console.warn('Shade must be between 0 and 9, defaulting to 6');
      shade = 6;
    }
    
    return theme.colors[color][shade];
  }, [theme.colors]);
  
  /**
   * Get a color for a specific status
   * @param status The status ('success', 'error', 'warning', 'info')
   * @param shade The color shade (0-9)
   * @returns The color value
   */
  const getStatusColor = useCallback((
    status: 'success' | 'error' | 'warning' | 'info', 
    shade = 6
  ): string => {
    const colorMap: Record<string, MantineColor | DefaultMantineColor> = {
      success: 'green',
      error: 'red',
      warning: 'yellow',
      info: 'blue'
    };
    
    return getColorValue(colorMap[status], shade);
  }, [getColorValue]);
  
  /**
   * Get theme breakpoints
   */
  const getBreakpoint = useCallback((breakpoint: string): number => {
    return theme.breakpoints[breakpoint as keyof typeof theme.breakpoints];
  }, [theme.breakpoints]);
  
  return {
    theme,
    getColorValue,
    getStatusColor,
    getBreakpoint
  };
}; 
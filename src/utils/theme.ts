// Theme configuration for the app
// Consistent colors, spacing, and typography

// Color palette
export const colors = {
    // Primary colors
    primary: '#6B9080',
    primaryLight: '#A4C3B2',
    primaryDark: '#4C6A5D',
    
    // Secondary colors
    secondary: '#F6BD60',
    secondaryLight: '#F8E1A6',
    secondaryDark: '#E09F3E',
    
    // Neutral colors (more muted as requested) 
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2D3748',
    textLight: '#718096',
    border: '#E2E8F0',
    
    // Semantic colors
    success: '#68D391',
    warning: '#F6BD60',
    error: '#FC8181',
    info: '#63B3ED',
    
    // Activity type colors
    sleep: '#9F7AEA',
    feeding: '#F6BD60',
    diaper: '#4FD1C5',
    milestone: '#63B3ED',
  };
  
  // Typography
  export const typography = {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  };
  
  // Spacing
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  };
  
  // Border radius
  export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  };
  
  // Shadows
  export const shadows = {
    sm: {
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  };
  
  // Export default theme
  export default {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
  };
  
import { useTheme } from '@mui/material/styles'

export function useThemeColors() {
  const theme = useTheme()

  return {
    // Primary colors (purple)
    primary: theme.palette.primary.main,
    primaryLight: theme.palette.primary.light,
    primaryDark: theme.palette.primary.dark,

    // Background colors
    bgDefault: theme.palette.background.default,
    bgPaper: theme.palette.background.paper,

    // Text colors
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,

    // UI colors
    divider: theme.palette.divider,

    // Mode-specific
    isDark: theme.palette.mode === 'dark',
    isLight: theme.palette.mode === 'light',
  }
}

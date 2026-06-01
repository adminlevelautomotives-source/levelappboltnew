import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#7C3AED',
          light: '#A855F7',
          dark: '#6D28D9',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#A855F7',
          light: '#C084FC',
          dark: '#7C3AED',
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#0D0D1A',
          paper: '#1A1A2E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#D1D5DB',
        },
        divider: '#374151',
        error: { main: '#EF4444' },
        warning: { main: '#F59E0B' },
        success: { main: '#10B981' },
        info: { main: '#3B82F6' },
      },
    },
    light: {
      palette: {
        mode: 'light',
        primary: {
          main: '#7C3AED',
          light: '#A855F7',
          dark: '#6D28D9',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#A855F7',
          light: '#C084FC',
          dark: '#7C3AED',
          contrastText: '#FFFFFF',
        },
        background: {
          default: '#FFFFFF',
          paper: '#F9FAFB',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
        },
        divider: '#E5E7EB',
        error: { main: '#EF4444' },
        warning: { main: '#F59E0B' },
        success: { main: '#10B981' },
        info: { main: '#3B82F6' },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "DM Sans", system-ui, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
        },
        contained: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(124, 58, 237, 0.15)'
              : 'rgba(124, 58, 237, 0.08)',
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          borderRadius: 16,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1A1A2E' : '#F9FAFB',
            borderRadius: 12,
            '& fieldset': { borderColor: theme.palette.divider },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '1.5px',
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
            color: theme.palette.text.primary,
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#1A1A2E' : '#F9FAFB',
          color: theme.palette.text.primary,
          '& fieldset': { borderColor: theme.palette.divider },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          height: 64,
        }),
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
          minWidth: 0,
        }),
        label: {
          fontSize: '0.65rem',
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#1A1A2E' : '#F9FAFB',
          borderRadius: 12,
          color: theme.palette.text.primary,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: ({ theme }) => ({
          '&.Mui-checked': {
            color: theme.palette.primary.main,
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
        }),
      },
    },
    MuiRating: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          '& .MuiSlider-track': {
            backgroundColor: theme.palette.primary.main,
          },
          '& .MuiSlider-rail': {
            backgroundColor: theme.palette.divider,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#1A1A2E' : '#F3F4F6',
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(124, 58, 237, 0.1)'
              : 'rgba(124, 58, 237, 0.08)',
          },
        }),
      },
    },
  },
})

export default theme

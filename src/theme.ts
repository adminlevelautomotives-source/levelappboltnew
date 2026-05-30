import { createTheme } from '@mui/material/styles'
import { deepPurple, grey, purple } from '@mui/material/colors'

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: purple[700], // Deep purple: #6A1B9A
          light: purple[400], // Light purple: #AB47BC
          dark: deepPurple[900], // Very dark purple: #37145B
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: grey[200], // Light grey for secondary accent
          light: '#FFFFFF',
          dark: grey[400],
          contrastText: grey[900],
        },
        success: { main: '#10b981' },
        error: { main: '#ef4444' },
        warning: { main: '#f59e0b' },
        background: {
          default: '#FFFFFF',
          paper: '#F5F5F5',
        },
        text: {
          primary: grey[900], // Almost black: #212121
          secondary: grey[600], // Medium grey: #616161
        },
        divider: grey[300],
      },
    },
    dark: {
      palette: {
        primary: {
          main: purple[400], // Light purple for dark mode: #AB47BC
          light: purple[300], // Even lighter: #BA68C8
          dark: deepPurple[800], // Dark purple: #4A148C
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: grey[700], // Dark grey for secondary accent
          light: grey[600],
          dark: grey[900],
          contrastText: '#FFFFFF',
        },
        success: { main: '#10b981' },
        error: { main: '#ef4444' },
        warning: { main: '#f59e0b' },
        background: {
          default: '#121212', // Dark background
          paper: '#1E1E1E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: grey[400], // Light grey: #BDBDBD
        },
        divider: grey[800],
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
            backgroundColor: `${theme.palette.primary.main}15`,
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.mode === 'light' ? grey[50] : grey[900],
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
          backgroundColor: theme.palette.mode === 'light' ? grey[50] : grey[900],
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
          backgroundColor: theme.palette.mode === 'light' ? grey[50] : grey[900],
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
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            backgroundColor: purple[700],
            color: '#FFFFFF',
          },
        },
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
  },
})

export default theme

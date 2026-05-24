import { createTheme } from '@mui/material/styles';

import { cosmicColors } from './styles/cosmic';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#7c3aed'
    },
    secondary: {
      main: '#22d3ee'
    },
    text: {
      primary: cosmicColors.textPrimary,
      secondary: cosmicColors.textSecondary
    },
    background: {
      default: cosmicColors.spaceDeep,
      paper: cosmicColors.glass
    },
    divider: cosmicColors.border
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"'
    ].join(',')
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#226CF6',        
      light: '#4A8BF8',
      dark: '#1A54C4',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2A48A9',        
      light: '#5168BB',
      dark: '#1E3377',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f5f6fa',     
      paper: '#FFFFFF',      
    },
    text: {
      primary: '#293951',     
      secondary: '#8b8f9e',   
    },
    error: {
      main: '#E53935',
    },
    success: {
      main: '#43A047',
    },
    warning: {
      main: '#FB8C00',
    },
    info: {
      main: '#1E88E5',
    },
  },
  
  
  customColors: {
    cardBackground: '#fafbff',
    cardBorder: '#f0f2f4',
    blueButton: '#434BFF',
    headerGradientStart: '#226CF6',
    headerGradientEnd: '#8E54E9',
  },
  
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h3: {
      fontWeight: 600,
      fontSize: '2.3rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.35rem',
    },
  },
  
  spacing: 8,
  
  shape: {
    borderRadius: 14, 
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      cardBackground: string;
      cardBorder: string;
      blueButton: string;
      headerGradientStart: string;
      headerGradientEnd: string;
    };
  }
  interface ThemeOptions {
    customColors?: {
      cardBackground?: string;
      cardBorder?: string;
      blueButton?: string;
      headerGradientStart?: string;
      headerGradientEnd?: string;
    };
  }
}

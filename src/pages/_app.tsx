import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { tomorrow } from '../fonts/localFonts'

const theme = createTheme({
  palette: {
    background: {
      default: '#DDD1DC;',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={tomorrow.className}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
} 
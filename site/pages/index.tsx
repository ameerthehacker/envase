import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from '../components/app/app';

export default function Index() {
  return (
    <ThemeProvider>
      <CSSReset />
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  );
}

import { watchEffect } from 'vue';
import { useLocalStorage } from '../storage/useLocalStorage';

type Theme = 'light' | 'dark';

export function useTheme(defaultTheme: Theme = 'light') {
  const theme = useLocalStorage<Theme>('theme', defaultTheme);

  const applyTheme = (value: Theme) => {
    document.documentElement.setAttribute('data-theme', value);
  };

  watchEffect(() => {
    applyTheme(theme.value);
  });

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  return {
    theme,
    toggleTheme,
  };
}

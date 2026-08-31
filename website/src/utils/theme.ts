export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'luxury_theme';

/**
 * Apply the selected theme mode to document element and save preference
 */
export const applyTheme = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (e) {
    console.warn('Unable to persist theme to localStorage', e);
  }

  const root = document.documentElement;

  if (mode === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else if (mode === 'light') {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  } else {
    // System preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }
};

/**
 * Get current saved theme mode
 */
export const getSavedTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('monolith_theme_preference');
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved as ThemeMode;
    }
  } catch {
    // ignore
  }
  return 'light';
};

/**
 * Initialize theme immediately on page load
 */
export const initTheme = (): void => {
  const current = getSavedTheme();
  applyTheme(current);
};

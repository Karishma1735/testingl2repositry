import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${nextTheme} theme`}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-atelier-200 bg-surface/80 text-atelier-700 transition-colors hover:border-accent hover:text-accent"
    >
      <ThemeIcon className="size-4" aria-hidden="true" />
      <span className="sr-only">Switch to {nextTheme} theme</span>
    </button>
  );
};

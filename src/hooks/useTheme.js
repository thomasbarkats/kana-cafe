import { useEffect, useState } from 'react';
import { STORAGE_KEYS, THEME_MODES } from '../constants';
import { useMediaQuery } from './useMediaQuery';


export const useTheme = () => {
  const getInitialThemeMode = () => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.THEME);
    return Object.values(THEME_MODES).includes(savedMode) ? savedMode : THEME_MODES.AUTO;
  };

  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const darkMode = themeMode === THEME_MODES.AUTO
    ? systemPrefersDark
    : themeMode === THEME_MODES.DARK;

  // Cycle: auto -> the device theme forced -> the opposite theme -> auto.
  // Ordered so auto is only ever reached from the opposite theme, where it repaints:
  // landing on a theme identical to the current one would read as a dead button.
  const systemThemeMode = systemPrefersDark ? THEME_MODES.DARK : THEME_MODES.LIGHT;
  const oppositeThemeMode = systemPrefersDark ? THEME_MODES.LIGHT : THEME_MODES.DARK;
  const nextThemeMode = themeMode === THEME_MODES.AUTO
    ? systemThemeMode
    : (themeMode === systemThemeMode ? oppositeThemeMode : THEME_MODES.AUTO);

  const cycleThemeMode = () => {
    localStorage.setItem(STORAGE_KEYS.THEME, nextThemeMode);
    setThemeMode(nextThemeMode);
  };

  const getThemeClasses = () => {
    if (darkMode) {
      return {
        bg: 'bg-gradient-to-br from-night-950 via-night-900 to-night-950',
        rootBg: 'bg-night-950',
        cardBg: 'bg-night-800',
        modalBg: 'bg-night-800',
        selectorBg: 'bg-night-800',
        buttonPrimaryBg: 'bg-night-700',
        buttonSecondaryBg: 'bg-night-800',
        sideButton: 'bg-night-700/70 border border-white/10 hover:bg-night-700/85 backdrop-blur-sm',
        selectorHover: 'hover:bg-night-700',
        inputBg: 'bg-night-700',
        progressBg: 'bg-night-600',
        sectionBg: 'bg-night-700',
        emptyBg: 'bg-night-700/30',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        border: 'border-night-600',
        divider: 'divide-night-600',
        inputBorder: 'border-night-600 focus:border-blue-400',
        buttonSecondary: 'text-gray-300 hover:text-gray-100 hover:bg-night-700',
        buttonActive: 'text-gray-100 bg-night-600 hover:text-gray-300',
        buttonSkip: 'text-white bg-night-500 hover:bg-night-600',
        bookmarkColor: 'text-yellow-500',
        statsBg: {
          blue: 'bg-blue-900/50',
          red: 'bg-red-900/50',
          green: 'bg-green-900/50',
          purple: 'bg-purple-900/50'
        },
        statsText: {
          blue: 'text-blue-300',
          red: 'text-red-300',
          green: 'text-green-300',
          purple: 'text-purple-300'
        },
        feedbackSuccess: {
          bg: 'bg-green-900/50 border-green-400',
          title: 'text-green-300',
          text: 'text-green-400',
          progressBar: 'bg-green-400'
        },
        feedbackError: {
          bg: 'bg-red-900/50 border-red-400',
          title: 'text-red-300',
          text: 'text-red-400',
          progressBar: 'bg-red-400'
        },
        feedbackPausedButton: 'text-amber-400 hover:text-amber-300 hover:bg-amber-900/50',
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100',
        rootBg: 'bg-blue-50',
        cardBg: 'bg-white',
        modalBg: 'bg-white',
        selectorBg: 'bg-white',
        buttonPrimaryBg: 'bg-white',
        buttonSecondaryBg: 'bg-gray-100',
        sideButton: 'bg-white/70 border border-white/50 hover:bg-white/85 backdrop-blur-sm',
        selectorHover: 'hover:bg-gray-100',
        inputBg: 'bg-white',
        progressBg: 'bg-gray-200',
        sectionBg: 'bg-gray-100',
        emptyBg: 'bg-gray-100/80',
        text: 'text-gray-800',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        border: 'border-gray-300',
        divider: 'divide-gray-300',
        inputBorder: 'border-gray-300 focus:border-blue-500',
        buttonSecondary: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        buttonActive: 'text-gray-600 bg-gray-200 hover:text-gray-500',
        buttonSkip: 'text-white bg-gray-500 hover:bg-gray-600',
        bookmarkColor: 'text-yellow-600',
        statsBg: {
          blue: 'bg-blue-100',
          red: 'bg-red-100',
          green: 'bg-green-100',
          purple: 'bg-purple-100'
        },
        statsText: {
          blue: 'text-blue-800',
          red: 'text-red-800',
          green: 'text-green-800',
          purple: 'text-purple-800'
        },
        feedbackSuccess: {
          bg: 'bg-green-100 border-green-300',
          title: 'text-green-800',
          text: 'text-green-700',
          progressBar: 'bg-green-300'
        },
        feedbackError: {
          bg: 'bg-red-100 border-red-300',
          title: 'text-red-800',
          text: 'text-red-700',
          progressBar: 'bg-red-300'
        },
        feedbackPausedButton: 'text-amber-500 hover:text-amber-600 hover:bg-amber-100',
      };
    }
  };

  const theme = getThemeClasses();

  // Paints the overscroll area (mobile rubber-band) instead of the default white,
  // and the installed app's status bar through theme-color
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(theme.rootBg);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', getComputedStyle(root).backgroundColor);
    return () => root.classList.remove(theme.rootBg);
  }, [theme.rootBg]);

  return {
    darkMode,
    themeMode,
    nextThemeMode,
    cycleThemeMode,
    theme
  };
};

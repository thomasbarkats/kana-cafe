import { DESKTOP_BREAKPOINT_FALLBACK, DESKTOP_BREAKPOINT_VAR } from '../constants';
import { useMediaQuery } from './useMediaQuery';

// Resolved once: the value comes from the stylesheet and cannot change at runtime, and
// getComputedStyle forces a style recalc that has no place in a render path.
let desktopQuery;

const getDesktopQuery = () => {
  if (!desktopQuery) {
    const width = getComputedStyle(document.documentElement)
      .getPropertyValue(DESKTOP_BREAKPOINT_VAR)
      .trim();
    desktopQuery = `(min-width: ${width || DESKTOP_BREAKPOINT_FALLBACK})`;
  }
  return desktopQuery;
};

// Single source of truth for the layout forks that CSS alone can't express (structural
// moves, platform-specific help, keyboard hints). Pure styling stays in Tailwind lg:.
export const useIsMobile = () => {
  return !useMediaQuery(getDesktopQuery());
};

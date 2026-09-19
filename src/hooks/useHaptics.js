import { useCallback } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { triggerHaptic } from '../utils/hapticsHelper';

export const useHaptics = () => {
  const { hapticsEnabled } = usePreferences();
  return useCallback((pattern) => triggerHaptic(pattern, hapticsEnabled), [hapticsEnabled]);
};

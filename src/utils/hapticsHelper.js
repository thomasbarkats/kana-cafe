import { WebHaptics } from 'web-haptics';
import { getMobilePlatform } from './deviceHelper';

// Created on first use: on iOS it injects a hidden switch input whose toggle fires the system tap.
// iOS only honours it inside a user gesture, so call from click / submit handlers, never from timers.
let haptics = null;

export const isHapticsAvailable = () => getMobilePlatform() !== null;

export const triggerHaptic = (pattern, enabled) => {
  if (!enabled || !isHapticsAvailable()) return;

  haptics ??= new WebHaptics();
  haptics.trigger(pattern);
};

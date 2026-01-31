import { useEffect } from 'react';
import { GAME_STATES } from '../constants';
import { useGameContext } from '../contexts/GameContext';
import { usePreferences } from '../contexts/PreferencesContext';


export function useKeyboardShortcuts({
  onToggleLogin,
  onToggleKeyboard,
  onToggleHelp,
  showLoginModal,
  showKeyboardModal,
  showHelpModal,
  onToggleLoopMode
} = {}) {
  const { gameState } = useGameContext();
  const { toggleDarkMode, cycleSoundMode } = usePreferences();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const anyModalOpen = showLoginModal || showKeyboardModal || showHelpModal;

      // U key - toggle login modal
      if ((e.key === 'u' || e.key === 'U') && gameState === GAME_STATES.MENU && onToggleLogin) {
        // Only allow if no other modal is open, or if login modal is the one open
        if (!anyModalOpen || showLoginModal) {
          e.preventDefault();
          onToggleLogin();
        }
        return;
      }

      // K key - toggle keyboard help
      if ((e.key === 'k' || e.key === 'K') && gameState === GAME_STATES.MENU && onToggleKeyboard) {
        // Only allow if no other modal is open, or if keyboard modal is the one open
        if (!anyModalOpen || showKeyboardModal) {
          e.preventDefault();
          onToggleKeyboard();
        }
        return;
      }

      // H key - toggle help modal
      if ((e.key === 'h' || e.key === 'H') && gameState === GAME_STATES.MENU && onToggleHelp) {
        // Only allow if no other modal is open, or if help modal is the one open
        if (!anyModalOpen || showHelpModal) {
          e.preventDefault();
          onToggleHelp();
        }
        return;
      }

      // Don't allow L and M when any modal is open
      if (anyModalOpen) {
        return;
      }

      // L key - toggle light/dark mode
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleDarkMode();
      }

      // M key - toggle sound mode
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        cycleSoundMode();
      }

      // R key - toggle loop mode (only in MENU state and if handler provided)
      if ((e.key === 'r' || e.key === 'R') && gameState === GAME_STATES.MENU && onToggleLoopMode) {
        e.preventDefault();
        onToggleLoopMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, onToggleLogin, onToggleKeyboard, onToggleHelp, toggleDarkMode, cycleSoundMode, showLoginModal, showKeyboardModal, showHelpModal, onToggleLoopMode]);
}

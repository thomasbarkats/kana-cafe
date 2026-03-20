import { createContext, useContext, useState, useRef } from 'react';
import { GAME_STATES, APP_MODES, SORT_MODES, GAME_MODES } from '../constants';
import { useDataKana } from '../hooks';
import { usePreferences } from './PreferencesContext';


const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { kanaData, loading: kanaLoading, error: kanaError } = useDataKana();
  const { updatePreferences, defaultAppMode } = usePreferences();

  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [gameMode, setGameMode] = useState('');
  const [appMode, setAppMode] = useState(defaultAppMode);

  // Current item & input
  const [currentItem, setCurrentItem] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const currentItemStartRef = useRef(null);

  // Feedback skip mechanism
  const feedbackTimeoutRef = useRef(null);
  const feedbackProceedFnRef = useRef(null);

  // Feedback progress bar state
  const [feedbackProgressDuration, setFeedbackProgressDuration] = useState(0);
  const [feedbackProgressActive, setFeedbackProgressActive] = useState(false);
  const [feedbackPaused, setFeedbackPaused] = useState(false);
  const feedbackPausedRef = useRef(false);
  const feedbackTimeoutStartRef = useRef(null);
  const feedbackRemainingRef = useRef(null);

  const skipFeedback = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }

    window.speechSynthesis?.cancel();

    setFeedbackProgressActive(false);
    feedbackPausedRef.current = false;
    setFeedbackPaused(false);
    feedbackTimeoutStartRef.current = null;
    feedbackRemainingRef.current = null;

    if (feedbackProceedFnRef.current) {
      feedbackProceedFnRef.current(true);
    }
  };

  const pauseFeedback = () => {
    if (feedbackPaused) return;

    // Calculate remaining time
    let remaining = feedbackProgressDuration;
    if (feedbackTimeoutStartRef.current) {
      const elapsed = Date.now() - feedbackTimeoutStartRef.current;
      remaining = Math.max(0, feedbackProgressDuration - elapsed);
    }
    feedbackRemainingRef.current = remaining;

    // Clear any active timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    feedbackTimeoutStartRef.current = null;

    window.speechSynthesis?.cancel();
    feedbackPausedRef.current = true;
    setFeedbackPaused(true);
  };

  const resumeFeedback = () => {
    if (!feedbackPaused) return;

    feedbackPausedRef.current = false;
    setFeedbackPaused(false);

    const remaining = feedbackRemainingRef.current;
    if (remaining > 0 && feedbackProceedFnRef.current) {
      if (!feedbackProgressActive) {
        // Paused before progress bar started (during speech phase)
        setFeedbackProgressDuration(remaining);
        setFeedbackProgressActive(true);
      }
      feedbackTimeoutStartRef.current = Date.now();
      feedbackTimeoutRef.current = setTimeout(feedbackProceedFnRef.current, remaining);
    }
  };

  // Progress & stats
  const [progress, setProgress] = useState({});
  const [sessionStats, setSessionStats] = useState({});
  const [sortBy, setSortBy] = useState(SORT_MODES.FAILURES);
  const [startTime, setStartTime] = useState(null);
  const [stoppedEarly, setStoppedEarly] = useState(false);

  // Expected count for review mode skeleton loading (kanji only - vocabulary uses its own context)
  const [reviewExpectedCountKanji, setReviewExpectedCountKanji] = useState(0);

  // Mode switching
  const updateAppMode = (appMode) => {
    setAppMode(appMode);
    updatePreferences({ defaultAppMode: appMode });
  };

  const switchToVocabulary = () => updateAppMode(APP_MODES.VOCABULARY);
  const switchToKana = () => updateAppMode(APP_MODES.KANA);
  const switchToKanji = () => updateAppMode(APP_MODES.KANJI);

  const openReviewKana = () => setGameState(GAME_STATES.REVIEW);
  const openReviewKanji = (expectedCount = 0) => {
    setReviewExpectedCountKanji(expectedCount);
    setGameMode(GAME_MODES.KANJI);
    setGameState(GAME_STATES.REVIEW);
  };

  const value = {
    // Data
    kanaData,
    kanaLoading,
    kanaError,

    // Game state
    gameState,
    setGameState,
    gameMode,
    setGameMode,
    appMode,
    updateAppMode,

    // Current item
    currentItem,
    setCurrentItem,
    userInput,
    setUserInput,
    feedback,
    setFeedback,
    currentItemStartRef,

    // Feedback skip
    feedbackTimeoutRef,
    feedbackProceedFnRef,
    skipFeedback,

    // Feedback progress bar
    feedbackProgressDuration,
    setFeedbackProgressDuration,
    feedbackProgressActive,
    setFeedbackProgressActive,
    feedbackPaused,
    feedbackPausedRef,
    setFeedbackPaused,
    pauseFeedback,
    resumeFeedback,
    feedbackTimeoutStartRef,

    // Progress
    progress,
    setProgress,
    sessionStats,
    setSessionStats,
    sortBy,
    setSortBy,
    startTime,
    setStartTime,
    stoppedEarly,
    setStoppedEarly,

    // Review
    reviewExpectedCountKanji,

    // Actions
    switchToVocabulary,
    switchToKana,
    switchToKanji,
    openReviewKana,
    openReviewKanji,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};

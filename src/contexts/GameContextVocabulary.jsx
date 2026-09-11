import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { GAME_STATES, GAME_MODES } from '../constants';
import { useDataVocabulary } from '../hooks';
import { useFavoritesManagement } from '../hooks/useFavoritesManagement';
import { vocabularyAPI } from '../services/apiService';
import { useAuth } from './AuthContext';
import { useGameContext } from './GameContext';
import { usePreferences } from './PreferencesContext';


const GameContextVocabulary = createContext();

export const VocabularyGameProvider = ({ children }) => {
  const { translationLanguage } = usePreferences();
  const { isAuthenticated } = useAuth();
  const { gameState, setGameMode, setGameState } = useGameContext();
  const {
    vocabularyLists,
    loading: vocabularyListsLoading,
    refresh: refreshVocabularyLists,
  } = useDataVocabulary(translationLanguage, isAuthenticated);
  const previousGameStateRef = useRef(gameState);

  // Vocabulary-specific selections
  const [wordsSelectedLists, setWordsSelectedLists] = useState([]);
  const [currentVocabularyWords, setCurrentVocabularyWords] = useState([]);

  // Track which words in current session are favorites (word ID -> boolean)
  const [sessionFavoritesVocabulary, setSessionFavoritesVocabulary] = useState(new Map());

  // Local override for vocabularyLists metadata (to update counts without refetching)
  const [vocabularyListsOverrides, setVocabularyListsOverrides] = useState({});

  // Cache for loaded words by selection (key = sorted listIds + lang)
  const [wordsCache, setWordsCache] = useState({});

  // Expected count for review mode skeleton loading
  const [reviewExpectedCount, setReviewExpectedCount] = useState(0);

  useEffect(() => {
    if (gameState === GAME_STATES.MENU) {
      const emptyPersonalLists = ['favorites', 'random'].filter(id => {
        const count = vocabularyListsOverrides[id]?.count ?? vocabularyLists[id]?.count ?? 0;
        return count === 0;
      });
      if (emptyPersonalLists.some(id => wordsSelectedLists.includes(id))) {
        setWordsSelectedLists(prev => prev.filter(id => !emptyPersonalLists.includes(id)));
      }
    }
  }, [gameState, vocabularyLists, vocabularyListsOverrides, wordsSelectedLists]);

  useEffect(() => {
    if (gameState === GAME_STATES.MENU && previousGameStateRef.current !== GAME_STATES.MENU) {
      refreshVocabularyLists();
    }
    previousGameStateRef.current = gameState;
  }, [gameState, refreshVocabularyLists]);

  // Review mode
  const openReviewVocabulary = (lists, expectedCount = 0) => {
    setWordsSelectedLists(lists);
    setReviewExpectedCount(expectedCount);
    setGameMode(GAME_MODES.VOCABULARY);
    setGameState(GAME_STATES.REVIEW);
  };

  // Favorites management using shared hook
  const { addToFavorites, removeFromFavorites, toggleFavorite } = useFavoritesManagement({
    api: vocabularyAPI,
    isAuthenticated,
    gameState,
    lists: vocabularyLists,
    selectedLists: wordsSelectedLists,
    setSelectedLists: setWordsSelectedLists,
    sessionFavorites: sessionFavoritesVocabulary,
    setSessionFavorites: setSessionFavoritesVocabulary,
    listsOverrides: vocabularyListsOverrides,
    setListsOverrides: setVocabularyListsOverrides,
    setCache: setWordsCache,
  });

  const value = {
    // Data
    vocabularyLists,
    vocabularyListsLoading,

    // Vocabulary selections
    wordsSelectedLists,
    setWordsSelectedLists,
    currentVocabularyWords,
    setCurrentVocabularyWords,

    // Actions
    openReviewVocabulary,

    // Review
    reviewExpectedCount,

    // Favorites
    sessionFavoritesVocabulary,
    setSessionFavoritesVocabulary,
    vocabularyListsOverrides,
    addVocabularyToFavorites: addToFavorites,
    removeVocabularyFromFavorites: removeFromFavorites,
    toggleVocabularyFavorite: toggleFavorite,

    // Cache
    wordsCache,
    setWordsCache,
  };

  return (
    <GameContextVocabulary.Provider value={value}>
      {children}
    </GameContextVocabulary.Provider>
  );
};

export const useGameContextVocabulary = () => {
  const context = useContext(GameContextVocabulary);
  if (!context) {
    throw new Error('useGameContextVocabulary must be used within VocabularyGameProvider');
  }
  return context;
};

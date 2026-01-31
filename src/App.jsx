import { HelpCircle, Keyboard, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { GAME_STATES, APP_MODES, GAME_MODES } from './constants';
import { useGameContext } from './contexts/GameContext';
import { useGameContextKanji } from './contexts/GameContextKanji';
import { useGameContextVocabulary } from './contexts/GameContextVocabulary';
import { useTranslation } from './contexts/I18nContext';
import { usePreferences } from './contexts/PreferencesContext';
import { useAuth } from './contexts/AuthContext';
import { useKeyboardNavigation, useKeyboardShortcuts } from './hooks';
import { getSortedStats } from './services/statsService';
import {
  GameMenuKana,
  GamePlay,
  Summary,
  GameMenuVocabulary,
  GameMenuKanji,
  FloatingHelpButton,
  ReviewVocabulary,
  ReviewKana,
  ReviewKanji,
  ProfileButton,
  MobileWarning,
  ServerErrorModal,
  FloatingButtonsContainer,
  BuyMeACoffeeButton,
  KeyboardKey,
} from './components';
import {
  useGameActions,
  useGameLogicVocabulary,
  useGameLogicKana,
  useGameLogicKanji,
} from './hooks';


function App() {
  const { t } = useTranslation();
  const { kanjiSelectedLists } = useGameContextKanji();
  const { wordsSelectedLists, currentVocabularyWords } = useGameContextVocabulary();
  const {
    gameState,
    appMode,
    gameMode,
    sessionStats,
    sortBy,
  } = useGameContext();
  const {
    kanaLoopMode,
    vocabularyLoopMode,
    kanjiLoopMode,
    handleKanaLoopModeChange,
    handleVocabularyLoopModeChange,
    handleKanjiLoopModeChange
  } = usePreferences();
  const { isAuthenticated } = useAuth();
  const profileButtonRef = useRef(null);
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useKeyboardNavigation();

  const toggleLoginModal = () => {
    if (!isAuthenticated) {
      setShowLoginModal(!showLoginModal);
    }
  };

  const toggleKeyboardModal = () => {
    setShowKeyboardModal(!showKeyboardModal);
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  useKeyboardShortcuts({
    onToggleLogin: toggleLoginModal,
    onToggleKeyboard: toggleKeyboardModal,
    onToggleHelp: toggleHelpModal,
    onToggleLoopMode: () => {
      switch (appMode) {
        case APP_MODES.KANA:
          handleKanaLoopModeChange(!kanaLoopMode);
          break;
        case APP_MODES.VOCABULARY:
          handleVocabularyLoopModeChange(!vocabularyLoopMode);
          break;
        case APP_MODES.KANJI:
          handleKanjiLoopModeChange(!kanjiLoopMode);
          break;
      }
    },
    showLoginModal,
    showKeyboardModal,
    showHelpModal
  });

  const { initializeKanaGame } = useGameLogicKana();
  const { initializeVocabularyGame } = useGameLogicVocabulary();
  const { initializeKanjiGame } = useGameLogicKanji();
  const { clearGameData } = useGameActions();


  const KeyboardButton = (
    <div className="relative group">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0 w-12 h-12 pointer-events-none flex items-center justify-center">
        <KeyboardKey keyLabel="K" position="left" />
      </div>
      <FloatingHelpButton
        icon={Keyboard}
        tooltip={t('tooltips.jpKeyboardHelp')}
        title={t('keyboardHelp.title')}
        show={showKeyboardModal}
        onToggle={toggleKeyboardModal}
      >
        <div>
          <h4 className="font-medium mb-1">{t('keyboardHelp.windowsTitle')}</h4>
          <ol className="text-sm list-decimal list-inside space-y-0.5">
            <li>{t('keyboardHelp.windowsStep1')}</li>
            <li>{t('keyboardHelp.windowsStep2')}</li>
            <li>{t('keyboardHelp.windowsStep3')}</li>
            <li>{t('keyboardHelp.windowsStep4')}</li>
          </ol>
        </div>

        <div>
          <h4 className="font-medium mb-1">{t('keyboardHelp.quickTipsTitle')}</h4>
          <ul className="text-sm space-y-1">
            <li>• {t('keyboardHelp.tip1')}</li>
            <li>• {t('keyboardHelp.tip2')}</li>
            <li>• {t('keyboardHelp.tip3')}</li>
            <li>• {t('keyboardHelp.tip4')}</li>
          </ul>
        </div>
      </FloatingHelpButton>
    </div>
  );

  const renderContent = () => {
    switch (gameState) {
      case GAME_STATES.MENU:
        switch (appMode) {
          case APP_MODES.KANA:
            return (<>
              <GameMenuKana />
              <FloatingButtonsContainer>
                <BuyMeACoffeeButton />
                <div ref={profileButtonRef}>
                  <ProfileButton showLegalButton showLoginModal={showLoginModal} onToggleLoginModal={toggleLoginModal} />
                </div>
              </FloatingButtonsContainer>
            </>);
          case APP_MODES.VOCABULARY:
            return (<>
              <GameMenuVocabulary />
              <FloatingButtonsContainer>
                <BuyMeACoffeeButton />
                {KeyboardButton}
                <div className="relative group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0 w-12 h-12 pointer-events-none flex items-center justify-center">
                    <KeyboardKey keyLabel="H" position="left" />
                  </div>
                  <FloatingHelpButton
                    icon={HelpCircle}
                    tooltip={t('tooltips.inputRulesHelp')}
                    title={t('inputRulesHelp.vocabularyTitle')}
                    show={showHelpModal}
                    onToggle={toggleHelpModal}
                  >
                    <div>
                      <h4 className="font-medium mb-2">{t('inputRulesHelp.vocabularyJapaneseTitle')}</h4>
                      <p className="text-sm">{t('inputRulesHelp.vocabularyJapaneseDesc')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t('inputRulesHelp.vocabularyTranslationsTitle')}</h4>
                      <p className="text-sm">{t('inputRulesHelp.vocabularyTranslationsDesc')}</p>
                    </div>
                  </FloatingHelpButton>
                </div>
                <div ref={profileButtonRef}>
                  <ProfileButton showLoginModal={showLoginModal} onToggleLoginModal={toggleLoginModal} />
                </div>
              </FloatingButtonsContainer>
            </>);
          case APP_MODES.KANJI:
            return (<>
              <GameMenuKanji />
              <FloatingButtonsContainer>
                <BuyMeACoffeeButton />
                {KeyboardButton}
                <div className="relative group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0 w-12 h-12 pointer-events-none flex items-center justify-center">
                    <KeyboardKey keyLabel="H" position="left" />
                  </div>
                  <FloatingHelpButton
                    icon={HelpCircle}
                    tooltip={t('tooltips.inputRulesHelp')}
                    title={t('inputRulesHelp.kanjiTitle')}
                    show={showHelpModal}
                    onToggle={toggleHelpModal}
                  >
                    <div>
                      <h4 className="font-medium mb-2">{t('inputRulesHelp.kanjiReadingsTitle')}</h4>
                      <p className="text-sm">{t('inputRulesHelp.kanjiReadingsDesc')}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">{t('inputRulesHelp.kanjiMeaningsTitle')}</h4>
                      <p className="text-sm">{t('inputRulesHelp.kanjiMeaningsDesc')}</p>
                    </div>
                  </FloatingHelpButton>
                </div>
                <div ref={profileButtonRef}>
                  <ProfileButton showLoginModal={showLoginModal} onToggleLoginModal={toggleLoginModal} />
                </div>
              </FloatingButtonsContainer>
            </>);
          default:
            return null;
        }

      case GAME_STATES.PLAYING:
        return <GamePlay />;

      case GAME_STATES.SUMMARY:
        return (
          <Summary
            onNewSession={clearGameData}
            onRestartSameMode={() => {
              switch (gameMode) {
                case GAME_MODES.VOCABULARY:
                  initializeVocabularyGame(wordsSelectedLists);
                  break;
                case GAME_MODES.KANJI:
                  initializeKanjiGame(kanjiSelectedLists);
                  break;
                default:
                  initializeKanaGame(gameMode);
              }
            }}
            sortedStats={getSortedStats(sessionStats, sortBy, currentVocabularyWords)}
          />
        );

      case GAME_STATES.REVIEW:
        switch (appMode) {
          case APP_MODES.KANA:
            return <ReviewKana />;
          case APP_MODES.VOCABULARY:
            return <ReviewVocabulary />;
          case APP_MODES.KANJI:
            return <ReviewKanji />;
          default:
            return null;
        }

      default:
        return null;
    }
  };

  return (
    <>
      <MobileWarning />
      <ServerErrorModal />
      {renderContent()}
    </>
  );
}

export default App;

import { Download, Info, Keyboard, SpellCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GAME_STATES, APP_MODES, GAME_MODES, STORAGE_KEYS } from './constants';
import { useGameContext } from './contexts/GameContext';
import { useGameContextKanji } from './contexts/GameContextKanji';
import { useGameContextVocabulary } from './contexts/GameContextVocabulary';
import { useTranslation } from './contexts/I18nContext';
import { usePreferences } from './contexts/PreferencesContext';
import { useAuth } from './contexts/AuthContext';
import { useInstallApp, useIsMobile, useKeyboardNavigation, useKeyboardShortcuts } from './hooks';
import { getSortedStats } from './services/statsService';
import {
  GameMenuKana,
  GamePlay,
  Summary,
  GameMenuVocabulary,
  GameMenuKanji,
  ReviewVocabulary,
  ReviewKana,
  ReviewKanji,
  ProfileButton,
  RotateDeviceOverlay,
  ServerErrorModal,
  KeyboardHelpContent,
  InstallAppContent,
  LanguageMenu,
  HelpMenu,
  HelpModal,
  LegalModal,
  SideButton,
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
    theme,
    kanaLoopMode,
    vocabularyLoopMode,
    kanjiLoopMode,
    handleKanaLoopModeChange,
    handleVocabularyLoopModeChange,
    handleKanjiLoopModeChange
  } = usePreferences();
  const { isAuthenticated } = useAuth();
  const [showKeyboardModal, setShowKeyboardModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const { canInstall, hasNativePrompt, promptInstall } = useInstallApp();

  useKeyboardNavigation();

  useEffect(() => {
    const pendingLogin = localStorage.getItem(STORAGE_KEYS.PENDING_GOOGLE_LOGIN);
    if (pendingLogin && !isAuthenticated) {
      localStorage.removeItem(STORAGE_KEYS.PENDING_GOOGLE_LOGIN);
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const toggleLoginModal = () => {
    if (!isAuthenticated) {
      if (showLoginModal) {
        localStorage.removeItem(STORAGE_KEYS.PENDING_GOOGLE_LOGIN);
      }
      setShowLoginModal(!showLoginModal);
    }
  };

  const toggleKeyboardModal = () => {
    setShowKeyboardModal(!showKeyboardModal);
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  // Android Chrome hands over its native dialog; elsewhere (iOS) the modal lists the steps
  const toggleInstallModal = () => {
    if (!showInstallModal && hasNativePrompt) {
      promptInstall();
      return;
    }
    setShowInstallModal(!showInstallModal);
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


  const isKanjiMode = appMode === APP_MODES.KANJI;
  const isMobile = useIsMobile();

  const helpMenu = (
    <HelpMenu items={[
      { icon: Keyboard, label: t('helpMenu.keyboard'), keyLabel: 'K', onClick: toggleKeyboardModal },
      { icon: SpellCheck, label: t('helpMenu.inputRules'), keyLabel: 'H', onClick: toggleHelpModal },
    ]} />
  );

  const installButton = canInstall && (
    <SideButton icon={Download} tooltip={t('tooltips.installApp')} onClick={toggleInstallModal} />
  );

  const accountButton = (
    <ProfileButton showLoginModal={showLoginModal} onToggleLoginModal={toggleLoginModal} />
  );

  // Rendered apart from the side buttons: those unmount when the mobile burger closes,
  // which a tap inside an open modal would otherwise trigger.
  const menuModals = (
    <>
      <HelpModal show={showKeyboardModal} onClose={toggleKeyboardModal} title={t('keyboardHelp.title')}>
        <KeyboardHelpContent />
      </HelpModal>

      <HelpModal
        show={showHelpModal}
        onClose={toggleHelpModal}
        title={t(isKanjiMode ? 'inputRulesHelp.kanjiTitle' : 'inputRulesHelp.vocabularyTitle')}
      >
        {isKanjiMode ? (
          <>
            <div>
              <h4 className="font-medium mb-2">{t('inputRulesHelp.kanjiReadingsTitle')}</h4>
              <p className="text-sm">{t('inputRulesHelp.kanjiReadingsDesc')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t('inputRulesHelp.kanjiMeaningsTitle')}</h4>
              <p className="text-sm">{t('inputRulesHelp.kanjiMeaningsDesc')}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h4 className="font-medium mb-2">{t('inputRulesHelp.vocabularyJapaneseTitle')}</h4>
              <p className="text-sm">{t('inputRulesHelp.vocabularyJapaneseDesc')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t('inputRulesHelp.vocabularyTranslationsTitle')}</h4>
              <p className="text-sm">{t('inputRulesHelp.vocabularyTranslationsDesc')}</p>
            </div>
          </>
        )}
      </HelpModal>

      <HelpModal show={showInstallModal} onClose={toggleInstallModal} title={t('installApp.title')}>
        <InstallAppContent />
      </HelpModal>

      <LegalModal show={showLegalModal} onClose={() => setShowLegalModal(false)} theme={theme} />
    </>
  );

  const renderContent = () => {
    switch (gameState) {
      case GAME_STATES.MENU:
        switch (appMode) {
          case APP_MODES.KANA:
            return (
              <GameMenuKana accountButton={accountButton} sideButtons={<>
                {installButton}
                {isMobile && <LanguageMenu />}
                {!isAuthenticated && (
                  <SideButton icon={Info} tooltip={t('legal.menuItem')} onClick={() => setShowLegalModal(true)} />
                )}
              </>} />
            );
          case APP_MODES.VOCABULARY:
            return (
              <GameMenuVocabulary accountButton={accountButton} sideButtons={<>
                {installButton}
                {isMobile && <LanguageMenu />}
                {helpMenu}
              </>} />
            );
          case APP_MODES.KANJI:
            return (
              <GameMenuKanji accountButton={accountButton} sideButtons={<>
                {installButton}
                {isMobile && <LanguageMenu />}
                {helpMenu}
              </>} />
            );
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
      <RotateDeviceOverlay />
      <ServerErrorModal />
      {renderContent()}
      {gameState === GAME_STATES.MENU && menuModals}
    </>
  );
}

export default App;

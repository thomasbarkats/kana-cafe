import { Globe, Repeat2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { REQUIRED_SUCCESSES_LIMITS } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { KeyboardKey } from './KeyboardKey';
import { LanguageSettingsContent } from './LanguageSettingsContent';
import { ThemeModeButton } from './ThemeModeButton';


export const MenuControls = ({
  theme,
  cycleSoundMode,
  getSoundModeIcon,
  requiredSuccesses,
  onRequiredSuccessesChange,
  showLoopMode = false,
  loopMode = false,
  onLoopModeChange = null
}) => {
  const { effectiveUiLanguage } = usePreferences();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageMenu]);



  return (
    <div className="mt-6 lg:mt-8 flex flex-wrap gap-y-3 justify-between items-center">
      <div className="flex items-center space-x-2">

        <div className="relative group">
          <button
            onClick={() => cycleSoundMode()}
            className={`p-2 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer`}
            title={getSoundModeIcon().tooltip}
          >
            {getSoundModeIcon().icon}
          </button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 pointer-events-none flex items-center justify-center">
            <KeyboardKey keyLabel="M" position="below" />
          </div>
        </div>

        <ThemeModeButton keyPosition="below" />

        {/* On the mobile layout the language settings live in the burger */}
        {!isMobile && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className={`p-2 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer`}
              title={t('settings.languageSettings')}
            >
              <div className="flex items-center gap-1">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium">{effectiveUiLanguage.toUpperCase()}</span>
              </div>
            </button>

            {showLanguageMenu && (
              <div className={`absolute bottom-full mb-2 right-0 ${theme.selectorBg} ${theme.text} rounded-lg shadow-xl w-[240px] border ${theme.border} overflow-hidden`}>
                <div className="px-4 py-3 space-y-4">
                  <LanguageSettingsContent />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <label className={`text-xs lg:text-sm font-medium ${theme.textSecondary}`}>
          {t('menu.repetitions')}
        </label>
        <div className="flex items-center space-x-1">
          <input
            type="number"
            min={REQUIRED_SUCCESSES_LIMITS.MIN}
            max={REQUIRED_SUCCESSES_LIMITS.MAX}
            value={requiredSuccesses}
            onChange={onRequiredSuccessesChange}
            className={`${theme.inputBg} ${theme.border} rounded-lg px-1 py-2 w-12 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${theme.text}`}
          />
          {showLoopMode && (
            <div className="relative group">
              <button
                onClick={() => onLoopModeChange?.(!loopMode)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${loopMode ? theme.buttonActive : theme.buttonSecondary}`}
                title={t('tooltips.loopMode')}
              >
                <Repeat2 className="w-5 h-5" />
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 pointer-events-none flex items-center justify-center">
                <KeyboardKey keyLabel="R" position="below" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

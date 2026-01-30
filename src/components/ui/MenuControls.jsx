import { Sun, Moon, Globe, Repeat2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LANGUAGES, REQUIRED_SUCCESSES_LIMITS } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Select } from './Select';


export const MenuControls = ({
  theme,
  darkMode,
  toggleDarkMode,
  cycleSoundMode,
  getSoundModeIcon,
  requiredSuccesses,
  onRequiredSuccessesChange,
  showLoopMode = false,
  loopMode = false,
  onLoopModeChange = null
}) => {
  const { translationLanguage, uiLanguage, effectiveUiLanguage, handleTranslationLanguageChange, handleUiLanguageChange } = usePreferences();
  const { t } = useTranslation();
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
    <div className="mt-8 flex justify-between items-center">
      <div className="flex items-center space-x-2">

        <button
          onClick={() => cycleSoundMode()}
          className={`p-2 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer`}
          title={getSoundModeIcon().tooltip}
        >
          {getSoundModeIcon().icon}
        </button>

        <button
          onClick={toggleDarkMode}
          className={`p-2 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer`}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

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
                {/* Translation Language */}
                <div>
                  <div className={`text-xs font-medium ${theme.textSecondary} mb-2`}>
                    {t('settings.translationLanguage')}
                  </div>
                  <Select
                    value={translationLanguage}
                    onChange={handleTranslationLanguageChange}
                    options={[
                      { value: LANGUAGES.FR, label: 'Français' },
                      { value: LANGUAGES.EN, label: 'English' }
                    ]}
                    translateLabels={false}
                    className="w-full"
                  />
                </div>

                {/* UI Language */}
                <div>
                  <div className={`text-xs font-medium ${theme.textSecondary} mb-2`}>
                    {t('settings.uiLanguage')}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUiLanguageChange('auto')}
                      className={`
                        w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2
                        ${uiLanguage === 'auto'
                          ? `${theme.inputBg} ${theme.text} shadow-sm ${theme.inputBorder}`
                          : `${theme.sectionBg} ${theme.textSecondary} ${theme.selectorHover} border-transparent`
                        }
                      `}
                    >
                      {translationLanguage === LANGUAGES.FR ? 'Auto. (Traductions)' : 'Auto. (Translations)'}
                    </button>
                    <button
                      onClick={() => handleUiLanguageChange(LANGUAGES.JP)}
                      className={`
                        w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2
                        ${uiLanguage === LANGUAGES.JP
                          ? `${theme.inputBg} ${theme.text} shadow-sm ${theme.inputBorder}`
                          : `${theme.sectionBg} ${theme.textSecondary} ${theme.selectorHover} border-transparent`
                        }
                      `}
                    >
                      {t('languages.jp')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className={`text-sm font-medium ${theme.textSecondary}`}>
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
            <button
              onClick={() => onLoopModeChange && onLoopModeChange(!loopMode)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${loopMode
                  ? `${theme.buttonSecondaryBg} ${theme.textSecondary} ${theme.selectorHover}`
                  : `${theme.buttonSecondary}`
                }`}
              title={t('tooltips.loopMode')}
            >
              <Repeat2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

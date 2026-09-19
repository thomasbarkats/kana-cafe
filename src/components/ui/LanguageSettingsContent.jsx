import { LANGUAGES } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Select } from './Select';


export const LanguageSettingsContent = () => {
  const { theme, translationLanguage, uiLanguage, handleTranslationLanguageChange, handleUiLanguageChange } = usePreferences();
  const { t } = useTranslation();

  const getUiLanguageClasses = (value) => `
    w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2 cursor-pointer
    ${uiLanguage === value
      ? `${theme.inputBg} ${theme.text} shadow-sm ${theme.inputBorder}`
      : `${theme.sectionBg} ${theme.textSecondary} ${theme.selectorHover} border-transparent`
    }
  `;

  return (
    <>
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

      <div>
        <div className={`text-xs font-medium ${theme.textSecondary} mb-2`}>
          {t('settings.uiLanguage')}
        </div>
        <div className="space-y-2">
          <button onClick={() => handleUiLanguageChange('auto')} className={getUiLanguageClasses('auto')}>
            {translationLanguage === LANGUAGES.FR ? 'Auto. (Traductions)' : 'Auto. (Translations)'}
          </button>
          <button onClick={() => handleUiLanguageChange(LANGUAGES.JP)} className={getUiLanguageClasses(LANGUAGES.JP)}>
            {t('languages.jp')}
          </button>
        </div>
      </div>
    </>
  );
};

import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';


export const EscapeKey = () => {
  const { t } = useTranslation();
  const { theme } = usePreferences();

  return (
    <div className={`px-2 py-1 text-xs ${theme.textMuted} border ${theme.border} rounded cursor-default opacity-90`}>
      {t('gameplay.escapeKey')}
    </div>
  );
};

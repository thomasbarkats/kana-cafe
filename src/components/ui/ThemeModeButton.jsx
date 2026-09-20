import { Sun, Moon } from 'lucide-react';
import { THEME_MODES } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { KeyboardKey } from './KeyboardKey';


const TOOLTIP_KEYS = {
  [THEME_MODES.AUTO]: 'gameplay.switchToAutoMode',
  [THEME_MODES.LIGHT]: 'gameplay.switchToLightMode',
  [THEME_MODES.DARK]: 'gameplay.switchToDarkMode',
};

export const ThemeModeButton = ({ keyPosition }) => {
  const { t } = useTranslation();
  const { theme, darkMode, themeMode, nextThemeMode, cycleThemeMode } = usePreferences();

  return (
    <div className="relative group">
      <button
        onClick={cycleThemeMode}
        className={`p-2 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer`}
        title={t(TOOLTIP_KEYS[nextThemeMode])}
      >
        <span className="relative block w-5 h-5">
          {darkMode
            ? <Moon className="w-5 h-5" />
            : <Sun className="w-5 h-5" />
          }
          {themeMode === THEME_MODES.AUTO && (
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-full ${theme.cardBg} text-[10px] font-bold leading-none`}>A</span>
          )}
        </span>
      </button>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 pointer-events-none flex items-center justify-center">
        <KeyboardKey keyLabel="L" position={keyPosition} />
      </div>
    </div>
  );
};

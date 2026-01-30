import { ChevronDown } from 'lucide-react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useTranslation } from '../../contexts/I18nContext';


export const Select = ({ value, onChange, options, translateLabels = true, className = '' }) => {
  const { theme } = usePreferences();
  const { t } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full px-4 py-2 pr-10 rounded-xl border-2 ${theme.inputBorder} ${theme.inputBg} ${theme.text} cursor-pointer hover:border-blue-400 transition-colors focus:outline-none focus:border-blue-500`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {translateLabels ? t(option.label) : option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={`w-5 h-5 ${theme.textMuted} absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50`} />
    </div>
  );
};

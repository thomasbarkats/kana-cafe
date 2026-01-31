import { usePreferences } from '../../contexts/PreferencesContext';


export const KeyboardKey = ({ keyLabel, position = 'below' }) => {
  const { theme } = usePreferences();

  const positionClasses = {
    below: 'absolute top-full mt-1 left-1/2 -translate-x-1/2',
    above: 'absolute bottom-full mb-1 left-1/2 -translate-x-1/2',
    left: 'absolute left-0 -translate-x-full -ml-2 top-1/2 -translate-y-1/2',
    inline: '',
  };

  return (
    <div
      className={`px-2 py-1 text-xs ${theme.textMuted} border ${theme.border} rounded cursor-default opacity-90 ${positionClasses[position]} pointer-events-none z-[100] whitespace-nowrap`}
      style={{ userSelect: 'none' }}
    >
      {keyLabel}
    </div>
  );
};

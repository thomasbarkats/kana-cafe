import { usePreferences } from '../../contexts/PreferencesContext';


export const SideButton = ({ icon: Icon, tooltip, onClick }) => {
  const { theme } = usePreferences();

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-2xl w-12 h-12 ${theme.sideButton} ${theme.text} shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none`}
      title={tooltip}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

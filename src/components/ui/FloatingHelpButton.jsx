import { usePreferences } from '../../contexts/PreferencesContext';
import { HelpModal } from './HelpModal';


export const FloatingHelpButton = ({ icon: Icon, tooltip, title, children, show, onToggle }) => {
  const { theme } = usePreferences();

  return (
    <>
      <button
        onClick={onToggle}
        className={`p-3 rounded-full w-12 h-12 ${theme.buttonPrimaryBg} ${theme.text} shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center`}
        title={tooltip}
      >
        <Icon className="w-5 h-5" />
      </button>

      <HelpModal
        show={show}
        onClose={onToggle}
        title={title}
      >
        {children}
      </HelpModal>
    </>
  );
};

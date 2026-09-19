import { HelpCircle } from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { KeyboardKey } from './KeyboardKey';
import { SideButton } from './SideButton';
import { SideMenu } from './SideMenu';


// Grouped behind one button on desktop; the burger already is a menu, so on mobile
// the entries are laid out flat instead of nesting a submenu.
export const HelpMenu = ({ items }) => {
  const { t } = useTranslation();
  const { theme } = usePreferences();
  const isMobile = useIsMobile();

  if (isMobile) {
    return items.map((item) => (
      <SideButton key={item.label} icon={item.icon} tooltip={item.label} onClick={item.onClick} />
    ));
  }

  return (
    <SideMenu icon={HelpCircle} tooltip={t('helpMenu.title')}>
      {(close) => (
        <div className="py-1">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                close();
                item.onClick();
              }}
              className={`w-full px-4 py-2.5 flex items-center gap-3 ${theme.selectorHover} transition-colors text-left cursor-pointer`}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              <KeyboardKey keyLabel={item.keyLabel} position="inline" />
            </button>
          ))}
        </div>
      )}
    </SideMenu>
  );
};

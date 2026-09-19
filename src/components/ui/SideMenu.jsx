import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';
import { SideButton } from './SideButton';


// Desktop side button with a dropdown opening upwards. Stacked above the neighbouring side
// buttons, which come later in the DOM. Children may be a function receiving close().
export const SideMenu = ({ icon, tooltip, children }) => {
  const { theme } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div ref={menuRef} className="relative">
      <SideButton icon={icon} tooltip={tooltip} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className={`absolute bottom-full mb-2 right-0 z-10 ${theme.selectorBg} ${theme.text} rounded-lg shadow-xl min-w-[240px] border ${theme.border} overflow-hidden`}>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
};

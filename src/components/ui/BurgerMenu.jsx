import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';

// Mobile home for the buttons that flank the card on desktop: pinned to the screen corner,
// outside the card, revealing them as a column on tap. `leading` stays visible on its left
// (the account button, whose own dropdown can't nest inside this menu).
export const BurgerMenu = ({ leading, children }) => {
  const { t } = useTranslation();
  const { theme } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const reactInsideRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    // React events bubble through portals: a tap in a modal opened from the menu reaches
    // onMouseDownCapture before this document listener, and must not close (unmount) it.
    const handleClickOutside = (event) => {
      const isInside = reactInsideRef.current || menuRef.current?.contains(event.target);
      reactInsideRef.current = false;
      if (!isInside) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-20 bg-black/20" />}

      <div className="fixed top-4 right-4 z-30 flex items-start gap-2">
        {leading}

        <div
          ref={menuRef}
          onMouseDownCapture={() => { reactInsideRef.current = true; }}
          className="flex flex-col items-end gap-2"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-12 h-12 p-3 rounded-2xl ${theme.sideButton} ${theme.text} shadow-lg transition-all cursor-pointer flex items-center justify-center focus:outline-none`}
            title={t('tooltips.menu')}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {isOpen && (
            <div className="flex flex-col items-end gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

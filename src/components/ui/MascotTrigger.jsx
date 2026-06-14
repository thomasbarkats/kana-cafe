import { createContext, useContext } from 'react';

// Marker classes watched by Mascot.jsx: she peeks out while a HOVER element is hovered, or while
// an ACTIVE element is in the DOM. Not configurable — the names are hardcoded in the group-has
// selectors of Mascot's PEEK_OUT_CLASSES (Tailwind needs the literal strings).
export const MASCOT_TRIGGER = {
  HOVER: 'mascot-trigger',
  ACTIVE: 'mascot-trigger-active'
};

// Holds GameMenu's triggerExit so menu buttons can make the mascot react before navigating
const MascotContext = createContext(null);

export const MascotProvider = MascotContext.Provider;

// Falls back to a passthrough outside a menu (mascot hidden there)
export const useMascotTrigger = () => useContext(MascotContext) ?? ((action) => action?.());

// <button> that plays the mascot exit animation before running onActivate
export const MascotTrigger = ({ onActivate, mood, disabled, onClick, ...props }) => {
  const triggerExit = useMascotTrigger();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled) triggerExit(onActivate, mood);
      }}
      {...props}
    />
  );
};

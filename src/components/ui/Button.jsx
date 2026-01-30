import { usePreferences } from '../../contexts/PreferencesContext';


export const Button = ({ onClick, disabled, children, variant = 'primary', className = '' }) => {
  const { theme } = usePreferences();

  const baseClasses = "font-semibold h-11 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer";

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
    success: "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700",
    danger: "bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700",
    ghost: `hover:opacity-80 border ${theme.border} ${theme.text}`
  };


  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

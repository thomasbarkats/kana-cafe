import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { EscapeKey } from './EscapeKey';
import { Button } from './Button';


export const StopGameModal = ({ isOpen, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const { theme, darkMode } = usePreferences();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`${theme.cardBg} rounded-2xl shadow-2xl max-w-md w-full p-6 relative`}>
        <div className="absolute top-4 right-6">
          <EscapeKey />
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${darkMode ? 'bg-orange-500/20' : 'bg-orange-100'} rounded-full mb-4`}>
            <AlertCircle className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>

          <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
            {t('stopGame.title')}
          </h2>

          <p className={`text-base ${theme.textSecondary} mb-6`}>
            {t('stopGame.message')}
          </p>

          <div className="flex gap-3">
            <Button onClick={onCancel} variant="ghost" className="flex-1 h-12">
              {t('stopGame.cancel')}
            </Button>
            <Button onClick={onConfirm} variant="danger" className="flex-1 h-12">
              {t('stopGame.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

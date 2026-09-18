import { RotateCw, Smartphone } from 'lucide-react';
import { LANDSCAPE_MEDIA_QUERY } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// Not dismissible: rotating the device is the fix, and the overlay clears itself
export const RotateDeviceOverlay = () => {
  const { t } = useTranslation();
  const { theme } = usePreferences();
  const isLandscape = useMediaQuery(LANDSCAPE_MEDIA_QUERY);

  if (!isLandscape) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 ${theme.bg}`}>
      <div className="text-center max-w-sm">
        <div className="relative inline-flex items-center justify-center mb-4">
          <Smartphone className={`w-12 h-12 ${theme.text}`} />
          <RotateCw className={`w-6 h-6 ${theme.textSecondary} absolute -right-5 -top-2`} />
        </div>

        <h2 className={`text-xl font-bold ${theme.text} mb-2`}>
          {t('rotateDevice.title')}
        </h2>

        <p className={`text-sm ${theme.textSecondary}`}>
          {t('rotateDevice.message')}
        </p>
      </div>
    </div>
  );
};

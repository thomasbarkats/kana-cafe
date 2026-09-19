import { MOBILE_PLATFORMS } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { getMobilePlatform } from '../../utils/deviceHelper';

const STEP_NUMBERS = [1, 2, 3];

export const InstallAppContent = () => {
  const { t } = useTranslation();
  const prefix = getMobilePlatform() === MOBILE_PLATFORMS.ANDROID ? 'android' : 'ios';

  return (
    <>
      <p className="text-sm">{t('installApp.intro')}</p>
      <div>
        <h4 className="font-medium mb-1">{t(`installApp.${prefix}Title`)}</h4>
        <ol className="text-sm list-decimal list-inside space-y-0.5">
          {STEP_NUMBERS.map((n) => <li key={n}>{t(`installApp.${prefix}Step${n}`)}</li>)}
        </ol>
      </div>
    </>
  );
};

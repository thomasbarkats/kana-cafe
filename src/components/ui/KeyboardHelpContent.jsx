import { MOBILE_PLATFORMS } from '../../constants';
import { useTranslation } from '../../contexts/I18nContext';
import { getMobilePlatform } from '../../utils/deviceHelper';

const STEP_NUMBERS = [1, 2, 3, 4];

const Steps = ({ title, prefix, t }) => (
  <div>
    <h4 className="font-medium mb-1">{title}</h4>
    <ol className="text-sm list-decimal list-inside space-y-0.5">
      {STEP_NUMBERS.map((n) => <li key={n}>{t(`keyboardHelp.${prefix}Step${n}`)}</li>)}
    </ol>
  </div>
);

// Driven by the detected OS rather than the viewport: a narrow desktop window still
// needs the IME instructions, and a phone can never follow them.
export const KeyboardHelpContent = () => {
  const { t } = useTranslation();
  const platform = getMobilePlatform();

  if (platform) {
    const prefix = platform === MOBILE_PLATFORMS.ANDROID ? 'android' : 'ios';

    return (
      <>
        <div>
          <h4 className="font-medium mb-1">{t('keyboardHelp.noKeyboardTitle')}</h4>
          <p className="text-sm">{t('keyboardHelp.noKeyboard')}</p>
        </div>
        <Steps title={t(`keyboardHelp.${prefix}Title`)} prefix={prefix} t={t} />
      </>
    );
  }

  return (
    <>
      <Steps title={t('keyboardHelp.windowsTitle')} prefix="windows" t={t} />

      <div>
        <h4 className="font-medium mb-1">{t('keyboardHelp.quickTipsTitle')}</h4>
        <ul className="text-sm space-y-1">
          {STEP_NUMBERS.map((n) => <li key={n}>• {t(`keyboardHelp.tip${n}`)}</li>)}
        </ul>
      </div>
    </>
  );
};

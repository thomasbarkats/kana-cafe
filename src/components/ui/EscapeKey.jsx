import { useTranslation } from '../../contexts/I18nContext';
import { KeyboardKey } from './KeyboardKey';


export const EscapeKey = () => {
  const { t } = useTranslation();

  return <KeyboardKey keyLabel={t('gameplay.escapeKey')} position="inline" />;
};

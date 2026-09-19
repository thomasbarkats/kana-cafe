import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { HelpModal } from './HelpModal';
import { LanguageSettingsContent } from './LanguageSettingsContent';
import { SideButton } from './SideButton';


// Mobile burger entry: the desktop layout keeps the language dropdown in MenuControls
export const LanguageMenu = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <SideButton icon={Globe} tooltip={t('settings.languageSettings')} onClick={() => setShowModal(true)} />
      <HelpModal show={showModal} onClose={() => setShowModal(false)} title={t('settings.languageSettings')}>
        <LanguageSettingsContent />
      </HelpModal>
    </>
  );
};

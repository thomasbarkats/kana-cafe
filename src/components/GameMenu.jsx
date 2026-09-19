import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { APP_MODES, MASCOT_GRIN_LEAD_MS, MASCOT_MOODS, MASCOT_NAV_DELAY_MS, MASCOT_VARIANTS } from '../constants';
import { useTranslation } from '../contexts/I18nContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { BurgerMenu } from './ui/BurgerMenu';
import { CenteredLayout } from './ui/CenteredLayout';
import { Mascot } from './ui/Mascot';
import { MASCOT_TRIGGER, MascotProvider } from './ui/MascotTrigger';


export const GameMenu = ({
  theme,
  children,
  title,
  subtitle,
  onPrevious,
  onNext,
  previousTooltip,
  nextTooltip,
  currentMode,
  onModeChange,
  sideButtons,
  accountButton
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [mascot, setMascot] = useState({ mood: MASCOT_MOODS.HAPPY, reacting: false, exiting: false });

  // Expression change + recoil, then slide under the card, then navigate mid-slide.
  // Skipped below lg where the mascot perches on top instead of gripping a side edge.
  const triggerExit = useCallback((action, mood = MASCOT_MOODS.GRIN) => {
    if (isMobile) {
      action?.();
      return;
    }
    setMascot({ mood, reacting: true, exiting: false });
    setTimeout(() => setMascot({ mood, reacting: true, exiting: true }), MASCOT_GRIN_LEAD_MS);
    setTimeout(() => action?.(), MASCOT_GRIN_LEAD_MS + MASCOT_NAV_DELAY_MS);
  }, [isMobile]);

  const modes = [
    { key: APP_MODES.KANA, labelJa: 'かな', labelEn: t('modes.kana') },
    { key: APP_MODES.KANJI, labelJa: '漢字', labelEn: t('modes.kanji') },
    { key: APP_MODES.VOCABULARY, labelJa: '語彙', labelEn: t('modes.vocabulary') }
  ];

  const currentIndex = modes.findIndex(mode => mode.key === currentMode);
  const otherModes = [
    modes[(currentIndex + 1) % modes.length],
    modes[(currentIndex + 2) % modes.length]
  ];

  const mascotOnRight = currentMode === APP_MODES.VOCABULARY;

  return (
    <CenteredLayout className={`${theme.bg} -mb-8`}>
      <MascotProvider value={triggerExit}>
        {sideButtons && isMobile && <BurgerMenu leading={accountButton}>{sideButtons}</BurgerMenu>}

        <div className="relative flex flex-col items-center gap-4 group/menu w-full max-w-md lg:w-auto lg:max-w-none">
          {!isMobile && (
            <Mascot
              scale={1.25}
              side={mascotOnRight ? 'right' : 'left'}
              mood={mascot.mood}
              reacting={mascot.reacting}
              exiting={mascot.exiting}
              className="absolute top-24"
            />
          )}

          {/* No z-index here: the side buttons must stack above the mascot, outside the card's stacking context */}
          <div className="relative w-full lg:w-[28rem]">
            {sideButtons && !isMobile && (
              <div className="absolute left-full bottom-0 ml-4 z-30 flex flex-col-reverse gap-2 items-end mb-6">
                {sideButtons}
                {accountButton}
              </div>
            )}

            {/* Menu card */}
            <div className={`relative ${theme.cardBg} backdrop-blur-sm rounded-3xl shadow-2xl p-5 lg:p-8 w-full z-10`}>
              {isMobile && (
                <Mascot
                  variant={MASCOT_VARIANTS.TOP}
                  mood={mascot.mood}
                  className="absolute bottom-full left-1/2 -translate-x-1/2"
                />
              )}

              <div className="text-center mb-6 lg:mb-8 relative">
                {onPrevious && (
                  <button
                    onClick={onPrevious}
                    className={`absolute top-2 left-0 lg:top-4 lg:left-6 p-2 lg:p-3 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer ${MASCOT_TRIGGER.HOVER}`}
                    title={previousTooltip}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {onNext && (
                  <button
                    onClick={onNext}
                    className={`absolute top-2 right-0 lg:top-4 lg:right-6 p-2 lg:p-3 ${theme.buttonSecondary} rounded-full transition-colors cursor-pointer ${MASCOT_TRIGGER.HOVER}`}
                    title={nextTooltip}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                <h1 className={`text-3xl lg:text-4xl font-bold ${theme.text} mb-2 px-10 lg:px-0`}>{title}</h1>
                <p className={theme.textSecondary}>{subtitle}</p>
              </div>
              {children}
            </div>
          </div>

          {/* Other mode tabs below */}
          <div className="flex gap-3 z-0 w-full lg:w-[28rem]">
            {otherModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => onModeChange(mode.key)}
                className={`${theme.cardBg} backdrop-blur-sm rounded-2xl shadow-lg px-4 py-2 transition-all duration-200 cursor-pointer hover:scale-105 hover:opacity-100 opacity-80 flex-1 ${MASCOT_TRIGGER.HOVER}`}
              >
                <div className="text-center">
                  <div className={`text-lg font-bold ${theme.text}`}>
                    {mode.labelJa}
                  </div>
                  <div className={`text-md ${theme.textSecondary}`}>
                    {mode.labelEn}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </MascotProvider>
    </CenteredLayout>
  );
};

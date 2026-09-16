import { useEffect, useRef, useState } from 'react';
import { MASCOT_AHOGE, MASCOT_MOODS } from '../../constants';
import { usePreferences } from '../../contexts/PreferencesContext';
import { MASCOT_TRIGGER } from './MascotTrigger';

// How long the shocked reaction lasts after a click before reverting
const MASCOT_SHOCK_MS = 500;

// Illustration colors (artwork asset, independent from UI theme).
// ink: pupils and mouth. closedEye: grin eyes, drawn directly on the body
const PALETTES = {
  light: { body: '#26272C', bodyShade: '#101114', face: '#FFFFFF', ink: '#26272C', closedEye: '#FFFFFF' },
  dark: { body: '#33598E', bodyShade: '#253750', face: '#FFFFFF', ink: '#1F2A3D', closedEye: '#FFFFFF' }
};

// Runs down past the card edge (y > ~135 is hidden behind the card)
const BODY_PATH = 'M33 180 L33 98 C33 72 56 44 91 44 C126 44 149 72 149 98 L149 180 Z';

// Two feathers on top of the head; variants share PLAIN's bases
const TUFT_PATHS = {
  [MASCOT_AHOGE.PLAIN]: ['M85 48 Q80 38 88 31 Q88 40 93 48 Z', 'M91 48 Q95 38 104 35 Q97 41 99 48 Z'],
  [MASCOT_AHOGE.PERKY]: ['M85 48 Q79 36 87 27 Q88 38 93 48 Z', 'M91 48 Q95 35 106 31 Q98 39 99 48 Z'],
  [MASCOT_AHOGE.WILTED]: ['M85 48 Q81 40 78 36 Q87 38 93 48 Z', 'M91 48 Q97 39 105 39 Q99 42 99 48 Z'],
  [MASCOT_AHOGE.QUIVER]: ['M85 48 Q84 38 86 29 Q90 38 93 48 Z', 'M91 48 Q96 38 100 30 Q99 40 99 48 Z']
};

// Mirrored about the face centre (x=91) when flipped
const renderTuft = (colors, ahoge, flipped) => (
  <g fill={colors.body} transform={flipped ? 'matrix(-1 0 0 1 182 0)' : undefined}>
    {(TUFT_PATHS[ahoge] ?? TUFT_PATHS[MASCOT_AHOGE.PLAIN]).map((d) => <path key={d} d={d} />)}
  </g>
);

const EYE_Y = 102;
const EYE_XS = [60, 122];

// dy moves the pupils (sad looks down)
const renderRoundEyes = (colors, discR, pupilR, dy = 0) => EYE_XS.map((cx) => (
  <g key={cx}>
    <circle cx={cx} cy={EYE_Y} r={discR} fill={colors.face} />
    <circle cx={cx} cy={EYE_Y + dy} r={pupilR} fill={colors.ink} />
  </g>
));

const renderEyes = (colors, mood) => {
  switch (mood) {
    case MASCOT_MOODS.GRIN:
      // ^ ^ closed eyes
      return (
        <g fill="none" stroke={colors.closedEye} strokeWidth="4" strokeLinecap="round">
          {EYE_XS.map((cx) => <path key={cx} d={`M${cx - 8} ${EYE_Y + 4} Q${cx} ${EYE_Y - 7} ${cx + 8} ${EYE_Y + 4}`} />)}
        </g>
      );
    case MASCOT_MOODS.SAD:
      return renderRoundEyes(colors, 9.5, 4.5, 3);
    case MASCOT_MOODS.SHOCKED:
      return renderRoundEyes(colors, 11, 3);
    case MASCOT_MOODS.HAPPY:
    default:
      return renderRoundEyes(colors, 10, 4.5);
  }
};

const BEAK_PATH = 'M75 111 C75 104 83 101 91 101 C99 101 107 104 107 111 C107 118 99 121 91 121 C83 121 75 118 75 111 Z';

const renderMouth = (colors, mood) => {
  switch (mood) {
    case MASCOT_MOODS.GRIN:
      return <path d="M81 109 Q91 119 101 109 Z" fill={colors.ink} stroke={colors.ink} strokeWidth="2" strokeLinejoin="round" />;
    case MASCOT_MOODS.SAD:
      return <path d="M82 114 Q91 108 100 114" fill="none" stroke={colors.ink} strokeWidth="2.5" strokeLinecap="round" />;
    case MASCOT_MOODS.SHOCKED:
      return <ellipse cx="91" cy="111" rx="3.5" ry="4.5" fill={colors.ink} />;
    case MASCOT_MOODS.HAPPY:
    default:
      return <path d="M81 110 Q91 114 101 110" fill="none" stroke={colors.ink} strokeWidth="2.5" strokeLinecap="round" />;
  }
};

const AHOGE_BY_MOOD = {
  [MASCOT_MOODS.GRIN]: MASCOT_AHOGE.PERKY,
  [MASCOT_MOODS.SAD]: MASCOT_AHOGE.WILTED,
  [MASCOT_MOODS.SHOCKED]: MASCOT_AHOGE.QUIVER
  // happy falls through to the plain default
};

// Flipper tip folded over the card edge; the lower one is mirrored so both curl toward the head
const FLIPPER_PATH = 'M-10 4 C6 2 18 12 18 23 C18 31 12 35 6 33 C0 31 -4 35 -10 38 Z';

// Retracted by default; slides out when a MASCOT_TRIGGER class is hovered/active in the menu
// group. Retracting is delayed so it stays out between two close triggers.
const PEEK_OUT_CLASSES = 'transition-transform duration-200 ease-out delay-300 group-has-[.mascot-trigger:hover]/menu:translate-x-0 group-has-[.mascot-trigger:hover]/menu:delay-0 group-has-[.mascot-trigger-active]/menu:translate-x-0 group-has-[.mascot-trigger-active]/menu:delay-0';

const GrippingFlipper = ({ colors, lower = false, className, peekClass }) => (
  <svg width="20" height="34" viewBox="0 0 26 44" className={`absolute z-20 ${className}`}>
    {/* Flipper base starts outside the viewBox so it clips flat at the card edge */}
    <g className={peekClass}>
      <g transform={lower ? 'matrix(1 0 0 -1 0 44) rotate(10 0 22)' : 'rotate(10 0 22)'}>
        <path d={FLIPPER_PATH} transform="translate(1.5 1.5)" fill={colors.bodyShade} opacity="0.35" />
        <path d={FLIPPER_PATH} fill={colors.body} stroke={colors.bodyShade} strokeWidth="1" />
      </g>
    </g>
  </svg>
);

// Module scope so it survives the remount on each mode switch; the enter keyframe
// plays only when side actually changed since the previous mount.
let previousSide;

// side: which card edge it grips; 'right' mirrors the whole drawing (scaleX(-1)).
// alwaysVisible: skips the peek/hover mechanic (gameplay, where it's always out).
export const Mascot = ({ mood = MASCOT_MOODS.HAPPY, ahoge, scale = 1, side = 'left', reacting = false, exiting = false, alwaysVisible = false, className = '' }) => {
  const { darkMode } = usePreferences();
  const colors = darkMode ? PALETTES.dark : PALETTES.light;
  const flipped = side === 'right';
  const [animate] = useState(() => !alwaysVisible && previousSide !== undefined && previousSide !== side);
  useEffect(() => { previousSide = side; }, [side]);

  // Direct hover/click reactions, menus only (in gameplay its mood is parent-driven).
  // hover → GRIN, click → brief SHOCKED. Cleared when a navigation exit takes over.
  const interactive = !alwaysVisible;
  const [hovering, setHovering] = useState(false);
  const [shocked, setShocked] = useState(false);
  const shockTimer = useRef(null);
  useEffect(() => () => clearTimeout(shockTimer.current), []);
  useEffect(() => {
    if (exiting) { setHovering(false); setShocked(false); clearTimeout(shockTimer.current); }
  }, [exiting]);

  const handleShock = () => {
    if (!interactive) return;
    clearTimeout(shockTimer.current);
    setShocked(true);
    shockTimer.current = setTimeout(() => setShocked(false), MASCOT_SHOCK_MS);
  };

  const effectiveMood = shocked ? MASCOT_MOODS.SHOCKED : hovering ? MASCOT_MOODS.GRIN : mood;
  const ahogeType = ahoge ?? AHOGE_BY_MOOD[effectiveMood];

  // Intro: retracted → out (transition) → done (normal hover behavior).
  // Using transitions (not keyframes) so if a trigger is already hovered when 'done' fires,
  // its translate-x-0 naturally overrides the retracted position — no double-exit.
  const BASE_T = 'transition-transform duration-200 ease-out';
  const [introPhase, setIntroPhase] = useState(() => alwaysVisible ? 'done' : 'retracted');
  useEffect(() => {
    if (alwaysVisible) return;
    const raf = requestAnimationFrame(() => setIntroPhase('out'));
    const t = setTimeout(() => setIntroPhase('done'), 350);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Retracted offset keeps the mouth visible in front of the card edge (svg x=124)
  const svgPeekClass =
    introPhase === 'done' ? (alwaysVisible ? 'translate-x-0' : `translate-x-[16px] ${PEEK_OUT_CLASSES}`)
      : introPhase === 'out' ? `translate-x-0 ${BASE_T}`
        : `translate-x-[16px] ${BASE_T}`;

  const handPeekClass =
    introPhase === 'done' ? (alwaysVisible ? 'translate-x-0' : `-translate-x-[3px] ${PEEK_OUT_CLASSES}`)
      : introPhase === 'out' ? `translate-x-0 ${BASE_T}`
        : `-translate-x-[3px] ${BASE_T}`;

  const sideClass = flipped ? 'right-0' : '-left-[124px]';
  const animationClass = exiting
    ? (flipped ? 'animate-mascot-exit-right' : 'animate-mascot-exit-left')
    : animate ? (flipped ? 'animate-mascot-enter-right' : 'animate-mascot-enter-left') : '';

  return (
    <div
      className={['pointer-events-none select-none z-20', sideClass, animationClass, className].join(' ')}
      style={{
        '--mascot-scale': scale,
        transform: flipped ? `scale(${scale}) scaleX(-1)` : `scale(${scale})`,
        transformOrigin: 'top right'
      }}
      aria-hidden="true"
    >
      {/* Wrapper clips the head at the card edge (the card background is translucent).
          Extended 12px outward (negative margin + padding cancel out) so the feathers
          aren't cropped on the outer side during the recoil */}
      <div className="relative z-0 w-[136px] -ml-[12px] h-[150px] overflow-hidden">
        {/* Recoil moves only the head (flippers keep gripping); the svg is wider than the
            124px clip so it reveals more head instead of a gap at the card edge */}
        <div className={`pl-[12px] ${reacting ? 'animate-mascot-recoil' : ''}`}>
          <svg
            width="150" height="150" viewBox="0 0 150 150"
            className={`${svgPeekClass}${interactive ? ` ${MASCOT_TRIGGER.HOVER} pointer-events-auto cursor-pointer` : ''}`}
            onMouseEnter={interactive ? () => setHovering(true) : undefined}
            onMouseLeave={interactive ? () => setHovering(false) : undefined}
            onClick={handleShock}
          >
            {/* Head drawn upright, tilted -80deg as it leans out from behind the edge */}
            <g transform="translate(-24 150) rotate(-80)">
              {renderTuft(colors, ahogeType, flipped)}
              <path d={BODY_PATH} fill={colors.body} />

              {renderEyes(colors, effectiveMood)}
              <path d={BEAK_PATH} fill={colors.face} />
              {renderMouth(colors, effectiveMood)}
            </g>
          </svg>
        </div>
      </div>

      {/* Both flippers gripping the card edge, above and below the head */}
      <GrippingFlipper colors={colors} className="left-[124px] top-[2px]" peekClass={handPeekClass} />
      <GrippingFlipper colors={colors} lower className="left-[124px] top-[122px]" peekClass={handPeekClass} />
    </div>
  );
};

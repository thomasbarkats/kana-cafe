import { useEffect, useRef, useState } from 'react';
import { MASCOT_AHOGE, MASCOT_MOODS } from '../../constants';
import { MASCOT_TRIGGER } from './MascotTrigger';

// How long the shocked reaction lasts after a click before reverting
const MASCOT_SHOCK_MS = 500;

// Illustration colors (artwork asset, independent from UI theme)
const COLORS = {
  skin: '#FFE3CD',
  skinLine: '#D99A6C',
  hair: '#8C5A3C',
  hairShadow: '#74452C',
  hairHighlight: '#A8714B',
  ribbon: '#F48FB1',
  ribbonShadow: '#E91E63',
  iris: '#5B3A2A',
  line: '#4A2E20',
  blush: '#FFA8A8',
  mouth: '#D96A57'
};

// Open-eye irises with catchlights; size varies by mood
const renderIris = (rx, ry) => (
  <>
    <ellipse cx="71" cy="105" rx={rx} ry={ry} fill={COLORS.iris} />
    <ellipse cx="111" cy="105" rx={rx} ry={ry} fill={COLORS.iris} />
    <circle cx="68" cy="101" r="3.5" fill="white" />
    <circle cx="108" cy="101" r="3.5" fill="white" />
    <circle cx="75" cy="110" r="1.5" fill="white" opacity="0.8" />
    <circle cx="115" cy="110" r="1.5" fill="white" opacity="0.8" />
  </>
);

const renderEyes = (mood) => {
  switch (mood) {
    case MASCOT_MOODS.GRIN:
      // ^_^ closed, happily curved-up eyes, no irises
      return (
        <g fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round">
          <path d="M61 101 Q71 110 81 101" />
          <path d="M101 101 Q111 110 121 101" />
        </g>
      );
    case MASCOT_MOODS.SAD:
      // Worried brows slanting up toward the nose
      return (
        <g>
          <path d="M61 91 Q72 86 82 84" fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round" />
          <path d="M121 91 Q110 86 100 84" fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round" />
          {renderIris(9.5, 12)}
        </g>
      );
    case MASCOT_MOODS.SHOCKED:
      // Raised brows and wider irises
      return (
        <g>
          <path d="M60 86 Q71 78 82 86" fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round" />
          <path d="M100 86 Q111 78 122 86" fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round" />
          {renderIris(11, 14)}
        </g>
      );
    case MASCOT_MOODS.HAPPY:
    default:
      return (
        <g>
          <path d="M60 95 Q71 86 82 95" fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round" />
          <path d="M100 95 Q111 86 122 95" fill="none" stroke={COLORS.line} strokeWidth="4" strokeLinecap="round" />
          {renderIris(9.5, 12)}
        </g>
      );
  }
};

const renderMouth = (mood) => {
  switch (mood) {
    case MASCOT_MOODS.GRIN:
      // Wide open beaming smile
      return <path d="M79 120 Q91 141 103 120 Z" fill={COLORS.mouth} stroke={COLORS.mouth} strokeWidth="2" strokeLinejoin="round" />;
    case MASCOT_MOODS.SAD:
      // Downturned frown (the happy smile mirrored)
      return <path d="M83 126 Q91 117 99 126 Q91 122 83 126 Z" fill={COLORS.mouth} stroke={COLORS.mouth} strokeWidth="2" strokeLinejoin="round" />;
    case MASCOT_MOODS.SHOCKED:
      // Small round gasp
      return <ellipse cx="91" cy="128" rx="5.5" ry="7" fill={COLORS.mouth} />;
    case MASCOT_MOODS.HAPPY:
    default:
      return <path d="M83 123 Q91 133 99 123 Q91 127 83 123 Z" fill={COLORS.mouth} stroke={COLORS.mouth} strokeWidth="2" strokeLinejoin="round" />;
  }
};

// Variants share PLAIN's upright base so they read as one strand in different states.
const AHOGE_PATHS = {
  [MASCOT_AHOGE.PLAIN]: 'M88 33 Q82 17 97 11 Q90 21 96 33 Z',
  [MASCOT_AHOGE.PERKY]: 'M88 33 Q82 16 98 8 Q90 20 96 33 Z',
  [MASCOT_AHOGE.WILTED]: 'M88 33 Q83 16 101 16 Q92 22 96 33 Z',
  [MASCOT_AHOGE.QUIVER]: 'M88 33 Q82 15 95 10 L101 5 L96 12 Q93 18 96 33 Z'
};

// Stray strand on top of the head. When flipped, mirrored about the face centre (x=91)
// so its root/tip orientation follows the side swap.
const renderAhoge = (ahoge, flipped) => (
  <path
    d={AHOGE_PATHS[ahoge] ?? AHOGE_PATHS[MASCOT_AHOGE.PLAIN]}
    fill={COLORS.hair}
    transform={flipped ? 'matrix(-1 0 0 1 182 0)' : undefined}
  />
);

const AHOGE_BY_MOOD = {
  [MASCOT_MOODS.GRIN]: MASCOT_AHOGE.PERKY,
  [MASCOT_MOODS.SAD]: MASCOT_AHOGE.WILTED,
  [MASCOT_MOODS.SHOCKED]: MASCOT_AHOGE.QUIVER
  // happy falls through to the plain default
};

// Ribbon on whichever bun ends up screen-top: left bun normally, right bun when flipped.
// Coordinates mirrored about the face centre (x=91).
const renderRibbon = (flipped) => {
  const [cx, wingOuter, wingInner] = flipped ? [132, 147, 117] : [50, 35, 65];
  return (
    <g>
      <path d={`M${cx} 52 L${wingOuter} 44 L${flipped ? 143 : 39} 60 Z`} fill={COLORS.ribbon} />
      <path d={`M${cx} 52 L${wingInner} 44 L${flipped ? 121 : 61} 60 Z`} fill={COLORS.ribbon} />
      <circle cx={cx} cy="52" r="4.5" fill={COLORS.ribbonShadow} />
    </g>
  );
};

const HANDS = {
  right: {
    path: 'M-10 3 L7 3 A4 4 0 0 1 7 11 L3 11 L10 11 A4 4 0 0 1 10 19 L3 19 L9 19 A4 4 0 0 1 9 27 L3 27 L5 27 A4 4 0 0 1 5 35 L-10 35 Z',
    separators: 'M3 11 L7.5 11 M3 19 L8 19 M3 27 L6 27'
  },
  // Same fingers in mirrored order
  left: {
    path: 'M-10 3 L5 3 A4 4 0 0 1 5 11 L3 11 L9 11 A4 4 0 0 1 9 19 L3 19 L10 19 A4 4 0 0 1 10 27 L3 27 L7 27 A4 4 0 0 1 7 35 L-10 35 Z',
    separators: 'M3 11 L6 11 M3 19 L8 19 M3 27 L7.5 27'
  }
};

// Retracted by default; slides out when a MASCOT_TRIGGER class is hovered/active in the menu
// group. Retracting is delayed so she stays out between two close triggers.
const PEEK_OUT_CLASSES = 'transition-transform duration-200 ease-out delay-300 group-has-[.mascot-trigger:hover]/menu:translate-x-0 group-has-[.mascot-trigger:hover]/menu:delay-0 group-has-[.mascot-trigger-active]/menu:translate-x-0 group-has-[.mascot-trigger-active]/menu:delay-0';

const GrippingHand = ({ hand, className, peekClass }) => (
  <svg width="20" height="34" viewBox="0 0 26 44" className={`absolute z-20 ${className}`}>
    {/* Hand base starts outside the viewBox so it clips flat at the card edge */}
    <g className={peekClass}>
      <g transform="rotate(10 0 22)">
        <path d={HANDS[hand].path} transform="translate(1.5 1.5)" fill={COLORS.skinLine} opacity="0.35" />
        <path d={HANDS[hand].path} fill={COLORS.skin} stroke={COLORS.skinLine} strokeWidth="1" />
        <path d={HANDS[hand].separators} stroke={COLORS.skinLine} strokeWidth="1.2" strokeLinecap="round" opacity="0.9" fill="none" />
      </g>
    </g>
  </svg>
);

// Module scope so it survives the remount on each mode switch; the enter keyframe
// plays only when side actually changed since the previous mount.
let previousSide;

// side: which card edge she grips; 'right' mirrors the whole drawing (scaleX(-1)).
// alwaysVisible: skips the peek/hover mechanic (gameplay, where she's always out).
export const Mascot = ({ mood = MASCOT_MOODS.HAPPY, ahoge, scale = 1, side = 'left', reacting = false, exiting = false, alwaysVisible = false, className = '' }) => {
  const flipped = side === 'right';
  const [animate] = useState(() => !alwaysVisible && previousSide !== undefined && previousSide !== side);
  useEffect(() => { previousSide = side; }, [side]);

  // Direct hover/click reactions, menus only (in gameplay her mood is parent-driven).
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

  const svgPeekClass =
    introPhase === 'done' ? (alwaysVisible ? 'translate-x-0' : `translate-x-[28px] ${PEEK_OUT_CLASSES}`)
      : introPhase === 'out' ? `translate-x-0 ${BASE_T}`
        : `translate-x-6 ${BASE_T}`;

  const handPeekClass =
    introPhase === 'done' ? (alwaysVisible ? 'translate-x-0' : `-translate-x-[5px] ${PEEK_OUT_CLASSES}`)
      : introPhase === 'out' ? `translate-x-0 ${BASE_T}`
        : `-translate-x-[5px] ${BASE_T}`;

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
          Extended 12px outward (negative margin + padding cancel out) so the ahoge
          isn't cropped on the outer side during the recoil */}
      <div className="relative z-0 w-[136px] -ml-[12px] h-[150px] overflow-hidden">
        {/* Recoil moves only the head (hands keep gripping); the svg is wider than the
            124px clip so it reveals more hair instead of a gap at the card edge */}
        <div className={`pl-[12px] ${reacting ? 'animate-mascot-recoil' : ''}`}>
          <svg
            width="150" height="150" viewBox="0 0 150 150"
            className={`${svgPeekClass}${interactive ? ` ${MASCOT_TRIGGER.HOVER} pointer-events-auto cursor-pointer` : ''}`}
            onMouseEnter={interactive ? () => setHovering(true) : undefined}
            onMouseLeave={interactive ? () => setHovering(false) : undefined}
            onClick={handleShock}
          >
            {/* Head drawn upright, tilted -80deg as she leans out from behind the edge */}
            <g transform="translate(-24 150) rotate(-80)">
              {/* Back hair (bob cut) */}
              <path d="M33 98 C33 20 149 20 149 98 L149 147 Q149 153 143 153 L39 153 Q33 153 33 147 Z" fill={COLORS.hairShadow} />

              {/* Face */}
              <ellipse cx="91" cy="92" rx="54" ry="52" fill={COLORS.skin} />

              <ellipse cx="55" cy="120" rx="8" ry="4.5" fill={COLORS.blush} opacity="0.6" />
              <ellipse cx="127" cy="120" rx="8" ry="4.5" fill={COLORS.blush} opacity="0.6" />
              {renderEyes(effectiveMood)}
              {renderMouth(effectiveMood)}

              {/* Bangs underlayer: darker strands between the main ones */}
              <path d="M56 70 Q57 79 60 86 Q63 78 64 71 Z" fill={COLORS.hairShadow} />
              <path d="M87 64 Q88 76 91 84 Q94 75 95 65 Z" fill={COLORS.hairShadow} />
              <path d="M104 62 Q105 73 109 81 Q112 72 114 63 Z" fill={COLORS.hairShadow} />
              <path d="M121 66 Q122 77 126 85 Q129 76 131 67 Z" fill={COLORS.hairShadow} />

              {/* Bangs */}
              <path
                d="M37 92 Q33 38 91 33 Q149 38 145 92 Q141 64 132 81 Q124 60 116 78 Q111 56 100 75 Q94 59 87 79 Q80 56 70 81 Q60 66 51 83 Q44 71 37 92 Z"
                fill={COLORS.hair}
              />
              <path d="M91 33 Q96 43 92 56" fill="none" stroke={COLORS.hairHighlight} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M60 38 Q58 47 60 57" fill="none" stroke={COLORS.hairHighlight} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M118 40 Q121 48 118 56" fill="none" stroke={COLORS.hairHighlight} strokeWidth="2.5" strokeLinecap="round" />

              {/* Ahoge */}
              {renderAhoge(ahogeType, flipped)}

              {/* Hair buns */}
              <circle cx="45" cy="38" r="16" fill={COLORS.hair} />
              <path d="M33 32 Q45 24 57 32" fill="none" stroke={COLORS.hairShadow} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="137" cy="38" r="16" fill={COLORS.hair} />
              <path d="M125 32 Q137 24 149 32" fill="none" stroke={COLORS.hairShadow} strokeWidth="2.5" strokeLinecap="round" />
              {renderRibbon(flipped)}
            </g>
          </svg>
        </div>
      </div>

      {/* Both hands gripping the card edge, above and below the head */}
      <GrippingHand hand="right" className="left-[124px] top-[2px]" peekClass={handPeekClass} />
      <GrippingHand hand="left" className="left-[124px] top-[122px]" peekClass={handPeekClass} />
    </div>
  );
};

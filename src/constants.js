export const APP_MODES = {
  KANA: 'kana',
  KANJI: 'kanji',
  VOCABULARY: 'vocabulary'
};

export const LANGUAGES = {
  FR: 'fr',
  EN: 'en',
  JP: 'jp'
};

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  SUMMARY: 'summary',
  REVIEW: 'review'
};

export const GAME_MODES = {
  HIRAGANA: 'hiragana',
  KATAKANA: 'katakana',
  BOTH: 'both',
  VOCABULARY: 'vocabulary',
  KANJI: 'kanji'
};

export const KANA_TYPES = {
  DAKUTEN: 'dakuten',
  COMBINATION: 'combination'
};

export const KANA_INCLUSION = {
  OFF: 'off',
  ADD: 'add',
  ONLY: 'only'
};

export const SORT_MODES = {
  FAILURES: 'failures',
  ALPHABETICAL: 'alphabetical',
  TIME: 'time',
  DEFAULT: 'default',
  STROKES: 'strokes'
};

export const VOCABULARY_MODES = {
  TO_JAPANESE: 'to_japanese',
  FROM_JAPANESE: 'from_japanese',
  SOUND_ONLY: 'sound_only'
};

export const KANJI_MODES = {
  ALL: 'all',
  MEANINGS_ONLY: 'meanings_only'
};

export const SOUND_MODES = {
  BOTH: 'both',
  NONE: 'none',
  SPEECH_ONLY: 'speech_only'
};

export const FEEDBACK_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error'
};

export const MASCOT_MOODS = {
  HAPPY: 'happy',
  SAD: 'sad',
  GRIN: 'grin',
  SHOCKED: 'shocked'
};

// Ahoge: stray strand on top of the head, set independently of the mood.
export const MASCOT_AHOGE = {
  PLAIN: 'plain',
  PERKY: 'perky',
  WILTED: 'wilted',
  QUIVER: 'quiver'
};

// MascotTrigger click timing (slide duration lives in index.css)
export const MASCOT_GRIN_LEAD_MS = 80;   // expression change before the slide starts
export const MASCOT_NAV_DELAY_MS = 200;  // into the slide before navigating

// Session failures on an item past which getting it right is a "comeback" (SHOCKED, not GRIN)
export const MASCOT_COMEBACK_FAILURES = 2;

export const REQUIRED_SUCCESSES_LIMITS = {
  MIN: 1,
  MAX: 10
};

export const TIMING = {
  INPUT_FOCUS_DELAY: 100,
  SUCCESS_FEEDBACK_DELAY: 500,
  ERROR_FEEDBACK_DELAY: 2000
};

export const TINT_CONFIG = {
  MAX_ALPHA: 0.20,
  FAILURE_MULTIPLIER: 0.05,
  ERROR_WEIGHT: 0.6,
  TIME_WEIGHT: 0.4,
  COLORS: {
    RED: { r: 255, g: 0, b: 0 },
    PURPLE: { r: 128, g: 0, b: 128 }
  }
};

export const SPEECH_CONFIG = {
  JAPANESE: {
    lang: 'ja-JP',
    rate: 1.0,
    pitch: 1.25,
    volume: 1.0,
    // Preferred on-device female voices by name, ordered by quality across
    // platforms (first installed match wins). Falls back to the browser
    // default if none are available.
    preferredVoices: [
      'Kyoko',            // macOS / iOS
      'Microsoft Nanami', // Windows / Edge (neural)
      'Microsoft Ayumi',  // Windows
      'Microsoft Haruka', // Windows
      'Microsoft Sayaka'  // Windows
    ]
  }
};

export const KANJI_STEPS = {
  KUN_READINGS: 1,
  ON_READINGS: 2,
  MEANINGS: 3
};

// Progress tracking API types
export const ITEM_TYPES = {
  KANJI: 'kanji',
  VOCABULARY: 'vocabulary',
  KANA: 'kana',
};

// Maps kanji step numbers to progress type strings
export const KANJI_PROGRESS_TYPES = {
  [KANJI_STEPS.KUN_READINGS]: 'kun_readings',
  [KANJI_STEPS.ON_READINGS]: 'on_readings',
  [KANJI_STEPS.MEANINGS]: 'meanings',
};

export const STORAGE_KEYS = {
  PENDING_GOOGLE_LOGIN: 'pendingGoogleLogin',
};

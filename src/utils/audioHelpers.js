import { SOUND_MODES, SPEECH_CONFIG } from '../constants';


// ============================================
// SPEECH SYNTHESIS
// ============================================

const isSpeechSupported = () => {
  return 'speechSynthesis' in window;
};

const selectJapaneseVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  for (const name of SPEECH_CONFIG.JAPANESE.preferredVoices) {
    const match = voices.find((voice) => voice.localService && voice.name.includes(name));
    if (match) return match;
  }
  return null;
};

const createJapaneseUtterance = (text, rate) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_CONFIG.JAPANESE.lang;
  utterance.rate = rate || SPEECH_CONFIG.JAPANESE.rate;
  utterance.pitch = SPEECH_CONFIG.JAPANESE.pitch;
  utterance.volume = SPEECH_CONFIG.JAPANESE.volume;

  const voice = selectJapaneseVoice();
  if (voice) utterance.voice = voice;

  return utterance;
};

export const speakReading = (text, rate, onComplete) => {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis not supported');
    if (onComplete) onComplete();
    return;
  }

  speechSynthesis.cancel();

  const utterance = createJapaneseUtterance(text, rate);

  if (onComplete) {
    utterance.onend = onComplete;
    utterance.onerror = onComplete;
  }

  speechSynthesis.speak(utterance);
};

// ============================================
// SOUND EFFECTS
// ============================================

export const playFeedbackSound = (type, soundMode) => {
  if (soundMode === SOUND_MODES.BOTH) {
    try {
      new Audio(`/sounds/${type}.mp3`).play();
    } catch (error) {
      console.warn('Could not play audio:', error);
    }
  }
};

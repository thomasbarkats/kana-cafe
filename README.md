# カナカフェ (Kana Cafe)

A React-based Japanese learning application for practicing hiragana, katakana, kanji, and vocabulary.

## Game Specificities

### Kana Mode
- Practice hiragana and katakana characters
- Optional dakuten (゛゜) and combination characters (きゃ, しゅ, etc.)
- Audio pronunciation

### Vocabulary Mode
- Thematic word lists for progressive Japanese learning
- **Bidirectional translation**: Your language → Japanese or Japanese → your language
- **Sound mode**: Audio-only challenges (listen and type in Japanese)
- Furigana display when needed
- Audio pronunciation

### Kanji Mode
- Thematic kanji lists for step-by-step progression
- **Reading groups**: Kanji readings and their related meanings are grouped together for exhaustiveness. Only obsolete or non-productive readings and meanings are ignored.
- **Multi-step validation**: Three-step input flow
  1. Enter all kun readings (訓読み) or skip
  2. Enter all on readings (音読み) or skip
  3. Enter all meanings with accumulated readings displayed (in order of reading groups)
- **Meanings-only mode**: Skip directly to meaning input
- Comma-separated input for multiple readings/meanings
- Accepts romaji input for readings
- Audio pronunciation

### Review Mode
Browse all characters/words in selected list(s) without playing.

### Progress Tracking
Through successes and errors, your mastery score is tracked for:
- Each kana character
- Each vocabulary word in each training mode
- Each kanji's kun readings, on readings, and meanings

## Kanji Learning - Recommendation

Game's core principle may seem heavy at first. Finding / memorizing all the readings and meanings for each kanji is hard work. But forcing yourself through it—even though it takes time and long game sessions—is the best way to learn and memorize them correctly. Think of it as brain brute-force.

## Open Source & Contributions

**Frontend**: This repository contains the frontend code, which is open source. Contributions to improve gameplay, UI/UX, or features are welcome.

**Backend**: The backend is not publicly available. It handles premium features including progress tracking and unlocking additional word/kanji lists. Supporting the game helps fund this and other projects.

**Contributors**: If you contribute to the project, contact me to receive free unlimited access to all premium features.

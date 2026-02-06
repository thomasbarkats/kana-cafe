# CLAUDE.md

## Project Context

**Kana Cafe Web** - Japanese learning app (hiragana, katakana, kanji, vocabulary). Frontend handles all game logic, progress tracking, and session stats using spaced-repetition.

## Architecture

- **State management**: React Context (`src/contexts/`)
- **Styling**: Tailwind via theme system
- **i18n**: French/English/Japanese support (`src/i18n/`)
- **Game logic**: Custom hooks in `src/hooks/`
- **Constants**: Centralized in `src/constants.js`
- **Package manager**: pnpm ONLY

## Key Rules

**Theme System**
- NEVER hardcode colors - extract from `theme` (usePreferences hook)
- If color isn't in theme, ask user before adding

**i18n**
- NEVER hardcode text - use `t('key.path')` from useTranslation
- Add keys to all `src/i18n/*.json` files

**Constants**
- Use `src/constants.js`, never string literals

**Data Format**
- Furigana: `{kanji1}[reading1]{kanji2}[reading2]`etc in vocabulary data

## When Adding Features

- Study existing similar features before writing new code
- Match existing code style, naming conventions, file organization
- NEVER run commands (`pnpm dev`, etc.) without permission - user runs dev server by their own

## Code Quality Rules

- NEVER add redundant comments that repeat component/function names
- Remove ALL `console.log` before finalizing
- Follow existing patterns in the codebase

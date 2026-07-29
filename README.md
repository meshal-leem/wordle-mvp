# Wordle MVP

A complete, client-side Wordle game built with React, TypeScript, and Vite.

**Live app:** https://wordle-mvp.netlify.app/

## Run locally

Use Node.js 22:

```bash
nvm use
npm ci
npm run dev
```

Open http://localhost:5173.

Run all tests and build checks with:

```bash
npm run check
```

## Decision log

### MVP scope

The MVP supports a complete six-attempt game with physical and on-screen
keyboard input, guess validation, duplicate-letter scoring, colored feedback,
give up, answer reveal, and restart.

Guesses are validated locally against a predefined set of 14,855 five-letter
words. Answers are selected from a smaller list of familiar words so the game
does not choose an obscure answer.

### Key decisions

- **Client-side only:** the brief does not require accounts, shared progress, or
  cheating prevention, so a backend would not improve this MVP.
- **Random game:** each new game selects a random answer. A shared daily puzzle
  would require date rules and persistence that are outside this scope.
- **Two-pass scoring:** exact matches are reserved before misplaced letters are
  evaluated. This handles repeated letters without counting one answer letter
  more than once.
- **Fast input:** a guess is checked after its fifth letter. Invalid words stay
  editable, and confirmed green letters carry into the next row.

### Deliberately left out

Accounts, a shared daily puzzle, saved progress, statistics, result sharing,
themes, hints, and a backend.

### Known issues

- Refreshing starts a new game.
- Answers and word data are visible in the client bundle.
- The predefined dictionary may omit regional or newly coined words.
- Accessibility has not had a formal screen-reader audit.

### Day two

I would first add user accounts and server-validated game records. That
foundation would support:

1. A personal score history showing wins, attempts, and completion time.
2. Five timed games per user each day, enforced by the server.
3. A daily leaderboard ranked by wins, attempts used, and completion time.
4. Easy, medium, and hard modes using separate answer lists and rules.
5. A kids mode using simple three-letter words with optional image hints.

I would build the account and scoring foundation first, then the competitive
daily mode, and add difficulty and kids modes after validating the core loop.

### Time allocation

The focused build was split roughly across game rules and edge cases (40%),
interaction and responsive UI (35%), and tests, deployment, and documentation
(25%).

## Code map

- [`src/game/gameLogic.ts`](src/game/gameLogic.ts): all Wordle business rules.
- [`src/hooks/useWordle.ts`](src/hooks/useWordle.ts): React state and game flow.
- [`src/game/gameLogic.test.ts`](src/game/gameLogic.test.ts): business-rule tests.
- [`src/config/content.json`](src/config/content.json): all UI text.
- [`src/theme/colors.css`](src/theme/colors.css): all application colors.

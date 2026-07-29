# Wordly

A small, complete Wordle MVP built with React 19, TypeScript, and Vite.

## Run locally

Use Node.js 22:

```bash
nvm install
nvm use
npm ci
npm run dev
```

Open `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## MVP scope

Included:

- A random five-letter answer from a local list
- Six guesses
- Physical and on-screen keyboard input
- Enter and Backspace
- Length and dictionary validation
- Correct duplicate-letter scoring
- Green, amber, and gray tile feedback
- Keyboard status updates
- Win, loss, answer reveal, and restart
- Responsive layout and accessible labels/focus states

Deliberately excluded:

- Accounts or a backend
- A shared daily puzzle
- Saved progress and statistics
- Share results
- Hints, hard mode, themes, and animations
- A complete English dictionary

This line keeps the submission focused on a reliable full game rather than a
partially finished feature set.

## Structure

```text
src/
├── components/
│   ├── Board.tsx
│   └── Keyboard.tsx
├── game/
│   ├── evaluateGuess.ts
│   ├── evaluateGuess.test.ts
│   ├── keyboard.ts
│   ├── types.ts
│   └── words.ts
├── hooks/
│   └── useWordle.ts
├── App.tsx
├── main.tsx
└── styles.css
```

React components render the interface. `useWordle` owns state transitions.
Pure game rules live outside React so they can be read and tested independently.

## The non-obvious algorithm

A simple `answer.includes(letter)` implementation is wrong when letters repeat.
For example:

```text
Answer: APPLE
Guess:  PAPAL
Result: 🟨 🟨 🟩 ⬛ 🟨
```

The evaluator uses two passes:

1. Mark exact matches as correct.
2. Count only the unmatched letters remaining in the answer.
3. For each other guessed letter, mark it present only if a copy remains, then
   consume that copy.

This gives exact matches priority and prevents one answer letter from matching
multiple guessed copies. The implementation is `O(n)` time and `O(n)` space;
with five-letter words both are effectively constant.

## Decision log

### Frontend-only

The brief does not require a backend. Keeping the answer and dictionary in the
browser makes the app simple to run and deploy. The trade-off is that a user can
inspect the bundle and discover the answers. That is acceptable for this MVP,
but not for a cheating-resistant product.

### Random game instead of daily game

A new random answer is selected on page load and restart. A true daily game
needs decisions about dates, time zones, persistence, and sharing. Random play
makes the full loop easy to review without adding those concerns.

### Separate answer and guess lists

A `Set` provides direct, fast validation without a network dependency. Answers
come from a small list of familiar words, while guesses are checked against
8,636 five-letter ENABLE words. This avoids rejecting ordinary guesses without
ever selecting an obscure dictionary entry as the answer. ENABLE is public
domain; the bundled source and attribution are in
`src/game/validWords.txt`.

### One stateful hook

The application has one screen and one owner for its state. A custom hook keeps
game transitions together while components stay presentational. Redux, Context,
and a reducer would add indirection without solving a current problem.

### Test the risky logic

The scoring algorithm has focused tests, especially for duplicate letters.
There are no snapshots or broad end-to-end tests in this time-boxed MVP.

## Known issues before a real public launch

- English has no universally authoritative word list, so some regional,
  technical, or newly coined words may still be rejected.
- The answer list is visible in the client bundle.
- Refreshing loses the current game.
- Random selection is not a shared daily challenge.
- Accessibility is designed into semantics, focus, contrast, and touch targets,
  but has not had a formal screen-reader audit.
- Only the core scoring algorithm has automated coverage.

## Day two

In priority order:

1. Review dictionary feedback and add justified regional/common omissions.
2. Persist the active game in versioned local storage.
3. Add integration tests for keyboard input, win/loss, and restart.
4. Add a deterministic daily puzzle and shareable results.
5. Run a manual VoiceOver/NVDA accessibility review.

A backend would be considered only if cheating resistance, accounts, or
cross-device progress became a real requirement.

## Time allocation

The intended two-hour budget was divided approximately as follows:

- 15 minutes: scope and product decisions
- 30 minutes: game model and duplicate-letter algorithm
- 35 minutes: playable React UI and keyboard input
- 20 minutes: tests, accessibility pass, and edge cases
- 20 minutes: documentation, build verification, and deployment setup

## Deploy to Netlify

1. Push the repository to GitLab.
2. In Netlify, choose **Add new project → Import an existing project**.
3. Connect GitLab and select the private repository.
4. Deploy.

[`netlify.toml`](netlify.toml) configures:

```text
Build command: npm run build
Publish directory: dist
Node version: 22.17.0
```

No environment variables are required.

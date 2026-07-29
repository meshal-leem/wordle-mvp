# Wordle MVP

A small, complete Wordle MVP built with React 19, TypeScript, and Vite.

**Live app:** https://wordle-mvp.netlify.app/

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
npm run check

# Or run each gate separately:
npm test
npm run lint
npm run build
```

## MVP scope

Included:

- A random five-letter answer from a local list
- Six guesses
- Physical and on-screen keyboard input
- Automatic submission after the fifth letter, plus Enter and Backspace support
- Length validation and a predefined 14,855-word guess dictionary
- Correct duplicate-letter scoring
- Correctly placed letters carry into the next guess automatically
- Green, amber, and gray tile feedback
- Keyboard status updates
- Win, loss, Give Up, answer reveal, and restart
- A focused game-over modal for results and the restart action
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
│   ├── GameOverModal.tsx
│   └── Keyboard.tsx
├── config/
│   ├── content.json
│   ├── content.test.ts
│   └── content.ts
├── game/
│   ├── WORD_LIST_LICENSE.md
│   ├── gameLogic.ts
│   ├── gameLogic.test.ts
│   ├── keyboardLayout.ts
│   ├── types.ts
│   ├── validWords.txt
│   └── wordData.ts
├── hooks/
│   ├── usePhysicalKeyboard.ts
│   └── useWordle.ts
├── theme/
│   └── colors.css
├── App.tsx
├── main.tsx
└── styles.css
```

React components render the interface. `useWordle` owns state transitions.
Pure game rules live outside React so they can be read and tested independently.
Tests are colocated with those rules so each module's contract is easy to find.

## Architecture walkthrough

The dependency direction is intentionally one-way:

```text
App and components (rendering)
          ↓
useWordle (game orchestration and state)
          ↓
gameLogic.ts (all Wordle business rules)
          ↓
wordData.ts + validWords.txt (predefined data)

Physical keys ──→ usePhysicalKeyboard ──┐
                                       ├──→ inputKey ──→ useWordle
On-screen keyboard buttons ────────────┘
```

- **Components** know how to display the board, keyboard, and result modal.
  They receive data and callbacks; they do not calculate game outcomes.
- **`useWordle`** is the application layer. It coordinates answer selection,
  validation, submission, status changes, and restart/give-up actions.
- **`usePhysicalKeyboard`** is a browser adapter. It translates DOM keyboard
  events into the same `inputKey` command used by the on-screen keyboard.
- **`game/gameLogic.ts`** is the single home for all business rules: answer
  selection, dictionary validation, guess scoring, locked-letter editing, and
  keyboard-state calculation.
- **`game/wordData.ts`** loads the predefined answers and 14,855 accepted
  guesses. It contains data preparation, not gameplay decisions.
- **`game/keyboardLayout.ts`** contains only the visual QWERTY row layout.
- **`game/types.ts`** contains the shared domain types and game limits.

This separation makes the important rules deterministic and testable without
rendering React or mocking a browser.

## Business logic walkthrough

Open [`src/game/gameLogic.ts`](src/game/gameLogic.ts) during the interview. The
game follows this sequence:

1. `chooseAnswer` randomly selects a familiar answer from the predefined answer
   list.
2. `insertLetter` and `removeLastEditableLetter` update the active guess while
   protecting confirmed green positions.
3. `isValidWord` checks a completed guess against the predefined 14,855-word
   `Set`, providing constant-time lookup.
4. `evaluateGuess` performs two passes: exact matches first, then misplaced
   letters. This prevents duplicate letters from being counted twice.
5. `getKeyboardStates` keeps the strongest result ever seen for each key:
   `correct` overrides `present`, and `present` overrides `absent`.

`useWordle` calls these functions and owns React state, but it does not implement
the game rules itself. The complete engine is covered by
[`gameLogic.test.ts`](src/game/gameLogic.test.ts).

## Content and color configuration

Every text value used by the UI is stored in
[`src/config/content.json`](src/config/content.json). This includes headings,
buttons, gameplay messages, modal text, accessibility labels, metadata, emoji,
and the tutorial URL. Messages that need dynamic values use named placeholders,
for example:

```json
{
  "solved": "Solved in {attempts}!",
  "answerReveal": "The word was {answer}."
}
```

Every color used by the application is stored in
[`src/theme/colors.css`](src/theme/colors.css). The stylesheet uses semantic
custom properties such as `--color-correct`, `--color-present`, and
`--color-danger`, so the palette can be changed without searching through
component or layout styles.

### 60-second interview explanation

1. The UI is split into small presentational components.
2. Both touch and physical keyboard input converge on one `inputKey` command.
3. `useWordle` owns the game lifecycle but delegates every rule to
   `gameLogic.ts`.
4. The engine validates against 14,855 predefined words and uses two-pass
   scoring so repeated letters are handled correctly.
5. The business logic has focused tests; the deployment runs from the same
   reproducible `npm` scripts documented above.

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
14,855 Wordle-compatible five-letter words. This avoids rejecting ordinary
guesses without ever selecting an obscure dictionary entry as the answer. The
MIT-licensed list and its license are bundled in `src/game/`.

### Automatic submission with editable invalid guesses

A guess is checked as soon as the fifth letter is entered to keep play quick on
physical and touch keyboards. If the word is not recognized, it remains in the
active row so the player can use Backspace and correct it. Enter remains
supported for keyboard familiarity and for showing the incomplete-word message.

Green letters are carried into the same positions on each new row. They are
treated as confirmed progress, so the player only enters the unresolved
positions. Backspace removes only letters entered into those unresolved slots.

### Give Up and game-over modal

Give Up becomes available only after a complete attempt or a submitted guess,
so it does not distract from an untouched game. Winning, losing, or giving up
opens a modal that communicates the outcome, reveals the answer when needed,
disables further input, and focuses the restart action.

### One stateful hook

The application has one screen and one owner for its state. A custom hook keeps
game transitions together while components stay presentational. A second,
stateless browser-adapter hook handles physical keyboard events and forwards
them to the same input command. Redux, Context, and a reducer would add
indirection without solving a current problem.

## Known issues before a real public launch

- English has no universally authoritative word list, so some regional,
  technical, or newly coined words may still be rejected.
- The answer list is visible in the client bundle.
- Refreshing loses the current game.
- Random selection is not a shared daily challenge.
- Accessibility is designed into semantics, focus, contrast, and touch targets,
  but has not had a formal screen-reader audit.

## Day two

In priority order:

1. Review dictionary feedback and add justified regional/common omissions.
2. Persist the active game in versioned local storage.
3. Add a deterministic daily puzzle and shareable results.
4. Run a manual VoiceOver/NVDA accessibility review.

A backend would be considered only if cheating resistance, accounts, or
cross-device progress became a real requirement.

## Time allocation

The intended two-hour budget was divided approximately as follows:

- 15 minutes: scope and product decisions
- 30 minutes: game model and duplicate-letter algorithm
- 35 minutes: playable React UI and keyboard input
- 20 minutes: accessibility pass and edge-case review
- 20 minutes: documentation, build verification, and deployment setup

## Deploy to Netlify

1. Push the repository to GitHub.
2. In Netlify, choose **Add new project → Import an existing project**.
3. Connect GitHub and select the private repository.
4. Deploy.

[`netlify.toml`](netlify.toml) configures:

```text
Build command: npm run check
Publish directory: dist
Node version: 22.17.0
```

The deployment is blocked if tests, linting, or the production build fails.
No environment variables are required.

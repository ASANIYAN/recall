# Recall

Recall is a local-first flashcard app. It helps you learn new programming
languages and technical material quickly.

Recall runs fully in your browser. It stores decks and cards in IndexedDB.
It has no account and no server. It does not sync across devices.

Recall tracks mastery, not activity. Each card moves through four states:
New, Shaky, Solid, and Mastered. A card's state comes from its review
history, not from streaks or points.

## Features

- Keyboard-first review: press Space to flip a card, press 1–4 to grade it
- Deck list and deck detail views, each with a mastery breakdown
- Quick card creation, with support for fenced code blocks
- Export and import your data as JSON
- Installable as a PWA, and works fully offline
- Per-deck stats: a mastery trend chart and a list of problem cards

## Run the app

Recall needs Node.js and pnpm.

Install dependencies:

```
pnpm install
```

Start the dev server:

```
pnpm dev
```

Open the printed local URL in your browser.

## Build the app

```
pnpm build
```

This runs a type check, then builds the app into the `dist` folder.

Preview the production build:

```
pnpm preview
```

## Test the app

```
pnpm test
```

This runs the test suite once with Vitest.

## Lint and format

Check the code:

```
pnpm lint
```

Format the code:

```
pnpm format
```

Recall uses Biome for both linting and formatting.

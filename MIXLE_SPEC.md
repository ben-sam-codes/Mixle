# MIXLE — Build Spec for Claude Code

## What is this?

Mixle is a daily word game designed to go viral like Wordle. Players collect letters under uncertainty, then rearrange them into the highest-scoring word they can. Everyone gets the same puzzle each day.

The attached `mixle.jsx` is a working React prototype with all core mechanics finalized. Your job is to turn it into a production-ready web app.

---

## Game Rules (Final)

1. **Pick phase:** Player is shown 4 random letters per turn (at least 1 vowel guaranteed). They pick one. Repeat 5 times to collect 5 letters. No undo — every pick is a commitment.
2. **Arrange phase:** After picking, player can drag-to-reorder letters to form a word. Tiles shift to make space (reorder, not swap). Unlimited rearranging until they hit "Lock It In."
3. **Lifeline:** During the arrange phase, player can tap ↻ under any letter to replace it with a new random letter. 1 swap per round.
4. **Scoring:** Valid 5-letter word = letter points (Scrabble-style values) + word bonus (avg letter value × 3). Invalid word = 0.
5. **3 rounds** per game with different letter draws. Best round is your score.
6. **Daily seed:** Same puzzle for everyone each day. Seeded RNG using `year*10000 + month*100 + day`.
7. **Share:** Emoji grid + scores, copyable to clipboard.

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **Framer Motion** for drag reorder animations and transitions
- Keep the dark theme from the prototype (see CSS variables in `mixle.jsx`)

### Backend / Infrastructure
- **Vercel** for hosting + edge functions
- **No database needed at launch** — the game is fully client-side with seeded RNG
- Future: Supabase or Planetscale for leaderboards and stats

### Word List
- The prototype has ~3,000 words inline. For production, use a proper 5-letter word list:
  - Source: Use the standard Wordle-accepted word list (~12,000 valid 5-letter English words)
  - Store as a static JSON file in `/public/words.json`
  - Load on app init
  - Consider splitting into "common words" (for display/suggestions) and "all valid words" (for validation)

---

## Project Structure

```
mixle/
├── app/
│   ├── layout.tsx          # Root layout, meta tags, fonts
│   ├── page.tsx            # Main game page
│   └── globals.css         # Tailwind + custom properties
├── components/
│   ├── Game.tsx            # Main game orchestrator
│   ├── PickPhase.tsx       # Letter selection UI (4 choices per turn)
│   ├── ArrangePhase.tsx    # Drag-to-reorder + lifeline swap
│   ├── ScoreCard.tsx       # End-of-round score breakdown
│   ├── GameOver.tsx        # Final results + share button
│   ├── LetterSlot.tsx      # Individual draggable letter tile
│   ├── RoundIndicator.tsx  # Dot indicators for rounds 1-3
│   ├── HelpModal.tsx       # How to play overlay
│   └── ShareButton.tsx     # Copy-to-clipboard with toast
├── lib/
│   ├── words.ts            # Word list loader + validation
│   ├── scoring.ts          # scoreWord(), LETTER_VALUES
│   ├── rng.ts              # seededRandom, getDailySeed, getDayNumber
│   ├── draws.ts            # generateAllDraws() — letter pool generation
│   └── storage.ts          # localStorage for daily state persistence
├── public/
│   ├── words.json          # Full 5-letter word list
│   ├── og-image.png        # Open Graph share image
│   └── favicon.ico
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Key Implementation Details

### Drag-to-Reorder (Critical)

The prototype uses pointer events (not HTML5 drag API). This must work on both desktop and mobile:

- `onPointerDown` starts the drag, captures pointer
- Global `pointermove` tracks position, calculates which slot the pointer is over
- Tiles between source and destination shift with CSS `translateX` transitions
- A floating "ghost tile" follows the pointer
- `onPointerUp` commits the reorder (splice, not swap)
- Use Framer Motion's `Reorder` component if it simplifies this — but test on mobile

### State Persistence

Save to localStorage so refreshing doesn't lose progress:
- Key: `mixle-{YYYY-MM-DD}`
- Store: `{ round, step, letters, roundResults, gameOver, swapsUsed[] }`
- On load: check if saved state matches today's date, restore if so
- Clear previous days' data on load (keep only today)

### Daily Seed System

```typescript
function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
```

This ensures everyone gets identical letter draws. The seeded RNG is a simple linear congruential generator — see `mixle.jsx` for the exact implementation. Do NOT change the RNG algorithm or seed formula, as it would change everyone's puzzle.

### Guaranteed Vowel Per Draw

Each of the 5 draws must contain at least 1 vowel (a, e, i, o, u). The prototype does this by:
1. Pick a weighted random vowel first
2. Fill remaining 3 slots with weighted random letters (any letter)
3. Shuffle so the vowel isn't always in position 0

### Scoring

```typescript
const LETTER_VALUES = {
  a:1, b:3, c:3, d:2, e:1, f:4, g:2, h:4, i:1, j:8,
  k:5, l:1, m:3, n:1, o:1, p:3, q:10, r:1, s:1, t:1,
  u:1, v:4, w:4, x:8, y:4, z:10
};

function scoreWord(word: string): Score {
  if (!isValidWord(word)) return { valid: false, total: 0 };
  const letterScore = word.split("").reduce((sum, ch) => sum + LETTER_VALUES[ch], 0);
  const wordBonus = Math.round((letterScore / 5) * 3);
  return { valid: true, total: letterScore + wordBonus, letterScore, wordBonus };
}
```

### Share Text Format

```
MIXLE #437
R1: 🟩🟩🟩🟩🟩 CRIMP — 22pts
R2: 🟨🟨⬜⬜⬜ (no word) 🔄
R3: 🟩🟩🟩🟩🟩 GLYPH — 31pts
Best: 31pts
mixle.fun
```

- 🟩🟩🟩🟩🟩 = valid word
- 🟨🟨⬜⬜⬜ = no valid word formed
- 🔄 = used the lifeline swap that round

---

## SEO & Social

### Meta Tags
- Title: "Mixle — Daily Word Game"
- Description: "Mix your letters. Make your word. A new puzzle every day."
- OG image: Create a branded share card (1200×630)
- Twitter card: summary_large_image

### Domain
- Target: `mixle.fun`

---

## Monetization (v1)

### Buy Me a Coffee Integration

Add a small, non-intrusive tip prompt on the **Game Over screen only** — after the player has finished all 3 rounds and seen their results. Never during gameplay.

**Implementation:**
- Add a "☕ Buy Me a Coffee" button below the share button on the results screen
- Link to `buymeacoffee.com/mixle` (or equivalent — set up the account separately)
- Style it to match the game's dark theme — don't use BMAC's default yellow widget
- Button should be understated, not competing with the share button for attention
- No popup, no modal, no guilt-tripping copy — just a clean link

**Button styling:**
- Same border/radius treatment as the share button but with a subtle outline style (not filled)
- Text: "☕ Enjoying Mixle? Buy me a coffee"
- Color: `var(--text-dim)` with hover to `var(--accent2)`

**Placement in the component hierarchy:**
```
<GameOver>
  <RoundScores />
  <SharePreview />
  <ShareButton />        ← primary CTA
  <CoffeeButton />       ← secondary, understated
</GameOver>
```

**Do NOT:**
- Show the coffee button during gameplay or between rounds
- Use a third-party embed/widget (too heavy, breaks the theme)
- Add analytics tracking on the button (keep it simple for v1)

---

## Future Features (Don't Build Yet)

These are planned but NOT in v1. Noting them so architecture doesn't preclude them:

- **Leaderboard:** Global daily rankings by score
- **Streak tracking:** Consecutive days played
- **Stats page:** Distribution of scores, favorite words, etc.
- **Hard mode:** Only 3 letter choices, no lifeline
- **Practice mode:** Unlimited non-daily puzzles
- **Premium subscription:** Practice mode, stats, themes, ad-free ($2-3/month) — the daily puzzle always stays free
- **Post-game ad slot:** Single tasteful ad on results screen for free users

---

## Reference

The full working prototype is in `mixle.jsx`. Use it as the source of truth for:
- Exact RNG implementation
- Letter frequency weights
- Word list (as a starting point — expand for production)
- UI layout and flow
- Animation timing and visual design

The prototype runs as a single React component. Your job is to decompose it into the project structure above, add TypeScript, add persistence, expand the word list, and ship it.

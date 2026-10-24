# Pool notes: what the first Fan-out produced

Fan-out of 5 Sonnet subagents, 2026-10-24: 4 seeded runs (Technique 1, Anshu's three-step prompt with a 64-character script-generated string each) and 1 idea list (Technique 2, step 1). About 49K subagent tokens each, 24 to 30 seconds each.

## Seeds converged

All four seeded Directions are the same idea: an editor's or photographer's marked-up proof sheet. Warm cream paper, one pencil accent (vermilion or ochre), a high-contrast serif (Fraunces or Newsreader) with a mono, hand-drawn SVG circles and strike-throughs, asymmetric layout, a signature moment where a pencil circles one of the Variants. Three of the four are titled "Proof Sheet".

The strings changed parameters only: paper hue 57 vs 89 vs 90, an 8-column grid vs 1 : 4 : 9 proportions, 8 thumbnails vs 4 frames. Each agent read the string after the concept was fixed and used it to justify details.

Likely causes:
- **The brief overpowers the seed.** Anshu's demo used a one-line brief ("landing page for my productivity app"). This brief is rich and its messages (taste, choosing, 162 rulings, avoid AI tells) point at one metaphor: editing marks.
- **"Interpret the string" is not SSoT.** The String Seed of Thought paper gets diversity from a template whose every slot is picked by arithmetic on a segment of the string (sum-mod), not from reading a vibe into the string.
- **The escape from AI tells is itself a default.** Warm paper, editorial serif and one accent is the current "tasteful" fallback once gradients and centred heroes are banned.

## Idea list diverged

55 ideas across metaphors (railway signal box, departures board, subway map), media (letterpress, cyanotype blueprint, silent-film intertitles, receipt tape, flatpack manual), interaction models (live terminal replay, command palette, page that redesigns itself on reload, wipe slider between variants) and some deliberately bad ones (pure emoji, the banned gradient hero as a joke). Only items 36 (lab notebook) and 41 (redline document) sit near the proof sheet.

## Round 2: seeds the SSoT way

Somya chose to re-run the seeds. Same four strings; this time a script cut each into five segments and picked one option per slot by character-code sum mod the option count (`seeds/slots.md`, `seeds/pick.py`, `seeds/picks.md`). Slots: a concept from the 55-item idea list, then palette, type, layout and motion from eight fixed options each. Agents had to bring the forced combination to life and could override one slot other than the concept, with a reason. None did. 4 Sonnet subagents, about 48K tokens each, 15 to 18 seconds each.

Result: four different Directions (Blueprint Turnstile, Two Staves One Pencil, Pause Light, Dropped Blueprint).

- **The method worked where the script decided.** Concept, palette, type and layout all differ across the four.
- **Defaults crept back only where the agent chose freely.** Two Staves picked warm uncoated paper and a pencil, the round-1 attractor; Pause Light quietly moved its primary palette onto black.
- **Slots collided.** Seeds 1 and 4 both drew Cyanotype, so two Directions look alike at a glance. Sampling each slot without replacement across seeds would prevent this.
- **Content converged even when form diverged.** Seven of eight Directions use "162 pieces ruled keep, cut, merge or replace" as the proof that Somya builds tools, and all eight end on "your team's workflow". The brief fixes the content, so Directions vary only in form.
- **The slot options were written by the main session.** Its taste sets the space the seeds sample from.

## Narrowing

Four Directions kept, chosen so each differs from the others on palette, type, layout and what the reader does:

| Direction | Source | Palette | Type | Layout | Reader |
|---|---|---|---|---|---|
| Proof Sheet | round 1, four merged | cream, one vermilion | serif and mono | vertical, margin notes | watches choices get marked |
| Blueprint Turnstile | round 2, seed 1 | Prussian blue and white | huge Swiss grotesk | horizontal | approves at each gate |
| Two Staves | round 2, seed 2 | fluorescent pink and teal riso | Didone | horizontal score | watches two families correct each other |
| Pause Light | round 2, seed 3 | black with signal red, yellow, blue | condensed signage | one column | scrubs a wipe |

Also-ran: Dropped Blueprint (round 2, seed 4). Same blue plan sheet as Blueprint Turnstile at a glance; its lever-and-falling-type idea could graft onto another Direction.

**Count mismatch.** The glossary's Direction gate is "Somya's pick of three or four directions to build", and this ticket narrows to three or four briefs. With four briefs reaching the gate, the pick is only keep or drop. The gate here is run as: pick up to four, drop any, swap one in from the also-rans or the idea list, or combine.

## Research per Direction

`emil-get-creative` Phase 1, read by path: per Direction, the process behind the look, what it did to colour, texture and composition, named patterns, then 5 to 10 rules. One Sonnet researcher per Direction, at most 4 web lookups each: 54K to 89K tokens, 28 to 44 seconds each. Output in `research/`. Each came back with concrete rules, real names for the marks, and an honest note on where the Direction turns into a cliché.

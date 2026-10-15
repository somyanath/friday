---
status: accepted
---

# Friday owns copies of Matt's and pstack's skills, and uses Emil's in place

Friday copies the Matt Pocock and pstack skills it keeps into its own repo and edits them freely (owned skills), but uses Emil Kowalski's skills exactly as installed, never edited, copied or renamed (in-place skills), with Friday's own skills calling them by name. The split follows the licences: Matt's skills and pstack are MIT, while Emil's paid course skills ship with no licence or published terms, so changing them is not granted. Ownership is also the only way to cut, merge or rename single skills, since a Claude Code plugin is switched on or off as a whole, and pstack is a Cursor plugin that has to be ported anyway. Decided in "Does Friday use upstream skills in place or copy and own them?" (somyanath/friday#9, 2026-10-15).

## Consequences

- Each owned skill records the upstream repo and commit it was copied from. Upstream changes come in only when Somya asks: an agent diffs upstream from that commit for the copied skills alone and proposes changes for Somya to approve.
- Emil's updates arrive by Somya reinstalling them, which overwrites them in place. Friday then checks its list of the Emil skills it calls or switches off, flagging any that are missing, renamed, new or changed.
- Owned skills are prefixed `matt-` or `pstack-` when copied from one upstream, and `friday-` when built from more than one upstream or written from scratch. Emil's names never change, so a prefixed skill can never collide with one of his.
- Once Friday's copies work, Matt's plugin is switched off wherever Friday is on, so no skill exists twice.

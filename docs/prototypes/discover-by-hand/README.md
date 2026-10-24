# Discover by hand: Friday's homepage

PROTOTYPE, throwaway. Never merged. The hand run of Discover for [What does Discover produce when one real Surface runs through it by hand?](https://github.com/somyanath/friday/issues/21), 2026-10-24.

Read in this order:

1. `surface.md`: the Surface brief every agent received.
2. `pool-notes.md`: what each round produced, why the first seeds converged, and the narrowing.
3. `briefs.md`: the four Direction briefs that reached the gate.
4. `outside-check.md`: the one check that the Directions differ.
5. `gate-notes.md`: Somya's reactions at the gate.
6. `usage.md`: the usage log.

Raw material: `seeds/` (strings, round-1 Directions, slot options, the picking script and its picks, round-2 Directions), `idea-list.md`, `research/`.

The first copy of these files lived in a session scratchpad that was wiped mid-session before anything was committed. Every file was restored verbatim from the session transcript; `seeds/pick.py` reproduced the original picks exactly.

## Round 2 of the gate: sketches

Somya couldn't pick from text, so each Direction got a rough first-screen sketch: `sketches/a-proof-sheet.html` to `d-pause-light.html`, built by one Sonnet agent each from the Direction's brief section, research file and original Direction. Each holds the first screen and the signature moment frozen as a still, with no interaction. `sketches/board.html` flips between them at desktop and phone width; serve the folder (`python3 -m http.server 4210 --directory sketches`) so the moment frames can scroll. `sketches/shots/` holds the render check the main session ran before Somya saw them.

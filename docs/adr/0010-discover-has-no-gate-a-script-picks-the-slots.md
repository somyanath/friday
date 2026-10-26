---
status: accepted
---

# Discover has no gate: a script draws four Directions and Define builds them all

Discover ends with four Directions and no gate. A script draws four seeds and picks every Direction's slots from fixed menus by arithmetic on the seed string (concept from the Surface's idea list, then palette, type, layout and motion, plus lead, main proof and voice on a page that pitches something), with no option repeated. Four Opus helpers write one Direction each from those picks, and Define builds all four. Somya's first look at a Surface's design is the Variant gate, on four running pages. This follows Anshu Chimala's flow, where four seeded pages are built and improved before anyone picks, and the String Seed of Thought paper, where variety comes from arithmetic on the string rather than from a model reading a mood into it. In the hand run, agents that read their seeds produced four copies of one idea, while script picks gave four distinct Directions; and Somya couldn't pick from text briefs, which built pages answer better than sketches. The alternatives were a Direction gate with first-screen sketches, where Somya picks one to four Directions to build (the hand run's version, and the map's original three gates), and menus written fresh for each Surface, which bend toward the brief's obvious look. Decided in "What does Friday's design skill do in each phase and at each gate?" (somyanath/friday#15, 2026-10-26); detailed in `docs/specs/design-skill.md`.

## Consequences

- **A weak set of Directions costs a whole Define** before Somya sees it. "None" at round 1 starts a new Discover with fresh seeds; a second "none" asks Somya for a concept.
- **Each Direction is built by one family,** so a family's win depends partly on which Direction it drew. The script assigns families at random, so this evens out over many Surfaces (ADR-0005).
- **The menus set the range of every Surface,** so Somya approves them once and they change only by edit. A Direction writer may not swap a pick; options that break a Surface's hard rules are struck before the draw.
- **Somya's steering moves to the restate and the gates:** concepts of their own, locked slots or exact words at the restate, picks and cut lists at the Variant gate.

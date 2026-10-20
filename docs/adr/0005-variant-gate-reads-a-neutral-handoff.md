---
status: accepted
---

# The Variant gate reads a neutral Handoff and writes a neutral Gate record; Friday's facts stay in a private sidecar, and the gate is blind

Friday's design process and whatever shows the Variants meet at two files per round: a Handoff that every Variant (or Finalist) fills, and a Gate record that the gate writes back. Both use a format that knows nothing about Friday: branches, commits, run commands, URLs, screenshots, a written summary, picks and notes. Friday-only facts (which model family built each Variant, Critic scores, Verdicts, usage) go in a private sidecar the gate never reads. The gate is blind: letters are shuffled per Surface, and the family is revealed only once each round's pick is written. A public Variant gate tool may be built later, and nothing public may depend on Friday's internals, so the format has to be one such a tool can own. Blinding keeps the per-family win count honest, which matters because the UI leaderboards disagree sharply on GPT-6.1 Sol. The alternatives were a Friday-only format with an adapter written later, and an open gate with fixed letters (A and B Sonnet, C and D Sol). Decided in "What does a variant hand to the Variant gate, and what does the gate hand back?" (somyanath/friday#13, 2026-10-20).

## Consequences

- **The gate step is one swappable command.** It takes a round's folder and must leave a Gate record in it. On day one it is Friday's own: it writes a local comparison page, opens it, and asks Somya in the terminal. A later tool replaces that command and nothing else.
- **The family reveal goes in the sidecar, never the Gate record.** Friday writes it beside the round's pick and prints it in the terminal once the gate command exits, so the Gate record's format holds nothing a public tool can't fill. Changed in "Should Friday get its own Variant gate tool, and where does it stop?" (somyanath/friday#16, 2026-10-20), which also specifies that tool in `docs/specs/variant-gate-tool.md`.
- **The fixed letter-to-family table from "How does parallel work run day to day?" becomes a shuffled mapping kept in the sidecar.** Blinding is best effort: Sol Variants run in Sonnet host sessions, so Superset shows four Claude sessions, but a terminal or a write-up's style can still give a family away.
- **The Handoff leaves out Critic scores and Critic identity.** It says only whether the Critic loop passed or stopped at its cap, with the Critic's open points.
- **The comparison page never leaves Somya's machine:** no Artifacts and no Superset Pages, as with Pages in ADR-0003.
- **Nothing from the gate is committed to a project repo.** Round folders live in `~/.friday/gates/<project>/<surface>/` and move to Friday's private repo at the Ship gate.

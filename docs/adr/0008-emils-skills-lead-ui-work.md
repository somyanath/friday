---
status: accepted
---

# Emil's skills lead UI work

In UI work, the order of authority is Somya's decisions (gate picks, Gate record notes, the Ship gate sign-off), then the project's own rules (ADR-0006), then Emil Kowalski's skills. Every other skill, whether Matt's, pstack's or Friday's own, gives way to Emil's on UI craft and taste, and so does the Direction brief. Those skills keep their process jobs in UI work: tickets, tests, PRs, Verdicts and merge rules. The first proposal ran the other way in Define, letting a Direction brief override Emil's taste rules (restraint, one gradient or none, little scroll motion) so that a bold Direction would survive. Somya chose Emil's skills as Friday's standard for UI craft instead, since in practice almost everything a Surface is built from follows them. Decided in "Which installed skills does Friday keep, cut, merge or replace?" (somyanath/friday#10, 2026-10-23).

## Consequences

- **When two of Emil's skills disagree, his specialist skill for that topic wins.** His router's overlap table settles the pair where it covers it. Reduced motion follows `animation-accessibility` (keep opacity and colour changes, remove movement) over the stricter line in `emil-animations`. Every such disagreement is written to the run's Decision trail (the two skills, the rule that won, why, and where it applied), so Somya can go over them afterwards.
- **A Builder follows Emil's rules even where its Direction brief asks otherwise,** and lists each such conflict in its Handoff, so Somya sees it at the Variant gate. A note from Somya in the Gate record then overrides Emil.
- **No Emil skill starts on its own.** None is set to auto: kept skills are called by name or read by path, and the design skill picks them through Emil's own router (`emil-ask-emil`) and `emil-prototype`'s loadout instead of a table Friday writes.
- **Friday's skills that touch UI defer to Emil's.** `friday-prototype` hands UI questions to `emil-prototype`. `friday-review` uses `emil-ui-review` and `review-animations` as its craft check on UI PRs. `friday-debugging` hands motion that feels wrong and dropped frames in the UI to his skills. On a component's props, `emil-component-design` decides the API and `pstack-typescript-best-practices` only how it is typed, never adding or renaming a prop.
- **Prose splits by audience.** Words a user reads in the product go through `emil-unslop-writing`; everything else agents write goes through `pstack-unslop`.
- **Emil's skills stay in place (ADR-0002),** so Friday states precedence in its own skills and never edits his files.

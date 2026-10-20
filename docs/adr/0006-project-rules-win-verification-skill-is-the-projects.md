---
status: accepted
---

# Project rules win over Friday, and a project's Verification skill is the project's own file

Wherever a project's own rules (its `CLAUDE.md`, `AGENTS.md`, rules folder, settings, hooks, CI or branch protection) stop or change a step of Friday's process, the project wins, and Somya hears of the Rule conflict before the step runs. The other option, letting Friday win on process (gates, merges, Autonomy level) while the project wins on stack and layout, was rejected because text can't make Friday win anyway: when two instructions conflict, Claude Code "may pick one arbitrarily". The one Friday-made file a project commits, public or not, is its Verification skill, because it describes how to run and check that app and every worktree needs it. Keeping it in Friday and symlinking it in breaks as soon as a project commits a skill of its own. Decided in "How does Friday install into a project?" (somyanath/friday#17, 2026-10-20).

## Consequences

- **A project's rules cap its Autonomy level.** ADR-0004 lets non-UI work merge unattended, but a project whose rules say "ask before committing", as Portfolio's do, stays attended until Somya changes the project's own rules. That is deliberate, not a gap to fix.
- **Conflicts are found up front.** Switching Friday on in a project starts with a scan for Rule conflicts, reported to Somya. The scan runs again whenever the project's rule files change. Known conflicts, and how each plays out, are kept in the Project record.
- **In an Unattended run, a Rule conflict stops that piece of work** and is written down for Somya. Other work carries on. A Codex Builder that hits one reports it to its Host session.
- **The Verification skill names nothing of Friday.** It uses no Friday names or terms, so committing it doesn't break the rule that nothing public contains Friday's files. It lands as its own PR in the project, which Somya reviews before any work relies on it.
- **Everything else about Friday in a project stays private.** That covers the Project record (Autonomy level, Surfaces, notes, Gate records, known Rule conflicts) and the per-project switch in the gitignored `.claude/settings.local.json`.

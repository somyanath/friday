---
status: accepted
---

# Playbooks start only through the Entry command; reference skills are open to Claude

Friday's Playbooks, the skills that run one kind of job from start to finish (`friday-implement`, `friday-debugging`, the design skill, `matt-wayfinder` and the rest), set `disable-model-invocation: true`, so only `/friday` or Somya typing one starts them. `/friday` reads the chosen Playbook by path and copies its steps into the todo list. Reference skills, which hold know-how for one step (`friday-tdd`, `friday-pr`, `pstack-unslop` and the rest), stay open to Claude and are started through the Skill tool. A Playbook that started from a keyword would skip the Route line, the restate and the checks before routing. Every skill in Claude Code's skill listing costs context on every turn, within a budget of 1% of the context window, and on overflow descriptions are dropped. A reference skill started through the Skill tool is re-attached after compaction, and still works in a Builder's session or when Somya skips `/friday`. The alternatives were pstack's way, where 55 of 56 skills are user-only and read by path, so nothing works without its router and nothing read is re-attached after compaction; and leaving everything open to Claude, where about 40 descriptions would overflow the listing and Playbooks would start with no Route. Matt's own skills split the same way as Friday's. Decided in "What is Friday's single entry command and which playbooks does it route to?" (somyanath/friday#11, 2026-10-24); detailed in `docs/specs/entry-command.md`.

## Consequences

- **A Playbook read by path isn't re-attached after compaction,** so the todo list's first item is the Playbook's path, and the agent re-reads it.
- **Somya may type a Playbook directly.** It then runs without the Route line, the restate and the checks. The gates and the Always-pause list still hold, because settings enforce them (ADR-0007).
- **The split lives in each owned skill's frontmatter,** not in per-project settings, because `skillOverrides` doesn't reach plugin skills.
- **A session that must run a Playbook is started with it in its prompt,** such as a Fleet session's `/friday #<issue>`, since the Skill tool can't start one.
- **Every UI Route goes into the design skill,** which picks Emil's skills (ADR-0008).

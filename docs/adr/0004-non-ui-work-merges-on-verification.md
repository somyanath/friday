---
status: accepted
---

# Non-UI work merges on verification; UI work always stops at Somya's gates

Friday lets agents merge their own PRs for non-UI work, without Somya reviewing them first, once the merge conditions hold on the exact commit being merged:

- the finish condition is met;
- checks are green;
- a Verifier that didn't write the code has run a Live check through the project's Verification skill;
- the other model family has given a Pass Verdict;
- a Decision trail exists;
- nothing touches the Always-pause list.

UI work never merges without Somya's Ship gate. This follows pstack, where verification rather than human review is what lets work merge, and the human samples merged work afterwards. The alternative, stopping unattended work before every merge, would mean no loop ever runs end to end. Decided in "How does parallel work run day to day?" (somyanath/friday#12, 2026-10-16); research in `docs/research/pstack-autonomy.md` and `docs/research/pstack-verification.md` on their `research/` branches.

## Consequences

- **Each project has an Autonomy level** (attended, unattended to PR, unattended to merge), and only Somya raises it.
  - A project starts attended.
  - It needs a working Verification skill to reach unattended to PR.
  - It needs a few unattended PRs merged without rework to reach unattended to merge.
- **The Always-pause list holds at every level:** force-push, deploys, deleting data, messages to anyone, loosening any check, migrations against real data, and any change to what a user sees. Sharpened in "Which settings enforce Friday's merge rules in each project?" (somyanath/friday#19, 2026-10-21):
  - **Force-push** means force-pushing anything but the agent's own branch. A Builder may push to its own branch with `--force-with-lease` pinned to the SHA it last pushed, which a rebase needs.
  - **A deploy** means an agent running one or changing deploy config. A deploy that the project's own pipeline runs after a merge is part of that merge, and the merge conditions guard it.
  - **Messages** are anything that reaches another person. Writing to Somya's own repos is not one.
  - **Loosening a check** covers changes to:
    - CI workflows, rulesets and `CODEOWNERS`;
    - lint, type and test config, including deleting or skipping a test;
    - Friday's permission rules and hooks;
    - a project's Autonomy level or Pause paths;
    - its Verification skill;
    - deploy config.
- **Rules are enforced by settings (a ruleset, permission rules, a merge hook), not by instructions.** Which settings is decided in "Which settings enforce Friday's merge rules in each project?" (somyanath/friday#19). Agents there stop acting under Somya's own GitHub account and act as an Agent account instead (ADR-0007).
- **Merges happen one at a time.** A new commit voids a Verdict unless the patch is unchanged after a rebase.
- **Default verification per PR is one Builder, one Live check and one review from the other family,** far below pstack's roughly 14 verifiers, so it fits Claude Pro. Each run is logged in the usage log.
- **Somya reviews non-UI work by sampling merged commits,** then reverts them or adds rules.

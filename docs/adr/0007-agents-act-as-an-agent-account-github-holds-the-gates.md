---
status: accepted
---

# Agents act as an Agent account, and GitHub holds the Ship gate, Pause paths and the Verdict

In Friday projects every agent pushes, opens PRs and merges as an Agent account, a GitHub machine account with write access but not admin, never as Somya. A `CODEOWNERS` file naming Somya on every Pause path then makes Somya's approval something GitHub enforces. The Verdict is a `verdict` check run that the ruleset accepts only from Friday's private GitHub App, so no agent's token can fake it. Local rules (a merge hook, permission rules, Codex rules) stop mistaken, overeager or prompt-injected agents; GitHub is the backstop for whatever they miss. A deliberate agent on Somya's machine can get around local rules, and that is accepted. The alternatives were Somya's own account with a narrower token, where GitHub still can't tell an agent from Somya and the Ship gate rests on local rules alone; a GitHub App as the agents' identity, with the same gains as the machine account and more machinery; and a Verdict as a plain commit status, which any token, a Builder's included, can post. Decided in "Which settings enforce Friday's merge rules in each project?" (somyanath/friday#19, 2026-10-21).

## Consequences

- **The ruleset on each project's default branch:**
  - a PR is required, with 0 approvals but code-owner review, and stale approvals are dismissed;
  - required checks are the project's CI, tied to GitHub Actions as its source, and `verdict`, tied to Friday's App;
  - branches must be up to date, which makes merges one at a time;
  - force-pushes and deletion are blocked, history is linear, merges are squash only, and head branches are deleted after merging;
  - the only bypass is for repository admins, on pull requests only, so Somya's own PRs get through and the Agent account's never do.
- **`CODEOWNERS` is each project's list of Pause paths,** all owned by Somya, including `CODEOWNERS` itself and `.github/`. The merge hook reads the same file, so there is no second copy. It is committed, alongside the Verification skill (amends ADR-0006), and names nothing of Friday.
- **The Agent account's token** is classic, with `repo` scope only and a one-year expiry. It has no `workflow` scope, so GitHub refuses an agent's change to CI workflows. It lives in its own `gh` config folder, which each Friday project's `.claude/settings.local.json` names in `GH_CONFIG_DIR`. Commits stay authored with Somya's name and email.
- **Only one command posts the Verdict.** It runs the Verifier from the other family on the PR's exact head commit and posts what it returns. After a rebase it re-posts the Verdict only if `git patch-id --stable` is unchanged. The App's key sits in Somya's macOS Keychain, and agents are denied reading it.
- **The merge hook lives in managed settings, with an admin-owned script,** so no agent can edit or remove it. It does nothing where no Project record exists, and it blocks if it fails.
  - UI work, which means a `ui-work` label, a missing or doubled kind label, or a Pause path, is always merged by Somya in the browser.
  - Other work follows the project's Autonomy level: attended asks Somya, unattended to PR denies, and unattended to merge allows once the conditions hold.
  - Background sessions never merge.
- **Somya's browser is signed in as Somya,** so Claude in Chrome gets no site permission on github.com.
- **Checks to run before any project relies on this:**
  - a hook's allow gets past auto mode's default block on merging an unapproved PR;
  - hooks see `CLAUDE_JOB_DIR` in background sessions;
  - a squash merge of an Agent account PR still counts on Somya's contribution graph;
  - a token without `workflow` scope is refused a push to `.github/workflows/`;
  - a `codex exec` call with network on can't reach `gh` through the Agent account's config.

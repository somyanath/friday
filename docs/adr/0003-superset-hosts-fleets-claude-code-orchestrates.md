---
status: accepted
---

# Superset hosts Fleets; Claude Code orchestrates them

Friday runs every Fleet in Superset workspaces on its free tier, and keeps every decision in Claude Code. A Claude Code session decides what to start and starts it through Superset's local CLI (`superset workspaces create --branch … --agent claude --model … --effort … --prompt …`), then follows it with `agents wait`, `agents read` and `browser screenshot`. Every workspace runs a Claude Code session, so Codex is still reached only through `codex exec` (ADR-0001). Of the three tools compared (Claude Code alone, Superset and Conductor), Superset is the only one where one session can start, follow and screenshot a whole Fleet through a documented local interface, and it meters both Claude Pro and Codex. Conductor has no local programmatic control. Claude Code alone can't show Codex's work, and it's undocumented whether a session may launch background sessions. Decided in "How does parallel work run day to day?" (somyanath/friday#12, 2026-10-16); research in `docs/research/fleet-tools.md` on branch `research/fleet-tools`.

## Consequences

- **What Friday uses: every local, free Superset feature.**
  - Workspaces with an exact branch and base branch.
  - Setup, teardown and run scripts. These assign each workspace its 10-port block and copy `.env`, and the config stays local, excluded from git.
  - The ports pane, the in-app browser and its screenshots, windows and panes, and design mode.
  - The board, tags, `agents wait` and `read`, and `terminals send`.
  - The PR panes, Tasks from GitHub issues, workspace delete, and the Usage page.
- **What it skips:**
  - Superset Pro (automations, remote access, mobile), which is over budget.
  - Pages and the hosted MCP server, which upload content.
  - Codex as Superset's own agent (ADR-0001).
  - Superset's permission-bypass default. Its Claude command becomes `claude --permission-mode auto` for every project, and its Codex preset is switched off. Decided in "Which settings enforce Friday's merge rules in each project?" (somyanath/friday#19, 2026-10-21; ADR-0007).
- **Fan-out subagents stay inside Claude Code,** in Claude Code's own worktrees, because Superset hosts sessions, not subagents.
- **Each Variant built by GPT-6.1 Sol runs inside a host session.** The host is a Claude Code session on Sonnet that only does housekeeping and calls `codex exec` for every line of code. All four Variants share one loop.
- **Somya accepts two costs:** Superset's desktop telemetry (events, not code, always on while signed in) and a Superset account. Superset also writes managed skills into `~/.agents/skills` and `~/.claude/skills/superset`.
- **Before Friday relies on Superset,** it is updated from the installed 1.12.5, and one test runs first: a Claude Code session starts four workspaces and reads them back. If Superset goes away, `claude --bg` plus `codex exec` replaces the dispatch step. Worktrees are plain git, so nothing else is lost.

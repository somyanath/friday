# Fleet tools: Claude Code, Superset and Conductor, feature by feature

Research for "How does parallel work run day to day?" (somyanath/friday#12), questions 3 (what runs and shows a Fleet) and 5 (dev-server ports). Every source was read on 2026-10-15 unless marked otherwise. This file re-checks and goes deeper than `docs/research/parallel-tooling.md` on branch `research/parallel-tooling` (2026-10-13). Terms follow `GLOSSARY.md`: Fleet, Fan-out, Surface, Variant, Variant gate, Builder, Critic, Divergent and Convergent work.

Nothing was installed, updated, signed up for or configured. Local facts were only read.

## Short answer

- **Only Superset lets one Claude Code session start and steer a whole Fleet through a documented local interface.** `superset workspaces create --branch <name> --agent claude|codex --model <id> --effort <level> --prompt "…"` creates the worktree and starts the agent. `superset agents wait`, `superset snapshot` and `superset agents read` report back. `superset browser open/screenshot` drives each workspace's preview. [S-cli] [S-orch] [S-browser]
- **Claude Code can nearly do the same on its own.** `claude --bg --model sonnet --name <name> "<prompt>"` starts a background session that isolates itself in a worktree. `claude agents --json` reads every session's state, and cross-session messaging sends follow-ups. [C-av] [C-xs] Two gaps remain. Codex is never a session there: it stays a `codex exec` process the orchestrator runs. And the docs don't say whether a running session may launch `claude --bg` from its own Bash tool (not tested).
- **Conductor has no local programmatic control.** Its API and MCP server manage cloud workspaces only, on Pro at $50 a month. Locally, a deep link only pre-fills the new-workspace composer, and you still click Create. So Conductor suits Fleets you start by hand, not Define's Fleet started by one session. [D-api] [D-deep]
- **Ports:** Conductor is the only tool that hands each workspace its own ports: 10 per local workspace, from `CONDUCTOR_PORT`. Superset says plainly that it doesn't assign ports; it discovers whatever is listening and suggests doing ranges yourself in setup scripts. Claude Code's CLI has nothing. Its Desktop `autoPort` picks a free port and passes it as `PORT`, per server, inside Desktop sessions. [D-env] [S-ports] [C-desk]
- **A Friday port convention can sit on top of Claude Code or Superset.** It would be a block of ports per worktree, with the base written where the dev server can read it. Under Conductor, Friday would read `CONDUCTOR_PORT` instead, which ties the convention to Conductor (inference).
- **None of the three shows four live Variants side by side with notes and a pick.** Claude Desktop shows two sessions at once. Superset opens one window per workspace, and its browser panes can be scripted and arranged within one workspace, so four previews in one tab looks possible but isn't documented. Conductor's in-app browser is still experimental and shows one workspace. [C-desk] [S-win] [S-browser] [D-cl-0.62]
- **Superset's risks for a private workflow:** desktop telemetry is hard-coded on for signed-in users, and agents launch with permission bypass flags by default. It also writes its own skills into `~/.claude/skills/superset/` and `~/.agents/skills/`, which is Codex's skills folder. The CLI needs a Superset account. The installed 1.12.5 is far behind 1.38.0, released 2026-10-14. [S-code] [S-agents] [S-skills] [S-cli] [S-rel]
- **Conductor's risks:** closed source, PostHog analytics (including model choice and provider error messages), and its own injected system prompts. It runs bundled Claude Code and Codex builds unless you point it at system binaries. [D-priv] [D-faq] [D-set]

## What changed since the 2026-10-13 research

- **Superset** is at desktop-v1.38.0 (2026-10-14), not 1.37.0. The earlier note missed most of its control surface: a CLI (beta) with `workspaces create --agent --prompt --model --effort`, `agents wait`, `snapshot`, `panes` and `browser`; the `superset:orchestrate` skill; and a Usage page with Claude Code and Codex quota meters. [S-rel] [S-cli] [S-orch] [S-usage]
- **Conductor** is at 0.90.x (0.90.0 on 2026-10-02; 0.89.5 bundled Codex 0.159.3). Since 0.89.0 it signs in with ChatGPT, and it has supported GPT-6.1 Sol since 0.89.1. Its in-app browser, which shipped in 0.62.0, is still behind Settings → Experimental. Its API (alpha in 0.77.0, now beta) and hosted MCP server are cloud-only. [D-cl-0.89] [D-cl-0.62] [D-api]
- **Claude Code:**
  - Agent view now covers dispatch with `--model`, `--name` and `--agent`, reading state with `claude agents --json`, and safe-delete rules for worktrees. [C-av]
  - Cross-session messaging needs no setup from v2.1.224. [C-xs]
  - Desktop has a pane layout with pop-out windows. Since Desktop v2.37337.0, `autoPort` defaults to picking a free port. The installed Desktop is 2.37337.1. [C-desk] [C-local]
- **Still true from the earlier note:** Superset doesn't allocate ports, and Conductor gives 10 ports per workspace.

## Feature table

Legend: ✓ documented and available · partial · ✗ not available · unknown (not documented, not tested). "Claude Code" covers the CLI, agent view, subagents, hooks, the Desktop app, and cloud sessions where they matter.

### 1. Agents and models

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Runs Claude Code | ✓ Native. CLI 2.1.300 here. Desktop "runs the same underlying engine" [C-desk] [C-local] | ✓ Runs your installed `claude` CLI in a terminal. Its default launch command is `claude --dangerously-skip-permissions`, which you can change in Settings → Agents [S-agents] | ✓ Ships its own Claude Code (2.1.263 as of 0.85.0) or uses a system binary through `claude_code_executable_path`. Its default UI is Conductor's own chat; Big Terminal Mode runs the real CLI [D-harness] [D-cl-0.85] [D-set] [D-behav] |
| Runs Codex | partial: Not as a session. Reached only through `codex exec` from Bash, per ADR-0001 | ✓ Runs `codex` in a terminal. Default flags `--dangerously-bypass-approvals-and-sandbox --dangerously-bypass-hook-trust` [S-agents] | ✓ Ships its own Codex (0.159.3 as of 0.89.5) or uses a system binary. Sign in with ChatGPT since 0.89.0 [D-harness] [D-cl-0.89] |
| Model and effort per agent | ✓ `--model` and `--effort` per session. Subagent frontmatter takes `model` and `effort`. Agent view dispatch defaults: `claude agents --model --effort --agent` [C-av] [C-sub] | ✓ `--model` and `--effort` on `workspaces create` and `agents create`. Claude takes `opus`, `sonnet` or pinned ids. The docs list GPT-6 Astra, Sol and Luna for Codex; the source model list also has `gpt-6.1-sol` [S-cli] [S-code] | ✓ Model picker with saved "loadouts", effort and fast toggles. GPT-6.1 Sol since 0.89.1, fixed for ChatGPT sign-in in 0.89.5 [D-cl-0.85] [D-cl-0.89] |
| Claude Code skills, plugins and CLAUDE.md load unchanged | ✓ By definition. Desktop and CLI share CLAUDE.md, hooks, skills and settings [C-desk] | ✓ It runs the real CLI, so the same config loads (inference). It also adds its own status hooks to agent configs and writes managed skills into `~/.claude/skills/superset/` [S-status] [S-skills] | partial: The docs say agents use `AGENTS.md`, `CLAUDE.md`, `.claude/commands` and skills. Plugins aren't mentioned. Conductor "injects system prompts" of its own [D-behav] [D-faq] |
| Getting skills to Codex Builders | n/a. Codex reads `.agents/skills` (ADR-0001) | partial: Writes its own skills into `~/.agents/skills/` and `~/.agents/commands/` at launch [S-skills] | partial: A "Sync Agent Configs" button copies skills, slash commands and MCP servers between Claude Code and Codex [D-cl-0.57] |
| Default permission mode for launched agents | ✓ Your settings decide. Background sessions start the way a new `claude` session in that directory would [C-av] | Bypass by default for Claude and Codex; removable per agent [S-agents] | Approvals off by default: with tool approvals off, Claude and Codex presets start in full-access mode [D-behav] |

### 2. Workspaces

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| One worktree per agent | ✓ `claude --worktree <name>`, Desktop's worktree option, background sessions that move into a worktree before editing, and subagents with `isolation: worktree` [C-wt] [C-av] [C-sub] | ✓ One worktree and branch per workspace. "One branch = one workspace" [S-ws] [S-faq] | ✓ One worktree and branch per workspace [D-ws] |
| Where worktrees live | `<repo>/.claude/worktrees/<name>/`. Desktop's location is configurable. A `WorktreeCreate` hook can put them anywhere outside the repo [C-wt] [C-desk] [C-hooks] | `~/.superset/worktrees/<project>/<branch>`. Host-wide setting `worktreeBaseDir` [S-ws] [S-faq] [S-cli] | `~/conductor/workspaces/<repo>/<city>`. The default location is a user setting [D-ws] [D-set] |
| Branch naming you control | partial: `--worktree <name>` gives the branch `worktree-<name>`. Desktop has a branch prefix. Subagent and background worktree names are generated. Full control only through a `WorktreeCreate` hook (which gets the slug) or your own `git worktree add` [C-wt] [C-desk] [C-hooks] | ✓ The CLI's `--branch` is used exactly with `--skip-branch-prefix`. The UI names branches from the prompt plus a unique suffix, steered by per-project naming instructions [S-cli] [S-ws] | partial: City-named folder. The agent renames the branch on the first chat; you can turn that off. Prefix settings `git.branch_prefix_type` and `git.branch_prefix` [D-ws] [D-set] [D-cl-0.89] |
| Base branch | partial: `worktree.baseRef` is `"fresh"` (the remote default branch) or `"head"`; it can't name a branch [C-wt] | ✓ `--base-branch <branch>`, defaulting to the project default branch [S-cli] | partial: The repo's base branch (for example `origin/main`), fetched first. Start from an existing branch in the UI or with a deep link's `branch` [D-ws] [D-deep] |
| Setup and teardown scripts | partial: No setup script. `WorktreeCreate`/`WorktreeRemove` hooks replace git's creation step entirely. Desktop `.claude/launch.json` starts servers [C-hooks] [C-desk] | ✓ `.superset/config.json` `setup`, `teardown` and `run`, with user overrides and `config.local.json` [S-setup] | ✓ `scripts.setup`, `scripts.run.<id>` and `scripts.archive` in `.conductor/settings.toml` [D-scripts] |
| Copy gitignored files (`.env`) | ✓ `.worktreeinclude` (not applied when a `WorktreeCreate` hook is set) [C-wt] | partial: Inside a setup script, for example `cp "$SUPERSET_ROOT_PATH/.env" .env` [S-setup] | ✓ "Files to copy", or `.worktreeinclude` [D-files] |
| Archive and cleanup | ✓ A clean worktree is removed on exit. Subagent and background worktrees are swept after `cleanupPeriodDays` unless they hold work or unpushed commits. `claude rm` refuses to drop unpushed commits. Desktop can auto-archive after a PR merges [C-wt] [C-av] [C-desk] | ✓ Delete runs teardown and removes the worktree but keeps the branch; restore re-creates it. Bulk delete flags dirty or unpushed work. "Never deletes worktrees behind your back" [S-ws] [S-faq] [S-cli] | ✓ Archive runs the archive script. `git.delete_branch_on_archive` and `git.archive_on_merge`; restore from History [D-scripts] [D-set] [D-diff] |
| Workspace limit | None documented; usage limits are the real cap [C-av] | Unlimited on the free plan [S-price] | No hard limit documented. 295 city names, then suffixes such as `warsaw-v2` [D-cities] |

### 3. Dev servers and ports

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Per-workspace port allocation | partial: CLI none. Desktop `autoPort` gives each launch.json server a free port and passes it in `PORT`; it also rewrites a `--port`/`-p` value in `runtimeArgs` [C-desk] | ✗ "Superset does not assign per-workspace port ranges." The docs suggest reserving ranges yourself in setup and teardown scripts [S-ports] | ✓ "Conductor allocates ten ports to each workspace: `CONDUCTOR_PORT` through `CONDUCTOR_PORT+9`." Local only, not cloud [D-scripts] [D-env] |
| Run scripts | partial: Desktop `.claude/launch.json` configurations, started and stopped from the Dev servers menu [C-desk] | ✓ `run` commands behind the Run button, restartable, in their own pane [S-setup] | ✓ Named run scripts, an optional auto-run after setup, and `preview_urls` with port offsets [D-scripts] [D-set] [D-cl-0.63] |
| Several servers at once | ✓ Several configurations per project. Across sessions, each Desktop session's `autoPort` avoids busy ports (inference) [C-desk] | ✓ Nothing stops it; ports are discovered per workspace [S-ports] | ✓ `run_mode = "concurrent"`; `nonconcurrent` stops other run scripts first [D-scripts] |
| Port discovery and labels | partial: Desktop's Dev servers menu [C-desk] | ✓ Lists listening ports per workspace, labels from `.superset/ports.json`, kill, open in the in-app browser [S-ports] | partial: Cloud auto-forwards detected ports. Local uses configured preview URLs [D-cl-0.83] [D-set] |
| What the project must do | Read `PORT`, or take the port in `runtimeArgs` [C-desk] | Whatever your setup script arranges | Pass `$CONDUCTOR_PORT` to the server [D-scripts] |

### 4. Viewing

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Embedded browser or preview | ✓ Desktop's Browser pane: tabbed. Claude takes screenshots, inspects the DOM, clicks and auto-verifies after edits [C-desk] | ✓ In-app browser with DevTools. Agents drive it through `superset browser open/navigate/screenshot/eval/console/cdp` [S-browser] [S-cli] | partial: Experimental In-app Browser (Settings → Experimental) for localhost pages [D-cl-0.62] |
| Several workspaces' live previews on screen | partial: The split view shows **two** sessions. Panes such as diff or terminal can pop out into their own windows; popping out the Browser pane isn't stated [C-desk] | partial: One window per workspace ("watch several workspaces at the same time"). Inside one workspace, browser tabs can be opened and arranged by `superset panes`, so a 2×2 of four localhost previews looks possible but isn't documented (inference) [S-win] [S-cli] | unknown: Nothing documented beyond one workspace's preview. Split tabs exist inside a workspace [D-cl-0.83] |
| Notes on the UI sent to an agent | ✓ "Select an element in the Browser" (Cmd+Shift+S) [C-desk] | ✓ Design mode sends the element's DOM, computed styles, React metadata and a cropped screenshot to an agent [S-browser] | ✓ Built-in Agentation annotations [D-cl-0.62] |
| Device sizes and DevTools | unknown | DevTools ✓; device sizes unknown [S-browser] | unknown |
| A shareable comparison page | n/a | partial: Pages publishes HTML to Superset's cloud with comments and viewer storage. It uploads the content [S-pages] [S-faq] | ✗ |

### 5. Review

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Diff viewer | ✓ Desktop only; line comments go to Claude with Cmd+Enter [C-desk] | ✓ Changes pane (split or unified, focus mode); PR Code tab [S-diff] [S-pr] | ✓ Diff viewer, line comments sent to the agent, per-turn checkpoints [D-diff] |
| Inline comments sent back to the agent | ✓ (Desktop) [C-desk] | ✓ Selected PR lines go to a running agent or a new session [S-pr] | ✓ [D-diff] |
| Agent status and notifications | ✓ Agent view states (`working`, `blocked`, `done`, `failed`, `stopped`) and `waitingFor`. Desktop OS notifications [C-av] [C-desk] | ✓ Sidebar activity and a Board view (Idle, Working, Needs attention, Needs review, Merged). Notifications and a dock badge, through hooks [S-ws] [S-status] | ✓ Workspace status and notifications [D-cl-0.90] |
| Checks and CI | ✓ Desktop's CI status bar, with auto-fix of failing checks and new review comments [C-desk] | ✓ Checks in the sidebar and PR view [S-ws] [S-pr] | ✓ Checks tab: git status, CI, deployments, comments, todos [D-diff] |
| Agent code review | ✓ `/code-review` [C-desk] | Through the agents themselves | ✓ A Review action with custom review prompts [D-diff] [D-set] |

### 6. Git and GitHub

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Commit, push, PR | ✓ Background sessions commit, push and open a draft PR when the task calls for it. They never push to `main`/`master`, force-push or merge. Desktop has Create PR [C-av] [C-desk] | ✓ Commit, push and Create PR from the Changes pane [S-diff] | ✓ Create PR (drafts too), with agent-written descriptions [D-diff] [D-cl-0.57] |
| Review threads | ✓ Desktop auto-addresses new review comments from trusted authors [C-desk] | ✓ Review tab: read, reply, resolve [S-diff] [S-pr] | ✓ Review threads in Checks; send to the agent or resolve [D-diff] |
| Merge methods | partial: Desktop auto-merge only, squash, and it needs GitHub auto-merge turned on [C-desk] | ✓ Squash, merge commit or rebase [S-pr] | ✓ Merge from the app. It merges only the workspace's code and blocks if the PR changed on GitHub. Graphite stacks supported [D-cl-0.89] [D-cl-0.85] |
| Merge queue | ✗ | ✗ | ✗ (none documented) |
| Conflict help | Ask Claude (inference) | ✗ documented ("resolve that at merge time") [S-overview] | ✓ A "Resolve conflicts" prompt [D-behav] |

### 7. Programmatic control

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| CLI, SDK, MCP or API | ✓ CLI, Agent SDK and headless `-p` [C-cli] | ✓ CLI (beta, local over loopback), TypeScript SDK, and a hosted MCP server at `api.superset.sh` [S-cli] [S-mcp] | partial: An HTTP API and hosted MCP server for **cloud** workspaces only (Pro). Locally, only `conductor://` deep links [D-api] [D-deep] |
| One running session creates a workspace and starts an agent in it with a prompt | partial: `claude --bg --model <m> --name <n> --agent <a> "<prompt>"` from a shell, or `claude -p --worktree <name>` headless. Whether a session may run `claude --bg` from its own Bash tool isn't documented (not tested). Codex can only be a `codex exec` child process [C-av] [C-wt] | ✓ `superset workspaces create --project … --branch … --local --agent claude\|codex --model … --effort … --prompt "…"`. It defaults to JSON when it detects `CLAUDECODE`. The `superset:orchestrate` skill does exactly this [S-cli] [S-orch] | ✗ locally. A deep link opens the composer and you click Create (a `linear_id` link creates directly). Cloud: `POST /v0/workspaces` [D-deep] [D-api] |
| Read workspace and agent status | ✓ `claude agents --json [--all]`; Claude in a Desktop session can list and read other Desktop sessions [C-av] [C-desk] | ✓ `superset snapshot`, `agents wait --until settled`, `agents read` (transcript), `terminals read` [S-cli] [S-sessions] | ✗ locally; cloud API only [D-api] |
| Send a follow-up to a running agent | ✓ Cross-session messaging (`SendMessage`), or a peek reply in agent view [C-xs] [C-av] | ✓ `terminals send`; hand off with `agents create --from-terminal` [S-cli] [S-sessions] | ✗ locally |
| Drive the preview from a script | partial: Claude in the Desktop session drives its own Browser [C-desk] | ✓ `superset browser …` per workspace pane [S-browser] | ✗ |

### 8. Automation

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Scheduled or Unattended runs | ✓ Routines: cloud, Pro and above, research preview, run with no permission picker. Desktop scheduled tasks need the machine on; `/loop` is session-scoped [C-rt] [C-desk] | partial: Automations need Pro ($20 a month) and fail if the target device is offline [S-auto] | partial: Routines run in the cloud, Pro or Team only [D-cl-0.85] |
| Triggers | ✓ Schedule, API or GitHub events [C-rt] | Schedule (RRule) [S-auto] | Schedule or GitHub action [D-cl-0.85] |
| Remote and cloud hosts | ✓ Cloud sessions, SSH sessions in Desktop, Remote Control [C-desk] | partial: Remote access through a relay (Pro); cloud workspaces in early access [S-faq] | partial: Conductor Cloud on Vercel sandboxes (Pro) [D-price] |
| Mobile | ✓ Claude app, Remote Control, Dispatch [C-desk] | partial: iOS app, needs Pro [S-install] | partial: iOS app, for cloud workspaces [D-cl-0.90] |

### 9. Usage and limits

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Shows Claude Pro usage | ✓ `/usage` plan bars. Status line `rate_limits.five_hour` and `seven_day`. Desktop usage ring [C-cost] [C-sl] [C-desk] | ✓ Usage page: 5-hour and weekly meters for every Claude Code login, refreshed every 5 minutes [S-usage] | partial: Claude plan usage in the context-usage hover card [D-cl-0.83] |
| Shows Codex (ChatGPT Plus) usage | ✗ | ✓ The same meters for Codex logins [S-usage] | partial: Shows which ChatGPT account a chat uses; whether it shows quota isn't stated [D-cl-0.90] |
| How parallel agents count | Each background session uses quota on its own: "ten agents in parallel uses quota roughly ten times as fast" [C-av] | No throttling. A token-cost chart estimates API-rate cost per workspace [S-usage] | Not documented |

### 10. Issue trackers

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| GitHub Issues | partial: Through `gh` in a session. Agent view picks a session's row from `#<number>` for PRs [C-av] | ✓ Tasks view with a GitHub issues source and "Add to workspace" [S-tasks] | ✓ Create a workspace from a GitHub issue [D-issue] |
| Linear | ✗ native (MCP only) | partial: A Linear source in Tasks; the pricing page lists the Linear integration under Pro [S-tasks] [S-price] | ✓ Create a workspace from a Linear issue; a `linear_id` deep link [D-issue] [D-deep] |

### 11. Cost, licence, maturity, privacy and lock-in

| Feature | Claude Code | Superset | Conductor |
|---|---|---|---|
| Cost | Included in Claude Pro, which Friday already pays (₹1,999) | Free: 1 user, local workspaces, desktop app, CLI. Pro $20 a month ($15 billed yearly) for remote access, automations, Linear, Slack, mobile [S-price] | Free for local workspaces. Pro $50 a month for cloud, the API, multiplayer, mobile and routines [D-price] |
| Licence | Proprietary: "© Anthropic PBC. All rights reserved", under the Commercial Terms [C-lic] | Elastic License 2.0, source-available [S-lic] [S-overview] | Closed source; Customer Terms [D-price] |
| Maturity and release cadence | Stable core. Agent view and routines are research previews [C-av] [C-rt] | "New releases ship daily." v1.38.0 on 2026-10-14. The CLI is in beta. Installed: 1.12.5 [S-install] [S-rel] [S-cli] [S-local] | Pre-1.0, roughly weekly. 0.90.0 on 2026-10-02 [D-cl] |
| macOS | ✓ CLI, and Desktop as a universal build [C-desk] | ✓ Apple Silicon and Intel; Linux experimental [S-faq] | ✓ Mac only [D-install] |
| Account needed | claude.ai sign-in | The CLI needs `superset auth login` (GitHub or Google). State is kept per organization [S-cli] | GitHub plus an agent provider. Whether a Conductor account is needed locally isn't stated [D-install] |
| Telemetry and privacy | Metrics (no code, prompts or file paths) on by default; off with `DISABLE_TELEMETRY=1`. Error reports on Pro (`DISABLE_ERROR_REPORTING=1`). `/feedback` sends the conversation [C-data] | Code stays local. Account and organization metadata syncs. Pages and Remote Access send content to Superset's cloud. Desktop PostHog telemetry: `DEFAULT_TELEMETRY_ENABLED = true`, sent for signed-in users, events not code, with no setting found to turn it off. The SDK honours `SUPERSET_TELEMETRY=0` [S-faq] [S-price] [S-code] [S-sdk] | Local chats stay on the Mac and model traffic goes straight to the provider. PostHog analytics record workspace creation, the model selected, messages sent (metadata), provider error messages, stack traces, OS and IP address. "Enterprise data privacy" only turns off AI-provider features such as generated titles [D-priv] |
| Lock-in (what breaks if you stop) | None beyond Claude Code | Worktrees are plain git and survive. You leave behind `.superset/` config, hooks in agent configs (removable per agent) and managed skill copies [S-faq] [S-status] [S-skills] | Worktrees are plain git under `~/conductor`. You leave behind `.conductor/settings.toml`, and chat history lives in Conductor's app folder [D-ws] [D-faq] |

## What it means for Friday

Everything in this section is **inference** from the table, not a finding in any source.

### Define as a Fleet of four Builder sessions started by one session

- **Claude Code alone.**
  - The Sonnet Builders can be background sessions (`claude --bg --model sonnet --name <variant> …`) or subagents with `isolation: worktree`. The Sol Builders stay `codex exec` processes the orchestrator runs in worktrees it creates itself.
  - Status comes from `claude agents --json` and the orchestrator's own process list. Follow-ups go through cross-session messaging.
  - Gaps:
    - Codex Builders never show in agent view.
    - Background and subagent worktrees get generated names unless the orchestrator makes them first with `git worktree add`. Background sessions skip their own isolation inside an existing worktree.
    - The docs don't say whether a running session may call `claude --bg`. Test this once before building on it.
- **Superset.**
  - The best documented fit for "one session starts the Fleet". One CLI call per Variant creates a named branch, starts Claude or Codex with model, effort and prompt, then waits and reads the result. One call per Variant also opens its preview in a browser pane the agent can screenshot. That covers the Critic's screenshots too.
  - Its Usage page shows both plans' meters, which fits the plan to measure usage (Q7).
  - **ADR conflict:** a Codex Builder started by Superset is a full interactive Codex session, not `codex exec` inside a Claude Code session. ADR-0001 says Codex is reached "only by calling the Codex CLI (`codex exec`)". Either Superset runs `codex exec …` as the workspace's `--command`, or ADR-0001 is reopened.
- **Conductor.**
  - With no local API, a session can't start the Fleet; Somya would create each workspace by hand.
  - It fits Convergent Fleets started by hand (one workspace per issue, Checks, merge, archive). It fits poorly with Define as one session's job.

### Convergent Fleets of separate tasks

All three handle it. Claude Code (agent view, or Desktop sessions) and Conductor are the least effort when Somya starts each task by hand. Superset adds a board, PR views and quota meters.

### Ports (Q5)

- **Claude Code.** Ports are left to Friday. A Friday convention, a block of ports per worktree with the base written to a gitignored file or env, can be set by the orchestrator, a `WorktreeCreate` hook or a SessionStart hook. Desktop's `autoPort` only helps inside Desktop sessions, and only for servers that read `PORT`.
- **Superset.** Imposes nothing. Its own docs recommend exactly this kind of convention in setup and teardown scripts. Port labels in `.superset/ports.json` would name each Variant's server.
- **Conductor.** Imposes `CONDUCTOR_PORT` blocks of 10. A Friday convention would either read `CONDUCTOR_PORT` (tying Friday to Conductor) or ignore it and risk clashes.
- **Common ground.** A block of 10 per worktree with one base variable matches Conductor's model and can be built under Claude Code or Superset. If the base variable is Friday's own, nothing locks it to one tool.

### The Variant gate

- None of the three shows four live Variants side by side with a note per Variant and a recorded pick.
- **Closest: Superset.** Scripted browser panes could tile four previews (not documented). Design mode attaches notes to elements. A Page could hold a comparison with stored votes, but publishing uploads it to Superset's cloud.
- Claude Desktop shows two sessions at once, and Conductor shows one preview. The narrow gate tool described in the 2026-10-13 research is still the missing piece.

### Risks

- **Superset:**
  - Agents launch with permission bypass flags by default.
  - Desktop telemetry is hard-coded on for signed-in users.
  - ELv2 licence, and the CLI needs an account.
  - It writes managed skills into `~/.agents/skills/`, the folder "How does Friday install into a project?" plans to use for Codex Builders.
  - The installed 1.12.5 predates most of the CLI and Usage features above.
- **Conductor:**
  - Closed source.
  - Analytics include provider error messages.
  - Injected system prompts.
  - Bundled harness versions can lag (Claude Code 2.1.263 against 2.1.300 here) unless pointed at system binaries.
  - No local API.
- **Claude Code:**
  - Agent view and routines are research previews.
  - Codex isn't a first-class session.
  - Launching `claude --bg` from inside a session is untested.

## Not verified

- Whether a Claude Code session can launch `claude --bg` or `claude agents --json` from its Bash tool. Not documented, and not run, because it would start real sessions.
- Whether Superset can show four browser panes from four workspaces in one tab or window. Panes are documented per workspace, but `browser open` takes any URL. Not tried.
- Whether Claude Desktop's Browser pane can pop out into its own window, and whether two split sessions each keep a live preview.
- Whether Conductor's chat loads Claude Code plugins, and whether it needs a Conductor account for local use.
- Whether the Superset desktop app works with no Superset account. Only the CLI's sign-in requirement is documented.
- Device-size emulation in any of the three previews.
- Whether Conductor shows Codex quota, not just the ChatGPT account.

## Sources

### Claude Code (code.claude.com/docs/en/…, read 2026-10-15)

- [C-wt] /worktrees
- [C-av] /agent-view
- [C-desk] /desktop
- [C-sub] /sub-agents
- [C-hooks] /hooks (WorktreeCreate, WorktreeRemove)
- [C-xs] /cross-session-messaging
- [C-sl] /statusline (`rate_limits` fields)
- [C-cost] /costs (`/usage`)
- [C-rt] /routines
- [C-data] /data-usage
- [C-cli] /cli-reference
- [C-lic] https://github.com/anthropics/claude-code/blob/main/LICENSE.md
- [C-local] Local, read only: `claude --version` 2.1.300; `/Applications/Claude.app` CFBundleShortVersionString 2.37337.1

### Superset (https://github.com/superset-sh/superset, `main`, docs under `apps/docs/content/docs/`, read 2026-10-15)

- [S-overview] overview.mdx
- [S-ws] workspaces.mdx
- [S-ports] ports.mdx
- [S-setup] setup-teardown-scripts.mdx
- [S-browser] browser.mdx
- [S-win] multiple-windows.mdx
- [S-diff] diff-viewer.mdx
- [S-pr] pull-requests.mdx
- [S-faq] faq.mdx
- [S-install] install.mdx
- [S-usage] usage.mdx
- [S-orch] orchestration.mdx
- [S-agents] agent-integration.mdx, agents/claude-code.mdx, agents/codex.mdx
- [S-sessions] agent-sessions.mdx
- [S-skills] skills.mdx
- [S-status] agent-status.mdx
- [S-cli] cli/getting-started.mdx, cli/cli-reference.mdx
- [S-auto] automations.mdx
- [S-tasks] tasks.mdx
- [S-pages] pages.mdx
- [S-mcp] mcp-server.mdx
- [S-sdk] sdk/reference.mdx (telemetry)
- [S-price] https://superset.sh/pricing
- [S-rel] GitHub releases: desktop-v1.38.0 (2026-10-14), desktop-v1.37.0 (2026-10-08)
- [S-code] Source files: `apps/desktop/src/shared/constants.ts` (`DEFAULT_TELEMETRY_ENABLED = true`), `apps/desktop/src/main/lib/analytics/index.ts`, `apps/desktop/src/renderer/lib/posthog.ts`, `packages/shared/src/agent-models.ts`
- [S-lic] LICENSE.md (Elastic License 2.0)
- [S-local] Local, read only: `/Applications/Superset.app` 1.12.5; Superset hook entries in `~/.claude/settings.json`; `~/.superset/` contents listed

### Conductor (https://www.conductor.build, read 2026-10-15 through `/llms-full.txt` and `/changelog.md`)

- [D-price] /pricing (Free, Pro $50, Teams $60, cloud specs, security FAQ)
- [D-install] /docs/installation
- [D-faq] /docs/faq
- [D-ws] /docs/concepts/workspaces-and-branches, /docs/concepts/git-worktrees
- [D-scripts] /docs/reference/scripts
- [D-env] /docs/reference/environment-variables
- [D-set] /docs/reference/settings/reference
- [D-files] /docs/reference/files-to-copy, /docs/reference/worktreeinclude
- [D-cities] /docs/reference/cities
- [D-deep] /docs/reference/deep-links
- [D-api] /docs/api, /docs/api/mcp
- [D-harness] /docs/reference/harnesses, /harnesses/claude-code, /harnesses/codex
- [D-behav] /docs/reference/agent-behavior, /docs/concepts/agent-modes, /docs/reference/big-terminal-mode
- [D-diff] /docs/reference/diff-viewer, /docs/reference/checks, /docs/guides/review-and-merge
- [D-priv] /docs/reference/privacy, /docs/reference/security-and-permissions
- [D-issue] /docs/guides/issue-to-pr
- [D-cl] /changelog.md, with entries:
  - [D-cl-0.57] 0.57.0
  - [D-cl-0.62] 0.62.0
  - [D-cl-0.63] 0.63.0
  - [D-cl-0.83] 0.83.0
  - [D-cl-0.85] 0.85.0
  - [D-cl-0.89] 0.89.0 and 0.89.1–0.89.5
  - [D-cl-0.90] 0.90.0

### Earlier research re-checked

- `docs/research/parallel-tooling.md` on branch `research/parallel-tooling` (2026-10-13)

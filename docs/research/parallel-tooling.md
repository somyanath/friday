# Parallel tooling: Superset, Cursor, Noodle, Claude Code and others

Research for ticket #3. Date of research: 2026-10-13. Every web source was read on that date unless noted. Terms follow `GLOSSARY.md` (Fan-out, Fleet, Unattended run, Variant, Variant gate, Divergent and Convergent work).

## Short answer

**For "How does parallel work run day to day?"**

- Claude Code alone already covers all three shapes. Fan-out is subagents (each can pick its own model and run in its own worktree). A Fleet is `claude --worktree <name>` sessions or background sessions in agent view (`claude agents`), which move into their own worktree before editing. An Unattended run is a routine (cloud, schedule, API or GitHub trigger) or a Desktop scheduled task. Nothing else is needed to make parallel work possible. All of it draws on the same subscription usage, so ten agents burn quota about ten times as fast (agent view docs).
- A Fleet needs a cockpit, not a new engine. Superset (already installed, free tier, bring your own subscription) gives one worktree per task, a diff viewer and PR pane, status notifications, and an in-app browser. It does not change which agent does the work. Conductor is the closest rival (Mac only, free tier, Claude Code, Codex, Cursor, OpenCode). Claude Code's own Desktop app and agent view are the no-extra-tool option.
- Noodle is a different kind of thing: a Go orchestrator that schedules skills by itself. It only documents Claude and Codex providers, defaults to `max_concurrency = 4`, and is v0.1.5 from March 2026 with no commits since 19 March. It is the only candidate that turns skills into a self-running loop, so it is relevant to Unattended runs, not to the daily Fleet. Treat it as experimental.
- Cursor background agents (now "Cloud Agents") run in Cursor-managed cloud VMs and need a paid Cursor plan. The pricing page lists "Cloud agents & automations" from Premium ($30/month), which alone is the whole ₹3000/month budget. Cursor is a poor fit unless Friday runs on Cursor.

**For "Should Friday get its own Variant gate tool, and where does it stop?"**

- No tool I found does the Variant gate end to end. The pieces exist separately: a worktree per branch (everyone), a dev server per worktree on its own port (Conductor allocates 10 ports per workspace; Claude Desktop has `autoPort`; Worktrunk has a `hash_port` filter; Superset explicitly does not), and an in-app browser (Superset, Conductor, Claude Desktop, Cursor, Redshift Hub).
- Nobody documents a view that shows 3 or 4 variants' running UIs together in one comparison surface with a note per variant and a recorded pick. The nearest are manual: Superset "Multiple Windows" (one window per workspace) and Claude Desktop's two-session split. This is an absence in documentation, not proof that it can't be done by hand.
- So a Variant gate tool has a real gap to fill, and the gap is narrow: allocate ports, start each variant's dev server, show the UIs together, capture notes and one pick. It should stop there. Creating worktrees, running agents, diffs, PRs and merging are already done well by the tools above, and a Friday gate tool should sit on top of any of them via plain git worktrees and a port convention.

## Comparison table

"Needs a subscription" means a subscription to run the tool or its cloud features. All of these also need your own agent access (Claude, Codex, etc.) unless noted.

| Tool | Agents and models it drives | Isolation | Review and merge | Cost | Licence | Maturity (as read) | macOS | Subscription needed |
|---|---|---|---|---|---|---|---|---|
| **Claude Code** (subagents, `--worktree`, agent view, workflows, teams, routines, cloud sessions) | Claude models only. Subagent `model` field takes `sonnet`, `opus`, `haiku`, `fable`, a full ID or `inherit` | Git worktrees (`--worktree`, `isolation: worktree`, agent view). Cloud sessions run in isolated Anthropic VMs. Teams do not use worktrees | Diff view with inline comments, PR creation, auto-fix and auto-merge (squash) in Desktop; cloud sessions push `claude/` branches | Included in Pro ($20/month monthly, $17 annual) and Max (from $100). Parallel work multiplies usage | Not stated in the docs read | Subagents, worktrees, `/loop`: stable docs. Agent view, routines: research preview. Agent teams: experimental, off by default | Yes (CLI, Desktop universal dmg) | Pro/Max/Team/Enterprise for Desktop, cloud sessions, routines. CLI also works with API key but `/schedule` and `--cloud` need a claude.ai login |
| **Superset** (superset.sh) | Any CLI agent: Claude Code, Codex, OpenCode, Gemini CLI, Copilot, Cursor Agent, Amp and more, plus custom CLIs | One git worktree and branch per workspace, stored in `~/.superset/worktrees/`. Not a sandbox: shared processes, network, files outside the worktree | Changes pane (stage, commit, push, PR), PR pane with checks and review threads and merge. Race recipe: same prompt, several agents, "merge the best diff" | Free (local, desktop, CLI). Pro adds remote access, automations, mobile, Linear/Slack. Does not proxy model calls | Elastic License 2.0 (source-available, not OSI open source) | Active. Repo pushed 2026-10-13, 15k stars, release desktop-v1.37.0 on 2026-10-08. Installed here is 1.12.5 | Yes (macOS is the supported target) | Own agent subscriptions only. Pro tier optional |
| **Cursor** (Agents Window, Cloud Agents, formerly Background Agents) | Cursor's curated model list; third-party models at API list price. `/best-of-n sonnet,gpt,composer` runs one task on several models | Local: git worktrees (Agents Window, `/worktree`). Cloud: isolated cloud VM per agent on its own branch | Agents Window diffs view and PRs. Cloud agents produce PRs with screenshots, video and logs, plus remote desktop takeover. `/best-of-n` does not merge; use `/apply-worktree` | Pricing page: Free $0 (no cloud agents), Plus $8 (no cloud agents), Premium $30 (adds Cloud agents), Super $100, Ultra $200, Teams $30+/user. Cloud agent usage billed at model API rates; spend limit prompted | Not stated in the docs read | Agents Window GA with Cursor 3 (2026-04-02). Projects (2026-09-10) and self-hosted machines (2026-09-02) are new | Yes (Cursor 3.24.12 installed here) | Yes for cloud agents: paid plan |
| **Noodle** (poteto.github.io/noodle) | Providers documented in config and install: `claude` and `codex`. Model chosen per stage by the scheduler | One git worktree per agent. Completed work enters a serialised merge queue. Optional Sprites cloud sandboxes runtime | Modes: `auto` (merges automatically), `supervised` (default, human approves merges), `manual`. Optional web UI | Free software; model cost is yours. Docs warn each agent consumes tokens independently | MIT | v0.1.5 (2026-03-03), last push 2026-03-19, 480 stars. Early | Yes (`brew install poteto/tap/noodle`) | None of its own. Needs Claude or Codex access |
| **Conductor** (conductor.build) | Claude Code, Codex, Cursor, OpenCode (docs landing page) | One workspace = one git worktree and branch | Diff viewer, checks, open PR, merge, archive. Losing workspaces archived or discarded | Free (local workspaces, bring your own subscription). Pro $50/month adds Conductor Cloud, API, mobile. Teams $60/user | Not stated on the pages read (appears closed source) | Active. v0.90.0 on 2026-10-02 | Yes, Mac only | Own agent access only. Cloud features need Pro |
| **Vibe Kanban** (BloopAI) | 10+ CLI agents: Claude Code, Codex, Gemini CLI, Copilot, Amp, Cursor, OpenCode, Droid, CCR, Qwen Code | Each kanban card = a workspace with its own branch, terminal and dev server (worktrees) | Diff review with inline comments sent to the agent, PRs with AI descriptions | Free | Apache-2.0 | Company shut down 2026-04-10; project continues "open source and community maintained". Last release v0.1.44 (2026-04-24), last push 2026-09-19 | Runs via `npx vibe-kanban` | None |
| **Claude Squad** (smtg-ai) | Claude Code, Codex, Gemini, Aider (README); OpenCode and Amp in repo blurb; custom via `-p` | Each agent in its own tmux session and git worktree | TUI with preview and diff panes; commit, push, pause, resume | Free | AGPL-3.0 | v1.0.20 (2026-08-20), 8.6k stars | Not stated; needs tmux and gh (Homebrew install offered) | None |
| **Crystal** (stravu) | Claude Code and Codex | Parallel git worktrees | Diff and compare in a desktop app | Free | MIT | Deprecated in February 2026, replaced by Nimbalyst. Last release 0.3.5 (2026-02-26) | Electron app | None |
| **Redshift Hub** (redshifthub.com) | Optimised for Claude Code; also Codex, Gemini CLI, opencode, Copilot | Separate git worktrees per agent | Not verified | Free (per its FAQ) | Not stated | Not verified; new | Native app, requires macOS 26 and Apple Silicon | Claude subscription (Pro, Team or Enterprise) |
| **Worktrunk** (worktrunk.dev) | Not an agent runner. A CLI for git worktrees aimed at parallel agents | Git worktrees; `hash_port` template filter gives each worktree a unique port; hooks on create, pre-merge, post-merge | Picker with streaming CI status and diff, log, PR previews | Free | MIT or Apache-2.0 | Not verified beyond the site | Yes (Homebrew) | None |

## Detail by tool

### Claude Code's own tools

All from official docs, https://code.claude.com/docs/en/..., read 2026-10-13.

- **Subagents with a model per agent.** The `model` frontmatter field accepts `sonnet`, `opus`, `haiku`, `fable`, a full model ID or `inherit`. Resolution order: the per-invocation `model` parameter, the definition's frontmatter, `CLAUDE_CODE_SUBAGENT_MODEL`, then the main session's model. Up to 20 subagents run at once by default (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`). (`/docs/en/sub-agents`)
- **Worktree isolation.** `isolation: worktree` in a subagent definition runs it in a temporary worktree, branched by default from the repository's default branch, removed if it made no changes. `claude --worktree <name>` starts a whole session in `.claude/worktrees/<name>/` on a branch `worktree-<name>`. `.worktreeinclude` copies gitignored files such as `.env`. (`/docs/en/worktrees`)
- **Background agents (agent view).** `claude agents` opens one screen for background sessions; `claude --bg "..."` dispatches one. Each moves into an isolated worktree before editing, preserves its work by committing and optionally opening a draft PR, and never pushes to main/master or merges. Sessions are local and stop if the machine shuts down. Research preview. The docs do not state which plans include it. (`/docs/en/agent-view`)
- **Agent teams.** A lead plus peer sessions with a shared task list; per-teammate model can be named in the spawn prompt. Experimental, disabled by default, and teammates are not isolated in worktrees. Better suited to research and review than parallel edits. (`/docs/en/agent-teams`)
- **Dynamic workflows.** A JavaScript script that orchestrates many subagents (default up to 16 at once, 1,000 per run), resumable, and savable as a command. Available on all paid plans; on Pro it is switched on in `/config`. (`/docs/en/workflows`)
- **`/loop` and scheduled tasks.** Session-scoped: fires only while Claude Code is running and idle; recurring tasks expire after 7 days; interval can be self-paced (1 minute to 1 hour). (`/docs/en/scheduled-tasks`)
- **Routines (Unattended runs).** Saved prompt + repositories + connectors, run in the cloud on a schedule (minimum interval 1 hour), an API call, or GitHub events. They run with no permission prompts, push `claude/`-prefixed branches, and draw on subscription usage. Available on Pro, Max, Team and Enterprise; research preview. Limits: 100 scheduled runs per hour per account. Desktop scheduled tasks are the local equivalent (1 minute minimum, machine must be on). (`/docs/en/routines`, `/docs/en/scheduled-tasks`)
- **Cloud sessions.** Isolated Anthropic VMs, started from claude.ai/code, the mobile app, Desktop, or `claude --cloud "..."`. Each `--cloud` call is its own parallel session. Pro, Max, Team and Enterprise premium seats; usage counts toward plan limits with no separate VM charge. GitHub is required for pushing results. (`/docs/en/claude-code-on-the-web`)
- **Projects.** One conversation at claude.ai/code in which Claude starts and tracks parallel cloud threads; public beta on Pro and Max. (`/docs/en/agents`)
- **Desktop app.** The Code tab has a **worktree** option per session, a diff viewer with inline comments, PR monitoring with auto-fix and squash auto-merge, and a Browser pane that previews a dev server. `.claude/launch.json` can define several servers; `autoPort: true` makes Claude pick a free port and pass it as the `PORT` environment variable. Two sessions can be shown side by side (Cmd-click a session). The docs do not say whether each session in the split has its own live preview. (`/docs/en/desktop`)

Source for the overview of approaches and their trade-offs: https://code.claude.com/docs/en/agents.

### Superset

- **What it is.** A desktop app for running CLI coding agents, one git worktree per task. Official site https://superset.sh, docs https://docs.superset.sh, repo https://github.com/superset-sh/superset (not Apache Superset, the BI tool). Per its FAQ: "Is Superset a terminal app? No. It's a desktop app with a full interface." (`apps/docs/content/docs/faq.mdx` in the repo, and https://superset.sh/llms.txt)
- **Wired into this Mac.** `~/.claude/settings.json` has hook entries that run `[ -n "$SUPERSET_HOME_DIR" ] && ... $SUPERSET_HOME_DIR/hooks/notify.sh` with `SUPERSET_AGENT_ID=claude`. `~/.superset/hooks/notify.sh` (header "Superset agent notification hook v3") POSTs lifecycle events (Start, Stop, PermissionRequest) to a local host service. The FAQ confirms: "Superset installs lifecycle hooks and command wrappers (in `~/.superset/bin`) so it can show agent status and send finished/waiting notifications." The guard means the hooks do nothing in a terminal where `SUPERSET_HOME_DIR` is unset, which is why they do not affect other sessions. The installed app reports version 1.12.5 (Info.plist); the latest release is desktop-v1.37.0, so it is behind. Local config was only read.
- **Review and merge.** Changes pane commits, pushes and opens PRs; the PR pane shows checks and review threads and can merge. The "Race Agents on One Task" recipe runs the same prompt across agents on separate branches, then you read the final messages and diffs, ship the winner and delete the rest. Comparison is by diff, not by running UIs. (`apps/docs/content/docs/recipes/race-agents.mdx`)
- **Ports and browser.** The Ports doc says plainly: "Superset does not assign per-workspace port ranges. It discovers listening ports from processes running in each workspace." It groups them by workspace and can open one in the in-app browser. Deterministic ranges are left to setup and teardown scripts (a shared `~/.superset/port-allocations.json` is suggested). The in-app browser has DevTools, a Design mode (click an element, send it with DOM, styles and a screenshot to an agent), and can be driven by `superset browser` CLI commands, including a CDP endpoint. (`apps/docs/content/docs/ports.mdx`, `browser.mdx`)
- **Seeing several workspaces at once.** "Multiple Windows" lets you open more than one window "to watch several workspaces at the same time". Each window navigates on its own. (`apps/docs/content/docs/multiple-windows.mdx`)
- **Automation and extras.** CLI, TypeScript SDK and MCP server for programmatic control; Pro adds scheduled automations and remote hosts. Worktrees are "not a sandbox." (llms.txt, FAQ)
- **Licence and cost.** Elastic License 2.0 (checked in the repo's `LICENSE.md`; GitHub shows "Other"). Free tier covers one user, local workspaces, desktop app and CLI.

### Cursor

- **Naming.** "Cloud Agents were formerly called Background Agents." They run in isolated cloud VMs, each on a separate branch, and can be started from Cursor Desktop, cursor.com/agents, iOS, Slack, Linear, GitHub or the API. They need a paid plan and read-write repo access. Usage is charged at API rates for the chosen model and you set a spend limit. "You can run as many agents as you want in parallel." (https://cursor.com/docs/cloud-agent)
- **Agents Window.** Generally available with Cursor 3 (2026-04-02). It adds multi-workspace, a diffs view, parallel cloud agents, local-to-cloud handoff, cloud subagents (`/in-cloud`), and UI-native worktrees. The worktree UI exists only in the Agents Window; in the IDE use `/worktree` and `/best-of-n`. (https://cursor.com/docs/agent/agents-window, https://cursor.com/docs/configuration/worktrees)
- **Best of N.** `/best-of-n sonnet,gpt,composer <task>` runs the same task on several models, each in its own worktree. It compares only; it does not merge, and `/apply-worktree` brings the winner into the main checkout. This is the closest thing to Divergent work in any tool read, but the comparison is of code and agent output, not running UIs.
- **Previews.** Cloud agents can show artifacts (screenshots, videos) and a remote desktop. The changelog notes that Cursor "port-forwards a cloud agent's live environment to your browser for preview" (2026-08-27). The Browser tool runs as a pane inside Cursor and is prompted to detect running dev servers and use the right ports. (https://cursor.com/changelog, https://cursor.com/docs/agent/tools/browser)
- **Other recent items.** Projects with a coordinator agent (2026-09-10), self-hosted machines (2026-09-02), remote control of local agents from iOS (2026-10-06). Worktree setup via `.cursor/worktrees.json`; default cap of 25 worktrees per machine.
- **Plan.** The pricing page (https://cursor.com/pricing) lists Cloud agents & automations from Premium at $30/month; Free and Plus ($8, Grok models only) do not include them. A search-result review gave different tier names and prices, so confirm at purchase time. Nothing was bought or signed up for.

### Noodle

Verified against the repo https://github.com/poteto/noodle and docs https://poteto.github.io/noodle/ (the repo README also links noodle-run.github.io, same content).

- **Confirmed:** Go ("Skill-based agent orchestration. Built in Go."), v0.1.5 released 2026-03-03, MIT licence, `auto` / `supervised` / `manual` modes (default `supervised`; `supervised` needs a human for merges, `manual` for every step), optional Brain.
- **Skills that self-schedule.** Confirmed in `INSTALL.md`: a `schedule` field in a skill's YAML frontmatter holds prose such as "After execute completes and all tests pass." and "The scheduler reads the `schedule` value as prose and decides when conditions are met." A working loop needs a schedule skill (reads the backlog, writes orders) and at least one task skill.
- **LLM-based scheduling across models.** Confirmed: the scheduling agent writes orders where each stage names a provider, model and runtime; the docs give an example of a fast coding model on a cloud VM followed by a reasoning model reviewing locally. (`docs/concepts/scheduling.md`)
- **Brain.** Optional, and not part of Noodle itself: it comes from the separate `brainmaxxing` skill pack, which adds a `brain/` directory of markdown notes plus reflect/meditate/ruminate skills. "Noodle works without this." (`docs/concepts/brain.md`)
- **Agent CLIs.** Config documents `[agents.claude]` and `[agents.codex]`; the install flow asks "Claude or Codex". The config table gives provider names as "e.g. `claude`, `codex`". I found no Gemini, Cursor or OpenCode adapter in the docs read, so treat Claude and Codex as the verified set.
- **Isolation and concurrency.** Each agent runs in its own worktree; merges are serialised through a merge queue; default `max_concurrency = 4`; runtimes are local processes or Sprites cloud sandboxes (needs a Sprites token). The docs warn "Each agent consumes tokens independently."
- **Fit.** It is an engine for Unattended runs and loops, with a worktree-and-merge-queue model like a Fleet. It has no side-by-side UI comparison. Maturity: 480 stars, five releases in two days, no pushes since 2026-03-19.

### Conductor

- Mac app from Melty Labs (per a search-result summary; not confirmed on the official pages). "Conductor lets you run Claude Code, Codex, Cursor, and OpenCode in parallel." Each workspace has its own branch, files, terminal, diff and review path, built on git worktrees. (https://www.conductor.build/docs/, https://www.conductor.build/docs/concepts/workspaces-and-branches)
- **Ports.** "Conductor allocates ten ports to each workspace: `CONDUCTOR_PORT` through `CONDUCTOR_PORT+9`." Run scripts have `run_mode`: `concurrent` allows run scripts in several workspaces at once. (https://www.conductor.build/docs/reference/scripts, as returned by the fetch tool; I could not confirm the exact URL path in the docs navigation.)
- **Comparing.** "Comparing approaches before choosing one path... If you choose one path, archive the others." (https://www.conductor.build/docs/concepts/parallel-agents) The changelog lists "Repo settings, browser preview" (0.62.0, 2026-06-04) and "Auto port forwarding" (0.83.0, 2026-08-27) by title only, so I cannot say whether the browser preview shows more than one workspace. (https://www.conductor.build/changelog)
- **Pricing.** Free local workspaces on Mac with your own subscriptions; Pro $50/month adds cloud workspaces. (https://www.conductor.build/pricing)

### Vibe Kanban, Claude Squad, Crystal and similar

- **Vibe Kanban.** README opens "Vibe Kanban is sunsetting." The company announced on 2026-04-10 that it was shutting down, with the project to live on "open source and community maintained"; hosted services ran 30 days longer and local workspaces keep working. Supports 10+ agents. Each workspace gives an agent a branch, a terminal and a dev server, plus a built-in browser with devtools and device emulation. `FRONTEND_PORT` defaults to 3000 and `BACKEND_PORT` auto-assigns, so concurrent workspaces need handling. (https://github.com/BloopAI/vibe-kanban, https://vibekanban.com/blog/shutdown)
- **Claude Squad.** A terminal UI: tmux session plus worktree per agent, preview and diff panes, commit/push/pause/resume keys. No web preview or ports in the README. AGPL-3.0. (https://github.com/smtg-ai/claude-squad)
- **Crystal.** README: "Crystal ... has been deprecated and replaced by Nimbalyst" as of February 2026. Nimbalyst adds worktree isolation and a session kanban with per-worktree diff review (per the Nimbalyst blog results; not verified in detail). (https://github.com/stravu/crystal)
- **Redshift Hub.** "When an agent starts a dev server, the page opens right next to its pane on its own", at desktop, tablet or mobile size, with agents shown "side by side in split panes". It does not say that several worktrees' previews can be viewed together. macOS 26 on Apple Silicon only. (https://www.redshifthub.com/)
- **Worktrunk.** A worktree CLI, not an agent runner: "`hash_port` template filter gives each worktree a unique port" and post-start hooks can start dev servers. It is the cleanest documented example of the port-per-worktree convention. (https://worktrunk.dev)
- Others named in search results but not read at source: Parallel Code (johannesjo/parallel-code) and Nimbalyst. Not evaluated.

## What none of them do for the Variant gate

The Variant gate is Somya comparing every running Variant side by side: 3 or 4 branches of one surface, each its own worktree, each with its dev server up.

Pieces that exist today:

| Piece | Who has it |
|---|---|
| One worktree per Variant, created in parallel | All of them |
| Per-worktree dev-server port allocation | Conductor (10 ports/workspace), Claude Desktop (`autoPort` + `PORT`), Worktrunk (`hash_port`). Superset says it does not |
| An embedded browser for the dev server | Superset, Conductor (browser preview in 0.62.0), Claude Desktop, Cursor, Redshift Hub, Vibe Kanban |
| Several workspaces on screen at once | Superset (one window per workspace), Claude Desktop (two-session split), Redshift Hub (split panes) |
| Race several agents on one prompt and pick | Superset recipe, Cursor `/best-of-n`, Conductor (archive the losers) |

What I could not find in any tool's documentation:

1. A single comparison surface showing 3 to 4 Variants' live UIs together (same viewport, same route or state), with the dev servers started and ports allocated for you. The Superset and Claude Desktop options are manual arrangements of separate windows or panes, and I could not confirm that either shows more than two previews at once.
2. Notes attached to each Variant while you look at it, and a recorded decision ("winner", "combine A's header with C's motion") stored as data.
3. A pick that flows back: handing the notes to the winning Variant's agent, or to a Deliver-phase agent, and discarding the rest.
4. Comparison of Variants by running UI rather than by diff. Every race or best-of-N flow read here compares text diffs and agent summaries.

Where the line should fall, as a recommendation from this research and not a finding in any source: a Friday-specific Variant gate tool earns its place only on points 1 to 3 (ports, side-by-side live view, notes plus pick). Worktree creation, running agents, diffs, PRs, merging and notifications are already covered, so the tool should read plain git worktrees and a documented port convention and not replace Superset, Conductor or Claude Code.

## Not verified

- Redshift Hub, Worktrunk, Nimbalyst: read their own landing pages only, no deeper docs or repos. Redshift's licence and review flow are unstated.
- Conductor's licence and open/closed status are not stated on the pages read; the "Melty Labs" attribution is from a search-result summary. Whether its browser preview can show more than one workspace is unconfirmed.
- Whether Claude Desktop's two-pane split shows two live previews at once is not stated in the docs.
- Whether Claude Code agent view and background sessions are limited to certain plans: the docs say they consume subscription usage but do not name plans.
- Noodle supporting any agent beyond Claude and Codex: nothing found, nothing ruled out.
- Cursor's exact plan tiers: the pricing page as fetched (Free, Plus $8, Premium $30, Super $100, Ultra $200) differs from third-party reviews. Cursor "up to 8 parallel agents" appeared only in a third-party review and is not claimed above; the official doc says no limit is stated.
- Claude Code's own licence: not stated in the docs read.
- The FAQ statement that Superset supports macOS "Apple Silicon and Intel" is from its docs; I did not test the installed app.

## Sources

Web pages (read 2026-10-13):

- Claude Code docs: https://code.claude.com/docs/en/overview, /sub-agents, /worktrees, /agents, /agent-view, /agent-teams, /workflows, /scheduled-tasks, /routines, /claude-code-on-the-web, /desktop
- Claude pricing: https://claude.com/pricing
- Superset: https://superset.sh/llms.txt, https://docs.superset.sh/, repo docs at https://github.com/superset-sh/superset/tree/main/apps/docs/content/docs (`ports.mdx`, `browser.mdx`, `faq.mdx`, `multiple-windows.mdx`, `recipes/race-agents.mdx`), `LICENSE.md`
- Cursor: https://cursor.com/pricing, https://cursor.com/changelog, https://cursor.com/docs/cloud-agent, https://cursor.com/docs/agent/overview, https://cursor.com/docs/agent/agents-window, https://cursor.com/docs/configuration/worktrees, https://cursor.com/docs/agent/tools/browser, https://cursor.com/help/ai-features/multi-agent
- Noodle: https://poteto.github.io/noodle/, https://github.com/poteto/noodle (README.md, INSTALL.md, `docs/concepts/modes.md`, `brain.md`, `scheduling.md`, `runtimes.md`, `docs/reference/configuration.md`)
- Conductor: https://www.conductor.build/, /docs/, /docs/concepts/parallel-agents, /docs/concepts/workspaces-and-branches, /pricing, /changelog
- Vibe Kanban: https://github.com/BloopAI/vibe-kanban, https://vibekanban.com/blog/shutdown
- Claude Squad: https://github.com/smtg-ai/claude-squad
- Crystal: https://github.com/stravu/crystal
- Redshift Hub: https://www.redshifthub.com/
- Worktrunk: https://worktrunk.dev

GitHub repository metadata (via `gh repo view`, 2026-10-13): superset-sh/superset, poteto/noodle, BloopAI/vibe-kanban, smtg-ai/claude-squad, stravu/crystal.

Local files read, not modified: `~/.claude/settings.json` (Superset hook entries), `~/.superset/hooks/notify.sh`, `/Applications/Superset.app` Info.plist (version 1.12.5), `/Applications/Cursor.app` `package.json` (3.24.12).

Search-result summaries (secondary, used only to find primary sources or flagged as unverified above): web searches for Superset, Conductor, Cursor pricing, Vibe Kanban shutdown, and worktree preview tools.

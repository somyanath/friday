# pstack portability: what works outside Cursor, and under what licence

Ticket: #4. Researched 2026-10-13.

Source read: `cursor/plugins` at commit `dbf49813a39c1a5389c5e28cb8e4c1c2379e2454` (shallow clone, read as data, nothing run), plugin version 0.15.23 (`pstack/plugin.json`). Every `pstack/...` and `cursor-team-kit/...` path below is relative to that repo root and links to `https://github.com/cursor/plugins/blob/dbf49813a39c1a5389c5e28cb8e4c1c2379e2454/<path>` (read 2026-10-13). Doc claims cite the doc URL, read 2026-10-13.

## Short answer

**Licence.** Both pstack and cursor-team-kit are plain MIT (`pstack/LICENSE`, copyright 2026 Lauren Tan; `cursor-team-kit/LICENSE`, copyright 2026 Cursor; the two licence bodies are identical after the copyright line). MIT lets Friday copy, modify and keep the result in a private repo. The one condition is to keep the copyright and permission notice with the copied files. No other licence file or "adapted from" notice turned up inside pstack (grep, see Sources). Not legal advice.

**pstack is built for Cursor but its content mostly loads in Claude Code.** pstack says so itself: "pstack is built for Cursor. Its skills use the Agent Skills format, so other tools can read them. But most workflow skills, including `/poteto-mode`, `/how`, `/why`, and `/teach`, spawn Cursor subagents with per-role models, and Custom Modes and `/loop` are Cursor features, so those parts may not work there" (`pstack/skills/poteto-help/SKILL.md`, line 45). Claude Code follows the same Agent Skills standard and honours the frontmatter pstack uses (`disable-model-invocation`, `paths`), per https://code.claude.com/docs/en/skills (read 2026-10-13). So the text (principles, playbooks, prose skills) ports with little or no change, while the spawn mechanics need rewriting.

**Counts, checked against the source.** 53 skill directories (29 workflow skills plus 24 `principle-*`), 23 playbooks, 2 subagents, plus a dormant automation pack (benny) and bun/TS helper scripts. The earlier-reading figures hold: 23 playbooks, 24 principles, `poteto-agent` and `comment-sicko`.

**Model routing is the main thing Claude Code cannot copy exactly.**
- pstack routes by role: code delegates (feature, refactoring, bug-fix, perf, hillclimb, how/why explorers, swarm workers) go to `grok-4.7-xhigh-fast`; prose, judgment and the hardest changes go to `claude-opus-5-5-xhigh`; review panels (interrogate, arena, architect) run one reviewer per model on both (`pstack/skills/poteto-mode/SKILL.md` "Subagents" section; `pstack/skills/setup-pstack/SKILL.md` step 5).
- Claude Code can express role-to-model routing: a subagent's `model` accepts `sonnet`, `opus`, `haiku`, `fable`, a full ID such as `claude-opus-5-5`, or `inherit`, and the per-invocation `model` parameter wins over the frontmatter (https://code.claude.com/docs/en/sub-agents, read 2026-10-13). Skills and subagents also take an `effort` field (`low` to `max`) (https://code.claude.com/docs/en/skills).
- Claude Code cannot run Grok. Anthropic "doesn't support routing Claude Code to non-Claude models through any gateway" (https://code.claude.com/docs/en/llm-gateway, read 2026-10-13). Every Grok role has to map to a Claude model.
- The cost: pstack's review panels get their signal from model diversity ("The adversarial signal comes from model diversity", `pstack/skills/interrogate/SKILL.md`, line 9). Two Claude models are less independent than Claude plus Grok. Treat interrogate and arena as weaker on Claude Code, not equivalent.

**What each pending decision needs to know.**

- *Which agent tool and subscription does Friday run on?* Nothing in pstack forces Cursor for the thinking parts. What Cursor-only features Friday would give up: Grok models, cloud workers (`environment: "cloud"` in swarm and orchestrate), Custom Modes, Bugbot triage, Grok Bot (`make-bot-ui`), Origin CLI integration. Of those, only cloud workers and Grok are things Friday's fleet and fan-out might miss; Claude Code has worktree isolation for subagents (`isolation: worktree`) and cloud routines (https://code.claude.com/docs/en/sub-agents, https://code.claude.com/docs/en/scheduled-tasks). Cursor also reads `.claude/skills/` and `.claude/agents/` (https://cursor.com/docs/skills, https://cursor.com/docs/subagents, read 2026-10-13), so skills written once can run in both tools. Pricing is the other ticket's job.
- *Which installed skills does Friday keep, cut, merge or replace?* Keep or adopt with edits: the 24 principles (pure prose; no Cursor tokens in any of them), `unslop`, `technical-writing`, `tdd`, `blast-radius`, `correct`, `benchmark-checklist`, `no-comments` plus `comment-sicko`, `show-me-your-work`, `create-verification-skill` (retarget path), `architect`, `how`/`why`/`teach` (retarget spawns). Likely cut or replace: `setup-pstack`, `poteto-help`, `make-bot-ui`, `automate-me` (replace with Friday's own), `recall`/`reflect` (rewrite for `~/.claude` transcripts). Overlaps with installed skills (unslop vs `emil-unslop-*`, tdd vs `mattpocock-skills:tdd`, how/why vs Matt's diagnosing and codebase skills) are for the verdict ticket to merge; this report only says which pstack parts exist and port.
- *What is Friday's single entry command and which playbooks does it route to?* `/poteto-mode` is a router whose steps are playbook files; the pattern ports, the file does not (it hard-codes Cursor spawn rules, Bugbot, Origin and cursor-team-kit). pstack itself expects people to write their own router: `/automate-me` "drafts a `<your-name>-mode` skill ... and routes through pstack underneath" (`pstack/README.md`). For Somya's solo, UI-heavy work, the playbooks worth routing to are Prototype, Feature, Bug fix, Refactoring, Visual parity, Investigation, Eval, Authoring a skill, Opening a PR, Session pickup, Pause safely, Worktree cleanup and, later, Autonomous run. The team-scale ones (Orchestrate, Autopilot-full, Autopilot-stack, Shipping, Multi-phase plan, the benny pack) assume infrastructure Somya does not have. Details in the fit column below.

## Verdict key

- **Portable**: runs in Claude Code as written, or after renaming a path. No Cursor tool or service required.
- **Partial**: the method ports; named parts need rewriting. The Notes column says which.
- **Cursor-only**: depends on a Cursor service, file format or product feature; replace rather than port.

Recurring Cursor dependencies and their Claude Code counterpart:

| Cursor feature pstack uses | Where | Claude Code counterpart | Verified |
|---|---|---|---|
| `Task` tool with `subagent_type: generalPurpose`, `readonly`, `run_in_background`, `model` | how, why, reflect, interrogate, arena, swarm, poteto-mode | `Agent` tool; `model` per call or in frontmatter; read-only via `tools` allowlist or `permissionMode: plan` (no `readonly` field); `background` frontmatter | sub-agents doc |
| `environment: "cloud"`, `cloud_base_branch` | swarm, orchestrate, multi-phase-plan | no direct field; nearest are `isolation: worktree` and cloud routines. A cloud-isolation option appears in the Agent tool schema of this session but is availability-gated; not verified in docs | partly |
| `AskQuestion` | setup-pstack, automate-me, poteto-mode, autonomous-run | `AskUserQuestion` | tools reference |
| `~/.cursor/rules/pstack-models.mdc` (always-applied rule) | setup-pstack, poteto-mode, arena, swarm, interrogate, poteto-help | skills open it by explicit path, so any file at a new path works; Claude Code has no `.mdc` rule engine requirement here. Retarget the path | pstack source |
| Cursor transcripts at `~/.cursor/projects/<slug>/agent-transcripts/` | recall, reflect, show-me-your-work, automate-me, session-pickup, eval, worktree-audit.sh | Claude Code keeps session files under `~/.claude/projects/<project>/` (seen on disk in this session; the exact transcript layout is not documented on the pages I read) | not verified in docs |
| Cursor `/loop` | autonomous-run, bug-fix, visual-parity, guide 07 | Claude Code `/loop`, `ScheduleWakeup`, `Monitor` exist (https://code.claude.com/docs/en/scheduled-tasks). Skills marked `disable-model-invocation: true` do not fire from a scheduled loop, which matters because every pstack skill sets that flag | scheduled-tasks doc |
| Custom Modes (`icon`, `color` frontmatter) | poteto-mode | none; start each task with the command. `icon`/`color` are ignored | skills doc |
| Built-in `/create-skill`, `/babysit` | authoring-a-skill, automate-me, babysit | no built-in of that name found; write the step inline | not found in docs |
| Bugbot, Origin CLI (`origin pr`), Graphite `gt` | babysit, shipping, autopilot-*, multi-phase-plan, orchestrate | none. `gh` is pstack's own default and works | pstack source |

## Components

Paths are relative to `pstack/` unless they start with `cursor-team-kit/`.

### Router, subagents, config

| Component | Path | Verdict | Notes |
|---|---|---|---|
| poteto-mode (router, autonomy rules, principle index) | `skills/poteto-mode/SKILL.md` | Partial | Router shape ports. Hard-wires Cursor `Task` defaults, `AskQuestion`, Custom Modes, Bugbot, `drive`, `cursor-team-kit`, built-in `create-skill`. |
| poteto-agent (subagent) | `agents/poteto-agent.md` | Partial | Uses Cursor's `is_background: true` (Claude Code's field is `background`) and searches `~/.cursor/plugins/` for `poteto-mode`. Claude Code subagents are Markdown with YAML frontmatter, so it is a rename plus a path fix. |
| comment-sicko (subagent) | `agents/comment-sicko.md` | Portable | Reads a diff and reports. No Cursor tools. |
| setup-pstack | `skills/setup-pstack/SKILL.md` | Cursor-only | Writes `~/.cursor/rules/pstack-models.mdc`, detects slugs through Cursor's `Task`, offers Grok slugs. Replace with a plain model-map file or subagent frontmatter. |
| poteto-help | `skills/poteto-help/SKILL.md` | Cursor-only | Documents Cursor install, Custom Modes, built-ins. Cut. |

### Playbooks (23, all in `skills/poteto-mode/playbooks/`)

| Playbook | Verdict | Notes | Fit for Somya |
|---|---|---|---|
| investigation | Portable | Routes through how/why. | Good. |
| bug-fix | Partial | Needs control-ui style repro, how/why, Cursor `/loop` mention, delegation model line. | Good. |
| perf-issue | Partial | Same delegation lines; uses benchmark-checklist. | Occasional (Next.js bundle, render perf). |
| hillclimb | Partial | Metric loop with a frozen harness; delegation model line. | Rare; useful for Lighthouse-type goals. |
| runtime-forensics | Portable | Method only, live instrumentation. | Rare. |
| trace-forensics | Portable | Method only, profiles and heap snapshots. | Rare. |
| feature | Partial | `how`, `architect`, delegation model line, `interrogate` on contested design. | Good; the default build path. |
| refactoring | Partial | Same as feature. | Good. |
| prototype | Portable | Vanilla HTML switcher with labelled variants; screenshots via the control skill. Closest match to Friday's Variant idea (compare running options, then pick). | Best fit. |
| visual-parity | Portable | Image-diff baseline, one component per worktree. Needs a screenshot harness (Playwright). | Good for redesigns and styling migrations. |
| authoring-a-skill | Partial | Calls Cursor's built-in `create-skill`; replace with a Friday skill-writing step. | Good. |
| eval | Partial | Reads Cursor transcripts to check agent behaviour; retarget path. | Fits the map's "proving skills work" topic. |
| babysit | Partial | Uses `scripts/watch-pr` (bun, `gh`), Bugbot triage, Origin; single-PR mode works with `gh` alone. | Light use. |
| shipping | Partial | Verify-then-land a stack via `gh` or Origin. | Team-scale; skip. |
| autonomous-run | Partial | Cursor `/loop`, `AskQuestion`. Claude Code has `/loop`, but pstack skills are `disable-model-invocation`, so a scheduled fire will not run them. | Later; the map's unattended-runs topic. |
| orchestrate | Cursor-only (in practice) | Coordinator plus dozens to hundreds of cloud subagents, `bun scripts/orch`, `gt` stacking, Cursor dashboard, Cursor Projects. | Assumes a team; skip. |
| autopilot-full | Partial | One owner per PR, swarm-verify, merge. Cloud workers, Origin, Bugbot. | Team-scale; skip. |
| autopilot-stack | Partial | Same, delivers a stacked chain. | Skip. |
| session-pickup | Partial | Resume from transcript or cloud-agent URL; retarget path. | Useful for fleet sessions. |
| pause-safely | Portable | Commit a WIP checkpoint and write a resume note. | Good. |
| multi-phase-plan | Partial | Plan skeleton and `scripts/check-plan.mjs`; assumes stacked PRs, cloud VMs, Bugbot, cursor-team-kit control skills. | Large-feature only. |
| worktree-cleanup | Partial | `scripts/worktree-audit.sh` assumes Cursor's worktree and transcript dirs; also prunes iOS simulators. | Useful once Friday runs a fleet of worktrees. |
| opening-a-pr | Partial | `gh` default; mentions Origin, built-in PR tool, `/deslop`, `/no-comments`. | Good after trimming. |

### Skills (29, all in `skills/`)

| Skill | Verdict | Notes |
|---|---|---|
| architect | Partial | Runs arena with two runner models; needs the model-map retarget. |
| arena | Partial | N candidates, base pick, grafting. Spawns per model, reads the `.mdc` path. Works with Claude-only runners. |
| automate-me | Partial | Mines Cursor transcripts and uses `AskQuestion` and built-in `create-skill`. Pattern useful for Friday's self-improvement topic. |
| benchmark-checklist | Portable | Prose checklist. |
| blast-radius | Portable | Prose; mentions Solid vs React as examples. |
| bro | Portable | One-line restate prompt. |
| correct | Portable | Turn repeated mistakes into structure. |
| create-verification-skill | Partial | Writes `.cursor/skills/verify-<app>/`; change to `.claude/skills/`. Content is general. |
| figure-it-out | Portable | Designs a bespoke playbook; no Cursor tool found by grep. |
| how | Partial | Explorer and explainer subagents with `readonly: true` and role models. |
| in-your-own-words | Portable | One-line prompt. |
| interrogate | Partial | Multi-model panel; Claude-only panel loses diversity. |
| ketchup | Partial | Catch-up reply; depends on a `/visualize` chart command and screenshots. I did not verify `/visualize` exists in Claude Code. |
| maintain-verification-skill | Partial | Same `.cursor/skills/verify-*` paths. |
| make-bot-ui | Cursor-only | Builds a page that wakes a Grok Bot through a Cursor webhook routine (`update_state`, `SendToUser`, `api2.cursor.sh/automations/webhook`), exposed on Tailscale. |
| no-comments | Partial | Spawns comment-sicko with `Task`. |
| poteto-help | Cursor-only | See above. |
| poteto-mode | Partial | See above. |
| recall | Partial | Reads Cursor transcripts; uses the `why` skill's MCP list. |
| reflect | Partial | Three parallel reviewers plus synthesizer over a Cursor transcript. |
| setup-pstack | Cursor-only | See above. |
| show-me-your-work | Portable | TSV decision log; only the end-of-run check reads a Cursor transcript path. |
| swarm | Partial | Spawns with `environment: "cloud"`. Becomes worktree-isolated or local subagents. This is the closest pstack analogue of Friday's Fan-out and Fleet. |
| tdd | Portable | Failing-test-first cadence. |
| teach | Partial | Runs `how` and `why`; inherits their spawn changes. |
| technical-writing | Portable | Pure writing standard. |
| typescript-best-practices | Portable | `paths: ["**/*.ts", "**/*.tsx"]`, which Claude Code supports; relevant to Next.js work. |
| unslop | Portable | Pure writing rules. |
| why | Partial | Lists MCPs from the "Cursor environment" (`mcps/` directory) and spawns investigators per MCP; Friday has no source-control/Slack/Datadog MCP set. |

### Principle skills (24, all `skills/principle-*/SKILL.md`)

Verdict for all 24: **Portable.** A grep for `cursor`, `AskQuestion`, `Task`, `grok` and `subagent_type` across `skills/principle-*` returned no hits. I read each description; I did not read every leaf in full.

attack-the-premise, boundary-discipline, build-the-lever, encode-lessons-in-structure, exhaust-the-design-space (maps to Friday's Variants: "Build 2-3 competing prototypes and compare side by side"), experience-first, explain-the-number, fix-root-causes, foundational-thinking, guard-the-context-window, laziness-protocol, make-operations-idempotent, migrate-callers-then-delete-legacy-apis, minimize-reader-load, model-the-domain, never-block-on-the-human (fits "human approval at design gates" only if gates are named as exceptions), outcome-oriented-execution, prove-it-works, redesign-from-first-principles, separate-before-serializing-shared-state (useful for Fleet worktrees), sequence-verifiable-units, subtract-before-you-add, test-behavior-not-implementation, type-system-discipline.

### Scripts and extras

| Component | Path | Verdict | Notes |
|---|---|---|---|
| watch-pr | `skills/poteto-mode/scripts/watch-pr/` | Partial | bun + TypeScript GitHub poller; recognises Cursor's Bugbot author. Needs `bun` installed; `bootstrap.ts` installs `commander`. Not run here. |
| orch | `skills/poteto-mode/scripts/orch/` | Cursor-only (scale) | Ledger/frontier store for orchestrate. |
| check-plan.mjs | `skills/poteto-mode/scripts/check-plan.mjs` | Portable | Plan-skeleton linter. |
| worktree-audit.sh | `skills/poteto-mode/scripts/worktree-audit.sh` | Partial | Reads `~/.cursor/projects/.../agent-transcripts`. |
| bugbot-triage reference | `skills/poteto-mode/references/bugbot-triage.md` | Cursor-only | Triage of Cursor Bugbot comments. |
| benny automation pack | `automations/benny/` | Cursor-only | Slack triage, Cursor automations, copies into `.cursor/automations/`. Dormant by design. |
| guide | `docs/guide/` | Reference | Describes the Cursor install and flows. |

### cursor-team-kit (referenced by pstack, separate plugin)

| Component | Verdict | Notes |
|---|---|---|
| deslop | Portable | Pure diff-vs-main cleanup prompt (`cursor-team-kit/skills/deslop/SKILL.md`). |
| control-ui | Portable | Playwright/CDP harness; reuses the repo's own Playwright (`.../control-ui/SKILL.md`). Needs Playwright in the project. Fits Next.js verification. |
| control-cli | Portable | tmux/PTY harness. Little use for UI work. |
| fix-ci, loop-on-ci, get-pr-comments, new-branch-and-pr, review-and-ship, fix-merge-conflicts, make-pr-easy-to-review, run-smoke-tests, check-compiler-errors, verify-this, what-did-i-get-done, weekly-review, pr-review-canvas, thermo-nuclear-code-quality-review | Portable | Git/`gh`/Playwright based; "plug and play without requiring third-party service integrations" (`cursor-team-kit/README.md`). Only grep hit for "cursor" is in the next two rows. |
| workflow-from-chats | Cursor-only | Mines "recent Cursor chats". |
| ci-watcher, thermo-nuclear-code-quality-review (agents) | Partial | Subagent files; thermo agent is "Invoked via Task". Rename frontmatter fields as for poteto-agent. |
| rules `typescript-exhaustive-switch.mdc`, `no-inline-imports.mdc` | Partial | Cursor `.mdc` rules. Content ports into `CLAUDE.md` or a project rule; the file format does not. |

## Fit for Somya's work

Suits solo, UI-heavy, parallel work with human gates: Prototype (the switcher of labelled variants is Friday's Variant idea in miniature), Visual parity, Feature, Bug fix, Refactoring, Investigation, Pause safely, Session pickup, Worktree cleanup, Opening a PR (via `gh`), Eval, Authoring a skill. Principles `exhaust-the-design-space`, `experience-first`, `separate-before-serializing-shared-state` and `prove-it-works` line up with the Direction, Variant and Fleet ideas.

Mismatch to resolve: pstack's `never-block-on-the-human` and "Under a full-autonomy grant, decide ... and report it" (`skills/poteto-mode/SKILL.md`) pull against Somya's three human gates. The Always-pause list there covers only irreversible writes, not design choices. A Friday router would need to add the three gates as explicit stops.

Assumes a team or infrastructure Somya lacks: Orchestrate (hundreds of cloud subagents, Cursor Projects), Autopilot-full and Autopilot-stack (stacked PRs, Origin CLI, Bugbot), Shipping, Multi-phase plan (cloud VMs per lane), benny (Slack issue triage), the `why` skill's MCP sweep (source control, issue tracker, chat, observability), and Bugbot triage. pstack's own advice agrees: "Save `/poteto-mode` for work that needs rigor" because it "spends extra tokens on subagents and review panels" (`skills/poteto-help/SKILL.md`). Token cost matters against the ₹3000/month cap.

## Licence detail

- `pstack/LICENSE`: "MIT License / Copyright (c) 2026 Lauren Tan". `pstack/plugin.json` also says `"license": "MIT"`. Root `README.md` of `cursor/plugins` ends with "## License / MIT".
- `cursor-team-kit/LICENSE`: "MIT License / Copyright (c) 2026 Cursor". Same body text as pstack's (diffed, identical after line 3).
- What MIT allows: use, copy, modify, merge, publish, distribute, sublicense, sell, with the notice kept in "all copies or substantial portions". Copying into a private repo and editing is allowed. Practical rule for Friday: when vendoring files, keep a copy of each `LICENSE` beside them and leave the copyright line intact.
- pstack ships a README line "fork it. improve it. make it yours. PRs are welcome!" (`pstack/README.md`), consistent with the licence.
- Public-repo caution from the map notes: Friday is private and vendors MIT files; nothing public should include them without the notice. Public material that merely cites pstack's ideas needs no notice.
- Not verified: whether any skill text copies material from a third party under a different licence. Grep for "adapted from / derived from / licensed under / Creative Commons / Apache" found no such notice; `technical-writing` names Diataxis, Google developer style and ASD-STE as influences but I did not compare text against those sources. MIT's silence on trademarks also means the names "pstack" and "Cursor" are not granted by the licence; I did not research trademark policy.

## Not verified

- The exact location and format of Claude Code session transcripts (needed by recall, reflect, session-pickup). Seen on disk under `~/.claude/projects/`, not confirmed from docs.
- Whether Claude Code has a `/visualize` command (ketchup) or a built-in `/create-skill` (authoring playbooks).
- Whether Claude Code accepts a root-level `plugin.json` (pstack has `plugin.json`, `.cursor-plugin/plugin.json` and no `.claude-plugin/`). Claude Code's documented manifest is `.claude-plugin/plugin.json` (https://code.claude.com/docs/en/plugins). Simplest route is copying skill folders into `.claude/skills/` rather than installing pstack as a plugin.
- The model slugs `grok-4.7-*` and `claude-opus-5-5-*` as served by Cursor; I did not check Cursor's model list or pricing.
- Behaviour of any skill at runtime: nothing was installed or run.
- Per-skill review: skill bodies were read selectively (router, setup, swarm, arena, interrogate, how, why, reflect, recall, automate-me, show-me-your-work, ketchup, make-bot-ui, create-verification-skill, poteto-help, both agents; playbooks feature, prototype, visual-parity and bug-fix in full, the other nineteen by targeted grep of their Cursor-specific lines); the rest were classified from frontmatter plus a repo-wide grep for Cursor-specific tokens.

## Sources

Repo (all at commit `dbf49813a39c1a5389c5e28cb8e4c1c2379e2454`, read 2026-10-13; base URL `https://github.com/cursor/plugins/blob/dbf49813a39c1a5389c5e28cb8e4c1c2379e2454/`):
- `pstack/LICENSE`, `pstack/plugin.json`, `pstack/.cursor-plugin/plugin.json`, `pstack/README.md`
- `pstack/skills/poteto-mode/SKILL.md`, `pstack/skills/poteto-mode/playbooks/*.md`, `pstack/skills/poteto-mode/scripts/`
- `pstack/skills/setup-pstack/SKILL.md`, `pstack/skills/poteto-help/SKILL.md`, `pstack/skills/swarm/SKILL.md`, `pstack/skills/arena/SKILL.md`, `pstack/skills/interrogate/SKILL.md`, `pstack/skills/how/SKILL.md`, `pstack/skills/why/SKILL.md`, `pstack/skills/reflect/SKILL.md`, `pstack/skills/recall/SKILL.md`, `pstack/skills/automate-me/SKILL.md`, `pstack/skills/make-bot-ui/SKILL.md`, `pstack/skills/show-me-your-work/SKILL.md`, `pstack/skills/ketchup/SKILL.md`, `pstack/skills/create-verification-skill/SKILL.md`
- `pstack/agents/poteto-agent.md`, `pstack/agents/comment-sicko.md`
- `pstack/docs/guide/01-setup.md`, `07-overnight.md`, `09-make-it-yours.md`
- `cursor-team-kit/LICENSE`, `cursor-team-kit/README.md`, `cursor-team-kit/skills/*/SKILL.md`, `cursor-team-kit/agents/*.md`, `cursor-team-kit/rules/*.mdc`
- `README.md` (repo root, licence section)

Docs (read 2026-10-13):
- https://code.claude.com/docs/en/skills (frontmatter fields, locations, Agent Skills standard)
- https://code.claude.com/docs/en/sub-agents (model values and order, `background`, `isolation`, nesting, locations)
- https://code.claude.com/docs/en/plugins (manifest at `.claude-plugin/plugin.json`)
- https://code.claude.com/docs/en/model-config (aliases `sonnet`, `opus`, `haiku`, `fable`; gateways)
- https://code.claude.com/docs/en/llm-gateway (no non-Claude models through a gateway)
- https://code.claude.com/docs/en/scheduled-tasks (`/loop`, routines, scheduled skills must be model-invocable)
- https://code.claude.com/docs/en/tools-reference (`Agent`, `AskUserQuestion`, `Monitor`, `ScheduleWakeup`)
- https://cursor.com/docs/skills (skill dirs incl. `.claude/skills`, frontmatter, Custom Modes)
- https://cursor.com/docs/subagents (`model`, `readonly`, `is_background`, reads `.claude/agents`)

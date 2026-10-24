# Entry command

**Status:** decided (2026-10-24) in [What is Friday's single entry command and which playbooks does it route to?](https://github.com/somyanath/friday/issues/11). Nothing here is built yet.

`/friday` is the one command Somya types to start any task in a Friday project. It picks the task's Route and hands it to that Route's Playbook. It replaces `ask-matt`, `poteto-mode` and `poteto-help`, and carries what the [skill rulings](skill-rulings.md#what-other-friday-pieces-receive) give it. Playbooks never start on their own (ADR-0009).

## Input

| Somya types | What happens |
|---|---|
| `/friday <task>` | Picks a Route for the task |
| `/friday #42` or an issue URL | Works from that issue, and reuses it as the job's issue |
| `/friday <PR link>` | The PR stage or the merge step, from what Somya asks |
| `/friday` alone | Lists what's in flight in this project (open Pickup notes, open PRs, frontier tickets) and asks which to pick up |
| `/friday <question about Friday>` | Answers it with a ready-to-send prompt and a link to the file the answer came from. No work starts. |

- **Name:** a plugin skill named `friday`. Claude Code accepts the bare `/friday` unless another command already uses that name, and `/friday:friday` always works. Confirm the bare name at build time.
- **Help answers** read a skill's file before describing it, and know the skills only Somya runs (below).

## How it reaches skills (ADR-0009)

- **Playbooks** set `disable-model-invocation: true`, so Claude can't start them and the Skill tool refuses them.
  - `/friday` reads the Playbook's `SKILL.md` by path under `${CLAUDE_PLUGIN_ROOT}/skills/`.
  - It opens a todo list. The first item is that path; the next items are the Playbook's steps, copied word for word. A step it doesn't do stays as `skip: <reason>`.
  - After compaction, the agent re-reads the Playbook from the first item, because a file read by path isn't re-attached.
  - Somya may type a Playbook directly, such as `/friday:friday-debugging`. It then runs without the Route line, the restate and the checks. The gates and the Always-pause list still hold, because settings enforce them (ADR-0007).
- **Reference skills** stay open to Claude. A Playbook step starts one through the Skill tool, and Claude may start one on its own when it fits.
- **Emil's skills** are reached as the rulings say: called by name or read by path, never on their own.

| Kind | Skills |
|---|---|
| Playbook | the design skill, `friday-implement`, `friday-debugging`, `friday-unattended-run`, `friday-architect`, `friday-to-tickets`, `friday-pickup-note`, `friday-retro`, `matt-grill-with-docs`, `matt-to-spec`, `matt-wayfinder`, `matt-improve-codebase-architecture`, `pstack-how`, `pstack-ketchup`, `pstack-correct`, `pstack-create-verification-skill`, `pstack-maintain-verification-skill`, and the merge step, weekly sweep and Upstream check from the fog |
| Reference skill | `friday-tdd`, `friday-review`, `friday-pr`, `friday-prototype`, `friday-research`, `friday-writing-for-agents`, `matt-grilling`, `matt-domain-modeling`, `matt-codebase-design`, `matt-wizard`, `pstack-principles`, `pstack-typescript-best-practices`, `pstack-technical-writing`, `pstack-unslop`, `pstack-decision-trail`, `pstack-fan-out`, `pstack-visual-parity`, `pstack-in-your-own-words` |
| Only Somya runs it | `pstack-sharpen`, `pstack-automate-me`, `matt-setup-ts-deep-modules`, `matt-wait-what`, and Emil's `emil-product-thinking` and `emil-ask-lapse`. `/friday` names them and never runs them. |

## Picking the Route

Three questions, in order:

1. **Will it change what a user sees?** Nothing changes: read-only. What a user sees changes: UI work. Otherwise: Non-UI work.
2. **UI work: Surface or Refinement?** Does the Design language, or the look already shipped where none is written down, already answer how it should look? Yes: Refinement. No: Surface.
3. **Which job, and how big?** New behaviour, a bug, performance, a refactor, or an open question. Fits one session, needs several, or is too foggy to plan.

| Case | Route |
|---|---|
| A new `/settings` page that follows the app's Design language | Refinement |
| A new hero section with a different look, the rest of the page unchanged | Surface, scoped to that section |
| Reworking a section built before Friday, keeping its look | Refinement. How its Design language gets written down is the design skill's job. |
| The pricing button is the wrong blue | Refinement, bug |
| A slow query or a failing cron job | Non-UI work, bug |

- **A bug is a job, not a kind of work.** A bug users can see waits for the Ship gate like any Refinement; one they can't see merges on its Verdict like any Non-UI work.
- **Friday guesses and shows its pick.** It asks only when it can't tell UI work from Non-UI work, or a Surface from a Refinement, because a wrong guess there changes the gates or spends a Fleet. It infers the size, and Somya corrects it.
- **A leading word overrides the guess:** `surface`, `refinement` or `non-ui`.
- **A refactor of UI code** meant to change nothing a user sees routes as Non-UI work with `pstack-visual-parity`. It still stops for Somya's merge, because it touches a Pause path, and the Route line says so.
- **Mixed work** is split when the Non-UI part can be verified and merged alone, such as a schema, an API or a job. That part goes first, and the UI job builds on it. When the Non-UI code exists only to feed this UI, such as a hook or prop used in one place, the whole job stays together as UI work.

## The Route line and the restate

```
Route: Refinement · bug · one session → design skill (Refinement path) → Ship gate · Sonnet 5.5
```

- **The restate** (`pstack-in-your-own-words`) runs on every Route that writes code or spends a Fan-out, a Fleet or an Unattended run. It goes in the same message as the Route line, and Somya's one yes covers both.
- **Skipped** for read-only Routes, and when Somya's message already names the exact change: `skip: restate (change named exactly)`.
- **Never skipped** before an Unattended run that Somya starts.
- **In a session Friday started** (a Fleet session), the Route line is printed without waiting and the restate is skipped: `skip: restate (Finish condition approved on the ticket)`.

## Checks before routing

Each check is mentioned only when it changes what Friday will do.

| Check | When it fails |
|---|---|
| A Project record exists | Friday isn't switched on here. Say so and stop. |
| The Autonomy level | Sets how far Non-UI work runs. An Unattended run is refused, with the reason, in a project at attended. |
| A Verification skill exists | The Route's first step becomes making one (`pstack-create-verification-skill`), as its own PR Somya reviews (ADR-0006), then the task. |
| Fleets already running | A Surface waits while another Fleet runs, and any Fleet waits at the caps: 4 Variant sessions in Define, 3 in other Fleets (#12). |
| A Pickup note or open PR on the same issue | Offers to carry on from it instead of starting over. |

## Issue first

- **Every job that will become a PR gets a GitHub issue** after Somya's yes. It holds Somya's words, the restate, the Finish condition and the kind of work. A task that starts from an issue reuses it.
- The branch (`<type>/<issue>-<slug>`, `refinement/<issue>-<slug>`), the PR, the Decision trail and any Pickup note all point at it.
- **`friday-pr` sets exactly one kind label** on the PR, copied from the issue, and `ui-work` whenever the diff touches a Pause path (#19).

## Route table

### Read-only: no code, no PR

| Somya types something like | Playbook |
|---|---|
| "how does X work", "why is it built like this", "should we do X or Y" | `pstack-how`. A choice between options ends with a trade-off table. |
| "research X" (docs, APIs, anything outside the repo) | `friday-research`, run in a background subagent |
| "catch me up" | `pstack-ketchup` |
| a question about Friday | `/friday` answers it itself |

### UI work

Every UI Route goes into the design skill, which picks Emil's skills (ADR-0008).

| Task | Playbook |
|---|---|
| Surface | the design skill: Discover, Define, Deliver |
| Any Refinement: new behaviour, a bug, jank, "which layout feels better" | the design skill's Refinement path, given the job. Inside it, `friday-debugging` takes a bug and `friday-prototype` (handing off to `emil-prototype`) takes a question. The design skill's ticket decides the steps. |

### Non-UI work

| Task | Playbook |
|---|---|
| New behaviour that fits one session | `friday-implement`. It grills Somya first (`matt-grilling`) only when it can't write a Finish condition from the request. |
| New behaviour needing several sessions | `matt-grill-with-docs`, then `matt-to-spec`, then `friday-to-tickets`. The tickets then run through `friday-implement` or an Unattended run. |
| Too foggy to plan | `matt-wayfinder` |
| A bug | `friday-debugging` |
| Performance | `friday-debugging`'s performance branch; its hillclimb mode for one target number |
| A refactor | `friday-implement`'s refactor branch, with `pstack-visual-parity` when UI code is touched |
| A new module shape or interface | `friday-architect` |
| An open logic question | `friday-prototype` (logic branch) |
| "Where is this codebase hurting?" | `matt-improve-codebase-architecture` |
| "Run until done", "I'm going to bed" | `friday-unattended-run`. Refused, with the reason, in a project at attended (ADR-0004). |

### PRs and pausing

| Task | Playbook |
|---|---|
| "check on PR 42", "get it green" | `friday-implement`'s PR stage. It drives the PR to ready and never merges. |
| "merge PR 42" | The merge step: the Verdict command, then `gh pr merge --squash --match-head-commit`. UI work is left for Somya to merge in the browser. At attended, the merge hook asks Somya. A background session refuses (#19). |
| "pick up where we left off" / "pause" | `friday-pickup-note`, read side / write side |

### Friday upkeep, in Friday's own repo

| Task | Playbook |
|---|---|
| "check the upstreams" | the Upstream check (ADR-0002) |
| writing or editing a skill or agent doc | `friday-writing-for-agents` |
| making or fixing a project's Verification skill | `pstack-create-verification-skill`, `pstack-maintain-verification-skill` |
| cleaning up worktrees | the weekly sweep |
| a retro | `friday-retro` |

When retro and the sweep run, and who starts them, stays in the map's fog.

## Session model

A skill's `model` setting lasts only one turn, so `/friday` can't switch the session's model. The Route line names the model the Route expects. If the session is on another one, `/friday` asks Somya to type `/model <model>` before it starts.

| Route | Session model |
|---|---|
| Surface, `matt-wayfinder`, multi-session planning, `friday-architect` | Opus 5.5 |
| Refinement, Non-UI job, bug, refactor, PR stage, Unattended run | Sonnet 5.5. The Verifier is Sol through Codex either way. |
| Read-only | Sonnet 5.5, with Haiku subagents for searching |

## How long a Route lasts

- A Route lasts until its task ends. Follow-up questions stay inside it.
- The task's last reply makes Matt's phase-boundary call, in his order: continue, `/clear`, Pickup note, subagent, `/compact`. A new task usually means `/clear`, then `/friday` again.
- `/friday`'s text stays in the conversation, and after compaction Claude Code re-attaches its first 5,000 tokens. Every rule that must hold sits in those first 5,000 tokens.

## Reply rules

Carried from `poteto-mode` (see the [skill rulings](skill-rulings.md#what-other-friday-pieces-receive)):

- a skipped step stays visible as `skip: <reason>`;
- evidence goes in the same sentence as the claim;
- "no" is an acceptable answer;
- the gates and the Always-pause list stop a run.

## Fleet sessions

- A session Friday starts for one job in a Fleet gets `/friday #<issue>` as its first prompt, so every job is routed the same way, whoever starts it.
- Define's Variant Builders are the exception. They get the design skill's Builder prompt.

## Friday's own repo

- **Switched on** like any project, so `/friday` routes upkeep there.
- **Autonomy fixed at attended,** never raised. Nearly every change there edits Friday's skills, hooks or rules, which decide how all later work is checked.
- **Surfaces** are added as they are designed, as in any project.
- **No Verification skill** until the repo has an app that runs, so that check is skipped. Proving that a skill change works is the map's **Proving skills work** fog.

## Facts found while deciding

- **Claude Code skills** ([skills](https://code.claude.com/docs/en/skills), read 2026-10-23):
  - "`my-plugin/skills/review/SKILL.md` with `name: fancy` becomes `/my-plugin:fancy`. The bare `/fancy` also invokes the skill unless another command already uses that name."
  - `disable-model-invocation: true` "prevent[s] Claude from automatically loading this skill", "removes the skill from Claude's context entirely", and keeps Claude from invoking it through the Skill tool.
  - `model`: "The override applies for the rest of the current turn and isn't saved to settings."
  - An invoked skill "enters the conversation as a single message and stays there across later turns." After compaction, "Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each," within a combined 25,000 tokens.
  - "Every skill in the skill listing adds to your context on every turn." The listing's budget "scales at 1% of the model's context window", and on overflow Claude Code drops descriptions, starting with the skills invoked least.
  - "Plugin skills are not affected by `skillOverrides`", so the Playbook flag lives in each owned skill's frontmatter.
- **pstack** at `88d47514b82e7c44f00f2b2a72ff6dd12158038c`:
  - `poteto-help`: "Only `/setup-pstack` loads from the user's words. The others load when the user types them or when `/poteto-mode` runs them."
  - `poteto-mode` holds a trigger list and a playbook list. The agent matches the task against them, reads the playbook, and reads each skill a step names.
  - The Claude Code adapter (`docs/harness/claude-code.md`): "`Read` `<pstack>/skills/<name>/SKILL.md` and follow it. The `Skill` tool refuses most pstack skills."
- **Matt's skills** (v1.3.1) split the same way: `implement`, `to-spec`, `to-tickets`, `wayfinder`, `grill-with-docs`, `retro` and `handoff` are user-only; `tdd`, `grilling`, `domain-modeling`, `codebase-design`, `pr`, `prototype`, `research` and `diagnosing-bugs` are open to Claude.

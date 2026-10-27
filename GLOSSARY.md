# Friday

Somya's private agent workflow: the skills, routing, and parallel-agent operating model used to build UI-heavy side projects and portfolio work with coding agents, installed into each project.

## Language

### Parallel work

**Fan-out**:
One session starting several subagents and collecting their results, such as Discover's idea lists or the agents building one piece of non-UI work.
_Avoid_: parallel agents (ambiguous), swarm

**Fleet**:
Several independent agent sessions, each in its own git worktree on its own branch, each taking its own job to the end, such as Define's four Builders.
_Avoid_: parallel agents (ambiguous), background agents

**Unattended run**:
Agent work that continues without Somya present, such as an overnight run or a scheduled job.
_Avoid_: async, autopilot

**Autonomy level**:
How far a project's non-UI work may run without Somya: attended, unattended to PR, or unattended to merge. Somya raises it per project.
_Avoid_: autopilot, trust level

**Always-pause list**:
The actions no agent takes without Somya at any autonomy level, such as force-pushing anything but its own branch, running a deploy, deleting data or merging UI work.
_Avoid_: blocklist, never list

**Pause path**:
A path in a project whose change stops a PR for Somya, because it holds what a user sees, a migration, deploy config or a check. Each project lists its own.
_Avoid_: protected path, sensitive path

**Divergent work**:
Parallel work where several agents attempt the same job and Somya keeps one result.
_Avoid_: competition, bake-off

**Convergent work**:
Parallel work where agents do different jobs and every result is kept.
_Avoid_: parallel features

### Kinds of work

**UI work**:
Any job that changes what a user sees: a Surface or a Refinement. It always stops at its gates.
_Avoid_: frontend work

**Non-UI work**:
A job that changes nothing a user sees, such as backend, data or tooling. It passes through no gate.
_Avoid_: backend work

### Starting work

**Entry command**:
`/friday`, the one command Somya types to start any task in a Friday project. It picks the task's Route and hands it to that Route's Playbook.
_Avoid_: router, mode

**Route**:
The Entry command's pick for one task: its kind of work, its job (new behaviour, a bug, performance, a refactor, a question) and the Playbook that runs it, shown to Somya in one line before work starts. A Route lasts until its task ends.
_Avoid_: lane, flow, plan

**Playbook**:
A Friday skill that runs one kind of job from start to finish, such as building a Surface or fixing a bug. Only the Entry command or Somya starts one; it never starts on its own.
_Avoid_: workflow, pipeline, flow

**Reference skill**:
A skill that holds know-how for one step, such as writing a test or a PR body. Playbooks call it, and Claude may also start it on its own when it fits.
_Avoid_: helper, utility skill

### Projects

**Project record**:
Friday's private record of one project: its Autonomy level, its Surfaces, notes, and the Gate records moved in at each Ship gate. A project's own files never hold it.
_Avoid_: project profile, project config, project notes

**Rule conflict**:
A place where a project's own rules stop or change a step of Friday's process, such as a project that asks before every commit. The project's rule wins, and Somya hears of the conflict before the step runs.
_Avoid_: clash, override

### Design process

**Surface**:
A piece of UI with its own design job, because no Design language already answers how it should look: a new app, a landing or marketing page, a new kind of page, a section given a new look, or a complete redesign. Every surface goes through the full design process.
_Avoid_: screen, feature

**Refinement**:
UI work whose look is already answered, by a Design language or, where none is written down, by the look already shipped. Examples: reworking one section, or adding a settings page that follows the app's Design language. Skips straight to building and the Ship gate.
_Avoid_: small change, tweak

**Direction**:
One distinct design idea for a surface, stated as a short brief before anything is built.
_Avoid_: concept, option

**Variant**:
A direction built for real by its own agent so it can be judged running.
_Avoid_: version, mock, option

**Design language**:
The locked visual and motion rules a surface was shipped with, and for a page that pitches something its voice, written down so later work can follow them. It lives in the project beside the code, and changes only with Somya's sign-off.
_Avoid_: style guide, theme

**Seed**:
A random string drawn for one direction, from which a script picks that direction's slots.
_Avoid_: seed string, random string

**Slot**:
One choice a seed decides for a direction, such as its concept, palette, layout or the message its page leads with.
_Avoid_: axis, dimension, parameter

**Discover**:
The phase that turns a surface's goals into four distinct directions. No gate follows it: every direction goes on to Define.

**Define**:
The phase that builds each of Discover's four directions as a variant, in parallel, half by each model family; it ends at the Variant gate.

**Deliver**:
The phase that polishes the final pick from the Variant gate and writes down its design language; it ends at the Ship gate.

**Variant gate**:
Somya's side-by-side comparison of the running variants, in two rounds: a shortlist of one or two after the image step (a combination counts as one), then a final pick among the finalists. When no shortlisted variant has a video moment, the first round picks one and there is no second. It is Somya's first look at a surface's design.

**Finalist**:
A shortlisted variant built with one of its two videos, or as it stands when it has no video moment, compared at the Variant gate's final pick.
_Avoid_: option, take, cut

**Video moment**:
A place in a variant where a generated clip belongs, such as a looping animated graphic or a transition between two states. A variant may have none.
_Avoid_: video slot, motion moment

**Ship gate**:
Somya's visual sign-off on a surface or refinement before it merges.
_Avoid_: final review

**Handoff**:
The work and its evidence an agent gives Somya at a gate.
_Avoid_: package, submission, deliverable

**Pickup note**:
A note one session writes so another session can pick up the work: later, in another tool or folder, or alongside it. It holds the goal, progress, what's verified, next steps and pointers.
_Avoid_: handoff, handover, resume note

**Gate record**:
Somya's decision at a gate, written down: what was picked or combined, and notes for the next step.
_Avoid_: verdict, approval, result

**Element note**:
A note Somya pins to one element of a running variant at the Variant gate, saved with enough to find that element again.
_Avoid_: annotation, pin, comment

**Family reveal**:
Telling Somya which model family built each variant, once a round's pick at the Variant gate is written.
_Avoid_: unblinding

### Agents and models

**Builder**:
The agent that writes one change on its own branch: a variant, or one piece of non-UI work.
_Avoid_: implementer, worker, owner

**Host session**:
A Claude Code session that runs the loop for a Builder from another model family and calls that Builder for every line of code, writing none itself.
_Avoid_: wrapper, proxy

**Critic**:
The agent that judges a running variant's screenshots against its direction and sends it back for another round until it passes. Distinct from a Verifier, which checks that the code works.
_Avoid_: reviewer, judge

**Verifier**:
An agent that checks work it did not write and gives a Verdict, from the other model family where possible.
_Avoid_: reviewer, judge, checker

**Agent account**:
The GitHub machine account every agent pushes, opens PRs and merges under in Friday projects, kept apart from Somya's own account.
_Avoid_: bot, bot account, machine user

**Model family**:
The models from one vendor, such as Claude (Haiku, Sonnet, Opus) or GPT (Luna, Sol, Astra).
_Avoid_: provider, vendor

### Verification

**Verification**:
An agent proving its own work on the running app, with evidence, before the work goes on: to Somya at a gate, or to a merge.
_Avoid_: testing, self-review, QA

**Verification skill**:
A project's own skill, one per app, that launches that app, drives it the way a user does, and captures evidence, with a feature map of what to check. A project holding several apps has one for each.
_Avoid_: control skill, test harness

**Feature map**:
The part of a Verification skill that lists an app's user-facing features: what each does, how a user reaches it, its gotchas, and the checks that prove it works.
_Avoid_: test plan, feature list

**Live check**:
One run of the real app through the Verification skill: a scenario, the evidence it saves, and the condition that makes it pass.
_Avoid_: live lane, smoke test

**Verdict**:
A Verifier's Pass, Fail or Inconclusive on one exact commit. A new commit voids it unless the patch is unchanged.
_Avoid_: approval, review, sign-off

**Finish condition**:
A statement of done, written before work starts, that commands can pass or fail.
_Avoid_: predicate, exit condition, definition of done, a duration

**Decision trail**:
A run's append-only log of decisions, each with its reason and a pointer to evidence, reviewed by the other model family before the work is handed back.
_Avoid_: decision log, audit log

### Skills

**Upstream**:
A skill collection made by someone else that Friday draws on: Matt Pocock's skills, Emil Kowalski's skills, or pstack.
_Avoid_: source, vendor

**Owned skill**:
A skill that lives in Friday and that Friday may change freely, whether copied from an upstream or written by Friday.
_Avoid_: fork, vendored skill

**In-place skill**:
An upstream skill Friday uses exactly as installed, never edited, copied or renamed.
_Avoid_: external skill, dependency

**Upstream check**:
A review of everything an upstream changed since Friday last looked, with a Ruling on each change for Somya to approve. It runs only when Somya asks.
_Avoid_: sync, upgrade

**Ruling**:
Friday's decision on one upstream piece: keep, cut, merge or replace for a skill, or adopt, adapt or skip for an upstream change.
_Avoid_: verdict, disposition

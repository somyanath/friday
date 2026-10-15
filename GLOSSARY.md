# Friday

Somya's private agent workflow: the skills, routing, and parallel-agent operating model used to build UI-heavy side projects and portfolio work with coding agents, installed into each project.

## Language

### Parallel work

**Fan-out**:
One session spawning several subagents on the same problem, whose results come back to that session for a pick.
_Avoid_: parallel agents (ambiguous), swarm

**Fleet**:
Several independent agent sessions, each in its own git worktree on its own branch, reviewed by Somya.
_Avoid_: parallel agents (ambiguous), background agents

**Unattended run**:
Agent work that continues without Somya present, such as an overnight run or a scheduled job.
_Avoid_: async, autopilot

**Divergent work**:
Parallel work where several agents attempt the same job and Somya keeps one result.
_Avoid_: competition, bake-off

**Convergent work**:
Parallel work where agents do different jobs and every result is kept.
_Avoid_: parallel features

### Design process

**Surface**:
A piece of UI with its own design job: a new app, a new page, a landing or marketing page, or a complete redesign of one. Every surface goes through the full design process.
_Avoid_: screen, feature

**Refinement**:
Work inside an already-designed surface that keeps its design language, such as reworking one section. Skips straight to building and the Ship gate.
_Avoid_: small change, tweak

**Direction**:
One distinct design idea for a surface, stated as a short brief before anything is built.
_Avoid_: concept, option

**Variant**:
A direction built for real by its own agent so it can be judged running.
_Avoid_: version, mock, option

**Design language**:
The locked visual and motion rules a surface was shipped with, written down so later work can follow them.
_Avoid_: style guide, theme

**Discover**:
The phase that generates many directions and narrows them; it ends at the Direction gate.

**Define**:
The phase that builds each chosen direction as a variant, in parallel; it ends at the Variant gate.

**Deliver**:
The phase that polishes the winning variant and writes down its design language; it ends at the Ship gate.

**Direction gate**:
Somya's pick of three or four directions to build.

**Variant gate**:
Somya's side-by-side comparison of every running variant, ending in one winner or a combination.

**Ship gate**:
Somya's visual sign-off on a surface or refinement before it merges.
_Avoid_: final review

### Agents and models

**Builder**:
The agent that builds one variant from its direction.
_Avoid_: implementer, worker

**Critic**:
The agent that judges a running variant's screenshots against its direction and sends it back for another round until it passes. Distinct from a code reviewer, which reads diffs.
_Avoid_: reviewer, judge

**Model family**:
The models from one vendor, such as Claude (Haiku, Sonnet, Opus) or GPT (Luna, Sol, Astra).
_Avoid_: provider, vendor

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

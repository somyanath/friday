# pstack autonomy and verification: how agents run unattended and earn trust

Research for "How does parallel work run day to day?" (#12), questions Q4 (Unattended runs), and the parts of Q2 (splitting one task) and Q6 (merging convergent work) that depend on it. Researched 2026-10-15. It builds on `docs/research/pstack-portability.md` (branch `research/pstack-portability`), `docs/research/model-routing.md` (branch `research/model-routing`) and the Noodle section of `docs/research/parallel-tooling.md` (branch `research/parallel-tooling`), and does not repeat them.

**Sources.** `cursor/plugins` at commit `e5136d82418d2db3165ea1050d17577cd618cc05` (pstack 0.15.25, read as data, nothing run). Every `pstack/...` path below is relative to that repo root, and `file:line` points into that commit (`https://github.com/cursor/plugins/blob/e5136d82418d2db3165ea1050d17577cd618cc05/<path>`). Noodle at `poteto/noodle` commit `82d2921`. Lauren Tan's own posts and her interview with Matt Pocock. Claude Code, GitHub and ChatGPT docs. All read 2026-10-15. Terms follow `GLOSSARY.md`.

## Short answer

- **pstack does let agents merge their own PRs, but only behind a verdict from an agent that did not write the code.** Autopilot-full: "nothing merges until your swarm, which never wrote the code, has proven the code that lands" (`pstack/skills/poteto-mode/playbooks/autopilot-full.md:3`). "Green CI alone never authorizes a merge" (same file, line 17).
- **Merging is opt-in, never a side effect.** Babysit, the default PR loop, stops at merge-ready: "Babysitting never authorizes merging. Only an explicit request to merge, land, ship, or merge when ready does" (`babysit.md:21`). Merge authority comes from the human's grant: "i'm going to bed. land the stack even if ci flakes" (`pstack/README.md:48`), or a queue handed to Autopilot-full.
- **Verification is the base, in Lauren's own words.** "Unless you can trust an agent to own a problem end-to-end, including verification, you cannot automate your processes. … Trying to parallelize agents you don't trust yet is a huge waste of tokens" ([How I Use Cursor](https://x.com/poteto/status/2058975157503570132), 2026-05-25). And: "the big unlock … is starting from the question and working backwards of how do I get to the point where my agent can merge its own code?" ([interview](https://www.youtube.com/watch?v=MN9dGgmLyso), 2026-10-02).
- **Verification means proving behaviour on the real running thing, by an independent agent, with evidence a human can check.** Tests and CI are inputs, not verdicts. Each project gets a **verification skill** (launch, doctor, drive, evidence, cleanup) that every agent uses. The verdict is tied to the exact head commit, and a new commit voids it.
- **Every stage can stop the line, and the human samples instead of blocking.** Lauren reviews merged work afterwards from the commit history and reverts or adds lint rules: "the idea of sampling instead of blocking I think is really important" (interview).
- **Some things never run without a human:** force-push to shared branches, deploys, data deletion, and messages to customers (`pstack/skills/poteto-mode/SKILL.md:85`). So do approvals the forge enforces, and loosening any check. Noodle keeps "production deployments, database migrations, security-sensitive code" in manual mode (`docs/concepts/modes.md`).
- **pstack has its own UI gate.** "A PR that changes an interaction is review-gated. The operator reviews it in chat with screenshots and a video before merge" (`multi-phase-plan.md:13`). That matches Friday's rule: UI work stops at a gate, and non-UI work can merge on a verdict.
- **Friday's stack can do most of this on Claude Pro and ChatGPT Plus, with no API key.** The pieces: `/goal` drives work to a condition, background sessions and Desktop scheduled tasks run unattended locally, routines run in the cloud, and `claude-code-action` runs on a Pro OAuth token. Codex supplies the other-family verifier. What doesn't fit is pstack's verification size: ten live lanes plus audit lanes per PR. Lauren herself says to tune that down to about one verifier.
- **Q2: pstack does split one task across editing agents, but only along seams.** That comes after a blocking first phase, with one writer per worktree and the owner integrating the pieces. Claude Code's `/batch` is the native version.

## 1. Mechanisms for unattended and autonomous work

### In pstack

| Mechanism | Triggered by | May do | Stops when | Reports back | Cursor-only? |
|---|---|---|---|---|---|
| **Autonomy rules** in poteto-mode (`SKILL.md:81-89`) | Always on. Session overrides "Don't stop" / "going to bed" / "run until done" / "be fully autonomous" mean keep going (line 87) | "Reversible work and external actions … proceed without asking" (line 83) | **Always pause** for "force-push to shared branches, deploys, data deletion, customer messages" (line 85) | Each playbook's reply | No |
| **Never Block on the Human** principle (`principle-never-block-on-the-human/SKILL.md`) | "Tempted to ask 'should I do X?' on reversible work" | "Proceed, then present" (line 11) | Irreversible actions "still require confirmation"; "Product direction comes from the human" (lines 13, 15) | The result, presented | No |
| **Full-autonomy grant** (`SKILL.md:20`) | The human grants it | Decides calls the grant covers, acts, reports. For calls only the operator can make, "apply a default, report it" | "Gates the operator named and the Always-pause list in Autonomy still need the operator" | Report with what the operator could say instead | No |
| **Autonomous run** playbook (`autonomous-run.md`) | "run until done", "/loop until X" | Iterate, commit what advanced, discard what didn't (line 7). Fix side issues in their own PR (line 9) | "Stop when the predicate is met. A plateau is not a stop … never relax the predicate" (line 11). Surface "a genuine dead end" | Decision trail row per iteration (line 10) | Wake mechanism is Cursor `/loop` (line 6) |
| **figure-it-out** skill | Big work "or work the user steps away from to trust later" (`SKILL.md:125` of poteto-mode) | Designs a bespoke playbook, then runs it | Predicate met; verdict VERIFIED / NOT VERIFIED / INCONCLUSIVE (`figure-it-out/SKILL.md:42`) | Committed decision trail (line 46) | No |
| **Babysit** playbook | "babysit this", "get it green" | Fixes conflicts, review threads and CI on the owning branch | Merge-ready. "Babysitting never authorizes merging" (`babysit.md:21`) | Status | No (uses `gh`) |
| **Shipping** playbook | "land the stack" | Lands only PRs with an independent verdict, bottom-up, squash (`shipping.md:5-8`) | The first PR without a verdict, the "ceiling" (line 10) | Each PR's verdict and who produced it (line 12) | Verifiers are Cursor cloud agents (line 5) |
| **Autopilot-full** playbook | "autopilot this queue", "full autopilot" | One owner per PR builds, babysits and **merges** once the root's swarm verdict clears it (`autopilot-full.md:8`) | Operator's stop; stuck agents are replaced (lines 22-23) | Catch-up per **ketchup** (line 25) | Owners are Cursor cloud agents (line 8) |
| **Autopilot-stack** playbook | "stack them, don't ship" | Same owners, but owners "never … merge, close a PR, or arm auto-merge" (`autopilot-stack.md:5`) | STACK-READY | One linear stack the operator lands | Same |
| **Orchestrate** playbook | "run this whole project" | Coordinator writes briefs, never code. May land verified units itself "on repos where local git is cheap" (`orchestrate.md:15`) | Predicate; "By roughly 70% of [the budget], stop spawning and land what is verified" (line 61) | Status from tables (line 112) | Workers are `environment: "cloud"` (line 17). Cursor Projects (guide 07) |
| **Overnight contract** (`docs/guide/07-overnight.md:18-36`) | Human writes goal, finish condition, permissions, escape hatch | "don't ask me before committing" pre-answers permission (line 33) | "if you're truly stuck after a few hours, stop and write up why" (line 26) | Morning audit via show-me-your-work (lines 58-68) | `/loop` is Cursor's (line 35) |
| **Pause safely / Session pickup** playbooks | Explicit pause, restart, compaction | `wip:` commit plus resume note (`pause-safely.md:7-8`) | Clean stop | Resume note | Transcript paths are Cursor's |
| **benny** automation pack (`automations/benny/`) | New Slack issue report (Cursor Automations) | Triage, reproduce twice through real UI, verify existing fixes, bounded fix, **draft PR only** | "i want draft pull requests only. do not merge or deploy" (`FOR_AGENTS.md:36`). "fail closed" when config is missing (line 35) | Slack thread | Yes (Cursor Automations, Slack) |
| **make-bot-ui** skill | Human clicks a page button | Wakes a Grok Bot routine through a webhook at `api2.cursor.sh/automations/webhook/<id>` (`make-bot-ui/SKILL.md:37`) | One try, no retry (line 67) | The bot's own messages | Yes |
| **Bugbot** | Cursor's PR review bot | Comments on PRs | n/a | PR comments, triaged skeptically (`babysit.md:20`). "Green CI and an approving bot review are not verdicts" (`shipping.md:5`) | Yes |
| **automate-me** skill | "automate me" | Mines past transcripts and drafts a personal `<name>-mode` skill, interactively (`automate-me/SKILL.md:9`) | Human vibe-check | A PR with the skill | Transcript path and `create-skill` are Cursor's |

automate-me is not an unattended mechanism. It turns repeated corrections into a skill, so it belongs to the map's "How Friday improves itself" fog, not to Unattended runs.

Lauren's outer loop runs on Grok Bot and Cursor Projects, not on pstack. "I have some graph bots [Grok Bots] that look at my Slack channels, look at my X, uh, or my emails, uh, or linear … they have routines that subscribe", and a Cursor Project is "a coordinator agent that's in the cloud … It doesn't do the work itself" (interview). In "Loops You Can Trust" the triage, repro and fix stages run as Cursor Automations ([post](https://x.com/poteto/status/2069824386283319343), 2026-06-24).

### Closest equivalents on Friday's stack

Friday runs Claude Code on Claude Pro, calls Codex on ChatGPT Plus, and keeps usage credits off on both.

| Claude Code mechanism | Where it runs | Machine on? | Git it may do | On Pro? | What it replaces |
|---|---|---|---|---|---|
| **`/goal <condition>`** | Current session, also `claude -p` and Desktop | Yes | Whatever the permission mode allows | Yes | Autonomous run's predicate loop. "After each turn, a model checks whether the condition holds" ([goal](https://code.claude.com/docs/en/goal)). The evaluator is the small fast model and "doesn't run commands or read files independently", so the condition must be shown by commands Claude ran. It is a stop check, not a verifier. "To let goal turns run unattended, run /goal in auto mode" |
| **`/loop`** | Current session | Yes, session open | Inherits the session | Yes | Cursor `/loop`. Recurring tasks expire after 7 days. "A scheduled fire only runs skills that Claude is allowed to invoke on its own", so skills marked `disable-model-invocation: true` reach Claude as plain text ([scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)). Every pstack skill sets that flag |
| **Background sessions** (agent view, `claude --bg`) | Local supervisor | Yes. "Sleep alone doesn't stop sessions" | "Commit and push", draft PR. "**Never**: pushing to `main` or `master`, force-pushing, and merging" ([agent view](https://code.claude.com/docs/en/agent-view)) | Plans not named in docs | A local Autopilot-stack owner. Cannot merge |
| **Desktop scheduled tasks** | Local, new session per run | Yes, app open and awake. Missed runs: one catch-up | "create commits, and open pull requests" ([desktop tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks)). Optional worktree per run. Permission mode per task | Yes | benny-style scheduled stages that need the local dev server and browser |
| **Routines** (cloud) | Anthropic cloud, fresh clone | No | Pushes `claude/` branches "unless your prompt directs it to push to another branch. To control which branches a run can push to, use branch protection rules" ([routines](https://code.claude.com/docs/en/routines)). No permission prompts | "Pro, Max, Team, and Enterprise"; research preview; 1-hour minimum interval | Cursor Automations and cloud agents. No local files, so no local Codex sign-in (inference) |
| **GitHub Actions** (`anthropics/claude-code-action`) | GitHub runner | No | PRs and pushes with the token's permissions | **Yes, no API key needed.** `CLAUDE_CODE_OAUTH_TOKEN` "authenticates with your Claude subscription, available on Pro, Max, Team, and Enterprise plans. Generate one by running `claude setup-token`". "If you authenticate with an OAuth token, runs use your Claude subscription instead of API billing" ([GitHub Actions](https://code.claude.com/docs/en/github-actions)) | Event or cron triggers. Consumes GitHub Actions minutes |
| **`/batch <instruction>`** | Current session | Yes | Each unit "publishes its change" | Yes | Splitting one change: "decomposes the work into 5 to 30 independent units … spawns one background subagent per unit in an isolated worktree" ([commands](https://code.claude.com/docs/en/commands)) |
| **`/verify`** bundled skill | Current session | Yes | None | Yes | A generic verification skill: "building your project's app, running it, and observing the result, rather than relying on tests or type checks" (commands). It is `disable-model-invocation: true` (scheduled-tasks page) |
| **Auto mode** | Any session | n/a | "allows pushes to any branch of the repository you're working in, including the default branch, and pull request creation by default". Force push and secrets stay blocked. Add `permissions.ask` rules for a human checkpoint ([auto mode](https://code.claude.com/docs/en/auto-mode-config)) | "available to all users" | pstack's Autonomy section. Friday has to add its own rules for `main` |
| **`codex exec -s read-only -i <screenshot>`** | Local | Yes | None in read-only | Plus | The other-family verifier or critic (ADR-0001) |
| **`@codex review`** on GitHub | OpenAI cloud | No | Posts a review; "`@codex fix the P1 issue`" "can push a fix back to the branch" ([Codex GitHub](https://learn.chatgpt.com/docs/third-party/github)) | Not stated on that page | An other-family PR reviewer without a local machine. See "Not verified" |
| **GitHub branch protection** | GitHub | No | Required status checks, no force-push | "available in public repositories with GitHub Free" ([GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)) | pstack's "never give or bypass an approval the forge enforces". Admins bypass unless the rule includes administrators |

## 2. Verification

### pstack's own terms

pstack has no single word for the whole idea. Its parts have names, which Friday's glossary could adopt:

- **Verdict**: an independent judgment on one patch. `PASS`, `PASS+NOTES` or `FAIL` (`shipping.md:5`). `VERIFIED`, `NOT VERIFIED` or `INCONCLUSIVE`, where "Inconclusive is not a pass" (`figure-it-out/SKILL.md:42`). "A verdict covers one patch and green CI covers one head" (`autopilot-full.md:5`).
- **Verification skill** (also **control skill**): a project-local skill that "drives your app the way a user does" (`create-verification-skill/SKILL.md:3`).
- **Live lane**: one verifier driving the real surface through a concrete scenario, with a screenshot and a pass predicate (`multi-phase-plan.md:13`).
- **Receipts**: the evidence behind a claim. "no lane trusts a claim it has not checked" (`autopilot-full.md:14`).
- **Verification ledger**: one row per verdict keyed by PR and head SHA, graded `live-ui-verified | unit-test-verified | type-check-only | verifier-blocked | verifier-failed` (`orchestrate.md:90`).
- **Decision trail**: the show-me-your-work log.
- Principle: **Prove It Works**. "Verify every task output by checking the real thing directly. Do not infer from proxies, self-reports, or 'it compiles.'" (`principle-prove-it-works/SKILL.md:9`).

Lauren's phrases for the stance are "trust, but verify" and "show me your work" ("Loops You Can Trust").

### Every form, where it runs, and what it proves

| Form | Where in the flow | Evidence | Source |
|---|---|---|---|
| **Finish condition** as a checkable predicate | Before the first iteration | Commands that pass or fail | `autonomous-run.md:5`; `docs/guide/06-verify-and-ship.md:9-17`. "a duration is not a finish condition" (`07-overnight.md:118`) |
| **Verification skill** with launch, doctor, drive, evidence and cleanup, plus a feature map | Built once per project and proven once end to end before use. Maintained "at least once a day, ideally from a scheduled automation" | Screenshots, transcripts, response bodies, side effects. "A generated skill that was never executed is a draft, not a deliverable" | `create-verification-skill/SKILL.md:27-40`; `06-verify-and-ship.md:88`; `maintain-verification-skill/SKILL.md` |
| **Repo checks** (lint, typecheck, tests) | Before the PR-facing push | Command output. "CI green is an input to a verdict, not a verdict" | `multi-phase-plan.md:58`; `orchestrate.md:90` |
| **Failing test first** | Inside each unit | The red test lands before the fix in history | `bug-fix.md:11-12`; `principle-sequence-verifiable-units/SKILL.md:15` |
| **Verify each unit before the next** | During the work | Before/after per unit | `principle-sequence-verifiable-units/SKILL.md:9-13` |
| **Live proof on the real surface** | After the change, on the matching surface | "The original repro now passes. 'Inconclusive' or wrong-surface is not a pass" | `bug-fix.md:10`; `feature.md:13` |
| **Swarm verification** by agents that never wrote the code | At the code-ready head, once. Again only for "new behavior, a redesign, or a large new diff" | One gates lane, ten live lanes, a perf lane, two or more audit lanes that "distrust the PR body" | `autopilot-full.md:14`; `multi-phase-plan.md:65` |
| **Verifier from another model family** | Every unit's verifier | "Run a unit's verifier on a different model family from its worker" | `orchestrate.md:17` |
| **Patch-id rule** | Before trusting an older verdict | `git patch-id` at verdict SHA vs head | `shipping.md:7` |
| **Interrogate** panel | Contested design, before shipping | Findings raised by two or more models are "the highest signal" | `interrogate/SKILL.md:9, 42` |
| **Arena** cross-judge | Picking among candidates | "Prefer a different model family from the parent's" | `arena/SKILL.md:28` |
| **benchmark-checklist** | Before trusting any measured number | Run count, range, limiter | `06-verify-and-ship.md:31-49` |
| **Decision trail**, audited against the transcript, then a cross-model review | Throughout long or unattended work, and before handing back | TSV rows with evidence pointers, plus an "Attention" section "reviewed by <model>" | `show-me-your-work/SKILL.md:55-74` |
| **Media review** of repro evidence | After capture | A read-only reviewer answers "does the evidence visibly show the discriminating broken state?" | `automations/benny/skills/reproduce-and-fix-issues/SKILL.md:194` |
| **Review gate** for interaction changes | Before merge | "screenshots and a video" posted to the operator | `multi-phase-plan.md:13, 120-124` |

### What an agent must show before handing over or merging

- **Before handing work to a human:** the predicate's commands and their output. Before-and-after evidence on the real surface: "Show me the failing test and the passing test. Show me the before and after video. Show me the trace, the heap snapshot, or the screenshot. If the fix merged, run it again on main and show me that too" ("Loops You Can Trust"). A decision trail with an Attention section for long runs. "Never hand the human a check you could run" (`poteto-mode/SKILL.md:113`).
- **Before merging without a human:** all of the above, plus a clean swarm verdict at the exact head SHA from agents that did not write the code, including the live lane. Green CI on that head, Bugbot triage done, and a rebase onto current trunk with the patch-id unchanged (`multi-phase-plan.md:126-131`).

### Why Lauren treats verification as the base

- "Before you start thinking about loops, you must teach agents to verify that their work is correct and meets the quality bar. Without a way to trust that the work was done correctly, running loops naively just creates compounding slop and more work for humans … Verification has become the limiting step" ("Loops You Can Trust").
- "the single most important skill that should be in your toolkit is verification … the most important part of a loop that allows it to be a loop is the verification part because the agent is able to verify its own work … that takes you out of the equation" (interview).
- "Verification is the slowest step in most agent work, because it's the step that usually waits on a human. Make the agent able to do it, and you stop being the bottleneck. Skip it, and running more agents only gets you more unchecked work to review" (`06-verify-and-ship.md:5`).
- "pstack gives you fearless parallelism. when you can go deep on one agent and trust it to write good, verifiable code, you can truly parallelize with confidence" (`pstack/README.md:9`).
- "One key aspect of building trustworthy loops is that every stage can stop the line … Those are all useful outcomes because they keep bad work from flowing into the next stage" ("Loops You Can Trust"; same idea in `07-overnight.md:113`).
- Earn it before the loop: do the task by hand first; give agents your tools and signals; "Every stage proves its work and can stop the line"; turn repeated failures into tools; "Make the loop autonomous only after all four hold" (`07-overnight.md:11-16`).
- On one-way doors: "it all comes back to me to the quality of the verification that you're able to get out of your agent … verifiability of the domain is an important aspect" (interview).

## 3. Merge policy

**When an agent may merge with no human:**

1. The human granted it for named work. "The grant covers only the queue's items, so items the operator names as theirs and PRs outside the queue stop at merge-ready. A request to state the plan is not a go" (`autopilot-full.md:7`).
2. A clean verdict from the swarm at the code-ready head, with the live lane, and the root has audited the receipts (`autopilot-full.md:14`).
3. Green CI on the head that lands. "Green CI alone never authorizes a merge" (line 17).
4. The patch was tested on the trunk it lands on. Right before merging, the owner fetches trunk and asks whether trunk's changes can affect the patch. If so, rebase and wait for CI. "If trunk would force a third rebase past merge prep, hold and report to the root" (line 19).
5. Nothing loosened a gate. "Anything that loosens a gate, such as a raised budget or an allowlist entry, needs a verifier's proof and then your fresh countersign … A disabled or soft-failed check always comes out … Never give or bypass an approval the forge enforces" (line 20).

pstack sets no size or risk limit for autopilot merges. Risk limits come from the Always-pause list, the review gate for interaction changes, and Babysit's escalation of review comments "touching security, auth, billing, data, or migrations" (`babysit.md:20`). Noodle's modes are a "trust dial": `auto` merges everything through a serialised merge queue, `supervised` needs a human to merge, and `manual` is for "production deployments, database migrations, security-sensitive code" (`docs/concepts/modes.md`).

Lauren's own practice: "I review the pull request after it's landed … full autopilot … will spawn a bunch of verifier agents for every pull request and it will fuzz … I'll review it in the morning by looking at my commit history and if I see problems, I go and course correct … revert or modify, add new lint rules" (interview).

**Conflicts and parallel branches:**

- **One writer per branch.** "Never push a fix yourself, because each branch has one writer. Replace a stuck owner instead" (`autopilot-full.md:16`). "Force-push only your own branch, with `--force-with-lease` pinned to the SHA you last pushed" (line 12).
- **Independent PRs run in parallel off trunk, never stacked** (`autopilot-full.md:13`). Coupled work goes to Autopilot-stack, with one root that owns rebases and retargets (`autopilot-stack.md:6`).
- **Serialise landing.** Shipping lands "one PR at a time" and reads each PR back, "because a merge command can report success when a merge queue only queued the PR" (`shipping.md:8`). Orchestrate keeps "Exactly one stacker per stack" (`orchestrate.md:81`). Noodle serialises merges through its queue.
- **Babysit reports conflicts and does not resolve them.** "A conflict is the one blocker you report rather than resolve" (`babysit.md:11`).
- **Rebase rarely.** "Fix rounds stay on that base unless trunk conflicts or breaks CI, because each rebase restarts CI" (`autopilot-full.md:10`).

## 4. Splitting one task across editing agents (Q2)

pstack does split one task, under rules:

- **Find the seams first.** The Feature playbook's throughput checkpoint: "Blocking first steps. Gates run before fan-out. Independent workstreams. Disjoint files, services, or layers parallelize. Shared writes serialize … Smallest safe decomposition. If one worker is best, name why" (`feature.md:7-11`).
- **One owner integrates.** "Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline. That owner fans out internally after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts" (`feature.md:19`).
- **One worktree per writer.** "Parallelize only across seams, and give each worker its own worktree or branch … Don't over-fan" (`figure-it-out/SKILL.md:31`). Visual parity: "Parallelize across worktrees, one owner per component. Shared primitives migrate first as a blocking phase" (`visual-parity.md:7`).
- **Prefer fewer, broader workers** (`orchestrate.md:17`). "a laptop runs only a handful at once" (`02-poteto-mode.md:107`).
- **Divergent splits graft by hand.** Arena gives each candidate its own worktree, picks a base, then folds one or two grafts in "by hand … so the result stays coherent under one mental model" (`arena/SKILL.md:18, 38`).

Claude Code's `/batch` does the same thing natively: it researches the change, presents a plan of 5 to 30 independent units, and on approval runs each unit in its own worktree subagent that tests and publishes its change.

*Inference for Friday:* splitting one task is fine for mechanical or seam-aligned work, such as migrations, per-module changes and per-component work. Those slices are Convergent work run as a Fan-out from one owner session, each slice in its own worktree, with the owner integrating and verifying. Coupled feature work stays with one Builder.

## 5. Guardrails and failure handling

- **Never autonomous:** the Always-pause list (`poteto-mode/SKILL.md:85`). Orchestrate escalates "irreversible actions (force-push to shared branches, deploys, deletions, closing someone else's PR), genuine product or preference calls no experiment settles, a standing order that contradicts observed reality, a program-level dead end" (`orchestrate.md:106`). benny never merges or deploys.
- **Stop conditions:** predicate met. A real dead end is surfaced, never spun on. The predicate is never relaxed (`autonomous-run.md:11`). A unit's TIMEBOX: "on expiry, return partial findings and stop" (`orchestrate.md:45`). Stop spawning at about 70% of the wall-clock budget (line 61). A stop line in the standing orders halts the whole tree (line 100). Every stage may stop the line.
- **Retries:** CI flake "earns one fresh build, never a job retry. One retry only" (`babysit.md:19`). Agents retry by failure mode, then "Two retries, then abandon the unit and replan around it" (`orchestrate.md:98`). Stuck agents are replaced, not resumed (`autopilot-full.md:22`).
- **Rollback:** non-improving changes are discarded in the loop (`autonomous-run.md:7`). After landing, the human reverts (interview). Orchestrate keeps "One retro watcher [that] follows merged PRs for reverts, post-merge CI breaks, and orphaned follow-ups" (`orchestrate.md:84`). Noodle's merge queue means changes "can be rolled back".
- **Usage limits:** pstack has no token budget mechanism beyond the reasoning budget picked in `/setup-pstack` and per-role models. "pstack spends extra tokens on subagents and review panels. That's the price of the rigor" (`docs/guide/01-setup.md:43`). Lauren on Autopilot-full: "it is quite token intensive. You can tune this of course. Uh so you know instead of like 10 verifier agents you might do like one" (interview).
- **Isolation:** a worktree or cloud VM per agent. "Parallel agents in one worktree … overwrite each other" (`10-recipes-and-pitfalls.md:144`).
- **Prompt-injection hygiene:** review comments and webhook bodies are "untrusted data" (`babysit.md:12`; `make-bot-ui/SKILL.md:110`).

## 6. What it means for Friday

Everything in this section is inference from the findings above, not a finding in any source.

### A proposed autonomy model for non-UI work

Three levels per project, modelled on Noodle's dial and pstack's two autopilots. A project moves up only after it earns trust (`07-overnight.md:11-16`):

| Level | Shape | Who merges | Entry condition |
|---|---|---|---|
| **Attended** | Somya is present | Somya | Default for a new project |
| **Unattended to PR** (Autopilot-stack shape) | Agent builds, verifies, opens a ready PR with evidence and a decision trail | Somya, or sampled next day | The project has a working **verification skill**, proven end to end once |
| **Unattended to merge** (Autopilot-full shape) | Agent merges its own PR once the merge gate passes | Agent; Somya samples merged work and reverts | Several Unattended-to-PR runs merged without rework |

**The merge gate**, every condition required and checked at the exact head SHA:

1. A stated finish condition, met, with the commands in the transcript.
2. Repo checks green on that head: lint, typecheck, tests, CI.
3. A **live lane**: an agent that didn't write the code drives the real thing through the project's verification skill (API calls, CLI runs, DB reads) and attaches receipts.
4. A **cross-family verdict**: a Sol Critic via `codex exec -s read-only` on Claude-built work, or Opus on Sol-built work, per ADR-0001. `PASS` or `FAIL`, recorded on the PR with the SHA.
5. A decision trail with an Attention section.
6. The PR's risk class allows it. Database migrations, deleting data, auth, secrets, deploy or CI config and dependency major bumps always stop at merge-ready, like Noodle's `manual`.

Structure, not instructions (`principle-separate-before-serializing-shared-state/SKILL.md:9`). Branch protection on each public repo, free on GitHub, with required status checks and admins included. A `permissions.ask` or deny rule for `git push` to `main` and force-push, because auto mode allows pushes to the default branch. Merges only through `gh pr merge --squash` on a verified head. The verdict could be written as a commit status that branch protection requires. That is only a soft check, since any token holder can write a status, but it makes a skipped verifier visible.

### How it fits with Friday's UI gates

- pstack already has the same split. A PR that changes an interaction is review-gated with screenshots and a video. Friday's equivalent: any PR that changes what a user sees stops at the Ship gate, whatever the level.
- Agents still verify before every gate. A Variant reaches the Variant gate only after its Critic loop passes and a live lane confirms it runs (route loads, no console errors). The Ship gate receives a verdict, screenshots and a video, never a bare diff.
- Mixed PRs: split the non-UI part into its own PR so it can merge on a verdict, or the whole PR waits at the Ship gate.
- Open question for Somya: does "changes what a user sees" include copy, error messages or API responses that a UI renders? pstack's line is "changes an interaction".

### What it costs in usage

- pstack's default verification, ten live lanes plus a gates lane, a perf lane and two audit lanes per PR, does not fit Claude Pro. Lauren's own tuning is one verifier.
- Proposed per-PR budget: one Builder (Sonnet), one live lane (Sonnet or Haiku driving the verification skill), one cross-family diff audit (Sol through `codex exec`). Codex Plus estimates 15 to 160 Sol local messages per 5 hours (`docs/research/model-routing.md`), so an audit per PR is cheap next to Codex's Define load. Claude's share is unmeasured and goes into the Q7 usage log.
- Unattended runs overnight use 5-hour windows that would otherwise sit idle, but all of it counts toward the weekly limits. Routines, Desktop tasks and the GitHub Action all draw on the same Pro pool.
- `/goal` evaluation runs on the small fast model and is "typically negligible".

### Which mechanism Friday would use

- **Somya starts it and goes to bed:** a background session (or Desktop session) with `/goal <predicate>` in auto mode, in its own worktree. Background sessions cannot merge (agent view's "Never" list), so merging needs a session that isn't a background dispatch, or a separate merge step in the morning.
- **Recurring, needs the local app:** Desktop scheduled tasks with the worktree toggle.
- **Recurring, no local app:** routines or `claude-code-action` on `CLAUDE_CODE_OAUTH_TOKEN`. Neither can sign Codex in, so their verdict has to come from Opus, or from `@codex review` on GitHub if Plus covers it.

### Which parts to copy as owned `pstack-` skills (MIT)

- **Copy and trim to `gh`, local subagents and Claude Code tools:** `principle-prove-it-works`, `principle-sequence-verifiable-units`, `principle-separate-before-serializing-shared-state`, `principle-build-the-lever`, `principle-encode-lessons-in-structure`, `principle-never-block-on-the-human` (edited to name Friday's three gates as stops), `create-verification-skill` and `maintain-verification-skill` (paths to `.claude/skills/verify-<app>/`), `show-me-your-work`, `swarm` (local, cross-family), `ketchup`, `figure-it-out`, and playbooks `autonomous-run` (on `/goal`), `autopilot-stack`, `autopilot-full` (Somya's grant per project, no Origin or Bugbot, one live lane), `shipping`, `babysit`, `pause-safely`, `session-pickup`, `worktree-cleanup`.
- **Leave out:** `orchestrate` (program scale, Cursor Projects), `make-bot-ui` (Grok Bot), the benny pack (Slack and Cursor Automations; its stage-gated pattern is worth reusing in Friday's own words), and `automate-me`, which belongs to the self-improvement fog.
- **Watch the invocation flag.** Every pstack skill sets `disable-model-invocation: true`, which stops a scheduled `/loop` fire from running it. Friday's entry points for scheduled work must be model-invocable, or be started by a prompt in `claude -p` or a routine (see "Not verified").

### Flags for the map

- **ADR-0001 tension.** `@codex fix …` on GitHub makes Codex a second writer on a branch, outside a Claude Code session. `@codex review` only comments. If Friday uses Codex on GitHub, it should be review-only, or ADR-0001 needs an amendment.
- **Glossary candidates:** Verdict, Verification skill, Live lane, Decision trail. Each is in active use in pstack and none is in `GLOSSARY.md`.

## Not verified

- **Lauren's talk video** (X, 2026-09-21, about 38 minutes, linked from [her post](https://x.com/poteto/status/2102050467505430555)) was not transcribed. The redreamality.com write-up (2026-10-05) is secondary and no claim here rests on it. The "2026-10-05 talk" in the brief is that write-up's date.
- **Interview quotes** come from YouTube's automatic transcript, which has no timestamps and spells "Grok Bot" as "graph bot" or "grabbot". The quotes keep the wording but not the timings.
- **`@codex review` on Plus.** The ChatGPT page doesn't name plans. GitHub issues in `openai/codex` (secondary, user reports) describe a separate code-review limit that fails often (#15477, #31001).
- **Whether `claude -p "/<skill>"` or a routine prompt can run a skill marked `disable-model-invocation: true`.** The docs read only cover scheduled `/loop` fires.
- **Whether background sessions are limited to certain plans.** The agent-view page read here doesn't say.
- **GitHub Actions minutes on public repos** were not checked.
- **Whether a routine's cloud environment can run `codex exec`.** Inferred no, because it has no local ChatGPT sign-in. An `OPENAI_API_KEY` would break the budget.
- **Cursor Projects and Grok Bot internals** were read only through Lauren's descriptions and pstack's skills.

## Sources

**pstack** (commit `e5136d82418d2db3165ea1050d17577cd618cc05`, read 2026-10-15):
- `pstack/README.md`, `pstack/plugin.json`
- `pstack/skills/poteto-mode/SKILL.md`; playbooks `autonomous-run.md`, `autopilot-full.md`, `autopilot-stack.md`, `shipping.md`, `babysit.md`, `orchestrate.md`, `multi-phase-plan.md`, `feature.md`, `bug-fix.md`, `opening-a-pr.md`, `visual-parity.md`, `pause-safely.md`, `session-pickup.md`, `worktree-cleanup.md`
- `pstack/skills/` `principle-never-block-on-the-human`, `principle-prove-it-works`, `principle-sequence-verifiable-units`, `principle-separate-before-serializing-shared-state`, `swarm`, `arena`, `interrogate`, `create-verification-skill`, `maintain-verification-skill`, `show-me-your-work`, `figure-it-out`, `ketchup`, `sharpen`, `make-bot-ui`, `automate-me`
- `pstack/docs/guide/` `01-setup.md`, `02-poteto-mode.md`, `06-verify-and-ship.md`, `07-overnight.md`, `09-make-it-yours.md`, `10-recipes-and-pitfalls.md`
- `pstack/automations/benny/README.md`, `FOR_AGENTS.md`, `skills/reproduce-and-fix-issues/SKILL.md`

**Lauren Tan, primary:**
- "How I Use Cursor", https://x.com/poteto/status/2058975157503570132 (2026-05-25)
- "Loops You Can Trust", https://x.com/poteto/status/2069824386283319343 (2026-06-24)
- "The Complete Guide to pstack Pt. 2", https://x.com/poteto/status/2097732320606507506 (2026-09-09)
- "here's how i shipped 2,500 PRs last month", https://x.com/poteto/status/2102050467505430555 (2026-09-21, video not transcribed)
- Matt Pocock, "LIVE: Poteto (creator of pstack) on shipping 1,000's of PR's a month at SpaceX", https://www.youtube.com/watch?v=MN9dGgmLyso (live 2026-10-02, automatic transcript)

**Noodle** (`poteto/noodle` commit `82d2921`): `docs/concepts/modes.md`, `docs/cookbook/multi-stage-pipeline.md`.

**Claude Code docs** (read 2026-10-15): https://code.claude.com/docs/en/goal, /scheduled-tasks, /desktop-scheduled-tasks, /routines, /agent-view, /github-actions, /auto-mode-config, /commands, /worktrees.

**Other:**
- GitHub, "About protected branches", https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- ChatGPT Learn, "Review GitHub pull requests with Codex", https://learn.chatgpt.com/docs/third-party/github
- Secondary, used only to locate primary sources or flagged above: redreamality.com write-up (2026-10-05); `openai/codex` issues #15477 and #31001; search-result summaries.

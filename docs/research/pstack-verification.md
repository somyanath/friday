# pstack verification: how it proves work, piece by piece

Research for "How does parallel work run day to day?" (somyanath/friday#12), question Q10. Somya asked how pstack verifies different kinds of work, and how its playbooks, principles and other skills fit together to do it, so Friday can choose which terms and practices to adopt. Researched 2026-10-15.

**Sources.**
- pstack in `cursor/plugins` at commit `e5136d82418d2db3165ea1050d17577cd618cc05` (pstack 0.15.25), the same pin as the earlier pstack research. Every `pstack/...` path below is relative to that repo root, and `file:line` points into that commit. All files were read as data; nothing was run.
- `main` moved once since the pin, at `99743e9` ("refactor(pstack): cut marginal sections from four skills (#634)", 2026-10-15 09:29 -0700). The version stays 0.15.25. That commit only trims text, listed under Counts.
- Lauren Tan's own posts: "Loops You Can Trust" (2026-06-24), "The Complete Guide to pstack Pt. 1" (2026-08-31) and "Pt. 2" (2026-09-09).
- Terms follow `GLOSSARY.md` on `origin/main`.

This doc builds on two others and does not repeat them:
- `docs/research/pstack-autonomy.md` (branch `research/pstack-autonomy`) covers unattended runs, merge policy and guardrails.
- `docs/research/pstack-portability.md` (branch `research/pstack-portability`) covers what ports off Cursor, and the licences.

## Short answer

- **Somya's counts are right.** pstack has 24 principles and 23 playbooks. Beside them sit 29 other skills plus the `poteto-mode` router, 2 agent definitions, and a dormant 3-skill automation pack (benny).
- **One rule underlies everything.** "Verify every task output by checking the real thing directly. Do not infer from proxies, self-reports, or "it compiles."" (`pstack/skills/principle-prove-it-works/SKILL.md:9`). Lauren's first guide post opens with "Part 1 – Verification is all you need".
- **The pieces stack in layers:**
  - **Principles** say what counts as proof.
  - **Playbooks** put a proof step into every kind of task.
  - **Skills** do the checking.
  - **A per-project verification skill** drives the real app.
  - **A verdict**, tied to one exact commit, is the only thing that lets work merge.
- **Five of the 24 principles are about verification:** Prove It Works, Fix Root Causes, Sequence Work into Verifiable Units, Test Behavior Not Implementation, and Explain the Number. Twelve more carry a verification rule inside them, such as Build the Lever ("A deterministic script turns "trust me" into "run this""). The other seven are about design, not proof.
- **Every playbook ends in proof on the "matching surface",** meaning the place the user touches: browser, terminal, API or profile. "Inconclusive" or the wrong surface never counts as a pass. Tests, typecheck, lint and green CI are inputs to a verdict, not verdicts.
- **pstack checks independence in five steps:**
  1. The agent checks its own work.
  2. A lead reviews its delegate's diff.
  3. An agent that never wrote the code verifies it.
  4. An agent from another model family verifies it.
  5. The human checks it, and only for interaction changes and irreversible acts.

  The heavy end (ten live lanes per PR) is pstack's default. Lauren tunes it down to about one.
- **pstack covers most kinds of work.** UI, visual parity, CLI, bug fixes, refactors, performance, flaky CI, research claims and design decisions each have their own proof rules.
  - **Covered only partly:** API and backend, data and migrations, security, and docs.
  - **Not covered:** dependency upgrades. Only a lockfile rule and blast-radius touch them.
- **pstack has a large outcome vocabulary.** It has fourteen outcome scales, such as `PASS` / `PASS+NOTES` / `FAIL` and `VERIFIED` / `NOT VERIFIED` / `INCONCLUSIVE`, plus ledger grades from `live-ui-verified` down to `type-check-only`. Friday needs one scale, not twelve.
- **Proposed glossary terms** (inference):
  - Five that confirm or refine the session's ideas: **Verification**, **Verification skill**, **Verdict**, **Autonomy level** and **Live check**.
  - Four new ones: **Verifier**, **Finish condition**, **Decision trail** and **Always-pause list**.
- **Four pstack words clash with Friday's glossary, so they shouldn't be imported:**
  - "surface" (Friday's Surface is a UI design job)
  - "gate" (Friday's gates are Somya's decisions)
  - "video" (Friday's generated clip, not a screen recording)
  - "autopilot" (the glossary avoids it for Unattended run)
- **Two map flags:**
  - The Eval playbook fits the "Proving skills work" fog item.
  - `/correct` and `/reflect` fit "How Friday improves itself".

## 1. Counts

At the pin, `pstack/skills/` holds 54 directories.

| Kind | Count | Where | Notes |
|---|---|---|---|
| Principles | 24 | `pstack/skills/principle-*/SKILL.md` | `poteto-mode` groups them as 10 Core, 6 Architecture, 5 Verification, 2 Delegation, 1 Meta (`pstack/skills/poteto-mode/SKILL.md:42-79`). The guide says "pstack ships 24 principles as individual skills" (`pstack/docs/guide/08-principles.md:3`). |
| Playbooks | 23 | `pstack/skills/poteto-mode/playbooks/*.md` | Not skills. Reference files loaded by `poteto-mode`. Lauren: "These 23 playbooks (as of 0.15.0)" (Complete Guide Pt. 2). |
| Router | 1 | `pstack/skills/poteto-mode/SKILL.md` | Indexes the principles and playbooks. |
| Other skills | 29 | `pstack/skills/<name>/SKILL.md` | Matches the 29 in `pstack-portability.md`. |
| Agent definitions | 2 | `pstack/agents/poteto-agent.md`, `pstack/agents/comment-sicko.md` | Comment Sicko is the independent comment reviewer. |
| Scripts that enforce verification | 5 | `poteto-mode/scripts/check-plan.mjs`, `scripts/watch-pr/`, `scripts/orch/`, `scripts/worktree-audit.sh`, `show-me-your-work/scripts/log.sh` | See section 2. |
| Automation pack | 3 skills | `pstack/automations/benny/skills/` | Dormant. Not registered as slash skills (`pstack/README.md:268`). |

**Correction to the earlier research.** `pstack-autonomy.md` says every pstack skill sets `disable-model-invocation: true`. One doesn't: `setup-pstack/SKILL.md` has no such flag. The other 53 do.

**What `main` changed since the pin** (commit `99743e9`):
- `interrogate/references/lead-judgment.md` loses its "Why This Step Matters" and "Verdict Calibration" sections.
- `swarm/SKILL.md` loses its one-line intro, step 3 ("Set N…") and the "compact result table" line.
- `principle-migrate-callers-then-delete-legacy-apis` loses its rule list.
- `principle-type-system-discipline` loses five bullets, including "Don't lie to the type system" and "Exhaustive matching is the compiler's job".

None of this changes the verification model below. Quotes from removed lines are marked "(removed on main)".

## 2. How the pieces fit together

```
 24 principles (one rule each, read when a trigger fires, cited in the reply)
        │  "Prove It Works" is the rule; four more define what counts as proof
        ▼
 poteto-mode router ──picks──▶ one of 23 playbooks ──every one ends in──▶ proof on the matching surface
        │                              │
        │                              ├─calls─▶ skills that check: tdd, benchmark-checklist, blast-radius,
        │                              │         interrogate, arena, swarm, show-me-your-work, figure-it-out
        │                              │
        │                              └─drives─▶ verify-<app> skill, one per project
        │                                         (Launch, Doctor, Drive, Evidence, Cleanup + feature map)
        │                                                     │ evidence: screenshots, video, transcripts,
        │                                                     │ response bodies, read-back values
        ▼                                                     ▼
 Writing the reply: "Every claim carries its evidence"   verdict on one exact commit, from an agent that
 (poteto-mode/SKILL.md:113)                              did not write it ──▶ verification ledger
                                                                     │
                                       merge only on: verdict + green CI on that head + tested on trunk
                                       (Shipping, Autopilot-full); human: grant, review gate, Always-pause
                                                                     │
                                       after merge: retro watcher, morning audit of the decision trail,
                                       daily /maintain-verification-skill, /correct and /reflect
```

### Where each check sits, and how independent it is

"Same agent" means the agent that did the work. "Independent" means an agent that never wrote the code. "Other family" means a different model family from the author. "Machine" means a script, CI, or the compiler.

| Stage | Check | Who checks | Source |
|---|---|---|---|
| Before work | A finish condition stated as commands that pass or fail | Same agent | `playbooks/autonomous-run.md:5`; `docs/guide/06-verify-and-ship.md:9-17` |
| Before work | "Always keep one outside check that the result is right" | Same agent | `sharpen/SKILL.md:7` |
| Before work | Restate the problem "in your own words" so the human catches a misreading | Human | `in-your-own-words/SKILL.md:7`; Complete Guide Pt. 2 |
| Before work | Baseline or pin first: repro, characterization test, visual baseline, frozen harness | Same agent, then machine | `bug-fix.md:7`; `refactoring.md:7`; `visual-parity.md:5`; `hillclimb.md:8` |
| Design | Prototypes compared by observation | Same agent, then human picks | `prototype.md:11`; `principle-exhaust-the-design-space` |
| Design | Arena candidates scored by a cross-judge | Other family | `arena/SKILL.md:28` |
| Design | Contested design attacked by several models, on a diff and never on an abstract plan | Other family (panel) | `interrogate/SKILL.md:9`; `docs/guide/04-design.md:89` |
| Each unit | Verify each unit before the next | Same agent | `principle-sequence-verifiable-units/SKILL.md:9` |
| Delegated work | "You own every subagent's work. Review the diff and write your own summary" | Lead over delegate | `poteto-mode/SKILL.md:99` |
| Delegated work | "Pair delegated work with a judge" | Independent | `figure-it-out/SKILL.md:41` |
| Before the PR | Repo lint and typecheck before the PR-facing push | Machine | `multi-phase-plan.md:58` |
| Before the PR | `/no-comments` hands the comments to Comment Sicko, who didn't write them | Independent | `no-comments/SKILL.md:19`; `docs/guide/05-build-and-clean.md:71` |
| Before the PR | A subagent that opens a PR runs `interrogate` | Other family (panel) | `opening-a-pr.md:34` |
| PR | Swarm verdict at the code-ready head: gates lane, live lanes, perf lane, audit lanes that "distrust the PR body" | Independent; Orchestrate asks for the other family | `multi-phase-plan.md:65`; `orchestrate.md:17` |
| PR | Bugbot and the security review, triaged skeptically | Bot, then same agent | `babysit.md:20`; `references/bugbot-triage.md` |
| PR | CI | Machine. "CI green is an input to a verdict, not a verdict" | `orchestrate.md:90` |
| Before merge | A PR that changes an interaction waits for the operator's review of screenshots and a video | Human | `multi-phase-plan.md:13, 120-124` |
| Before merge | Anything that loosens a gate needs a verifier's proof and the root's countersign | Independent, then root | `autopilot-full.md:20` |
| Merge | Verdict still describes the code (patch-id rule); read the PR back after merging | Same agent, via git | `shipping.md:7-8` |
| After merge | Retro watcher follows reverts and post-merge CI breaks | Independent | `orchestrate.md:84` |
| After the run | Decision trail audited against the transcript, then reviewed by another model, ending in an "Attention" section | Same agent, then other family | `show-me-your-work/SKILL.md:55-74` |
| Ongoing | `/maintain-verification-skill` "at least once a day" | Independent | `docs/guide/06-verify-and-ship.md:88` |
| Ongoing | `/correct` makes repeated mistakes impossible and "Prove[s] each new check fails on a real past mistake" | Same agent, then machine | `correct/SKILL.md:26` |

### Scripts that make verification structural

pstack applies its own Encode Lessons in Structure principle to verification:
- **`check-plan.mjs`** fails a plan when:
  - a PR section lacks its unit, live and perf blocks;
  - any of those blocks fails to open with the rule "Tests alone are not sufficient verification";
  - a live lane names no screenshot or no pass predicate;
  - there aren't exactly ten lanes;
  - the review gate is missing its boxes.

  Source: `poteto-mode/scripts/check-plan.mjs:139-184`.
- **`orch/store.ts`** makes the ledger grades a type (`store.ts:22-26`), so a grade outside the scale can't be written.
- **`watch-pr`** emits the forge's own verdict (`READY`, `WAITING`, `ADVANCE`, `COMPLETE`) so Babysit trusts the forge, not a green list (`babysit.md:12`).

## 3. Principles catalogue

Category comes from `poteto-mode/SKILL.md:42-79`. "Not about verification" means the principle shapes design, not proof.

| Principle | Category | Rule in one line | What it makes an agent verify or prove | Quote |
|---|---|---|---|---|
| Prove It Works | Verification | Check the real artifact, not a proxy | Every output, before declaring done; script the check when possible | "Verify every task output by checking the real thing directly. Do not infer from proxies, self-reports, or "it compiles."" (`principle-prove-it-works/SKILL.md:9`) |
| Fix Root Causes | Verification | Fix the first wrong decision, not where it surfaced | Reproduce first, read the real state, and check that the guarded state is legitimate | "Reproduce first." (`principle-fix-root-causes/SKILL.md:14`); "Read the actual error and the actual state. Do not guess." (`:16`) |
| Sequence Work into Verifiable Units | Verification | Small units, each ending in a check | Each unit green before the next; commit order proves the work | "don't advance until the current one is green" (`principle-sequence-verifiable-units/SKILL.md:9`); "watch it go red, then green." (`:11`) |
| Test Behavior, Not Implementation | Verification | Assert what users can observe | That a test fails when behavior breaks and survives a change to internals | "If the test still passes, it proves nothing." (`principle-test-behavior-not-implementation/SKILL.md:13`); "Derive the expected value from the requirement, not from a run of the code." (`:16`) |
| Explain the Number | Verification | Name the limiter before trusting a number | A measured speedup, regression or eval result | "You skipped this when the evidence behind a number has no run count, no spread, or no named limiter" (`principle-explain-the-number/SKILL.md:15`) |
| Build the Lever | Core | Build the tool that does or proves the work | Makes a check rerunnable by a reviewer; proves a codemod by diffing it against the hand-done unit | "A deterministic script turns "trust me" into "run this"." (`principle-build-the-lever/SKILL.md:10`) |
| Attack the Premise | Core | Two failed fixes on one premise means test the premise | The shared belief behind failed fixes | "Do not start the next fix before the premise is written down and tested." (`principle-attack-the-premise/SKILL.md:19`) |
| Outcome-Oriented Execution | Core | Converge on the target, accept planned breakage | Full checks at the end of a planned rewrite | "Require full static and runtime verification at plan completion" (`principle-outcome-oriented-execution/SKILL.md:21`) |
| Foundational Thinking | Core | Data structures and scaffold first | Puts test infrastructure and CI before features | "Sequence for option value: setup before features, tests before fixes." (`principle-foundational-thinking/SKILL.md:17`) |
| Minimize Reader Load | Core | Cut layers and hidden state | A 30-second readability test; Refactoring uses it as its success measure | "can a new reader answer "where does X come from?" and "what can change X?" in under 30 seconds?" (`principle-minimize-reader-load/SKILL.md:18`) |
| Exhaust the Design Space | Core | Build 2-3 prototypes before committing | Design by side-by-side comparison | "Build 2-3 competing prototypes and compare side by side before committing." (`principle-exhaust-the-design-space/SKILL.md:3`) |
| Laziness Protocol | Core | Smallest change that solves the problem | Not about verification (playbooks use it to revert "might help" changes) | "Make the smallest change that solves the problem." (`principle-laziness-protocol/SKILL.md:10`) |
| Subtract Before You Add | Core | Remove complexity first | Not about verification | "When evolving a system, remove complexity first, then build." (`principle-subtract-before-you-add/SKILL.md:9`) |
| Redesign from First Principles | Core | Redesign as if the requirement was always there | Not about verification | "Redesign as if the requirement had been a foundational assumption from the start." (`principle-redesign-from-first-principles/SKILL.md:9`) |
| Experience First | Core | User delight over convenience | Not about verification (it sets the target) | "Get the details right (transitions, alignment, spacing, feedback, error states)" (`principle-experience-first/SKILL.md:14`) |
| Make Operations Idempotent | Architecture | Converge to one end state on reruns | Three test questions: run twice, crash at every point, converge | "If any answer is "it depends on what state was left behind," the operation needs a reconciliation step." (`principle-make-operations-idempotent/SKILL.md:22`) |
| Migrate Callers Then Delete Legacy APIs | Architecture | Migrate and delete in one wave | Tests assert the new contract | "Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details" (`principle-migrate-callers-then-delete-legacy-apis/SKILL.md:15`) |
| Type System Discipline | Architecture | Make illegal states unrepresentable | Uses the compiler as a verifier | "Make the compiler reject impossible states, mismatched primitives, and unhandled variants." (`principle-type-system-discipline/SKILL.md:9`); "If the compiler can't prove a fact, prove it" (`:15`, removed on main) |
| Separate Before Serializing Shared State | Architecture | Remove sharing, then serialize by structure | Enforces one writer per branch by structure, not instruction | "Instructions and conventions are not concurrency control." (`principle-separate-before-serializing-shared-state/SKILL.md:9`) |
| Boundary Discipline | Architecture | Validate at the boundary, trust inside | Not about verification (it places validation) | "Place validation, type narrowing, and error handling at system boundaries." (`principle-boundary-discipline/SKILL.md:9`) |
| Model the Domain | Architecture | Encode the domain in a structure | Not about verification | "The sign that you skipped this is a new feature that grows an existing if/else chain by one more branch" (`principle-model-the-domain/SKILL.md:24`) |
| Never Block on the Human | Delegation | Proceed on reversible work, then present | "Present" means show the result; irreversible acts need confirmation | "Proceed, then present. Do the work, show the result." (`principle-never-block-on-the-human/SKILL.md:11`) |
| Guard the Context Window | Delegation | Bulk to subagents, summaries to the lead | Not about verification | "Route bulk to subagents; keep summaries in the main thread, not raw payloads." (`principle-guard-the-context-window/SKILL.md:3`) |
| Encode Lessons in Structure | Meta | Turn a repeated instruction into a lint, check or script | Turns corrections into checks that fail | "If the fix is structural, only use the structural fix. The instruction is the symptom." (`principle-encode-lessons-in-structure/SKILL.md:11`) |

How principles are used: `poteto-mode` reads the index, applies the leaves a task triggers, and must "name each principle that shaped a decision and the specific choice it changed" (`poteto-mode/SKILL.md:15`). "A principle citation with no decision behind it is the tell that it name-dropped instead of applying" (`docs/guide/08-principles.md:27`). Several principle bodies are only a line or two at this commit, such as Encode Lessons in Structure and Exhaust the Design Space. Their descriptions carry the rule.

## 4. Playbooks catalogue

Steps are condensed to the verification steps. Unless marked, all paths are `pstack/skills/poteto-mode/playbooks/<file>`.

| Playbook | Trigger and kind of work | Verification steps, in order | Evidence | Who verifies | Stops when | Principles and skills it calls |
|---|---|---|---|---|---|---|
| Authoring a skill (`authoring-a-skill.md`) | Writing or editing a SKILL.md; prose for agents | Validate frontmatter, that referenced files exist, and that links resolve. Test cases "if structural. Skip if subjective." (`:6-7`) | Validation notes | Same agent; behavior changes go to Eval | PR opened | create-skill (Cursor), encode-lessons-in-structure, Opening a PR |
| Autonomous run (`autonomous-run.md`) | "run until done", "/loop until X"; one task driven to done | State the exit condition as a checkable predicate (`:5`). Each iteration verifies against it, commits if it advanced, discards if not (`:7`). Checkpoint every iteration (`:10`) | Decision trail rows; final predicate state | Same agent against the predicate | Predicate met; a real dead end is surfaced; "never relax the predicate" (`:11`) | sequence-verifiable-units, show-me-your-work, Cursor `/loop` |
| Autopilot-full (`autopilot-full.md`) | "full autopilot"; queue of independent PRs to merged | Owner proves the change on the real artifact, runs repo checks on the committed head, rebases to trunk, reports the code-ready head (`:8-10`). Full swarm verifies once: gates, live through a control skill, diff audit (`:14`). Proven findings go back with a red test (`:16`). Merge only what was verified, tested on trunk, with green CI (`:17-19`). Gate-loosening needs proof plus the root's countersign (`:20`) | Verdict per head, receipts, CI, trail | Independent swarm; root audits receipts; human grants the queue | Operator's stop; operator's own items stop at merge-ready (`:7`); a third rebase holds (`:19`) | swarm, babysit, shipping (patch-id), opening-a-pr, show-me-your-work, ketchup, deslop, no-comments |
| Autopilot-stack (`autopilot-stack.md`) | "stack them, don't ship"; coupled changes the operator lands | As Autopilot-full, but owners report STACK-READY and never merge (`:5`). Each link carries its verdict (`:8`) | One stack, a verdict per link | Independent; human lands | Chain delivered | As Autopilot-full |
| Babysit (`babysit.md`) | "babysit this", "get it green"; PR to merge-ready | Order: conflicts, then threads, then CI (`:11`). Trust the forge's verdict through `watch-pr` (`:12`). Classify CI before any retrigger: one fresh build, never a job retry (`:19`). Verify each Bugbot claim against the code; fix real findings red-first (`:20`) | Forge `READY`; thread replies with a disproof or commit | Same agent plus the forge | Merge-ready. "Babysitting never authorizes merging." (`:21`) | watch-pr, bugbot-triage reference, shipping |
| Bug fix (`bug-fix.md`) | A reported defect | Reproduce it yourself on the matching surface (`:7`). Binary-search hypotheses with runtime evidence (`:8`). "Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. … Unit tests show branch behavior, not bug absence." (`:10`). Failing repro lands before the fix (`:11`) | "failing-then-passing repro output verbatim" (`:15`) | Same lead (delegates the fix) | PR opened | control skill, how, why, architect, interrogate, tdd, fix-root-causes, sequence-verifiable-units |
| Eval (`eval.md`) | Testing a skill, structure or prompt change | Blinded organic prompt. N candidates on different models. One blinded judge from a different family (`:21`). "Verify the chain from transcripts, not self-report" (`:22`). Read every output yourself (`:23`) | Rubric, judge's verdict, synthesis | Other family, then lead | Recommendation to promote or not | arena |
| Feature (`feature.md`) | New or changed behavior | Throughput checkpoint (`:7-11`). Delegate, or arena where shapes compete. "Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass." (`:13`). Sequence units (`:15`). Interrogate if the design is contested (`:16`) | Run paths in the PR's Verification section | Lead over delegate; other family through arena or interrogate | PR opened | how, architect, arena, model-the-domain, separate-before-serializing-shared-state, sequence-verifiable-units, interrogate |
| Hillclimb (`hillclimb.md`) | Sustained improvement of one metric | "one change, one measurement, keep or revert" (`:5`). Build the harness, prove its sensitivity, vet it with benchmark-checklist, freeze it (`:8`). Record the baseline and a green regression gate before any change. Log each attempt in `decision.tsv` (`:9`) | Frozen harness output; decision.tsv; baseline to final | Lead reviews delegates; harness measures | Predicate (target plus a floor on attempts) met, or only marginal ideas left; never relax it (`:18`) | how, build-the-lever, benchmark-checklist, show-me-your-work, prove-it-works, sequence-verifiable-units, laziness-protocol |
| Investigation (`investigation.md`) | Read-only questions | Route through `how` and `why`. A cited output, or a recommendation with a trade-offs table (`:7-9`). Push back if the premise is wrong (`:14`) | Citations; `why`'s confidence tiers | Same agent, held to `why`'s epistemics | Answer delivered | how, why, unslop |
| Multi-phase plan (`multi-phase-plan.md`) | Work spanning PRs; the plan is the deliverable | Settle questions by prototype (`:6`). Each PR has unit, live and perf boxes: "Tests alone are not sufficient verification." (`:13`). Ten live lanes, including a regression lane against trunk; a two-sided perf gate; a review gate for interaction changes (`:13`). `check-plan.mjs` validates the structure (`:10`). Merge box: clean verdict at the exact head SHA, Bugbot triage, rebased with patch-id unchanged (`:128-131`) | Plan file and script output | Script now; independent swarm and human later | Plan handed back; execution waits for the operator's go (`:11`) | prototype, swarm, control skills, technical-writing, unslop, check-plan, Autopilot or Orchestrate |
| Opening a PR (`opening-a-pr.md`) | End of every other playbook | `/deslop`, `/no-comments`, prose through technical-writing and unslop (`:9`). The body's `## Verification` holds "1–3 bullets, each a real run path and its outcome" (`:20`). Videos or screenshots "when they prove a claim" (`:22`). Subagent PRs run interrogate (`:34`) | PR body's Verification section; linked artifacts | Same agent; Comment Sicko; interrogate panel | PR URL posted | deslop, no-comments, technical-writing, unslop, interrogate |
| Orchestrate (`orchestrate.md`) | A multi-day program | Pilot one unit to falsify the brief and verify recipe (`:63`). Each brief carries ACCEPTANCE and VERIFY (`:43-44`). "Scale verification to the unit" (`:88`). Verifier on a different family (`:17`). Ledger keyed by PR and head SHA (`:90`). Close: predicate on the real artifact, a verdict for every landed head, trail with cross-model review (`:67`) | `ledger.tsv`, `units.tsv`, trail | Worker self-report, overridden by an other-family verifier; coordinator spot-checks receipts; human gates in `gates.md` | Predicate met; land what's verified by about 70% of the budget (`:61`) | swarm, arena, show-me-your-work, orch CLI, babysit |
| Pause safely (`pause-safely.md`) | Explicit pause | A resume note records "progress and what's verified" (`:8`) | `wip:` commit, resume note | Same agent | Clean stop | show-me-your-work |
| Perf issue (`perf-issue.md`) | A measured slowness | Baseline trace through the control skill, vetted with benchmark-checklist (`:5`). Post-fix trace. Compare artifacts. "Inconclusive" or wrong-surface is not a pass (`:19`). Cite the measurement in the PR (`:20`) | Baseline, post-fix number, delta, artifact path | Same lead | Earliest mantra that meets the target (`:16`) | control skill, how, benchmark-checklist, architect, sequence-verifiable-units |
| Prototype (`prototype.md`) | A design or behavior decision | Variants behind one switcher (`:10`). "Verify on the matching surface." Screenshot each variant and drive it; "The observation is the test here, not an assertion." (`:11`) | Screenshots, observed timing or output | Same agent, then the human chooses | Decision plus a throwaway artifact | exhaust-the-design-space, control skill, Feature |
| Refactoring (`refactoring.md`) | A behavior-preserving change | Pin the contract first: "Type check and lint are not a pin." (`:7`). Every step keeps the pin green (`:11`). Equivalence check on the real artifact (`:12`). Reader load must drop, or revert (`:13`) | The pin, the equivalence proof, the reader-load delta | Same lead | PR opened | how, model-the-domain, foundational-thinking, subtract-before-you-add, migrate-callers, prove-it-works, minimize-reader-load, sequence-verifiable-units |
| Runtime forensics (`runtime-forensics.md`) | A live symptom; diagnosis only | Capture a real artifact (`:5`). "Prove the mechanism before believing it." (`:7`). Map to source (`:8`) | Profile, heap snapshot or CDP trace, plus source location | Same agent | Cited diagnosis | control skill, guard-the-context-window |
| Session pickup (`session-pickup.md`) | Resuming another agent's work | Trust the trail, but "Verify the inherited claims against the original goal on the real artifact … A passing prior self-report is not the proof." (`:9`) | The resume point | Same agent | Routed to the next playbook | prove-it-works, guard-the-context-window |
| Shipping (`shipping.md`) | "land the stack" | One verifier per PR runs the change as a user, parent against head, and posts `PASS` / `PASS+NOTES` / `FAIL`. "Only a verdict from an agent that did not write the code counts" (`:5`). Land only the contiguous verified run (`:6`). Patch-id rule (`:7`). Read each PR back after merging (`:8`) | Each PR's verdict and who gave it | Independent agent | The ceiling: the first PR without a verdict (`:10`) | control skills, watch-pr |
| Trace forensics (`trace-forensics.md`) | A captured artifact; diagnosis only | Load into a queryable form (`:8`). Attribute to source (`:10`). A paired capture confirms; otherwise it's "the strongest hypothesis the artifact supports, not a confirmed cause" (`:11`) | Reduced finding, source location | Same agent | Cited diagnosis | guard-the-context-window |
| Visual parity (`visual-parity.md`) | Pixel-exact UI equivalence | "Equivalence is verified by image diff, not by eye." (`:3`). Baseline first: "No baseline, no parity claim." (`:5`). No harness or baseline tampering (`:6`). "A nonzero diff is a fail." (`:8`) | Diff result per component | Machine (image diff) | Diff is zero per component | separate-before-serializing-shared-state, control skill, `/loop` |
| Worktree cleanup (`worktree-cleanup.md`) | Reclaiming disk | Audit script. "The bucket is advice, not permission." (`:4`). Verify usage from transcripts. Pause on uncommitted work (`:6`) | `df -h` before and after; reasons for each held worktree | Script, subagents, then human for `wip` | Confirmed set pruned | build-the-lever, prove-it-works, guard-the-context-window |

## 5. Other skills that take part in verification

| Skill | What it contributes | Source |
|---|---|---|
| `poteto-mode` (router) | Triggers the control skill for UI, IDE and CLI work, the benchmark checklist for numbers, Shipping for landing, and a trail for long work (`:30-36`). Verifiers run on the fast worker model: "Verification is the exception and stays on the `swarm workers` model" (`:97`). Reply rule: "Every claim carries its evidence or its label … Never hand the human a check you could run." (`:113`) | `poteto-mode/SKILL.md` |
| `create-verification-skill` | Generates `verify-<app>` with Launch, Doctor, Drive, Evidence, Cleanup and Helpers sections, plus a feature map. Proof standards include: real user path, action plus resulting state, side effects, mocks only at production boundaries (`:30`). "A generated skill that was never executed is a draft, not a deliverable." (`:40`) | `create-verification-skill/SKILL.md` |
| `maintain-verification-skill` | A source wave (one reader per feature) plus one live pass over every feature. Outcomes are `clean`, `changed` or `blocked`. A feature is `verified-unreachable` only with the concrete prerequisite named. "Never edit product code during a run" (`:21`) | `maintain-verification-skill/SKILL.md` |
| `swarm` | Fans out workers that report `PASS`, `ISSUES` or `BLOCKED` with evidence (`:34`). Drops results that lack the SHAs and method their brief names. "A gap does not count as a pass." (`:40`) | `swarm/SKILL.md` |
| `arena` | N candidates; a readonly cross-judge, preferring "a different model family from the parent's" (`:28`); pick a base, graft, then verify the result (`:44`) | `arena/SKILL.md` |
| `interrogate` | Adversarial review by several models; "The adversarial signal comes from model diversity" (`:9`). Findings raised by two or more models are the highest signal (`:42`). Sorted into Act on, Consider, Noted, Dismissed. The rubric has a Verification lens: "Check the real thing, not a proxy" (`references/rubric.md:53`) | `interrogate/` |
| `show-me-your-work` | The decision trail (`ts, phase, decision, why, evidence, result`). Audit the log against the transcript: "Correct the log, not the story." (`:63`). Cross-model review: "Self-review is not a substitute." (`:67`). Reply ends with "Attention" and `reviewed by <model>` (`:74`) | `show-me-your-work/SKILL.md` |
| `figure-it-out` | A falsifiable done predicate and a rigor level (`:19-21`). Harness built before the work (`:29`). "Pair delegated work with a judge." (`:41`). `VERIFIED` / `NOT VERIFIED` / `INCONCLUSIVE`; "Inconclusive is not a pass." (`:42`) | `figure-it-out/SKILL.md` |
| `sharpen` | Before starting, "always keep one outside check that the result is right" (`:7`) | `sharpen/SKILL.md` |
| `ketchup` | Honest reporting: "Check each number you will show against the facts it comes from" (`:15`). Never mark done what waits on the user (`:25`). A visible change with no capture is marked "No screenshot yet" (`:37`) | `ketchup/SKILL.md` |
| `benchmark-checklist` | Seven questions per number. Verdict is faster, slower, no measurable difference, or inconclusive. It's inconclusive with no named limiter, an untuned side, or unchecked errors or work (`:33`) | `benchmark-checklist/SKILL.md` |
| `blast-radius` | "A blast-radius writeup that sounds right is worthless." (`:17`). A five-step proof ladder: said so, pointed at the line, showed the bad case can't happen, ran it, reproduced it in the running app (`:23-27`). Prove the one fact the change is safe because of (`:37`) | `blast-radius/SKILL.md` |
| `tdd` | Failing test first; "Confirm it fails for the intended reason." (`:18`). "Prefer no new test over a bad test." (`:26`) | `tdd/SKILL.md` |
| `correct` | Make each repeated mistake impossible: architecture, then types, then a lint, then a test, then docs. "Prove each new check fails on a real past mistake." (`:26`) | `correct/SKILL.md` |
| `reflect` | Three reviewers (two lenses on the judgment model, one on the fast model) plus a synthesizer. Accepted, Rejected and Backlog lists. Waits for the human before any skill edit (`:47`) | `reflect/SKILL.md` |
| `recall` | Verifies mined context against live `git` and `gh` state (`:21`) | `recall/SKILL.md` |
| `architect` | Arena across families, a red-flags screen (`:35`), and scrap signals as proof the design is wrong (`:59-66`). Lauren: "that is empirical proof that the architecture is wrong" (Complete Guide Pt. 2) | `architect/SKILL.md` |
| `why` | Confidence tiers: Direct, Supported, Inferred, Speculative, Unknown. Each claim needs an adjacent citation or moves down a tier. A null result is a finding (`references/epistemics.md:7-37, 69-71`) | `why/` |
| `how`, `teach` | Grounded explanations. "An agent that has to explain its work must read the code and back each claim with evidence" (`docs/guide/03-understand.md:51`). Teach keeps `why`'s confidence language intact (`teach/SKILL.md:11`) | `how/`, `teach/` |
| `no-comments` and the Comment Sicko agent | A reviewer that didn't write the comments. A comment that claims a constraint is turned into a type, test or lint (`no-comments/SKILL.md:23`) | `no-comments/`, `agents/comment-sicko.md` |
| `in-your-own-words`, `bro` | Restating intent so the human can verify understanding before work starts (Complete Guide Pt. 2) | `in-your-own-words/`, `bro/` |
| `typescript-best-practices` | "Type guards … Must verify the claim" (`:22`). "Real tests. Don't mock what you can run … verify UI in a running build." (`:28`) | `typescript-best-practices/SKILL.md` |
| `unslop`, `technical-writing` | Prose rules. Rule 27: "Say what it does, not how it feels … names the mechanism or a number" (`unslop/SKILL.md:56`) | `unslop/`, `technical-writing/` |
| `setup-pstack` | Picks the `swarm workers` model that every verifier uses. Offers `/create-verification-skill` once (`:72-74`) | `setup-pstack/SKILL.md` |
| `poteto-help` | Points a user who got "success from a green build" at Prove It Works | `poteto-help/SKILL.md` |
| `automate-me` | Mines "Verification posture (what "done" means, unit tests vs live repro, reviewers)" into a personal mode. The output is checked by a human vibe-check | `automate-me/SKILL.md` |
| benny pack | The exact discriminating symptom must "appear twice through real UI interaction" (`reproduce-and-fix-issues/SKILL.md:25`). A read-only media reviewer confirms the evidence shows it (`:194`). "A compile, unit test, code review, or plausible diff is not after evidence." (`:280`). Draft PR only (`:291`). Verifying an existing fix has three outcomes: Confirmed, Insufficient fix, Inconclusive (`references/verify-existing-fix.md:61-89`). "fail closed" when config is missing (`:11`) | `automations/benny/` |
| `make-bot-ui` | Not part of verification (Cursor-only webhook UI) | `make-bot-ui/SKILL.md` |

### The outcome scales pstack uses

pstack has no single verdict scale. Each skill names its own outcomes:

| Where | Outcomes |
|---|---|
| Shipping verifier | `PASS`, `PASS+NOTES`, `FAIL` (`shipping.md:5`) |
| figure-it-out | `VERIFIED`, `NOT VERIFIED`, `INCONCLUSIVE` (`figure-it-out/SKILL.md:42`) |
| swarm worker | `PASS`, `ISSUES`, `BLOCKED` (`swarm/SKILL.md:34`) |
| Verification ledger | `live-ui-verified`, `unit-test-verified`, `type-check-only`, `verifier-blocked`, `verifier-failed` (`orchestrate.md:90`) |
| maintain-verification-skill | `clean`, `changed`, `blocked`; plus `verified-unreachable` per feature |
| benchmark-checklist | faster, slower, no measurable difference, inconclusive |
| benny verify-existing-fix | Confirmed, Insufficient fix, Inconclusive |
| benny repro | reproduced, `Could not reproduce`, `Blocked` |
| interrogate lead | Act on, Consider, Noted, Dismissed |
| bugbot triage | `fix`, `dismiss`, `ask` |
| reflect | Accepted, Rejected, Backlog |
| why | Direct, Supported, Inferred, Speculative, Unknown |
| blast-radius | proof ladder steps 1 to 5 |
| watch-pr | `READY`, `WAITING`, `ADVANCE`, `COMPLETE` |

Two rules run through all of them. A missing or partial result is never a pass ("Inconclusive is not a pass", "A gap does not count as a pass", "`verifier-blocked` is not a pass"). And a verdict covers one exact commit ("A new head SHA voids the row", `orchestrate.md:90`).

## 6. Verification by kind of work

| Kind of work | What pstack treats as proof | Quote | Coverage |
|---|---|---|---|
| UI and interaction changes | Walk the changed flow in the running app through the control skill or verification skill, with screenshots and a recording. A PR that changes an interaction waits for the operator's review of screenshots and a video | "A UI change walks the changed flow in the running app." (`docs/guide/06-verify-and-ship.md:22`); "A PR that changes an interaction is review-gated." (`multi-phase-plan.md:13`) | Covered |
| Visual parity | Image diff against a frozen baseline. Lauren's StyleX loop compares computed styles before and after across themes and states, and has another agent inspect the media | "Equivalence is verified by image diff, not by eye." (`visual-parity.md:3`); "A failed build or parity check ends the run." (Loops You Can Trust) | Covered |
| API and backend | Drive it over plain HTTP through the verification skill. Check side effects such as rows written and messages sent. A storage change reads back the written value. There's no API-specific playbook | "verify side effects (files written, rows inserted, messages sent) alongside what's visible" (`create-verification-skill/SKILL.md:30`); "A storage change reads back the written value." (`docs/guide/06-verify-and-ship.md:25`) | Partly |
| CLI | Run the real command. Proof is the command, stdout, stderr and exit code | "A CLI change runs the real command." (`docs/guide/06-verify-and-ship.md:21`); "CLI proof includes the command, stdout, stderr, and exit code." (`create-verification-skill/references/feature-map-example/README.md:27`) | Covered |
| Data and migrations | Replay a saved input. Idempotency tests (run twice, crash at each point). Full verification at the end of a planned migration. Bugbot findings on migrations are "ask", never auto-dismissed. There's no migration playbook; the guide suggests writing one | "A parser or migration replays a saved input." (`docs/guide/06-verify-and-ship.md:23`); "Migration, schema, idempotency, concurrency, and cross-system behavior findings." (`references/bugbot-triage.md:81`) | Partly |
| Performance | Baseline trace, post-fix trace, benchmark-checklist on every number, a two-sided perf gate (trunk against head), and swarm sampling to confirm a win | "Tie every fix to a measurement, don't read source instead of measuring." (`perf-issue.md:3`) | Covered |
| Bug fixes | Reproduce on the matching surface. The failing repro lands before the fix. The same repro passes after. benny requires the symptom twice before and its absence twice after, plus a media review | "Unit tests show branch behavior, not bug absence." (`bug-fix.md:10`) | Covered |
| Refactors | A behavior pin (characterization test, snapshot or equivalence harness) held green at every step, then an equivalence check on the real artifact | "Type check and lint are not a pin." (`refactoring.md:7`) | Covered |
| Flaky tests and CI | Classify before any retrigger: one fresh build, never a job retry. An identical second failure isn't flake. Check for a stale base. Make a flaky test deterministic | "Flake or infrastructure earns one fresh build, never a job retry." (`babysit.md:19`) | Covered |
| Dependency upgrades | No playbook. Only a lockfile rule at merge (a frozen install on the merge result) and blast-radius's "check its pinned version and any local patch" | `autopilot-full.md:19`; `blast-radius/SKILL.md:35` | Not covered |
| Security | The interrogate rubric's security lens (trace the input path). Bugbot and security-review findings go to the human by default. Babysit escalates auth, billing, data and migration findings. No security playbook | "For each security finding, trace the input path through the code and show it." (`interrogate/references/rubric.md:72`); "Security, privacy, auth, billing, data retention … findings." (`references/bugbot-triage.md:79`) | Partly |
| Docs and prose | Rules (technical-writing, unslop). Skill structure is validated; skill behavior goes through Eval. Plans are checked by `check-plan.mjs`. Personal modes get a human vibe-check | "Test cases if structural. Skip if subjective." (`authoring-a-skill.md:7`) | Partly |
| Research claims | Every claim carries a citation or a label. `why`'s five confidence tiers. Null results are reported. Never fabricate a link | "Every claim carries its evidence or its label in the same sentence. Measured, inferred, or guess." (`poteto-mode/SKILL.md:113`) | Covered |
| Design decisions | Prototypes judged by observation. Arena with a cross-judge from another family. Architect's red flags and scrap signals. Interrogate on a diff, never on an abstract plan. Product direction stays with the human | "Point adversarial review at a plan with no code behind it and the reviewers invent theoretical risks" (`docs/guide/04-design.md:89`); "Product direction comes from the human." (`principle-never-block-on-the-human/SKILL.md:15`) | Covered |

## 7. Vocabulary

### pstack's terms about verification and trust

| Term | pstack's meaning | Quote and source |
|---|---|---|
| Verification | An agent checks its own work and closes the loop without the human | "verification means that an agent can verify its own work. It can keep going until it succeeds at its task, because it can now close the loop without you being the bottleneck." (Complete Guide Pt. 1) |
| Limiting step | Verification is the stage that bounds a loop's output | "Verification has become the limiting step, or long pole of software development" (Loops You Can Trust) |
| Verification skill (also control skill, `verify-<app>`) | A project-local skill that drives the real app the way a user does | "a project-local skill that teaches agents to drive your app the way a user does" (`docs/guide/01-setup.md:35`); Lauren calls it "critical infrastructure" (Complete Guide Pt. 1) |
| Feature map | Per-feature files: how to reach the feature, how to drive it, what end state proves it | "a form of "materialized memory"" (Complete Guide Pt. 1); `create-verification-skill/SKILL.md:36` |
| Launch, Doctor, Drive, Evidence, Cleanup | The verification skill's five required sections | `create-verification-skill/SKILL.md:27-31` |
| Matching surface | The interface the user touches for that change | "Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass." (`feature.md:13`) |
| Finish condition (also exit condition, predicate, done predicate) | A checkable definition of done, stated first | "State the exit condition as a checkable predicate before the first iteration" (`autonomous-run.md:5`); "a duration is not a finish condition" (`docs/guide/07-overnight.md:118`) |
| Verdict | An independent judgment on one patch | "A verdict covers one patch and green CI covers one head." (`autopilot-full.md:5`) |
| PASS+NOTES | A pass with findings attached, which still go back to the owner | "Findings go back to the owner, including a defect that a lane filed as a note." (`multi-phase-plan.md:66`) |
| INCONCLUSIVE | A check that couldn't decide | "Inconclusive is not a pass. Don't hide a negative." (`figure-it-out/SKILL.md:42`) |
| Live lane | One verifier driving the real surface through one scenario, with a screenshot and a pass predicate | `multi-phase-plan.md:13` |
| Gates lane, audit lane, perf lane, regression lane against trunk | The swarm's other lane kinds | `multi-phase-plan.md:13, 65` |
| Receipts | The evidence behind a claim, checked by the root | "no lane trusts a claim it has not checked" (`autopilot-full.md:14`) |
| Verification ledger | One row per verdict, keyed by PR and head SHA | `orchestrate.md:90` |
| Patch-id rule | An old verdict survives a rebase only if `git patch-id` is unchanged | `shipping.md:7` |
| Code-ready head, merge-ready, STACK-READY | The states a PR passes through | `autopilot-full.md:10`; `autopilot-stack.md:5` |
| Ceiling, contiguous verified run | The first unverified PR, and everything verified below it | `shipping.md:6, 10` |
| Grant | The human's explicit permission for named work to merge | "The grant covers only the queue's items" (`autopilot-full.md:7`) |
| Countersign | The root's approval of anything that loosens a gate | `autopilot-full.md:20` |
| Always-pause | Irreversible acts that always wait for the human | "Always pause for irreversible writes: force-push to shared branches, deploys, data deletion, customer messages." (`poteto-mode/SKILL.md:85`) |
| Review gate | The human's review of an interaction change, with screenshots and a video | `multi-phase-plan.md:13, 120-124` |
| Stop the line | Any stage may refuse to pass bad work forward | "every stage can stop the line" (Loops You Can Trust; `docs/guide/07-overnight.md:113`) |
| Lowest value stage | Catch a defect where it's cheapest | "catch defects at the lowest value stage" (Loops You Can Trust) |
| Decision trail (also decision log) | An append-only TSV of decisions with evidence pointers | `show-me-your-work/SKILL.md:13-22` |
| Attention section | The cross-model reviewer's flags at the end of a reply | `show-me-your-work/SKILL.md:74` |
| Trust, but verify; show me your work | Lauren's stance | "I ask the same thing from agents in chat and from agents running inside Automations: show me your work." (Loops You Can Trust) |
| Pin | A behavior contract held while structure changes | `refactoring.md:7` |
| Baseline | The spec for parity or measurement work | "The baseline is the spec. You do not touch it." (`visual-parity.md:3`) |
| Lever | A rerunnable tool that does or proves the work | `principle-build-the-lever/SKILL.md:10` |
| Discriminating state | The final state that separates correct from broken | `automations/benny/skills/reproduce-and-fix-issues/SKILL.md:153, 181` |
| Media review | A read-only check that the evidence shows the broken state | `reproduce-and-fix-issues/SKILL.md:194` |
| Fail closed | Stop when config or a capability is missing | `reproduce-and-fix-issues/SKILL.md:11` |
| Proof ladder ("How sure are you") | Five levels, from "You said so" up to "You reproduced it in the running app" | `blast-radius/SKILL.md:19-27` |

### Proposed terms for Friday's glossary

**Everything in this subsection is inference.** Each proposal was checked against `GLOSSARY.md` on `origin/main`: Builder, Critic, the three gates, Surface, Unattended run, Fan-out and the rest. Format follows the glossary.

**Verification**:
An agent proving its own work on the running app, with evidence, before the work goes on: to Somya at a gate, or to a merge.
_Avoid_: testing, self-review, QA

*Confirms the session's term.* Lauren's definition centres on closing the loop without the human. Tests are one input, not the whole.

**Verification skill**:
A project's own skill that launches its app, drives it the way a user does, and captures evidence, with a feature map of what to check.
_Avoid_: control skill, test harness

*Confirms the session's term.* pstack uses "verification skill" and "control skill" for one thing. Pick one.

**Verifier**:
An agent that checks work it did not write and gives a Verdict, from the other model family where possible.
_Avoid_: reviewer, judge, checker

*New.* Friday has Builder and Critic but no name for this role. It differs from the Critic: the Critic scores how a Variant *looks* against its Direction during build rounds, while a Verifier says whether the code *works* at one commit. "Reviewer" and "judge" are already on the Critic's _Avoid_ line.

**Verdict**:
A Verifier's Pass, Fail or Inconclusive on one exact commit. A new commit voids it unless the patch is unchanged.
_Avoid_: approval, review, sign-off

*Refines the session's term.* It uses three outcomes, because pstack's own rule is "Inconclusive is not a pass". It drops PASS+NOTES, since pstack sends notes back as defects anyway. It names the patch-id exception.

**Live check**:
One run of the real app through the Verification skill: a scenario, the evidence it saves, and the condition that makes it pass.
_Avoid_: live lane, smoke test

*New, replacing pstack's "live lane"*, because "lane" assumes a swarm and Friday's budget allows about one live check per PR. The session already used "live check".

**Finish condition**:
A statement of done, written before work starts, that commands can pass or fail.
_Avoid_: predicate, exit condition, definition of done, a duration

*New.* pstack uses four names for this. The guide's "finish condition" reads plainest.

**Decision trail**:
A run's append-only log of decisions, each with its reason and a pointer to evidence, reviewed by the other model family before the work is handed back.
_Avoid_: decision log, audit log

*New.* pstack uses "decision trail" and "decision log" for one thing.

**Autonomy level**:
How far a project's Non-UI work may run without Somya: attended, unattended to PR, or unattended to merge. Somya raises it per project.
_Avoid_: autopilot, trust level

*Confirms the session's term.* It must not reuse pstack's "Autopilot", because the glossary already lists "autopilot" under _Avoid_ for Unattended run. pstack's Autopilot-stack corresponds to "unattended to PR", and Autopilot-full to "unattended to merge". pstack's "grant" is what raising the level means.

**Always-pause list**:
The actions no agent takes without Somya at any Autonomy level: force-push, deploys, deleting data, messages to anyone, loosening a check, migrations against real data, and any PR that changes what a user sees.
_Avoid_: blocklist, never list

*New.* It keeps pstack's name, so copied skills read the same, and extends pstack's four items with Somya's.

**Clashes to avoid when copying pstack's wording:**

- **"surface".** pstack's "matching surface" means the browser, terminal or API a user touches. Friday's **Surface** is a UI design job (a page or app). Owned copies should say "on the running app, the way the user reaches it", or similar, never "surface".
- **"gate".** pstack says "gates lane" (repo checks) and "review gate" (the human). Friday's gates are Somya's three decisions. The session's "merge gate" for Non-UI work would add an automatic gate. Call it the **merge conditions** instead, and keep "gate" for Somya. pstack's review gate corresponds to Friday's Ship gate.
- **"video".** pstack's review gate wants a 30 to 60 second screen recording of the change (`multi-phase-plan.md:123`). Friday's video is a generated clip made in Flow, part of the design. Call pstack's kind a **screen recording**.
- **"swarm".** The glossary's Fan-out entry avoids "swarm". pstack's swarm is a Fan-out of Verifiers.
- **"owner", "worker".** Builder avoids "worker". pstack's PR "owner" is the one agent allowed to write a branch. For Non-UI work, Friday needs either a broader **Builder** ("the agent that writes one change: a Variant, or one piece of Non-UI work") or a new term. That's a decision for the session, not this doc.
- **"judge".** The Critic avoids "judge". pstack's arena cross-judge picks among candidates. If Friday copies arena, its judge needs a Friday name.

## 8. What it means for Friday

**Everything in this section is inference** from the findings above, not a finding in any source.

### What to copy as owned `pstack-` skills, by kind of work

Friday has two kinds of work:
- **UI work** always stops at the Direction, Variant and Ship gates, and its agents verify before each gate.
- **Non-UI work** has no gate. It runs at its project's autonomy level, up to merging its own PR once the merge conditions hold: the finish condition is met, checks are green, an agent that didn't write the code has run a live check, there's a cross-family verdict, and there's a decision trail.

| pstack piece | Both kinds | UI work | Non-UI work | Note |
|---|---|---|---|---|
| Principles: Prove It Works, Sequence Verifiable Units, Test Behavior Not Implementation, Explain the Number, Fix Root Causes, Build the Lever, Encode Lessons in Structure, Attack the Premise | ✓ | | | Cheap to keep: one rule each, read only when triggered |
| `create-verification-skill`, `maintain-verification-skill` | ✓ | | | The foundation in Lauren's words. Rewrite paths from `.cursor/skills/` to the project's skill folder. One verification skill per project serves both kinds |
| `show-me-your-work` plus `log.sh` | ✓ | | | The decision trail. Its cross-model review can run on Sol through `codex exec` |
| `benchmark-checklist`, `blast-radius`, `tdd` | ✓ | | | Narrow and cheap |
| Prototype playbook, Exhaust the Design Space | | ✓ | | Overlaps Matt's and Emil's prototype skills. The keep, cut, merge or replace ticket decides |
| Visual parity playbook | | ✓ | | For Refinements that must not change the look, and for styling migrations |
| Review-gate format (screenshots plus a 30-60 s screen recording) | | ✓ | | What the Ship gate receives |
| Bug fix, Feature, Refactoring, Perf issue, Hillclimb, Investigation playbooks | | | ✓ | Each ends in proof on the running app |
| Autonomous run (on `/goal`), Autopilot-stack, Autopilot-full, Shipping, Babysit plus `watch-pr`, Opening a PR | | | ✓ | Autopilot-stack is "unattended to PR"; Autopilot-full is "unattended to merge" |
| `interrogate`, `arena`, `swarm` | | | ✓ | Panels shrink to two seats (Opus plus Sol); swarm shrinks to about one live check |
| `figure-it-out` | | | ✓ | For large or unattended work |
| `correct`, `reflect` | (fog) | | | Belong to the map's "How Friday improves itself" fog |
| Eval playbook | (fog) | | | Fits the map's "Proving skills work" fog: blind candidates and an other-family judge |
| Orchestrate, Multi-phase plan's ten-lane template, `make-bot-ui`, benny pack | | | | Leave out. Too heavy for Pro, or Cursor-only. benny's stage pattern (stop the line, repro twice, media review, draft PR) is worth restating in Friday's own words |

### Verification before each UI gate

| Gate | What reaches Somya | pstack pieces behind it |
|---|---|---|
| Direction gate | Directions are briefs; nothing runs yet | Lauren never reviews abstract plans adversarially (`docs/guide/04-design.md:89`). So keep this check light, such as Sharpen's single outside check that the Directions really differ. The design skill ticket decides |
| Variant gate | Each Variant has passed its Critic loop, plus one Live check: the route loads, no console errors, the main interaction works, screenshots at fixed sizes | The prototype playbook's "observation is the test" rule. `create-verification-skill`'s evidence standards. benny's "same path twice" rule if a Variant is flaky |
| Ship gate | A Verdict on the head commit, screenshots of the changed states, and a screen recording | Multi-phase plan's review gate format. Lauren's StyleX loop (states and themes, paired screenshots, media review by another agent). Visual parity for Refinements |

### Non-UI merge conditions mapped to pstack

| Merge condition | pstack source |
|---|---|
| Finish condition met, with the commands in the transcript | `autonomous-run.md:5`; `figure-it-out/SKILL.md:19` |
| Checks green on that head | `multi-phase-plan.md:58`; CI as "an input to a verdict, not a verdict" (`orchestrate.md:90`) |
| A Live check by an agent that didn't write the code | `shipping.md:5`; `autopilot-full.md:14` |
| A cross-family Verdict on the exact head | `orchestrate.md:17`; patch-id rule (`shipping.md:7`) |
| A Decision trail with an Attention section | `show-me-your-work/SKILL.md:74` |
| Nothing on the Always-pause list | `poteto-mode/SKILL.md:85`, extended with Somya's items |
| One merge at a time, each read back after merging | `shipping.md:8` |

### What each piece costs on Claude Pro

Neither plan publishes per-model usage figures, so these are relative weights only. Codex work runs on ChatGPT Plus, not the Pro pool.

| Piece | When it runs | What it spends | Fit on Pro |
|---|---|---|---|
| Principles | When a trigger fires | A short read each | Free in practice |
| `create-verification-skill` | Once per project | One session plus one end-to-end proof run | Fine |
| `maintain-verification-skill` | Lauren says daily | One reader subagent per feature plus a live pass over every feature | Too much daily on Pro. Run it weekly, or after a change to the app, on Haiku readers |
| Live check | Once per PR, and before the Variant and Ship gates | One session driving the app; screenshots add image tokens | Fits as one per PR, on Sonnet or Haiku. pstack itself keeps verifiers on its cheap fast model (`poteto-mode/SKILL.md:97`) |
| pstack's full swarm | Once per PR | Ten live lanes plus gates, perf and audit lanes | Doesn't fit. Lauren tunes it down to about one |
| Cross-family Verdict | Once per PR | One `codex exec` call | Plus, not Pro |
| `interrogate` | Contested designs; subagent PRs | One reviewer per model, plus the lead | Two seats (Sol on Plus, Opus on Pro). Use on contested work only |
| `arena`, `architect` | One-way-door designs | N runners plus a judge | Heavy; reserve for one-way doors |
| `show-me-your-work` | Long or unattended runs | Cheap logging plus one cross-model review | Run the review on Sol |
| `benchmark-checklist` | Every measured number | At least 5 runs per side: machine time, few tokens | Fine |

### Flags for the map

- **Codex as Verifier is untested.** pstack's Live check needs a process that can start the app, own ports and drive a browser or terminal. Whether `codex exec` can run a project's verification CLI inside its sandbox is unknown. If it can't, the Live check runs in Claude Code (same family as a Sonnet Builder) and Sol gives the diff Verdict.
- **Eval playbook.** Its blind candidates, other-family judge and transcript check fit the map's "Proving skills work" fog item.
- **`correct` and `reflect`.** They fit the map's "How Friday improves itself" fog item. `correct`'s rule table (each rule paired with what enforces it) is Encode Lessons in Structure applied to agent instructions.
- **Transcript paths.** `show-me-your-work`, `eval` and `reflect` read Cursor's `agent-transcripts/`. Owned copies need Claude Code's transcript location instead.
- **Builder's scope.** The glossary's Builder covers only Variants. Non-UI work needs a writer term (see Clashes).

## Not verified

- Lauren's talk video (2026-09-21) and the tangentstream YouTube readings of her posts were not watched.
- "How I Use Cursor" and the Matt Pocock interview were not re-read. Quotes from them live in `pstack-autonomy.md`.
- `cursor-team-kit` was not read: its `control-ui`, `control-cli` and `deslop` skills, and its agentic security review.
- Lauren's example repo, github.com/poteto/verification-skill-example, was not read.
- `check-plan.mjs`, `watch-pr` and `orch` were read only for their checks and types, not run.
- Whether `codex exec` can drive a verification skill (ports, processes, browser) inside its sandbox.
- No usage figures exist for any cost row. They are relative weights only.

## Sources

**pstack** at commit `e5136d82418d2db3165ea1050d17577cd618cc05` (https://github.com/cursor/plugins/tree/e5136d82418d2db3165ea1050d17577cd618cc05/pstack), read 2026-10-15:
- All 24 `pstack/skills/principle-*/SKILL.md`
- All 23 `pstack/skills/poteto-mode/playbooks/*.md`, `poteto-mode/SKILL.md`, `poteto-mode/references/bugbot-triage.md`
- Every other `pstack/skills/*/SKILL.md`, plus `create-verification-skill/references/feature-map-example/`, `interrogate/references/*`, `show-me-your-work/references/*` and `scripts/log.sh`, and `why/references/epistemics.md`
- `pstack/agents/poteto-agent.md`, `pstack/agents/comment-sicko.md`
- `pstack/docs/guide/01` to `10` and `README.md`; `pstack/README.md`
- `pstack/automations/benny/` (`README.md`, `FOR_AGENTS.md`, `skills/reproduce-and-fix-issues/SKILL.md`, `references/verify-existing-fix.md`)
- Scripts read for their checks: `poteto-mode/scripts/check-plan.mjs`, `scripts/watch-pr/types.ts`, `scripts/orch/store.ts`
- `main` at `99743e9` (2026-10-15), compared to the pin with `git diff`

**Lauren Tan, primary:**
- "Loops You Can Trust", https://x.com/poteto/status/2069824386283319343 (2026-06-24)
- "The Complete Guide to pstack Pt. 1", https://x.com/poteto/status/2094457600259842065 (2026-08-31)
- "The Complete Guide to pstack Pt. 2", https://x.com/poteto/status/2097732320606507506 (2026-09-09)

**Earlier Friday research:**
- `docs/research/pstack-autonomy.md` (branch `research/pstack-autonomy`)
- `docs/research/pstack-portability.md` (branch `research/pstack-portability`)
- `GLOSSARY.md` on `origin/main`

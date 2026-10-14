# Model routing: which model and effort for each Friday job, on Claude Pro and ChatGPT Plus

Researched 2026-10-14. Every source below was read on 2026-10-14 unless a line says otherwise. Terms follow `GLOSSARY.md`. T1 to T7 are the technique labels from the planning brief (T1 seed strings, T2 idea lists, T3 critic loop, T4 generated images, T7 removing AI tells).

pstack source: `cursor/plugins` at commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`, pstack 0.15.24, shallow clone read as data, nothing run. Paths like `pstack/...:30` mean file and line at `https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/<path>`. History comes from a blobless clone of the same repo and from the merged PRs, read with `gh`.

## Short answer

- **One correction to the plan first: Fable 5.1 is not in Claude Pro's usage pool.** Anthropic's help article says: "Fable 5 and Fable 5.1 aren't included in your plan's usage limits". Pro users reach Fable only through usage credits, which are "billed at standard API rates" ($10 input and $50 output per million tokens). Friday should therefore treat Fable as a paid exception. It should never be a default. Do not pin `fable` or `best` anywhere. Sources: [S1], [S2], [S3].
- **pstack's rule of thumb carries over.** Lauren Tan sends code delegates to a fast, cheaper code model (Grok). She sends judgment, prose and the hardest changes to Opus 5.5. Review panels use one reviewer per model family. Her guide puts it plainly: "A strong model in the main chat with cheaper, faster models in the code roles is a good split" (`pstack/docs/guide/01-setup.md:45`).
- **Grok's code roles go to Sonnet 5.5 on Pro, and to GPT-6.1 Sol on Codex when the Pro pool needs relief.** Grok's place as the second family in panels and critics goes to GPT-6.1 Sol through `codex exec`. On the WebDev Arena leaderboard of 2026-10-13, both replacements rank well above Grok 4.7: Sonnet 5.5 (xhigh) 1774, GPT-6.1 Sol (max) 1760, Grok 4.7 (xhigh) 1640 [S10].
- **For building UI, Opus 5.5 is the strongest model on both public design leaderboards.** GPT-6 Astra, Sonnet 5.5, GPT-6.1 Sol and Fable 5.1 form the next group. Haiku 5.5 and GPT-6 Luna trail by a wide margin [S10], [S11]. Sonnet 5.5 costs half as much as Opus per token [S4], and Anthropic says it "adds polish to user interfaces" [S6]. That makes Sonnet 5.5 the cheap implementer in Friday's critic loop.
- **For judging screenshots, no public benchmark measures "rendered UI against a brief".** The closest evidence favours Opus 5.5 on Claude's side: it ranks first among these models on Vision Arena, leads on Chartography, and its prompting guide stresses screenshot reading. On OpenAI's side the closest evidence favours GPT-6 Astra: ScreenSpot-Pro 92.7% and "stronger visual judgment" [S5], [S12], [S13], [S15]. My inference: use a critic from the other family than the builder, because judges favour their own family's output (prior doc). In practice, GPT-6.1 Sol critiques Claude-built Variants and Opus 5.5 critiques Codex-built Variants. Save Astra (5 to 45 messages per 5 hours) for the Variant gate.
- **Split the heavy work across the two plans.** With three Variants, build two on Claude Sonnet 5.5 and one on Codex GPT-6.1 Sol, each critiqued by the other family. Generate T4 images on Codex before Define starts, because image turns use Codex limits "3–5x faster" [S17]. Anthropic publishes no Opus-to-Sonnet multiplier for Pro. API prices put Opus 5.5 at 2x Sonnet 5.5 per token and Haiku 5.5 at about 1/20 (my inference; see the cost section).

## Routing table

Effort names are Claude Code's (`low`, `medium`, `high`, `xhigh`, `max`) and Codex's `model_reasoning_effort` (`low` to `max`, plus `ultra`). "Pro" means Claude Pro through Claude Code. "Plus" means ChatGPT Plus through `codex exec`.

| Friday job | Recommended (model, effort, plan) | Alternative | Why |
|---|---|---|---|
| Main or orchestrating session | Opus 5.5, `medium` (Pro). This is already Pro's default model and Claude Code's default effort for it | `opusplan` (Opus in plan mode, Sonnet when executing), or Sonnet 5.5 `high` on days a Fleet is running | pstack: "A strong model in the main chat with cheaper, faster models in the code roles" (guide 01:45). Anthropic: Opus 5.5 at `medium` "matches or exceeds Claude Opus 5 at `high`" [S7]. The main session only routes and reviews, so it does not need `xhigh` |
| Grilling and planning | Opus 5.5, `high` (Pro), in plan mode | `opusplan`, or Opus 5.5 `medium` | pstack's "judgment and prose" role goes to Opus. pstack's effort rule is to "Lower it one step for judgment" from its xhigh default (`poteto-mode/SKILL.md:97`), which gives `high` |
| Discover: T1 seed strings and T2 idea lists | Sonnet 5.5, `medium` (Pro), as several parallel subagents on the same model | GPT-6.1 Sol `medium` via `codex exec` (Plus) when the Pro window is low | This is generation-bound work. pstack: "Use the same model N times when the work is generation-bound rather than judgment-sensitive" (`arena/SKILL.md:17`). The prior doc found that other model families add little creative variety, so a second family is not needed here |
| Discover: refining ideas into Directions and writing build prompts | Opus 5.5, `high` (Pro) | Opus 5.5 `medium` | This is judgment and prose, pstack's Opus role. These briefs drive every Variant, so it is worth one effort step more than routine work |
| Define: Variant builder (implementer) | Sonnet 5.5, `high` (Pro), one per worktree. One Variant on GPT-6.1 Sol `high` (Plus) with `--sandbox workspace-write` | Raise Sonnet to `xhigh` for a Variant that stalls below 9/10. Opus 5.5 `medium` only for a Variant with hard logic | This replaces pstack's Grok code delegate. WebDev Arena: Sonnet 5.5 is 1774 at xhigh and 1713 at high, GPT-6.1 Sol 1760 [S10]. Anthropic suggests Sonnet 5.5 at `medium` for well-specified agentic coding and `high` "for harder or longer ones" [S8]. Putting one Variant on Codex moves the heaviest load off the Pro pool |
| Define: T3 screenshot critic | Cross-family. Claude-built Variant: GPT-6.1 Sol `high`, `codex exec -s read-only -i …` (Plus). Codex-built Variant: Opus 5.5 `medium` (Pro) | Opus 5.5 `high` as the only critic if Codex limits run out (same family, so watch for self-preference). GPT-6 Astra `high` for a final check | Judges favour their own family's output (prior doc; pstack: "Prefer a different model family from the parent's", `arena/SKILL.md:28`). Opus 5.5 reads screenshots well even at low effort [S7]. GPT-6.1 Sol is "near-Astra" at a fifth of the price [S14] and allows 15 to 160 messages per 5 hours, against Astra's 5 to 45 [S16] |
| Define: writing T4 image prompts | Sonnet 5.5, `medium` (Pro), written from the Direction brief | Opus 5.5 `medium` for the hero image of the winning Variant | This is short prose. The image itself comes from gpt-image-2 through Codex `$imagegen` whichever model writes the prompt [S17] |
| Define: making T4 images | Codex `$imagegen` (gpt-image-2), run in its own window before the builders start (Plus) | Run it on GPT-6 Luna to spend fewer Codex messages (untested) | Image turns use Codex limits "3–5x faster" [S17], so keep them out of the window the Codex builder and critics need |
| Deliver: polish and T7 unslop | Opus 5.5, `high` (Pro), on the winning Variant only, plus one cross-family pass by GPT-6.1 Sol `high`, read-only with screenshots | Sonnet 5.5 `high` builds while Opus 5.5 `medium` critiques | pstack sends "the hardest changes" to its strongest judgment model (`poteto-mode/SKILL.md:95`). Opus 5.5's prompting guide lists its default "AI look" (cream background, italic accent words, "01/02/03" labels, monospace labels, pill buttons) and says to name the patterns to avoid [S7]. A second family catches tells that Claude does not notice in Claude's output (inference) |
| Deliver: writing down the Design language | Opus 5.5, `medium` (Pro) | Sonnet 5.5 `high` | Prose and judgment. Short, and done once per Surface |
| Feature builds | Sonnet 5.5, `medium`, or `high` when the scope is unclear (Pro) | GPT-6.1 Sol `medium` via `codex exec -s workspace-write` (Plus). Opus 5.5 `high` for cross-cutting design | pstack's `feature, refactoring` role goes to Grok, and its hardest work to Opus (`setup-pstack/SKILL.md:49-54`). Sonnet takes the Grok role |
| Bug fixes | Sonnet 5.5, `high` (Pro) | Opus 5.5 `high` for concurrency or other subtle bugs | pstack's `bug-fix` role goes to Grok. "Gnarly concurrency, subtle algorithms" go to the strongest model (`poteto-mode/SKILL.md:95`) |
| Refactors | Sonnet 5.5, `medium` (Pro) | Haiku 5.5 `medium` for mechanical renames. Opus 5.5 for API reshapes | Same mapping as feature builds. pstack: "Trivial mechanical edits go to your fast code model" (`poteto-mode/SKILL.md:95`) |
| Code review | Opus 5.5, `high` (Pro), plus GPT-6.1 Sol `high` read-only as a second reviewer for larger diffs (Plus) | Opus 5.5 alone at `medium` for small diffs | Anthropic reports stronger code review on Opus 5.5, with "more bugs caught … and fewer false alarms" [S7]. pstack: "A second opinion is the same prompt against a different model" (`poteto-mode/SKILL.md:99`) |
| Search and exploration subagents | Haiku 5.5, `low` or `medium` (Pro). Override the built-in Explore subagent, which otherwise runs on the main model | Sonnet 5.5 `low` | This replaces pstack's Grok explorers. Anthropic: Haiku 5.5 "pairs well with Opus 5.5 and Sonnet 5.5 as a subagent" [S9], and `low` effort suits "subagents" [S18]. Built-in Explore uses "the main conversation's model" [S19], which is Opus on Pro |
| Prose and docs | Opus 5.5, `medium` (Pro) | Sonnet 5.5 `medium` | pstack's "judgment and prose" role goes to Opus |
| Research subagents | Sonnet 5.5, `medium`, for readers. Opus 5.5 `medium` writes the synthesis (Pro) | Haiku 5.5 `medium` for fetch-heavy reading. GPT-6.1 Sol via `codex exec` when the Pro window is low | Mirrors pstack's `why investigators` (Grok) and `why synthesizer` (Opus) (`setup-pstack/SKILL.md:57-58`). Research reads many tokens, so cheaper readers protect the pool |
| Review panels (interrogate and arena style) | Two seats: Opus 5.5 `high` (Pro) and GPT-6.1 Sol `high` via `codex exec -s read-only` (Plus). For arena, the cross-judge is the family other than the parent's | Add GPT-6 Astra `high` as a third seat for the Variant gate. A Sonnet 5.5 seat adds no new family | pstack's panel is "opus 5.5 / grok" (`README.md:30`), and "The adversarial signal comes from model diversity" (`interrogate/SKILL.md:9`). pstack's own panels included GPT Sol until PR #511 merged on 2026-10-06, so a GPT seat has precedent in pstack |

### What replaces Grok, role by role

pstack uses Grok for four kinds of role (`setup-pstack/SKILL.md:49-65`). None can run on Claude Code, and Anthropic "doesn't support routing Claude Code to non-Claude models" (pstack-portability doc).

| pstack role on Grok | Friday replacement | Reason |
|---|---|---|
| Code delegates: `feature, refactoring`, `bug-fix`, `perf-issue`, `hillclimb` | Sonnet 5.5 (Pro). GPT-6.1 Sol (Plus) for overflow and one Variant | It does the same job pstack gives Grok, a fast, cheaper code model, and ranks higher than Grok 4.7 on WebDev Arena (1713 to 1774 against 1640) [S10]. Sonnet 5.5 costs $2 / $10 per million tokens, against $2 / $6 for Grok 4.7 as listed on WebDev Arena [S4], [S10] |
| Explorers and tooling: `how explorer`, `why investigators`, `reflect tooling` | Haiku 5.5 (search) or Sonnet 5.5 (investigation) | Read-heavy and judgment-light. Haiku is the lightest draw on the Pro pool [S20] |
| `swarm workers`, including verification lanes | Sonnet 5.5 `medium` | Verification drives the app and reads results. It needs reliability more than depth |
| The second family in `arena runners`, `arena cross-judge pool`, `architect runners`, `interrogate reviewers` | GPT-6.1 Sol (Plus) | Panels need a second family, and Sonnet would not provide one. Sol has the most messages of the strong GPT models on Plus [S16] |

Effort: pstack's defaults sit at `xhigh` ("large" budget). Its own rule lowers effort "one step for judgment and two or more steps for routine work" (`poteto-mode/SKILL.md:97`). Anthropic's newer guidance points the same way for these models. Opus 5.5 should start at `medium` and keep `xhigh` and `max` "for work where you've measured a quality gain" [S7]. pstack's PR #414 notes "The Opus 5.5 prompting guide suggests starting at medium effort." On a Pro pool, the table above therefore runs one or two steps below pstack's defaults.

## Splitting usage between the two plans

### What each choice costs

**Claude Pro.** One pool covers claude.ai, Claude Code and Desktop. It has "a session limit that resets every five hours" and "weekly limits that reset once every week". Usage depends on "which Claude model you're chatting with, and the effort level you've selected" [S21], [S22]. Anthropic gives an order but no numbers: "Haiku is the lightest, Sonnet is moderate, Opus is heavy, and Fable uses the most" [S20]. I found no published multiplier for Pro. Anthropic raised five-hour limits on Pro when Opus 5.5 launched, without giving figures [S5].

*Inference from API prices* [S4]: if plan usage tracks API cost, then per token

| Model | API price ($ per million tokens, input / output) | Relative to Sonnet 5.5 | On Pro |
|---|---|---|---|
| Haiku 5.5 | from 0.10 / 0.50 | about 1/20 | in the pool |
| Sonnet 5.5 | 2 / 10 | 1x | in the pool |
| Opus 5.5 | 4 / 20 | 2x | in the pool (Pro's default model) |
| Fable 5.1 | 10 / 50 | 5x | **not in the pool**: usage credits from the first message [S1] |

Token counts per task also vary with effort ("Higher effort uses more tokens" [S21]). Opus 5.5 "tends to finish the same task with fewer tokens" than Opus 5 [S7]. So the real Opus-to-Sonnet ratio per task could be below 2x. I could not measure it.

**ChatGPT Plus (Codex).** Estimated local messages per five hours [S16]:

| Model | Plus, per 5 hours | Role in Friday |
|---|---|---|
| GPT-6 Luna | 350 to 3,000 | Bulk, low-stakes text. Possibly the turn that calls `$imagegen` (untested) |
| GPT-6.1 Sol | 15 to 160 | Cross-family critic, panel seat, one Variant builder, overflow coding |
| GPT-6 Sol | 15 to 150 | No role. GPT-6.1 Sol supersedes it at the same allowance [S14] |
| GPT-6 Astra | 5 to 45 | Variant-gate judge or third panel seat only |

"Weekly limits may also apply", and "These estimates are not fixed message limits" [S16]. Image generation "counts toward the same general usage limits" and uses them about "3–5x faster" [S16], [S17]. GPT-5.5 left Codex on 2026-10-14 [S16].

### How to split the Define phase (inference)

Variant builders running in parallel are the heaviest load. Neither plan publishes enough numbers to size a Fleet, so this split rests on the figures above plus judgment:

1. **3 Variants:** A and B on Claude Sonnet 5.5 `high` (Pro), C on Codex GPT-6.1 Sol `high` (Plus).
   - GPT-6.1 Sol critiques A and B, read-only with screenshots.
   - Opus 5.5 `medium` critiques C.
   - Each plan then carries one family's builds and the other family's critiques.
2. **4 Variants:** add D on Codex only if the Codex usage dashboard shows headroom after images. Otherwise put D on Claude and run the whole Fleet in two waves across 5-hour windows.
3. **Cap critic rounds at about four per Variant.** At the low end of Sol's estimate (15 messages), four rounds for each of three Variants already uses most of a window. One `codex exec` call is at least one local message. How many messages a long builder run counts as is not documented (unverified).
4. **Images first.** Generate T4 images in a window before the builders start, or on a day without a Codex build, so that the 3 to 5x image cost does not starve the Codex critic.
5. **Main session.** On Fleet days, switch the main session to `opusplan` or Sonnet 5.5. An Opus main session plus Opus-model Explore spawns draws from the same pool as the Sonnet builders.
6. **Keep usage credits off on both plans.** That keeps Fable unreachable and stops spending at each plan's limit (see the budget in the subscriptions doc).

## How the routing is expressed

### Claude Code

- **Subagent definitions** (`.claude/agents/<name>.md`) take `model` (`sonnet`, `opus`, `haiku`, `fable`, a full ID such as `claude-opus-5-5`, or `inherit`) and `effort` (`low` to `max`) [S19]. The order of precedence is:
  1. the per-invocation `model` Claude passes;
  2. the definition's `model`;
  3. `CLAUDE_CODE_SUBAGENT_MODEL`;
  4. the main session's model [S19].

  A per-invocation `effort` parameter overrides the definition. It needs v2.1.292 or later, and this machine has 2.1.299. `CLAUDE_CODE_EFFORT_LEVEL` beats both [S19]. `isolation: worktree` gives a subagent its own worktree [S19]. Example builder:

  ```yaml
  ---
  name: variant-builder
  description: Builds one Direction as a Variant in its own worktree.
  model: sonnet
  effort: high
  isolation: worktree
  ---
  ```
- **Override Explore.** The built-in Explore uses "the main conversation's model". Define a project subagent named `Explore` with `model: haiku` to change it [S19].
- **Skills pin a model** with `model` and `effort` in frontmatter. Without `context: fork`, the override "applies for the rest of the current turn and isn't saved to settings". With `context: fork`, it sets the forked subagent's model instead [S23].
- **Aliases** [S24]:
  - `opusplan` = "uses `opus` during plan mode, then switches to `sonnet` for execution";
  - `default` on Pro resolves to Opus 5.5;
  - `best` resolves to Fable where available, so avoid it on Pro.

  Session flags: `claude --model sonnet --effort high`, or `/model` and `/effort` inside a session [S24].
- **A Fleet slot** is a separate session in its own worktree started with `--model` and `--effort`. A **Fan-out** is subagents with the frontmatter above.

### Codex (`codex exec`)

Flags were checked against the Codex source at `openai/codex` commit `78dc2503840d05f4411ae184bb5560ef327fce3c` (`codex-rs/utils/cli/src/shared_options.rs`, `config_override.rs`, `sandbox_mode_cli_arg.rs`, `codex-rs/exec/src/cli.rs`) and against the docs [S25], [S26], [S27].

- **Model:** `-m gpt-6.1-sol` (also `codex exec -m … "<prompt>"` in the docs) [S26].
- **Effort:** `-c model_reasoning_effort="high"`. The config key takes "`low`, `medium`, `high`, `xhigh`, `max`, or `ultra`" [S27]. Avoid `ultra` on Plus, because it "uses subagents" [S26]. OpenAI: "Most tasks do not need Max or Ultra" [S26].
- **Sandbox:** `codex exec` runs "in a read-only sandbox" by default. `--sandbox workspace-write` (`-s`) allows edits. `danger-full-access` is for controlled environments only. `--full-auto` "is no longer supported" [S25].
  - Critics and panel seats stay read-only.
  - A Codex Variant builder uses `-s workspace-write` with `-C <worktree>`, or the `--worktree` flag ("Run the session in a new managed Git worktree", source `shared_options.rs:70-72`).
  - Whether `workspace-write` allows network access by default (for `npm install`) is not stated in the docs. The key is `sandbox_workspace_write.network_access` [S27].
- **Screenshots:** `-i/--image FILE`, comma-separated or repeated (`shared_options.rs:11-19`).
  - The option takes one or more values (`num_args = 1..`), so a prompt placed right after `-i` may be read as another image path.
  - Put the prompt before `-i`, or end options with `--`. This comes from reading the source. I did not test it.
- **Output:** `--json` (JSONL events), `--output-schema FILE` (structured verdicts such as a 0 to 10 score per rubric item), `-o FILE` (last message), `codex exec resume --last` for the next critic round [S25].
- **Auth:** "`codex exec` reuses saved CLI authentication by default", which means the ChatGPT sign-in and its Plus limits [S25].
- **Critic call** (sketch, untested):

  ```bash
  codex exec -m gpt-6.1-sol -c model_reasoning_effort="high" -s read-only \
    --output-schema critic.schema.json -o critic.json \
    "$(cat brief-and-rubric.md)" -i shots/desktop.png,shots/mobile.png
  ```
- **`$imagegen` under `codex exec`: not confirmed by the docs.**
  - The image-generation page lists the desktop app, web chat, interactive CLI and IDE. It does not mention `codex exec` [S17]. The non-interactive page does not mention images either [S25].
  - In the source, image generation is a feature with `key: "image_generation"`, `stage: Stable` and `default_enabled: true` (`codex-rs/features/src/lib.rs`). The bundled `imagegen` skill uses the built-in `image_gen` tool. The skill notes that this tool "Does not require `OPENAI_API_KEY`" and saves under `$CODEX_HOME/generated_images/…`.
  - Nothing in `codex-rs/exec/src` mentions image generation, and nothing I found disables it for exec.
  - My inference is that it should work. Test one image before relying on it.

## pstack's model recommendations, quoted

Somya remembered a page about this. The mapping lives in the `setup-pstack` skill's rule template, with prose versions in the README, guide page 1 and poteto-mode's Subagents section. There is no separate models page in `pstack/` or its guide. A full grep for model names across `pstack/` found no other table. The repo's separate `advisor` plugin pins Grok 4.6 by default, but its author is not given as Lauren Tan and it is not part of pstack.

### The role-to-model table

`pstack/skills/setup-pstack/SKILL.md:41-66`, the rule it writes to `~/.cursor/rules/pstack-models.mdc`:

```
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

### Her reasons, in her words

- "every frontier model has its strengths and weaknesses. use any model with pstack. in fact, many of my skills use multi-model workflows to take advantage of each model's unique strengths." (`pstack/README.md:11`)
- "out of the box the mode splits work by model strength: code delegates (feature, refactoring, bug fix, perf, hillclimb) go to grok, while the hardest changes, prose, and judgment go to opus 5.5. the default panel is opus 5.5 / grok." (`pstack/README.md:30`)
- "Defaults `grok-4.7-xhigh-fast` for code, `claude-opus-5-5-xhigh` for prose and judgment). Code delegates tier by difficulty. The hardest changes (cross-cutting design, gnarly concurrency, subtle algorithms) go to your strongest judgment model (`claude-opus-5-5-xhigh`), whether the task needs judgment on vague intent or is a precisely specified sequence of steps to execute to the letter. Trivial mechanical edits go to your fast code model." (`pstack/skills/poteto-mode/SKILL.md:95`)
- "Raise it one step, up to max, for the hardest or subtlest work. Lower it one step for judgment and two or more steps for routine work. Use fast mode only when the job is urgent … Change only the effort level and whether the slug is fast, and keep the family the role names, so a diverse panel stays diverse." (`pstack/skills/poteto-mode/SKILL.md:97`)
- "A second opinion is the same prompt against a different model. Agreement is high-signal." (`pstack/skills/poteto-mode/SKILL.md:99`)
- "A strong model in the main chat with cheaper, faster models in the code roles is a good split." (`pstack/docs/guide/01-setup.md:45`)
- "The defaults run at `xhigh` reasoning … `unlimited` lifts each model to its highest tier, up to `max`. Opus goes to `max`. Grok tops out at `xhigh`" (`pstack/docs/guide/01-setup.md:25`)
- "The adversarial signal comes from model diversity, not assigned personas." (`pstack/skills/interrogate/SKILL.md:9`). "Model diversity is the point. Different models have different blind spots, so a finding two models raise independently is high-confidence signal." (`pstack/docs/guide/04-design.md:69`)
- "Use the same model N times when the work is generation-bound rather than judgment-sensitive." (`pstack/skills/arena/SKILL.md:17`). For the judge: "Prefer a different model family from the parent's." (`pstack/skills/arena/SKILL.md:28`)
- "spawn a subagent on a different model family from the one that did the work. Self-review is not a substitute." (`pstack/skills/show-me-your-work/SKILL.md:67`)
- On moving `reflect tooling` to Grok: "The tooling lens finds commands, flags, paths, and library quirks. pstack gives this type of code and tooling work to Grok" (PR #511 description, merged 2026-10-06).

### How the defaults changed (git history)

The recommendation has moved often, so treat it as one person's current taste:

| Date | Change | Source |
|---|---|---|
| 2026-07-08 | Hardest tasks to `claude-fable-5-thinking-max` | PR #143 |
| 2026-07-22 | Panels "fable / sol / grok", "judgment on fable and specified code on sol" | PR #165 |
| 2026-07-22 | Explorers and investigators to Grok | PR #166 |
| 2026-09-01 | "route solo defaults to Fable 5.1" | commit `23a56e2` |
| 2026-09-12 | bug-fix, perf, hillclimb join feature and refactoring on Grok 4.6. "Judgment … and panels stay on Fable 5.1" | PR #365 |
| 2026-09-23 | Judgment and prose move to `claude-opus-5-5-max`, code to `grok-4.7-xhigh-fast`. Panels: Opus 5.5, Sol, Grok | PR #414 |
| 2026-10-06 | "drop Sol, default to Opus xhigh and Grok". Opus effort goes from `max` to `xhigh` | PR #511 |

Two points matter for Friday:

- pstack moved its judgment role from Fable to Opus 5.5 once Opus 5.5 shipped. Friday cannot use Fable on Pro without paying credits anyway.
- A GPT Sol seat sat in pstack's panels until 2026-10-06. PR #511's description explains what changed but gives no reason for dropping Sol.

Her public writing: the README links to `x.com/poteto`. Her talk, posted 2026-09-21 ("here's how i shipped 2,500 PRs last month to production"), is a video. I did not watch or transcribe it. A secondary write-up of the talk names no models [S28].

## Evidence for UI work

### Building front-end UI

| Model | WebDev Arena score (rank), 2026-10-13 [S10] | Design Arena, Text-to-HTML overall [S11] | Design Arena, Website (rank) [S11] |
|---|---|---|---|
| Opus 5.5 | 1811 at max (1) | 1392 | 1336 (1) |
| GPT-6 Astra | 1780 at max (2) | 1379 at xhigh, 1369 default | 1333 at xhigh (5) |
| Sonnet 5.5 | 1774 at xhigh (3), 1713 at high (6) | 1365 | 1334 (3, tied) |
| GPT-6.1 Sol | 1760 at max (4) | 1343 | 1283 (29) |
| Fable 5.1 | 1743 at max (5) | 1338 | 1334 (3, tied) |
| GPT-6 Sol | 1686 at max (8) | not in top 18 | 1293 (19) |
| Grok 4.7 (pstack's code model) | 1640 at xhigh (16) | not in top 18 | not read |
| Haiku 5.5 | 1585 at high (31) | not in top 18 | 1276 (31) |
| GPT-6 Luna | 1582 at max (34) | not in top 18 | 1260 (43) |

Design Arena showed no date on the page. I read it on 2026-10-14. Both arenas rank one-shot outputs by human preference, mostly at high effort. They do not measure an agent iterating on a real repo with a critic.

What the vendors claim:

- **Opus 5.5** (2026-09-22): "scored higher than any other model on the strength of its graphics and polish" (one tester's game test) [S5]. Its prompting guide warns that on frontend work without design direction it "falls back on a few default styles" and lists them [S7].
- **Sonnet 5.5** (2026-09-28): "It's also got a sharp eye for design". Testers said it "adds polish to user interfaces". It is "close to Opus 5.5 in computer use and chart recognition". "Opus 5.5 remains clearly stronger at complex, open-ended work requiring sustained judgment" [S6].
- **GPT-6 Astra** (2026-09-03): "brings stronger visual judgment to the websites, games, applications, and renderings it builds". On OpenAI's "Internal Design Tasks" it scores 50.0% against GPT-5.6 Sol's 47.4% and Fable 5's 35.8%. Astra is available to Plus and "usage is included within the existing subscription allowances" [S13].
- **GPT-6.1 Sol** (2026-09-29): "nearly matches GPT-6 Astra's intelligence on agentic coding, computer use, and professional work at one-fifth of Astra's standard input and output token prices". Its post makes no design claim [S14].
- **Haiku 5.5** (2026-10-07) and **GPT-6 Luna** (2026-09-22): positioned for sub-agent, high-volume and focused work. Neither post claims anything about UI [S9], [S15].

*Inference:* for a Variant builder, Opus 5.5 is best but costs twice Sonnet per token. Sonnet 5.5 at `high` or `xhigh` and GPT-6.1 Sol come close on WebDev Arena, which makes them the right cheap implementers. The two arenas disagree about GPT-6.1 Sol: it is 4th on WebDev but 29th on Design Arena's Website board. Sonnet 5.5 is therefore the safer default builder, and the Codex Variant is the one to watch.

### Judging rendered screenshots against a brief

No benchmark I found measures this task. The nearest signals:

- **Vision Arena** (general image tasks; 2026-10-09): Opus 5.5 high 1293 (rank 11), Fable 5.1 max 1286 (17), GPT-6 Astra max 1286 (19), GPT-6 Sol max 1270 (37), Sonnet 5.5 xhigh 1266 (39) [S12]. GPT-6.1 Sol, Haiku 5.5 and Luna did not appear in what I read.
- **Chartography (no tools)**: Opus 5.5 64.4%, Sonnet 5.5 61.6%, GPT-6 Sol 53.6% (Anthropic's figures) [S6]. Haiku 5.5 46.4%, GPT-6 Luna 29.1% [S9].
- **Opus 5.5 prompting guide**: "even at its lowest effort setting it read values off dense charts more accurately than Claude Opus 5 did at its highest". It is better "where meaning depends on position rather than text". Crop and zoom tools add accuracy on the densest inputs, and more so at higher effort [S7].
- **GPT-6 Astra**: ScreenSpot-Pro (no tools) 92.7% against GPT-5.6 Sol's 76.9% [S13]. ScreenSpot-Pro tests locating UI elements in screenshots, which is closer to UI review than chart reading.
- **Model selection matrix** (Anthropic): Opus 5.5 for "vision-heavy workflows, computer use". Sonnet 5.5 for "visual understanding" [S4b].

*Inference:* the strongest single critic is Opus 5.5 (Claude) or GPT-6 Astra (OpenAI). Self-preference (prior doc) argues for a critic from the other family than the builder. Astra's 5 to 45 messages per 5 hours make it too scarce for a loop, so GPT-6.1 Sol critiques Claude builds and Opus 5.5 critiques the Codex build. Both studies on judge bias used text, so how much this matters for screenshots is unknown.

## Assumptions

- Plan usage tracks API cost closely enough for API price ratios to stand in for usage multipliers. Anthropic does not say so.
- One `codex exec` critic call costs about one "local message". A long builder run probably costs several.
- Friday keeps usage credits off on both plans. That follows from the fixed budget in the subscriptions docs.
- Leaderboard scores at `max` or `xhigh` carry over roughly to the `high` settings recommended here. WebDev Arena's two Sonnet 5.5 rows (1774 at xhigh, 1713 at high) show the gap can be about 60 points.

## Not verified

- Any per-model multiplier for Claude Pro usage. Anthropic publishes only the order: Haiku, Sonnet, Opus, then Fable.
- Whether `$imagegen` works under `codex exec`, and whether running it on GPT-6 Luna costs fewer Codex messages.
- The `-i` flag consuming a following prompt as an image path. This was read from source, not tested.
- Whether `workspace-write` allows network access by default.
- How many local messages a long `codex exec` builder session uses.
- GPT-6 Astra on Plus. The launch post and the usage table say yes, but the Plus feature list names only GPT-6.1 Sol and GPT-6 Luna [S13], [S16].
- The content of Lauren Tan's 2026-09-21 talk video.
- Design Arena's update date.
- Anything at runtime. Nothing was installed and Codex is not on this machine.

## Sources

pstack (commit `1e5c90a4b6f249917bd21fe361b3a2a7deb741b8`, base `https://github.com/cursor/plugins/blob/1e5c90a4b6f249917bd21fe361b3a2a7deb741b8/`):
- `pstack/README.md` lines 11, 30. `pstack/plugin.json` (version 0.15.24)
- `pstack/skills/setup-pstack/SKILL.md` lines 8-66
- `pstack/skills/poteto-mode/SKILL.md` lines 91-101
- `pstack/docs/guide/01-setup.md` lines 23-29, 41-48. `pstack/docs/guide/04-design.md` lines 31, 69
- `pstack/skills/interrogate/SKILL.md` lines 9, 27-36. `pstack/skills/arena/SKILL.md` lines 17, 28. `pstack/skills/show-me-your-work/SKILL.md` line 67
- PRs and commits: https://github.com/cursor/plugins/pull/143 , /pull/165 , /pull/166 , /pull/365 , /pull/414 , /pull/511 , commit `23a56e2`
- Lauren Tan's talk post: https://x.com/poteto/status/2102050467505430555 (2026-09-21)

Anthropic:
- [S1] Claude Fable models on your plan (dated 2026-09-02): https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan
- [S2] Manage usage credits: https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans
- [S3] Model config, Fable "Requires usage credits" row: https://code.claude.com/docs/en/model-config
- [S4] Models overview (prices, IDs, default effort): https://platform.claude.com/docs/en/about-claude/models/overview . [S4b] Choosing a model: https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
- [S5] Introducing Claude Opus 5.5 (2026-09-22): https://www.anthropic.com/news/claude-opus-5-5
- [S6] Introducing Claude Sonnet 5.5 (2026-09-28): https://www.anthropic.com/news/claude-sonnet-5-5
- [S7] Prompting Claude Opus 5.5: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
- [S8] Prompting Claude Sonnet 5.5: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5
- [S9] Introducing Claude Haiku 5.5 (2026-10-07): https://www.anthropic.com/news/claude-haiku-5-5
- [S18] Effort: https://platform.claude.com/docs/en/build-with-claude/effort
- [S19] Subagents: https://code.claude.com/docs/en/sub-agents
- [S20] Choosing the right Claude model (Academy, undated): https://academy.claude.com/tutorials/choosing-the-right-claude-model
- [S21] Understanding usage and length limits: https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits
- [S22] Using Claude Code with your Pro or Max plan: https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan . What is the Pro plan: https://support.claude.com/en/articles/8325606-what-is-the-pro-plan
- [S23] Skills: https://code.claude.com/docs/en/skills
- [S24] Model config (aliases, `opusplan`, `default` on Pro, effort flags): https://code.claude.com/docs/en/model-config

OpenAI:
- [S13] GPT-6 Astra (2026-09-03): https://openai.com/index/gpt-6-astra/
- [S14] Introducing GPT-6.1 Sol (2026-09-29): https://openai.com/index/introducing-gpt-6-1-sol/
- [S15] Introducing GPT-6 Sol and Luna (2026-09-22): https://openai.com/index/introducing-gpt-6-sol-and-luna/
- [S16] Codex pricing (messages per 5 hours, image usage, GPT-5.5 retirement): https://learn.chatgpt.com/docs/pricing
- [S17] Codex image generation: https://learn.chatgpt.com/docs/image-generation
- [S25] Codex non-interactive mode: https://learn.chatgpt.com/docs/non-interactive-mode
- [S26] Codex models (IDs, effort levels, `-m`): https://learn.chatgpt.com/docs/models
- [S27] Codex config reference (`model_reasoning_effort`, `sandbox_mode`, `sandbox_workspace_write.network_access`): https://learn.chatgpt.com/docs/config-file/config-reference
- Codex source at `78dc2503840d05f4411ae184bb5560ef327fce3c`: `codex-rs/utils/cli/src/shared_options.rs`, `codex-rs/utils/cli/src/config_override.rs`, `codex-rs/utils/cli/src/sandbox_mode_cli_arg.rs`, `codex-rs/exec/src/cli.rs`, `codex-rs/features/src/lib.rs` (fetched via API), `codex-rs/skills/src/assets/samples/imagegen/SKILL.md` (fetched via API)

Leaderboards:
- [S10] WebDev Arena (dated 2026-10-13 on the page): https://arena.ai/leaderboard/code/webdev
- [S11] Design Arena, Text-to-HTML and Website (no date on page): https://www.designarena.ai/leaderboard and https://www.designarena.ai/leaderboard/code
- [S12] Vision Arena (dated 2026-10-09 on the page): https://arena.ai/leaderboard/chat/vision

Secondary:
- [S28] Write-up of Lauren Tan's talk (2026-10-05), used only to confirm it names no models: https://redreamality.com/cn/blog/lauren-tan-poteto-trust-before-parallel/

Prior Friday research (not re-checked here): `origin/research/pstack-portability:docs/research/pstack-portability.md`, `origin/research/subscriptions-at-4000:docs/research/subscriptions-at-4000.md` (sections on ChatGPT Plus and on a second model family).

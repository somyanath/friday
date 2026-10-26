# Skill evals: what Claude Code's plugin eval and skill diagnostics offer

Research for "What do Claude Code's plugin eval and skill diagnostics offer for testing Friday's skills?" (somyanath/friday#33). Read 2026-10-26. It gathers facts for "How does Friday prove its skills trigger when they should and improve results?" (#34) and decides nothing. Terms follow `GLOSSARY.md` (Playbook, Reference skill, Owned skill, In-place skill, Upstream, Model family, Entry command).

**Sources.**

- Claude Code's docs at code.claude.com/docs, fetched as Markdown on 2026-10-26, and its changelog up to v2.1.310 (2026-10-23).
- Help text from the Claude Code CLI on this machine, v2.1.310: `claude plugin --help`, `claude plugin eval --help`, `claude plugin eval init --help`, `claude plugin details --help`, `claude plugin validate --help`, `claude setup-token --help`, `claude doctor --help`.
- Read-only commands on this machine that make no model call: `claude doctor`, `claude plugin list`, `claude auth status`, `git --version`, and `codex debug prompt-input`.
- Anthropic's `skill-creator` plugin source in `anthropics/claude-plugins-official` at commit `2a40fd2` (2026-04-23).
- OpenAI's Codex docs, which have moved to learn.chatgpt.com/docs, and OpenAI's post "Testing Agent Skills Systematically with Evals". Codex CLI on this machine is v0.163.0.

No eval and no `/doctor` or `/skill-doctor` was run, because each spends model usage. Nothing here comes from a secondary write-up.

**Confidence tiers.**

- **High:** a primary source states it, or it was seen on this machine.
- **Medium:** it follows directly from primary sources but none states it outright.
- **Low:** an inference with a gap that only a real run would close.
- **Null:** looked for and not found. A null result is a result.

## Short answer

- **`claude plugin eval` is a first-party test runner for plugin skills.** It runs each case in a fresh, isolated `claude -p` session with only the plugin loaded, three times by default, and again with no plugin as a baseline. It reports `WITH`, `W/OUT` and their difference `Δ` per case. (High, [plugin-evals])
- **It can assert whether a skill fired for a prompt, which tools ran in what order, which files Claude read, which files it created, and what the answer or a produced file says.** Outcome grading uses a regex or a rubric that a second Claude model votes on. There are no custom-code graders. (High, [plugin-evals § Grader types])
- **It runs on a Claude Pro login.** Every run and every rubric vote counts against the plan's usage limits. The `COST` it prints is a list-price estimate, not a share of the plan, and no source converts one to the other. (High for the login, Null for the conversion, [plugin-evals § Requirements])
- **A suite is expensive in runs.** It costs about cases × runs × 2 agent runs, plus three short grading calls per rubric grader per run. The docs' one-case example took 6 runs, 74 seconds and an estimated $0.41. (High, [plugin-evals § How a case is scored])
- **CI with `CLAUDE_CODE_OAUTH_TOKEN` is likely to work, but no page says so for evals.** The token is documented for CI and for GitHub Actions on Pro. The eval page's CI section names only `ANTHROPIC_API_KEY` and cloud variables. Its environment allowlist passes `CLAUDE_CODE_*` and provider auth variables to each run. (Medium, [authentication], [plugin-evals § prompt.md fields])
- **It cannot test trigger clashes with user-scope skills or other installed plugins.** Each run gets a temporary home and config, and "your user settings, hooks, CLAUDE.md files, MCP servers, other installed plugins, memory, and skills are absent". Clashes inside Friday's own plugin can be tested. (High, [plugin-evals § How runs are isolated])
- **Clash tests against Somya's real setup need plain `claude -p` instead.** Without `--bare` it loads everything an interactive session would. Anthropic's `skill-creator` plugin does exactly this for its trigger tests, on the session's own login. (High, [headless], [skill-creator run_eval.py])
- **By default, a skill that fails to fire doesn't fail CI.** In the default two-arm mode, every `tool_used: Skill` grader is left out of the score and shown only as a "plugin-fired indicator". Setting `arm: both` on the grader, or running with `--ablation none`, makes it count. (High, [plugin-evals § Score against the no-plugin baseline])
- **`/skill-doctor`** reports each skill's context cost and how often it runs. It flags skills in the listing that never run, including plugin skills, and says where to turn them off. (High, [skills § Find unused skills])
- **`/doctor`** estimates the skill listing's context cost and names its biggest contributors. Since v2.1.144 it is where the listing-truncation warning lives, and since v2.1.178 that warning counts the affected descriptions. No source says it names which descriptions were dropped. (High; Null on naming; [skills § Skill descriptions are cut short], [changelog])
- **Codex has no eval command.** OpenAI's documented pattern is a hand-written harness around `codex exec --json` and `--output-schema`. Codex's listing budget is 2% of the context window. `codex debug prompt-input` shows the exact skill listing the model gets, with no model call. (High; Null for a built-in runner; [OpenAI eval-skills], [Codex build skills])

## 1. `claude plugin eval`

Added in v2.1.269 (2026-09-11) as "run a plugin's eval suite against Claude Code and get scored, reproducible results (JSON + HTML report)". Later changes:

- v2.1.283: git 2.31 or newer is required.
- v2.1.289: fixed a stale copy of a plugin from a local-folder marketplace.
- v2.1.293: fixed Bash-granting runs on Macs with Docker Desktop.
- v2.1.299: a run that ends on an API error now scores 0, and `--disallow-tools` was added.

(High, [changelog 2.1.269], [changelog 2.1.299]) This machine has v2.1.310 and git 2.53, so both requirements are met. (High, local)

### Suite format

- **Location.** A suite lives in `evals/` at the plugin root. `"experimental": { "evals": "<dir>" }` in `plugin.json`, or `--eval-dir`, moves it. Results go to `evals/results/<timestamp>/`, which belongs in `.gitignore`. (High, [plugin-evals § Use a different eval directory])
- **A case is a directory** with a `prompt.md`, a `case.yaml`, or both, plus at least one grader. A grader is a `graders/<name>.md` file or a `graders:` entry in `case.yaml`. A case without a grader fails to load. Directories that aren't cases group cases. (High, [plugin-evals § Write and refine cases])
- **`prompt.md`.**
  - Its body is the prompt, sent "exactly as you wrote it". `@path` mentions are not expanded.
  - Frontmatter fields: `name`, `description`, `tags`, `plugins` (plugin directories under test), `runs` (default 3, 1 to 50), `expected_outcome`, `model`, `max_turns` (default 10, up to 200), `timeout_seconds` (default 300, up to 3600), `allowed_tools`, `append_system_prompt` and `env` (keys must match `EVAL_*`).
  - An unknown key is an error.

  (High, [plugin-evals § prompt.md frontmatter])
- **`case.yaml`.** It adds:
  - `context.scaffold_script`: a Bash script that seeds files or a git repo. It runs as you, outside the sandbox, only with `--scaffold`, and has a 120-second limit.
  - `context.history_file`: a `.jsonl` transcript to resume.
  - `context.add_dirs`: read-only fixture directories.

  (High, [plugin-evals § case.yaml fields])
- **MCP mocks** go under `evals/mocks/<server>/<tool>.md`. They can be fixed replies or replies the grading model writes, and they can guard the input with `expect:`. Real MCP servers start only with `--allow-real-servers` or `--mocks off`. (High, [plugin-evals § Mock MCP servers])
- **Authoring.** `claude plugin eval init` interviews you, proposes should-trigger and should-not-trigger prompts, tries them once and writes the cases. It calls the model, so it spends usage. `claude plugin eval init --bare <name>` writes a blank template and runs nothing. (High, [plugin-evals § Create your first eval suite], local `--help`)
- **Not interchangeable with skill-creator.** The `skill-creator` plugin's `evals/evals.json` format is a different format, and "neither tool reads the other's case files". (High, [plugin-evals])

### What a case can assert

Six grader types. The first four are computed from the transcript and files and cost nothing. `llm` and `baseline` call a grading model, which Claude Code calls the judge. (High, [plugin-evals § Grader types])

| Type | Passes when | Free? |
|---|---|---|
| `regex` | A JavaScript regex is found, absent (`match: not_contains`) or found exactly N times in the target | Yes |
| `tool_used` | Calls to `tool` whose JSON input matches `input_match` number between `min` (default 1) and `max`. `min: 0, max: 0` asserts a tool was never called | Yes |
| `tool_order` | The first matching `before` call comes before the first matching `after` call | Yes |
| `file_exists` | A file created during the run matches a glob (or none does, with `exists: false`) | Yes |
| `llm` | The grading model votes PASS on a rubric in at least two of three votes | No |
| `baseline` | The run meets the criteria at least as well as a reference transcript | No |

What a grader can look at (`target` for `regex`, `focus` for `llm`) (High, [plugin-evals § What a grader can look at]):

- `last_message`, the default.
- `trace`, the whole session as JSON lines. A regex sees every message; an `llm` grader sees only the first 12 and last 12.
- `files`, the paths Claude created. This list excludes files it only edited and files a scaffold made.
- `{ source: file, path: … }`, one file's contents after the run. An `llm` grader sees PNG, JPEG, GIF and WebP files as images and refuses other binaries.
- `mock_calls`, the calls made to mocked MCP tools.

Mapped to the ticket's three questions:

- **Whether a skill loads for a prompt.** Use `tool_used` with `tool: Skill` and `input_match: '"skill"\s*:\s*"(?:[\w-]+:)?<skill-name>"'`, which also matches the `plugin:skill` form. A "must not fire" check uses `min: 0, max: 0` and needs `arm: both`. (High, [plugin-evals § Write a case manually], [§ Score against the no-plugin baseline])
- **Outcome grading.** Use `llm` on the reply or a produced file, `regex` over a file's contents, or `baseline` against a reference transcript. The docs advise `regex` for long output and short concrete PASS and FAIL rubrics for `llm`. The default grading model is the background-task model, which the CLI help names as `haiku`. `--judge-model` overrides it. (High, [plugin-evals § Choose graders that give a stable signal], local `--help`)
- **Which files were read.** No grader type is built for this, but `tool_used` with `tool: Read` and an `input_match` on the path asserts a read. A `regex` over `trace` does the same. (Medium: the grader semantics are documented, and applying them to `Read` is direct.)

### Baseline and scoring

- **Scoring.** A run's score is the weighted share of its graders that passed, and a case's score is the mean of its runs. A case passes when its with-plugin score meets `--threshold`, which defaults to 1.0. (High, [plugin-evals § How a case is scored])
- **Graders left out of the score in a two-arm run.**
  - These are scored in neither arm and shown as `scored: false` indicators: every `tool_used` grader whose `tool` is `Skill`, mock-call graders for the plugin's own servers, and any grader marked `arm: with-only`.
  - If every grader in a case is in that set, they are all scored normally.
  - `--ablation none` excludes nothing.

  (High, [plugin-evals § Score against the no-plugin baseline])
- **`Δ` never changes the exit code.** Only the with-plugin score against `--threshold` does. (High, [plugin-evals § Run evals in CI])
- **The commonest first finding** is a `Δ` near zero with the `tool_used: Skill` grader failing. That means Claude isn't choosing the skill on natural phrasing, and the fix is the skill's `description`. (High, [plugin-evals § Open the report and iterate])

### Sandbox

Each run gets a temporary home directory, working directory and Claude Code config, and runs as a `claude -p` child process with only the plugin loaded. (High, [plugin-evals § How runs are isolated]) In that run:

- **Nothing personal or project-level loads.** No user settings, hooks, `CLAUDE.md`, MCP servers, other plugins, memory or user skills, and no `.claude/` or `.mcp.json` from anywhere. Most of the shell environment is withheld except an allowlist and `EVAL_*` variables.
- **Managed settings still apply.**
- **The Artifact tool is off.** A skill that publishes an artifact is graded only on what it produces before that step.
- **The case definitions are hidden** from the agent under test.
- **Tools.**
  - Read-only tools are granted when a case lists them: `Read`, `Glob`, `Grep`, `NotebookRead`, `Skill`, `AskUserQuestion`, `Agent`, `TodoWrite` and the task tools.
  - `Bash`, `Write`, `Edit`, `WebFetch` and `WebSearch` need `--allow-tools`. Without a grant they are removed, not prompted for.
  - Granted Bash runs under the OS sandbox. Writes stay in the workspace, home and config can't be read, and network is limited to granted domains.
  - On Linux the sandbox needs `bubblewrap` and `socat`.

  (High, [plugin-evals § Grant tools])
- **No network sandbox outside shell commands.** The plugin's own hooks, and any real MCP servers it starts, run outside the sandbox and can reach any host. (High)
- **git.** Each run switches off git hooks and credential helpers. That's why git 2.31 or newer is required. (High, [plugin-evals § is too old])
- **Trust.** The first run against an untrusted directory asks for trust. Under `--json` or without a terminal it is refused unless `--trust-plugin` is passed. A plugin named by `name@marketplace` skips the prompt. (High, [plugin-evals § Trust the plugin directory])

### Output

- **Summary table.** `CASE  WITH  W/OUT  Δ  RUNS  COST  NOTES` per case, then mean `Δ`, wall time and estimated cost. One-arm runs show `SCORE` and `PASS%` instead. (High, [plugin-evals § Read the summary])
- **`aggregate-result.json`, or `--json`.** It is versioned, with `schemaVersion: 1` and camelCase fields. Gating fields:
  - `partial` and `partialReason` (`cost_ceiling`, `interrupted`, `auth_failed`)
  - `aggregates.overallScore`, `casesPassed`, `casesTotal` and `meanDelta`
  - `cases[].aggregates.score` and `.delta`
  - per-run `error`, `aborted` and `skippedPaidGraders`
  - `costUsd`, `durationSeconds` and `claudeVersion`

  It also holds every grader definition and per-run grader results with evidence. (High, [plugin-evals § JSON result])
- **`report.html`.** A single self-contained file with no external requests. It holds a verdict line, summary tiles, a card per case, each run's grader chips with explanations, and the grading model's votes and evidence. (High, [plugin-evals § HTML report])
- **Report publishing.** When signed in with a claude.ai subscription, the report is also published by default as a private artifact (`Published: <url>`). `--no-publish` keeps it local. A run that a Claude Code session started stays local unless `--publish-report` is passed. (High, [plugin-evals § HTML report])
- **Exit codes.** (High, [plugin-evals § Run evals in CI])
  - **0:** every case met the threshold.
  - **1:** below threshold, load error, no cases, API error, untrusted directory, bad option or JSON write failure.
  - **2:** partial run, from the cost ceiling or a credential refused at the first run.
  - **130:** interrupted.
  - **143:** terminated.

### Run time

- **Per-run caps** are 10 turns and 300 seconds by default. Runs go one at a time unless `-j/--concurrency` is set, up to 8. Concurrent runs "share your account's rate limit", so concurrency shortens wall time but doesn't raise throughput. (High, [plugin-evals § Command options], local `--help`)
- **The docs' one example** was 1 case, 6 runs and 74 seconds, about 12 seconds a run, for a simple commit-message skill. (High, [plugin-evals § Read the summary])
- **A Friday-sized estimate.** A suite of 20 cases at the default 3 runs and two arms is 120 agent runs. At the example's pace that is about 25 minutes run one at a time. Friday's Playbooks run far longer than a commit message, so treat that as a floor. (Low: arithmetic on one example.)

## 2. Pro login and cost

- **It runs on the login a normal session uses.** The requirement is "the same authentication and model provider your normal Claude Code sessions use". Eval runs, rubric votes and `eval init` "call the model with your credentials, so they count against your plan's usage limits or your API bill." The CLI help adds: "Each run is a full claude child on your own credential, so they share one rate limit." (High, [plugin-evals § Requirements], local `--help`)
- **No plan gate is documented.** Nothing limits `claude plugin eval` to a plan. The two "unavailable" errors are about old builds and a server-side switch. (Null for any plan restriction, [plugin-evals § Troubleshooting])
- **This machine is logged in on Pro.** `claude auth status` reports `authMethod: claude.ai` and `subscriptionType: pro`. (High, local)
- **`COST` is a list-price estimate.** It is a list-price estimate of the model calls, and `--max-cost-usd` is "a ceiling on the run's list-price cost estimate, not on plan usage". No source says how much of a Pro session or weekly window a dollar of list price uses. (High, Null for the conversion, [plugin-evals § Command options])
- **Pro limits are session and weekly windows shared across models.** They can be extended with usage credits if Somya has switched those on. Eval runs draw from the same windows as Somya's own sessions. (High for the windows, Medium for evals sharing them, [costs § When a developer asks about a limit])
- **Hitting a limit mid-suite.**
  - A run that ends on a usage or rate limit scores 0 without grading, and the command exits non-zero.
  - The suite is not marked partial.
  - The docs advise re-running after the reset with `--runs 1` or a `--case` filter.
  - Before v2.1.299 such runs were graded on what they had produced.

  (High, [plugin-evals § Runs fail with a usage-limit or rate-limit error])
- **The docs' own ways to keep cost down.** Free graders only for quick suites. `--ablation none` when `Δ` isn't needed, which halves the runs. `--runs 1` while iterating. Pinned models. (High, [plugin-evals § Run evals in CI], [§ Score against the no-plugin baseline])

## 3. CI on GitHub Actions with `CLAUDE_CODE_OAUTH_TOKEN`

- **The token.** `claude setup-token` makes a one-year OAuth token. It "authenticates with your Claude subscription and requires a Pro, Max, Team, or Enterprise plan" and "can only make model requests". Bare mode does not read it. (High, [authentication § Generate a long-lived token])
- **The GitHub Actions docs name it.** `CLAUDE_CODE_OAUTH_TOKEN` is the repository secret for a subscription, "available on Pro, Max, Team, and Enterprise plans". With it, "runs use your Claude subscription instead of API billing". The token is tied to the subscription of whoever ran `setup-token`. (High, [github-actions])
- **The eval page doesn't name it.** Its CI section names "credentials in the environment such as `ANTHROPIC_API_KEY` or your cloud provider's variables". Its run environment passes "the variables that select and authenticate your model provider, most `ANTHROPIC_*` and `CLAUDE_CODE_*` configuration". So the token should reach each run, unless eval children run in bare mode, which no source says either way. A single cheap run in CI would settle it. (Medium, [plugin-evals § Run evals in CI], [§ prompt.md fields])
- **What the runner needs.** (High, [plugin-evals § Run evals in CI])
  - A Claude Code install.
  - git 2.31 or newer.
  - `--trust-plugin`, since there is no terminal.
  - `--json results.json` and `--no-publish`.
  - A pinned `--model` and `--judge-model`, so a model rollout isn't mistaken for a regression.
  - A `--threshold`, and `--max-cost-usd` as an upper limit.
  - On Linux, `bubblewrap` and `socat` if any case gets Bash.
- **A private plugin needs no marketplace.** The target can be `.` in the checkout, so CI never has to reach Friday's private marketplace. (High, [plugin-evals § Choose what to evaluate])
- **CI shares the plan with Somya's own sessions.** A CI suite on her token draws from the same Pro windows as her interactive sessions. (Medium: the token "authenticates with your Claude subscription".)

## 4. Trigger clashes with user-scope skills and other plugins

- **Not inside `claude plugin eval`.** User skills and other installed plugins are absent from every run. That includes Emil's skills, Matt's plugin and `superset@skills-dir`. The docs say to "ship any skills, agents, hooks, or MCP servers a case depends on in the plugin under test". (High, [plugin-evals § How runs are isolated])
- **Clashes inside Friday's plugin can be tested.** The whole plugin loads, so a case can assert that `friday-tdd` fires and `friday-review` doesn't for one prompt. (High)
- **A second plugin in `plugins:` is an untested option.** The `plugins` field is "plugin directories under test", which reads as a list, so a case might load a second "neighbour" plugin of competing skills beside Friday. The docs don't describe a case with several plugins. The baseline arm would then drop both, so such a case would run with `--ablation none`. (Low)
- **Emil's skills are not a plugin on this machine.** `~/.claude/skills/` holds 46 folders, and only `superset` has a `.claude-plugin/` manifest. The rest, Emil's included, are plain personal skills. Putting them in an eval needs a plugin folder holding them. ADR-0002 says Emil's skills are used in place and never copied, and they have no licence file (see `docs/research/skill-census.md`). This is a tension for #34, not a ruling. (High for the folders, Medium for the tension)
- **CI can't see Emil's skills.** A GitHub runner doesn't have Somya's `~/.claude/skills`, so a clash test against them can only run on her machine, unless their content goes onto the runner. (Medium)
- **Plain `claude -p` sees the real setup.** Without `--bare`, it "discovers and loads them as an interactive session would, including anything configured in the working directory or `~/.claude`". `--output-format stream-json` exposes each `tool_use` block, so a script can see which skill fired. (High, [headless])
- **A baseline by hand.** For a personal or project skill, turn it off with `skillOverrides: "off"`. That setting doesn't reach plugin skills, which need the plugin left out instead. (High, [skills § Evaluate and iterate on a skill])
- **Anthropic's `skill-creator` already uses that path.** Its `run_eval.py` does the following (High, [skill-creator run_eval.py], [improve_description.py], [run_loop.py]):
  - It writes the candidate description to a temporary `.claude/commands/<name>-skill-<id>.md` in the project root.
  - It runs `claude -p "<query>" --output-format stream-json --verbose --include-partial-messages` there, with the user's full environment.
  - It counts a trigger only when Claude's first tool call is `Skill` or `Read` naming that file. Any other first tool counts as no trigger.
  - It stops each run at that first tool call, so a trigger check is much shorter than a full eval run. (Medium: read from the code.)
  - Defaults: 3 runs per query, 10 parallel workers, a 30-second timeout and a 0.5 trigger threshold. The description loop runs up to 5 rounds with 40% of queries held out.
  - It uses "the session's Claude Code auth, no separate ANTHROPIC_API_KEY needed".

  Two caveats: it tests a stand-in command, not the installed plugin skill, and if the real skill is installed it competes with its own stand-in. (Low: read from the code, not run.)

## 5. Facts about Friday's skill split that bear on evals

These are facts for #34, not choices.

- **Playbooks never fire on their own.** They set `disable-model-invocation: true`, so their description is "not in context" and Claude "can't invoke the skill on its own". A trigger case for a Playbook can only check that it does *not* start from the Skill tool, or that `/friday` reaches it. (High, [skills § Control who invokes a skill], ADR-0009)
- **`/friday` reads the chosen Playbook's `SKILL.md` by path** (ADR-0009). A routing check is therefore a `tool_used` grader on `Read` with the Playbook's path in `input_match`, not a `Skill` grader. (Medium)
- **Whether an eval prompt may start with `/friday` is not documented.** In `claude -p`, "user-invoked skills and custom commands work. Include `/skill-name` in the prompt string and Claude Code expands it before running." The eval page says the prompt is sent "exactly as you wrote it" and mentions only that `@path` is not expanded. No source settles whether `/friday …` in a `prompt.md` body is expanded. (High for `-p`; Null for eval)
- **Reference skills can be trigger-tested directly** with a `tool_used: Skill` grader, including negative cases. (High)
- **Plugin skills can't be set to `name-only` from settings**, because `skillOverrides` doesn't reach plugin skills. A Friday skill's listing cost is set only by its own `description` and `when_to_use`, or by `disable-model-invocation`. (High, [skills § Override skill visibility from settings])
- **Every run is Claude.** The agent under test is a `claude -p` child, and `--judge-model` takes a Claude model. No source offers a GPT-family grading model inside `claude plugin eval`. The skill rulings ask for "a judge from the other family" in `friday-writing-for-agents`' test branch. (High for Claude-only; Null for another family)
- **`--disallow-tools` and a `disallowed_tools` case field** (v2.1.299) can keep tools such as `Agent` out of runs. The field appears in the changelog and CLI help but not in the docs' `prompt.md` table. (High, [changelog 2.1.299], local `--help`)

## 6. `/skill-doctor`

- **What the report covers.** "what each of your skills costs and how often it gets used". It covers "the skills in your session other than bundled skills and enterprise skills". It "flags skills in the listing that have never been invoked and says where to turn them off", including plugin skills, and "also lists plugins you haven't used recently". (High, [skills § Find unused skills], [measure § Find skills that never run])
- **Where it shows.** In an interactive session it opens the `/plugin` manager's **Stats** tab; `/plugin stats` opens the same tab. With `-p` it prints as text. (High, [skills], [plugin cli-reference])
- **Where its data comes from.** Usage is recorded on each person's own machine. Nothing reports back to a plugin's author. (High, [measure § Check whether a plugin is used])
- **Limits.**
  - It is unavailable in sessions that skip feature-flag fetching, and over Remote Control.
  - The docs say it needs v2.1.252 or later, but the changelog adds it in v2.1.261 (2026-09-04), probably behind a feature flag before that.

  (High for both statements; the gap between them is unexplained.)
- **Not documented.**
  - Whether it shows dropped descriptions.
  - How it treats user-only skills such as Playbooks, which aren't in the listing.
  - Whether running it uses model usage.

  (Null)

## 7. `/doctor` and the skill listing

- **The checkup.** `/doctor`, alias `/checkup`, is a bundled skill. Claude reports findings and asks before fixing anything. Its "Extensions" area covers "unused skills, MCP servers, and plugins compared with their context cost". Because Claude writes the report, it uses model usage. (High for the scope, Medium for usage, [skills § Check your setup with /doctor])
- **The listing estimate.** "Run `/doctor` for an estimate of the listing's context cost and its biggest contributors." When the listing exceeds its budget, Claude Code also writes a warning to the debug log, which `--debug` shows. (High, [skills § Skill descriptions are cut short])
- **Dropped descriptions.** (High, [changelog 2.1.105], [2.1.144], [2.1.178]; Null on naming)
  - v2.1.105 added a startup warning when descriptions are truncated.
  - v2.1.144 moved it: "Skill-listing truncation is no longer shown as a startup notification — run `/doctor` for the full breakdown."
  - v2.1.178 made the warning "show how many skill descriptions are affected".
  - No source says `/doctor` names which skills lost their description.
- **The budget rules.** (High, [skills § Skill descriptions are cut short], [§ Frontmatter reference])
  - The budget is 1% of the model's context window.
  - Every skill name is kept.
  - On overflow, descriptions are dropped starting with the least-invoked skills.
  - Each entry's `description` plus `when_to_use` is capped at 1,536 characters.
  - Settings: `skillListingBudgetFraction`, `SLASH_COMMAND_TOOL_CHAR_BUDGET`, `skillListingMaxDescChars`, and `skillOverrides: "name-only"`, which works for non-plugin skills only.
- **`/context`.** Its Skills row shows the listing's size after the budget is applied. Before v2.1.196 it overstated it. (High, [skills])
- **`claude doctor` in the shell says nothing about skills.** On this machine it printed only install, update, policy and Remote Control lines. Only `/doctor` in a session covers the listing. (High, local)
- **Two free shell checks with no model call.**
  - `claude plugin details <name>` prints a plugin's always-on and on-invoke token estimates per skill. It works before install with `claude --plugin-dir <dir> plugin details <name>`. (High, [measure § Measure what a plugin costs])
  - `claude plugin validate <dir> --strict --json` fails on frontmatter that doesn't parse and other manifest problems. (High, [plugin cli-reference], local `--help`)

## 8. Codex

- **No built-in eval runner.** The Codex CLI 0.163.0 command list has no eval command, and neither do the docs. `codex plugin` only adds, lists and removes plugins. (Null; High that it's absent from help.)
- **OpenAI's documented pattern** ([OpenAI eval-skills]) (High):
  - A CSV of prompts with a `should_trigger` column, covering explicit, implicit, contextual and negative cases. "A small set of 10–20 prompts is enough."
  - Run each with `codex exec --json --full-auto` and save the JSONL trace.
  - Score with deterministic checks over `command_execution` items and the files produced.
  - Add a read-only `codex exec --output-schema` pass for rubric grading. Token usage per turn is in `turn.completed`.
- **Detecting that a skill fired.** The post lists "Did the agent invoke the skill?" as a goal, but its code checks only commands and files. `codex exec --json` documents the event types `thread.started`, `turn.*`, `item.*` and `error`, with no skill event. (Null for a documented skill-fired signal, [Codex non-interactive mode])
- **The listing budget.** (High, [Codex build skills])
  - At most 2% of the context window, or 8,000 characters when the window is unknown.
  - Codex shortens descriptions first, then may omit skills with a warning.
  - `skills.max_context_tokens` sets the budget, up to 10,000 tokens.
  - Duplicate names are not merged.
- **Codex's user-only switch.** `policy.allow_implicit_invocation: false` in a skill's `agents/openai.yaml` is the counterpart of `disable-model-invocation`. (High, [Codex build skills])
- **Seeing the listing.** `codex debug prompt-input` prints the model-visible prompt, skill listing included, as JSON with no model call. On this machine it showed:
  - 170 skill entries, each description cut to 162 characters or fewer.
  - 46 names listed twice, mostly Emil's skills, found in both `~/.codex/skills` and `~/.agents/skills`.

  (High, local)
- **CI.** (High, [Codex non-interactive mode], [Codex GitHub Action], [Codex CI/CD auth], [Codex pricing])
  - The Codex GitHub Action takes `openai-api-key`, which is API billing.
  - Running as a ChatGPT account in CI is "advanced": it seeds `~/.codex/auth.json` on a trusted private runner, one machine at a time, and is not for public repos.
  - Plus includes the Codex CLI with usage counted in five-hour windows.

## Open questions only a real run answers

Each costs a little Pro usage, so none was run here.

1. Does a `prompt.md` body starting with `/friday …` get expanded in an eval run?
2. Do eval children read `CLAUDE_CODE_OAUTH_TOKEN` on a GitHub runner?
3. How much of a Pro session window does one eval run of a Friday Playbook use?
4. Does a case with two directories in `plugins:` load both?
5. What do `/skill-doctor` and `/doctor` print for Somya's current setup?

## Sources

- plugin-evals: <https://code.claude.com/docs/en/plugin-evals>
- skills: <https://code.claude.com/docs/en/skills>
- measure: <https://code.claude.com/docs/en/plugins/measure>
- plugin cli-reference: <https://code.claude.com/docs/en/plugins/cli-reference>
- authentication: <https://code.claude.com/docs/en/authentication>
- github-actions: <https://code.claude.com/docs/en/github-actions>
- headless: <https://code.claude.com/docs/en/headless>
- costs: <https://code.claude.com/docs/en/costs>
- commands: <https://code.claude.com/docs/en/commands>
- debug-your-config: <https://code.claude.com/docs/en/debug-your-config>
- changelog: <https://code.claude.com/docs/en/changelog> (2.1.105, 2.1.144, 2.1.178, 2.1.261, 2.1.269, 2.1.283, 2.1.289, 2.1.293, 2.1.299)
- what's new, week 37: <https://code.claude.com/docs/en/whats-new/2026-w37>
- skill-creator run_eval.py: <https://github.com/anthropics/claude-plugins-official/blob/2a40fd2e7c52207aa903bd33fc4c65716126966e/plugins/skill-creator/skills/skill-creator/scripts/run_eval.py>
- improve_description.py: <https://github.com/anthropics/claude-plugins-official/blob/2a40fd2e7c52207aa903bd33fc4c65716126966e/plugins/skill-creator/skills/skill-creator/scripts/improve_description.py>
- run_loop.py: <https://github.com/anthropics/claude-plugins-official/blob/2a40fd2e7c52207aa903bd33fc4c65716126966e/plugins/skill-creator/skills/skill-creator/scripts/run_loop.py>
- OpenAI eval-skills: <https://developers.openai.com/blog/eval-skills>
- Codex build skills: <https://learn.chatgpt.com/docs/build-skills>
- Codex non-interactive mode: <https://learn.chatgpt.com/docs/non-interactive-mode>
- Codex GitHub Action: <https://learn.chatgpt.com/docs/github-action>
- Codex CI/CD auth: <https://learn.chatgpt.com/docs/auth/ci-cd-auth>
- Codex pricing: <https://learn.chatgpt.com/docs/pricing>
- Local, 2026-10-26: Claude Code 2.1.310 help text, `claude doctor`, `claude plugin list`, `claude auth status`, `git --version` (2.53.0); Codex CLI 0.163.0 help text and `codex debug prompt-input`.

[plugin-evals]: https://code.claude.com/docs/en/plugin-evals
[plugin-evals § Requirements]: https://code.claude.com/docs/en/plugin-evals#requirements
[plugin-evals § How a case is scored]: https://code.claude.com/docs/en/plugin-evals#how-a-case-is-scored
[plugin-evals § Grader types]: https://code.claude.com/docs/en/plugin-evals#grader-types
[plugin-evals § What a grader can look at]: https://code.claude.com/docs/en/plugin-evals#what-a-grader-can-look-at
[plugin-evals § How runs are isolated]: https://code.claude.com/docs/en/plugin-evals#how-runs-are-isolated
[plugin-evals § Score against the no-plugin baseline]: https://code.claude.com/docs/en/plugin-evals#score-against-the-no-plugin-baseline
[§ Score against the no-plugin baseline]: https://code.claude.com/docs/en/plugin-evals#score-against-the-no-plugin-baseline
[plugin-evals § prompt.md fields]: https://code.claude.com/docs/en/plugin-evals
[§ prompt.md fields]: https://code.claude.com/docs/en/plugin-evals
[plugin-evals § prompt.md frontmatter]: https://code.claude.com/docs/en/plugin-evals
[plugin-evals § case.yaml fields]: https://code.claude.com/docs/en/plugin-evals
[plugin-evals § Use a different eval directory]: https://code.claude.com/docs/en/plugin-evals#use-a-different-eval-directory
[plugin-evals § Write and refine cases]: https://code.claude.com/docs/en/plugin-evals#write-and-refine-cases
[plugin-evals § Write a case manually]: https://code.claude.com/docs/en/plugin-evals#write-a-case-manually
[plugin-evals § Mock MCP servers]: https://code.claude.com/docs/en/plugin-evals#mock-mcp-servers
[plugin-evals § Create your first eval suite]: https://code.claude.com/docs/en/plugin-evals#create-your-first-eval-suite
[plugin-evals § Open the report and iterate]: https://code.claude.com/docs/en/plugin-evals#create-your-first-eval-suite
[plugin-evals § Read the summary]: https://code.claude.com/docs/en/plugin-evals#create-your-first-eval-suite
[plugin-evals § Choose graders that give a stable signal]: https://code.claude.com/docs/en/plugin-evals#choose-graders-that-give-a-stable-signal
[plugin-evals § Grant tools]: https://code.claude.com/docs/en/plugin-evals#grant-tools
[plugin-evals § Command options]: https://code.claude.com/docs/en/plugin-evals#command-options
[plugin-evals § Choose what to evaluate]: https://code.claude.com/docs/en/plugin-evals#choose-what-to-evaluate
[plugin-evals § Run evals in CI]: https://code.claude.com/docs/en/plugin-evals#run-evals-in-ci
[§ Run evals in CI]: https://code.claude.com/docs/en/plugin-evals#run-evals-in-ci
[plugin-evals § JSON result]: https://code.claude.com/docs/en/plugin-evals#json-result
[plugin-evals § HTML report]: https://code.claude.com/docs/en/plugin-evals#html-report
[plugin-evals § Trust the plugin directory]: https://code.claude.com/docs/en/plugin-evals#trust-the-plugin-directory
[plugin-evals § is too old]: https://code.claude.com/docs/en/plugin-evals
[plugin-evals § Troubleshooting]: https://code.claude.com/docs/en/plugin-evals#troubleshooting
[plugin-evals § Runs fail with a usage-limit or rate-limit error]: https://code.claude.com/docs/en/plugin-evals#runs-fail-with-a-usage-limit-or-rate-limit-error-partway-through
[skills]: https://code.claude.com/docs/en/skills
[skills § Find unused skills]: https://code.claude.com/docs/en/skills#find-unused-skills
[skills § Skill descriptions are cut short]: https://code.claude.com/docs/en/skills#skill-descriptions-are-cut-short
[skills § Check your setup with /doctor]: https://code.claude.com/docs/en/skills
[skills § Evaluate and iterate on a skill]: https://code.claude.com/docs/en/skills#evaluate-and-iterate-on-a-skill
[skills § Control who invokes a skill]: https://code.claude.com/docs/en/skills#control-who-invokes-a-skill
[skills § Override skill visibility from settings]: https://code.claude.com/docs/en/skills#override-skill-visibility-from-settings
[§ Frontmatter reference]: https://code.claude.com/docs/en/skills#frontmatter-reference
[measure]: https://code.claude.com/docs/en/plugins/measure
[measure § Find skills that never run]: https://code.claude.com/docs/en/plugins/measure#find-skills-that-never-run
[measure § Check whether a plugin is used]: https://code.claude.com/docs/en/plugins/measure#check-whether-a-plugin-is-used
[measure § Measure what a plugin costs]: https://code.claude.com/docs/en/plugins/measure#measure-what-a-plugin-costs
[plugin cli-reference]: https://code.claude.com/docs/en/plugins/cli-reference
[authentication]: https://code.claude.com/docs/en/authentication
[authentication § Generate a long-lived token]: https://code.claude.com/docs/en/authentication#generate-a-long-lived-token
[github-actions]: https://code.claude.com/docs/en/github-actions
[headless]: https://code.claude.com/docs/en/headless
[costs § When a developer asks about a limit]: https://code.claude.com/docs/en/costs#when-a-developer-asks-about-a-limit
[changelog]: https://code.claude.com/docs/en/changelog
[changelog 2.1.105]: https://code.claude.com/docs/en/changelog#2-1-105
[2.1.144]: https://code.claude.com/docs/en/changelog#2-1-144
[2.1.178]: https://code.claude.com/docs/en/changelog#2-1-178
[changelog 2.1.269]: https://code.claude.com/docs/en/changelog#2-1-269
[changelog 2.1.299]: https://code.claude.com/docs/en/changelog#2-1-299
[skill-creator run_eval.py]: https://github.com/anthropics/claude-plugins-official/blob/2a40fd2e7c52207aa903bd33fc4c65716126966e/plugins/skill-creator/skills/skill-creator/scripts/run_eval.py
[improve_description.py]: https://github.com/anthropics/claude-plugins-official/blob/2a40fd2e7c52207aa903bd33fc4c65716126966e/plugins/skill-creator/skills/skill-creator/scripts/improve_description.py
[run_loop.py]: https://github.com/anthropics/claude-plugins-official/blob/2a40fd2e7c52207aa903bd33fc4c65716126966e/plugins/skill-creator/skills/skill-creator/scripts/run_loop.py
[OpenAI eval-skills]: https://developers.openai.com/blog/eval-skills
[Codex build skills]: https://learn.chatgpt.com/docs/build-skills
[Codex non-interactive mode]: https://learn.chatgpt.com/docs/non-interactive-mode
[Codex GitHub Action]: https://learn.chatgpt.com/docs/github-action
[Codex CI/CD auth]: https://learn.chatgpt.com/docs/auth/ci-cd-auth
[Codex pricing]: https://learn.chatgpt.com/docs/pricing

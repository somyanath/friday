# Verification skill

**Status:** decided (2026-10-28) in [What does a project's Verification skill hold, and how does each Live check get its data and login?](https://github.com/somyanath/friday/issues/22). Nothing here is built yet.

**What it is:**

- A project's own skill, one per app, that launches the app, drives it the way a user does, and saves evidence.
- `pstack-create-verification-skill` makes it and `pstack-maintain-verification-skill` keeps it current.
- The project commits it as its own file. It names nothing of Friday, because projects are public (ADR-0006).
- Every Live check is a Playwright Test file that a script runs, never an agent driving a browser tool (ADR-0011).

**Evidence behind the choices:**

- [browser drivers research](https://github.com/somyanath/friday/blob/research/browser-drivers/docs/research/browser-drivers.md): hand-written CDP helpers, Playwright and Chrome DevTools MCP compared, each tested inside and outside Codex's sandbox. It also covers error reporting, video, the test runner, and projects that don't use Node.
- [pstack verification research](https://github.com/somyanath/friday/blob/research/pstack-verification/docs/research/pstack-verification.md).

## Where it lives

- **One skill per app,** named `verify-<app>`. A project holding several apps, such as the portfolio monorepo, has one for each, all at the repo root.
- **The real folder is `.agents/skills/verify-<app>/`.** A committed symlink, `.claude/skills/verify-<app>`, points to it. Playwright follows the symlink to the real path, which was tested.
- **Claude may start it on its own** (no `disable-model-invocation`).

```
.agents/
  skills/verify-<app>/
    SKILL.md              commands, ports, footprint, proof standards
    playwright.config.ts  the two sizes, trace, video, output folder
    fixtures.ts           attaches to launch's Chrome; settings, failure rules, screenshots
    scripts/              launch, doctor, check, cleanup
    features/
      README.md           index, baseline preconditions, conventions
      <feature>.md        one per feature
      <feature>.spec.ts   one test per sub-feature
  package.json            only in a project with no root package.json
  package-lock.json       only with it
  .gitignore              node_modules/, only with it
.claude/skills/verify-<app> -> ../../.agents/skills/verify-<app>
```

- **Footprint:** `SKILL.md` lists every file the skill owns outside its own folder:
  - the symlink;
  - Playwright's entry: the root `package.json` line, or the `.agents/` files;
  - the CI job.

  The maintenance pass may edit only the skill folder and this list.

## Playwright

- **Package:** Playwright Test (`@playwright/test`), pinned to an exact version with no `^`.
- **Where it's installed:**
  - **A project with a root `package.json`:** a devDependency there, one version for every app.
  - **A project without one** (Python, Go, Ruby, PHP): `.agents/package.json`, with its lockfile and `.agents/.gitignore`.
    - Hosting platforms pick a project's language from its root files. A root `package.json` can make a new app's first deploy on Heroku's classic stack build as Node, and makes Ruby and PHP builds elsewhere install Node.
    - `.agents/` leaves the root untouched.
  - The skill's files are the same in both layouts, because Node looks for packages from a file's folder upward. Both layouts were tested.
- **Upgrades:** only on purpose, in the maintenance pass's PR, never in a feature PR.
- **A project whose rules forbid the dependency** is a Rule conflict (ADR-0006).
- **Test files** are TypeScript in TypeScript projects and in projects that don't use Node, and JavaScript in JavaScript projects. Playwright runs TypeScript without TypeScript installed.
- **Per machine,** installed outside Codex's sandbox, which can't write to Playwright's cache folder:
  - Google Chrome;
  - Playwright's ffmpeg (`playwright install ffmpeg`, 1.5 MiB).
- **Per workspace:** where Playwright sits in `.agents/`, Superset's setup script runs `npm ci` there (ADR-0003).

## Commands

Each command returns JSON, and its error messages say what to do instead.

| Command | What it does |
|---|---|
| `launch [--dev \| --prod]` | Starts the app, then a headless Chrome with a fresh profile in the temp folder and a debugging port. Both use the workspace's ports. Writes a state file and prints the URLs as JSON. The state file holds pids, ports, commit, build mode, and whether the tree is clean or dirty. |
| `doctor` | Read-only. Checks the state: the processes are up, the ports are ours, the commit and build mode match, the app is ready (not merely answering), and the test login works. Run it first, and again after anything surprising. |
| `check <scenario>` | Runs a scenario and writes its evidence. A scenario is a test file (from the map or a ticket), a sub-feature ID, the `@smoke` set, or the whole map. |
| `cleanup` | Stops only the pids `launch` started, never by process name, and removes scratch state. The evidence stays. |

- **Build mode:**
  - `--dev` (the dev server) for Builders' self-checks and Critic rounds;
  - `--prod` (the production build) for the Verifier's Live check behind a Verdict, for Ship gate evidence, and for a Builder's last Live check before its PR opens ([`friday-implement`](friday-implement.md#one-ticket-branch-skillmd)).
- **Ports:** the skill uses the workspace's block of 10 ports, which Superset's setup script assigns (ADR-0003).
  - `SKILL.md` names which ports of the block it uses, such as app, API and Chrome.
  - `launch` refuses ports outside the block.
  - The block's first port comes from an environment variable with a default, so the skill names nothing of Friday and works for anyone.
- **Ready:** `launch` waits until the app is usable from empty data, including migrations and the seed (Q8), not just until a process answers. Each page has a ready marker the checks wait for.
- **A dirty tree** is recorded in the state file and in `result.json`. A check on a dirty tree can't back a Verdict.
- **Under Codex,** which can't launch Chrome:
  - a Sol Verifier's Claude host session runs `launch`;
  - Sol runs `doctor` and `check` inside Codex's sandbox, with network on, attached to that Chrome.

  Tested inside the sandbox: both sizes passed in 2.3 s.

## Every Live check

- **Two sizes,** as two Playwright projects:
  - `desktop`: 1440×900 at device pixel ratio 2;
  - `phone`: 390×844 at device pixel ratio 2, with phone and touch emulation.
- **Before each screenshot:** fonts loaded and animations settled.
- **Theme:** the default. Dark mode and reduced motion only when a scenario sets them in its own test file.
- **Screenshots** are taken by the fixture on the test's own page. Playwright's own `screenshot: 'on'` stays off, because attached to a shared Chrome it also captured the other size's page and a blank tab.
- **Recorded every time:**
  - a trace;
  - a video at the check's real size, set explicitly, since Playwright otherwise scales it down to fit 800×800.

## What fails a check

A check **fails** when any of these happens:

1. the page doesn't load, or its ready marker never appears;
2. the page throws an uncaught exception;
3. something logs a console error, other than Chrome's own "Failed to load resource" lines;
4. a request to any port `launch` started returns 4xx or 5xx, or fails at the network level.
   - Ports, not hostnames, decide this, because the browser treats `localhost` and `127.0.0.1` as different origins.
   - An API on its own port and a local sign-in emulator both count.
   - Chrome's "Failed to load resource" lines are judged here, by the URL Playwright gives them. A missing favicon shows up only this way, and it fails the check.

**Listed in `result.json` but never failing:**

- warnings;
- failures on other servers, and their console lines;
- requests the page cancelled itself (`net::ERR_ABORTED`), which happens on purpose and on every page change.

**Expected failures:**

- A scenario may declare, in its own test file, the failures it is testing: a request (method, path, status) or a console text.
- Example: "a wrong password gets a 401 and shows an error".
- These are listed as expected and don't fail the check. Without them, every test of an error path would fail.

## What a check saves

- **Where:** a folder the caller passes in `VERIFY_OUT`. The default is a fresh folder in the OS temp folder, never the repo. Friday copies what it needs.
- **`result.json`:**
  - the scenario;
  - the commit, the build mode, and clean or dirty;
  - pass or fail for each condition above;
  - console errors;
  - failed requests, each marked failing, listed or expected;
  - the list of files.
- **Files:** PNG screenshots at both sizes, a trace per test, and a video per test.
- **Survives cleanup:** `cleanup` never deletes evidence. Deleting old evidence folders is a job for the weekly sweep, in [Which recurring jobs does Friday run, on which mechanism, and what does the weekly sweep do?](https://github.com/somyanath/friday/issues/35).

## Feature map

The Feature map is the maintained list of the app's user-facing features. pstack's shape is kept, and every feature gains a test file.

- **`features/README.md`:** the index, plus:
  - baseline preconditions, such as seeded data and the login;
  - conventions: find elements by role and accessible name, start each test from the baseline, restore seeded data after a change;
  - proof standards:
    - drive the real user path, never internal setters or test-only endpoints;
    - capture the action and the resulting state;
    - check side effects as well as the screen.
- **`<feature>.md`,** written from the user's point of view, with no implementation details:
  - what the feature does;
  - sub-features, each with a short ID such as `search-match`;
  - how a user gets to it, listing every entry point;
  - preconditions;
  - gotchas;
  - a pointer to its test file.
- **`<feature>.spec.ts`:**
  - one test per sub-feature, named by its ID;
  - one main-path test per feature, tagged `@smoke`;
  - every test imports the skill's fixture, so the sizes, settings and failure rules always apply.
- **A test is never weakened to make it pass.** When the seed lacks something a journey needs, the test fails and the reason goes in the feature's gotchas.

## Data and login

- **Each workspace gets its own data,** built from empty by migrations plus a committed seed script with made-up data. Real data is never used.
- **The seed script creates the test login.**
  - Its password is generated at launch and written to a git-ignored local env file.
  - No test password is ever in the repo.
- **Outside sign-in providers** (and other outside services) run in test mode or as a local emulator. Superset's setup script copies their keys from the main checkout's env file.
- **The code has no "skip login" switch.**

## Tickets and feature PRs

- **A ticket carries its own Live check scenario,** a Playwright test that `check` runs from its path. It imports the skill's fixture, like the map's tests.
- **Feature PRs never touch the skill.** The map catches up in the maintenance pass, which can take a ticket's test into the map as it is.
- **Still open:** who writes a ticket's scenario and when, and which map tests the Verifier runs before a Verdict. Both belong to [How does a Verifier reach a Verdict, and what does the merge step do with it?](https://github.com/somyanath/friday/issues/24).

## CI

- **On every PR,** the `@smoke` tests run as a required check, beside the `verdict` check in the project's ruleset (ADR-0007).
- **The full map runs on a schedule,** set in [Which recurring jobs does Friday run…?](https://github.com/somyanath/friday/issues/35).
- **In CI,** the fixture launches Chrome itself (GitHub's Ubuntu runners include it), because no sandbox stops it. The job:
  1. builds the app, runs migrations and the seed;
  2. downloads ffmpeg;
  3. reads the test-mode keys from GitHub secrets.
- **Cost:** GitHub's standard runners are free for public repos.
- **The workflow file is a Pause path,** so adding or changing it stops for Somya.

## Making a skill: `pstack-create-verification-skill`

pstack's steps stay: interview the repo rather than Somya, generate, seed the map, prove it, then point at maintenance. Friday's edits:

- **Writes the folders above** and the footprint list, instead of `.cursor/skills/`.
- **Uses Playwright Test,** placed by the rule above, and seeds three to five features, each with its Markdown file and test file.
- **Proves the skill twice before handing it over:**
  1. from a fresh worktree: `launch`, `doctor`, one mapped feature, `check`, then `cleanup`, and the evidence is still there afterwards;
  2. Sol runs `doctor` and `check` once through Codex.

  Both runs' evidence goes in the PR body.
- **Lands as its own PR,** which Somya reviews before any work relies on it (ADR-0006). `/friday` offers it when a project has an app that runs and no Verification skill.

## Keeping it current: `pstack-maintain-verification-skill`

pstack's pass stays: index hygiene, a source wave, reconcile, a live pass, triage, then one PR or none. Friday's edits:

- **Source readers are Haiku,** one per feature, read-only.
- **The live pass is Sonnet against the production build.** It runs the map's tests first, then fixes the ones that fail because the skill has drifted and writes tests for features the map is missing.
- **Incremental by default:** features whose code changed, plus new pages. A full pass only when asked.
- **Product gaps** (the app is broken, not the map) are filed as GitHub bug issues, never fixed in this PR.
- **What it may edit:** the skill folder and its listed footprint, never product code. On each run it:
  1. deletes the Markdown file and test file of any feature the app no longer has, once the source wave and the live pass both show it gone;
  2. removes dependencies that no skill file uses;
  3. deletes the app's skill and symlink when the app itself is removed from the project, and the `.agents/` files once no Verification skill remains;
  4. upgrades the pinned Playwright when it's time, and re-runs the map on the new version;
  5. flags any file in the skill folder or `.agents/` that is neither the skill's nor on its list.
- **One PR,** reviewed by Somya.
- **When it runs** belongs to [Which recurring jobs does Friday run…?](https://github.com/somyanath/friday/issues/35).

## Left to other tickets

- [How does a Verifier reach a Verdict, and what does the merge step do with it?](https://github.com/somyanath/friday/issues/24): who writes a ticket's scenario and when; which map tests a Verifier runs.
- [What do the switch-on playbook and the machine setup script do, step by step?](https://github.com/somyanath/friday/issues/29): Chrome and Playwright's ffmpeg on each machine.
- [Which recurring jobs does Friday run, on which mechanism, and what does the weekly sweep do?](https://github.com/somyanath/friday/issues/35):
  - when the full map runs;
  - when the maintenance pass runs;
  - deleting old evidence folders.
- [What do friday-debugging and friday-prototype do, step by step?](https://github.com/somyanath/friday/issues/27): whether Chrome DevTools MCP's performance traces, Lighthouse and source-mapped errors serve `friday-debugging`. They were ruled out for Live checks, not for investigating.

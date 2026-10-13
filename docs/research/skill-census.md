# Skill census: what is installed, where it overlaps, what it needs

Research for ticket #5 on the Friday map. Read 2026-10-13. Terms follow `GLOSSARY.md` (Surface, Refinement, Direction, Variant, Design language, Discover/Define/Deliver, Direction/Variant/Ship gate).

Paths starting `M/` are `~/.claude/plugins/cache/mattpocock/mattpocock-skills/1.3.1/skills/`. Paths starting `E/` are `~/.claude/skills/`. Paths starting `P/` are a shallow clone of `github.com/cursor/plugins` under `pstack/` (read as data, nothing run).

## Short answer

**Use in place or copy and own?**

- **Matt's skills (MIT) and pstack (MIT) can be copied and modified freely.** Both ship a licence file with a permissive grant (`M/../LICENSE`: MIT, 2026 Matt Pocock; `P/pstack/LICENSE`: MIT, 2026 Lauren Tan). The only condition is keeping the notice. One Matt skill, `pr`, credits a third party's skill (Dex Horthy, humanlayer `show-me`); that upstream's licence was not checked.
- **Emil's installed skills carry no licence or terms file at all** (no LICENSE/TERMS in any `E/` folder). Neither animations.dev nor aiforui.dev publishes terms I could reach: `/terms` and `/license` return 404 on both, and neither home page links any legal page. So a right to modify them privately is **unverified**, not granted and not forbidden. Only 8 of the installed names also exist in Emil's public MIT repo `emilkowalski/skills`, and the two installed copies I diffed (`prototype`, `review-animations`) differ from the public ones. See "Terms findings".
- **Practical lean for the decision:** Emil's skills have 40+ cross-references to each other and to a router, so editing them in place makes upstream updates hard to merge. Copying Matt's and pstack's is legally clear. For Emil's, keep them installed from the subscription as the upstream, add Friday's own skills on top that call them by name, and keep them out of any public repo. Ask Emil (the course page lists e@emilkowal.ski) if Friday should fork them.
- **pstack leans on Cursor** (model names, `~/.cursor/rules/pstack-models.mdc`, the `cursor-team-kit` plugin for `deslop` and `control-ui`). Portability is ticket-covered elsewhere; here it only means "copy and own" of pstack means rewriting those hooks.

**Keep, cut, merge or replace: what the verdicts need to know**

- **The skills form a few big overlap clusters.** Prototype (5 members), routers (4), reviewers (7), unslop (6), animation (about 20 Emil skills, 4 of them near-duplicates in pairs), restate-what-you-said (4), writing (8). Merging inside a cluster is where most of the cutting is.
- **Friday's own design process is nearly uncovered at the front and the end.** No installed skill does Direction-gate work (T1 seed strings, T2 idea lists, writing the build prompt), image or video generation (T4, T5), a critic loop (T3), parallel Variant builds with a Variant gate, or the Ship gate. Variant-making and polish are well covered (Emil's prototype and polish skills).
- **Emil's `emil-prototype` and Matt's `prototype` already build variants behind a picker in one session.** pstack's `arena`/`swarm` already do parallel candidates in worktrees but assume Cursor model names. None of them is a Fleet with a Variant gate.
- **Only two skills touch the private `@aiforui/lapse` registry:** `emil-ask-lapse` (needs `AIFORUI_TOKEN` to install `@aiforui/lapse`, `lapse-mcp`, `lapse-playwright`) and, by mention only, `emil-ask-emil` (routes to it). `emil-prep-for-prod` names Lapse as a dev tool to check is not shipped; it does not need it. Nothing else needs the token.
- **Two synced claude.ai skills are switched off** in `~/.claude/settings.json` `skillOverrides`: `anthropic-skills:skill-creator` and `anthropic-skills:web-animation-design`.

## Census

Invocation column: **M** = the model can invoke it (no `disable-model-invocation`); **U** = user only (`disable-model-invocation: true`). Checked in each file's frontmatter. "Needs" lists other skills, packages, tokens, MCP servers and services found by reading the file. "none" means none found.

### Matt Pocock, plugin 1.3.1 (licence: MIT, `M/../LICENSE`)

Shared need for most engineering skills: run `setup-matt-pocock-skills` once to create `docs/agents/issue-tracker.md` and label/doc layout (`M/engineering/setup-matt-pocock-skills/SKILL.md`; `code-review` tells the user to run it if the file is missing).

| Skill (folder) | Job | Inv. | Needs |
|---|---|---|---|
| ask-matt (engineering) | Router: which Matt skill fits, in what order | U | none |
| setup-matt-pocock-skills | One-off config of issue tracker, labels, doc layout | U | gh or other tracker |
| grilling (productivity) | The interview primitive: rounds of numbered questions with recommended answers, until no open decisions | M | none |
| grill-me | Stateless wrapper: calls `grilling` | U | grilling |
| grill-with-docs | Wrapper: `grilling` plus `domain-modeling` | U | grilling, domain-modeling |
| domain-modeling | Sharpen domain terms, keep GLOSSARY.md and ADRs | M | none |
| codebase-design | Deep-module vocabulary (module, seam, interface depth) | M | none |
| improve-codebase-architecture | Scan for deepening opportunities, HTML report, then grill | U | codebase-design, grilling |
| to-spec | Turn the conversation into a spec on the tracker | U | tracker |
| to-tickets | Split a plan into tracer-bullet tickets with blocking edges | U | tracker |
| implement | Build one ticket or spec, via tdd and code-review | U | tdd, code-review |
| implement-spec | Run the whole ticket graph with parallel implementer subagents on one integration branch | U | tracker, tdd, code-review |
| tdd | Reference for red-green loop, seams, good tests | M | none (mentions code-review) |
| code-review | Two parallel sub-agent reviews of a diff: repo standards and spec match | M | tracker doc, a spec source |
| diagnosing-bugs | Hard-bug loop: build a tight red-capable feedback loop before theorising | M | none |
| prototype | Throwaway answer to a design question: logic branch (single HTML) or UI branch (variants on one route, `?variant=` plus bottom bar) | M | none |
| research | Delegate reading to a background agent, cited Markdown file | M | none |
| pr | Shape a PR body with minimal visual, evidence, one-way/two-way door | M | credits a third-party `show-me` skill (licence not checked) |
| retro | Session retrospective suggesting environment changes | U | writing-for-agents |
| triage | Move incoming issues through triage roles | U | tracker, grilling |
| wayfinder | Chart a foggy effort as a map of decision tickets | U | tracker, grilling |
| wizard | Generate a bash wizard for human-only steps | M | none |
| handoff (productivity) | Write a handoff doc for another agent | U | none |
| teach | Multi-session teaching workspace (MISSION.md, lessons/*.html, learning records) | U | none |
| to-questionnaire | Turn a question you cannot answer into a questionnaire for someone else | U | none |
| wait-what | Re-pitch the last message in plain English using GLOSSARY terms | U | none |
| writing-for-agents | How to write skills/AGENTS.md/CLAUDE.md for agents | M | none |
| git-guardrails-claude-code (misc) | Install hooks blocking destructive git commands | M | edits Claude Code settings |
| migrate-to-shoehorn | Replace `as` in tests with `@total-typescript/shoehorn` | M | npm package |
| scaffold-exercises | Build course exercise folders | M | `pnpm ai-hero-cli` |
| setup-pre-commit | Husky, lint-staged, Prettier, typecheck, tests | M | npm packages |
| chief-of-staff (in-progress) | Run a long goal by coordinating subagents | U | none |
| claude-handoff (in-progress) | Hand the conversation to a fresh background agent | U | none |
| loop-me (in-progress) | Grill about workflows to build in this workspace | U | none |
| setup-ts-deep-modules (in-progress) | Wire dependency-cruiser for deep modules | U | dependency-cruiser |
| writing-fragments / writing-beats / writing-shape (in-progress) | Three-stage article writing: mine fragments, assemble beats, shape the piece | U | none |

Sources: each `SKILL.md` frontmatter and body under `M/`. `deprecated/` holds only a README. Matt has **no** `technical-writing` skill in 1.3.1 (the ticket's guess); that one is pstack's.

### Emil Kowalski: animation family (`E/`, no licence file in any folder)

| Skill | Job | Inv. | Needs |
|---|---|---|---|
| animate | Course-derived all-in-one guide to deciding and building web motion (CSS, Motion, SVG references) | M | refs: animation-accessibility, -performance, -vocabulary, review-animations |
| emil-animations | Motion for product UI: whether to animate, easing, duration, springs, enter/exit, with a "default to less" stance | M | mentions animate |
| css-animations | CSS-only motion: transitions, keyframes, 3D, clip-path, touch hover | M | none |
| motion-react | Motion for React (`motion/react`) building and debugging | M | animate; the `motion` package |
| gesture-ui | Drag, swipe, sheet interactions that track the finger and stay interruptible | M | animation-accessibility, -performance, debug-animation, pick-ui-library |
| scroll-animations | Scroll reveals and scroll-driven motion, with restraint | M | animate, css-animations, find-animation-opportunities, a11y, perf |
| pick-ui-library | Choose CSS/WAAPI/Motion/GSAP/React Spring or a component library | M | animate |
| animation-performance | Hold frame budget: composite-only properties, off-main-thread | M | animate, animation-accessibility |
| animation-accessibility | Reduced-motion: two variants per animation | M | animate, animation-performance |
| animation-vocabulary | Name an effect from a loose description | M | none |
| debug-animation | Diagnose why an animation feels off before editing | M | animation-performance, -vocabulary, motion-react, review-animations |
| motion-brief | Interview to a motion brief with no blanks, no code written | M | animate, animation-vocabulary, review-animations |
| find-animation-opportunities | Read-only search for the few places motion would help | U | animate, improve-animations, review-animations |
| improve-animations | Read-only audit of a codebase's motion, writes plans for other agents | U | find-animation-opportunities, review-animations |
| review-animations | Review motion code against the craft bar; default is to flag | U | animate, accessibility, performance |
| prototype | Build several different versions of one UI piece behind a visual picker (`PICKER.md`) | U | improve-animations, pick-ui-library, review-animations |

### Emil Kowalski: `emil-*` family and Lapse (`E/`)

| Skill | Job | Inv. | Needs |
|---|---|---|---|
| emil-ask-emil | Router over the emil-* skills with an overlap table and stacking order | U | names ~20 emil-* skills |
| emil-ask-lapse | Answer questions about, and install, the Lapse animation inspector | M | **`@aiforui/lapse`, `lapse-mcp`, `lapse-playwright` from private registry `https://aiforui.dev/npm/`; `AIFORUI_TOKEN`** (user-level npm config, never in project `.npmrc`); optional `claude mcp add lapse -- npx @aiforui/lapse-mcp` (`E/emil-ask-lapse/SKILL.md`, `AGENTS.md`) |
| emil-prototype | Build 3-5 different versions behind a live picker, put numbers on controls, write down picked and rejected, delete the surface | M | applies other emil-* skills to every variant; DialKit (GitHub package, `CONTROLS.md`) suggested for React |
| emil-design-foundations | Hierarchy, spacing, type, color, layout, states, copy as paired do/don't | M | none |
| emil-typography | Fonts, scales, leading, wrapping, truncation | M | none |
| emil-color | OKLCH palettes, contrast (APCA/WCAG), dark mode, Tailwind v4 tokens | M | none |
| emil-surfaces | Shadows, borders, gradients, elevation, dark-mode surfaces | M | emil-ui-polish |
| emil-ui-polish | Invisible finishing details: rendering, layout shift, states, hit areas | M | emil-surfaces |
| emil-component-design | React component API design (composition, compound, controlled) | M | none |
| emil-forms-and-inputs | Forms, buttons, validation timing, submit behaviour | M | none |
| emil-marketing-pages | Landing, blog, docs, changelog surfaces with motion restraint and SEO | M | none directly (router says it pulls in foundation skills) |
| emil-mobile-native | Make a web app feel native on a phone | M | refs animations, forms, performance, touch, prep-for-prod |
| emil-touch-and-accessibility | Tap targets, focus, aria, reduced motion, iOS quirks | M | none |
| emil-performance | Virtualization, preloading, layout stability, keep animation out of renders | M | none |
| emil-ui-review | Review a UI diff, ranked findings; reports, does not fix | M | the building skills as its rubric |
| emil-prep-for-prod | Whole-app pre-launch sweep over nine lanes; fixes what a diff can fix | M | refs ~17 emil-* skills; mentions Lapse as a dev tool to unmount |
| emil-unslop-design | Strip visual AI tells, then put a point of view back | M | none |
| emil-unslop-writing | Strip prose AI tells | M | none |
| emil-unslop-code | Strip code AI tells (narrated comments, try-catch theatre, `as any`) | M | none |
| emil-design-system-docs | Write DESIGN.md/token docs an agent can follow, from the code that exists | M | none |
| emil-design-vocabulary | Exact design terms (index.how/to/articulate) | M | none |
| emil-engineering-vocabulary | Exact frontend-engineering terms | M | none |
| emil-get-creative | Unstuck on a vibe: research the visual language, compress to rules, build a seeded generator | U | emil-build-a-tool, emil-prototype (neighbours) |
| emil-build-a-tool | When prompting for an artifact keeps landing "close", build the tool that produces it with live controls | U | emil-get-creative |
| emil-product-thinking | Interview against 20 principles on whether an idea deserves to exist | U | none |
| emil-borrow-a-brain | Turn a person's public work into a sourced skill | U | web access |
| emil-writing-skills | How to write skill files that change agent behaviour | M | none |

Frontmatter checked for all `E/*/SKILL.md`; the `disable-model-invocation` list came from `grep -l`. Four `emil-*` descriptions (`emil-typography`, `emil-ui-polish`, `emil-unslop-*`, `emil-writing-skills`) are truncated in the session listing but read as model-invocable in their files.

**Lapse check.** Whole-word, case-insensitive grep for `lapse`, `@aiforui`, `lapse-mcp`, `lapse-playwright`, `AIFORUI_TOKEN` across `E/` (excluding `synced/` and `notemaker/scripts/fsrs.py`, where "lapse" is an FSRS memory term, not this package): hits only in `emil-ask-lapse` (SKILL.md, API.md, AGENTS.md, TROUBLESHOOTING.md), `emil-ask-emil/SKILL.md` (routes to it, lines 76 and 90) and `emil-prep-for-prod` (SKILL.md line 66, `baseline.md`, `content-and-leftovers.md`, `motion.md`; named as a dev tool that must not be mounted in production). No other skill needs the token. Whether the token is configured on this machine was not checked.

### Other installed (read from `~/.claude/plugins/installed_plugins.json` and `~/.claude/skills/`)

| Item | What it is | Inv. | Needs / licence |
|---|---|---|---|
| notemaker (`E/notemaker`) | Turn notes and images into one HTML study page with an FSRS review tab | M (frontmatter has no disable flag) | bundled `scripts/fsrs.py`; no licence file checked |
| figma plugin 2.2.127 (14 skills: code-connect, create-new-file, design-to-code, generate-design, generate-diagram, generate-library, generative-plugins, implement-motion, shaders, swiftui, use, use-figjam, use-motion, use-slides) | Work with Figma files and Code Connect | per skill; not individually checked | Figma MCP server and a Figma account (`README.md`, `server.json`); no LICENSE file found in the cache folder |
| warp plugin 2.0.0 | Hooks for Warp terminal notifications; **no skills** | n/a | Warp terminal; no licence file found |
| cache-tax 2.2.1 | Mod that keeps the prompt cache warm; **no skills**; warming costs tokens | n/a | MIT (Karan Bansal, `LICENSE`, `plugin.json`); needs Claude Code 2.1.287+ |
| mattpocock-skills 1.3.1 | See above | | MIT |

**Synced claude.ai skills** (`E/synced/.../manifest.json`, names read from the folder): built-in-browser, chrome-browser, computer-use, deep-research, docs, docx, enthusiastic-yes-outreach, google-workspace, import-memory, morning, notemaker, pdf, pptx, skill-creator, web-animation-design, xlsx. Their folders also include three `source: plugin` entries I did not identify. `skill-creator` and `web-animation-design` are switched **off** by `skillOverrides` in `~/.claude/settings.json`; the others are on. These are Anthropic or claude.ai-managed and outside Friday's choice.

### pstack (`P/pstack`, MIT, version 0.15.23, `plugin.json`)

Almost everything is user-only (`disable-model-invocation: true`); the exception is `setup-pstack` (invocable). The README says `poteto-mode` normally invokes the others as playbook steps need them. One line per skill:

- **Entry and help:** `poteto-mode` (Cursor mode skill: picks one of 23 playbooks and runs the rest), `poteto-help` (guides setup and picks the skill/playbook for a task), `setup-pstack` (choose models per role and budget; writes `~/.cursor/rules/pstack-models.mdc`).
- **Understand:** `how` (explain how a subsystem works), `why` (find design rationale from source control, tickets, docs, chat; discovers whatever MCPs exist), `teach` (runs how + why into one plain explanation), `recall` (rebuild recent working context), `ketchup` (catch-up since your last message), `bro` (restate plainly), `in-your-own-words` (restate the user's goal).
- **Design and build:** `architect` (types and structure before code), `arena` (N parallel candidates, pick a base, graft the best of the others), `swarm` (fan out N workers, one report), `figure-it-out` (design an auditable playbook for big work), `tdd` (only when asked or a cheap test target exists), `typescript-best-practices` (path-scoped to .ts/.tsx), `correct` (make repeated mistakes impossible via structure, types, lint, tests).
- **Review and verify:** `interrogate` (multiple LLM reviewers attack a change), `blast-radius` (what else could break, proved by running code), `benchmark-checklist` (vet a perf number), `create-verification-skill` / `maintain-verification-skill` (project-local skill that drives the app like a user), `show-me-your-work` (decision log for unattended runs).
- **Writing and cleanup:** `unslop` (cut AI tells from writing), `no-comments` (spawn a comment-hunting agent, fix findings), `technical-writing` (Diataxis, Google style, STE).
- **Self-improvement:** `automate-me` (capture working style as a skill), `reflect` (three reviewers over a transcript, route learnings into skill edits).
- **Other:** `make-bot-ui` (UI that wakes a Grok bot over a webhook; needs a webhook sender key, Tailscale optional).
- **Principles (23, `principle-*`):** short rules applied at a trigger, e.g. subtract-before-you-add, laziness-protocol, prove-it-works, exhaust-the-design-space (build 2-3 competing prototypes), experience-first, build-the-lever, never-block-on-the-human, guard-the-context-window, fix-root-causes, test-behavior-not-implementation.
- **Playbooks (23, `P/pstack/skills/poteto-mode/playbooks/`):** investigation, bug-fix, perf-issue, hillclimb, runtime-forensics, trace-forensics, feature, refactoring, **prototype**, visual-parity, authoring-a-skill, eval, babysit, shipping, autonomous-run, orchestrate, autopilot-full, autopilot-stack, session-pickup, pause-safely, multi-phase-plan, worktree-cleanup, opening-a-pr. The prototype playbook: scope the decision, gather references or a moodboard, build throwaway behind one switcher, verify via screenshots, present tradeoffs and a recommendation.
- **Agents:** `comment-sicko`, `poteto-agent`. **Automations:** `benny` (issue triage and reproduce-and-fix; separate setup).
- **Not in pstack:** `deslop`. `poteto-mode` points to `deslop` and `control-ui` in the separate `cursor-team-kit` plugin (MIT, Cursor, `P/cursor-team-kit/LICENSE`). Neither is installed here.
- **Dependencies seen:** Cursor itself (`/add-plugin`, mode skills, `/loop`), named models (`claude-opus-5-5-xhigh`, `grok-4.7-xhigh-fast` defaults in `arena`), `~/.cursor/rules/pstack-models.mdc`. Portability is covered by its own ticket.

## Overlap clusters

One line per member on how it differs.

**1. Prototype / variants (Define work today)**
- Emil `emil-prototype`: model-invocable; 3-5 variants behind a picker in one session, real tokens and worst-case content, live numeric controls, records picked/rejected, then deletes the surface.
- Emil `prototype`: user-only older twin of the above; same picker idea, applies the animation craft bar (easing, transform-only), no decision write-up step.
- Matt `prototype`: two branches, logic (a single HTML file) or UI (variants on the real route via `?variant=`); keeps the prototype on a branch as a primary source.
- pstack prototype playbook: throwaway sketch that includes moodboard gathering first and screenshots of each variant; hands off to Feature.
- pstack `arena`: not a UI prototype; N full candidates built in separate worktrees by different models, then grafted. Closest to the glossary's Divergent work and Fleet, but Cursor-model-bound.
- `emil-get-creative` and `emil-build-a-tool` sit next to it for the case where the Direction is not yet known (Discover) rather than comparing known ones.

**2. Routers**
- `ask-matt`: user-only; maps Matt's flows (idea to ship, on-ramps, standalone).
- `emil-ask-emil`: user-only; routes by phase and material, has an overlaps table; says it does not cover backend, data fetching, state, build tooling or testing. It omits the unslop skills, get-creative and build-a-tool from its lists.
- `poteto-help`: pstack setup plus picking a skill, playbook or principle.
- `poteto-mode`: not a help router, but it is pstack's actual dispatcher (task to playbook).

**3. animate vs emil-animations (and the motion siblings)**
- `animate` (212 lines plus CSS, Framer Motion and SVG reference files): the broad course-derived builder; replies with a fixed greeting when invoked without a question.
- `emil-animations` (126 lines plus patterns and techniques): product-UI focus with decision frameworks, "Should this animate at all?", match the project's stack.
- `css-animations`, `motion-react`, `gesture-ui`, `scroll-animations`: deeper per-technique slices of what `animate` covers broadly.
- `animation-performance` vs `emil-performance`; `animation-accessibility` vs `emil-touch-and-accessibility`: the motion-only version vs the whole-UI version.
- `animation-vocabulary` / `emil-design-vocabulary` / `emil-engineering-vocabulary`: three glossaries (motion, visual, behaviour).

**4. Unslop family**
- `emil-unslop-design`: visual tells, then restore a point of view.
- `emil-unslop-writing`: prose tells.
- `emil-unslop-code`: code tells.
- pstack `unslop`: writing only (the poteto-mode text uses it for every prose surface).
- `deslop` (cursor-team-kit, not pstack, not installed): code slop in the diff against main.
- pstack `no-comments`: one slice of code unslop (comments), via a spawned agent.

**5. Reviewers**
- `emil-ui-review`: UI diff, ranked findings, reports only.
- `review-animations` (user-only): motion code only, default is to flag.
- `improve-animations`: codebase-wide motion audit that writes plans, read-only.
- `emil-prep-for-prod`: whole app, nine lanes, also fixes.
- pstack `interrogate`: several LLMs attack a change from independent angles; any code, not UI-specific.
- pstack `blast-radius`: what else breaks; proves with running code.
- Matt `code-review`: two sub-agents, repo standards and spec match; needs the tracker doc.

**6. Interview / decide**
- Matt `grilling` (and `grill-me`, `grill-with-docs`): generic design-tree interview in numbered rounds; the `grill-with-docs` form also keeps GLOSSARY.md.
- Emil `motion-brief`: same shape for one animation, one question at a time, ends in a brief and writes no code. It duplicates the grilling idea for motion only, with the rule "never ask for a number the user cannot feel".
- Emil `emil-product-thinking`: interview on whether the idea should exist.
- Matt `wayfinder`, `loop-me`, `to-questionnaire`: also interview-shaped, for planning, workflows and asking others.

**7. Restate / re-pitch**
- Matt `wait-what`, pstack `bro`, pstack `in-your-own-words` (restates the user's goal, the reverse direction), pstack `ketchup` (catch-up with visuals).

**8. Teach**
- Matt `teach`: multi-session learning workspace with a mission, lessons, reference sheets and learning records.
- pstack `teach`: one plain explanation of a change or subsystem, built from `how` and `why`.
- `notemaker`: study page with spaced-repetition review from notes you supply.

**9. TDD**
- Matt `tdd`: model-invocable; seams agreed with you first, behaviour through public interfaces.
- pstack `tdd`: user-only; applies only when asked or when a cheap test exists, and says to skip otherwise.

**10. Writing**
- Docs and prose: pstack `technical-writing` (structure standard), `emil-unslop-writing`, pstack `unslop`.
- Writing for agents / skills: Matt `writing-for-agents`, `emil-writing-skills`, pstack `authoring-a-skill` playbook and `automate-me`.
- Articles: Matt `writing-fragments`/`-beats`/`-shape`.

**11. Handoff and context**
- Matt `handoff`, `claude-handoff`; pstack `recall`, `session-pickup`, `pause-safely`; the PHASE-BOUNDARIES rules in `ask-matt`.

**12. Debugging**
- Matt `diagnosing-bugs` (feedback loop first), `debug-animation` (motion), pstack `principle-fix-root-causes`, `bug-fix` playbook, forensics playbooks.

**13. Skill writing**
- `emil-writing-skills`, Matt `writing-for-agents`, pstack `authoring-a-skill`/`eval` playbooks, claude.ai `skill-creator` (switched off).

**14. Spec and tickets**
- Matt `to-spec`/`to-tickets`/`implement`/`implement-spec`/`wayfinder`; pstack `multi-phase-plan`, `orchestrate`, `autopilot-*` playbooks; the repo's own map. These overlap with Friday's own entry command and playbooks.

**15. Make-a-tool**
- `emil-build-a-tool`, pstack `principle-build-the-lever` (build the codemod or script instead of working by hand).

**16. Naming terms**
- `animation-vocabulary`, `emil-design-vocabulary`, `emil-engineering-vocabulary`, Matt `domain-modeling` (project terms), `codebase-design` (module terms).

## Gap list

Against Friday's process in `GLOSSARY.md` and the ticket's technique list.

**Discover (ends at the Direction gate)**
- T1 seed strings: no skill. Nearest: `emil-get-creative` (research a vibe into rules and a generator) and the pstack prototype playbook's moodboard step.
- T2 ambitious prompts and idea lists, refine: no skill that produces a list of many Directions and narrows it. `grilling` and `motion-brief` interview but do not generate options. `principle-exhaust-the-design-space` says to build 2-3 competing prototypes but is a rule, not a process.
- Write the build prompt from a chosen Direction: none.
- The Direction gate itself (present 3-4 Directions for Somya's pick): none.

**Define (ends at the Variant gate)**
- T3 critic loop (agent critiques a screenshot against the brief and revises): none. Reviewers exist (cluster 5) but they review code, not rendered output in a loop. pstack `visual-parity` and `control-ui` (cursor-team-kit, not installed) are the nearest.
- T4 image generation, T5 video generation: no skill, and no image or video generation tool among the installed plugins. (Pencil and Figma tools exist in this environment but are design-file editors, not generators; I did not assess them for this.)
- Each Direction built as a Variant in parallel: partial. `emil-prototype`, Matt `prototype` and the Emil `prototype` build variants inside one session behind a picker. pstack `arena`/`swarm` run parallel workers but depend on Cursor models. No installed skill gives each Direction its own agent in its own worktree (a Fleet), and none returns the artifact the Variant gate needs.
- The Variant gate (side by side compare, pick one or combine): only the in-page picker. Nothing handles comparing separately running Variants.

**Deliver (ends at the Ship gate)**
- T6 cut what adds no value: only for code (`principle-subtract-before-you-add`, `principle-laziness-protocol`); for UI, `emil-unslop-design` and `emil-ui-polish` are the closest.
- T7 remove AI tells: covered (`emil-unslop-design`, `-writing`, `-code`).
- Polish: well covered (`emil-ui-polish`, surfaces, typography, color, animations, touch).
- Write down the Design language: mostly covered by `emil-design-system-docs` (writes DESIGN.md from existing code). It documents components and tokens; whether it captures motion rules was not checked. Matt `domain-modeling` records terms, not visual rules.
- The Ship gate (visual sign-off before merge): none. `emil-prep-for-prod` and Matt `pr` are adjacent.

**Everyday building**
- Stated out of scope by `emil-ask-emil`: backend logic, data fetching, state management, build tooling and testing.
- Matt covers test-first, bug diagnosis, architecture and PRs; pstack adds verification skills.
- No installed skill for driving a browser to verify UI (the pstack one depends on `cursor-team-kit`), for worktree and Fleet management (pstack `worktree-cleanup`/`orchestrate` are playbooks, not installed as skills), for deployment, CI or dependency upkeep.

## Terms findings

- **animations.dev.** Fetched 2026-10-13: `https://animations.dev/terms` and `/license` return 404. The home page has no legal links; its footer is only "animations.dev by Emil Kowalski". What it does state: a refund at any time by email, team licences via `/team` ("Every member will receive full access"), a PPP code restricts access to the purchase country, and "Skill file ... is included in the 'Animations and AI' lesson at no extra charge" with no statement of how it may be used.
- **aiforui.dev.** `/terms` returns 404; the home page (waitlist form, login, and a link to Emil's X profile) has no legal text. The registry notes live only inside the installed `emil-ask-lapse` skill.
- **Public repo.** `github.com/emilkowalski/skills` is MIT (Copyright 2026 Emil Kowalski; GitHub licence API reports `mit`). It lists 15 skills: animate-expo, animate, animation-performance, animation-vocabulary, apple-design, ask-sonner, break-ui, emil-design-eng, find-animation-opportunities, improve-animations, mobile-native, pick-ui-library, prototype, review-animations, write-swift. Eight of those names are also installed (animate, animation-performance, animation-vocabulary, find-animation-opportunities, improve-animations, pick-ui-library, prototype, review-animations). I compared two installed copies with the public ones: `prototype` and `review-animations` differ (the installed `prototype` drops the fixed-greeting section; the installed `review-animations` describes itself as derived from the animations.dev course rather than Emil's philosophy). `animate`, and the rest, were not compared. The remaining installed skills (`css-animations`, `motion-react`, `gesture-ui`, `scroll-animations`, `debug-animation`, `motion-brief`, and the `emil-*` family) are not in the public repo, so the MIT grant does not obviously cover them.
- **What can be said:** there is no published term I could find that allows or forbids private modification or personal use of the paid skills. The map's note that they are paid course content is consistent with the above. The MIT repo shows Emil's intent for the public subset only. A minimal safe stance is: use them privately on your own machines and projects, do not commit them into public repos, and email the address on the course page if Friday needs to fork them.
- **Not found:** any clause on AI or LLM use of course material, on modifying skills, or on seat limits for skill files.
- **Matt Pocock and pstack:** MIT; see the short answer. `cache-tax`: MIT.

## Sources

Local, read 2026-10-13: `~/.claude/plugins/installed_plugins.json`; `~/.claude/settings.json` (`skillOverrides`); `~/.claude/plugins/cache/mattpocock/mattpocock-skills/1.3.1/` (`LICENSE`, every `skills/*/*/SKILL.md`, `engineering/ask-matt/SKILL.md`, `engineering/prototype/{SKILL,UI}.md`, `engineering/code-review/SKILL.md`, `productivity/grilling/SKILL.md`); `~/.claude/skills/*/SKILL.md` and `emil-ask-lapse/{SKILL,API,AGENTS,TROUBLESHOOTING}.md`, `emil-ask-emil/SKILL.md`, `emil-prototype/*.md`; `~/.claude/skills/synced/*/manifest.json`; `~/.claude/plugins/cache/claude-plugins-official/figma/2.2.127/`; `~/.claude/plugins/cache/claude-code-mods/cache-tax/2.2.1/{LICENSE,.claude-plugin/plugin.json}`; `~/.claude/plugins/cache/claude-code-warp/warp/2.0.0/`.

Web, read 2026-10-13: https://github.com/cursor/plugins (shallow clone; `pstack/{LICENSE,plugin.json,README.md,skills/,docs/guide/}`, `cursor-team-kit/{LICENSE,skills/deslop}`); https://github.com/emilkowalski/skills (LICENSE, README, `skills/` listing via `gh api`); https://animations.dev and https://animations.dev/team; https://animations.dev/terms and /license (404); https://aiforui.dev and https://aiforui.dev/terms (404).

**Could not verify:** the licence of the installed Emil skills; whether `AIFORUI_TOKEN` is set on this machine; the licence of figma and warp plugin contents; the licence of Dex Horthy's upstream `show-me`; per-skill invocation flags for the 14 figma skills; whether `emil-design-system-docs` covers motion rules; the three unidentified plugin-sourced synced skills.

# Surface: Friday's homepage

PROTOTYPE, throwaway. Hand run of Discover for [What does Discover produce when one real Surface runs through it by hand?](https://github.com/somyanath/friday/issues/21). This file is the brief every Discover agent receives. Somya confirmed it on 2026-10-24, with cost removed from the messages.

## What it is

A one-page homepage that presents Friday, Somya's personal agent workflow. It would live in Somya's public portfolio monorepo. Its look is open: it must be clearly different from the portfolio's current design system, which is neutral greys and indigo-700 as the brand colour on white, Noto Sans, and small rounded corners (4 to 12px).

## Who it's for

Potential employers: hiring managers and engineering leads who skim, arriving from Somya's portfolio or CV.

## What it must say, by weight

1. **Somya has good taste.** The page itself is the proof. Its craft argues this more than any sentence on it can.
2. **Somya builds the tools their own workflow needs.** Friday is the evidence: Somya looked at what exists, kept what was good, and built the missing parts.
3. **Somya can speed up a team's workflow.** The same skill, pointed outward. The page has to make that jump for the reader.

## What Friday is (write as if it works; the page ships once it does)

Friday is a set of skills, playbooks and rules that turns Claude Code into a full workflow for building UI-heavy products with coding agents. It installs into each project, and the project's own rules always win.

- **One command starts anything.** `/friday <task>` reads the task, decides what kind of work it is (UI or not; a new Surface or a Refinement; new behaviour, bug, performance, refactor, question), shows that route in one line, and restates the goal in its own words before any code is written.
- **Three gates where taste matters.** For UI work, Somya decides at three points and nowhere else:
  - **Direction gate:** many genuinely different design ideas are generated and narrowed; Somya picks three or four.
  - **Variant gate:** each picked idea is built for real by its own agent, in parallel, and Somya compares them running, side by side, without knowing which model built which. A shortlist after generated images, then a final pick after each finalist gets generated motion.
  - **Ship gate:** a visual sign-off before it merges.
- **Two model families check each other.** Claude orchestrates. Two of the four Variants are built by Claude, two by GPT through Codex, and each is critiqued by the other family: a critic sees only screenshots, in a fresh context, and sends the work back until it passes.
- **Taste is built in, not bolted on.** Seed strings force genuinely different directions (agents left alone produce the same page four times). Design craft skills from Emil Kowalski lead every UI step. Generated images add personality; generated video adds motion. Known AI tells are stripped out.
- **Everything else runs on its own, and proves itself.** Non-UI work (backend, data, tooling) needs no gate. An agent that didn't write the code checks it on the real running app; the other model family gives a verdict on the exact commit; then it merges, as far as the project's autonomy level allows. A short always-pause list (deploys, deleting data, force-pushes, merging anything a user sees) always stops for Somya. GitHub enforces these rules, not instructions an agent could ignore.
- **Curated, not collected.** Friday is built from three respected skill collections (Matt Pocock's skills, Cursor's pstack, Emil Kowalski's design skills). Every one of their 162 pieces got a ruling: keep, cut, merge or replace.

## Why Somya built it

Somya builds UI-heavy side projects and portfolio work with coding agents. Out of the box, agents give the same safe, generic page every time, and running more of them in parallel gives more output, not better output. Friday exists to get taste and trust at once: many genuinely different ideas, a human choosing at the moments taste matters, and everything else proven before it moves on.

## Why Friday over other orchestrators

Superset, Conductor, Cursor's background agents and Claude Code's own parallel sessions are cockpits: they run many agents at once and show their windows. None of them decides what the agents should build, puts live Variants side by side for a human to pick, or makes agents prove their work before it moves on. Friday is the process on top of the cockpit: it decides what the agents run, when they stop for a human, and how their work is proven.

## Fixed constraints

- **The ending is contact.** The reader's last action is to reach Somya (email or LinkedIn), framed around helping their team's workflow.
- **Friday's repo is private.** No "view on GitHub", no Friday source files or file listings on the page.
- **Don't mention cost or pricing.**
- **One page**, working on desktop and phone.
- **Avoid the AI tells:** generic compositions (centred hero, three feature cards, logo strip), perfect symmetry, a stock look and feel, over-styling, noisy details or clutter. Also avoid the portfolio's current neutral-and-indigo look.

# `friday-pr`

**Status:** decided (2026-10-28) in [What do friday-implement, friday-tdd and friday-pr do, from ticket to ready PR?](https://github.com/somyanath/friday/issues/23). Nothing here is built yet.

**What it is:**

- A Reference skill (ADR-0009) that opens a pull request and writes its title and body.
- Who starts it:
  - `friday-implement` calls it;
  - so do the design skill's Refinement path and Deliver;
  - Claude may start it on its own when it fits.
- After the PR opens, `friday-implement`'s [PR stage](friday-implement.md#pr-stage-pr-stagemd) drives it to a Ready PR.

**Built from** (ADR-0002, [skill rulings](skill-rulings.md#friday-pr)):

| Upstream | Piece | What Friday takes |
|---|---|---|
| Matt | `pr`, with `CREDITS.md` | The one-visual menu, before-and-after evidence, Merge Danger (door and blast radius) |
| pstack | `opening-a-pr` playbook | The sections, the one-minute length cap, Conventional Commits titles, opening ready, `pstack-technical-writing` then `pstack-unslop` on PR text |

## Frontmatter

```yaml
---
name: friday-pr
description: Open a pull request, or write or edit its title and body.
metadata:
  upstreams:
    - mattpocock-skills v1.3.1: engineering/pr
    - pstack 88d4751: poteto-mode/playbooks/opening-a-pr
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---
```

- **Credits:** keeps Matt's `CREDITS.md`, since the visuals menu is copied from humanlayer's `show-me` (Apache 2.0).
- **Provenance** format and licence notices: [How are owned copies made and kept current?](https://github.com/somyanath/friday/issues/30)

## When it opens a PR

- **Only after the Live check passes:** the Builder's production-build Live check in [`friday-implement`](friday-implement.md#one-ticket-branch-skillmd).
- **Ready, never draft.** `gh pr create` without `--draft`, under the Agent account (ADR-0007).
- **Opening a PR doesn't start the PR stage by itself.** The Playbook that called `friday-pr` runs it next.

## Title and commits

- **Commits:** small, made as the work goes, and never reshaped before review. Merges are squash only (ADR-0007), so GitHub folds the whole PR into one commit and the order inside it is thrown away.
- **The PR title is a Conventional Commits title,** because it becomes that one commit on `main`: `type(scope): subject`, with no trailing period.
  - **Type:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore` or `perf`.
  - **Scope:** the area changed.
  - **Subject:** short and imperative, naming a real symbol when one carries the change.

## Body

```markdown
## Why
1–3 sentences: the problem and the approach.

## What changed
<one visual from the menu, only if it helps>
- 1–3 bullets

## Scope
- what it covers; what it leaves out

## Tradeoffs
<only rejected alternatives a reviewer would ask about>

## Merge Danger
**Door:** one-way or two-way, and why.
**Blast radius:** one word, then what it touches.

## Evidence
- **Finish condition:** `<command>` fails at base, passes at head
- **Before → after:** failing → passing test, or Live check screenshots

Closes #<issue>
```

- **Sections:**
  - **Always present:** Why, Scope, Merge Danger and Evidence.
  - **What changed:** its visual is optional.
  - **Tradeoffs:** only when there was a real choice.
- **Where things moved:** pstack's Blast Radius section moves under Merge Danger, and its Verification section under Evidence.
- **Length:** a one-minute read for a reviewer who has the diff, under about 40 lines, because the body becomes the squash commit's message.
- **Words:**
  - short, simple sentences, using `GLOSSARY.md`'s terms where the project has one;
  - written with `pstack-technical-writing`, then `pstack-unslop`;
  - full SHAs, verifier lane lists and file-by-file checklists stay out.
- **The visual menu** (Matt's): pseudocode, a call tree, a component tree, a shallow file tree, Mermaid, a `diff` of a tree or flow, or a whole block when most of it is new. Pick the smallest view that makes the point, and put it next to the text it supports.
- **Merge Danger:**
  - a one-way door can't be walked back, such as a destructive migration;
  - a two-way door is cheap to roll back;
  - the blast radius names what could break.

  The Verifier checks this line (`friday-review`).
- **`Closes #<issue>`** is always the last line, so GitHub closes the job's issue only when the PR merges.
- **A project's own PR template wins.** That's a Rule conflict (ADR-0006): the sections go inside the template.

## Evidence

- **Non-UI work:** the Finish condition at base and at head, the failing and passing test, and the Live check's result in one line.
- **A change a user can see** (Refinements, a Surface's Deliver):
  - screenshots at 1440×900 and 390×844 from the Live check;
  - a screen recording when motion or interaction changed.
- **How files get in:** `gh pr create --attach 'desktop.png#Settings page, desktop'`, repeated per file. `gh pr edit` and `gh pr comment` take it too.
  - Supported: PNG, JPEG, GIF, WebP, SVG, MP4, MOV and WebM, which includes Playwright's videos.
  - Limits: 10 MB per image, and 10 MB per video on Free plans.
  - Needs gh 2.99 or later and write access. Classic tokens work.
  - Build-time check: the Agent account's classic `repo` token can attach.
- **Only public-safe material.** Projects are public, and Live check screenshots show made-up seeded data. A Surface's private notes stay in its gate folder ([design skill](design-skill.md#ship-gate)).

## Labels

- **Exactly one kind label,** copied from the issue.
- **`ui-work`** whenever the diff touches a Pause path ([entry command](entry-command.md#issue-first), ADR-0007).

## Dropped from pstack's `opening-a-pr`

- its worktree section (Friday's worktrees are Superset workspaces, #12);
- stacks, Origin and forge resolution;
- the built-in PR tool;
- `/deslop` and `/no-comments`. `friday-implement` runs `emil-unslop-code` before the PR, and comments follow each project's own rule.
- rebasing into ordered commits;
- its babysit section, now `friday-implement`'s PR stage.

## Facts found while deciding

- **gh `--attach`** ([changelog, 2026-09-01](https://github.blog/changelog/2026-09-01-github-cli-media-in-issues-pull-requests-and-comments); [docs](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli)):
  - "You just need to update `gh` to v2.99.0."
  - Works on `issue` and `pr` `create`, `edit` and `comment`.
  - "PNG, JPEG, GIF, WebP, SVG, MP4, MOV, and WebM are all supported."
  - "10 MB for images and GIFs, 10 MB for video on Free plans, and 100 MB for video on paid plans."
  - Classic tokens work, write access is required, and GitHub Enterprise Server isn't supported.
  - Before this, GitHub had no API for attachments: uploads needed a browser session cookie.
- **Installed gh** on Somya's Mac: 2.90.0. Homebrew has 2.103.3.

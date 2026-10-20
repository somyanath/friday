# Variant gate tool

**Status:** specified, not built (2026-10-20). **Licence when built:** MIT.

A local command that shows several running designs of the same piece of UI side by side, lets the reviewer pin notes to elements, and writes down the pick. It replaces a static gate (a page of screenshots, plus picks typed into a terminal) and nothing else.

## When to build it

Only after the static gate has been used on three Surfaces, and a look-back afterwards names a pain the static gate caused. For example:

- a note couldn't point at the element it meant, so the wrong element was changed;
- switching between one window per Variant made it hard to tell them apart;
- a combination was built from the wrong parts.

If the look-back names none, the static gate stays and this spec waits.

## Terms

- **Surface:** a piece of UI with its own design job, such as a new app, page or landing page.
- **Variant:** one design for a Surface, built for real and running on its own branch, worktree and dev server. Variants are known by letter only (A, B, C, D).
- **Round:** one sitting of the gate. Round 1 shortlists one or two Variants; round 2 picks one Finalist.
- **Finalist:** a shortlisted Variant built with one of its two videos. Round 2 compares 2 or 4 of them.
- **Combination:** a round-1 pick made of a base Variant plus named parts taken from others.
- **Handoff:** the file the caller writes for a round, with one entry per Variant or Finalist.
- **Gate record:** the file the tool writes back: the reviewer's picks and notes.
- **Element note:** a note pinned to one element of a running Variant, saved with enough to find that element again.
- **Caller:** whatever produced the Variants and runs the tool.

## Requires

**Superset.** Every Variant runs in its own Superset workspace, with its dev server started by that workspace's run script. Other hosts are not supported.

## Interface

`<tool> <round-folder>`

- Serves the comparison page on `127.0.0.1` and opens it in the default browser.
- Exits with code 0 once the Gate record is written.
- If the reviewer quits without writing it, exits non-zero, writes no Gate record, and keeps the drafts.

## What it reads

The Handoff in the round folder and the files the Handoff references. Nothing else: the caller may keep its own files in the same folder, and the tool ignores them.

**Per Variant (round 1):**

| Field | Contents |
|---|---|
| Identity | Letter, branch, exact commit. The Variant is frozen during the gate: nothing new is committed. |
| Running it | Worktree path, Superset workspace, port, run command, URL of each route to view |
| Brief | The design brief the Variant was built from |
| Write-up | The builder's own, 150 words at most: what it built, where it departed from the brief and why, what's unfinished |
| Screenshots | Each route at 1440×900 and 390×844, first screen and full page, the same sizes for every Variant |
| Images | The generated images it uses |
| Checks | The result of a check on the running app. The review loop: passed, or stopped at its round cap, with the open points. No scores, and no reviewer identity. |

**Per Finalist (round 2):** the same, plus the prompt used to generate its video, and the clip.

## What it writes

Only into the round folder: draft notes and element crops as the reviewer works, then the Gate record.

**Gate record:**

| Round | Holds |
|---|---|
| 1, shortlist | One or two picks, each a Variant or a combination; notes per pick; an optional one-line reason per Variant not picked; the commit judged for each Variant. Or a "none" outcome with notes on what's missing. |
| 2, final pick | One Finalist and notes for the next step; optional reasons for the others. Or "none". No combining: anything borrowed from another Finalist goes in the notes. |

- **A note** is page-level, or an element note.
- **An element note** saves the letter, route, viewport size, a selector, the element's visible text, its position on the page, a crop of it (optional, see the first spike), and the reviewer's words.
- **A combination** is a base Variant plus parts, and each part is an element note on another Variant marked "take this". For example: base C; take A's hero heading; take B's pricing cards.
- **The Gate record says nothing about who built each Variant.** The tool never knows.

## The live view

- **Grid:** every Variant at once, each scaled to fit. Two sizes, swapped with one key:
  - desktop, 1440×900, 2×2 at about half scale;
  - mobile, 390×844, one column each at full size.
- **Focus:** click one to see it full size.
- **Flip:** one frame, with keys 1–4 swapping which Variant shows in place.
- **Same route everywhere:** going to `/pricing` in one takes them all there.
- **Synced scroll:** a toggle, off by default, because the designs differ in length.
- **A dead dev server:** that frame says it's down, shows the Variant's static screenshots, and offers Restart, which re-runs the dev server inside that Variant's Superset workspace.
- **Commit check:** on start, the tool compares each worktree's checked-out commit with its Handoff's, and warns if one differs.
- **Element picking:** a small local proxy sits in front of each Variant. It injects a picker script into the Variant's HTML and strips headers that block framing, so nothing changes in the project and any framework works.

## Beside each Variant

- Its brief, write-up and check results. A Finalist also shows its video prompt; the clip itself plays inside the running Variant.
- **Letters only:** no branch names, worktree paths or workspace names, so nothing tells the reviewer who built it.

## Picking

- **A pick panel per round,** offering that round's outcomes from the Gate record table.
- **Notes save to the round folder as they're written,** so a reload or crash loses nothing.
- **"Write record"** writes the Gate record and closes the tool.
- **Running it again** reloads the saved notes, to change a decision.

## Hard rules

- **Local only:** it serves on `127.0.0.1`, sends no telemetry, uploads nothing, and makes no network calls beyond the Variants on localhost.
- **Reads** only the Handoff and what it references.
- **Writes** only into the round folder.
- **Changes nothing else:** it never creates, deletes or changes workspaces, branches or commits, never starts or messages agents, and never pushes or merges. Its one action outside the round folder is restarting a dead dev server inside its own Superset workspace.
- **Blind:** it shows letters only and knows nothing about who built what.

## Out of scope

- Other gates, such as choosing which designs to build or the final sign-off before merge.
- Starting Variants, and cleaning up after the pick: the caller does both, because what to clean up depends on the outcome.
- Hosts other than Superset.
- Sharing or hosting the comparison page.

## First spike, before building

- Live reload through the proxy (its websocket).
- Redirects to absolute URLs that bypass the proxy.
- Capturing an element's crop from a framed page on another origin. If it's costly, element notes go without crops; the selector, text and position still find the element.
- Restarting a dev server through Superset's CLI. The run button has no documented CLI command; `superset terminals send` can re-run the run command.
- Four live dev servers and four framed pages at once on a laptop.

## Left to the build

The name and the code stack.

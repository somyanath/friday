---
status: accepted
---

# Each ticket in a Ticket graph runs as its own Fleet session and merges as its own PR

When Friday works a Ticket graph, each ready ticket runs in its own Fleet session, a Superset workspace started with `/friday #<ticket>`, and reaches `main` as its own PR with its own Live check and Verdict. Friday drops the two halves of Matt Pocock's `implement-spec` that a reader would expect: implementer subagents inside one coordinating session, and one integration branch merged as one PR. A subagent's worktree has no port block for a Live check and no Route, so a UI ticket would skip the design skill. One integration branch would put a whole spec behind one Verdict, while Friday's merge conditions are per PR (ADR-0004). The graph loop lives in `friday-implement` and runs at every Autonomy level, where only merging changes; `friday-unattended-run` calls it instead of keeping its own. Both upstreams keep one many-PR loop apart from the single-item steps and let the human hold the merge: Matt's `implement-spec` beside `implement`, pstack's autopilots beside `feature`. Decided in "What do friday-implement, friday-tdd and friday-pr do, from ticket to ready PR?" (somyanath/friday#23, 2026-10-28); detailed in `docs/specs/friday-implement.md`.

## Consequences

- The coordinating session merges every ticket's PR, one at a time. A PR that falls behind `main` goes back to its own session to rebase, since a branch has one writer.
- No review sees parallel tickets together before they merge. Once the last ticket merges, the coordinating session runs a final check on `main`:
  - every ticket's Finish condition and Live check, and the full Feature map;
  - one Sol review of the graph's merged commits, judging only how the tickets fit together.

  Defects become bug tickets, and cleanup findings go to Somya.
- At most 3 tickets run at once, the cap for Fleets other than Define.
- `friday-to-tickets` adds a blocking link between two tickets that touch the same shared file.

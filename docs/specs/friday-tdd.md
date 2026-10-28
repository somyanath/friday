# `friday-tdd`

**Status:** decided (2026-10-28) in [What do friday-implement, friday-tdd and friday-pr do, from ticket to ready PR?](https://github.com/somyanath/friday/issues/23). Nothing here is built yet.

**What it is:**

- A Reference skill (ADR-0009): the know-how for writing tests first, not a process run on its own.
- Who starts it:
  - `friday-implement` and `friday-debugging` call it;
  - the design skill's Refinement path calls it for logic;
  - Claude may start it on its own when it fits.

**Built from** (ADR-0002, [skill rulings](skill-rulings.md#friday-tdd)):

| Upstream | Piece | What Friday takes |
|---|---|---|
| Matt | `tdd`, with `tests.md` and `mocking.md` | The red-green loop one test at a time, seams, mocking only at system boundaries, the anti-patterns, no refactor step |
| pstack | `tdd` | The skip gate, the guards, before-and-after evidence in the reply |
| pstack | `principle-test-behavior-not-implementation` | The two imagined edits; expected values come from the requirement |

## Frontmatter

```yaml
---
name: friday-tdd
description: Test-first red-green loop at agreed seams, for features and bug fixes. Use when writing code that changes behaviour, adding a regression test, or judging whether a test is worth writing.
metadata:
  upstreams:
    - mattpocock-skills v1.3.1: engineering/tdd
    - pstack 88d4751: skills/tdd, skills/principle-test-behavior-not-implementation
---
```

- **Open to Claude,** with a broad description, as Matt's is. Test-first at seams is Friday's default for code that changes behaviour, and the skip gate covers tests that aren't worth writing. pstack's version is user-only and covers bug fixes only.
- **Codex:** no `agents/openai.yaml` policy, so Codex may start it too.
- **Provenance** format and licence notices: [How are owned copies made and kept current?](https://github.com/somyanath/friday/issues/30)
- **Skill folder:**

  ```
  friday-tdd/
    SKILL.md      the loop, seams, skip gate, guards, reply
    tests.md      good and bad tests, with the two imagined edits
    mocking.md    when and how to mock
  ```

## The loop

- **One slice at a time:** one seam, one failing test, then just enough code to pass it. Repeat, each test a tracer bullet that answers to what the last cycle taught.
- **Red before green.** No code ahead of a failing test, and no features a test doesn't ask for.
- **No refactor step.** Refactoring belongs to review (`friday-review`) or to `friday-implement`'s refactor branch.
- **Browser tests never come first.** The Live check is the end-to-end proof; this loop works at the code's own seams.
- **Vocabulary** for interfaces and seams comes from `matt-codebase-design`, called when the shape of an interface is itself in question.

## Seams

A seam is the public boundary a test works through, where behaviour can be seen without reaching inside.

- **From the ticket:** agreed with Somya at `matt-to-spec` or in the grilling.
- **Run directly, with no seams in the ticket:** it asks Somya "what's the public interface, and which seams should we test?", and writes no test at an unconfirmed seam.
- **In an Unattended run with no seams:** the agent picks them and records them in the Decision trail, and the Verifier checks them.

## Skip gate

- **Skip a test that would be impractical:** one that needs broad harness setup, brittle mocks, slow end-to-end infrastructure, production-only state, vague reproduction steps, or large unrelated fixture changes.
- **Use the closest runnable check instead:** a targeted script, a command, or a focused integration check.
- **No test beats a bad test.** A bad test mostly tests mocks, encodes the current implementation, depends on timing or global state, or would be deleted right after proving the fix.
- The same gate answers whether a change is worth the loop at all.

## Guards on every test

- **Confirm it fails for the intended reason** before writing code. A test that passes, or fails for another reason, is fixed first.
- **Never change a test to match a wrong implementation.** Never weaken an assertion unless the expected behaviour changed and the reason is written down.
- **Mock only at system boundaries:** outside APIs, sometimes the database, time and randomness, sometimes the file system. Never mock your own modules.
- **The two imagined edits:**
  - break the behaviour, and the test must fail;
  - change only the internals, and it must still pass.

  A test that fails either is rewritten or deleted.
- **Expected values come from the requirement:** a known literal, a worked example, the spec. Never recompute them the way the code does.
- **Anti-patterns:** tests coupled to the implementation, tautological tests, and horizontal slicing (all tests first, then all code).

## Reply

Before-and-after evidence, not only the outcome:

- the test or check that failed before, and the failure it gave;
- the passing run after, and any nearby checks run;
- when a failing-before couldn't be shown, why, and the closest check used instead.

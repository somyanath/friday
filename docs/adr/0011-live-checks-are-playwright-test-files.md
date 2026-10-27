---
status: accepted
---

# Live checks are Playwright Test files that a script runs, not agent-driven browser tools

Every Live check is a Playwright Test file that the Verification skill's `check` command runs against the Chrome that `launch` started. The script, not the agent, writes the evidence a Verdict rests on: `result.json`, screenshots, a trace and a video.

**Alternatives considered:**

- **Hand-written helpers over the Chrome DevTools Protocol,** with no dependency. In the test they failed twice before passing: a click raced the page's own timer and hit a disabled button. They also missed the browser's own "Failed to load resource" errors, and Friday would have owned a small browser driver forever.
- **A browser MCP server driven by the agent,** with Chrome DevTools MCP tested. It used about 3.7 times Playwright's Codex tokens for less than half the check, then stopped short of saving its screenshot. Each run can differ, and the model writes the result, so a Verdict would rest on the agent's own report.

Playwright passed first time, inside and outside Codex's sandbox. It waits for an element to be actionable right as it acts, and the runner adds retrying checks, both sizes at once, traces and video. Decided in "What does a project's Verification skill hold, and how does each Live check get its data and login?" (somyanath/friday#22, 2026-10-27/28). Detailed in `docs/specs/verification-skill.md`, with evidence on the `research/browser-drivers` branch.

## Consequences

- **Every public project carries a pinned Playwright devDependency.**
  - A project with a root `package.json` holds it there.
  - Any other project holds it in `.agents/package.json`, because hosting platforms pick a project's language from root files. On Heroku's classic stack, a root `package.json` can make a new Python app deploy as Node.
  - A project whose rules forbid it is a Rule conflict (ADR-0006).
- **Codex can't launch Chrome,** so a Claude session runs `launch` and Sol runs `check` attached to that Chrome. Each machine needs Chrome and Playwright's ffmpeg installed outside the sandbox.
- **Attached to a shared Chrome, Playwright's own screenshot option captures other tests' pages,** so the skill's fixture takes screenshots itself.
- **The Feature map gains a test file per feature,** so its tests run without a model: in CI (the `@smoke` set on every PR), on a schedule, and in the maintenance pass. A renamed label breaks a test until the next maintenance pass catches it.
- **Agent-driven browser tools stay open for investigating, not proving.** Chrome DevTools MCP's performance traces, Lighthouse and source-mapped errors are left to `friday-debugging`'s ticket.

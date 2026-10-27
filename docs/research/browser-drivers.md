# How a Verification skill should drive the browser

Research for "What does a project's Verification skill hold, and how does each Live check get its data and login?" (somyanath/friday#22), question Q3. Somya asked for the pros and cons of each option before deciding. Researched and tested 2026-10-27 on Somya's Mac.

**Options compared:**

- **(a) Hand-written helpers over CDP.** No dependencies: Node's built-in `fetch` and `WebSocket` talk the Chrome DevTools Protocol to Chrome.
- **(b) Playwright.** The library (`playwright-core`) drives the installed Chrome, either launched by Playwright or attached to one already running.
- **(c) A browser MCP server.** The agent drives the browser tool by tool. Chrome DevTools MCP was tested as the example.

## Short answer

- All three can do a Live check. They differ in how reliable the check is, who writes its evidence, and what it costs.
- (b) did the check in 28 lines and passed first time, inside and outside Codex's sandbox. Codex used 78,646 input tokens for the whole check at both sizes.
- (a) needed 58 lines and failed twice before passing. It also missed the browser's own "Failed to load resource" console errors, which need another protocol domain turned on.
- (c) took two configuration fixes and still stopped before its screenshot. It used 289,773 Codex input tokens for one screen size: about 3.7 times (b)'s tokens for less than half the work. The model also writes the result, so the evidence is the agent's own report.
- (c) has one real advantage: under `codex exec`, its server started Chrome by itself. (a) and (b) need Chrome started outside Codex's sandbox first. That works and is one more step.

## The test

- **Page:** [`test-page.html`](browser-drivers/test-page.html), a contact form with:
  - an entrance animation;
  - a Send button the page disables for 400 ms soon after load;
  - a request that returns 404;
  - a `console.error` after sending;
  - a hover-only tip and a `(hover: none)` rule.
- **Served by:** `python3 -m http.server` on 127.0.0.1:4290.
- **Browser:** Chrome 156.0.8078.48, started headless with `--remote-debugging-port=4291` and a scratch profile.
- **Scenario at 1440×900 and at 390×844 (DPR 2, mobile and touch):**
  1. fill Name;
  2. click Send;
  3. wait for "Thanks";
  4. take a full-page screenshot with animations settled;
  5. collect console errors, uncaught exceptions and 4xx/5xx responses into `result.json`.
- **Tools:** Node 24.14.0, `playwright-core` 1.64.1, `@playwright/cli` 0.1.22, `chrome-devtools-mcp` 1.12.0, Codex CLI 0.163.0 at `model_reasoning_effort=low`.

| | (a) CDP helpers | (b) Playwright | (c) Chrome DevTools MCP |
|---|---|---|---|
| Script | [`cdp-check.mjs`](browser-drivers/cdp-check.mjs), 58 lines | [`pw-check.mjs`](browser-drivers/pw-check.mjs), 28 lines | none: the model calls tools |
| First run | Failed twice: `Touch points must be between 1 and 16`, then a timeout (see below) | Passed | Failed: "MCP tool call requires approval, but approval policy is never" |
| Outside any sandbox | Passed after two fixes, 2.7 s | Passed, 4.6 s | not run |
| Inside Codex's sandbox (`workspace-write`, network on) | Proven in somyanath/friday#14 (`cdp-shot.mjs`) | Passed, 3.9–4.0 s, attached with `connectOverCDP` | Started Chrome itself. Stopped at the screenshot: path "is not within any of the configured workspace roots" |
| Codex input tokens | not measured | 78,646 (65,152 cached), both sizes, whole check | 289,773 (268,416 cached), one size, stopped before screenshot |
| Caught the 404 | Yes (response event) | Yes (response and console) | not reached |
| Caught "Failed to load resource" console lines | No: they arrive on the `Log` domain, which the script didn't enable | Yes | not reached |
| `(hover: none)` true at 390 | Yes | Yes | Yes (heading showed "touch device") |
| Who writes `result.json` | the script | the script | the model |

**The timeout in (a).** The script waited until the button was enabled and then clicked. That check ran before the page's own timer disabled the button, so the click landed on a disabled button and nothing was sent. It needed a retry loop. Playwright checks that an element is "visible", "stable" (the same box for two animation frames), "enabled" and "receives events" at the moment it acts, and retries until they hold ([actionability](https://playwright.dev/docs/actionability)). It clicked through the same race with no extra code.

**Sticky hover, caught by emulation.** The Playwright screenshot at 390 ([`playwright-390.png`](browser-drivers/playwright-390.png)) shows "hover tip" after the tap on Send. A real phone shows the same, which is the bug `emil-mobile-native` calls sticky hover.

**MCP token cost when idle.** A one-word reply cost 25,939 input tokens both with and without Chrome DevTools MCP configured. So idle MCP tools added nothing in this Codex version. The cost in (c) comes from the turns: each tool call is a model turn that re-reads the conversation.

**Playwright CLI** (`@playwright/cli`, Microsoft's command-line driver for coding agents) failed inside Codex's sandbox. On attach it tries to create `~/Library/Caches/ms-playwright/daemon`, which the sandbox refuses (`EPERM`).

## Facts from the docs

**Playwright**

- `connectOverCDP` "attaches Playwright to an existing browser instance using the Chrome DevTools Protocol". It is "significantly lower fidelity than the Playwright protocol connection" and "only supported for Chromium-based browsers" ([BrowserType](https://playwright.dev/docs/api/class-browsertype)). Nothing the test needed was missing.
- `launch({ channel: 'chrome' })` uses "branded Google Chrome" (same page). Together with `playwright-core` this means no browser download.
- `playwright-core` 1.64.1: 13.7 MB unpacked, needs Node 20 or newer (`npm view`). 2026 saw seven minor releases, from 1.58.0 (2026-01-23) to 1.64.0 (2026-10-07), so about one every six weeks.
- Video comes from `recordVideo` on a context. It is saved when the context closes, and by default is scaled down to fit 800×800 unless `size` is set ([Videos](https://playwright.dev/docs/videos)).
- Playwright also has Python, Java and .NET versions.

**Chrome DevTools MCP** ([README](https://github.com/ChromeDevTools/chrome-devtools-mcp), [tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md), [configuration](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md))

- **60 tools,** among them `emulate` (viewport as `<w>x<h>x<dpr>[,mobile][,touch]`, colour scheme, reduced motion), `take_screenshot` (file, format, full page), `list_console_messages` (with source-mapped stack traces), `list_network_requests`, performance traces, `lighthouse_audit`, heap snapshots and `screencast_start`.
- **Connecting:** it can attach to a running Chrome with `--browserUrl`.
- **Data sent to Google:** usage statistics are on by default (`--no-usage-statistics` to opt out). Performance tools may send trace URLs to the CrUX API (`--no-performance-crux`).
- **File tools:** without MCP roots, they are limited to the OS temp directory unless `--allowUnrestrictedPaths` is set.
- **Its own CLI** (`chrome-devtools`) is also in the package.

**Codex MCP config** ([MCP docs](https://learn.chatgpt.com/docs/extend/mcp?surface=cli))

- `[mcp_servers.<name>]` takes `default_tools_approval_mode` (`auto`, `prompt`, `writes`, `approve`) and per-tool overrides. The test needed `approve` under `codex exec`.
- MCP config can be scoped to a project in `.codex/config.toml`, for trusted projects only.

**Other options seen but not tested:**

- `puppeteer-core` 25.16.0: Google's library, Chrome-focused, no browser download, Node 22.12 or newer.
- `agent-browser` 0.39.4: a "browser automation CLI for AI agents".

## Not verified

- Playwright `recordVideo` over `connectOverCDP`.
- Whether Playwright CLI's daemon folder can be moved into the workspace by a setting.
- (c)'s cost for a complete check. It stopped before the screenshot, so the full cost is higher than measured.
- How (c)'s cost looks in Claude Code. Only Codex was measured.

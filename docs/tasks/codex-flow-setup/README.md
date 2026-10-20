# Codex and Flow setup checks

Test outputs for [Set up Codex and Flow for images, video and critiques](https://github.com/somyanath/friday/issues/14), run on 2026-10-20 from a Claude Code session in auto mode.

- **Machine:** Intel MacBook Pro (i9-9880H), macOS 26.5.2.
- **Codex CLI:** 0.163.0, installed with `brew install --cask codex`, signed in with ChatGPT Plus. It shares `~/.codex` with the ChatGPT app, so it was already signed in.

## Results

| Check | Result | Time | Input tokens (cached) | Output tokens |
|---|---|---|---|---|
| Sol critic call, screenshot attached, read-only | Works | 16 s | 26,918 (13,184) | 210 |
| Astra selected with `-m gpt-6-astra`, same call | Works | 14 s | 26,965 (2,304) | 156 |
| `$imagegen` image, workspace-write | Works once the quarantine flag was removed | 113 s | 142,824 (115,456) | 744 |
| Server on a port inside the sandbox, network off | Fails: `bind` gives `Operation not permitted` | 43 s | 78,167 (64,512) | 642 |
| Same, with `-c 'sandbox_workspace_write.network_access=true'` | Server binds; curl to 127.0.0.1 gets HTTP 200 | 21 s | 77,514 (64,256) | 214 |
| Headless Chrome against that server, with and without `--no-sandbox` | Fails: Chrome aborts at launch (exit 134), no log | 28 s | 77,736 (64,384) | 398 |

The times are the whole `codex exec` run. The token counts come from the `turn.completed` event of `--json`.

**Calls lost before the fix:**

| Call | Input tokens (cached) | Output tokens |
|---|---|---|
| The first `$imagegen` try | 121,001 (103,040) | 556 |
| Two `pwd` probes | 77,349 (64,384) and 83,137 (64,384) | 80 and 82 |
| One `pwd` check after the fix | 51,567 (38,784) | 84 |
| One call wasted on a missing script | 51,542 (38,656) | 128 |

The first four went to the code-mode host failure described below.

## Commands

Critic (Sol, then Astra):

```sh
codex exec -m gpt-6.1-sol -s read-only --skip-git-repo-check --json \
  -i critic-input-1440.png -o verdict.md '<critic prompt>' < /dev/null > events.jsonl
```

Image:

```sh
codex exec -m gpt-6.1-sol -s workspace-write --skip-git-repo-check --json -o final.md \
  '$imagegen Generate one landscape image, 1536x1024: … Save the final PNG into the current working directory as ledgerly-hero.png' < /dev/null
```

The image skill writes to `~/.codex/generated_images/<thread>/` and then copies the file into the working directory.

Sandbox: the model ran [`sandbox-check.sh`](sandbox-check.sh) and [`sandbox-check-chrome.sh`](sandbox-check-chrome.sh) and returned their output verbatim.

## Setup facts

- **Quarantined code-mode host.** Homebrew leaves `com.apple.quarantine` on `bin/codex-code-mode-host`, although `spctl` accepts it as "Notarized Developer ID" (OpenAI OpCo). Every tool call inside `codex exec` routes through that host. While the flag is set, each call times out after 30 s with `timed out negotiating with the code-mode host`, even `pwd`, and calls with no tools still work. Somya removed the flag with `xattr -d com.apple.quarantine …/bin/codex-code-mode-host`; Claude Code's auto mode refuses to do it ("Security Weaken"). This is the known bug in [openai/codex#38816](https://github.com/openai/codex/issues/38816) and [#47521](https://github.com/openai/codex/issues/47521). Every `brew upgrade --cask codex` installs a new, quarantined host.
- **Auto mode and Codex.** Plain `codex` on PATH runs from Claude Code with no allow rule. Auto mode blocks reading `~/.codex/config.toml`, running the copy of Codex inside the ChatGPT app, writing Claude Code's own allow rules, and removing the quarantine flag.
- **The ChatGPT app moves its copy of Codex.** On 2026-10-16 an update moved it from `Resources/codex` to `Resources/codex-cli/`. Friday calls the copy on PATH.
- **MCP servers load on every run.** `codex exec` starts every MCP server in `~/.codex/config.toml`. Here that includes Figma, which logs an auth error each run. A critic call with no tools starts at about 27K input tokens.
- **Hooks warning.** Codex warns that hooks are loaded from both `~/.codex/hooks.json` and `config.toml`. It's harmless, but there should be one source.
- **No limit percentages.** `--json` reports tokens but not limit percentages, and the CLI has no usage command. Limit use is read from Settings → Usage in the ChatGPT app.

## Files

- [`critic-input.html`](critic-input.html) and [`critic-input-1440.png`](critic-input-1440.png): a landing page with deliberate flaws, screenshotted with headless Chrome outside any sandbox.
- [`verdict-sol.md`](verdict-sol.md) and [`verdict-astra.md`](verdict-astra.md): the two critiques. Both score it 3/10, and only Astra flags the competing CTAs.
- [`imagegen-ledgerly-hero.png`](imagegen-ledgerly-hero.png): the `$imagegen` test image at 1536×1024.
- `sandbox-run-*.md`: the verbatim output of each sandbox run.

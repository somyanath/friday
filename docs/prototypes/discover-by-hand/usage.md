# Usage log

Same fields as the usage log in [How does parallel work run day to day?](https://github.com/somyanath/friday/issues/12): date, shape, agents per model, Critic rounds, and Claude's and Codex's 5-hour and weekly percentages before and after.

| Date | Shape | Agents per model | Critic rounds | Claude 5h before → after | Claude weekly before → after | Codex 5h before → after | Codex weekly before → after |
|---|---|---|---|---|---|---|---|
| 2026-10-24 | Discover by hand, Fan-out | (filled at the end) | 0 (none in Discover) | 10% → | 15% → | 0% → | 0% → |

"Before" was read by Somya after the main session had loaded the ticket's background, but before any fan-out.

## Subagent tokens by step

| Step | Agents | Tokens each | Total |
|---|---|---|---|
| Round 1: 4 seeds and 1 idea list | 5 Sonnet | 48.6K to 49.4K | about 245K |
| Round 2: 4 SSoT seeds | 4 Sonnet | 47.7K to 48.1K | about 191K |
| Research per Direction | 4 Sonnet | 54K to 89K | about 271K |
| Outside check | 1 Codex call, GPT-6.1 Sol | 52.2K input (25.5K cached), 393 output | |

Main session (Opus 5.5) tokens are not broken out.

---
status: accepted
---

# Claude Code orchestrates; Codex is called for the other model family

Friday runs every agent from Claude Code on Claude Pro, and reaches GPT only by calling the Codex CLI (`codex exec`, on the ChatGPT Plus sign-in) from inside a Claude Code session, never as a second orchestrator. That keeps fan-outs, fleets, gates and skills in one tool while still giving Friday a second model family within the ₹4,000 monthly cap, which matters because a critic from the builder's own family favours its own work; so every critic comes from the other family. Decided in "Which agent tool and subscription does Friday run on?" (somyanath/friday#8, 2026-10-14).

## Consequences

- Friday's orchestration skills may rely on Claude Code features (subagents with a model and effort, worktree isolation, the Skill tool) and make no promises for other tools.
- Codex sees only skills placed where it reads them (`.agents/skills`), not Claude Code plugins, so a Codex builder needs its knowledge skills installed there.
- Each surface's variants are split evenly across the two families (2 Sonnet 5.5, 2 GPT-6.1 Sol), so both subscriptions' usage limits are spent in every Define phase.

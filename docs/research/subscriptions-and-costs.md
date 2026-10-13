# Subscriptions and generation costs within ₹3000 a month

Ticket #2. All sources read 2026-10-13. Exchange rate used: 1 USD = ₹95.25 (mid-market, xe.com, 10:34 UTC 2026-10-13: https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR). The cap of ₹3000 is about $31.50 at that rate.

## Short answer

What the decision "Which agent tool and subscription does Friday run on?" needs to know:

- **Somya's current ₹2,000 plan is Claude Pro.** Anthropic's India site lists Pro at ₹2,000 a month billed annually, about $21, taxes included (as reported by TechCrunch, a secondary source; Anthropic's own pricing page only shows USD, $17 annual or $20 monthly, tax excluded). Claude Code is included. Max starts at ₹11,999 a month, so it is far outside the cap.
- **Keeping Claude Pro leaves about ₹1,000 a month.** That fits one cheap add-on: Google AI Plus (₹399), ChatGPT Go (₹399), or Cursor Start (₹649, India only, tax inclusive). It does not fit ChatGPT Plus (₹1,999) or Google AI Pro (₹1,950) alongside Claude Pro.
- **The "~$30 tier with Grok Bot" is Premium on "The X Subscription", $30 a month excluding tax.** It bundles Grok, Grok Bot, Cursor and X Premium; announced 2026-10-12 and rolling out. At ₹95.25 it is ₹2,857 before tax, and about ₹3,370 if 18% GST is added (the 18% is my assumption; the sources do not state India tax treatment). It probably breaks the cap once tax is added, and it would replace Claude Pro rather than sit beside it.
- **Grok Bot is a cloud computer-using assistant, not a coding agent.** Its own guide says it hands coding to Cursor cloud agents. Friday does not need it. pstack's `make-bot-ui` skill wakes a Grok Bot through a webhook routine, so that is the same product.
- **Subscriptions beat pay-as-you-go by roughly 10x or more for daily agentic coding.** On my stated assumptions, one hour-long agent session costs about $1.50 to $3 at API rates, so a fleet of 2 to 4 agents for a working day costs more than the whole monthly cap. Pay-as-you-go (OpenRouter, Claude usage credits) suits overflow and generation, not the base.
- **Image and video generation are cheap per surface.** One Define phase (2 or 3 variants, a few images each, one short video for the winner) costs roughly ₹150 to ₹1,100 at API prices, with a typical figure near ₹350. Doing it through API keys on top of Claude Pro fits the remaining ₹1,000, but only one or two surfaces a month at the high end.
- **No provider publishes session counts.** Claude, Cursor and Codex limits are described only as relative multiples or ranges. Somya should measure real usage for a week before the decision closes (see Open questions).

## Glossary note

Terms follow `GLOSSARY.md`. A **Fan-out** is one session spawning subagents; a **Fleet** is several independent sessions in worktrees. The usage numbers below treat both as "N agents running at once".

## 1. Options that fit the cap

Prices in ₹. "Incl." means the source states tax is included. Where the source lists USD ex tax, ₹ is USD x 95.25 and the GST-inclusive figure assumes 18% (assumption, not from a source).

| Option | Monthly price | Tax | Fits cap alone | Claude Code / agent | Generation included |
|---|---|---|---|---|---|
| Claude Pro (current) | ₹2,000 (annual billing) | Incl. per TechCrunch | Yes | Claude Code, Opus, Sonnet, Haiku | None (no image or video generation) |
| Claude Max 5x/20x | from ₹11,999 | Incl. per TechCrunch | No | same, higher limits | None |
| ChatGPT Go | ₹399 | not stated on page | Yes | Limited Codex, GPT-6 Luna | Image generation |
| ChatGPT Plus | ₹1,999 | not stated on page (Storyboard18 says GST incl.) | Yes | Codex web, CLI, IDE; GPT-6.1 Sol, GPT-6 Luna | Image generation (gpt-image-2), counts against Codex limit; no video listed |
| ChatGPT Pro | from ₹10,699 | not stated | No | | |
| Google AI Plus | ₹399 | not stated | Yes | No named coding agent on the page | Gemini image and video generation, 200 Flow credits |
| Google AI Pro | ₹1,950 | not stated | Yes | Gemini 3.1 Pro, higher Jules and Antigravity limits | 1,000 Flow credits, Nano Banana Pro in Flow |
| Google AI Ultra | from ₹6,500 intro | not stated | No | | |
| Cursor Start (India only) | ₹649 | Incl. | Yes | Cursor agent, Cloud Agents, Grok 4.7/4.6/4.5, Composer 2.5 | None. No third-party models, Auto, Automations or on-demand spend |
| Cursor Pro | $20 = ₹1,905 ex tax (about ₹2,248 with 18% GST) | ex tax | Yes | Cursor agent, third-party models at API price | none listed |
| X Subscription Plus | $8 = ₹762 ex tax | ex tax | Yes | Cursor agent, Grok models only; no cloud agents, no Grok Bot | Grok Imagine (images) |
| X Subscription Premium | $30 = ₹2,857 ex tax (about ₹3,372 with 18% GST) | ex tax | Marginal or no | Cloud agents, Bugbot, third-party models at API price (billed separately), Grok Bot | Image and video generation |
| OpenRouter | no subscription; 5.5% fee on credit purchases | n/a | Any budget | Any model, via BYOK or credits | Provider dependent |

Sources: Claude https://claude.com/pricing and https://techcrunch.com/2026/07/13/anthropic-starts-localizing-claude-pricing-for-india-its-biggest-market-after-the-us/ ; ChatGPT https://chatgpt.com/hi-IN/pricing/ (served for India, Hindi) ; Codex https://developers.openai.com/codex/pricing ; Google https://gemini.google/in/subscriptions/ and https://one.google.com/about/google-ai-plans/ ; Cursor Start https://cursor.com/help/account-and-billing/cursor-start and https://cursor.com/docs/account/pricing ; X Subscription https://cursor.com/pricing and https://x.ai/news/x-subscription ; OpenRouter https://openrouter.ai/pricing.

### Combinations that fit ₹3,000

| Combination | Total | Headroom | Notes |
|---|---|---|---|
| Claude Pro + Google AI Plus | ₹2,399 | ₹601 | Keeps Claude Code. Adds Gemini image and video generation inside Flow credits (how many generations 200 credits buys is not on the pages I read). |
| Claude Pro + ChatGPT Go | ₹2,399 | ₹601 | Go has limited Codex and image generation. Weak as a second agent. |
| Claude Pro + Cursor Start | ₹2,649 | ₹351 | Adds a second agent engine (Cursor Cloud Agents on Grok 4.7 or Composer 2.5) for fleets. No generation. Whether Start is still sold to new customers after the X Subscription launch is unverified. |
| Claude Pro + API keys (Gemini or xAI) | ₹2,000 + about ₹1,000 | about ₹1,000 | Pay per image and per second for generation only. See section 4. |
| ChatGPT Plus + Google AI Plus | ₹2,398 | ₹602 | Replaces Claude Code with Codex. Not a keep-current option. |
| ChatGPT Plus alone | ₹1,999 | ₹1,001 | Codex plus gpt-image-2 in one plan. |
| Cursor Pro + Google AI Plus | about ₹2,647 incl. GST (assumed) | about ₹353 | Replaces Claude Code. Cursor Pro may no longer be sold to new sign-ups (see section 2). |

Do not fit: Claude Pro + ChatGPT Plus (₹3,999), Claude Pro + Google AI Pro (₹3,950), Claude Max, X Premium once tax is added.

## 2. Grok Bot and the ~$30 tier

**What it is.** "Grok Bot is an agent with a computer": a personal assistant with a persistent cloud desktop, filesystem, terminal and apps, which you message like a teammate. It runs routines on a schedule or on triggers, and several bots can message each other. It supports the same MCP servers, plugins and skills as Cursor. Source: https://x.ai/bot/guides/grok-bot-101 , https://x.ai/news/introducing-grok-bot , https://forum.cursor.com/t/introducing-grok-bot/168053 (launched 2026-08-11 as an early beta).

**It is not the coding agent.** The same guide says: "Grok Bot is not writing the code. It is creating the same prompts I would, then sending them to a specialized coding harness that lives inside Cursor", and that a bot "starts a Cloud Agent through the Cursor connection". So it is an outer-loop orchestrator for knowledge work and hand-offs. For Friday's Fan-outs and Fleets it adds nothing that Claude Code subagents and worktrees do not already do.

**How it is started.** Download the Grok Bot app (desktop and iOS; x.ai/bot offers a Linux download and says macOS and Windows desktop, while the 2026-08-21 post says macOS only, so platform support is inconsistent between pages), create a bot, then message it. It can also be woken by routines, triggers, other bots, or a webhook routine. Source: https://x.ai/news/grok-bot-more-plans , https://x.ai/bot .

**Webhook link to pstack.** pstack's `make-bot-ui` skill builds a page whose buttons "wake a Grok Bot over a webhook": you create a webhook routine, copy its URL and sender key, and a local server POSTs JSON to it. That is a Grok Bot routine, so the pstack skill is a Grok Bot feature. Source: https://github.com/cursor/plugins/blob/main/pstack/skills/make-bot-ui/SKILL.md . Friday does not need it unless it adopts Grok Bot.

**Which plans include it** (sources disagree by date; the newest is the 2026-10-12 pricing page):
- Newest, https://cursor.com/pricing: the X Subscription Premium ($30), Super ($100) and Ultra ($200), and Teams. Not Free or Plus.
- https://x.ai/bot (read 2026-10-13): also lists Cursor Pro ($20), Pro+ and Ultra, SuperGrok, SuperGrok Plus and Heavy, and Cursor Teams Standard and Premium. Cursor Start is not mentioned, so I treat it as not included (unverified).
- Launch (2026-08-11) was Cursor Ultra, Cursor Teams Premium and SuperGrok Heavy only; widened later. Secondary summaries of those changes are in my search results and I did not use them.

**What it costs.** No separate price. It has weekly usage included with the plan, with extra usage billed by token cost; amounts are not published. https://x.ai/bot FAQ ("Grok Bot subscriptions come with weekly usage included, with additional usage billed based on token cost"). https://x.ai/news/grok-bot-more-plans says Bot usage is separate from Grok and Cursor usage, while the 2026-10-12 pricing FAQ says the shared pool covers "Chat, Imagine, Voice, Bot, and API". Which is current is unverified; the later page is the better bet.

**The $30 tier.** "The X Subscription" (https://x.ai/news/x-subscription , 2026-10-12) merges SuperGrok, Cursor Pro and X Premium. Premium is $30 a month, "4x Plus" usage, and replaces a combined $90 a month. Prices exclude tax and the page does not say how India is taxed. Usage is a pool shared across Grok and Cursor, refreshed weekly. It includes "a generous pool of Grok model usage"; third-party models (Claude, GPT) in Cursor are billed separately at API list price. Existing Cursor subscribers keep old plans, and "the previous plans are no longer available for new sign-ups". Cursor's own FAQ: "We recommend Premium for new AI users, Super for daily agent users, and Ultra for power users" (https://cursor.com/pricing). That puts Somya's fleet-heavy use closer to the $100 tier, which is far over the cap.

## 3. Usage limits in practical terms

No provider publishes a per-plan count of agent sessions. What is published:

| Plan | What the source says | Practical reading (my inference, labelled) |
|---|---|---|
| Claude Pro | Limits reset on a rolling 5-hour window, plus weekly limits. Chat and Claude Code share one pool. "At least 5x more usage per 5-hour session than Free". No fixed message count. Max is 5x or 20x Pro. https://claude.com/pricing , https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan | Parallel agents all draw from the same pool, so N agents consume roughly N times as fast. Expect a Fan-out of 3 to 4 subagents to use up a window quickly on Pro. This is inference; Anthropic gives no numbers. Measure with `/status` and Settings > Usage. |
| Claude Pro, over the limit | Optional usage credits at standard API rates. https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans | Gives a pay-as-you-go safety valve inside the same tool. |
| ChatGPT Plus (Codex) | Local messages per 5-hour period: GPT-6.1 Sol 15 to 160, GPT-6 Sol 15 to 150, GPT-6 Astra 5 to 45, GPT-6 Luna 350 to 3,000. Weekly limits may apply. Image generation uses limits 3 to 5x faster. https://developers.openai.com/codex/pricing | If one session is about 40 messages (my assumption), Sol gives roughly 0.4 to 4 sessions per 5 hours and Luna roughly 9 to 75. Wide ranges because OpenAI says task size matters. |
| ChatGPT Go | "Limited" Codex, GPT-6 Luna in the desktop app. | Not enough for a Fleet. |
| Cursor Premium / Pro | Shared pool refreshed weekly (X Subscription pages) or monthly (older Cursor help page for legacy plans). Premium is 4x Plus; amounts in dollars or tokens are not published. Grok 4.7 costs $2/$0.50/$6 per million tokens (input, cached, output), Composer 2.5 $0.50/$0.20/$2.50. https://cursor.com/docs/models-and-pricing | Composer 2.5 is about 4x cheaper per token than Grok 4.7, so choosing it stretches the pool. Grok 4.5 uses usage about 3x faster than Composer 2.5 on Start. https://cursor.com/help/account-and-billing/cursor-start |
| Cursor Start | Monthly Cursor Models pool only; AI pauses when exhausted. | Single-agent use; no third-party models. |
| Google AI Plus / Pro | Tiered "Limited / Expanded" Jules and Antigravity limits, no exact numbers. https://one.google.com/about/google-ai-plans/ | Not usable for planning a Fleet. |

Monthly view: weekly or 5-hour windows mean a month holds about 4 to 5 weekly allowances, so a plan that fits one heavy day per week does not fit five.

## 4. Image and video generation

All prices are API prices in USD, converted at ₹95.25.

### Per image

| Provider / model | Price per image | ₹ per image | Source |
|---|---|---|---|
| xAI grok-imagine-image | $0.02 | ₹1.9 | https://docs.x.ai/docs/models |
| xAI grok-imagine-image-2.0 | $0.04 | ₹3.8 | same |
| xAI grok-imagine-image-quality | $0.05 | ₹4.8 | same |
| Google Nano Banana 2.1, 1K | $0.0336 | ₹3.2 | https://ai.google.dev/gemini-api/docs/pricing |
| Google Nano Banana 2.1, 2K | $0.0504 | ₹4.8 | same |
| Google Nano Banana 2 (Gemini 3.1 Flash Image), 1K / 2K | $0.067 / $0.101 | ₹6.4 / ₹9.6 | same |
| Google Nano Banana Pro, 1K-2K / 4K | $0.134 / $0.24 | ₹12.8 / ₹22.9 | same |
| OpenAI gpt-image-2 | token priced: image output $30 per 1M tokens, image input $8 per 1M, text input $5 per 1M | per-image figure not on the pages I could read | https://developers.openai.com/api/docs/pricing |

Google's page does not list Imagen separately; the Gemini image models above are what it prices. The gpt-image-2 per-image table on OpenAI's guide did not come through in my fetch, so I give no per-image number rather than guess. Inside ChatGPT Plus, image generation is included and counts against the Codex limit (3 to 5x faster than a normal turn).

### Per second of video (with audio where noted)

| Provider / model | Price per second | ₹ per second | Source |
|---|---|---|---|
| xAI grok-imagine-video-1.5-lite | $0.020 | ₹1.9 | https://docs.x.ai/docs/models |
| xAI grok-imagine-video | $0.050 | ₹4.8 | same |
| xAI grok-imagine-video-1.5 | $0.080 | ₹7.6 | same |
| Google Veo 3.1 Lite, 720p / 1080p | $0.05 / $0.08 | ₹4.8 / ₹7.6 | https://ai.google.dev/gemini-api/docs/pricing |
| Google Veo 3.1 Fast, 720p / 1080p / 4K | $0.10 / $0.12 / $0.30 | ₹9.5 / ₹11.4 / ₹28.6 | same |
| Google Veo 3.1 Standard, 720p-1080p / 4K | $0.40 / $0.60 | ₹38.1 / ₹57.2 | same |
| OpenAI Sora 2 | not verified. Secondary sources report the Sora app ended 2026-04-26 and the API was scheduled to end 2026-09-24. I found no first-party confirmation either way. | n/a | treat as unavailable |

### One Define phase per surface

Assumptions (mine): 3 variants, 4 images each; the cheap path generates each image twice (24 images), the quality path once (12). One short video for the winner only, 8 seconds long (clip length not verified from Google's docs), generated 3 times to get a keeper.

| Path | Images | Video (3 x 8 s) | Total USD | Total ₹ |
|---|---|---|---|---|
| Low: Grok Imagine image ($0.02) + Grok video lite ($0.02/s) | 24 x $0.02 = $0.48 | 24 s x $0.02 = $0.48 | $0.96 | about ₹91 |
| Typical: Nano Banana 2.1 1K ($0.0336) + Veo 3.1 Fast 1080p ($0.12/s) | 24 x $0.0336 = $0.81 | 24 s x $0.12 = $2.88 | $3.69 | about ₹351 |
| High: Nano Banana Pro 2K ($0.134) + Veo 3.1 Standard ($0.40/s) | 12 x $0.134 = $1.61 | 24 s x $0.40 = $9.60 | $11.21 | about ₹1,068 |

So roughly 3 surfaces a month on the typical path (about ₹1,050) fit the ₹1,000 headroom left by Claude Pro, and 2 or more on the low path are negligible. Claude Pro itself does not generate images or video, so a generation source is always a second line item. A Google AI Plus subscription at ₹399 gives 200 Flow credits; how many images or clips that buys is not on the pages I read.

## 5. Pay-as-you-go versus subscription for a typical coding day

**OpenRouter.** No subscription. Inference is billed at the provider's list price; OpenRouter charges 5.5% on credit purchases (Standard). Free models are capped at 50 requests a day (1,000 once you have bought $10 of credits). https://openrouter.ai/pricing . On Cursor individual plans, requests made with your own API key are billed by the provider and do not draw from the plan pools. https://cursor.com/help/models-and-usage/usage-limits .

**Assumptions (mine, not from a source).** One agent session is about one hour, 40 turns, with prompt caching: 2.5M cached-read tokens, 250k uncached or cache-write tokens, 60k output tokens. A working day is 22 per month.

| Model (API list price per 1M tokens) | Cost per session | 1 session a day, month | 10 sessions a day (a Fan-out or Fleet of 3 to 4 for a few hours), month |
|---|---|---|---|
| Claude Sonnet 5.5 ($2 in, $2.50 cache write, $0.10 cache read, $10 out) | about $1.48 | about $33 = ₹3,100 | about $326 = ₹31,000 |
| Claude Opus 5.5 ($4 in, $5 write, $0.20 read, $20 out) | about $2.95 | about $65 = ₹6,200 | about $649 = ₹61,800 |
| Grok 4.7 ($2 in, $0.50 cached, $6 out) | about $2.11 | about $46 = ₹4,400 | about $464 = ₹44,200 |
| Composer 2.5 ($0.50 in, $0.20 cached, $2.50 out) | about $0.78 | about $17 = ₹1,630 | about $172 = ₹16,400 |

Prices: https://claude.com/pricing , https://cursor.com/docs/models-and-pricing . Add 5.5% if bought through OpenRouter.

**Reading.** A single one-hour session a day at API rates already uses the whole ₹3,000 cap on Sonnet, and 10 sessions a day costs roughly 8 to 30 times Claude Pro's monthly price. Subscriptions are the only way to run Fan-outs and Fleets inside the cap, because the subscription absorbs the heavy cache-read cost. The subscriptions cap you with rate limits instead of dollars (section 3). Pay-as-you-go makes sense as an overflow valve: for example Claude Pro usage credits on the one bad day, or generation APIs for image and video. The ratios depend on my token assumptions; a real session may differ by 2x either way.

## Open questions

1. How much real Fan-out headroom Claude Pro gives. Run Friday's heaviest planned flow once and read `/status` and Settings > Usage to see how much of a 5-hour window and a week it takes.
2. Whether the X Subscription is sold in India, in rupees, and with what GST. Nothing I read says. The Cursor Start page shows India is billed in INR via Stripe (UPI, cards) only for Start.
3. Whether Cursor Start is still sold to new customers and whether it includes Grok Bot. Neither page says.
4. Monthly (not annual) INR price for Claude Pro. The ₹2,000 figure is for annual billing per TechCrunch; Anthropic's own page I could read showed only USD. Croma's article (403 to me) reportedly gives different figures. Confirm in Settings > Billing.
5. Whether INR prices for ChatGPT and Google include GST. ChatGPT's page and Google's page do not say; only secondary sources do.
6. gpt-image-2 per-image price and whether Sora still exists.
7. Veo clip length per generation and how many Flow credits a clip or image costs.
8. Model names on these pages (for example Fable 5.1, GPT-6.1 Sol, Grok 4.7) are as published today; lineups change quickly, and GPT-5.5 retires from ChatGPT and Codex on 2026-10-14.

## Sources

All read 2026-10-13.

- Claude plans and API prices: https://claude.com/pricing
- Claude India pricing (secondary, quoting Anthropic's India site): https://techcrunch.com/2026/07/13/anthropic-starts-localizing-claude-pricing-for-india-its-biggest-market-after-the-us/
- Claude Code limits article: https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan
- Claude usage-limit tips: https://support.claude.com/en/articles/9797557-usage-limit-best-practices
- Claude usage credits: https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans
- Claude billing FAQ (no India info): https://support.claude.com/en/articles/8325618-paid-plan-billing-faqs
- Cursor / X Subscription pricing: https://cursor.com/pricing
- The X Subscription announcement (2026-10-12): https://x.ai/news/x-subscription
- Cursor plans and Start (India): https://cursor.com/docs/account/pricing , https://cursor.com/help/account-and-billing/cursor-start
- Cursor usage and limits: https://cursor.com/help/models-and-usage/usage-limits
- Cursor model prices: https://cursor.com/docs/models-and-pricing
- Grok Bot launch: https://x.ai/news/introducing-grok-bot , https://forum.cursor.com/t/introducing-grok-bot/168053
- Grok Bot plans: https://x.ai/bot , https://x.ai/news/grok-bot-more-plans
- Grok Bot guide: https://x.ai/bot/guides/grok-bot-101
- pstack make-bot-ui: https://github.com/cursor/plugins/blob/main/pstack/skills/make-bot-ui/SKILL.md and https://github.com/cursor/plugins/tree/main/pstack
- xAI model, image and video prices: https://docs.x.ai/docs/models
- ChatGPT India prices: https://chatgpt.com/hi-IN/pricing/ (fetched via chatgpt.com/in/pricing/)
- Codex plans, limits, credits: https://developers.openai.com/codex/pricing (redirects to learn.chatgpt.com/docs/pricing)
- ChatGPT image generation: https://learn.chatgpt.com/docs/image-generation
- OpenAI API prices: https://developers.openai.com/api/docs/pricing
- OpenAI ChatGPT Plus India GST claim (secondary): https://storyboard18.com/digital/chatgpt-begins-testing-local-pricing-in-india-plans-start-at-rs-1999-per-month-78928.htm
- Google AI plans India: https://gemini.google/in/subscriptions/ , https://one.google.com/about/google-ai-plans/
- Gemini API image and Veo prices: https://ai.google.dev/gemini-api/docs/pricing
- OpenRouter fees and limits: https://openrouter.ai/pricing
- Exchange rate: https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR
- Sora status (secondary search results, not confirmed): see search of 2026-10-13 for "OpenAI Sora API pricing"

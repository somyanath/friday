# The ₹3,399 Cursor plan: does it cover Friday's models?

Somya asked on 2026-10-14 about a Cursor plan they call "Cursor Plus", shown at ₹3,399 a month in India. They wanted to know if it gives a good quota of the models Friday chose for each job.

All sources were read on 2026-10-14 unless marked "(prior doc)". Those numbers come from earlier Friday research and were not checked again:
- `docs/research/subscriptions-and-costs.md` on branch `research/subscriptions-and-costs`
- `docs/research/subscriptions-at-4000.md` on branch `research/subscriptions-at-4000`
- `docs/research/model-routing.md` on branch `research/model-routing`
- `docs/research/parallel-tooling.md` on branch `research/parallel-tooling`

Exchange rate: 1 USD = ₹95.11, the xe.com mid-market rate at 11:53 UTC on 2026-10-14 ([xe.com](https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR)).

Terms follow `GLOSSARY.md`: Variant, Direction, Surface, Define, Fan-out, Fleet, Unattended run and the Variant gate.

## Short answer

**"Will I get a good quota of the models we decided to use?" No.** The plan gives a good quota of Grok and Composer only. It includes nothing for any other model Friday's routing table names.

- **₹3,399 is "X Premium", the $30 tier of The X Subscription.** The Cursor iPhone app sells it under that name on India's App Store. The tier actually called "Plus" costs $8 and runs Grok models only. Apple's India App Store prices include 18% GST (per Apple's developer notice), and $30 plus 18% GST comes to ₹3,367, so ₹3,399 is very probably the final price.
- **Opus 5.5, Sonnet 5.5 and Haiku 5.5 get no included quota.** Every Claude request is paid from prepaid credit at API list price, starting with the first request. Cursor staff confirm "There's no included allowance for third-party models on Premium, Super, or Ultra". With the plan at ₹3,399, ₹601 of the ₹4,000 cap is left, and that buys about 2 hour-long Opus sessions or about 4 Sonnet sessions a month.
- **GPT-6.1 Sol and gpt-image-2 are not in Cursor at all.** OpenAI never supplied its GPT-6 models to Cursor. It also intends to cut every OpenAI model from Cursor on 2026-11-12, after SpaceX bought Cursor. The cross-family critic, the panel seat and the image generator therefore have to change if Cursor becomes Friday's tool.
- **The plan's real quota is Grok 4.7 and Composer 2.5.** They share a pool that refreshes weekly. Its size is not published in dollars or tokens. xAI says only that it is "4x Plus" and at least twice the Grok coding usage of the old Cursor Pro. xAI itself recommends the $100 Super tier, not Premium, "for daily agent users".
- **Spending control fits Friday's rule.** Third-party usage comes only from prepaid credit. Auto top-up is off unless you turn it on, a monthly cap is available, and with no credit a third-party model simply refuses to run. One caveat: Cursor's help for App Store subscriptions describes card-billed "on-demand" usage instead, so buy on the web or check this before relying on the App Store route.
- **As an agent tool, Cursor could carry Friday's workflow.** It has subagents with a model per role, and it reads `.claude/agents/` and `.claude/skills/` as well as `.agents/skills/`. It also has worktrees, `/best-of-n`, Cloud Agents and a headless CLI. But the routing table would have to turn Grok-first: Grok 4.7 and Composer build and critique, and Claude becomes a paid exception. That is close to pstack's original split, except that Opus is no longer included.
- **Claude Code driving the Cursor CLI is unclear under Cursor's terms, and it does not fit the budget anyway.** Cursor's docs offer `agent -p` with an API key "For automation, scripts, or CI environments". Cursor's Acceptable Use Policy also lists "Accessing the Service through automated or non-human means, whether through a bot, script, or otherwise" among things not to do. Neither says anything about one coding agent calling another. Claude Pro plus X Premium costs ₹5,398, which breaks the cap.
- **Recommendation: keep option A, Claude Pro plus ChatGPT Plus.** The Cursor plan is worth it only if Somya chooses to rebuild Friday's routing around Grok. It cannot carry the current table.

## Options compared by Friday job

Prices are a month, tax included. "Hours" means an hour-long agent session as modelled in the Assumptions section, at API list price. Sources and arithmetic are in sections 2 to 4.

| Friday job (model decided 2026-10-14) | A: Claude Pro + ChatGPT Plus, ₹3,698 | B: X Premium alone, ₹3,399 (₹601 left) | C: X Premium + $5 OpenAI API prepaid, about ₹3,960 |
|---|---|---|---|
| Judgment: main session, planning, review, prose, Directions (Opus 5.5) | Included in Pro's pool, which has a 5-hour session limit and a weekly limit. No numbers are published | Not included. ₹601 of credit buys 1.8 to 2.1 Opus hours a month | Not included. About ₹40 is left over, so effectively none |
| Building: Variants, features, bugs, refactors (Sonnet 5.5) | Included in the same Pro pool | Not included. ₹601 buys 3.6 to 4.3 Sonnet hours a month | Effectively none |
| Search (Haiku 5.5) | Included in the same Pro pool (the lightest draw) | Not included. About 62 to 73 hours a month at under 100k input tokens; above that, Haiku bills at 5x. Cursor's built-in Explore subagent chooses its own fast model anyway | Effectively none |
| Other model family: critic, panel seat, extra Variant builder (GPT-6.1 Sol) | Codex on Plus: 15 to 160 local messages per 5 hours, plus weekly limits | **Not available.** GPT-6 models were never offered in Cursor, and all OpenAI models are due to leave on 2026-11-12. The included substitute is Grok 4.7 | About 100 critic calls a month through the OpenAI API (my estimate: 15k tokens in, 2k out, $0.05 a call). They would have to be called from a script, not from Cursor's model picker |
| Images (gpt-image-2 via `$imagegen`) | Included in Codex limits, which image turns use 3 to 5x faster | **gpt-image-2 not available.** Cursor's own image tool uses Google's Nano Banana Pro (billing not stated; probably prepaid credit). Grok Imagine images can be made by hand in the Grok apps, from the pool | gpt-image-2 or the newer gpt-image-2.5 models through the API from the same $5 (token-priced, no flat per-image price), or the B options |
| Grok 4.7 and Composer 2.5 (not in Friday's table) | None | **Included in the weekly pool, whose size is not published.** Each $10 of pool buys about 4.7 Grok 4.7 standard hours, 2.4 Fast hours, 12.9 Composer standard hours or 3.4 Composer Fast hours. Fast is the default speed | Same as B |
| Video (made by hand in Google Flow) | Unchanged | Unchanged. Grok Imagine video is also available by hand from the pool | Unchanged |
| Agent tool | Claude Code, calling `codex exec` | Cursor (editor, Agents Window, CLI, Cloud Agents). Claude Code would have no Claude plan behind it | Cursor, plus a script or `codex exec` using an API key |
| Prepaid-only spending | Usage credits off on both plans | Fits: prepaid credit, auto top-up off, optional monthly cap | Fits, if OpenAI auto-recharge is left off |

## 1. Which plan is "Cursor Plus at ₹3,399"

- **The App Store listing names it.** On India's App Store, Cursor's iPhone app (developer Anysphere) lists these in-app purchases:
  - X Premium ₹3,399
  - X Super ₹12,399
  - X Ultra ₹19,900
  - a second "X Premium" at ₹29,900
  - the older Cursor plans: Pro ₹2,499, Pro+ ₹7,900 and Ultra ₹24,900

  Source: https://apps.apple.com/in/app/cursor/id6767085653 (fetched as served to India). There is no in-app item called "Plus" there.
- **X Premium is the $30 tier of The X Subscription.** The subscription launched on 2026-10-12 and merges Grok, Grok Bot, Cursor and X Premium. Premium brings "The benefits of SuperGrok, Cursor Pro, and X Premium+, previously $90/month combined". Source: https://x.ai/news/x-subscription
- **The tiers are:**
  - Free
  - Plus at $8 ("Only Grok models are available on this plan")
  - Premium at $30 ("4x more usage compared to Plus")
  - Super at $100 (15x)
  - Ultra at $200 (50x)

  Sources: https://cursor.com/pricing and https://x.ai/pricing, both fetched from an Indian location; both show USD only. If Somya meant the real Plus, it would cost about ₹898 with GST. It includes no Claude, no Cloud Agents and no video.
- **Annual billing exists.** It costs $300 a year, which is $25 a month (https://docs.x.ai/x-subscription/pricing). The ₹29,900 App Store item is probably the annual Premium (₹2,492 a month). That is my inference from the name and price; the listing does not say. Cursor's help says in-app plans are monthly only, but that page still describes the old plans (https://cursor.com/help/account-and-billing/app-store-subscription).
- **The old Cursor plans are closed to new customers.** xAI says "The X Subscription is available to new customers", and existing plans continue for current subscribers (https://x.ai/news/x-subscription). Cursor staff add that the old Ultra "is no longer available for new signups" (forum post #11 below). The App Store still lists Pro at ₹2,499, which probably serves existing subscribers. I did not check whether a new account can buy it, because that would mean signing up.
- **₹3,399 is very probably the final, tax-included price:**
  - Apple's developer notice on India pricing describes customer prices that reflect "the existing goods and services tax of 18%", with developer proceeds "calculated based on the tax-exclusive price". The notice is from 2020-10-26: https://developer.apple.com/news/?id=ul8i5to3
  - $30 × 95.11 × 1.18 = ₹3,367, close to ₹3,399 (my arithmetic).
  - A price tracker gives the same reading: "₹3,399/mo ... with 18% GST included", and it says the X Subscription "is currently sold through the Cursor app" on the App Store. This is a secondary source: https://opentherank.com/ai-pricing/grok/india/
- **On the web the price is $30 before tax.** xAI's pricing page says "All prices are exclusive of any applicable taxes" (https://x.ai/pricing). The terms say X Subscription Corp "will calculate, charge, collect, and remit" GST where it applies. They also say the buyer pays "foreign transaction fees, foreign exchange fees, and currency fluctuations" (https://x.ai/legal/bundled-subscription-terms, last updated 2026-10-07).
  - A Cursor staff member says the switch page "prices the plan for your billing country and can include local taxes" (forum post #103).
  - Web checkout takes cards, Apple Pay, Google Pay and Link (https://docs.x.ai/x-subscription/payment-methods). Staff told customers who cannot pay by Alipay to use "a Visa or Mastercard with international payments enabled" (post #97).
  - So a web purchase from India is about $35.40 (₹3,367) plus any card forex markup.
- **Cursor Start (₹649, India only, tax-inclusive) is a different plan.** It covers Grok and Composer only, with no third-party models (prior doc; https://cursor.com/docs/models-and-pricing).

## 2. What the plan includes for Friday's models

### Included or billed separately

Prices are Cursor's list prices per million tokens: input, cache write, cache read, output (https://cursor.com/docs/models-and-pricing and the per-model pages under https://cursor.com/docs/models/).

| Model | In Premium's pool? | Cursor price | Cost of one hour-long session (my model) | Notes |
|---|---|---|---|---|
| Claude Opus 5.5 (`claude-opus-5-5`) | No: paid from prepaid credit from the first request | $4 / $5 / $0.20 / $20 | $2.95 (₹281, ₹331 with GST) | A Fast tier costs $8 / $40 |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | No | $2 / $2.50 / $0.10 / $10 | $1.48 (₹140, ₹166 with GST) | Cursor: max effort "costs about 6x more per task than the default high effort" |
| Claude Haiku 5.5 (`claude-haiku-5-5`) | No | $0.10 / $0.125 / $0.01 / $0.50 | $0.09 (₹8); $0.43 if every request is over 100k input tokens | "Requests above 100k input tokens bill at 5x the standard rates" |
| Claude Fable 5.1 | No | $10 / $12.50 / $0.25 / $50 | n/a | Friday: never. Auto mode can route to Fable 5 (see section 3) |
| GPT-6.1 Sol, GPT-6 Sol, Astra, Luna | **Not offered** | n/a | n/a | Cursor's model docs return 404 for `gpt-6-1-sol`, `gpt-6-sol`, `gpt-6-astra` and `gpt-6-luna` |
| GPT-5.6 Sol / Terra / Luna | No | Sol $4 / $5 / $0.40 / $20 | Sol $3.45 | Due to leave Cursor on 2026-11-12, OpenAI's proposed date (below) |
| Grok 4.7 (`grok-4.7`) | **Yes** | $2 / – / $0.50 / $6; Fast $4 / – / $1 / $12 | $2.11 standard, $4.22 Fast | "Fast is the default speed tier on Pro and higher plans" |
| Composer 2.5 (`composer-2.5`) | **Yes** | $0.50 / – / $0.20 / $2.50; Fast $3 / – / $0.50 / $15 | $0.78 standard, $2.90 Fast | "Fast is the default in the product" |
| Gemini 4 Argon, 3.1 Pro, 3.8 Flash | No | Argon $2 / – / $0.10 / $10 | n/a | Another family available for credit |

Sources for "in the pool or not":

- xAI's pricing page FAQ: "Premium and above include generous usage of Grok models but do not include an allowance for third-party models. Third-party models remain available in Cursor at API list price" (https://cursor.com/pricing).
- The usage-limits doc: "Each paid seat ... receives a weekly pool for eligible first-party usage only" (https://docs.x.ai/x-subscription/usage-limits).
- The pricing doc: third-party models "use these credits from the first use" (https://docs.x.ai/x-subscription/pricing).
- Cursor staff, launch thread post #47: "There's no included allowance for third-party models on Premium, Super, or Ultra (individual or Teams). The included pool covers Grok models. Third-party models are billed at API list prices through top-ups, starting with the first request" (https://forum.cursor.com/t/introducing-the-x-subscription/174450).
- Composer also uses the included pool (post #104).
- Individual plans do not pay the $0.25 per million "Cursor Token Rate"; only teams do (https://docs.x.ai/x-subscription/cursor-token-rate).

**OpenAI models.** OpenAI wrote on 2026-08-28 that it intends "to wind down our contract providing OpenAI models to Cursor, with a proposed shutoff date of November 12, 2026". It is also "not providing future models to Cursor" (https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/). Cursor's support engineer replied that "Models from Anthropic, Google, Meta, and Grok will all continue to be offered through direct partnership" (forum post #6, 2026-08-29, https://forum.cursor.com/t/i-heard-openai-is-about-to-cut-off-gpt-access-for-cursor-is-this-true/169876). Asked on 2026-10-13 whether paying at API price would bring back the latest OpenAI models, staff said they had nothing beyond what OpenAI shared (post #100 of the launch thread).

**Bring your own key.** BYOK is available on Premium and above (staff, post #106). On individual plans, requests made with your own key are billed by the provider and "don't draw from either pool" (https://cursor.com/help/models-and-usage/usage-limits). An Anthropic API key therefore costs the same API rates as Cursor credit. Whether an OpenAI key will keep working in Cursor after 2026-11-12 is open; a user asked the same question in the forum thread above, and no staff answer appears in the posts I read.

### Pool size and refresh

- **Refresh:** weekly. "Your allowance refreshes weekly, so one heavy day never wipes out your whole month" (https://x.ai/pricing). Cursor's own help page still says usage "resets monthly"; that page describes the old plans (https://cursor.com/help/models-and-usage/usage-limits).
- **Size: not published in dollars or tokens.** What is published:
  - "4x Plus" (https://x.ai/pricing).
  - "Each X Subscription plan includes at least twice as much coding usage with our models as the comparable Cursor plan" (https://x.ai/news/x-subscription). For Premium the comparable plan is Cursor Pro at $20 (staff, posts #49 and #52).
  - Cursor never published the size of Pro's Grok pool either. Its docs only say "Significantly more included usage" (https://cursor.com/docs/models-and-pricing).
- **The pool is shared.** Grok chat, Imagine, Voice and Grok Bot draw from the same weekly pool as Cursor (https://x.ai/pricing FAQ; https://docs.x.ai/x-subscription/grok-bot). One user who moved from Cursor Pro said the shared pool felt smaller than their old separate Cursor and Grok Bot quotas (post #21). Another said five daily blog posts by Grok Bot used 4% of it (post #67). A third, who had been on the $60 Pro+ plan, "already hit the weekly limit the second day" (post #174). None of them gave dollar figures.
- **Who the vendors say it is for.** xAI: "We recommend Premium for new AI users, Super for daily agent users, and Ultra for power users" (https://x.ai/pricing). Cursor's docs: daily agent users typically spend "$60–$100/mo total usage", and power users with "multiple agents/automation" spend "$200+/mo" (https://cursor.com/docs/models-and-pricing). Friday's Fleets of 3 to 4 Variants fall in the second group.

### Sessions a week, in practical terms

The session model is in the Assumptions section. Because the pool's dollar value is unpublished, here is the conversion per $10 of weekly pool at Cursor list prices:

| Model | Hour-long sessions per $10 of pool |
|---|---|
| Grok 4.7, standard speed | 4.7 |
| Grok 4.7, Fast (the default) | 2.4 |
| Composer 2.5, standard speed | 12.9 |
| Composer 2.5, Fast (the default) | 3.4 |

*Illustration only, not a finding.* Suppose Premium's pool were worth $40 a month at list prices, which is twice a $20 Pro pool. The $20 figure for Pro comes from secondary write-ups, not from Cursor. That works out to about $9.23 a week, or about 4.4 Grok 4.7 standard hours, 2.2 Fast hours, 11.9 Composer standard hours or 3.2 Composer Fast hours. Cursor's "significantly more" wording suggests the real Grok pool could be larger. The only reliable number will be the usage view at grok.com/dashboard after a real week.

For Claude, the arithmetic is fixed. Everything is paid from credit:

| ₹ a month available for credit | Opus 5.5 hours a month | Sonnet 5.5 hours a month | Haiku 5.5 hours a month (under 100k input) |
|---|---|---|---|
| ₹601 (B: X Premium monthly) | 1.8 to 2.1 | 3.6 to 4.3 | 62 to 73 |
| ₹1,508 (B, if ₹29,900 is the annual Premium; unverified) | 4.6 to 5.4 | 9.1 to 10.7 | 156 to 184 |

The lower figure in each range assumes 18% GST is added to top-ups. Top-ups are sold by Anysphere, and the terms do not say whether GST is added (https://x.ai/legal/bundled-subscription-terms, section 1).

### Comparison with Claude Pro and ChatGPT Plus

- **Claude Pro publishes no numbers, so the comparison is not like for like.** Pro has "a five-hour session limit and a weekly limit", shared between the Claude apps and Claude Code (https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan). Opus, Sonnet and Haiku all draw from that pool. *Inference:* B's whole Claude budget is about 4 Sonnet hours a month. That is less than one working day of a single Sonnet Variant builder. Pro's 5-hour window resets several times a day, up to a weekly cap. Unless Pro's weekly cap were below about 4 Sonnet hours, which no source suggests and Somya can check with `/status`, option A gives far more Claude.
- **ChatGPT Plus publishes ranges.** Per 5 hours, Codex on Plus gives GPT-6.1 Sol 15 to 160 local messages, GPT-6 Sol 15 to 150, GPT-6 Astra 5 to 45 and GPT-6 Luna 350 to 3,000. "Weekly limits may also apply", and "Image generations use included limits ~3-5x faster on average" (https://learn.chatgpt.com/docs/pricing, re-checked 2026-10-14). B has no equivalent at all.
- **What B adds that A lacks:** a Grok pool usable for building, plus Cloud Agents that run Variants on Cursor's VMs instead of the Mac. On WebDev Arena, Grok 4.7 (1640 at xhigh) ranks below Sonnet 5.5 (1713 at high, 1774 at xhigh) and GPT-6.1 Sol (1760) (prior doc: model-routing, leaderboard dated 2026-10-13).

## 3. Spending control

**Yes, third-party spending can be held to prepaid money with a hard stop.**

- Third-party models in Cursor "are billed against your prepaid credit". "Auto Top-up only runs after you turn it on and save it" (https://docs.x.ai/x-subscription/prepaid-balance). Switching to The X Subscription "doesn't turn it on for you" (https://docs.x.ai/x-subscription/extra-usage).
- "After you turn it off, extra usage stops once your included weekly usage and your prepaid credit are both used up" (prepaid-balance page).
- A monthly cap ("Monthly additional usage limit") is optional. When it is reached, "paid extra usage pauses until the next month or until you raise the cap, even if money remains in your prepaid credit". Alerts alone "do not stop usage" (https://docs.x.ai/x-subscription/spending-caps).
- Cursor staff: "If you don't add credits, a third-party model won't run and you'll see a prompt to buy credits instead, so you won't be charged by surprise. You can also turn off models you don't want in Cursor Settings → Models" (launch thread post #98).
- Top-ups are sold by Anysphere and are "non-refundable except as required by applicable law" (https://x.ai/legal/bundled-subscription-terms, section 1). Bought credit "stays available until it's used or expires". The expiry period is not stated.

Watch points for Friday:

1. **Subagents can bill third-party models even when the picker shows Grok.** "A named third-party model draws from the Other Models pool, including when the parent chat is on Auto, Grok, or Composer" (https://cursor.com/docs/subagents). With zero credit this fails safe; with credit loaded, any subagent naming a Claude model draws on it.
2. **Auto can route to third-party models.** "Auto bills each parent request at the routed model's list price, so a third-party route draws from Other Models" (https://cursor.com/help/models-and-usage/usage-limits). The router's pool lists GPT-5.5, Claude Opus 5 and Claude Fable 5 (https://cursor.com/help/models-and-usage/available-models). To keep Fable unreachable, pick models explicitly and switch off unwanted ones in Settings → Models.
3. **The App Store route is unclear.** Cursor's help for in-app subscriptions says extra usage "isn't available for purchase in the app". It is enabled on the web as "on-demand usage" with a card and a monthly limit, and that is billed afterwards, not prepaid (https://cursor.com/help/account-and-billing/on-demand-usage-for-mobile-subscriptions). That page predates The X Subscription. Whether an App Store X Premium uses the prepaid top-ups at grok.com/dashboard instead is not stated. A web purchase follows the documented prepaid path.

## 4. Budget fit

With the cap at ₹4,000, X Premium (₹3,399) plus Claude Pro (₹1,999) costs ₹5,398, so Cursor fits only as a replacement.

**A: Claude Pro + ChatGPT Plus, ₹3,698 (₹302 headroom).**
- Opus, Sonnet and Haiku: all in Pro's pool.
- GPT-6.1 Sol: Codex at 15 to 160 messages per 5 hours, reachable from Claude Code through `codex exec`.
- Images: gpt-image-2 through `$imagegen`, inside Codex limits.
- This matches the routing table as decided. Prices are as decided on 2026-10-14.

**B: X Premium alone, ₹3,399 (₹601 headroom).**
- Opus, Sonnet and Haiku: only what credit buys, about 2 Opus or 4 Sonnet hours a month.
- GPT-6.1 Sol: not available.
- Images: no gpt-image-2. Cursor's agent has an image tool on Google's Nano Banana Pro ("Generate images from text descriptions or reference images ... saved to your project's assets/ folder", https://cursor.com/docs/agent/overview; model named in https://cursor.com/changelog/2-4). How it is billed under The X Subscription is not stated. As a Google model it is probably paid from prepaid credit; Nano Banana Pro costs $0.134 per image on Google's API (prior doc). Grok Imagine images and video can be made by hand in the Grok apps, from the pool.
- Grok 4.7 and Composer 2.5: the weekly pool.

**C: X Premium plus an add-on that fits ₹601.** Three candidates:

| Add-on | Monthly | What it adds to Friday's routing |
|---|---|---|
| OpenAI API prepaid, $5 minimum (prior doc) | ₹476 before tax, about ₹561 if 18% GST is added | GPT-6.1 Sol at $2 / $0.10 cached / $2.50 cache write / $10 output per million tokens (https://developers.openai.com/api/docs/pricing). That is about 100 critic calls a month at 15k tokens in and 2k out (my estimate), or gpt-image-2 images. gpt-image-2 is token-priced and OpenAI points to a calculator instead of a flat per-image price. Cursor's model picker cannot use it, so a shell script or `codex exec` with an API key would call it |
| ChatGPT Go | ₹399 | Codex only in the desktop app, with GPT-6 Luna; it cannot be scripted. Image generation by hand in ChatGPT (prior doc) |
| Google AI Plus | ₹399 | No API credit, 200 Flow credits, no Gemini CLI (prior doc). Friday already makes video by hand in Flow's free daily credits |

C with the OpenAI API is the only add-on that brings back a GPT-6.1 Sol critic. It leaves about ₹40, so Claude stays effectively unavailable. No add-on that fits ₹601 restores Opus or Sonnet in quantity.

## 5. If Cursor became the agent tool

### What Cursor offers in Claude Code's place

| Friday need | Cursor feature | Source |
|---|---|---|
| Subagents with a model per role | Markdown subagents with YAML frontmatter, read from `.cursor/agents/`, `.claude/agents/` and `.codex/agents/` (and the same folders under `~`). Fields: `model` (`inherit` or an ID, with options such as `claude-opus-5[effort=high]` or `composer-2.5[fast=false]`), `readonly`, `is_background`. The parent can also name a model at launch. Cursor overrides the model if "the model isn't available on your current plan" | https://cursor.com/docs/subagents |
| Skills | Loaded from `.agents/skills/`, `.cursor/skills/`, `~/.agents/skills/` and `~/.cursor/skills/`, and "for compatibility" from `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/` and `~/.codex/skills/`. Frontmatter: `name`, `description`, `paths`, `disable-model-invocation`, `icon`, `color`, `metadata`. There is no `model`, `effort` or `context: fork`, so a Claude Code skill that pins a model would lose the pin (my reading of the field list). Only `~/.cursor/skills/` syncs to Cloud Agents | https://cursor.com/docs/skills |
| Fan-out with isolation | "Run a swarm of subagents ... each in its own environment": each gets "an isolated Git worktree" or "its own cloud environment with a dedicated VM". Background subagents write to `~/.cursor/subagents/` | https://cursor.com/docs/subagents |
| Fleet in worktrees | Agents Window worktrees; `.cursor/worktrees.json` setup scripts used by the Agents Window, IDE and CLI; CLI `-w/--worktree [name]` under `~/.cursor/worktrees/` | https://cursor.com/docs/configuration/worktrees , https://cursor.com/docs/cli/reference/parameters |
| Divergent work | `/best-of-n` "runs the same task across multiple models at once. Each run gets its own worktree" | https://cursor.com/docs/configuration/worktrees |
| Cloud runs (Variants off the Mac) | Cloud Agents are included on Premium. "You can run as many agents as you want in parallel". They are "charged at API pricing for the selected model", and a spend limit is asked for at first use | https://cursor.com/pricing , https://cursor.com/docs/cloud-agent |
| Unattended runs | Automations are included on Premium. Projects (beta) run a coordinator on its own cloud computer | https://cursor.com/pricing , https://cursor.com/changelog |
| Headless CLI | `agent -p` (print mode, "Has access to all tools, including write and shell"), `--force` to apply edits, `--output-format text\|json\|stream-json`, `--model`, `--mode plan\|ask`, `--resume`, `-w`. Images are passed as file paths in the prompt. Auth: `agent login` or `CURSOR_API_KEY` "For automation, scripts, or CI environments" | https://cursor.com/docs/cli/headless , https://cursor.com/docs/cli/reference/parameters , https://cursor.com/docs/cli/reference/authentication |

Model IDs on Cursor are `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`, `grok-4.7` and `composer-2.5` (the model pages under https://cursor.com/docs/models/). Claude Code's aliases (`sonnet`, `opus`, `haiku`) are not documented as valid in Cursor. A shared `.claude/agents/` file would need Cursor IDs, or Cursor would fall back to another model. This is unverified, and nothing was run.

**What does not carry over.** Claude Code cannot run on this plan. Anthropic does not support routing Claude Code to non-Claude models (prior doc: pstack-portability), and Cursor offers no Claude subscription sign-in on the pages I read. Without Claude Pro, Claude Code would need a prepaid Anthropic API key at the same API rates as Cursor credit.

### May Claude Code drive the Cursor CLI?

There is no explicit rule either way, and the two documents point in opposite directions:

- **For:** Cursor documents `agent -p` "in scripts and automation workflows" and API-key auth "For automation, scripts, or CI environments" (headless and authentication pages above).
- **Against:** Cursor's Acceptable Use Policy (last updated 2026-08-11) lists "Accessing the Service through automated or non-human means, whether through a bot, script, or otherwise". It sits under "Not complying with laws or regulations, including by:". It also forbids "Manipulating, circumventing, or interfering with Anysphere's subscription, billing, or usage-metering systems, including through direct or automated means" (https://cursor.com/acceptable-use-policy). SpaceXSI's own policy words it more narrowly: "unauthorized automated or non-human means" (https://x.ai/legal/acceptable-use-policy).
- **Contrast:** Antigravity's FAQ explicitly bans wrapping its CLI in third-party coding agents on consumer plans (prior doc). Cursor has no such sentence.

*My reading:* using the documented headless CLI with an API key is very likely "authorized" use, whatever program types the command. The literal AUP text still covers scripts, so the safe step is to ask support@x.ai before building on it. This matters little for Friday, because no combination of Claude Pro and X Premium fits ₹4,000.

### Image and video generation

- Premium includes "Make stunning AI images & videos" (Grok Imagine). Plus has images only (https://x.ai/pricing, https://cursor.com/pricing).
- Imagine usage comes from the same weekly pool ("Within Grok, the pool covers Chat, Imagine, Voice, and Bot", https://x.ai/pricing FAQ). It is used by hand in the Grok apps.
- The Grok API, the path an agent could call, is "billed separately at standard model rates and doesn't draw from your plan's usage pool" (same FAQ). Prices: grok-imagine-image $0.02, image-2.0 $0.04, quality $0.05 per image; video $0.02 to $0.08 per second (https://docs.x.ai/developers/pricing).
- Cursor's agent image tool uses Google Nano Banana Pro (above).
- None of these is gpt-image-2. If Friday's image prompts were tuned for gpt-image-2, they would need re-testing.

### Grok Bot

Included on Premium. It "draws from the weekly shared pool across Grok, Grok Bot, and Cursor" (https://docs.x.ai/x-subscription/grok-bot). Grok Bot is an outer-loop assistant that hands coding to Cursor Cloud Agents, not a coding agent (prior doc). For Friday it matters only as a drain on the same pool the Variant builders need. Leave it unused.

### What Friday's routing table would become under B (inference)

| Job | Today (A) | Under B |
|---|---|---|
| Judgment | Opus 5.5 (Pro) | Opus 5.5 at API price only for writing Directions and the final review before the Ship gate. Grok 4.7 at high effort for routine planning and review |
| Building | Sonnet 5.5 (Pro) | Grok 4.7 or Composer 2.5 from the pool, at standard speed to stretch it. Sonnet 5.5 only for one Variant that stalls |
| Search | Haiku 5.5 (Pro) | Cursor's built-in Explore subagent, which "uses a faster model by default" (https://cursor.com/docs/subagents; which model is not stated) |
| Other family | GPT-6.1 Sol (Plus) | Grok 4.7 critiquing Claude work, and Opus 5.5 (paid) critiquing Grok work. This is pstack's original Opus and Grok panel (prior doc: model-routing), but now Opus is the paid side |
| Images | gpt-image-2 (Plus) | Cursor image tool (Nano Banana Pro), Grok Imagine by hand, or the Grok Imagine API (prepaid) |

## Assumptions

1. **Session model** (prior doc, subscriptions-and-costs). One hour-long agent session is 2.5M cache-read tokens, 250k uncached or cache-write tokens and 60k output tokens. For models with no cache-write price, the 250k is billed at the input price. Real sessions may differ by 2x either way.
2. **Critic call.** A critic call is 15k input and 2k output tokens, uncached (prior doc: subscriptions-at-4000).
3. **18% GST.** Where I add 18% GST to USD top-ups or API credit, the rate and the fact that it is added are assumptions. The sources only say tax "may be added" where required.
4. **No forex markup counted.** Card forex markups on USD charges are not included.
5. **Plan prices.** Claude Pro at ₹1,999 and ChatGPT Plus at ₹1,699, both tax included, are Friday's decided figures of 2026-10-14. They were not re-checked here.
6. **The $40 pool.** The $40-a-month Premium pool in the illustration is my construct, built on a $20 figure for Cursor Pro that only secondary sources give. It is not a finding.

## What I could not verify

- The dollar or token size of Premium's weekly pool, and how much a Grok 4.7 hour actually takes from it.
- Whether the ₹29,900 App Store item is annual Premium, and whether the old Cursor Pro at ₹2,499 can still be bought in the app by a new account.
- Whether an App Store X Premium uses prepaid top-ups or card-billed on-demand usage for third-party models.
- Whether top-ups bought from India carry GST, the minimum top-up, and when bought credit expires.
- Which model Cursor's built-in Explore subagent uses, and whether it can choose a third-party model on its own.
- How Cursor's image tool is billed under The X Subscription, and whether it still uses Nano Banana Pro. The model name comes from the 2026-01-22 changelog.
- Whether Cursor accepts Claude Code's `sonnet`, `opus` and `haiku` aliases in `.claude/agents/` files.
- Whether OpenAI API keys (BYOK) will still work in Cursor after 2026-11-12.
- Whether Cursor would object to Claude Code calling `agent -p`. The terms conflict, and nobody at Cursor or xAI has said.
- Anthropic's own view of the SpaceX ownership. I found no Anthropic statement; Cursor says Anthropic models continue.
- Anything at runtime. Nothing was installed, bought or signed up for.

## Sources

Read 2026-10-14.

Plan and price:
- India App Store, Cursor app in-app purchases: https://apps.apple.com/in/app/cursor/id6767085653
- Cursor pricing (fetched from India): https://cursor.com/pricing
- xAI pricing (fetched from India): https://x.ai/pricing
- The X Subscription announcement (2026-10-12): https://x.ai/news/x-subscription
- X Subscription docs: https://docs.x.ai/x-subscription/overview , /pricing , /usage-limits , /extra-usage , /prepaid-balance (last updated 2026-10-11) , /spending-caps , /cursor-token-rate , /payment-methods , /app-store , /invoices-and-refunds , /manage , /grok-bot (all under https://docs.x.ai/x-subscription/)
- Cursor help, X Subscription: https://cursor.com/help/the-x-subscription/overview
- Bundled Subscription Terms (2026-10-07): https://x.ai/legal/bundled-subscription-terms
- X Subscription Consumer Terms: https://x.ai/legal/x-subscription-terms-of-service
- Apple on India App Store pricing and GST (2020-10-26): https://developer.apple.com/news/?id=ul8i5to3
- Secondary price tracker (₹3,399 including GST): https://opentherank.com/ai-pricing/grok/india/
- Exchange rate: https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR

Models and usage:
- Cursor models and pricing: https://cursor.com/docs/models-and-pricing ; model pages https://cursor.com/docs/models/claude-opus-5-5 , /claude-sonnet-5-5 , /claude-haiku-5-5 , /grok-4-7 , /cursor-composer-2-5 , /gpt-5-6-sol
- Cursor help: https://cursor.com/help/models-and-usage/usage-limits , https://cursor.com/help/models-and-usage/available-models , https://cursor.com/help/models-and-usage/grok-4-7 , https://cursor.com/help/account-and-billing/pricing , https://cursor.com/help/account-and-billing/app-store-subscription , https://cursor.com/help/account-and-billing/on-demand-usage-for-mobile-subscriptions
- OpenAI on ending model supply to Cursor (2026-08-28): https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/
- Cursor forum, OpenAI access thread (staff posts #6 and #32): https://forum.cursor.com/t/i-heard-openai-is-about-to-cut-off-gpt-access-for-cursor-is-this-true/169876
- Cursor forum, no GPT-6 in Cursor (user report): https://forum.cursor.com/t/i-figured-out-how-to-use-gpt-6-astra-in-cursor/171491
- Cursor forum, X Subscription launch thread (staff posts #1, #11, #43, #47, #49, #52, #97, #98, #100, #103, #104, #106; user posts #21, #174): https://forum.cursor.com/t/introducing-the-x-subscription/174450
- Cursor joins SpaceX: https://cursor.com/blog/joining-spacex
- Claude Code on Pro: https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan
- Codex limits on Plus: https://learn.chatgpt.com/docs/pricing
- OpenAI API prices: https://developers.openai.com/api/docs/pricing
- xAI API and Imagine prices: https://docs.x.ai/developers/pricing

Agent tool and terms:
- Subagents: https://cursor.com/docs/subagents
- Skills: https://cursor.com/docs/skills
- Worktrees and `/best-of-n`: https://cursor.com/docs/configuration/worktrees
- Agents Window: https://cursor.com/docs/agent/agents-window
- Agent tools, including image generation: https://cursor.com/docs/agent/overview ; image model: https://cursor.com/changelog/2-4
- Cloud Agents: https://cursor.com/docs/cloud-agent
- CLI: https://cursor.com/docs/cli/overview , https://cursor.com/docs/cli/headless , https://cursor.com/docs/cli/reference/parameters , https://cursor.com/docs/cli/reference/authentication
- Changelog (Projects, remote control): https://cursor.com/changelog
- Cursor Terms of Service: https://cursor.com/terms-of-service
- Cursor Acceptable Use Policy (2026-08-11): https://cursor.com/acceptable-use-policy
- SpaceXSI Acceptable Use Policy: https://x.ai/legal/acceptable-use-policy

Prior Friday research (read from their branches, not re-checked):
- `docs/research/subscriptions-and-costs.md` (session cost model, Grok Bot, Nano Banana Pro price)
- `docs/research/subscriptions-at-4000.md` (ChatGPT Go, Google AI Plus, Antigravity terms, critic-call model)
- `docs/research/model-routing.md` (routing table, WebDev Arena scores, pstack's Opus and Grok split)
- `docs/research/parallel-tooling.md` (Cursor tooling)
- `docs/research/pstack-portability.md` (Claude Code cannot use non-Claude models)

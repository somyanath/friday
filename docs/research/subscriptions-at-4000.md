# Subscriptions and generation within ₹4,000 a month

Ticket #8, re-researched for the new cap. The cap rose from ₹3,000 to ₹4,000 a month on 2026-10-14, tax included, covering every agent subscription, model access, and image and video generation. Pay-as-you-go spending has to be prepaid with auto top-up off.

All sources were read on 2026-10-14 unless marked "(prior doc)". Those numbers come from `docs/research/subscriptions-and-costs.md` on branch `research/subscriptions-and-costs`, read 2026-10-13, and are reused without re-checking unless noted. Exchange rate: 1 USD = ₹95.16, xe.com mid-market at 10:17 UTC on 2026-10-14 (https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR).

Terms follow `GLOSSARY.md`: Surface, Direction, Variant, Fan-out, Fleet, Unattended run, Divergent and Convergent work, and the Direction, Variant and Ship gates.

## Short answer

- **Only two large second subscriptions fit beside Claude Pro.** They fit only if Claude Pro is on annual billing (₹2,000 a month, paid as one ₹24,000 charge) and the second plan's rupee price already includes GST. The two are Google AI Pro (₹1,950, total ₹3,950) and ChatGPT Plus (₹1,999, total ₹3,999). Neither vendor's own page says whether GST is included. If GST is added at checkout, both combinations break the cap, at about ₹4,301 and ₹4,359. With Claude Pro on monthly billing (₹2,399, from a secondary source), neither fits.
- **First pick: Claude Pro (annual) + Google AI Pro, if checkout shows ₹1,950 as the final amount.** It is the only option that adds all three things Friday needs:
  - a second model family (Gemini);
  - image and video generation an agent can call, paid from a $10 Google Cloud credit included every month that the Gemini API accepts once a $5 prepaid balance exists;
  - more agent capacity outside Claude Pro's limits: Antigravity, which on Pro also offers Claude Sonnet 5.5 and Opus 5.5, and Jules at 100 tasks a day.

  It also includes 1,000 Google Flow credits a month for making videos by hand. Headroom is close to zero.
- **Two traps with Google AI Pro.** Gemini CLI stopped serving Google AI Pro on 2026-06-18 and was replaced by Antigravity CLI. Antigravity's FAQ says that wrapping `agy` inside third-party coding agents "is not supported under consumer plans". A Claude Code session should therefore reach Gemini through a Gemini API key. Antigravity is for sessions Somya starts by hand. On Pro, Antigravity's only Gemini model is Gemini 3.8 Flash; Gemini 4 Argon and 3.1 Pro need Ultra.
- **Safest pick: Claude Pro (annual) + up to ₹2,000 a month of prepaid Gemini API credit.** It cannot overrun the cap.
  - It buys about 4 to 5 Surfaces a month on the prior doc's typical generation path, 1 to 2 on the high path and about 18 on the low path.
  - Free tiers add a Gemini model family at no cost: Antigravity's free plan, Jules' free plan, and Gemini 3.8 Flash on the free API tier, whose inputs Google uses to improve its products.
  - Everyone gets 50 free Google Flow credits a day for making a video by hand.
- **ChatGPT Plus is the best cross-family critic or Variant builder that Claude Code can call.** `codex exec` reuses the ChatGPT sign-in and gives GPT-6.1 Sol at an estimated 15 to 160 local messages per 5 hours. Codex also generates images with gpt-image-2. But it leaves about ₹1 of headroom and includes no video, because OpenAI shut the Sora app on 2026-04-26 and the Sora API on 2026-09-24.
- **A cheap new candidate is GitHub Copilot Pro** at $10, about ₹1,123 if 18% GST is added (my assumption). `copilot -p` reaches GPT, Gemini Flash and Grok models with $15 a month of included usage, and leaves about ₹877 for generation. Its GPT and Gemini models are second-tier: GPT-6.1 Sol and Gemini 4 Argon need Pro+.
- **The other plans checked add little.** Cursor Start (₹649 including tax) adds only Grok and Composer. X Subscription Premium costs $30 before tax, about ₹3,369 with GST, so it does not fit beside Claude Pro. Claude usage credits can be prepaid with auto-reload off and a monthly cap, but they are billed at API rates: ₹2,000 buys roughly 12 hour-long Sonnet sessions, so they are an emergency valve.
- **A second model family helps the critic, not the ideas.** Published evidence supports a critic from another family, or a panel of several families, because judges favour their own family's output. The same evidence says different families produce similar creative output, so a second family adds little variety to Directions. Both lines of evidence come from text tasks; applying them to judging screenshots is my inference.

## Recommended combinations, ranked

Prices in ₹ a month. "Incl." means a source states that GST is included. Every combination assumes Claude Pro on annual billing at ₹2,000.

| Rank | Combination | ₹ / month with tax | Second family | Images an agent can call | Video | Practical limits | Headroom for prepaid generation | Main risks |
|---|---|---|---|---|---|---|---|---|
| 1 | Claude Pro + Google AI Pro | ₹3,950 if ₹1,950 includes GST (₹4,301 if not). Plus a one-time $5 Gemini API prepay (about ₹561 with GST, my assumption) that has to stay in the account | Gemini, through the Gemini API (paid from the credit), Antigravity (sessions Somya starts) and Jules | Yes: the Gemini API (Nano Banana) paid from a $10 monthly Cloud credit. Antigravity's built-in image-generator, but only in sessions Somya starts | Yes: Veo and Omni Flash through the API from the same $10. By hand: 1,000 Flow credits a month plus 50 a day | The $10 credit covers about 2.7 Surfaces on the typical path. Antigravity on Pro: Gemini 3.8 Flash plus Claude Sonnet and Opus 5.5, with a quota that refreshes every 5 hours up to a weekly limit. Jules: 100 tasks a day, 15 at once | About ₹0 to 50 in cash, plus the $10 credit (about ₹952) | GST inclusion is unverified. Claude Code may not drive `agy`. Flow is used by hand only. The Claude models in Antigravity are not available on a trial |
| 2 | Claude Pro + prepaid Gemini API (optionally a little OpenAI or xAI API) | ₹2,000 + at most ₹2,000 prepaid = at most ₹4,000 | Gemini or GPT per API call; free Gemini tiers for sessions Somya starts | Yes: Gemini or xAI image API | Yes: Veo, Omni Flash or Grok video API. By hand: 50 Flow credits a day | About $17.8 a month after 18% GST (my assumption): about 4.8 Surfaces typical, 1.6 high, 18 low. No subscription capacity beyond Claude Pro | Up to ₹2,000 | No extra agent capacity, so Claude Pro's limits stay the bottleneck. Critic calls are paid per call. Purchases are billed in USD, so GST and card forex fees are unclear |
| 3 | Claude Pro + ChatGPT Plus | ₹3,999 if ₹1,999 includes GST (₹4,359 if not) | GPT, through `codex exec` called from Claude Code, or a Codex session as one Variant's builder | Yes: gpt-image-2 inside Codex via `$imagegen`; uses Codex limits 3 to 5x faster | No (Sora is closed). By hand: 50 free Flow credits a day | GPT-6.1 Sol: 15 to 160 local messages per 5 hours; weekly limits may apply | About ₹1 | GST inclusion is shown only by secondary sources. No money left for a video API. Image generation eats into Codex limits |
| 4 | Claude Pro + GitHub Copilot Pro | About ₹3,123, assuming 18% GST on $10 | GPT-5.6 Terra, GPT-5.4, GPT-5.3-Codex, Gemini 3.8 Flash, Grok 4.7 and Kimi K3, all through `copilot -p` | No | No | 1,500 AI credits a month (= $15 at list prices); about 270 critic calls on GPT-5.6 Terra under my assumptions | About ₹877, roughly 2 typical Surfaces of generation | No frontier GPT or Gemini model on Pro. Small usage pool. Billed in USD with tax unclear |

How to choose between 1 and 2: open Google One's checkout for Google AI Pro from India and read the final amount; do not complete the purchase until the choice is made. If it is ₹1,950, take rank 1. If tax is added on top, take rank 2. Rank 3 suits Somya if the main thing they want is a strong GPT critic or builder called from Claude Code, and they accept having no video API.

## 1. What fits ₹4,000

### Prices and tax status

| Plan | India price | Tax | Source |
|---|---|---|---|
| Claude Pro, annual billing | ₹2,000 a month | Included ("The India prices include local taxes") | TechCrunch, 2026-07-13 (secondary): https://techcrunch.com/2026/07/13/anthropic-starts-localizing-claude-pricing-for-india-its-biggest-market-after-the-us/ |
| Claude Pro, monthly billing | ₹2,399 a month | Included ("All listed prices include GST") | Croma (secondary): https://www.croma.com/unboxed/anthropic-claude-ai-india-local-pricing-plans-confirmed |
| Claude Max 5x / 20x | ₹11,999 / ₹23,999 | Included | Croma (secondary), same page |
| Google AI Plus | ₹399 | Not stated on Google's page | https://one.google.com/intl/en_in/about/google-ai-plans/ |
| Google AI Pro | ₹1,950 | Not stated on Google's page (see note) | https://one.google.com/intl/en_in/about/google-ai-plans/ and https://gemini.google/in/subscriptions/ |
| ChatGPT Go | ₹399 | Not stated | (prior doc) |
| ChatGPT Plus | ₹1,999 | GST included per secondary sources only | (prior doc); Storyboard18: https://storyboard18.com/digital/chatgpt-begins-testing-local-pricing-in-india-plans-start-at-rs-1999-per-month-78928.htm ; T2: https://t2online.in/tech/tech-news/openai-introduces-chatgpt-go--a-new-plan-for-india--with-support-for-upi-payments/2000627 |
| GitHub Copilot Pro | $10 = ₹952 before tax, about ₹1,123 with 18% GST (assumption) | Not stated | https://docs.github.com/en/copilot/get-started/plans |
| GitHub Copilot Pro+ | $39 = ₹3,711 before tax | Not stated | same |
| Cursor Start (India only) | ₹649 | Included ("tax-inclusive") | https://cursor.com/help/account-and-billing/cursor-start |
| Cursor Pro ($20) | Apparently no longer sold to new customers. The pricing page served to India lists only Free, $8, $30, $100 and Ultra. The Start page still refers to "global Pro ... plans ... with pricing in USD" | n/a | https://cursor.com/pricing , https://cursor.com/help/account-and-billing/cursor-start |
| X Subscription Plus | $8 = ₹761 before tax, about ₹898 with GST | Excluded ("All prices are exclusive of any applicable taxes") | https://x.ai/pricing |
| X Subscription Premium | $30 = ₹2,855 before tax, about ₹3,369 with GST | Excluded | https://x.ai/pricing , https://x.ai/news/x-subscription |

Notes on tax:

- **Claude.** Anthropic's own pricing page shows only USD and says "Prices shown don't include applicable tax" (https://claude.com/pricing). Its help centre says pricing is in local currency where supported, and that "some regions include applicable taxes in the displayed price while others add tax at checkout" (https://support.claude.com/en/articles/8325606-what-is-the-pro-plan). The rupee figures and the GST statement both come from TechCrunch and Croma. I could not open Anthropic's India checkout to confirm the monthly ₹2,399.
- **Google AI Pro.** Neither the India Google One page nor the Gemini subscriptions page mentions tax. The only Google source I found is indirect: Google Play lists India among the countries where it supports tax-inclusive pricing, and Google charges and remits GST on Play purchases by customers in India (https://support.google.com/googleplay/android-developer/answer/138000?hl=en). That suggests, but does not prove, that ₹1,950 is the final price.
- **ChatGPT.** OpenAI's multi-currency billing page lists INR for India and UPI for Go and Plus, but says nothing about tax (https://help.openai.com/en/articles/10421635-multicurrency-billing). The pricing page now fills in prices in the browser; my fetches showed either no price or USD ($8 Go, $20 Plus), so I could not see the rupee price myself.
- **18% GST.** Where I add 18% GST, both the rate and the fact that the vendor adds it are my assumptions. A Google Play Books help page gives 18% for digital purchases by Indian customers, but I saw it only as a search-result summary and did not read the page (https://support.google.com/books/partner/answer/7419067). Card payments in USD may also carry a bank forex markup. I did not quantify it.

### Combinations with Claude Pro

| With Claude Pro annual (₹2,000) | Total | Fits? | With Claude Pro monthly (₹2,399) |
|---|---|---|---|
| + Google AI Pro | ₹3,950 (₹4,301 if GST added) | Yes, only if GST is included | ₹4,349: no |
| + ChatGPT Plus | ₹3,999 (₹4,359 if GST added) | Yes, only if GST is included | ₹4,398: no |
| + GitHub Copilot Pro | about ₹3,123 | Yes | about ₹3,522: yes |
| + X Subscription Plus | about ₹2,898 | Yes | about ₹3,297: yes |
| + Cursor Start | ₹2,649 | Yes | ₹3,048: yes |
| + Google AI Plus or ChatGPT Go | ₹2,399 | Yes | ₹2,798: yes |
| + X Subscription Premium | about ₹5,369 | No | No |
| + prepaid APIs only | at most ₹4,000 | Yes, by construction | at most ₹4,000 (with ₹1,601 for APIs) |

## 2. What a second subscription adds

### ChatGPT Plus (₹1,999)

- **Codex usage.** Plus includes Codex on the web, in the CLI, in the IDE extension and on iOS, with GPT-6.1 Sol and GPT-6 Luna. OpenAI's estimates of local messages per 5 hours on Plus are: GPT-6.1 Sol 15 to 160, GPT-6 Sol 15 to 150, GPT-6 Astra 5 to 45, GPT-6 Luna 350 to 3,000. "Weekly limits may also apply." Cloud tasks use more of the allowance than local messages. Over the limit, Plus users can buy credits. Source: https://developers.openai.com/codex/pricing (redirects to learn.chatgpt.com/docs/pricing). GPT-5.5 leaves Codex on 2026-10-14 (same page).
- **Calling Codex from Claude Code.** `codex exec "<task>"` runs non-interactively, `--json` streams events, `--output-schema` forces structured output, and `codex exec resume` continues a session. By default `codex exec` "reuses saved CLI authentication", which means the ChatGPT sign-in and its Plus limits. Source: https://learn.chatgpt.com/docs/non-interactive-mode . Screenshots can be attached with `-i/--image` (https://learn.chatgpt.com/docs/codex/cli). The feature table lists "Codex SDK, `codex exec`, and scriptable workflows" for Plus (pricing page above). I found no OpenAI statement against calling `codex exec` from another agent. This is the contrast with Antigravity below. So Codex can be:
  - a critic from a second model family: a read-only sandbox (the default) plus screenshots and the brief;
  - one Variant's builder in its own worktree: `--sandbox workspace-write`.
- **Skills.** Codex reads Agent Skills (`SKILL.md`, the open agentskills.io standard) from `.agents/skills` (https://learn.chatgpt.com/docs/build-skills). Friday's skills could load in a Codex Variant too. I did not check whether Emil's licence allows that.
- **Images.** "Built-in image generation uses `gpt-image-2` and counts toward your general Codex usage limits". It uses the limits "3–5x faster on average". In the CLI it is invoked with `$imagegen`. For larger batches, OpenAI suggests setting `OPENAI_API_KEY` so that API pricing applies. Source: https://learn.chatgpt.com/docs/image-generation . The docs show `$imagegen` for interactive CLI sessions; I did not find it confirmed for `codex exec`, so test it once. The API now also offers `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`, both token-priced with no flat per-image price (https://developers.openai.com/api/docs/pricing).
- **Video.** None. "The Sora web and app experiences were discontinued on April 26, 2026. The Sora API will be discontinued on September 24, 2026." (https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation). This settles the prior doc's open question about Sora.

### Google AI Pro (₹1,950)

- **What the India page lists.** Gemini 4 Argon in the Gemini app, 1,000 Google Flow credits a month, "Entry rate limits to agent model in Google Antigravity", "Expanded limits in AI Studio and Jules", and "$10 in monthly Google Cloud credits from Google Developer Programme". Sources: https://one.google.com/intl/en_in/about/google-ai-plans/ , https://gemini.google/in/subscriptions/
- **Gemini CLI is gone for this plan.** "Starting June 18, 2026, Gemini Code Assist IDE extensions stopped serving requests for the Gemini Code Assist for individuals, Google AI Pro, and Google AI Ultra tiers. This also applies to usage of Gemini CLI." Users are pointed to Antigravity. Sources: https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals and https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli (2026-05-19). Gemini CLI still works with a paid Gemini API key (same blog post).
- **Antigravity limits on Pro.**
  - Quota: "A high, generous quota, refreshed every five hours until the weekly limit is reached". Free users get "A meaningful quota, refreshed weekly". No numbers are published. Source: https://antigravity.google/docs/plans
  - Overage: purchased AI credits can pay for usage beyond the quota. Setting **AI Credit Overages** to "Never" keeps spending at zero (same page).
  - Models on Pro: Gemini 3.8 Flash, Claude Sonnet 5.5 and Opus 5.5 ("Available on Google AI Pro for non-trial subscriptions only"), Claude Sonnet and Opus 4.6 (both removed on 2026-11-02), and GPT-OSS-120b. Gemini 4 Argon and Gemini 3.1 Pro are not available on Pro. Source: https://antigravity.google/docs/models
- **Antigravity cannot be wrapped by Claude Code.** The FAQ says: "Wrapping `agy` inside third-party coding agents or applications, or automating account rotation, is not supported under consumer plans." It also says using third-party software to access Antigravity "can result in suspension or termination of your account". Google's recommendation is: "To use a third-party coding agent with Gemini, we recommend using a Gemini Enterprise or Google AI Studio API key." Source: https://antigravity.google/docs/faq . Headless `agy -p` exists "for direct scripting and CI workflows" (https://antigravity.google/docs/cli/headless/). In practice:
  - an Antigravity session that Somya starts by hand can be one slot in a Fleet;
  - a Claude Code skill that shells out to `agy` is outside the terms.
- **Generation an agent can reach.**
  - *Inside Antigravity.* Its agent hands image requests to a built-in `image-generator` subagent that uses Nano Banana 2 (Antigravity CLI v1.2.16, 2026-10-03: https://antigravity.google/docs/changelog/ ; https://antigravity.google/docs/models). Whether this draws on quota, and whether the free plan has it, is not stated. Under the rule above, only Antigravity sessions Somya starts can use it.
  - *Through the Gemini API, paid by the plan's credit.* AI Pro includes a "$10 GenAI and Cloud monthly credit" (https://developers.google.com/program/plans-and-pricing). Google's announcement says "you can use the credits towards Gemini API" (https://blog.google/innovation-and-ai/technology/developers-tools/gdp-premium-ai-pro-ultra/, 2026-01-27). The Gemini API billing page sets three conditions: "Prepay users must first purchase Prepaid credits before any eligible Google Cloud credits can be applied", Cloud credits "are consumed before your Prepay credit balance", and "When your Prepay credit balance on the billing account hits $0, Google Cloud credits will no longer be consumed" (https://ai.google.dev/gemini-api/docs/billing). So the cheapest setup is a one-time $5 prepay, the minimum, that sits as a gate. Prepaid credits expire after 12 months. The Developer Program FAQ says its Cloud credits "expire a year after grant", but that answer was written for the old standalone Premium plan (https://developers.google.com/profile/help/benefits).
  - *By hand only.* Flow and the Gemini app. Flow has no API in the pages I read.
- **Flow credits, for video made by hand.** Everyone gets 50 Flow credits a day, and AI Pro adds 1,000 a month. Costs per generation: Omni Flash 720p, 8 s, 12 credits; Veo 3.1 Fast 20 (non-Ultra); Veo 3.1 Lite 10; Veo 3.1 Quality 100. 1080p upscaling is free for subscribers. Monthly credits do not roll over. Source: https://support.google.com/flow/answer/16526234?hl=en . So 1,000 credits are about 83 Omni Flash 8-second clips, and the free 50 a day are about 4 clips a day.
- **Jules.** Pro allows 100 tasks per rolling 24 hours, 15 at once; the free plan allows 15 tasks and 3 at once (https://jules.google/docs/usage-limits/). Jules runs in the cloud against GitHub repos. Jules publishes an API reference page (https://jules.google/docs/api/reference/), but I could not read it, so whether Claude Code may drive Jules is unverified.
- **API or Cloud credits.** Yes: the $10 a month above. The plan's Antigravity quota is not API access.

### GitHub Copilot Pro ($10): a candidate not covered in the prior doc

- Copilot Pro costs $10 a month. Since 2026-06-01 it includes 1,500 GitHub AI Credits a month (1,000 base plus 500 flex), where 1 credit = $0.01. Credits are consumed at the listed token price of the model used. All plans include Copilot CLI. Sources: https://docs.github.com/en/copilot/get-started/plans , https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing
- **Models on Pro:** GPT-5.6 Terra, GPT-5.4, GPT-5.4 mini, GPT-5.3-Codex, GPT-6 Luna, GPT-5.6 Luna, Gemini 3.7 Flash, Gemini 3.8 Flash, Grok 4.5 to 4.7, Kimi K3, Claude Sonnet 5 and 5.5, and Claude Haiku. Not on Pro: GPT-6.1 Sol, GPT-6 Sol, GPT-6 Astra, Gemini 4 Argon, and Claude Opus or Fable. Source: https://docs.github.com/en/copilot/reference/ai-models/supported-models
- **Prices per 1M tokens (input / output):** GPT-5.6 Terra $2 / $12, Gemini 3.8 Flash $0.75 / $3.75 (promotional to 2026-12-31), GPT-6 Luna $0.10 / $0.50. Source: https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
- **Programmatic use:** `copilot -p "<prompt>"`, with tool approval flags (https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli). Images and PDFs can be attached on all plans (https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli).
- **Overage:** a personal budget with "Stop usage when budget limit is reached" blocks extra usage. Without that option, "usage **will not** be stopped" (https://docs.github.com/en/billing/how-tos/set-up-budgets). A budget of $0 with stop enabled keeps the plan at a fixed $10 (this is my reading of the page). Overage is billed afterwards, not prepaid, so the stop setting has to be checked.
- **What it adds:** a panel of three families (GPT, Gemini, Grok) from one CLI, for pstack-style interrogate and arena panels or a critic from another family. It does not add frontier GPT or Gemini models, image or video generation, or much capacity for building Variants.

### Cursor Start (₹649) and Cursor Pro

- **What Start includes.** Grok 4.7, 4.6 and 4.5 at fixed medium effort, and Composer 2.5. "Auto mode and third-party models ... are not available". Cloud Agents are included. Bugbot, the Cursor SDK, Automations and on-demand spend are not. When the monthly pool runs out, AI pauses until the next cycle. Source: https://cursor.com/help/account-and-billing/cursor-start
- **Headless use.** The Cursor CLI has a headless print mode (`agent -p`, with `--force` to write files; https://cursor.com/docs/cli/headless). Whether it works on Start without the excluded SDK is not stated.
- **What it adds over Claude Code.** Given the parallel-tooling findings (Claude Code already covers Fan-outs, Fleets and Unattended runs), Start adds:
  - a second model family (Grok);
  - cloud VMs for one Variant, so that slot does not use the Mac;
  - Cursor reads `.claude/skills`, per the prior pstack-portability doc.

  Somya's input that reviews call the Start models "not enough" matches the fixed medium effort. Start suits one cheap Variant builder, not the critic.
- **Cursor Pro.** The $20 Pro plan no longer appears on the pricing page; the tiers shown there are the X Subscription tiers below.

### X Subscription

- Plus costs $8. It covers Grok chat and Imagine, Grok API access (billed separately) and Cursor with Grok models; it has no cloud agents and no video.
- Premium costs $30. It adds Grok Bot, "Make stunning AI images & videos" and "Cloud agents & automations". Third-party models in Cursor are "billed separately".
- Prices exclude tax. Source: https://x.ai/pricing
- Premium does not fit beside Claude Pro. Plus fits (about ₹2,898 in total) but adds less than Cursor Start does for coding, and it is not tax-inclusive.

### Low-cost and free options

- **Google AI Plus (₹399).** It does not support Gemini CLI ("Tiers not listed above, including Google AI Plus, are not supported": https://geminicli.com/docs/resources/quota-and-pricing/). It gets the same Antigravity models as the free plan and 200 Flow credits. It includes no Cloud credit. Little for agents.
- **ChatGPT Go (₹399).** Codex runs only in the desktop app on Go, with GPT-6 Luna (https://learn.chatgpt.com/docs/pricing). It cannot be scripted.
- **Free tiers available to anyone, for the no-second-subscription option:**
  - *Antigravity free plan* ($0): Gemini 3.8 Flash with a weekly quota, and India is a supported country. Sources: https://antigravity.google/pricing , https://antigravity.google/docs/faq
  - *Jules free plan*: 15 tasks a day, 3 at once.
  - *Gemini 3.8 Flash on the free API tier*: input and output are "Free of charge", but "Used to improve our products: Yes" (https://ai.google.dev/gemini-api/docs/pricing). Image and video models have no free API tier.
  - *Flow*: 50 credits a day.

## 3. No second subscription: Claude Pro + prepaid generation

**Generation with about ₹2,000 a month.** I reuse the prior doc's per-Surface paths. Each assumes 3 Variants with 4 images each, plus one 8-second clip for the winner, generated 3 times.

| Path | USD per Surface (prior doc) | ₹ before GST | ₹ with 18% GST |
|---|---|---|---|
| Low: Grok Imagine image $0.02 + Grok video lite $0.02/s | $0.96 | ₹91 | ₹108 |
| Typical: Nano Banana 2.1 1K $0.0336 + Veo 3.1 Fast 1080p $0.12/s | $3.69 | ₹351 | ₹414 |
| High: Nano Banana Pro $0.134 + Veo 3.1 Standard $0.40/s | $11.21 | ₹1,067 | ₹1,259 |

Re-checked today and unchanged:

- Nano Banana 2.1: $0.0336 per 1K image, $0.0504 per 2K; half that on the Batch API.
- Nano Banana Pro: $0.134 per 1K/2K image.
- Veo 3.1: Lite $0.05/$0.08 per second (720p/1080p), Fast $0.10/$0.12, Standard $0.40.
- Source: https://ai.google.dev/gemini-api/docs/pricing
- xAI prices still start at $0.02 per image and $0.02 per second: https://docs.x.ai/docs/models

New on the Gemini side:

- Nano Banana 2 Lite at $0.0336 per 1K image.
- Gemini Omni Flash video, about $0.10 per second at 720p (same Gemini pricing page).

Surfaces a month that a given headroom buys (my arithmetic, ₹95.16 to the dollar, 18% GST assumed on prepaid USD credits):

| Headroom | USD after GST | Low | Typical | High |
|---|---|---|---|---|
| ₹2,000 (Claude Pro only) | $17.81 | 18.6 | 4.8 | 1.6 |
| ₹1,351 (with Cursor Start) | $12.03 | 12.5 | 3.3 | 1.1 |
| ₹877 (with Copilot Pro) | $7.81 | 8.1 | 2.1 | 0.7 |
| $10 Cloud credit (with Google AI Pro; no GST on a credit, assumed) | $10.00 | 10.4 | 2.7 | 0.9 |
| ₹1 (with ChatGPT Plus) | 0 | 0 | 0 | 0 |

If the video is made by hand in Flow from the free 50 credits a day, the API only pays for images. The typical path's images cost about $0.81 a Surface (my arithmetic: 24 images × $0.0336). That makes about 9 Surfaces a month from ₹877 and about 22 from ₹2,000.

**Keeping prepaid spending capped:**

- **Gemini API.** Buy credits in advance (minimum $5, maximum $5,000). Auto-reload is something you set up yourself, and there is a monthly auto-charge limit. At a $0 balance every key on the billing account stops. Credits expire 12 months after purchase, so unused credit carries forward for up to a year. Source: https://ai.google.dev/gemini-api/docs/billing
- **xAI.** Prepaid credits only, while the invoiced spending limit stays at $0 (brief, from https://docs.x.ai/console/billing).
- **OpenAI API, for a GPT critic or gpt-image-2.** Prepaid billing; "The minimum purchase is $5"; automatic recharge is optional. Source: https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing

**Claude usage credits:**

- **They can be prepaid and capped.** Enabling them asks you to set a monthly spend limit (or "Set to unlimited"), then "You'll then need to prepay to cover usage beyond your plan limits. Click 'Add funds'". Auto-reload is a separate option you can leave off. Use continues "until you reach your monthly spend limit, or your balance runs out with auto-reload off". They apply to Claude Code too, and in most regions they do not expire. Source: https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans
- **They are billed at "standard API rates".** On the prior doc's session model, an hour-long Sonnet 5.5 session costs about $1.48 and an Opus 5.5 session about $2.95. So ₹2,000 (about $17.8 after an assumed 18% GST) buys about 12 Sonnet hours or 6 Opus hours a month. The prior doc estimated that 10 sessions a day on Pro would cost about $326 a month at API rates. Usage credits are therefore an overflow valve for a bad day, not a substitute for a second plan. Whether they are charged in INR and include GST is not stated.
- **Minimum purchase.** Not stated.

## 4. Does a second model family help Friday?

**As a critic in the build loop and at the Variant gate: probably yes.** The evidence:

- LLM judges show self-preference: they "score [their] own outputs higher than others' while human annotators consider them of equal quality", and the bias grows with the model's ability to recognise its own text (Panickssery, Bowman and Feng, 2024: https://arxiv.org/abs/2404.13076).
- Judges also rate lower-perplexity text higher "regardless of whether the text was self-generated" (Wataoka et al., 2024: https://arxiv.org/html/2410.21819v1). Lower-perplexity text, as I read it, means text in a style familiar to the judge, which is what its own family produces.
- A panel of judges from "disjoint model families" outperformed a single large judge, "exhibits less intra-model bias" and was "over seven times less expensive" (Verga et al., 2024, "Replacing Judges with Juries": https://arxiv.org/abs/2404.18796). This matches pstack's own rationale that "the adversarial signal comes from model diversity" (`pstack/skills/interrogate/SKILL.md`, quoted in the pstack-portability doc).

*Inference:* Friday's loop pairs a cheap implementer with a strong critic, and on a Claude-only setup both are Claude. A critic from another family (GPT through `codex exec` or the API; Gemini through the API) should catch more of what a Claude implementer tends to get wrong. Every study above is on text. None tests a critic judging screenshots of UI against a brief, so the size of the gain for Friday is unknown.

**For more diverse Directions and Variants: little evidence of a gain.**

- Wenger and Kenett found that "LLM responses are much more similar to other LLM responses than human responses are to each other", across a broad set of models (https://arxiv.org/abs/2501.19361; published in PNAS Nexus in 2026 per https://academic.oup.com/pnasnexus/article/5/3/pgag042/8529001).
- A 2026 follow-up across three years of models found "a statistically significant decrease in model output diversity over time", "converging in creative substance across models" (Patel et al., 2026-08-19: https://arxiv.org/abs/2608.19437).

*Inference:* adding GPT or Gemini to Discover will widen the pool of Directions only a little. Seed strings, explicit constraints and Somya's own picks at the Direction gate matter more. Building one Variant in a different harness (Codex, Antigravity, Cursor) may still give it different defaults, such as component choices and styling habits. I found no evidence either way.

**For the multi-model panels pstack used (interrogate, arena):** a Claude-only setup loses the families pstack gets its signal from. Cheap ways to restore one or more:

- Copilot Pro: GPT, Gemini and Grok from one CLI;
- `codex exec` on ChatGPT Plus: GPT;
- prepaid API calls: any family, paid per call.

Under my assumption of 15k input and 2k output tokens per critic call:

| Model | Cost per call | ₹ per call |
|---|---|---|
| Gemini 3.1 Pro on the API ($2 / $12 per 1M) | about $0.054 | about ₹5, or ₹6 with GST |
| Gemini 3.8 Flash ($0.75 / $3.75) | about $0.019 | about ₹2 |
| GPT-5.6 Terra on Copilot | about $0.054, or 5.4 credits | 1,500 credits ≈ 270 calls a month |

## Assumptions

1. Claude Pro stays on annual billing at ₹2,000 a month, which means one ₹24,000 payment a year. Every combination with a large second plan depends on it.
2. 18% GST is added to plans priced in USD (Copilot, X) and to prepaid USD API credits, unless a source says the price is tax-inclusive. This is a worst case for budgeting; it is not a statement of the tax law.
3. The $10 Google Cloud credit is not taxed when consumed, and it applies to Gemini API image and video models. Google says the credits apply "towards Gemini API"; I did not find an exclusion list for the AI Pro credit.
4. Per-Surface generation paths, token counts per session and per critic call are the prior doc's or mine, as labelled. Real use may differ by 2x either way.
5. One prepaid $5 Gemini balance can sit untouched while the Cloud credit is consumed first, as the billing page describes. It costs about ₹47 a month spread over a year (my arithmetic, with GST assumed).

## What I could not verify

- Whether Google AI Pro's ₹1,950 and ChatGPT Plus's ₹1,999 are final, GST-inclusive amounts. The vendors' own pages do not say, and this is the deciding fact. The only safe check is the checkout screen.
- Claude Pro's monthly rupee price (₹2,399) on Anthropic's own pages: it is from Croma only. claude.com/pricing shows USD only.
- Whether Gemini API prepay from India is charged in INR with GST, or in USD.
- Whether the AI Pro Cloud credit is granted to Indian accounts in practice. The India plan page lists it, but I did not see a country list for it.
- Antigravity numbers. No per-plan quota figures are published. It is also not stated whether the built-in image-generator works on the free plan or what it costs in quota.
- Whether `$imagegen` works under `codex exec` (it is documented for interactive CLI use).
- Whether Cursor Start can run the headless CLI, and whether it is still open to new sign-ups after the X Subscription launch.
- Whether GitHub adds GST for Indian personal accounts.
- Whether Jules may be driven by another agent through its API.
- I tried to read the prices in Somya's own Chrome. Two browsers were connected and the tool needs a person to pick one, so I skipped it.

## Sources

All read 2026-10-14 unless marked.

Pricing and tax:
- Claude pricing (USD, tax excluded): https://claude.com/pricing
- Claude Pro plan (regional pricing and tax wording): https://support.claude.com/en/articles/8325606-what-is-the-pro-plan
- Claude usage credits: https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans
- Claude India prices (secondary): https://techcrunch.com/2026/07/13/anthropic-starts-localizing-claude-pricing-for-india-its-biggest-market-after-the-us/ , https://www.croma.com/unboxed/anthropic-claude-ai-india-local-pricing-plans-confirmed
- Google AI plans, India: https://one.google.com/intl/en_in/about/google-ai-plans/ , https://gemini.google/in/subscriptions/
- Google AI plans, US (full feature table): https://one.google.com/about/google-ai-plans/
- Google Play tax-inclusive pricing and GST in India: https://support.google.com/googleplay/android-developer/answer/138000?hl=en
- ChatGPT pricing (India pages render prices client-side): https://chatgpt.com/hi-IN/pricing/ , https://chatgpt.com/en-IN/pricing/
- OpenAI multi-currency billing: https://help.openai.com/en/articles/10421635-multicurrency-billing
- ChatGPT Plus India GST (secondary): https://storyboard18.com/digital/chatgpt-begins-testing-local-pricing-in-india-plans-start-at-rs-1999-per-month-78928.htm , https://t2online.in/tech/tech-news/openai-introduces-chatgpt-go--a-new-plan-for-india--with-support-for-upi-payments/2000627
- GitHub Copilot plans and billing: https://github.com/features/copilot/plans , https://docs.github.com/en/copilot/get-started/plans , https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing , https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing , https://docs.github.com/en/copilot/reference/ai-models/supported-models , https://docs.github.com/en/billing/how-tos/set-up-budgets , https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses
- Cursor: https://cursor.com/pricing , https://cursor.com/help/account-and-billing/cursor-start , https://cursor.com/help/models-and-usage/usage-limits , https://cursor.com/docs/cli/headless
- X Subscription: https://x.ai/pricing , https://x.ai/news/x-subscription (2026-10-12)
- Exchange rate: https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=INR

Agents and limits:
- Codex pricing and limits: https://developers.openai.com/codex/pricing (redirects to https://learn.chatgpt.com/docs/pricing)
- `codex exec`: https://learn.chatgpt.com/docs/non-interactive-mode ; Codex CLI: https://learn.chatgpt.com/docs/codex/cli ; Codex SDK: https://learn.chatgpt.com/docs/codex-sdk ; skills: https://learn.chatgpt.com/docs/build-skills
- Codex image generation: https://learn.chatgpt.com/docs/image-generation
- Sora discontinuation: https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation
- Gemini CLI end for AI Pro: https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals , https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli , https://geminicli.com/docs/resources/quota-and-pricing/
- Antigravity: https://antigravity.google/pricing , https://antigravity.google/docs/plans , https://antigravity.google/docs/models , https://antigravity.google/docs/faq , https://antigravity.google/docs/cli/headless/ , https://antigravity.google/docs/changelog/
- Jules: https://jules.google/docs/usage-limits/ , https://jules.google/docs/api/reference/ (exists; not read)
- Google Developer Program credit: https://developers.google.com/program/plans-and-pricing , https://developers.google.com/profile/help/benefits , https://blog.google/innovation-and-ai/technology/developers-tools/gdp-premium-ai-pro-ultra/ (2026-01-27)
- Copilot CLI: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli , https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli

Generation:
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini API billing (Prepay, Cloud credits, auto-reload): https://ai.google.dev/gemini-api/docs/billing
- Google Flow credits: https://support.google.com/flow/answer/16526234?hl=en
- xAI models and prices: https://docs.x.ai/docs/models
- OpenAI API pricing (image models): https://developers.openai.com/api/docs/pricing ; image guide: https://developers.openai.com/api/docs/guides/image-generation
- OpenAI prepaid API billing: https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing

Model-family evidence:
- Panickssery, Bowman, Feng (2024), LLM Evaluators Recognize and Favor Their Own Generations: https://arxiv.org/abs/2404.13076
- Wataoka et al. (2024), Self-Preference Bias in LLM-as-a-Judge: https://arxiv.org/html/2410.21819v1
- Verga et al. (2024), Replacing Judges with Juries: https://arxiv.org/abs/2404.18796
- Wenger, Kenett (2025), We're Different, We're the Same: Creative Homogeneity Across LLMs: https://arxiv.org/abs/2501.19361 ; journal version: https://academic.oup.com/pnasnexus/article/5/3/pgag042/8529001
- Patel, Crossman, Aggarwal, Wenger (2026), Are LLMs becoming similarly creative?: https://arxiv.org/abs/2608.19437

Prior Friday research (read 2026-10-14 from their branches):
- `docs/research/subscriptions-and-costs.md` (branch `research/subscriptions-and-costs`)
- `docs/research/parallel-tooling.md` (branch `research/parallel-tooling`)
- `docs/research/pstack-portability.md` (branch `research/pstack-portability`)

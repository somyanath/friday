# Design method sources: Anshu Chimala's post and String Seed of Thought

Ticket: #6. Research date: 2026-10-13. Every web source below was "read 2026-10-13".

## Short answer

What Friday's design skill needs to know to decide "what does it do in each phase and at each gate?":

- **The post's three phases map one-to-one onto Friday's.** Anshu's Discover / Define / Deliver (loosely the Double Diamond) are the same three words as Friday's phases. Discover is Techniques 1-2, Define is 3-5, Deliver is 6-7. Source: https://www.lennysnewsletter.com/p/how-to-turn-your-ai-into-a-world (read 2026-10-13).
- **Discover is the only phase that is cheaply Divergent.** T1 (seed string) and T2 (ambitious prompt list) generate many Directions. The post stops at "pick your favourites" and never says how many to keep; Friday's three-or-four at the Direction gate is Friday's own number, not the post's.
- **Define's engine is the critic loop, not a gate.** T3 is an automated screenshot-only critic scoring out of 10, stopping at 9/10, starting with one or two iterations. It is a pre-filter inside a Variant's build, not a replacement for Somya's Variant gate. The post puts human judgment in setting criteria and stopping rules, and in the final eye; it does not describe a gate.
- **T4 and T5 are enrichment steps with real cost and key handling.** Image generation fits every Variant; video generation is costly and slow and should run only for the winner (this already matches Friday's rule on the map).
- **Deliver is human taste.** T6 is explicit that the author's "trained eye" decides what to cut. That is the Ship gate. **T7 ("Remove AI tells") is paywalled and UNREAD**; the only thing known is its heading. Do not specify T7 from this source.
- **The seed is not SSoT as published.** Sakana's SSoT has the model generate the random string in its head. Anshu's version has a shell script generate the string (an external PRNG) and the model reads it for inspiration. That is a deliberate adaptation, arguably stronger for diversity because the entropy no longer depends on the model.
- **Emil's skills already cover T6 and T7-by-name fully, T2 partly, but not T1, T3, T4 or T5.** Detail in "Overlap" below.

## Technique by technique

Source for all rows unless noted: the Lenny's Newsletter post (public part). Prompts are quoted only where short and publicly visible. Counts that the post does not state are marked "not stated".

### Discover

**T1. Seed strings.**
- Problem shown: four Claude Code instances given "Build me a landing page for my productivity app." returned almost the same page (purplish gradient, text left, graphic right). Adding "Give me something totally unique. Make every design decision completely at random." gave different but still uniform pages: the model "can't inherently act randomly".
- Method: a three-step procedure prompt. (1) Generate a long, random alphanumeric string using a shell script. (2) Define the creative direction (colour scheme, layout, typography, etc.) from the string, looking for subpatterns and special numbers. (3) Use judgment to bring it to life. Plus: "Don't reveal the string in the design."
- Counts: four runs per condition in the demo. String length: "long", no number given. Loop: none.
- Human judgment: implicit only (looking at the outputs). The post does not say how many seeded runs to make.
- Friday note: this is the natural Fan-out for Discover: N subagents, each with its own script-generated seed, each returning a short Direction brief rather than a built page.

**T2. Ambitious prompts and idea lists.**
- Three example prompts push a specific inspiration: pixel-art video game ("Each section should feel like a still from a video game..."), isometric living 3D city, and a radically asymmetric layout ("Break all the rules but still make it look good.").
- Three-step system for finding ideas: (1) ask for "as many ideas as you can, with short, high-level descriptions. Go broad, not deep"; (2) visualise favourites, note your reaction, then ask the AI to sharpen one using your stated tastes (worked example: "Industrial Control Panel", with the author's likes and dislikes written as bullets); (3) iterate, then ask "Can you write a concise prompt that an AI agent could use to build an initial POC page with this?"
- Counts: idea-list length is "as many as you can" (not bounded). Refinement rounds: "until you're satisfied" (not bounded). One example refined.
- Human judgment: strongest here. The post says pasting AI ideas back into AI gives generic results; "when you actively steer the design direction, you end up with something only you could have created". Also: try ideas that sound terrible, and save failed prompts to re-run on newer models.
- Friday note: the output of step 3 (a concise build prompt) is exactly a Direction brief handed to a Variant agent.

### Define

**T3. Subagent critic loop.**
- Setup: coding agent builds; a separate stronger model (the post uses "Fable 5") acts as critic. Each iteration: capture screenshot; invoke critic in a fresh context with only the screenshot (no code, no earlier critiques); critic names the aesthetic, imagines how a top studio would execute it, lists the biggest gaps, scores out of 10.
- Critic guidance: think about structure and fine detail; penalise overdone or obviously AI-generated patterns; give tight specific feedback; be bold and opinionated. Same critic prompt every iteration.
- Stop rule: the builder is done only when the critic "independently deems it 9/10 or higher"; that criterion is kept out of the critic prompt.
- Counts: threshold 9/10. Loop length: start with "one or two iterations" and check convergence before allowing more. Cost claim: the critic model was under 10% of output tokens, and a direct redesign by it would have cost twice as much.
- Tips with a ranking of criteria quality: "Bad" (judge if it looks beautiful, not AI-generated), "OK" (visualise a top studio's execution, judge against it), "Great" (rank 5 designs, 4 professional examples plus your screenshot, by polish and taste). Supply example images as a baseline or moodboard, not a target. Use a bigger model for the critic, a capable (not tiny) model to implement.
- Human judgment: the human sets criteria and stopping rules, and picks reference images. The critic does not replace the final look.
- Friday note: the "Great" form needs reference screenshots; Friday has none yet. Open question for a later ticket: where those references come from.

**T4. Image generation.**
- Why: coding agents default to gradients, shapes and basic patterns, which are AI tells. Prompt (short, public): "The design is pretty plain. Add more personality using image generation. Consider shaders or 3D effects in combination with images..." plus "Verify that your work looks right frame-by-frame in the browser."
- Setup options: built-in image tools (Codex, Antigravity, Grok Build); Codex CLI billed to a ChatGPT subscription (avoids API cost); or a separate OpenAI or Gemini API key with a tight spend limit, kept in a gitignored `.env.agents` file noted in AGENTS.md/CLAUDE.md as dev-only, never shipped.
- Counts: four before/after GIFs shown; number of images per page not stated.
- Human judgment: not stated beyond choosing setup and key hygiene.
- Friday note: the post's own key advice (separate key, spend limit, gitignored file) is consistent with the map's budget cap and visibility rules.

**T5. Video generation.**
- Use A, animated graphics: generate a looping clip on a solid colour background, then chroma-key or use a video matting model. For glass, render over the page background colours first so refraction is baked in. Example (short, public): "Have the crystal splinter apart and slowly spin around." The model is told to find recent video-generation and background-removal models itself.
- Use B, transitions: many video models interpolate between keyframes. Make a start frame with image generation, generate a clip to the next state, seed the next clip from the previous clip's last frame, and scrub clips with scroll. The suitcase demo has three states (floating, landing and popping open, contents landing in), so two transitions. Built in one prompt. Model named: Seedance 2.5 ("strong physics and consistency").
- Aggregator: fal.ai, so one key covers several models. Clip length and loop length: not stated.
- Human judgment: not stated beyond choosing the effect.
- Friday note: the post gives no cost figures for video; Friday's map already limits video to the winning Variant.

### Deliver

**T6. Cut what adds no value.**
- Worked example: a calorie tracker. The author listed four problems in the first AI design (pink glows, random colour highlights on text, extra labels and empty space, custom controls worse than native iOS ones), then asked for three changes: image-centric grid; no gradients, glows or unnecessary containers; truly minimalist and "Apple-native".
- Counts: four problems, three changes, one revision pass shown.
- Human judgment: explicit. "To my trained eye, the result is much better." The model will not strip things on its own because removing is risky for it; "the model needs a push from you". The prompt to the human: "ask yourself what really needs to be there".

**T7. Remove AI tells.** UNREAD (paywalled). The page returned only the heading "Technique 7: Remove AI tells" and a subscribe wall, so prompts, counts, loop lengths and any text after T7 (a conclusion, further techniques, or other follow-up) are unknown. A third-party page titled "8 AI Design Techniques to Break Safe Mode" (https://mikareyes.com/ai/8-ai-design-techniques-to-break-safe-mode, seen only as a search snippet 2026-10-13) suggests there may be an eighth item, but I did not read it and cannot verify what it reproduces; treat as unconfirmed.

### Anshu's other channels

- Substack follow-up (public, read 2026-10-13): "To get great design at half the price, give your AI an Idiot Boss", 2026-09-13, https://anshuc.substack.com/p/to-get-great-design-at-half-the-price. Claim: for design, make the strongest model the doer and a small cheap model the coordinator (browser testing, passing screenshot and findings back), because taste lives in the big model's weights and describing the work to a weaker model is lossy. In his test the big-model-as-boss route cost more and took about 7x as long as the baseline for one app, and "Idiot Boss" cut cost by more than half and time by 30%. The coordinator's instruction: minimal prompts, product brief plus latest screenshot, "no technical opinions", stop after 3 rounds or when the worker says it is complete. Single author's test on two prompts; no independent replication. Relevance: it argues against a design setup where an orchestrator writes detailed specs for cheaper Variant agents, which affects how Friday spawns Variant agents (a question for the parallel-work and budget tickets).
- Substack note, 2026-09-04 (https://substack.com/@anshuc, read 2026-10-13): a closed-loop image-generation trick for 3D games with a Blender MCP; the note was truncated by a login wall, so only the first step is known.
- Substack note, 2026-09-03: author says follow-ups that go deeper on these ideas are coming. None on seed strings, critic loops or AI tells found as of 2026-10-13.
- X (https://x.com/anshuc, latest posts to 2026-10-12, read 2026-10-13): demos and model comparisons; no post found that publishes extra prompts for T1-T7. He states a view that Claude models lead on frontend taste (2026-10-04 post); an opinion, not evidence.
- There are no published multi-surface cost numbers for the loop; cost figures exist only for the post's own demos.

## Paper: String Seed of Thought (SSoT)

Sources: arXiv 2510.21150 (https://arxiv.org/abs/2510.21150, full text via arxiv.org/html/2510.21150v3, read 2026-10-13); Sakana AI blog https://pub.sakana.ai/ssot/ (dated April 2026, authors Kou Misaki and Takuya Akiba; read 2026-10-13). Title: "String Seed of Thought: Prompting LLMs for Distribution-Faithful and Diverse Generation".

- **Problem.** LLMs fail at "Probabilistic Instruction Following" (PIF): asked to flip a fair coin 1,000 times, the blog's example gives a heavily skewed result (24/76). They also collapse to a few answers in open tasks, called "Diversity-Aware Generation" (DAG). Percentages on the blog's DAG panel are labelled illustrative, not measured.
- **Method.** Add to the prompt: first output a complex random string in tags, then manipulate that string to make any stochastic decision, then answer. No training, no tools. The model chooses its own manipulation: "sum-mod" (sum character codes, take the remainder) for even odds, a rolling hash for biased odds. For open tasks (e.g. a fable) it builds a template (setting, traits, conflict, moral...) and picks each part from different segments of the string.
- **How seeds drive diversity.** A different string gives different arithmetic, which gives different picks per component. The paper's strategy analysis found creativity prompts mostly use a template with repeated local sampling from the string rather than one global choice.
- **Simplified DAG prompt (public, Appendix D.4 on the blog):** "You must produce exactly one unique and diverse answer. To do this, first generate a complex random string between <random_string> and </random_string>, and manipulate this string to guide any stochastic decisions within <thinking> and </thinking> tags. Then, provide your final answer, enclosed within <answer> and </answer> tags." The full experimental prompts are in the paper's Appendix A.
- **Counts used in the paper.** PIF: 5 setups (2-, 3-choice, biased 2-, 3-choice, biased 9-choice; action spaces 2 to 64 in a scaling test), 100 trials per set repeated 10 times, 5 models, metric JS divergence. Rock-paper-scissors: 10 "black belt" bots, 100 games each. Diversity: NoveltyBench, 8 responses per prompt. There is no recommended count of seeds or runs for designers; "8 per prompt" is the evaluation protocol, not a recommendation.
- **Evidence.** PIF: SSoT lowers JS divergence across five models and approaches a real PRNG on DeepSeek-R1; one exception (QwQ-32B on unbiased 2-choice, 2.43 baseline vs 3.39 SSoT). Beats high temperature, few-shot, prompt ensembling and sequential sampling for DeepSeek-R1. RPS: SSoT scores near zero against exploiting bots; baseline and simple prompts lose. DAG (DeepSeek-R1, NoveltyBench curated, "Distinct" of 8): baseline 4.70, T=1.0 5.57, paraphrase 5.63, SSoT 6.19; Utility 5.17 baseline vs 5.92 SSoT (T=1.0 scored 6.03, higher on utility). WildChat: Distinct 3.39 to 5.25. Longer reasoning traces gave more uniform integers.
- **Limits stated by the authors.** (1) Needs reasoning ability; models under about 8B parameters often fail. (2) Bias propagates if the string has positional bias and the model takes a "lazy" strategy such as using only the first character. (3) Not useful, and possibly distracting, for single-answer tasks. Also from the blog: DAG gains were shown for one model (DeepSeek-R1) only, and the paper measures diversity of text answers, not visual design quality.
- **What this means for Anshu's use.** Evidence supports "seed strings increase answer diversity" on text benchmarks. It does not test design outputs, seed length, or whether externally generated seeds beat in-head ones. Anshu's evidence is four screenshots per condition, no scoring. Treat T1 as plausible and cheap, not proven for UI.

## Overlap with Emil's local skills

Read-only, paraphrased from `~/.claude/skills/emil-*/SKILL.md` (paid content; not reproduced). I read the opening sections of emil-get-creative, emil-unslop-design, emil-ui-polish, emil-ui-review, emil-prototype and emil-prep-for-prod, not every file in each.

| Technique | Emil coverage | How |
| --- | --- | --- |
| T1 seed strings | None found | No random-seed step in emil-get-creative or emil-prototype. emil-get-creative does show a seed in its generator (a visible seed that makes a variation reproducible), but that is a generator parameter, not an LLM-inspiration seed. |
| T2 ambitious prompts, idea lists, refine, write the build prompt | Partial | emil-get-creative: starts from a vibe, researches the visual tradition behind it, compresses into 5-10 rules and named patterns, and has Somya strike or keep rules before any code. emil-prototype: builds several genuinely different versions behind a live picker, each on a named axis (layout, density, personality, motion, interaction). Together these resemble a Direction brief then Variant, but neither does "list many broad ideas" the way T2 does. |
| T3 critic loop | None found | emil-ui-review is a review method (ranked by severity; interaction, accessibility, layout stability, motion, spacing, type, surface) run on a diff or page, with no fresh-context screenshot-only critic, score, or stop threshold. |
| T4 image generation | None found | Not in the skills I read. |
| T5 video generation | None found | emil-animations / emil-prep-for-prod cover motion code, not generated video. |
| T6 cut what adds no value | Yes | emil-unslop-design has a "subtract first" step: walk every element and ask what breaks if it is gone; delete if nothing. Matches T6 closely, including the point that agents are additive. |
| T7 remove AI tells | Yes by name (T7 content unread) | emil-unslop-design strips the visual tells (indigo gradients, glass cards, emoji icons, centred hero sameness, etc.) in a fixed order (colour, type, layout, decoration, icons, copy, motion), then adds back a point of view. Cannot compare with Anshu's T7 because it is unread. |
| Polish pass | Yes (beyond the post) | emil-ui-polish (font rendering, layout shift, hit areas, interaction states), emil-prep-for-prod (nine-lane pre-launch sweep: accessibility, performance, mobile, forms, states, motion, theming, content, SEO), emil-design-foundations (hierarchy, spacing, type, colour, copy; description only). The post has nothing comparable; this is Deliver content beyond T6-T7. |

Net: Friday's design skill can lean on Emil for Deliver (T6, T7, polish, ship check) and for part of Discover (T2-like direction work). It must supply new content for T1 (seed), T3 (critic loop), T4 and T5 (generated media), plus the Define-phase glue.

## Not verified or unread

- Technique 7 and anything after it in the post: paywalled, unread.
- Image and GIF content of the post was not viewed; descriptions rely on the text and captions. Before/after quality claims are the author's.
- Whether the post gives a seed-string length or exact shell command: not in the public text.
- Whether the Substack note on 2026-09-04 and other X posts contain further prompts: only the first lines were visible.
- Model names in the post (e.g. "Fable 5", "GPT-5.6 Sol", "Seedance 2.5") are as written by the author; I did not verify them or their costs.
- No independent evidence that seed strings or critic loops improve UI design; paper evidence is on text benchmarks.

## Sources

- https://www.lennysnewsletter.com/p/how-to-turn-your-ai-into-a-world (read 2026-10-13; public portion through Technique 6)
- https://anshuc.substack.com/p/to-get-great-design-at-half-the-price (read 2026-10-13)
- https://substack.com/@anshuc (read 2026-10-13)
- https://x.com/anshuc (read 2026-10-13)
- https://pub.sakana.ai/ssot/ (read 2026-10-13)
- https://arxiv.org/abs/2510.21150, v3 full text (read 2026-10-13)
- https://mikareyes.com/ai/8-ai-design-techniques-to-break-safe-mode (search snippet only, 2026-10-13; unread)
- `~/.claude/skills/emil-get-creative/SKILL.md`, `emil-unslop-design/SKILL.md`, `emil-ui-polish/SKILL.md`, `emil-ui-review/SKILL.md`, `emil-prototype/SKILL.md`, `emil-prep-for-prod/SKILL.md`
- GLOSSARY.md in the repo root; issues #1 and #6

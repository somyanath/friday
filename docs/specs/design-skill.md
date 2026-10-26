# Design skill

**Status:** decided (2026-10-26) in [What does Friday's design skill do in each phase and at each gate?](https://github.com/somyanath/friday/issues/15). Nothing here is built yet.

The Playbook every UI Route goes into (ADR-0009). A Surface runs the full process: Discover, Define, Deliver, with the Variant gate and the Ship gate. A Refinement runs the Refinement path. It follows Anshu Chimala's seven techniques ("How to turn your AI into a world-class designer") and keeps his order: four seeded designs are built and improved before Somya looks at anything, and Somya's eye comes in to pick and to cut (ADR-0010).

- **Name:** a `friday-` skill; the exact name is set at build time.
- **Started by:** `/friday` only, or Somya typing it. `/friday` does the restate and the checks before a Surface starts (a Verification skill exists, no other Fleet running), and asks Somya to switch to Opus 5.5 for a Surface.
- **Session:** a Surface runs in an Opus 5.5 session that plans and orchestrates. A Refinement runs on Sonnet 5.5. Opus plans and comes up with ideas; Sonnet builds.

## Rules it states

From the [skill rulings](skill-rulings.md#what-other-friday-pieces-receive):

- Emil first, after Somya's decisions and the project's rules (ADR-0008). Emil's skills are picked through `emil-ask-emil` and `emil-prototype`'s loadout, one or two at a time.
- Reduced motion follows `animation-accessibility`.
- Lapse is never committed.
- Only one of `emil-animations` and `animate` loads per task.
- Words users read go through `emil-unslop-writing`.
- The Critic uses Emil's review standards as its craft bar.
- Builders list conflicts with their Direction in the Handoff.
- Every disagreement between two Emil skills goes into the Decision trail.
- The Design language is written with `emil-design-system-docs`, plus motion rules and, for a page that pitches something, voice rules the skill supplies.

## A Surface at a glance

| Step | Who | Anshu |
|---|---|---|
| 0. Restate | `/friday`, Opus; Somya corrects | none |
| 1. Discover: idea list, strike, seed draw, four Directions, "do they differ?", research | Opus, a script, Sol, Sonnet | Techniques 1 and 2 |
| 2. Define: four Variants built, critiqued, given images, checked | Sonnet and Sol Builders, other-family Critics | Techniques 1 (build), 3, 4 |
| 3. Variant gate, round 1: shortlist | Somya | He picks one design for video |
| 4. Video for shortlisted Variants with a video moment | Opus writes prompts; Somya makes clips in Flow | Technique 5 |
| 5. Variant gate, round 2: final pick and cut list | Somya | none |
| 6. Deliver: cut, AI tells, polish, identity check, prep for production, Design language, proof | Sonnet, Opus, Sol | Techniques 6 and 7 |
| 7. Ship gate | Somya merges | none |

## Technique by technique

Each of Anshu's techniques, what Friday does for it, and why it differs. Steps with no technique are Friday's own.

**Before Discover (no technique).** The restate: Somya corrects the goals, messages, proof points and fixed constraints before any work starts.

**Technique 2, ambitious prompts and idea lists** (Discover). Anshu: (1) ask for as many broad ideas as possible; (2) visualise your favourites, note your reaction, and have the AI sharpen one with your likes and dislikes; (3) iterate, then have it write a prompt to build a first page. Try ideas that sound terrible.

- His step 1 is the **idea list**: Opus, about 50 ideas, odd ones kept. It becomes the concept menu for the seeds, not a list Somya picks from.
- His steps 2 and 3, where you steer one idea, become **Somya's own concepts** at the restate, each taking one seed's concept slot. Somya's reactions come at round 1, on built pages.
- His build prompt becomes the **Direction** and the **Builder prompt**.
- Friday adds the **strike**: Opus removes ideas and menu options that break hard rules, and lists them.

**Technique 1, seed strings** (Discover, then Define's build). Anshu: four sessions each (1) generate a long random string with a shell script, (2) define the creative direction (colour, layout, type) from the string, and (3) use judgment to bring it to life. "Don't reveal the string in the design."

- His step 1 is the **seed draw**: a script makes four strings of 64 characters.
- His step 2 is split in two. The **script** picks every slot by arithmetic on the string, from fixed menus, with no repeats. Then **four Opus helpers** each write a Direction from its picks, with no swaps. The writers see the picks, never the string, so it can't leak into the design.
- His step 3 is Define's **build**.
- Friday adds **"do they differ?"** (Sol) and **research** per Direction (Sonnet, `emil-get-creative` Phase 1).
- Why it differs: in the hand run, agents reading their strings made four copies of one idea, and script picks gave four distinct ones, which is the String Seed of Thought paper's method.

**Technique 3, the critic loop** (Define). Anshu: a builder improves each page while a separate, stronger critic in a fresh context sees only a screenshot, names the aesthetic, imagines how a top studio would do it, lists the biggest gaps and scores out of 10. Stop at 9; start with one or two rounds. Opus 5 builds, Fable 5 critiques, on all four seeded pages.

- All four Directions are built at once as **Variants**, two by Sonnet and two by Sol, behind shuffled letters.
- **Critic rounds:** the other family critiques, in a fresh context, from screenshots at two sizes plus the Surface, Direction and research rules. Five-layer rubric, whose third layer is Anshu's own questions. Stop at 9, at most 3 rounds.
- **Final check** after the images, by Astra or Opus.
- Why it differs: Fable isn't on Pro, so "a stronger critic" becomes "the other family"; rounds are capped for usage limits; the rubric adds fit to the Surface and Direction, and Emil's craft. His ranking against four professional examples waits for a reference library.

**Technique 4, images** (Define). Anshu: "The design is pretty plain. Add more personality using image generation", then check the result frame by frame, on all four pages.

- The **image step** after the Critic rounds: the Builder decides where, up to 3 images through Codex `$imagegen`, or none with a reason. Rubric layer 5 judges them, and the final check runs after.
- Friday adds each Builder's **self-check and Live check**, and the **Handoff**.
- Why it differs: a cap of 3, since Codex runs out first.

**Technique 5, video** (between the Variant gate's rounds). Anshu: on one design he picked, either a looping animated graphic cut from its background, or transitions between keyframes scrubbed by scroll, with the agent calling a video API.

- His pick of one design becomes **Variant gate round 1**: blind, a shortlist of one or two, a combination, or "none".
- The Builder names each Variant's **video moment**, and Somya confirms it in the round-1 notes.
- **Opus writes two Flow prompts** per shortlisted Variant with a video moment; Somya makes the clips by hand, and each clip becomes a Finalist.
- **Round 2** is the final pick.
- Why it differs: two clips per Variant and a second round (Somya's call), made by hand for the budget, and skipped where a page has no place for a clip.

**Technique 6, cut** (Deliver). Anshu: his trained eye lists what adds nothing, and he asks for it gone. "The model needs a push from you."

- Somya's **cut list** goes in the round-2 notes, and Deliver's step 2 makes the cuts.

**Technique 7, remove AI tells** (Deliver). Paywalled; its summary lists generic compositions, perfect symmetry, a stock look, over-styling and clutter.

- Deliver's step 3: `emil-unslop-design` on the page and `emil-unslop-writing` on the words, keeping the voice. Opus names its own cuts, listed for Somya at the Ship gate.
- Earlier too: Builders use `emil-unslop-design` from the first build, and the Critic's fourth layer scores AI tells every round.

**After Technique 7 (Friday's own).** Deliver's polish, identity check, prep for production, Design language and proof; the Ship gate; the Refinement path, which uses one Critic pass (Technique 3) and the AI-tell passes (Technique 7) on what changed; and projects whose UI predates Friday.

## Restate

`/friday` restates the Surface before any Fan-out, and Somya corrects it. For a Surface it holds:

- **What it is, who it's for, and its kind:** a page that pitches something (a landing or marketing page, or a section of one), an app screen, or another page (such as a docs page or a post template). The kind picks the layout menu and whether content slots are drawn.
- **The messages,** by weight, each stated as what it means, not as copy.
- **The proof points.**
- **Fixed constraints,** such as "the ending is contact" or "no pricing".
- **Optional, from Somya:**
  - concepts of their own, each taking one seed's concept slot;
  - a lock on any slot, such as "taste must lead";
  - exact words, such as a headline or tagline, which then appear word for word on all four.
- **The lead and main proof menus** (pitch pages), written from the messages and proof points, confirmed here.
- **Menu options struck** for this Surface (see Strike).

## Discover

Discover ends with four Directions and no gate: every Direction goes on to Define. Files go in `~/.friday/gates/<project>/<surface>/discover/` from the first write, and move to Friday's private repo at the Ship gate.

1. **Idea list** (Opus). As many broad ideas as it can, about 50, with a line each: metaphors, media, interaction models. Ideas that sound odd stay in (Anshu: try ideas that sound terrible). This is the concept menu.
2. **Strike** (Opus). Removes only ideas and menu options that break this Surface's hard rules: accessibility, the project's rules, the fixed constraints, or a banned AI tell as the whole idea (such as the gradient hero). It lists what it struck; Discover doesn't stop for it.
3. **Seed draw** (a script, no model).
   - Draws 4 random strings of 64 characters.
   - Cuts each string into equal pieces, one per slot, skipping locked slots. Each piece's character codes are added up; the remainder over the menu's size picks the option.
   - **No repeats:** seeds are drawn in order, and an option already taken moves to the next free one down the menu. A menu with fewer options than seeds (such as three messages) repeats only once it runs out.
   - Assigns two seeds to each model family at random and shuffles the letters. The mapping goes in the private sidecar (ADR-0005).
   - Saves strings, picks and the arithmetic, so any pick can be re-checked.
4. **Four Directions** (four separate Opus helpers at `high`, one per seed). Each writes its Direction from its picks:
   - the idea, the look, the signature moment, how it says each message, and the ending;
   - for a pitch page, the headline and one line per message, in the drawn voice. Each message keeps its meaning and gets its own words. Facts stay exact (numbers, names, commands, contact details), and words Somya gave stay word for word;
   - no slot swaps: the writer makes the drawn pairing work.
5. **"Do they differ?"** One Sol call reads the four Directions and their headlines. A pair it calls alike gets the later seed redrawn and rewritten, once.
6. **Research** (one Sonnet per Direction). `emil-get-creative` Phase 1, read by path, at most 4 web lookups: the process behind the look, named patterns, and 5 to 10 rules. Its generator phases aren't used. An asset that comes back close but not right after a round of re-asking goes to `emil-build-a-tool`.

**"None" later sends Discover round again:** same restate and idea list, four fresh seeds, concepts already used skipped, and Somya's round-1 notes given to the Direction writers. After a second "none", Friday stops and asks Somya to name a concept.

## Slot menus

Fixed, approved by Somya once (here), editable any time. The concept menu is each Surface's idea list; the lead and main proof menus come from its restate. Each option is a kind of choice; the Direction writer turns it into exact values. Gate records show which options get picked or rejected, so the menus can be pruned and grown over time.

| # | Palette | Type | Page layout | Motion |
|---|---|---|---|---|
| 1 | Dark ground, one saturated signal colour | Huge Swiss grotesk | Single horizontal scroll | Scroll-scrubbed sequence |
| 2 | Cyanotype: Prussian blue and white | Monospace throughout | Strict asymmetric Swiss grid | Typing or terminal replay |
| 3 | Primary blocks: red, yellow, blue, black | High-contrast serif display | One pinned scene that changes on scroll | Physics: falls, stacks, collides |
| 4 | Earth: olive, rust, clay, bone | Slab serif or wood type | Long single text-led column | Hard cuts, no easing |
| 5 | High-key pastels on white | Expressive variable display face | Broken grid, collage | Lines drawing themselves |
| 6 | Black and white only | Condensed industrial sans | Split screen, two halves | A live comparison wipe |
| 7 | Phosphor neon on near-black | Hand lettering over a neutral sans | Dense panels, many small modules | Slow ambient drift |
| 8 | Riso overprint: fluorescent pink and teal | Pixel or bitmap face | Full-bleed bands in sequence | Almost none: one moment only |
| 9 | One hue in many tints | Geometric Bauhaus sans | A canvas of cards you pan around | Springy, tactile response to the pointer |
| 10 | Safety orange and concrete grey | Old-style book serif, text-led | One giant word or object the page is built around | Stop-motion, frame by frame |
| 11 | Jewel tones on a deep ground | Rounded, friendly sans | The table of contents is the page | Kinetic type: words rearrange themselves |
| 12 | Metallic: silver, graphite, chrome | Stencil or blackletter accent | Overlapping layers with depth | Morphing: one shape turns into another |

**App-screen layout** (used instead of page layout for an app screen):

1. Sidebar, list and detail
2. Command palette first, almost empty screen
3. One focused column, one task at a time
4. Board of cards in columns
5. Spatial canvas
6. Dense spreadsheet-like table
7. Phone-first with bottom tabs
8. Timeline or conversation stream

**Content slots** (pitch pages only):

- **Lead:** the message the page opens with. Menu: the restate's messages.
- **Main proof:** the proof point the page is built around. Menu: the restate's proof points.
- **Voice:** how the words sound.
  1. Dry engineer's log
  2. Confident manifesto
  3. Quiet and understated
  4. Playful
  5. Plain-spoken teacher
  6. Short poetic lines
  7. Technical spec sheet
  8. Personal letter

Every page still carries every message and every fixed constraint. The content slots change what leads and what gets the spotlight, never what's left out.

"Warm cream paper with one accent colour" is left out on purpose: it's the fallback the hand run kept landing on.

## Define

A Fleet of four Variant sessions in Superset, orchestrated by the Opus session (ADR-0003). Each Direction becomes one Variant: two built by Sonnet 5.5 (`high`) in Claude Code, two by GPT-6.1 Sol (`high`) through `codex exec -s workspace-write` inside a Sonnet host session. All four run at once, with two waves as the fallback if Pro can't hold it. Branches are `variant/<surface>/<letter>`, never pushed; ports 4110 to 4140.

**The Builder prompt** (written by Opus) is minimal: the restated Surface, the Direction, its research rules, the project's rules and the Handoff checklist. No style guidance beyond these, since a rich brief drowns out the seed. On a pitch page the Builder writes the rest of the copy in the drawn voice.

Each Variant, in order:

1. **Build,** with Emil's building skills and `emil-unslop-design` from the start.
2. **Critic rounds.** The Critic is from the other family: Sol for Sonnet's Variants, Opus 5.5 (`medium`) for Sol's. A fresh context each round, seeing:
   - screenshots at 1440×900 and 390×844, first screen and full page;
   - the restated Surface, the Direction and its research rules;
   - no code and no earlier critiques.

   It scores out of 10 against a rubric set once per Surface, with the same prompt every round:

   1. **Fit to the Surface:** does it serve the audience and goals? Does each message's meaning come across (not its exact words)?
   2. **Fit to the Direction:** its picks, brief, research rules and named patterns.
   3. **The studio bar (Anshu):** name the aesthetic, picture how a top studio would make this Direction for this page, list the biggest gaps in structure and in detail.
   4. **Emil's craft:** `emil-ui-review` as the method, the specialists for what's on screen (picked through `emil-ask-emil`), and `emil-unslop-design` for AI tells.
   5. **Generated images** (from the round after the image step): do they add personality, match the palette and type, and avoid a stock look and clutter?

   The Builder stops at 9 or above, a number kept out of the Critic's prompt. At most 3 rounds. Motion isn't judged from stills; Somya judges it at the gates and in Deliver.
3. **Image step.** The Builder decides where images add personality, writes the prompts and makes them with Codex `$imagegen`. Up to 3, or none with a reason in the write-up.
4. **Final check:** GPT-6 Astra for Sonnet's Variants, Opus for Sol's. A fail gets one more fix round; after that the Variant goes to the gate flagged, with the open points.
5. **Self-check and Live check.** `emil-ui-review` on its own work, then one Live check: the route loads, no console errors, the main interaction works, screenshots at the fixed sizes. Sol Variants' host sessions run it, since Codex can't launch a browser. A failed Live check is fixed or the Variant is dropped with a reason.
6. **Handoff** (ADR-0005): letter, branch, frozen commit, worktree, Superset workspace, port, run command, URLs, the Direction, a write-up of at most 150 words, screenshots, the images, check results. The write-up names the Variant's **video moment**, or says "none" and why, and lists conflicts with the Direction.

If Codex runs out mid-Define, Opus critiques the Sonnet Variants: the same family, noted in the sidecar, but better than stopping.

## Variant gate

The gate step is one swappable command over the round's folder (ADR-0005); on day one it is a local comparison page, Superset windows, and the pick asked in the terminal. The family reveal follows each round's pick, in the sidecar and the terminal. Friday cleans up after each round once it reads the Gate record.

**Round 1** (four Variants, blind). Somya's Gate record is one of:

- **A shortlist of one or two.** The notes confirm or override each one's video moment. If no shortlisted Variant has one, this is the final pick, and it goes to Deliver.
- **A combination** (counts as one). Somya marks parts with "take this" element notes. Opus writes a short combined brief from the notes, naming the base: the Variant whose structure is kept. The base's Builder builds it as the next free letter (`variant/<surface>/e`, branched from the base). It gets a Critic loop from the other family (up to 2 rounds), the final check and a Live check, then carries on like any shortlisted Variant.
- **None:** a new Discover (see Discover).

**Video.** For each shortlisted Variant with a video moment, Opus writes two different Flow prompts: a looping animated graphic, or a transition between two states. Somya makes each clip in Google Flow (Veo 3.1 Quality, 20 credits per 5-second clip, about 80 of the 1,000 monthly credits per Surface). Each clip is built into its own Finalist (`a-1`, `a-2`), which gets a Live check; its Handoff adds the prompt and the clip.

**Round 2.** Two to four Finalists; a shortlisted Variant with no video moment enters as it stands. Somya's Gate record is:

- **The final pick, with a cut list:** what adds nothing and should go (Technique 6).
- **None,** with notes saying which kind:
  - **the clips are wrong:** two new prompts and new clips, once; if those fail too, the Variant goes on with no video;
  - **the design is wrong:** round 1 reopens with every Variant and combination, since their branches still exist. "None" there means a new Discover.

## Deliver

Sonnet builds on `surface/<surface>`, orchestrated by the Opus session; the Verifier is Sol. In order:

1. **Start** from the final pick, with its clip.
2. **Somya's cuts,** from the final pick's notes (Technique 6).
3. **AI tells** (Technique 7): `emil-unslop-design` on the page, then `emil-unslop-writing` on the words, keeping the page's voice. Opus also reviews for AI tells and names its own cuts; Sonnet makes them, and they're listed for Somya at the Ship gate.
4. **Polish:** `emil-ui-polish`, then the floors: `emil-touch-and-accessibility`, `emil-mobile-native`, `emil-performance`, `animation-accessibility`.
5. **Identity check:** one Critic pass (Sol) with the Surface's rubric. Cutting and polishing can sand a design's identity off; a lower score than the final pick's is flagged at the Ship gate.
6. **`emil-prep-for-prod`:** the last sweep for defects, not taste.
7. **Design language.** If the final values aren't named tokens yet, Sonnet makes them tokens first, since `emil-design-system-docs` needs them. It then writes the Design language, and the skill adds:
   - motion rules: durations, easings, what moves, reduced motion;
   - for a pitch page, a short voice section: the voice and what each message means.
8. **Proof and PR:** a Live check, the Verdict command (other family) posting the `verdict` check on the head commit, screenshots of the changed states at both sizes, and a screen recording. The Agent account opens a PR labelled `ui-work`.

**The Design language** lives in the project beside the code (`DESIGN.md` at the root, or a docs folder for a bigger system), one per app. A Surface that is a section adds its own part. It's a Pause path, so it changes only with Somya's sign-off. It holds the project's own rules, nothing of Friday's.

## Ship gate

**Handoff,** in two parts, since projects are public:

| Where | What |
|---|---|
| The PR (public) | What changed, in plain words; screenshots at 1440×900 and 390×844; the screen recording; the Live check and Verdict results; prep-for-prod's list of what needs a real device or a human; the Design language changes |
| A private note in the Surface's gate folder | Opus's AI-tell cuts with before and after screenshots; the identity check's score against the final pick; disagreements between Emil's skills, from the Decision trail |

**Gate record:**

- **Ship:** Somya approves the PR as code owner and merges it in GitHub or Superset's PR pane. No agent merges UI work (ADR-0007). The Surface's gate folders move to Friday's private repo.
- **Not yet,** with notes saying which kind:
  - **fixable:** Sonnet runs a fix round from the notes, repeating the Deliver steps the fix touches, and comes back to the Ship gate. After two fix rounds that don't land, Friday stops and talks it through with Somya;
  - **the wrong pick:** the Variant gate reopens (round 2 with the other Finalist, or round 1 with every Variant), and Deliver reruns on the new pick.

## Refinement path

UI work whose look is already decided. One Sonnet 5.5 session; the Verifier and Critic are Sol.

1. `/friday` restate, an issue first, and the branch `refinement/<issue>-<slug>`.
2. **Read first:** the Design language, including its voice section, or, where none exists, screenshots and styles of the look already shipped; and that Surface's Gate records.
3. **Do the job:**
   - **new behaviour:** build it with Emil's building skills;
   - **a bug:** `friday-debugging`: reproduce it on the running app and commit the failing repro first;
   - **"which feels better?":** `friday-prototype`, handing off to `emil-prototype`, builds versions behind a live picker, and Somya picks in the browser;
   - **jank:** `emil-performance` or `debug-animation`.
4. **Emil's passes on what changed:** `emil-unslop-design` and `emil-unslop-writing` (keeping the page's voice), `emil-ui-polish`, the floors, and an `emil-ui-review` self-check.
5. **One Critic pass** (Sol): does it fit the Design language, or the shipped look, and Emil's craft bar? Up to 2 fix rounds. Skipped for a bug whose fix restores the intended look, such as the wrong blue.
6. **Proof:** a Live check, a Verdict, before and after screenshots at both sizes, and a screen recording when motion or interaction changed.
7. A PR labelled `ui-work`, then the Ship gate, and Somya merges.

Two rules on top:

- If the job turns out to need a new look, it stops and goes back to `/friday` as a Surface.
- If it needs a new Design language rule, it proposes the edit in the same PR for Somya's sign-off.

## Projects whose UI predates Friday

They have no written Design language, so Refinements follow the look already shipped.

- **At switch-on,** if the project has design tokens, Friday offers to write the Design language from them with `emil-design-system-docs`, for Somya to sign off. Somya can say no, and without tokens it's skipped.
- **Otherwise** the first Surface's Deliver writes it, covering that Surface. The rest of the app follows the look already shipped until it's written down.

## Cost

- One Discover by hand cost about 5% of Claude's weekly limit, with Sonnet writing the Directions. Opus now writes the idea list and the Directions, so expect more.
- Define's cost is unmeasured; the first real Surface logs it in the usage log.
- At most 12 images per Surface through Codex, which runs out first. The caps (3 images, 3 Critic rounds) are starting numbers, revisited from the usage log.
- About 80 Flow credits per Surface, a little over 12 Surfaces a month.

## Left for later

- **Anshu's best Critic** ranks the screenshot against four professional examples. That needs a reference library Friday doesn't have.
- **Tuning the menus** from Gate records, as part of how Friday improves itself.

---
name: Project Umbra
description: A dark signal-analysis publication for disclosed security research.
colors:
  bg: "#101112"
  fg: "#f1f1ed"
  muted: "#a8aaa9"
  text: "#c7c9c7"
  line: "#3c3e3f"
  panel: "#191b1c"
  crit: "#ff8074"
  high: "#ffb16c"
  med: "#e3cb79"
  low: "#a0c5ef"
  info: "#b7b9b8"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(54px, 6.6vw, 96px)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(32px, 3.2vw, 44px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(30px, 2.8vw, 42px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  reading:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.75
  identifier:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
spacing:
  gutter: "clamp(22px, 4.4vw, 72px)"
components:
  text-link:
    textColor: "{colors.fg}"
  main-navigation:
    textColor: "{colors.muted}"
  main-navigation-current:
    textColor: "{colors.fg}"
  severity-critical:
    textColor: "{colors.crit}"
  research-record-hover:
    backgroundColor: "{colors.panel}"
  inline-code:
    backgroundColor: "{colors.panel}"
    padding: "3px 5px"
  code-sample:
    padding: "22px"
---

# Design System: Project Umbra

## Overview

**Creative North Star: "Signal-analysis publication"**

A signal-analysis publication: charcoal, chalk, condensed headings, open research rows, and precise SVG rays. The interface gives disclosed findings and readable evidence the strongest visual weight. Dark mode is a binding brand commitment; severity provides the only semantic color scale.

The system is flat and restrained. Horizontal rules organize records, a narrow navigation column supports long reading, and small metadata stays secondary to titles and technical prose. The existing Umbra mark remains paired with a text wordmark.

**Key Characteristics:**

- Charcoal and chalk structure with readable severity colors.
- Condensed display type; open, unboxed research records.
- A shared reading grid with contents navigation and technical prose.
- Precise decorative SVG geometry and brief, optional motion.

Source of truth: [global stylesheet](src/styles/global.css), [shared layout](src/layouts/Base.astro), [index](src/pages/index.astro), [About](src/pages/about.astro), and [advisory reader](src/pages/advisories/[...slug].astro). The implemented world follows the opening contract in the shared layout. [PRODUCT.md](PRODUCT.md) supplies the binding dark-mode and existing-mark commitments; the [redesign brief](.impeccable/redesign-brief.md) supplies context, not replacement tokens.

## Colors

The palette is charcoal and chalk, with neutral tonal separation and a severity scale. Frontmatter values correspond directly to the stylesheet's same-named custom properties.

### Primary

- **Chalk (`fg`)** supplies headings, active navigation, links, focus outlines, and the signal ray.
- **Severity** uses coral (`crit`), apricot (`high`), ochre (`med`), pale blue (`low`), and silver (`info`). These communicate Critical, High, Medium, Low, and Info, respectively; they are semantic indicators rather than a general accent palette.

### Neutral

- **Charcoal (`bg`)** is the page canvas; **raised charcoal (`panel`)** supplies row interaction feedback, inline code, and blockquotes.
- **Reading gray (`text`)** carries summaries and prose; **secondary gray (`muted`)** carries dates, labels, targets, and inactive navigation.
- **Rule gray (`line`)** divides surfaces and supplies resting link underlines.

**The Severity Rule.** Color reinforces a written severity label; it never carries severity alone.

## Typography

**Display font:** self-hosted Barlow Condensed with Arial Narrow and sans-serif fallbacks. **Body font:** self-hosted Barlow with system-ui and sans-serif fallbacks. **Technical font:** ui-monospace, SFMono-Regular, Consolas, monospace.

The condensed face gives titles density without compressing the reading text. The hierarchy is fluid rather than a fixed modular scale; the frontmatter records shared heading defaults, with surface-specific overrides in the stylesheet. Fonts use `font-display: swap`; the layout preloads the condensed semibold and regular body files. Font files and licenses live in [public/fonts](public/fonts).

- **Display:** shared first-level headings. The index uses an uppercase variant, while About and advisory titles use natural case.
- **Headline / title:** section headings and advisory-row titles. Reading prose uses smaller fixed heading sizes; the disclosure-list label uses body type instead of display type.
- **Body / reading:** the body default supports navigation and general content; the reading role opens the line height for technical text. About prose is slightly larger on wide screens. Technical prose is capped at (74ch); About paragraphs at (68ch).
- **Identifier / label:** monospace is reserved for identifiers, dates, and code. Definition-list labels remain in the body face. Dates use a smaller monospace size (12px in research rows).

**The Reading Rule.** Use condensed type for headings, Barlow for prose, and monospace for technical strings.

## Layout

The shared wrapper has a maximum width of (1512px), automatic horizontal margins, and the fluid gutter token. The stylesheet uses local spacing values rather than a global spacing scale; do not infer one from coincidentally similar values.

Research rows use a wide grid of title/target, summary/identifier, date/severity, and action. Long-form pages share a grid with a navigation column (180–240px), a reading column capped at (780px), and a fluid gap (48–120px). Local navigation is sticky at (28px) on wide screens. The global header remains in normal flow.

Responsive rules are explicit:

- At **1180px and below**, research rows become three columns with the action below; the reading grid uses a (190px) navigation column and (48px) gap.
- At **800px and below**, the home introduction and reading grid become one column. Research titles and date/severity occupy the first row, summaries span the next, and actions follow. About navigation becomes a wrapping row; advisory navigation becomes a two-column in-flow block. Advisory facts become two columns.
- At **520px and below**, research records stack title, metadata, summary, and action. Advisory local navigation becomes a block, team names and roles stack, and the footer becomes one column. Body and technical prose reduce to (17px).
- At **1600px and above**, the decorative signal moves inside the introduction's right edge.

Preserve all dates, identifiers, summaries, and written severity labels as the layout changes. Code blocks and tables handle their own horizontal overflow; prose and identifiers can wrap. Images stay within the reading column.

## Elevation & Depth

There are no box shadows. Depth comes from neutral contrast, one-pixel rules, and the panel tone appearing behind a hovered or keyboard-focused research row. Inline code and blockquotes use that same panel tone. The decorative signal has no glow or blur.

**The Flat Surface Rule.** Separate publication content with spacing, rules, and tonal feedback; preserve open surfaces.

## Shapes

The interface uses square edges with no radius token. Borders are thin structural rules. Severity markers are small squares (6px). Direction icons use rounded SVG stroke caps and joins, while the signal combines arcs, rays, and a small circular intersection marker. These geometric details are native to the world; square content surfaces do not imply a ban on circles or curves.

The existing raster mark is cropped within a small viewport beside a semantic text wordmark. [Signal.astro](src/components/Signal.astro) and [Arrow.astro](src/components/Arrow.astro) define the decorative vector language. Both hide their SVG from assistive technology; meaningful action names remain in text.

## Components

### Navigation

Public contact details are intentionally omitted. Do not add contact navigation, email addresses, or mailto links to rendered pages. About contains the mandate, disclosure policy, and team.

The main navigation uses muted body text and a chalk hover/current state. The current location has a short horizontal underline and `aria-current`; the header's main links and wordmark provide at least (44px) height. Navigation remains visible on mobile without a menu drawer. The footer repeats practical links in smaller body text.

The shared layout provides a focus-revealed skip link targeting the single main landmark. Visible keyboard focus is a chalk outline (2px), offset by (6px). Fragment destinations have scroll spacing; the main target suppresses its container outline while retaining focusable descendants' visible focus.

### Text links

Text actions are native anchors, usually with an underline and an inline SVG direction arrow. Resting underline color is subdued; hover raises it to chalk. Common action links have at least (44px) height. Prose links remain underlined. Team profile links use the condensed face and gain an underline on hover; a team member with no supplied profile remains plain text.

### Research records

A semantic article contains one native link spanning the record. Its accessible name comes from the heading. Rules separate records; hover and focus reveal a full-gutter panel tint. The action arrow shifts (4px) to the right on hover. Background/opacity/arrow transitions take (0.2s) with `ease`. Metadata retains a readable severity word and machine-readable date. The empty state is an ordinary text message within the same section.

### Severity and facts

Severity is a colored word with a square marker, without a pill or badge container. The five source values map directly to the five severity tokens. Advisory facts use definition lists divided by rules; they reorganize from four to two columns on smaller screens.

### Local contents and technical prose

Advisory contents links are generated from second-level Markdown headings, keeping the navigation aligned with the rendered article. About has fixed anchors to its visible sections. These navigation elements move into normal flow on smaller screens.

Technical prose includes ruled code blocks, panel-backed inline code and blockquotes, and horizontally scrollable tables. Code samples receive `tabindex="0"`, `role="region"`, and the accessible label `Code sample` through [accessible-code.mjs](src/plugins/accessible-code.mjs), configured in [astro.config.mjs](astro.config.mjs); keyboard focus makes horizontal code overflow reachable. Preserve the global visible-focus treatment. Inline code is smaller than prose; block code retains its own line height and size. No input, button, dialog, or card library is implemented.

### Signal illustration and motion

The decorative signal belongs to the home introduction. Its ray reveals once using a (1s) clip-path animation and `cubic-bezier(.16, 1, .3, 1)`. Essential content is visible without animation. The reduced-motion media query disables all animations and transitions and uses automatic scrolling. Do not treat the illustration as a data chart or a required ornament on every surface.

## Do's and Don'ts

### Do:

- **Do** preserve dark mode and the existing Umbra mark.
- **Do** keep severity readable as text alongside its color.
- **Do** preserve semantic headings, native links, dates, definition lists, and generated contents anchors.
- **Do** keep focus visible, code samples keyboard reachable, and reduced motion respected.
- **Do** reuse the shared reading grid and responsive record order.

### Don't:

- **Don't** use severity colors as unrelated brand accents.
- **Don't** introduce shadows, rounded card shells, or ornamental textures into these flat publication patterns.
- **Don't** replace technical prose with display type or set body text in monospace.
- **Don't** hide essential content behind animation or turn the decorative signal into an invented data chart.

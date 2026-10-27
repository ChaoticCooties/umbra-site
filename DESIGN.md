---
name: Project Umbra
description: A dark, ruled disclosure archive where the advisories do the talking.
colors:
  ground: "#0d0e0f"
  panel: "#141517"
  row-hover: "#17181a"
  ink: "#dcdad5"
  text: "#c4c2bd"
  muted: "#8f8d88"
  rule: "#26282a"
  rule-strong: "#3a3c3e"
  sev-critical: "#ff8a7a"
  sev-high: "#ffb877"
  sev-medium: "#e6cf7a"
  sev-low: "#a3c4ee"
  sev-info: "#b0aeaa"
  code-keyword: "#eeece7"
  code-punctuation: "#a9a7a2"
  code-string: "#bdae92"
typography:
  page-title:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  post-title:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.2vw, 34px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  section-heading:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.3
  subheading:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
  summary:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
  row-title:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
  secondary:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  section-nav:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
  mono-fine:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12.5px"
    fontWeight: 400
  code-block:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  none: "0px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  wrap: "1256px"
  column: "760px"
  reading-gap: "48px"
  row-y: "18px"
  section: "48px"
  footer-gap: "96px"
components:
  register-row:
    textColor: "{colors.ink}"
    padding: "18px 16px 18px 0"
  register-row-hover:
    backgroundColor: "{colors.row-hover}"
  severity-mark:
    backgroundColor: "{colors.sev-critical}"
    size: "7px"
    rounded: "{rounded.none}"
  inline-code:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    padding: "1px 5px"
    rounded: "{rounded.none}"
  code-block:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    typography: "{typography.code-block}"
    padding: "16px 18px"
    rounded: "{rounded.none}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.secondary}"
    height: "44px"
  nav-link-active:
    textColor: "{colors.ink}"
  section-nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.section-nav}"
    padding: "6px 0 6px 14px"
  section-nav-link-active:
    textColor: "{colors.ink}"
  cvss-score:
    textColor: "{colors.ink}"
  cvss-vector:
    textColor: "{colors.muted}"
    typography: "{typography.mono-fine}"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    padding: "10px 16px"
---

# Design System: Project Umbra

## Overview

**Creative North Star: "The Ruled Register"**

The site is the dated register that security researchers already read: a list of advisories, newest first, and behind each row a well-set post. Every surface is near-black ground, warm off-white text, and 1px rules. Nothing is decorated. The findings carry the weight, so the frame stays quiet: no hero, no big display type, no cards, no filters, no pills.

Density is that of a reading list, not a dashboard. One sans family at two weights does all the talking. A monospace face appears only where a reader compares characters: dates, identifiers, and code. The only hue on any page is a 7px severity square, and the code theme is near-monochrome with one sand string color.

The system rejects the corporate security vendor look (advisory tables with filter bars, colored severity pills, gradients, shield imagery) and anything flashy.

**Key Characteristics:**

- Dark only. There's no light theme and no theme toggle.
- Flat and ruled: hierarchy comes from 1px rules, weight, and the muted tone, never from fills, shadows, or radius.
- Severity is the only hue, as a small square beside an achromatic word.
- Mono is limited to dates, identifiers, and code.
- Reading pages center one 760px column, with prose at 18px across its full width; the header, archive, and section nav share the wrap's left edge.

## Colors

A warm achromatic dark palette, with hue reserved for severity and a single sand tone for code strings.

### Primary

The system has no brand accent. Off-White Ink carries emphasis, links, focus, and selection.

### Neutral

- **Shadow Ground**: the page background on every surface, and the `theme-color`.
- **Inset Panel**: the background of code blocks and inline code; the only surface that differs from the ground.
- **Row Hover**: the hover tint of a register row. It's barely above the ground on purpose.
- **Off-White Ink**: headings, titles, row subjects, strong text, metadata values, links in running text, the focus outline, and the selection fill.
- **Reading Gray**: body prose, row ledes, About paragraphs, and the default code text. One step below ink, so headings separate from prose without size jumps.
- **Muted Stone**: labels, table headers, dates and identifiers in the register, the breadcrumb, inactive navigation, footer text, list markers, and blockquotes.
- **Hairline Rule**: every structural line, including the header and footer borders, register rows, metadata blocks, the table of contents, and code borders.
- **Strong Rule**: link underlines at rest, blockquote edges, the active-nav underline, and the scrollbar thumb.

### Severity

- **Critical Coral**, **High Apricot**, **Medium Straw**, **Low Sky**, and **Info Gray**: fill the 7px severity square only. The word beside the square stays in ink.

### Code

- **Keyword Bone**: keywords, slightly brighter than ink.
- **Punctuation Gray**: punctuation, between reading gray and muted.
- **Sand String**: strings and string expressions. It's the only warm hue in code.

Functions, constants, and links in code use ink; parameters use reading gray; comments use muted.

### Named rules

**The Severity Is the Only Hue Rule.** Outside code strings, the only chromatic color on a page is the 7px severity square. Don't use severity hues for text, fills, borders, badges, row tints, or code tokens.

**The Ink Emphasis Rule.** Emphasis is a step up the gray scale (muted to reading gray to ink), not a color. Links are ink with a strong-rule underline that brightens to ink on hover.

**The Dark Only Rule.** The site declares `color-scheme: dark` and ships one palette. Don't add a light theme or a `prefers-color-scheme` branch.

## Typography

**Body font:** Source Sans 3 (variable, self-hosted, with `system-ui` and `sans-serif` fallbacks)
**Mono font:** JetBrains Mono 400 (self-hosted, with `ui-monospace`, SFMono-Regular, Menlo, and `monospace` fallbacks)

**Character:** A plain, warm humanist sans set at reading sizes, with a narrow technical mono that appears only where exact characters matter. Both faces ship as Latin `woff2` subsets with their OFL licenses in `public/fonts/`; the sans is preloaded.

All text uses weights 400 and 600 only. The body sets `font-variant-numeric: tabular-nums` so dates and counts align.

### Hierarchy

- **Page title** (600, 30px, 1.2; 26px under 760px): the H1 of the archive and About, with one muted sentence under it.
- **Post title** (600, `clamp(28px, 3.2vw, 34px)`, 1.2): the advisory H1. It's the largest type on the site.
- **Section heading** (600, 22px, 1.3): H2 in advisory prose and on About.
- **Subheading** (600, 18px): H3 in advisory prose.
- **Summary** (400, 18px, 1.6, ink): the advisory summary under the metadata block, across the full column.
- **Body** (400, 18px, 1.7, reading gray): advisory prose and About paragraphs, across the full 760px column with no character cap. The UI body is 17px at 1.6.
- **Row title** (600, 17px, 1.4, ink): the advisory title in a register row.
- **Secondary** (400, 15px): row ledes, metadata blocks, the table of contents, navigation, and the year line (at 600).
- **Section nav** (400, 14px, 1.4, muted): entries in the sticky section nav, under a 13px muted title.
- **Label** (400, 13px, muted, sentence case): table column headers and the table-of-contents heading. No uppercase, no tracking.
- **Mono** (400, 13–13.5px): dates, CVE and other identifiers, and the reference URL. CVSS vectors run at 12.5px (mono fine). Inline code runs at 0.84em; code blocks at 13.5px with a 1.65 line height.

### Named rules

**The Mono Means Exact Rule.** JetBrains Mono appears on dates (`time`), identifiers, reference URLs, CVSS vectors, and code, and nowhere else. Labels, headings, navigation, and severity words stay in the sans.

**The No Display Type Rule.** No size exceeds 34px, and no condensed, all-caps, or tracked display face appears. Titles get their weight from 600 and their position, not from scale.

## Layout

Every page sits in one wrap: a 1256px maximum with a fluid gutter of `clamp(20px, 4vw, 48px)` on each side. The 1256px is the reading grid's sum: a 200px section nav, a 48px gap, the 760px column, a 48px gap, and a 200px empty margin. The header, the archive page heading and register, the section nav, and the footer all start from the wrap's left edge.

- **Archive register:** the page heading (52px above, 36px below), then one section per year. Each section opens with a year line ("2026 · 3 advisories") over a hairline rule, then a fixed-layout table with Date (128px), Severity (112px), Subject (fluid), and Identifier (220px) columns. Rows have 18px of vertical padding and a hairline bottom rule. Year sections are 48px apart.
- **Reading pages (advisory and About):** a three-column grid of `1fr`, the 760px column, and `1fr`, with 48px gaps. The text column sits centered in the middle track. The section nav sits in the left track, starts 40px down, and sticks 32px from the viewport top; the right track stays empty. Every block in the column (breadcrumb, title, metadata block, summary, table of contents, prose, code blocks, tables, and older and newer links) uses the column's full width, so prose and code share both edges exactly. Prose blocks are 18px apart, H2s get 48px above, and H3s get 32px above.
- **About:** the same column and section nav, with sections separated by a hairline rule and 28px of vertical padding.
- **Footer:** 96px below the content, behind a hairline rule.

Below 1240px, the section nav is hidden, advisories show the in-flow table of contents instead, and the column (760px plus gutters) centers alone.

Under 760px, the register drops its header row and each row becomes a grid: date at the left and severity at the right on line one, the subject and lede across line two, and identifiers inline and comma-separated on line three. The metadata label column narrows to 92px, the table of contents collapses to one column, and the older and newer links stack. Code blocks stay inside the column at every width; they never bleed to the screen edge.

### Named rules

**The Shared Frame Rule.** The header, archive, section nav, and footer start from the wrap's left edge. On reading pages, the 760px column is the only centered element, and every block inside it shares the column's left and right edges. Narrower caps (the 68ch page heading and the 60ch row lede) trim from the right; they never re-center.

**The Wide Column Rule.** Prose runs at 18px with a 1.7 line height across the full 760px column. The site owner chose this wider body over a 68ch measure. Don't reintroduce a character cap on prose, or a code-block bleed, without their call.

## Elevation & Depth

The system is flat. There are no shadows, gradients, blurs, or layered surfaces. Depth comes from two things only: the inset panel tone behind code, and the faint row-hover tint. Structure comes from 1px hairline rules.

### Named rules

**The Rules Not Boxes Rule.** Group content with horizontal 1px rules above and below, never with an enclosing card, a fill, or a shadow. The only boxed elements are code blocks and inline code.

## Shapes

Every corner is square (0px radius). Lines are 1px; the only 2px line is the focus outline. The single recurring geometry is the 7px severity square. The one icon is a 16px line arrow (left, right, and external) on a 24-unit grid, drawn at a 1.5 stroke with round caps and joins in `currentColor`.

## Components

### Archive register row

The signature component. The whole row is the link: the title anchor stretches over the row with an absolutely positioned `::after`, so the row is one target. The date and identifiers are muted mono at 13px, the severity is a severity mark, and the subject is a 600 ink title over a one-line lede in 15px reading gray (max 60ch).

- **Lede source:** the optional `lede` frontmatter field drives the row line. When an advisory has no `lede`, the row falls back to the first sentence of `summary`.
- **Identifier fallback:** when an advisory has no CVE or identifier, the cell shows its vulnerability class in the sans.
- **Hover:** the row background shifts to row hover over 0.15s, and the title gains a strong-rule underline.
- **Focus:** a 2px ink outline inset on the whole row replaces the anchor's own outline.

### Severity mark

A 7px square in the severity hue, 8px before the severity word, which stays in ink. It's used in the register and the advisory metadata block. An unknown severity falls back to Info Gray.

### Advisory metadata block

A definition list between two hairline rules: a 112px muted label column (92px under 760px) and an ink value column at 15px. It shows Date, Affected, Class, Severity, CVSS, Identifiers, and Reference. Dates, identifiers, and the reference URL are mono at 13.5px. Long values wrap anywhere, but each identifier stays whole on one line.

- **CVSS row:** driven by the optional `cvss` frontmatter list (`cve`, `version`, `score`, and `vector`), with one line per entry, 6px apart. Each line shows the score to one decimal at 600 in ink, then the CVE and version in muted, then the vector on its own line in muted mono at 12.5px. The row is absent when an advisory has no `cvss`.

### Table of contents

Shown only below 1240px, when an advisory has more than one H2; at 1240px and wider, the section nav replaces it. It sits between hairline rules and has a 13px muted heading, "In this advisory," followed by a two-column numbered list in reading gray (one column under 760px). Links turn ink and underline on hover.

### Section nav

A sticky list of the page's H2s in the left track of the reading grid, shown at 1240px and wider. Advisories show it when they have more than one H2, titled "In this advisory"; About always shows it, titled "About Umbra." A 13px muted title sits over a list with a 1px hairline left rule. Entries are muted at 14px with 6px × 14px padding and turn ink on hover.

- **Current section:** the last heading scrolled past (within 120px of the viewport top) gets `aria-current="location"`. The entry turns ink, and a 1px ink rule overlays the hairline beside it.

### Code

- **Block:** inset panel background, 1px hairline border, square corners, 16px × 18px padding, horizontal scrolling. Blocks span the column exactly, flush with prose on both edges. Each block is a keyboard-focusable region labeled "Code sample."
- **Inline:** inset panel, 1px hairline border, 1px × 5px padding, ink text at 0.84em.
- **Theme:** Shiki `css-variables`, mapped to the code colors.

### Navigation

- **Header:** a 64px bar over a hairline rule. The cropped Umbra mark (18 × 21px) and "Project Umbra" at 600 and 16px sit at the left; Archive and About sit at the right, 28px apart. Links are muted at 15px and turn ink on hover. The current section is ink with a strong-rule underline offset 6px. Advisory pages mark Archive as the current location.
- **Breadcrumb:** a muted "Archive" link with a left arrow above each advisory title.
- **Older and newer:** two columns over a hairline rule. Each has a muted 14px direction label with an arrow over a 600 ink title at 16px; the newer link aligns right.
- **Footer:** muted 14px links (Project Umbra, Archive, Disclosure policy, and Team) that turn ink on hover.
- **Targets:** header, footer, and breadcrumb links hold a 44px minimum height.

### Links in running text

Ink, with a 1px strong-rule underline offset 3px. On hover, the underline turns ink.

### Skip link

Ink fill with ground text, 10px × 16px padding, hidden above the viewport until focused.

## Do's and Don'ts

### Do:

- **Do** use Shadow Ground for every surface, and keep the site dark only.
- **Do** show severity as a 7px square beside the achromatic severity word.
- **Do** separate groups with 1px hairline rules above and below.
- **Do** set dates, identifiers, and code in JetBrains Mono, and everything else in Source Sans 3 at 400 or 600.
- **Do** set prose at 18px and 1.7 across the full 760px column, with code blocks and the post header on the same two edges.
- **Do** write a `lede` for each advisory so its register row reads as one deliberate line.
- **Do** make the whole register row the link, with one inset focus outline.
- **Do** keep code near-monochrome, with Sand String as the only hue.
- **Do** keep every interactive target at least 44px high.

### Don't:

- **Don't** use severity hues as text color, fills, badges, pills, borders, or row tints.
- **Don't** add cards, shadows, gradients, rounded corners, or a hero.
- **Don't** use display type above 34px, or condensed, uppercase, or tracked display faces.
- **Don't** use mono for labels, headings, navigation, or severity words.
- **Don't** add filter bars, sort controls, or tag pills to the register.
- **Don't** add a light theme or a theme toggle.
- **Don't** center anything but the reading column, or let a block inside it (code included) break the column's edges.
- **Don't** add icons other than the line arrow.

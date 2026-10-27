---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/about.astro","src/pages/advisories/[...slug].astro"]
---

# Umbra redesign: disclosure list archive

Scope: index, advisory pages, About, shared header and footer. Mode: Read. Code-led.
User brief (2026-10-28): the previous world felt too loud; let the vulnerabilities do the talking. Dark only. Avoid corporate security vendor looks and anything flashy.
Chosen card: IMPECCABLE'S PICK, Disclosure List Archive (sketch `.impeccable/mocks/decision/model-pick.html`).

## Direction contract

THESIS: The ledger as the archive researchers already read: a dated register of advisories, each one a well-set post. Refuses the hero, big display type, and the vendor advisory table with filters and pills.
OWN-WORLD: Near-black #0d0e0f ground, warm off-white #dcdad5 text, muted #8f8d88, 1px #26282a rules. Source Sans 3 400/600 for all text; JetBrains Mono only for dates, identifiers, and code. Severity is a 7px square mark beside the word, never a fill or badge. No cards, shadows, gradients, or condensed display type.
STORY: A reader sees what Umbra has disclosed, newest first, with date, severity, subject, and identifier in one scan. They open a post, read its header block, then the write-up, and move to the previous or next advisory.
FIRST VIEWPORT: Thin header (mark, Project Umbra, Archive, About). H1 "Disclosure archive" at about 30px with one sentence under it. A year line "2026 · 3 advisories", then a ruled register: Date | Severity | Subject with a one-line summary | Identifier. The whole row is the link.
FORM: Disclosure List Archive, my top-ranked grounded candidate (1 of 7), chosen as the pick card. seed:663ee797c63355f3
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

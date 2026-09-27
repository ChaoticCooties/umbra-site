# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- Technical readers: vendors and maintainers checking an advisory about their code, other security
  researchers reading the write-up, and people cross-referencing CVE or pull-request identifiers.
- Reputation readers: peers, recruiters, and reviewers deciding whether Umbra is a serious research
  group. The site is the group's public calling card.

## Product Purpose

Project Umbra's public disclosure ledger. It lists vulnerabilities that Umbra found and reported
upstream, and publishes each coordinated-disclosure write-up once the vendor has had the chance to fix.
Success means a technical reader gets the facts (target, class, severity, identifier, fix) fast, and a
reputation reader leaves convinced the work is rigorous.

## Positioning

An independent research group that uses agentic LLM systems to find supply-chain and memory-safety
bugs, then discloses them under a strict coordinated-disclosure standard (90-day embargo). The ledger
shows only disclosed findings; nothing embargoed reaches the built site.

## Operating Context

- Astro static site, deployed to GitHub Pages at `umbra.cooties.io`.
- Advisories are markdown files in `src/content/advisories/` with validated frontmatter (title, vendor,
  product, class, severity, status, date, cve/identifier, link, summary).
- Only `status: Disclosed` entries build. Code blocks in advisories are common.
- Do not publish a contact email, mailto link, or contact section; the user requested their removal to reduce scraping.

## Capabilities and Constraints

- Pages: ledger index, per-advisory record, About (mandate, disclosure policy, team).
- Severity scale: Critical, High, Medium, Low, Info.
- The ledger has few entries (two at time of writing) and must still look deliberate when small.

## Brand Commitments

- Name: Project Umbra. Mark: `public/umbra.png`.
- Dark mode is binding. The user approved exploration of the rest of the visual identity on 2026-09-26; published research and rigor take priority. The current redesign uses a monochrome structure with severity colors.
- Voice: factual, terse, no hype.

## Evidence on Hand

- Two disclosed advisories: CVE-2026-6443 (WordPress EssentialPlugin backdoor, Critical) and
  CTranslate2 PR #2068 (heap overflows, High).
- Team: Eu Joe (model, evals, pipeline), Damien Wong (former; triage, manual review), Olivier Gagné
  (former; triage, manual review).
- No testimonials, press, bounty totals, or client lists exist. Don't fabricate them.

## Product Principles

1. The record is the product. Facts first, decoration never competes with them.
2. Rigor is shown, not claimed: identifiers, dates, fixes, and code carry the credibility.
3. Nothing embargoed ever ships.
4. Small is fine. Two entries must read as a curated record, not an empty list.

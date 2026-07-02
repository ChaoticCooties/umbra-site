# Umbra site

Static site (Astro) for Project Umbra: a black/white ledger of disclosed vulnerabilities plus an
About page. Each advisory is a markdown file; the index list and the detail pages are generated from
them. Deploys to `umbra.cooties.io`.

## Run

```
npm install
npm run dev        # http://localhost:4321
npm run build      # output -> dist/
npm run preview    # serve the build locally
```

## Add an advisory

Drop a markdown file in `src/content/advisories/`. Frontmatter (validated in `src/content/config.ts`):

```
title:    string
vendor:   string
product:  string            # optional
class:    string            # e.g. "Command Injection", "RCE", "XXE", "Access Control"
severity: Critical | High | Medium | Low | Info
status:   Draft | Reported | Triaged | Fixed | Disclosed
date:     YYYY-MM-DD
cve:        string          # optional; shown as the record identifier when present
identifier: string          # optional; identifier shown when there is no CVE (e.g. "PR #2068"). Falls back to an auto UMB-… id
link:       https://...      # optional external advisory / CVE; renders a "Full advisory" button
summary:  string            # one line, shown in the list
```

The markdown body is the public advisory text.

## Embargo / responsible disclosure

- Do not publish details before disclosure is coordinated.
- Only entries with `status: Disclosed` are included in either the ledger or generated advisory
  routes. `Draft`, `Reported`, `Triaged`, and `Fixed` content remains absent from the built site.
- Expand the public body and change the status to `Disclosed` only when publication is authorized.

## Deploy to GitHub Pages

The workflow at `.github/workflows/pages.yml` builds and deploys every push to `main`.
Repository Pages settings must use **GitHub Actions** as the source.

The public custom domain is `umbra.cooties.io`:

- `astro.config.mjs` sets `site: 'https://umbra.cooties.io'`.
- `public/CNAME` includes the domain in the built artifact.
- DNS must contain `CNAME umbra -> chaoticcooties.github.io`.
- Configure the repository Pages custom domain as `umbra.cooties.io`, verify DNS, then enable
  **Enforce HTTPS** once GitHub provisions the certificate.

## Design

Monochrome theme in `src/styles/global.css`: mono type, hover-invert ledger rows, severity colors
(Critical/High/Medium/Low). Flip `--bg`/`--fg` for a light variant.

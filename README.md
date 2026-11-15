# Umbra site

Static site (Astro) for Project Umbra: a dark research publication with disclosed advisories and an
About page. Each advisory is a markdown file; the index list and the detail pages are generated from
them. Deploys to `umbraproject.io`.

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
link:       https://...      # optional external advisory / CVE; renders an "External record" link
summary:  string            # one line, shown in the list
lede:     string            # optional; one line naming the mechanism, shown in the archive row (falls back to the summary's first sentence)
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

The public custom domain is `umbraproject.io`:

- `astro.config.mjs` sets `site: 'https://umbraproject.io'` for canonical and Open Graph URLs.
- `public/CNAME` names the domain; the GitHub Actions deployment also requires the repository's
  Pages custom-domain setting to be `umbraproject.io`.
- Cloudflare proxies apex and `www` CNAME records to `chaoticcooties.github.io`.
  `www.umbraproject.io` redirects to the apex.
- `umbra.cooties.io` is a Cloudflare-proxied redirect to the same path and query string at
  `https://umbraproject.io`, using a permanent 301.
- Cloudflare enforces HTTPS for visitors and provides the public certificate. A hostname-scoped
  configuration rule uses **Flexible SSL** for this public static site, as requested: the
  Cloudflare-to-GitHub connection uses HTTP. Keep GitHub Pages **Enforce HTTPS** off to avoid loops.
  Origin-generated directory redirects are rewritten to HTTPS before reaching the browser.
  The zone default stays **Full (strict)** for future hostnames. No Cloudflare Worker is involved.
- `gulp.umbraproject.io` is reserved as the intended future ingestion hostname and is not
  configured by this site migration.

## Design

The dark research publication uses self-hosted Barlow and Barlow Condensed, open research rows,
readable severity labels, and responsive advisory navigation. Design tokens and breakpoints live in
`src/styles/global.css`; shared geometry and arrows live in `src/components/`. Fonts and SIL Open Font
Licenses are bundled under `public/fonts/`. See `DESIGN.md` for the visual system.

Advisory contents navigation is generated from level-two Markdown headings. The About page exposes
the mandate, disclosure policy, and team without accordion controls. Public contact details are omitted.
Keep verified advisory
copy in the content collection; generated design mockups are visual references only.

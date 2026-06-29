---
title: "WordPress Backdoor"
vendor: "WordPress"
class: "Supply-chain backdoor"
severity: "Critical"
status: "Disclosed"
date: 2026-02-07
cve: "CVE-2026-6443"
link: "https://cooties.io/blog/project-umbra/"
summary: "Unauthenticated RCE — a backdoored plugin update added a public REST endpoint that fetches a remote payload and passes it to unserialize(), giving PHP object injection and code execution. CVSS 9.8, spanning the maintainer's entire plugin library."
---

A threat actor purchased the EssentialPlugin developer account — roughly 31 WordPress plugins with a combined 400,000+ installs — through a legitimate Flippa sale, then shipped a backdoor in routine version updates. The trust was at the distribution layer, not the code: each plugin kept its existing user base, update channel, and reputation.

The payload sat dormant for months before activating from attacker-controlled infrastructure. Once live it exposed an unauthenticated REST endpoint (`permission_callback: __return_true`) that pulled a remote payload, passed it to `unserialize()`, and executed it — unauthenticated remote code execution — while injecting SEO spam served selectively to crawlers.

Project Umbra flagged the malicious update in the **Accordion and Accordion Slider** plugin (v1.4.6) through contextual reasoning about the code's behaviour, not signature matching against known indicators. There was no CVE at the time. **CVE-2026-6443** (CVSS 9.8) was later assigned and covers the entire maintainer library; WordPress.org pulled all affected plugins.

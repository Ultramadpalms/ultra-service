# ULTRA AUTO 3.0 — HOME design experiment

Three working responsive previews, published separately from ultraserviceauto.ru:

- [A — Engineering Editorial](https://ultra-auto-3-design-lab-20261019.madpalms.chatgpt.site/a/)
- [B — Premium Automotive](https://ultra-auto-3-design-lab-20261019.madpalms.chatgpt.site/b/)
- [C — Conversion First](https://ultra-auto-3-design-lab-20261019.madpalms.chatgpt.site/c/)

Owner-private preview hosting. Forms only validate locally; no CRM, mail, analytics or storage. No production changes and no merge. The existing root dist remains untouched.

## Source distinction

This repository's original root dist is an older static prototype, not the current Joomla production site. The experiment is based on current rendered HOME content, real live assets and retained Joomla template source, captured under source-reference. PHP byte identity with the current server cannot be confirmed through public GET. This is an isolated working UI experiment, not a deployable Joomla replacement. See source-reference/manifest.json and content-ledger.json.

Read-only audit: HOME; Zeekr, Li Auto, Voyah, Geely; Zeekr 001 and 9X; two Zeekr 001 services. 9 URLs × 360/390/430/1440. All 200, one H1/canonical, no page overflow. Live form/menu opening and closing checked at all four widths without submission.

Preview QA: 3 concepts × 4 widths. Menu/Escape/focus restoration, local form validation, symptom/model context, FAQ, photo dialog, sticky behavior, 500px viewport, links and content contracts. No JS page errors. axe-core 4.10.3: zero automatic WCAG A/AA violations on the 390px preview sample; manual/background contrast and screen reader checks remain limited. All 18 linked live destinations returned HTTP 200.

Live issues observed: hidden menus/lightbox with focusable descendants; invalid rating ARIA on HOME; many image elements without intrinsic attributes; mobile HOME lab CLS around .13 in three unthrottled runs; real repair proof below the first screen. No claims of measured conversion uplift.

Recommendation: A as visual direction; explore C's compact symptom chooser in the next approved iteration. B is the more immersive automotive alternative.

## Run

Serve this directory's dist with a static HTTP server as the root (absolute asset paths). No framework/build dependencies. Open /a/, /b/, /c/. PLAN.md records palette, layout and constraints. asset-manifest.json records asset origins and captured SHA-256.

The test scripts retain the execution session's Windows runtime and workspace paths. They document the actual checks and require path adaptation on another machine. checks/ contains their results. Source generation consumed a captured live DOM rather than recreating the CMS from memory.

Rollout to shared HOME/BRAND/MODEL/SERVICE components requires owner approval, a fresh Joomla source/database comparison, coordination with SEO, existing handler testing through a test transport, and a new regression pass. Do not deploy this experiment over production.

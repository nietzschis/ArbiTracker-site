# CLAUDE.md — ArbiTracker website

Static site for **https://arbitracker.app**, served by GitHub Pages from `main` / root of this (public) repo. The app itself lives in `../MetricTree` (its own CLAUDE.md); this repo holds only the website.

## Files
- `index.html`: the landing page, pyramid style: hero (rotating example, Play + Guide buttons) → Collect / Understand cards (details behind "More") → the app demo → two kinds of curious (tabs) → extras → private strip → closing.
- `script.js`: rotating example, tabs, and the **app demo** ("Setup measurement(s)" next to the node's entry card, rebuilt live). It copies the app's look (`themes.xml` colours, `ObservationFormView` rows, type names Number/Boolean/Text/Timestamp/Category): when the app's entry card or setup changes, update the demo.
- `guide.html`: the step-by-step guide (expandable steps). Names of buttons and menus must match the app.
- `privacy.html`: privacy policy. Its URL (`https://arbitracker.app/privacy.html`) is given in Play Console, so **never rename or move it**.
- `style.css`: shared styles; colours follow the app (sky blue `#0284C7` / dark `#38BDF8`, slate, green accent). Light + dark via `prefers-color-scheme`.
- `images/`: icon and wordmarks resized from `../MetricTree/icons` and the app's `drawable-nodpi` / `drawable-night-nodpi` wordmarks.
- `CNAME`: the custom domain for GitHub Pages; keep it.

## Rules
- Plain HTML + CSS + our own JS, no build step, no frameworks, no outside scripts, fonts, embeds or analytics (the privacy policy promises no tracking; the user doesn't want ads).
- Text is light: bangers first, details behind `<details>` "More". Nobody reads walls of text.
- **The privacy policy must match the app.** Today: no INTERNET permission, no account, analytics or ads; data only on the device; Android Auto Backup is on (`allowBackup=true`). When the app changes any of that (ads, sync, accounts), update `privacy.html` and its date **before** that version ships.
- Example wording on the site: examples in lower case and single quotes, mixing familiar and imaginative ones ('sleep', 'bird sightings').
- Public repo: never commit keystores, app bundles or anything private.

## DNS (simply.com)
Apex `arbitracker.app`: A records 185.199.108.153 / .109.153 / .110.153 / .111.153; `www`: CNAME to `<github-user>.github.io`. `.app` is HTTPS-only, so "Enforce HTTPS" must be on in Pages settings.

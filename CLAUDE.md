# CLAUDE.md — ArbiTracker website

Static site for **https://arbitracker.app**, served by GitHub Pages from `main` / root of this (public) repo. The app itself lives in `../MetricTree` (its own CLAUDE.md); this repo holds only the website.

## Files
- `index.html`: the landing page: hero (headline = the differentiator, "Free. No agenda…", until launch "Try it here ↓" (to the demo) + "Coming soon to Google Play" as a plain label; on launch day the Play badge/link goes in) → "Not another habit app" (vs typical trackers, no competitor names, claims kept fair) → Collect / Understand with real screenshots (details behind "More") → the app demo → extras → Free + private → closing → contact (also top bar, floating button, footer). Each point is made once; don't repeat a claim across sections. Open Graph tags + `images/og-image.png` for link previews.
- **Free promise (public):** collecting, organising, reminders, random check-ins and export are "free, and always will be"; analysis tools are "free too" (no "always": Pro is undecided). Never change the first part.
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

## Contact
Public address: `contact@arbitracker.app` (forwarded by ImprovMX; MX + SPF TXT records at simply.com). Never put the inbox it forwards to on the site or in this public repo.

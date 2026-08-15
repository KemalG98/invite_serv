# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page mobile "invitation" mini-site (Russian text) sent as a link: welcome → question → success screens, with a "No" button that evades taps and a "Yes" button that triggers confetti. Vanilla HTML/CSS/JS, no build step, no backend, no package.json.

## Commands

Local preview:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` (test with a phone or browser device toolbar — this is mobile-first).

There is no build, lint, or test tooling in this repo. Verify changes by loading the page in a browser (see the `run` skill / browser tooling for automated checks, e.g. Playwright, if deeper verification is needed).

Deploy: push to GitHub, enable Pages on the deployed branch (root folder). See README.md for full steps.

## Architecture

Three files, all at repo root:
- `index.html` — three `<section class="screen">` elements (`#welcome-screen`, `#question-screen`, `#success-screen`), plus the canvas-confetti CDN `<script>` (pinned version + SRI hash) before `script.js`.
- `script.js` — screen switching via `showScreen(el)`, which toggles an `.active` class; all "No" button evasion logic; the "Yes" → confetti handler.
- `style.css` — `.screen` is `display: none` by default, `.screen.active` shown via flexbox. Mobile tap-target sizing, gradient background, keyframe animations (`popIn`, `pulse`, `floatBounce`).

### The "No" button

`moveNoButton()` in `script.js` repositions `#no-btn` to a random `position: fixed` location on every click/touchstart, cycles through `noTexts` deflection phrases, and shrinks it slightly per click down to a `NO_BTN_MIN_SCALE` floor (kept high enough to preserve a tappable target).

**Non-obvious gotcha:** `.card` has a `transform`-based animation (`popIn`). Per the CSS spec, an element with an active transform animation becomes the containing block for `position: fixed` descendants. Since `#no-btn` starts inside `.card`, tapping it during the ~0.5s popIn window would resolve its `fixed` coordinates against `.card`'s box instead of the real viewport, launching it off-screen. The fix (see `.superpowers/sdd/no-button-containing-block-fix-report.md`) is that `moveNoButton()` reparents `#no-btn` to `document.body` (once, guarded) *before* it's ever fixed-positioned — do not move that reparent step or reintroduce a transform animation on an ancestor of `#no-btn` without accounting for this. Also note `#no-btn` is hidden via `noBtn.style.display = "none"` on reaching the success screen, since it now lives directly under `<body>` rather than inside the screen that's being hidden.

### Design intent (see `docs/superpowers/specs/2026-06-30-date-invite-design.md`)

- No image/audio assets by design — emoji + CSS only, for instant mobile load.
- No outbound link on the success screen (intentionally out of scope).
- `touchstart` (with `preventDefault`) is the primary handler for the "No" button, with `click` as a desktop fallback — both are wired since this ships as a mobile link but gets tested on desktop too.

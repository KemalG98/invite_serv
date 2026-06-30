# Date Invite Mini-Site — Design

## Purpose
A single-page mobile-first "invitation" site sent via Telegram link. Recipient
goes through 3 screens: welcome → question → success. The "No" button evades
taps/clicks; "Yes" leads to a celebratory final screen with confetti.

## Stack
Vanilla HTML + CSS + JS, no build step, no backend. Deployed as static files
(GitHub Pages). One external dependency: canvas-confetti via CDN `<script>` tag.

## Assets
No image/audio files. All visual flourish comes from CSS animations and emoji
(❤️ 🐱 🥺 💔) — avoids broken links, keeps the page lightweight, loads instantly
on mobile data.

## File structure
```
date-invite/
├── index.html
├── style.css
└── script.js
```

## Screens
1. **Welcome** (`#welcome-screen`, active by default) — greeting text + "Продолжить" button.
2. **Question** (`#question-screen`) — "Кристя, давай будем обниматься и не отпускать друг-друга даже на секундочку?" + pulsing animated cat emoji + Yes/No buttons.
3. **Success** (`#success-screen`) — "Урааа ❤️" message + confetti burst, no outbound link (per decision, no Telegram link on this screen).

Screen switching: `.screen` hidden by default, `.screen.active` shown via a
`showScreen(el)` helper that clears `.active` from all screens and sets it on
the target.

## "No" button behavior
- Click/touchstart handler moves the button to a random position within
  viewport bounds (`position: fixed`, clamped so it never overflows the
  screen).
- Cycles through a list of cute deflection phrases each time it's pressed
  (`Нет 💔` → `Точно нет? 🥺` → `Подумай ещё 😭` → ...).
- After ~5 presses, shrinks slightly via a CSS scale transform — but clamped
  to a minimum size (e.g. `scale(0.85)` floor) so it never becomes too small
  to tap, preserving usability on a touchscreen.
- Uses `touchstart` (with `preventDefault`) as the primary handler for mobile,
  with a `click` fallback for desktop testing.

## "Yes" button behavior
- Continuous gentle pulse animation (`@keyframes pulse`) to draw attention.
- On click: switches to success screen and fires `confetti()` from the
  canvas-confetti CDN library.

## Mobile-first CSS
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` required.
- `.card` capped at `max-width: 420px`, `width: 90%`, centered via flexbox.
- Buttons: `min-height: 48px`, `font-size: 18px` for comfortable tap targets.
- `overflow: hidden` on body to prevent scroll/jank while the "No" button
  jumps around.
- Background: soft pink gradient (`linear-gradient(135deg, #ffe1ec, #fff5f8)`).

## Deployment
Static site, no build step. Target: GitHub Pages from this repo's `main`
branch. After implementation, provide exact steps (create repo, push, enable
Pages in repo settings) and the resulting `https://<user>.github.io/date-invite/`
link.

## Out of scope
- No backend, no analytics, no music/audio file.
- No image/gif assets — emoji + CSS only.
- No outbound Telegram link on the success screen.

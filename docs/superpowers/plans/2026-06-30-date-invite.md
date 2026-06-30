# Date Invite Mini-Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3-screen, mobile-first static invitation page (welcome → question → success) with an evasive "No" button and a confetti-celebrating "Yes" button, deployable to GitHub Pages with zero build step.

**Architecture:** Single static page (`index.html` + `style.css` + `script.js`), no framework, no backend. Screens are `<section>` elements toggled via a shared `active` class. One CDN dependency (canvas-confetti) loaded via `<script>` tag.

**Tech Stack:** Plain HTML5, CSS3 (flexbox, keyframe animations), vanilla JS (DOM APIs, `touchstart`/`click` listeners). No npm, no bundler.

## Note on verification approach

This project has no backend logic and no unit-testable functions in the
classic sense — it's DOM/CSS behavior. "Tests" in each task below are
concrete, repeatable checks: `grep` assertions against file content for
structural correctness, plus a manual visual/interaction check using a local
static server (`python3 -m http.server`) and a browser. Do the grep check
first (fast, scriptable); do the manual check before marking the task done.

## Global Constraints

- No build step — files must run by opening `index.html` directly or via a static file server.
- Mobile-first: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is mandatory in `index.html`.
- No external image/audio assets — all visuals are CSS/emoji only.
- Buttons: `min-height: 48px; font-size: 18px;` minimum tap target size.
- `.card` capped at `max-width: 420px; width: 90%;`.
- No outbound Telegram link on the success screen (per spec decision).
- Repo root: `/home/proger/date-invite`.

---

### Task 1: HTML scaffold + base mobile CSS

**Files:**
- Create: `/home/proger/date-invite/index.html`
- Create: `/home/proger/date-invite/style.css`

**Interfaces:**
- Produces: three screen sections with IDs `welcome-screen`, `question-screen`, `success-screen`, each with class `screen`; buttons with IDs `start-btn`, `yes-btn`, `no-btn`; a `.card` wrapper class; a `.screen.active` visibility convention that Task 2/3 JS relies on.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Важный вопрос ❤️</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <main class="app">
    <section class="screen active" id="welcome-screen">
      <div class="card">
        <h1>Привет, малышка ❤️</h1>
        <p>У меня есть к тебе важный вопрос...</p>
        <button id="start-btn">Продолжить</button>
      </div>
    </section>

    <section class="screen" id="question-screen">
      <div class="card">
        <div class="hero-emoji" id="hero-emoji">🐱</div>
        <h2>Кристя, давай будем обниматься и не отпускать друг-друга даже на секундочку?</h2>
        <div class="buttons">
          <button id="yes-btn">Да ❤️</button>
          <button id="no-btn">Нет 💔</button>
        </div>
      </div>
    </section>

    <section class="screen" id="success-screen">
      <div class="card">
        <div class="hero-emoji">🎉❤️🎉</div>
        <h2>Урааа ❤️</h2>
        <p>Я знал, что ты согласишься!</p>
        <p>Начинаем прямо сейчас!</p>
      </div>
    </section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <script src="./script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `style.css` (base + mobile layout, no animations yet)**

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  background: linear-gradient(135deg, #ffe1ec, #fff5f8);
  overflow: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen {
  display: none;
  width: 100%;
  padding: 20px;
}

.screen.active {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 90%;
  max-width: 420px;
  padding: 28px 20px;
  border-radius: 28px;
  background: white;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.card h1, .card h2 {
  margin-top: 0;
  color: #d6336c;
}

.hero-emoji {
  font-size: 56px;
  margin-bottom: 8px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

button {
  min-height: 48px;
  font-size: 18px;
  border: none;
  border-radius: 14px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
}

#start-btn, #yes-btn {
  background: #ff6b9d;
  color: white;
}

#no-btn {
  background: #f1f1f1;
  color: #555;
}
```

- [ ] **Step 3: Verify structure with grep**

Run:
```bash
grep -c 'class="screen' /home/proger/date-invite/index.html
grep -o 'id="[a-z-]*-btn"' /home/proger/date-invite/index.html
grep -c 'viewport' /home/proger/date-invite/index.html
```
Expected: first command prints `3` (welcome/question/success each have `class="screen` substring), second prints `id="start-btn"`, `id="yes-btn"`, `id="no-btn"`, third prints `1`.

- [ ] **Step 4: Manual check**

```bash
cd /home/proger/date-invite && python3 -m http.server 8000
```
Open `http://localhost:8000` in a browser (or device-toolbar mobile view). Confirm: only the welcome screen is visible, card is centered, no horizontal scrollbar, buttons are full width and tappable. Stop the server (Ctrl+C) when done.

- [ ] **Step 5: Commit**

```bash
cd /home/proger/date-invite
git add index.html style.css
git commit -m "Add HTML scaffold and base mobile CSS for 3 screens"
```

---

### Task 2: Screen-switching JS, Yes button, confetti

**Files:**
- Create: `/home/proger/date-invite/script.js`

**Interfaces:**
- Consumes: DOM IDs from Task 1 (`welcome-screen`, `question-screen`, `success-screen`, `start-btn`, `yes-btn`, `no-btn`), global `confetti()` function from the CDN script.
- Produces: `showScreen(screenEl)` function (used again by Task 3's "No" logic only indirectly — Task 3 does not call it, but must not redeclare `screen`/`questionScreen`/etc. consts, so Task 3 appends to this same file).

- [ ] **Step 1: Write `script.js` with screen elements, `showScreen`, and the Yes/Continue handlers**

```js
const welcomeScreen = document.getElementById("welcome-screen");
const questionScreen = document.getElementById("question-screen");
const successScreen = document.getElementById("success-screen");

const startBtn = document.getElementById("start-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
}

startBtn.addEventListener("click", () => {
  showScreen(questionScreen);
});

yesBtn.addEventListener("click", () => {
  showScreen(successScreen);
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
  });
});
```

- [ ] **Step 2: Verify structure with grep**

Run:
```bash
grep -c 'function showScreen' /home/proger/date-invite/script.js
grep -c 'confetti(' /home/proger/date-invite/script.js
```
Expected: both print `1`.

- [ ] **Step 3: Manual check**

```bash
cd /home/proger/date-invite && python3 -m http.server 8000
```
Open `http://localhost:8000`, click "Продолжить" → question screen appears. Click "Да ❤️" → success screen appears and confetti bursts on screen. Stop the server when done.

- [ ] **Step 4: Commit**

```bash
cd /home/proger/date-invite
git add script.js
git commit -m "Add screen switching, Yes button, and confetti"
```

---

### Task 3: Evasive "No" button

**Files:**
- Modify: `/home/proger/date-invite/script.js` (append to the file from Task 2)
- Modify: `/home/proger/date-invite/style.css` (append `#no-btn` transition rule)

**Interfaces:**
- Consumes: `noBtn` const from Task 2's `script.js` (already declared at top of file — do not redeclare).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Append the evasion logic to `script.js`**

```js
const noTexts = [
  "Нет 💔",
  "Точно нет? 🥺",
  "Подумай ещё 😭",
  "Ты уверена? 🥹",
  "Попробуй ещё раз 😏",
  "У тебя нет выбора ❤️",
];

let noClickCount = 0;
const NO_BTN_MIN_SCALE = 0.85;

function moveNoButton() {
  noClickCount++;

  noBtn.textContent = noTexts[noClickCount % noTexts.length];

  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 20;
  const maxY = window.innerHeight - rect.height - 20;

  const randomX = Math.max(10, Math.floor(Math.random() * maxX));
  const randomY = Math.max(10, Math.floor(Math.random() * maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  const scale = Math.max(NO_BTN_MIN_SCALE, 1 - noClickCount * 0.03);
  noBtn.style.transform = `scale(${scale})`;
}

noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

noBtn.addEventListener("click", () => {
  moveNoButton();
});
```

- [ ] **Step 2: Append the transition rule to `style.css`**

```css
#no-btn {
  transition: left 0.2s ease, top 0.2s ease, transform 0.2s ease;
}
```

- [ ] **Step 3: Verify structure with grep**

Run:
```bash
grep -c 'function moveNoButton' /home/proger/date-invite/script.js
grep -c 'NO_BTN_MIN_SCALE' /home/proger/date-invite/script.js
```
Expected: both print `1` (second one will print `2` since the constant is both declared and used — accept either `1` or `2`, just confirm it's present via `grep NO_BTN_MIN_SCALE script.js` showing both lines).

- [ ] **Step 4: Manual check**

```bash
cd /home/proger/date-invite && python3 -m http.server 8000
```
Open on a mobile viewport (browser dev tools device toolbar), navigate to the question screen, tap "Нет 💔" repeatedly. Confirm: button jumps to a new random position each tap, never goes off-screen or behind the card edge, text cycles through the phrase list, and after several taps the button visibly shrinks but stays tappable (not below ~85% size). Stop the server when done.

- [ ] **Step 5: Commit**

```bash
cd /home/proger/date-invite
git add script.js style.css
git commit -m "Add evasive No button behavior"
```

---

### Task 4: Decorative animations, polish, and deploy docs

**Files:**
- Modify: `/home/proger/date-invite/style.css` (append animations)
- Create: `/home/proger/date-invite/README.md`

**Interfaces:**
- Consumes: existing `.card`, `#yes-btn`, `.hero-emoji` selectors from Task 1.
- Produces: nothing consumed by later tasks (final task).

- [ ] **Step 1: Append animation rules to `style.css`**

```css
.card {
  animation: popIn 0.5s ease;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

#yes-btn {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

.hero-emoji {
  animation: floatBounce 2s ease-in-out infinite;
}

@keyframes floatBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
```

- [ ] **Step 2: Write `README.md` with deploy steps**

```markdown
# date-invite

Mobile invitation mini-site. Open `index.html` directly or serve statically — no build step.

## Local preview

\`\`\`bash
python3 -m http.server 8000
\`\`\`

Open http://localhost:8000 on a phone (or browser device toolbar).

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `date-invite`).
2. Push this repo:
   \`\`\`bash
   git remote add origin git@github.com:<username>/date-invite.git
   git push -u origin main
   \`\`\`
3. In the repo on GitHub: Settings → Pages → Source → select branch `main`, folder `/ (root)` → Save.
4. Wait a minute, then the site is live at:
   \`https://<username>.github.io/date-invite/\`
```

- [ ] **Step 3: Verify with grep**

Run:
```bash
grep -c '@keyframes pulse' /home/proger/date-invite/style.css
grep -c 'github.io' /home/proger/date-invite/README.md
```
Expected: both print `1`.

- [ ] **Step 4: Full manual mobile checklist**

```bash
cd /home/proger/date-invite && python3 -m http.server 8000
```
On a mobile viewport, walk the whole flow end to end and confirm every item:
- [ ] No horizontal scroll on any screen
- [ ] Buttons are comfortably tappable (not tiny, not overlapping)
- [ ] "Нет" button evades touch and never goes off-screen
- [ ] Text is legible at phone width (no overflow/clipping)
- [ ] Final screen fits without scrolling, confetti plays
- [ ] Page loads instantly (no broken asset requests in browser console/network tab)

Stop the server when done.

- [ ] **Step 5: Commit**

```bash
cd /home/proger/date-invite
git add style.css README.md
git commit -m "Add animations, polish, and deploy instructions"
```
